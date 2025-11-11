<?php
$mode = $_POST['mode'] ?? 'get';
$db = $_POST['db'] ?? 'pubmed';
$term = $_POST['term'] ?? '';

// 根据模式路由到不同处理器
switch ($mode) {
    case 'get':
        include 'entrez_get.php';
        break;
    case 'post':
        include 'entrez_post.php';
        break;
    case 'session':
        include 'entrez_session.php';
        break;
    default:
        header("HTTP/1.1 400 Bad Request");
        echo "Invalid request mode";
        exit;
}
?>