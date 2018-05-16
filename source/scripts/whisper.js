$(document).ready(function() {
  swal({
    title: '随心而动',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: false,
    confirmButtonText: '确认',
    showLoaderOnConfirm: true,
    allowEscapeKey: false,
    allowOutsideClick: false
  }).then(result => {
    if (result.value === '随刃而行') {
      swal({
        type: 'success',
        title: '温馨提示',
        text: '您已经通过认证'
      });
    } else {
      swal({
        type: 'error',
        title: '温馨提示',
        text: '认证失败，即将返回首页',
        timer: 2000,
        onOpen: () => {
          swal.showLoading();
        }
      }).then(result => {
        if (
          // Read more about handling dismissals
          result.dismiss === swal.DismissReason.timer
        ) {
          window.location.href = '/';
        }
      });
    }
  });
});
