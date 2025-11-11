<?php
$db = $_POST['db'] ?? 'pubmed';
$term = $_POST['term'] ?? '';

// 构造NCBI请求URL
$baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";
$postData = http_build_query([
    'db' => $db,
    'term' => $term,
    'retmode' => 'xml'
]);

// 使用cURL发送POST请求
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

// 返回结果
header('Content-Type: application/xml');
echo $response;
exit;
?>