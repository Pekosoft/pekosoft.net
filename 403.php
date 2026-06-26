<?php
http_response_code(403);
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <?php require($_SERVER['DOCUMENT_ROOT'] . "/elements/head.php"); ?>
</head>

<body>

  <div>
    <div class="link-wrapper"><a href="/"><img src="/img/logo.svg" alt="Logo" class="standard-image"></a></div>
    <h1>403 Forbidden</h1>
    <p>You do not have permission to access this resource.</p>
    <a href="/">Return to Index</a>
  </div>

</body>

</html>