// 动态添加css样式
var dynamicLoading = {
  css: function (path) {
    if (!path || path.length === 0) {
      throw new Error('argument "path" is required !');
    }
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = path;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
  },
  js: function (path) {
    if (!path || path.length === 0) {
      throw new Error('argument "path" is required !');
    }
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = path;
    script.type = 'text/javascript';
    head.appendChild(script);
  }
}

dynamicLoading.css('../styles/list.css');

window.onload = function () {
  // 去掉container里的换行符
  var br = document.querySelectorAll('.container br')
  br.forEach(function (item) {
    item.remove()
  })
}
