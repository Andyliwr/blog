$(document).ready(function(){
    // 判断是否已经登录
    if(getCookie('token')){
      $('#no-login').hide()
      $('#has-login').show()
      getList(1, 10)
    }else{
      $('#no-login').hide()
      $('#has-login').show() 
    }
    $('#access_password').keypress(function(event){
        var keynum = (event.keyCode ? event.keyCode : event.which);
        if(keynum == '13'){
            var pwd = $(this).val();
            $.ajax({
                method: 'GET',
                url: 'http://blogapi.andylistudio.com/access?pwd='+pwd,
                timeout: 10000,
                success: function(res){
                    if(res.code === 0){
                        setCookie('token', res.token)
                        // 获取心声列表
                        getList(1, 10)
                    }else{
                        alert('密码错误, ' + res.msg)
                    }
                },
                error: function(err){
                    console.log(err)
                    alert('密码错误')
                }
            })
        }
    });
})

function setCookie(name,value)
{
    var Days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
    }else{
        return null;
    }
}

function getList(pagenum, limit){
    $.ajax({
        method: 'GET',
        url: 'http://blogapi.andylistudio.com/getlist?pagenum='+pagenum+'&limit='+limit,
        timeout: 10000,
        success: function(res){
            // 设置dom
            if(res.code === 0){
                let listHtml = ''
                res.lists.forEach(function(item){
                    listHtml += '<li><a class="title" href="item.link">'+item.title+'</a><span class="date">'+item.date+'</span></li>'
                })
                $('#has-login').html('<ul class="all-list">'+listHtml+'</ul>')
            }else{
                alert('获取心声列表失败')
            }
        },
        error: function(err){
            console.log(err)
        }
    })
}
