$(function() {
  // 休暇告知タイマー
  var startDate = '2020/11/16 10:00';
  var endDate = '2020/11/24 13:00';
  var startDateSecond = '2020/11/24 13:00';
  var endDateSecond = '2020/11/30 13:00';
  var startDateThird = '2020/12/14 10:00';
  var endDateThird = '2020/12/21 13:00';
  var nowDate = new Date();
  if (new Date(startDate).getTime() <= nowDate.getTime() && new Date(endDate).getTime() > nowDate.getTime()) {
    $('#holiday_attention_wrapper').css('display','block');
  }
  if (new Date(startDateSecond).getTime() <= nowDate.getTime() && new Date(endDateSecond).getTime() > nowDate.getTime()) {
    $('#holiday_attention_wrapper_second').css('display','block');
  }
  if (new Date(startDateThird).getTime() <= nowDate.getTime() && new Date(endDateThird).getTime() > nowDate.getTime()) {
    $('#holiday_attention_wrapper_third').css('display','block');
  }

  // 英語表示の状態でアクセスしたらIRライブラリTOPへ戻す
  if ( location.pathname.match("/en/ir/library/detail3")) {
    location.href = "/en/ir/library";
  }
  $(document).on('click',   function(e) {
    if (!$(e.target).closest('.contents_title').length) {
      if($("body").hasClass("related_contents_open")){

        $('.wrapper_related_content').removeClass("addBtm");
        $("body").removeClass('related_contents_open');
        // 関連コンテンツの数を取得
        size = $('.wrapper_related_content > a').length;

        // 関連コンテンツの非表示速度
        delayTime = 40;

        for (var i = 0; i < size; i++) {

          // 関連コンテンツを非表示にする
          $('.wrapper_related_content > a').eq(i).delay(delayTime).queue(function() {
            $(this).toggleClass("open").dequeue();
            // $('.wrapper_related_content').removeClass("addBtm").dequeue();
          });
          delayTime = delayTime * 1.1;
        }
        $('.wrapper_related_content').css("max-height", 0);
        $('.wrapper_related_content').css("border-bottom", "0");
        $('.wrapper_related_content').removeClass("addBtm");
        $(".contents_title").removeClass('opened');
      }
    }
  });

  //関連コンテンツ アコーディオン
  $(document).on('click', '.contents_title', function() {

    // spレイアウトかどうかチェック
    if ($(window).width() < 980) {

      // 関連コンテンツが開いているか(class:openedがついているか)チェック
      if ($(this).hasClass("opened")) { // 関連コンテンツが開いている
        $('.wrapper_related_content').removeClass("addBtm");
        $("body").removeClass('related_contents_open');
        // 関連コンテンツの数を取得
        size = $('.wrapper_related_content > a').length;

        // 関連コンテンツの非表示速度
        delayTime = 40;

        for (var i = 0; i < size; i++) {

          // 関連コンテンツを非表示にする
          $('.wrapper_related_content > a').eq(i).delay(delayTime).queue(function() {
            $(this).toggleClass("open").dequeue();
            // $('.wrapper_related_content').removeClass("addBtm").dequeue();
          });
          delayTime = delayTime * 1.1;
        }
        $('.wrapper_related_content').css("max-height", 0);
        $('.wrapper_related_content').css("border-bottom", "0");
        $('.wrapper_related_content').removeClass("addBtm");
        $(this).removeClass('opened');


      } else { // 関連コンテンツが開いていない

        $(this).addClass('opened');

        $("body").addClass('related_contents_open');

        // 関連コンテンツの数を取得
        size = $('.wrapper_related_content > a').length;

        // 関連コンテンツ全体の高さを決める
        container_height = size * 48 + 40;

        // 関連コンテンツの表示速度
        delayTime = 140;

        // 関連コンテンツの高さを設定
        $('.wrapper_related_content').css("max-height", container_height);


        for (var i = 0; i < size; i++) {

          // 関連コンテンツを表示する
          $('.wrapper_related_content > a').eq(i).delay(delayTime).queue(function() {
            $(this).toggleClass("open").dequeue();
            //$('.wrapper_related_content').css("border-bottom", "1px solid #e5e5e5").dequeue();

          });
          $('.wrapper_related_content').addClass("addBtm");
          delayTime = delayTime * 1.1;

        }

      }
    }
  });

  // スクロール依存ヘッダ
  // ページ読み込み時のスクロール位置を取得
  var scroll = $(window).scrollTop();
  $(window).on("scroll", function() {


    if ($('body').hasClass("spmenu_open")) {
      return;
    }
    // スクロール後のスクロール位置を取得
    var nowScroll = $(window).scrollTop();

    // 画面幅を取得
    var windowWidth = $(window).width();

    // 読み込み時のスクロール位置と現在のスクロール位置を比較
    if (nowScroll > scroll) {　 // 下にスクロール

      if (nowScroll < 60) {
        // スクロール位置が60pxより小さかったら何もしない
      } else {

        $("#header").removeClass("slide-up");
        $("#header").addClass("slide-down");


        if (windowWidth > 979) {
          $(".wrapper_contents_title").addClass("slide-up_header");
          $(".wrapper_contents_title").removeClass("slide-down_header");
          $('.accordionlist').css("top", "-200px");
          $('.accordionlist').fadeOut(300);
          setTimeout(function() {
            $('.accordionlist').css("top", "60px");
          }, 400);
        } else {
          $(".contents_title").addClass("slide-up_header");
          $(".contents_title").removeClass("slide-down_header");
        }
      }
    } else {
      // 上にスクロール
      $("#header").removeClass("slide-down");
      $("#header").addClass("slide-up");
      if (windowWidth > 979) {
        $(".wrapper_contents_title").removeClass("slide-up_header");
        $(".wrapper_contents_title").addClass("slide-down_header");
      } else {
        $(".contents_title").removeClass("slide-up_header");
        $(".contents_title").addClass("slide-down_header");
      }
    }
    scroll = nowScroll;
  });

  // spドロワーメニュー
  menu_scroll = $(window).scrollTop();
  $('.spmenu_label').on('click', function() {
    menu_scroll = $(window).scrollTop();
    if ($('body').hasClass("spmenu_open")) {
      $('body').removeClass('spmenu_open');
      $('body').css({
        'top': 0
      });
      $('html,body').scrollTop(menu_scroll);
    } else {
      $('body').addClass('spmenu_open');
      $('body').css({
        'top': -menu_scroll
      });
    }

  });
  $('.spmenu_grayfilter').on('click', function() {
    $('body').removeClass('spmenu_open');
    $('body').css({
      'top': 0
    });
    $('html,body').scrollTop(menu_scroll);
  });



  // topニューススライダ
  $('.slider_top_news').slick({
    infinite: false,
    swipe: false,
    prevArrow: "<p class='prev'></p>",
    nextArrow: "<p class='next'></p>"
  });

  // top news tabs
  $(document).on('click', '.news_contents_top_tabs .tabs', function(){
      if($(this).hasClass("selected")){
          return;
      } else {
          var index = $('.news_contents_top_tabs .tabs').index(this);
          $(".news_contents_top_tabs .tabs").removeClass("selected");
          $(this).addClass("selected");
          $('.news_contents_top .tab_content').css('display','none');
          $('.news_contents_top .tab_content').eq(index).css('display','block');

      }
  });


  // top投資家情報スライダ
  $('.slider_top_investors').slick({
    infinite: false,
    accessibility: false,
    arrows: false,
    variableWidth: true,
    slider_top_investors: 20
  });
  // トップ事業内容スライダ
  $('.slider_top_business').slick({
    infinite: false,
    accessibility: false,
    arrows: false,
    variableWidth: true,
    slider_top_investors: 20
  });


  // 関連コンテンツスライダ
  $('.slider_related_contents').slick({
    infinite: false,
    accessibility: false,
    arrows: false,
    variableWidth: true
  });

  $.fn.shuffle = function() {
    return this.each(function(){
      var items = $(this).children().clone(true);
      return (items.length) ? $(this).html($.shuffle(items)) : this;
    });
  }

  $.shuffle = function(arr) {
    for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
  }
  var interview_rmv_tgt = location.href;
  interview_rmv_tgt = interview_rmv_tgt.slice( -3 ) ;
  $(".interview_slider.details .content").each(function() {
    if($(this).attr("data-id")==interview_rmv_tgt){
      $(this).remove();
    }
  });
  $('.interview_slider.details').shuffle();
  $('.interview_slider.details .content:gt(2)').remove();

  // インタビュースライダ
  $('.interview_slider').slick({
    infinite: false,
    accessibility: false,
    arrows: false,
    variableWidth: true
  });
  // トップニューススライダ
  $('.news_contents_slider_top').slick({
    infinite: false,
    accessibility: false,
    arrows: false,
    variableWidth: true
  });



  // オフィス写真スライダ
  $('.officePic_slider').slick({
    infinite: false,
    accessibility: false,
    arrows: false,
    centerMode: true,
    variableWidth: true,
    infinite: true,
    responsive: [{
      breakpoint: 979,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 3,
        accessibility: false,

      }
    }]
  });

  // オフィス写真、画像クリックでスライド
  $('.officePic_slider.slick-slider').on('click', '.slick-slide', function(e) {

    // パブリングを止める
    e.stopPropagation();

    // クリックした写真の順番を取得
    var index = $(this).data("slick-index");

    // クリックした写真が現在アクティブ(真ん中)かどうかをチェック
    if ($('.slick-slider').slick('slickCurrentSlide') !== index) {
      // アクティブではない場合、クリックした写真を真ん中に持ってくる
      $('.slick-slider').slick('slickGoTo', index);
    }

  });

  // spドロワーメニューアコーディオン
  $(".accordionbox").on("click", function(e) {
    if ($(window).width() < 980) {
      e.preventDefault();

      $(this).next().slideToggle();
      // activeが存在する場合
      if ($(this).children(".accordion_icon").hasClass('active')) {
        // activeを削除
        $(this).children(".accordion_icon").removeClass('active');
      } else {
        // activeを追加
        $(this).children(".accordion_icon").addClass('active');
      }
    }
  });
  // PCサイドメニューアコーディオン
  $(".side_navigation > .accordionbox").on("click", function(e) {
    //if ($(window).width() < 980) {
      e.preventDefault();

      $(this).next().slideToggle();
      // activeが存在する場合
      if ($(this).children(".accordion_icon").hasClass('active')) {
        // activeを削除
        $(this).children(".accordion_icon").removeClass('active');
      } else {
        // activeを追加
        $(this).children(".accordion_icon").addClass('active');
      }
    //}
  });

  // irリスト系コンテンツ絞り込み
  $(".ir_year").on("change", function() {
    $(".wrapper_ir_info_list a").removeClass("sorted");
    $(".wrapper_ir_info_list a").removeClass("noBdr");
    visible_cnt = 0;
    tgt_year = $(this).val();
    tgt_type = $(".ir_type").val();
    if (tgt_type != "") {
      $(".wrapper_ir_info_list a").each(function() {
        info_year = $(this).attr("data-year");
        info_type = $(this).attr("data-type");;
        if (tgt_year == info_year && tgt_type == info_type) {
          $(this).css("display", "block");
          $(this).addClass("sorted");
          visible_cnt++;
        } else {
          $(this).css("display", "none");
        }
      });
      $('.sorted').last().addClass("noBdr");
    } else {
      $(".wrapper_ir_info_list a").each(function() {
        info_year = $(this).attr("data-year");
        if (tgt_year != info_year) {
          $(this).css("display", "none");
        } else {
          $(this).css("display", "block");
          $(this).addClass("sorted");
          visible_cnt++;
        }
      });
      $('.sorted').last().addClass("noBdr");
    }
    if (visible_cnt == 0) {
      $(".empty_ir_info").css("display", "block");
      $(".wrapper_ir_info_list").css("display", "none");
    } else {
      $(".empty_ir_info").css("display", "none");
      $(".wrapper_ir_info_list").css("display", "block");
    }
  });

  // irリスト系コンテンツ絞り込み
  $(".ir_type").on("change", function() {
    $(".wrapper_ir_info_list a").removeClass("sorted");
    $(".wrapper_ir_info_list a").removeClass("noBdr");
    visible_cnt = 0;
    tgt_year = $(".ir_year").val();
    tgt_type = $(this).val();
    if (tgt_type != "") {
      $(".wrapper_ir_info_list a").each(function() {
        info_year = $(this).attr("data-year");
        info_type = $(this).attr("data-type");
        if (tgt_year == info_year && tgt_type == info_type) {
          $(this).css("display", "block");
          $(this).addClass("sorted");
          visible_cnt++;
        } else {
          $(this).css("display", "none");
        }
      });
      $('.sorted').last().addClass("noBdr");
    } else {
      $(".wrapper_ir_info_list a").each(function() {
        info_year = $(this).attr("data-year");
        if (tgt_year != info_year) {
          $(this).css("display", "none");
        } else {
          $(this).css("display", "block");
          $(this).addClass("sorted");
          visible_cnt++;
        }
      });
      $('.sorted').last().addClass("noBdr");
    }
    if (visible_cnt == 0) {
      $(".empty_ir_info").css("display", "block");
      $(".wrapper_ir_info_list").css("display", "none");
    } else {
      $(".empty_ir_info").css("display", "none");
      $(".wrapper_ir_info_list").css("display", "block");
    }

  });

  $(".library_selector_wrapper select").on("change", function() {
    $(".xj-mainlist .pdf").removeClass("sorted");
    $(".xj-mainlist2 .pdf").removeClass("sorted");
    $(".xj-mainlist .pdf").removeClass("noBdr");

      $(".xj-mainlist .pdf").each(function() {
        $(this).addClass("sorted");
      });
      $(".xj-mainlist2 .pdf").each(function() {


        $(this).addClass("sorted2");
      });
      $('.sorted').last().addClass("noBdr");
      $('.sorted2').last().addClass("noBdr");

  });









  // photoswipeパーツ
  $("body").append('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');


  var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
      var thumbElements = el.childNodes,
        numNodes = thumbElements.length,
        items = [],
        figureEl,
        linkEl,
        size,
        item;

      for (var i = 0; i < numNodes; i++) {

        figureEl = thumbElements[i]; // <figure> element

        // include only element nodes
        if (figureEl.nodeType !== 1) {
          continue;
        }

        linkEl = figureEl.children[0]; // <a> element

        size = linkEl.getAttribute('data-size').split('x');

        // create slide object
        item = {
          src: linkEl.getAttribute('href'),
          w: parseInt(size[0], 10),
          h: parseInt(size[1], 10)
        };



        if (figureEl.children.length > 1) {
          // <figcaption> content
          item.title = figureEl.children[1].innerHTML;
        }

        if (linkEl.children.length > 0) {
          // <img> thumbnail element, retrieving thumbnail url
          item.msrc = linkEl.children[0].getAttribute('src');
        }

        item.el = figureEl; // save link to element for getThumbBoundsFn
        items.push(item);
      }

      return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
      return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;

      var eTarget = e.target || e.srcElement;

      // find root element of slide
      var clickedListItem = closest(eTarget, function(el) {
        return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
      });

      if (!clickedListItem) {
        return;
      }

      // find index of clicked item by looping through all child nodes
      // alternatively, you may define index via data- attribute
      var clickedGallery = clickedListItem.parentNode,
        childNodes = clickedListItem.parentNode.childNodes,
        numChildNodes = childNodes.length,
        nodeIndex = 0,
        index;

      for (var i = 0; i < numChildNodes; i++) {
        if (childNodes[i].nodeType !== 1) {
          continue;
        }

        if (childNodes[i] === clickedListItem) {
          index = nodeIndex;
          break;
        }
        nodeIndex++;
      }



      if (index >= 0) {
        // open PhotoSwipe if valid index found
        openPhotoSwipe(index, clickedGallery);
      }
      return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1),
        params = {};

      if (hash.length < 5) {
        return params;
      }

      var vars = hash.split('&');
      for (var i = 0; i < vars.length; i++) {
        if (!vars[i]) {
          continue;
        }
        var pair = vars[i].split('=');
        if (pair.length < 2) {
          continue;
        }
        params[pair[0]] = pair[1];
      }

      if (params.gid) {
        params.gid = parseInt(params.gid, 10);
      }

      if (!params.hasOwnProperty('pid')) {
        return params;
      }
      params.pid = parseInt(params.pid, 10);
      return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
      var pswpElement = document.querySelectorAll('.pswp')[0],
        gallery,
        options,
        items;

      items = parseThumbnailElements(galleryElement);

      // define options (if needed)
      options = {
        index: index,
        pinchToClose: false,
        shareEl: false,
        fullscreenEl: false,

        // define gallery index (for URL)
        galleryUID: galleryElement.getAttribute('data-pswp-uid'),

        getThumbBoundsFn: function(index) {
          // See Options -> getThumbBoundsFn section of documentation for more info
          var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect();

          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          };
        }

      };

      if (disableAnimation) {
        options.showAnimationDuration = 0;
      }

      // Pass data to PhotoSwipe and initialize it
      gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i + 1);
      galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid > 0 && hashData.gid > 0) {
      openPhotoSwipe(hashData.pid - 1, galleryElements[hashData.gid - 1], true);
    }
  };
  initPhotoSwipeFromDOM('.wrapper_highlight_img')


  // topページ事業内容のカードhover
  $('.card_business').hover(function() {

    $('.card_business').removeClass("first");
    $('.card_business').removeClass("active");

    $(this).addClass("active");
    $('.content', this).css("bottom", "0px");

  }, function() {
    $('.content', this).css("bottom", "-337px");
  });

  nav_open_flg = false;
  open_flg = false;
  $('.grandnav_wrapper li').hover(function() {

  }, function() {

  });

  // pcメガメニュー
  $(".grandnav_wrapper li").hover(
    function(e) {
      if ($(window).width() > 979) {
        $(this).children(".accordionlist").fadeIn(150);
        $(".accordionbox a", this).addClass("active");
        e.preventDefault();
      }
    },
    function(e) {
      if ($(window).width() > 979) {
        $(this).children(".accordionlist").fadeOut(150);
        $(".accordionbox a", this).removeClass("active");
        e.preventDefault();
      }
    }
  );


  // IRライブラリ絞り込み
  $(document).on('click', '.wrapper_sort_ir_details .btn', function() {

    $(".wrapper_ir_details_list a").removeClass("sorted");
    $(".wrapper_ir_details_list a").removeClass("noBdr");

    // クリックした要素がすでに選択されていたらreturn
    if ($(this).hasClass("active")) {
      return;
    }

    // ボタンのactiveを解除
    $('.wrapper_sort_ir_details .btn').removeClass("active");

    // クリックした要素にclass:activeを付与
    $(this).addClass("active");

    // クリックしたボタンの年を取得
    var target_year = $(this).text();

    // リスト表示件数の初期化
    var visible_cnt = 0;

    $(".wrapper_ir_details_list").each(function() {

      $("a", this).each(function() {

        // 存在する各記事の年を取得
        info_year = $(this).attr("data-year");

        // クリックしたボタンの年と各記事の年を比較
        if (target_year == info_year) {
          // 年が同じだったらdisplay:table;にして表示
          $(this).css("display", "table");
          $(this).addClass("sorted");
          // 表示件数を加算
          visible_cnt++;
        } else {
          // 年が違う要素はdisplay:none;で隠す
          $(this).css("display", "none");
        }
      });

      // 表示件数が0かどうか
      if (visible_cnt == 0) {
        // 0だったら0件用のパーツを表示
        $(".empty_ir_details", this).css("display", "block");
      } else {
        // 0以外だったら0件用のパーツを隠す
        $(".empty_ir_details", this).css("display", "none");
      }

      $('.sorted', this).last().addClass("noBdr");

      visible_cnt = 0;

    });
  });

  // youtube動画のポップアップ表示
  if ($('.popup-youtube').length) {
    $('.popup-youtube').magnificPopup({
      type: 'iframe',
      mainClass: 'mfp-fade',
      removalDelay: 150,
      preloader: false,
      fixedContentPos: false
    });
  }

  // お問い合わせvalidation(blur時)

  // 名前
  $("input#name").blur(function() {
    var trim_name = $(this).val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    // 名前が入力されているかどうか
    if (trim_name == "") {　　
      $("#name_error").text("お名前を入力してください");
      $(this).addClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;
    }
    if (trim_name != "") {　　
      $("#name_error").text("");
      $(this).removeClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;
    }
  });

  // メールアドレス
  $("input#email").blur(function() {　　
    if ($(this).val() == "") {　　
      $("#email_error").text("メールアドレスを入力してください");
      $(this).addClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;　
    }
    if (!$(this).val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/)) {　　
      $("#email_error").text("メールアドレスの形式が正しくありません");
      $(this).addClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;　
    }
    if ($(this).val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/) && $(this).val() != "") {　　
      $("#email_error").text("");
      $(this).removeClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;　
    }
  });
  // 電話番号
  $("input#tel").blur(function() {　　
    if ($(this).val() == "") {　　
      $("tel_error").text("");
      $(this).removeClass("has-error");
      return;　
    }
    if (!$(this).val().match(/^[0-9]+$/)) {　　
      $("tel_error").text("電話番号は半角数字のみで入力してください");
      $(this).addClass("has-error");
      return;　
    }
    if ($(this).val().match(/^[0-9]+$/) && $(this).val() != "") {　　
      $("tel_error").text("");
      $(this).removeClass("has-error");
      return;　
    }
  });
  // お問い合わせ内容
  $("textarea#contact").blur(function() {　　
    var trim_contact = $(this).val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    if (trim_contact == "") {　　
      $("#contact_error").text("お問い合わせ内容を入力してください");
      $(this).addClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;　
    }
    if (trim_contact != "") {　　
      $("#contact_error").text("");
      $(this).removeClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;　
    }
  });
  // 外部通報窓口の法人名
  $("input#compliance_corp").blur(function() {
    var trim_compliance_corp = $(this).val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    // 法人名が入力されているかどうか
    if (trim_compliance_corp == "") {　　
      $("#compliance_corp_error").text("法人名を入力してください");
      $(this).addClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;
    }
    if (trim_compliance_corp != "") {　　
      $("#compliance_corp_error").text("");
      $(this).removeClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;
    }
  });
  // 外部通報窓口の通報対象者
  $("input#target_name").blur(function() {
    var trim_target_name = $(this).val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    // 通報対象者が入力されているかどうか
    if (trim_target_name == "") {　　
      $("#target_name_error").text("通報対象者を入力してください");
      $(this).addClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;
    }
    if (trim_target_name != "") {　　
      $("#target_name_error").text("");
      $(this).removeClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;
    }
  });
  // 外部通報窓口の相談・通報の具体的内容
  $("textarea#compliance_contact").blur(function() {
    var trim_compliance_contact = $(this).val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    // 名前が入力されているかどうか
    if (trim_compliance_contact == "") {　　
      $("#compliance_contact_error").text("相談・通報の具体的内容を入力してください");
      $(this).addClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;
    }
    if (trim_compliance_contact != "") {　　
      $("#compliance_contact_error").text("");
      $(this).removeClass("has-error");
      if ($('.has-error').length) {
        $(".has-error_text").show();
      } else {
        $(".has-error_text").hide();
      }
      return;
    }
  });

  // 入力内容を確認するボタンのタップ時
  $('#contact_btn_confirm').on('click', function() {
    var contact_err_flg = false;
    var trim_name = $("input#name").val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    // 名前
    if (trim_name == "") {　　
      $("#name_error").text("お名前を入力してください");
      $("input#name").addClass("has-error");
      contact_err_flg = true;
    }
    // メールアドレス
    if ($("input#email").val() == "") {　　
      $("#email_error").text("メールアドレスを入力してください");
      $("input#email").addClass("has-error");
      contact_err_flg = true;　
    } else if (!$("input#email").val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/)) {　　
      $("#email_error").text("メールアドレスの形式が正しくありません");
      $("input#email").addClass("has-error");
      contact_err_flg = true;　
    }
    // 電話番号
    if ($("input#tel").val() == "") {　　
      $("#tel_error").text("");　
    } else if (!$("input#tel").val().match(/^[0-9]+$/)) {　　
      $("#tel_error").text("電話番号は半角数字のみで入力してください");
      $("input#tel").addClass("has-error");
      contact_err_flg = true;　
    }
    var trim_contact = $("textarea#contact").val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    // お問い合わせ内容
    if (trim_contact == "") {　　
      $("#contact_error").text("お問い合わせ内容を入力してください");
      $("textarea#contact").addClass("has-error");
      contact_err_flg = true;
    }
    // 個人情報同意チェック
    if (!$('.contact_check').prop('checked')) {
      $("#contact_check_error").text("個人情報の取り扱いについて同意していただく必要があります");
      $(".contact_check").addClass("has-error");
      contact_err_flg = true;
    } else {
      $("#contact_check_error").text("");
    }
    if (contact_err_flg) {
      $(".has-error_text").show();
      $(window).scrollTop(0);
      return false;
    } else {
      $(".contact_form").submit();
    }
  });
  
    $('#contact_rent_btn_confirm').on('click', function () {
        $(".contact_form").submit();
    });

  // 外部通報窓口の入力内容を確認するボタンのタップ時
  $('#compliance_btn_confirm').on('click', function() {
    var compliance_err_flg = false;
    var trim_compliance_corp = $("input#compliance_corp").val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    // 法人名
    if (trim_compliance_corp == "") {　　
      $("#compliance_corp_error").text("法人名を入力してください");
      $("input#compliance_corp").addClass("has-error");
      compliance_err_flg = true;
    }
    var trim_name = $("input#name").val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    // 名前
    if (trim_name == "") {　　
      $("#name_error").text("お名前を入力してください");
      $("input#name").addClass("has-error");
      compliance_err_flg = true;
    }
    // メールアドレス
    if ($("input#email").val() == "") {　　
      $("#email_error").text("メールアドレスを入力してください");
      $("input#email").addClass("has-error");
      compliance_err_flg = true;　
    } else if (!$("input#email").val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/)) {　　
      $("#email_error").text("メールアドレスの形式が正しくありません");
      $("input#email").addClass("has-error");
      compliance_err_flg = true;　
    }
    var trim_target_name = $("input#target_name").val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    // 通報対象者
    if (trim_target_name == "") {　　
      $("#target_name_error").text("通報対象者を入力してください");
      $("input#target_name").addClass("has-error");
      compliance_err_flg = true;
    }
    var trim_compliance_contact = $("textarea#compliance_contact").val().replace(/^[\s|　]+|[\s|　]+$/g,'');
    // 相談・通報の具体的内容
    if (trim_compliance_contact == "") {　　
      $("#compliance_contact_error").text("相談・通報の具体的内容を入力してください");
      $("textarea#compliance_contact").addClass("has-error");
      compliance_err_flg = true;
    }
    // 個人情報同意チェック
    if (!$('.contact_check').prop('checked')) {
      $("#contact_check_error").text("個人情報の取り扱いについて同意していただく必要があります");
      $(".contact_check").addClass("has-error");
      compliance_err_flg = true;
    } else {
      $("#contact_check_error").text("");
    }
    if (compliance_err_flg) {
      $(".has-error_text").show();
      $(window).scrollTop(0);
      return false;
    } else {
      $(".compliance_form").submit();
    }
  });
  $(window).on('load', function () {
    if ($('.has-error').length) {
      $(".has-error_text").show();
    } else {
      $(".has-error_text").hide();
    }
  });

  // 画面サイズによってスライダを破棄、再設定
  function sliderSetting() {
    var width = $(window).width();
    if (width <= 767) {
      $('.slider_top_business').not('.slick-initialized').slick({
        infinite: false,
        accessibility: false,
        arrows: false,
        variableWidth: true,
        slider_top_investors: 20
      });
      $('slider_top_business_list').slick('unslick');
      $('.slider_top_investors').not('.slick-initialized').slick({
        infinite: false,
        accessibility: false,
        arrows: false,
        variableWidth: true,
        slider_top_investors: 20
      });
      $('.news_contents_slider_top').not('.slick-initialized').slick({
        infinite: false,
        accessibility: false,
        arrows: false,
        variableWidth: true
      });
      $('.interview_slider').not('.slick-initialized').slick({
        infinite: false,
        accessibility: false,
        arrows: false,
        variableWidth: true,
        slider_top_investors: 20
      });
    } else {
      $('.slider_top_business.slick-initialized').slick('unslick');
      $('.slider_top_investors.slick-initialized').slick('unslick');
      $('.news_contents_slider_top.slick-initialized').slick('unslick');
      $('.interview_slider.slick-initialized').slick('unslick');

    }
  }
  // トップ事業内容スライダ
  $('.noSlick').slick({
    infinite: false,
    accessibility: false,
    arrows: false,
    variableWidth: true
  });
  $('.noSlick.slick-initialized').slick('unslick');
  $('.accordionlist>.inner').slick({
    infinite: false,
    accessibility: false,
    arrows: false,
    variableWidth: true
  });
  $('.accordionlist>.inner').slick('unslick');

  $('.slider_top_business_list').slick({
    infinite: false,
    accessibility: false,
    arrows: false,
    variableWidth: true
  });
  $('.slider_top_business_list.slick-initialized').slick('unslick');




  // 画面サイズによってヘッダメニューの表示を切り替え
  function headerSetting() {
    var width = $(window).width();
    if (width > 979) {
      if ($(".contents_title").hasClass("slide-down_header")) {
        $(".contents_title").removeClass("slide-down_header");
      }
      if ($(".contents_title").hasClass("slide-up_header")) {
        $(".contents_title").removeClass("slide-up_header");
      }
    }
  }

  // スライダー初期表示時の実行
  sliderSetting();

  // 画面リサイズ時に実行
  $(window).resize(function() {
    sliderSetting(); //スライダーの設定切り替え
    headerSetting(); //ヘッダの表示切り替え
    //setCardSize();
    var wH = $(window).height();
    //$('.main_visual').css('height',wH+'px');
  });

  //$(".js-modal-btn").modalVideo();


  var wH = $(window).height();
  //wH = wH - 200;
  var width = $(window).width();
  if (width > 979) {
    if(wH < 720){
      wH = wH - 60;
      $('.main_visual').css('height',wH+'px');
    }
  }


  //wovn
  $('.language_changer a').on('click', function() {
      if($("body").hasClass("lang_en")){
        if($(this).hasClass("changer_ja")){
          $(".wovn-switch[data-value='ja']").click();
          $("#wovn-translate-widget").prev("div").addClass("wovn_container_box");
          $(window).scrollTop(0);
        } else {
          return;
        }
      } else {
        if($(this).hasClass("changer_ja")){
          return;
        } else {
          $(".wovn-switch[data-value='en']").click();
          $("#wovn-translate-widget").prev("div").addClass("wovn_container_box");
          $(window).scrollTop(0);
        }
      }
    });



    /* =======================
       PCheader用言語切り替え
    ======================== */

    //ボタンクリック
    $('.header_lang_changer').on( 'click' , function() {
      $(this).toggleClass('hlang_active');
      $(this).next().slideToggle(300);
      $(this).next().toggleClass('hlang_open')
    });

    //PCheader用 wovn組み込み
    $('.hlang_changer > a').on('click', function(){
        if( !$('body').hasClass('lang_en') && $(this).hasClass('hlang_en')){
            //英語への切り替え
            $('.header_lang_changer').removeClass('hlang_active');
            $(".wovn-switch[data-value='en']").click();
            $('.hlang_changer').slideUp(300);
            $("#wovn-translate-widget").prev("div").addClass("wovn_container_box");
        }else if($('body').hasClass('lang_en') && $(this).hasClass('hlang_ja')){
            //日本語への切り替え
            $('.header_lang_changer').removeClass('hlang_active');
            $(".wovn-switch[data-value='ja']").click();
            $('.hlang_changer').slideUp(300);
            $("#wovn-translate-widget").prev("div").addClass("wovn_container_box");
        }else{
            return;
        }
    });
    
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.header_lang').length) {
            $('.header_lang_changer').removeClass('hlang_active');
            $('.hlang_changer').slideUp(300);
        }
    });
    
    $(window).on('scroll', function() {
      $('.header_lang_changer').removeClass('hlang_active');
      $('.hlang_changer').slideUp(300);
    });
    /* /// PCheader用言語切り替えここまで */



});


