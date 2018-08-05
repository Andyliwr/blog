// 动态添加css样式
var dynamicLoading = {
  css: function(path) {
    if (!path || path.length === 0) {
      throw new Error('argument "path" is required !')
    }
    var head = document.getElementsByTagName('head')[0]
    var link = document.createElement('link')
    link.href = path
    link.rel = 'stylesheet'
    link.type = 'text/css'
    head.appendChild(link)
  },
  js: function(path) {
    if (!path || path.length === 0) {
      throw new Error('argument "path" is required !')
    }
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.src = path
    script.type = 'text/javascript'
    head.appendChild(script)
  }
}
dynamicLoading.css('../styles/list.css')
// dynamicLoading.js('//fs.andylistudio.com/blog/js/v2/sweetalert2.all.min.js');
window.onload = function() {
  // 去掉container里的换行符
  var br = document.querySelectorAll('.container br')
  br.forEach(function(item) {
    item.remove()
  })
  // if (window.location.href.indexOf('/article') > 0) {
  //   swal({
  //     title: '随心而动',
  //     input: 'text',
  //     inputAttributes: {
  //       autocapitalize: 'off'
  //     },
  //     showCancelButton: false,
  //     confirmButtonText: '确认',
  //     showLoaderOnConfirm: true,
  //     allowEscapeKey: false,
  //     allowOutsideClick: false
  //   }).then(result => {
  //     if (result.value === '随刃而行') {
  //       swal({
  //         type: 'success',
  //         title: '温馨提示',
  //         text: '您已经通过认证'
  //       });
  //     } else {
  //       swal({
  //         type: 'error',
  //         title: '温馨提示',
  //         text: '认证失败，即将返回首页',
  //         timer: 2000,
  //         onOpen: () => {
  //           swal.showLoading();
  //         }
  //       }).then(result => {
  //         if (
  //           // Read more about handling dismissals
  //           result.dismiss === swal.DismissReason.timer
  //         ) {
  //           window.location.href = '/';
  //         }
  //       });
  //     }
  //   });
  // }
}
