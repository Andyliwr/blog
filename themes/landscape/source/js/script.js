function findAndSigned (searchString, readyToBeSearch) {
  if (typeof searchString === 'string') {
    let regExp = new RegExp(searchString, 'igm');
    let leftStr = ''; //记录关键词左边的字符串
    let rightStr = ''; //记录关键词右边的字符串
    let count = 1; //计数器
    let tempStr = readyToBeSearch; //用于正则匹配的字符串
    let notChageStr = readyToBeSearch; //用于截取字符串，和上面一样的值是因为不能把一个值既用于正则运算又用于记录加入<code></code>的新的字符串,这样会使得循环变成无限循环
    let lastIndex = 0; //记录关键词的位置
    while (regExp.exec(tempStr) !== null) {
      lastIndex = regExp.lastIndex + 13 * (count - 1); //每次循环notChageStr并非不变，而是多了<code></code>共计13个字符，所以为了保证后续循环中lastindex的正确性应该将lastindex自增13
      leftStr = notChageStr.substring(0, lastIndex - searchString.length);
      rightStr = notChageStr.substring(lastIndex);
      notChageStr = leftStr + '<code>' + searchString + '</code>' + rightStr;
      count ++
    }
    return notChageStr;
  } else {
    console.log('The param of findAndSigned is error!....');
    return '';
  }
}
(function($) {
  /*toTop start*/
  // When to show the scroll link
  // higher number = scroll link appears further down the page
  var upperLimit = 1000;
  // Our scroll link element
  var scrollElem = $('#totop');
  // Scroll to top speed
  var scrollSpeed = 500;
  // Show and hide the scroll to top link based on scroll position
  $(window).scroll(function() {
    var scrollTop = $(document).scrollTop();
    if (scrollTop > upperLimit) {
      $(scrollElem).stop().fadeTo(300, 1); // fade back in
    } else {
      $(scrollElem).stop().fadeTo(300, 0); // fade out
    }
  });

  // Scroll to top animation on click
  $(scrollElem).click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, scrollSpeed);
    return false;
  });
  /*toTop end*/

  /* search start*/
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function() {
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback) {
    setTimeout(function() {
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('#nav-search-btn').on('click', function() {
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function() {
      $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function() {
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });
  // 监听搜索的change事件
  // $('.search-form-input').on('change', function() {
  //   let searchValue = $(this).val()
  //   $.ajax({
  //     method: 'GET',
  //     url: './content.json',
  //     dataType: 'json',
  //     timeout: 10000,
  //     success: function(res){
  //       if(res){
  //         // 检索post
  //         let postResult = []
  //         res.posts.forEach(function(item){
  //           let needingTitle = ''
  //           let needingText = ''
  //           if(item.title.indexOf(searchValue) > -1){
  //             needingTitle = findAndSigned(searchValue, item.title)
  //           }
  //           if(item.text.indexOf(searchValue) > -1){
  //             needingText = findAndSigned(searchValue, item.text)
  //           }
  //           postResult.push({
  //             title: needingTitle,
  //             text: needingText
  //           })
  //         })
  //         // 检索page
  //         let pageResult = [];
  //         res.pages.forEach(function(item){
  //           let needingTitle = ''
  //           let needingText = ''
  //           if(item.title.indexOf(searchValue) > -1){
  //             needingTitle = findAndSigned(searchValue, item.title)
  //           }
  //           if(item.text.indexOf(searchValue) > -1){
  //             needingText = findAndSigned(searchValue, item.text)
  //           }
  //           pageResult.push({
  //             title: needingTitle,
  //             text: needingText
  //           })
  //         })
  //         // 渲染html
          
  //       }
  //     },
  //     error: function(err){

  //     }
  //   })
  // });
  /* search end*/

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      type = $this.attr('data-share'),
      offset = $this.offset();

    if (type == 'baidu') {
      var box = $('#article-share-box');
      shareDataUrl = $this.attr('data-url');
      shareDataTitle = $this.attr('data-title');

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }

      $('.article-share-box.on').hide();

      box.css({
        top: offset.top + 25,
        left: offset.left - 25
      }).addClass('on');
    } else{
      var url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id');

      if ($('#' + id).length){
        var box = $('#' + id);

        if (box.hasClass('on')){
          box.removeClass('on');
          return;
        }
      } else {
        var html = [
          '<div id="' + id + '" class="article-share-box">',
            '<input class="article-share-input" value="' + url + '">',
            '<div class="article-share-links">',
              '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
              '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
              '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
              '<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="article-share-google" target="_blank" title="Google+"></a>',
            '</div>',
          '</div>'
        ].join('');

        var box = $(html);

        $('body').append(box);
      }

      $('.article-share-box.on').hide();

      box.css({
        top: offset.top + 25,
        left: offset.left
      }).addClass('on');
    };
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i) {
    $(this).find('img').each(function() {
      if ($(this).parent().hasClass('fancybox')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
    });

    $(this).find('.fancybox').each(function() {
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox) {
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function() {
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function() {
    setTimeout(function() {
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function() {
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function() {
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });
})(jQuery);
