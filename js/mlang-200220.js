    window.addEventListener('wovnLangChanged', function (evt) {
        var newLang = WOVN.io.getCurrentLang().code;
        // リンクの変更
        $("a" + ".mlang").each(function() {
            var replace = null;
            var replaceString = 'mlang=' + newLang;
            replace = $(this).attr('href').replace(/mlang.*$/,replaceString);
            $(this).attr('href', replace);
        });

        // 画像のパス変更
        $("img" + ".mlang").each(function() {
            var replaceString = '_' + newLang + '.';
            var replace_ja = $(this).attr('src').replace('_en.', '_ja.');
            var replace = replace_ja.replace('_ja.', replaceString);
            $(this).attr('src', replace);
        });

        // bodyに言語クラスの追加
        var replaceString = 'lang_' + newLang;
        $("body").removeClass("lang_en lang_ja").addClass(replaceString);

        // 翻訳を両方出して置いて、表示非表示切り替えるための処理
        $(".mlang-visible").hide();
        $(".mlang-visible" + "." + newLang).show();

        // hiddenの値を変更
        $('input:hidden[name="mlang"]').val(newLang);

        // コンテンツの高さを揃える
        $('.noSlick .inner').matchHeight({byRow:true});
        $('.noSlick .wrapper_subcontents').matchHeight({byRow:false});
        $('.slider_top_investors .content').matchHeight({byRow:false});
        $('.slider_top_business .text').matchHeight({byRow:true});
        $('.slider_top_business_list .text').matchHeight({byRow:true});
        $('.ir_same_height').matchHeight({byRow:true});
        $('.recruit_top_interview > .inner  .content > .inner').matchHeight({byRow:true});
        $('.interviewList .title').matchHeight({byRow:true});
        $('.top_robot').matchHeight({byRow:false});
        $('.contact_list').matchHeight({byRow:true});
        $('.ir_library_container .inner').matchHeight({byRow:true});
        $('.ir_library_container_en .inner').matchHeight({byRow:true});
        $('.ir_news_container .inner').matchHeight({byRow:true});
        $('.ir_news_container_en .inner').matchHeight({byRow:true});

        $(".language_changer a").remove("active");

        if($("body").hasClass("lang_en")){
          $(".changer_en").addClass("active");
          $(".changer_ja").removeClass("active");
        } else {
          $(".changer_ja").addClass("active");
        }
        $("a").each(function() {
          if($("body").hasClass("lang_en")){
            if($(this).attr("href")=="https://www.robothome.co.jp/"){
              $(this).attr("href","https://www.robothome.co.jp/en");
            }
            if($(this).attr("href")=="https://www.robothome.co.jp/owner/"){
              $(this).attr("href","https://www.robothome.co.jp/en/owner/");
            }
            if($(this).attr("href")=="https://www.tateru.co/"){
              $(this).attr("href","https://www.tateru.co/en");
            }
            if($(this).attr("href")=="https://www.trippod.jp/"){
              $(this).attr("href","https://www.trippod.jp/lang/en/");
            }
            if($(this).attr("href")=="https://www.robothome.co.jp/form/contact.html"){
              $(this).attr("href","https://www.robothome.co.jp/en/form/contact.html");
            }
          } else {
            if($(this).attr("href")=="https://www.robothome.co.jp/en"){
              $(this).attr("href","https://www.robothome.co.jp/");
            }
            if($(this).attr("href")=="https://www.robothome.co.jp/en/owner/"){
              $(this).attr("href","https://www.robothome.co.jp/owner/");
            }
            if($(this).attr("href")=="https://www.tateru.co/en"){
              $(this).attr("href","https://www.tateru.co/");
            }
            if($(this).attr("href")=="https://www.trippod.jp/lang/en/"){
              $(this).attr("href","https://www.trippod.jp/");
            }
            if($(this).attr("href")=="https://www.robothome.co.jp/en/form/contact.html"){
              $(this).attr("href","https://www.robothome.co.jp/form/contact.html");
            }
          }
        });

    });
    // wovn 読込時実行
    window.addEventListener('wovnApiReady', function(evt) {
            // iframe内ならwovnウィジット削除
            if(window != window.parent) {
              $("#wovn-translate-widget").remove();
            }
    });
