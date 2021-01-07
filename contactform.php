<?php
session_start();
$mode = 'input';
$errmessage = array();
if (isset($_POST['back']) && $_POST['back']) {
    //　何もしない
} elseif (isset($_POST['confirm']) && $_POST['confirm']) {

    if (!$_POST['fullname']) {
        $errmessage[] = "名前を入力してください";
    } else if (mb_strlen($_POST['fullname']) > 100) {
        $errmessage[] = "名前を100文字以内にしてください";
    }
    $_SESSION['fullname'] = htmlspecialchars($_POST['fullname'], ENT_QUOTES);

    if (!$_POST['email']) {
        $errmessage[] = "Eメールを入力してください";
    } else if (mb_strlen($_POST['email']) > 200) {
        $errmessage[] = "Eメールを200文字以内にしてください";
    } elseif (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $errmessage[] = "Eメールアドレスが不正です";
    }
    $_SESSION['email'] = htmlspecialchars($_POST['email'], ENT_QUOTES);


    if (!$_POST['message']) {
        $errmessage[] = "お問い合わせ内容を入力してください";
    } else if (mb_strlen($_POST['message']) > 500) {
        $errmessage[] = "お問い合わせ内容は500文字以内にしてください";
    }
    $_SESSION['message'] = htmlspecialchars($_POST['message'], ENT_QUOTES);

    if ($errmessage) {
        $mode = 'input';
    } else {
        $mode = 'confirm';
    }
} elseif (isset($_POST['send']) && $_POST['send']) {
    $message = "お問い合わせを受け付けました。\r\n"
        . "名前:" . $_SESSION['fullname'] . "\r\n"
        . "email:" . $_SESSION['email'] . "\r\n"
        . "お問い合わせ内容:\r\n"
        . preg_replace("/\r\n\r\n/", "\r\n", $_SESSION['message']);
    mail($_SESSION['email'], 'お問い合わせありがとうございます', $message);
    mail('kasamishoki@icloud.com', 'お問い合わせありがとうございます', $message);
    $_SESSION = array();
    $mode = 'send';
} else {
    $_SESSION['fullname'] = "";
    $_SESSION['email']    = "";
    $_SESSION['message']  = "";
}
?>

<!DOCTYPE html>
<html lang="ja">

<head>
<link rel="alternate" hreflang="ja" href="index.html">
  <link rel="alternate" hreflang="en" href="en.html">
  <script src="https://j.wovn.io/1"
    data-wovnio="key=6IjWHk&amp;backend=true&amp;currentLang=ja&amp;defaultLang=ja&amp;urlPattern=path&amp;langCodeAliases=[]&amp;version=WOVN.php"
    async></script>
  <meta charset="utf-8">
  <title>八大商事 | あなたの心を豊かにする不動産会社</title>

  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1,user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="cache-control" content="no-cache" />
  <meta http-equiv="expires" content="0" />
  <link rel="icon" type="image/x-icon" href="image/favicon.ico">
  <link rel="apple-touch-icon" href="image/apple-touch-icon.png" sizes="180x180">
  <meta property="og:url" content="index.html">
  <meta property="fb:app_id" content="1826108364356718" />

  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
  <!--sp時のトップページのスライダー。ひとまず読み込みさせないで対応。-->
  <script type="text/javascript" src="js/slick.js"></script>
  <script type="text/javascript" src="js/jquery.magnific-popup.js"></script>
  <script type="text/javascript" src="js/jquery.easing.1.3.js"></script>
  <script type="text/javascript" src="js/iscroll.js"></script>
  <script type="text/javascript" src="js/photoswipe.js"></script>
  <script type="text/javascript" src="js/photoswipe-ui-default.min.js"></script>
  <script type="text/javascript" src="js/jquery.matchHeight-min.js"></script>
  <script type="text/javascript" src="js/jquery.fadethis.min.js"></script>
  <script type="text/javascript" src="js/common-201109.js"></script>
  <script type="text/javascript" src="js/mlang-200220.js"></script>
  <!--<script type="text/javascript" src="js/gdpr-190820.js"></script>-->

  <link rel="stylesheet" media="screen,projection,handheld,print" href="css/asset.css">
  <link rel="stylesheet" media="screen,projection,handheld,print" href="css/slick.css">
  <link rel="stylesheet" media="screen,projection,handheld,print" href="css/slick-theme.css">
  <link rel="stylesheet" media="screen,projection,handheld,print" href="css/magnific-popup.css">
  <link rel="stylesheet" media="screen,projection,handheld,print" href="css/photoswipe.css">
  <link rel="stylesheet" media="screen,projection,handheld,print" href="css/default-skin.css">
  <link rel="stylesheet" media="screen,projection,handheld,print" href="css/font.css">
  <link rel="stylesheet" media="screen,projection,handheld,print" href="css/common-201109.css">
  <!-- 201912 リニューアルの上書き用renew.cssを用意 -->
  <link rel="stylesheet" media="screen,projection,handheld,print" href="css/renew-201014.css">
  <link rel="stylesheet" media="screen,projection,handheld,print" href="css/gdpr.css">
</head>

<body>
    

    <?php if ($mode == 'input') { ?>
        <!--入力画面-->
        <?php
        if ($errmessage) {
            echo '<div style="color:red;">';
            echo implode('<br>', $errmessage);
            echo '</div>';
        } ?>
        <form action="./contactform.php" method="post">
            名前<input type="text" name="fullname" value="<?php echo $_SESSION['fullname'] ?>"><br>
            Eメール<input type="email" name="email" value="<?php echo $_SESSION['email'] ?>"><br>
            お問い合わせ<br>
            <textarea name="message" cols="40" rows="8"><?php echo $_SESSION['message'] ?></textarea><br>
            <input type="submit" name="confirm" value="確認">
        </form>

    <?php } else if ($mode == 'confirm') { ?>
        <!--確認画面 -->
        <form action="./contactform.php" method="post">
            名前<?php echo $_SESSION['fullname'] ?><br>
            Eメール<?php echo $_SESSION['email'] ?><br>
            お問い合わせ内容<br>
            <?php echo nl2br($_SESSION['message']) ?><br>
            <input type="submit" name="back" value="戻る">
            <input type="submit" name="send" value="送信">
        </form>


    <?php } else { ?>
        <!--完了画面-->
        送信しました。。ありがとうございます。
    <?php } ?>






</body>

</html>