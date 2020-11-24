$(function () {
  //サイト固有の同意可否のidを設定
  var GDPRID = 'corp_gdpr';

  //タイムスタンプ用
  var date = new Date();
  var TS = date.getTime();

  var POLICYTEXT = '<span class="mlang-visible ja" wovn-ignore>当社は利便性向上のために Cookie を使用します。<br>サイトを引き続き閲覧いただく場合、Cookie の使用に同意しているものとします。<br>サイト閲覧時の Cookie の使用を希望しない場合は <a class="cookie_link" href="/privacy_policy/cookie" target="_blank">Cookie ポリシー</a> をご覧ください。</span><span class="mlang-visible en" wovn-ignore style="display:none;">We use cookies to improve our sites and your experience. <br>By continuing to browse our sites, you are agreeing to accept our use of cookies. <br>If you do not wish to have cookies placed when using the sites, please refer to our <a class="cookie_link" href="/en/privacy_policy/cookie" target="_blank">Cookie Policy</a>.</span>'

  //同意可否による表示の出しわけ
  if (!localStorage.getItem(GDPRID)) {
    $(window).on('load', function () {
      $('body').append('<div id="gdpr_pop_container">' + POLICYTEXT + '<button id="gdpr_pop_permit"></button></div>');

      $(document).on('click', '#gdpr_pop_permit', function () {
        localStorage.setItem(GDPRID, TS);
        $('#gdpr_pop_container').css({
          'opacity': '0'
        });

        setTimeout(function () {
          $('#gdpr_pop_container').remove();
        }, 300);
      });

      $(window).on('pagehide', function(event) {
          //同意を保存
          localStorage.setItem(GDPRID, TS);
      });
    });
  }
});
