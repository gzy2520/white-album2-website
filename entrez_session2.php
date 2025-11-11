<?php
session_start();

if (!isset($_SESSION['entrez_search'])) {
    header("HTTP/1.1 400 Bad Request");
    echo "Session data missing";
    exit;
}

$db = $_SESSION['entrez_search']['db'];
$term = $_SESSION['entrez_search']['term'];

// 构造NCBI请求URL
$url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" . http_build_query([
    'db' => $db,
    'term' => $term,
    'retmode' => 'xml'
]);

// 发送请求并返回结果
header('Content-Type: application/xml');
readfile($url);

// 清理SESSION数据
unset($_SESSION['entrez_search']);
exit;
?>