$(window).on('load', function () {
  reCAPTCHA_Sizer();
  $('.noSlick .inner').matchHeight({byRow:true});
  $('.noSlick.sec1 .wrapper_subcontents').matchHeight({byRow:false});
  $('.noSlick.sec2 .wrapper_subcontents').matchHeight({byRow:false});
  $('.noSlick.sec3 .wrapper_subcontents').matchHeight({byRow:false});
  $('.slider_top_investors .content').matchHeight({byRow:false});
  $('.slider_top_business .text').matchHeight({byRow:true});
  $('.slider_top_business_list .wrapper_card_contents .text').matchHeight({byRow:true});
  $('.ir_same_height').matchHeight({byRow:true});
  $('.recruit_top_interview > .inner  .content > .inner').matchHeight({byRow:true});
  $('.interviewList .title').matchHeight({byRow:true});
  $('.top_robot').matchHeight({byRow:false});
  $('.contact_list').matchHeight({byRow:true});
  $('.ir_library_container .inner').matchHeight({byRow:true});
  $('.ir_library_container_en .inner').matchHeight({byRow:true});
  $('.ir_news_container .inner').matchHeight({byRow:true});
  $('.ir_news_container_en .inner').matchHeight({byRow:true});


  var $fixElement = $('.side_navigation'); // 追従する要素
  if ($('.side_navigation').length) {
    var baseFixPoint = $fixElement.offset().top - 60; // 追従する要素の初期位置
  }
  var fixClass = 'is-fixed'; // 追従時に付与するclass
  // 要素が追従する処理
  function fixFunction() {
      if ($('.side_navigation').length) {
        var windowScrolltop = $(window).scrollTop();
        // スクロールが初期位置を通過しているとき
        if(windowScrolltop >= baseFixPoint) {
            $fixElement.addClass(fixClass);
        } else {
            $fixElement.removeClass(fixClass);
        }
      }
  }
  $(window).on('load scroll', function() {
      fixFunction();
  });
});
$(window).on('load', function () {
  //setCardSize();
  setTimeout(function () {
      // 画面読み込み時に特定のページ内リンクのみscrollTop を実行させない・・・
      var excludeList = ['inquiry', 'inquiry_en', 'publicnotice', 'publicnotice_en'];
      if (location.href.split('#').length < 2 || excludeList.includes(location.href.split('#')[1]) == false) {
        $(window).scrollTop(0);
      }
       $('body').css({
           'opacity': '1',
           'visibility': 'visible'
       });
   }, 100);

   var width = $(window).width();
   if (width > 979) {
   setTimeout(function () {

   $(".text_main_visual").css({
     "margin-top":"-207px",
     "opacity":"1",
     "visibility":"visible"
   });
 }, 400);
} else {
  setTimeout(function () {

  $(".text_main_visual").css({

    "opacity":"1",
    "visibility":"visible"
  });
}, 400);
}

  setTimeout(function () {

     $(".type_tobe").css({
       "margin-top":"0px",
       "opacity":"1",
       "visibility":"visible"
     });
   }, 400);
   setTimeout(function () {

        $(".retech").css({
          "margin-top":"0px",
          "opacity":"1",
          "visibility":"visible"
        });
    }, 500);
    setTimeout(function () {

         $(".text_main_visual p").css({
           "margin-top":"10px",
           "opacity":"1",
           "visibility":"visible"
         });
     }, 600);
   setTimeout(function () {

        $(".tab_content.ir").css({
          "margin-bottom":"0px",
          "opacity":"1",
          "visibility":"visible"
        });
    }, 1000);
    setTimeout(function () {

         $(".tab_content.press").css({
           "margin-bottom":"0px",
           "opacity":"1",
           "visibility":"visible"
         });
     }, 1000);
     setTimeout(function () {

          $(".tab_content.new").css({
            "margin-bottom":"0px",
            "opacity":"1",
            "visibility":"visible"
          });
      }, 1000);
});

function setCardSize(){
  v_width = $(window).width();
  if(v_width > 980){

      var property_height = 0;
      var info_height = 0;
      var parts_height = 0;

      $(".slider_top_business .content").each(function() {

           parts_height = $(this).height();
           if(parts_height > info_height){
             info_height = parts_height;
           }
      });
      $(".slider_top_business .content").height(info_height);
    //});
  } else {
      $(".slider_top_business .content").css("height","auto");
  }
}
function enableContactBtn(){
  $(".btn_contact").prop('disabled', false);
}
function disableContactBtn(){
  $(".btn_contact").prop('disabled', true);
}

function reCAPTCHA_Sizer(){
  var $w = $("html").width(); //全体の幅
  var $v = ($w - 40) / 302; //幅に対するreCAPTCHAの比率
  var $h = 78 * $v + 20; //高さ
  if($w < 415) {
    //$(".g-recaptcha").css("transform","scale(" + $v + ")");
    $(".g-recaptcha").css("transform","scale(1)");
    $(".g-recaptcha > div").css("height",$h);
  } else {
    $(".g-recaptcha").css("transform","scale(1)");
    $(".g-recaptcha > div").css("height",78);
  }
}
window.onresize = function () {
  reCAPTCHA_Sizer();
};
