$(document).ready(function(){
    $('#access_password').keypress(function(event){
        var keynum = (event.keyCode ? event.keyCode : event.which);
        if(keynum == '13'){
            var pwd = $(this).val();
            $.ajax({
                method: 'GET',
                url: 'http://blogapi.andylistudio.com/access?pwd='+pwd,
                timeout: 10000,
                success: function(res){
                    console.log(res)
                },
                error: function(err){
                    console.log(err)
                }
            })
        }
    });
})