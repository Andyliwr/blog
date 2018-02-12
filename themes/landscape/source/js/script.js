/**
 * 计算页面滚动高度
 */
function rootScollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop;
}

/**
 * 计算offset的函数
 * @param {Object} el
 */
function offset (el) {
  var x = el.offsetLeft,
    y = el.offsetTop;
  if (el.offsetParent) {
    var pOfs = arguments.callee(el.offsetParent);
    x += pOfs.x;
    y += pOfs.y;
  }
  return {
    x: x,
    y: y
  };
}

// 目录工具
let tocTool = null
if(window.location.href.indexOf('article/') < 0){
  tocTool = (function () {
    var toc = $('#toc')
    if (!toc || !toc.children.length) {
      return {
        fixed: noop,
        actived: noop
      }
    }
    var bannerH = $('#header').height()
    var titles = $('.article').find('h3, h4, h5')
    toc.find('a[href="#' + titles[0].id + '"]').parent().addClass('active')
  
    return {
      fixed: function (top) {
        top >= bannerH ? toc.addClass('fixed') : toc.removeClass('fixed')
      },
      actived: function (top) {
        for (i = 0, len = titles.length; i < len; i++) {
          if (top > offset(titles[i]).y - bannerH - 5) {
            toc.find('li.active').removeClass('active')
            var active = toc.find('a[href="#' + titles[i].id + '"]').parent()
            active.addClass('active')
          }
        }
        if (top < offset(titles[0]).y) {
          toc.find('li.active').removeClass('active')
          toc.find('a[href="#' + titles[0].id + '"]').parent().addClass('active')
        }
      }
    }
  })();
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
  $('#nav-search-btn').on('click', function() {
    var $main = $('.ins-search')
    $main.addClass('show')
  });
  /* search end*/

  /* toc start */
  var $toc = $('.toc-article')
  if(window.location.pathname !== "/"){
    if($toc.length > 0){
      if((($(document).width() - 1260) / 2) > ($toc.width() + 30)){
        $toc.show()
      }else{
        $toc.hide()
      }
      // $toc.scrollToFixed({dontSetWidth:true})
      // 监听windows的scroll事件，为目录动态添加active类
      window.addEventListener('DOMContentLoaded', function () {
        var top = rootScollTop()
        tocTool.fixed(top)
        tocTool.actived(top)
      })
      document.addEventListener('scroll', function () {
        var top = rootScollTop()
        tocTool.fixed(top)
        tocTool.actived(top)
      }, false)
      $(window).resize(function () {
        if((($(document).width() - 1260) / 2) > ($toc.width() + 30)){
          $toc.show()
        }else{
          $toc.hide()
        }
      })
    }
  }else{
    if($toc){
      $toc.hide()
    }
  }
  /* toc end */

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on')
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation()

    var $this = $(this),
      type = $this.attr('data-share'),
      offset = $this.offset()

    if (type == 'baidu') {
      var box = $('#article-share-box')
      shareDataUrl = $this.attr('data-url')
      shareDataTitle = $this.attr('data-title')

      if (box.hasClass('on')){
        box.removeClass('on')
        return
      }

      $('.article-share-box.on').hide()

      box.css({
        top: offset.top + 25,
        left: offset.left - 25
      }).addClass('on');
    } else{
      var url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id');

      if ($('#' + id).length){
        var box = $('#' + id)

        if (box.hasClass('on')){
          box.removeClass('on')
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
        ].join('')

        var box = $(html)

        $('body').append(box)
      }

      $('.article-share-box.on').hide()

      box.css({
        top: offset.top + 25,
        left: offset.left
      }).addClass('on')
    };
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation()
  }).on('click', '.article-share-box-input', function(){
    $(this).select()
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault()
    e.stopPropagation()

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
