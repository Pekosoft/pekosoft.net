<?php
http_response_code(500);
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/head.php"); ?>
</head>

<body>

  <div>
    <div class="link-wrapper"><a href="/"><img src="/img/logo.svg" alt="Logo" class="standard-image"></a></div>
    <h1>500 Internal Server Error</h1>
    <p>Something went wrong on the server.</p>
    <a href="/">Return to Index</a>
  </div>

</body>

</html>