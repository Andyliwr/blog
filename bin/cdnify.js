const qn = require('qn')
const fs = require('fs')
const path = require('path')
const replaceAll = require('replaceall')
const QINIU_ACCESS_KEY = 'pz1XaE-7IPSWuJjLTrjH3Rv9O5v0hj510O1ttMm6' // 牛账号的key值，https://portal.qiniu.com/user/key
const QINIU_SECRET_KEY = 'HB_zxxzxJ3YpKFAD3PC7egJvgx4yOp3t6Fg7xdYP'
const QINIU_BUCKET = 'upload' // 空间名称
const QINIU_CDN_DOMAIN = 'https://file.lantingshucheng.com' // cdn域名
const client = qn.create({
  accessKey: QINIU_ACCESS_KEY,
  secretKey: QINIU_SECRET_KEY,
  bucket: QINIU_BUCKET,
  origin: QINIU_CDN_DOMAIN
})
const promiseArr = []
const rootPath = path.join(__dirname, '../public/assets')
const now = Date.now()

/**
 * 七牛上传函数
 * @param {*} buffer 上传的buffer文件
 * @param {*} key 自定义路径
 */
function qiniuUpload (buffer, key) {
  return new Promise((resolve, reject) => {
    client.upload(buffer, { key }, function (err, result) {
      if (err) {
        console.log(err)
        reject(err)
        return
      }
      resolve(result.url)
    })
  })
}

// 是否为文件夹
function isDirectory (file) {
  return fs.statSync(file).isDirectory()
}

// 遍历文件夹
function deepTraverseDir (dir, cb) {
  if (!isDirectory(dir)) {
    return false
  }

  return fs.readdirSync(dir).forEach(file => {
    const pathUrl = path.join(dir, file)
    if (isDirectory(pathUrl)) {
      deepTraverseDir(pathUrl, cb)
    } else {
      cb(pathUrl)
    }
  })
}

deepTraverseDir(
  rootPath,
  (filePath) => {
    const fileName = filePath.replace(rootPath.replace('/assets', ''), '')
    const key = `${now}${fileName}`
    promiseArr.push(new Promise((resolve) => {
      qiniuUpload(fs.createReadStream(filePath), key).then(res => {
        resolve({ file: fileName, url: res })
      }).catch(() => {
        // 失败的就不替换了
        resolve({ file: fileName, url: '' })
      })
    }))
  }
)

Promise.all(promiseArr)
  .then(fileMap => {
    // 开始替换index.html中的链接
    const indexPath = path.join(__dirname, '../public')
    deepTraverseDir(
      indexPath,
      (filePath) => {
        if (filePath.indexOf('.html') > -1) {
          let content = fs.readFileSync(filePath, 'utf-8')
          fileMap.forEach(item => {
            content = replaceAll(item.file, item.url, content)
          })
          fs.writeFileSync(filePath, content)
        }
      }
    )
    console.log('上传并替换资源成功')
  }).catch(err => {
    console.log('上传资源失败, ' + err.toString())
  })
