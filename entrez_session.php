<?php
session_start();

// 存储数据到SESSION
$_SESSION['entrez_search'] = [
    'db' => $_POST['db'] ?? 'pubmed',
    'term' => $_POST['term'] ?? ''
];

// 重定向到第二阶段处理器
header('Location: entrez_session2.php');
exit;
?>