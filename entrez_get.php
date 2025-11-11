<?php
$db = $_REQUEST['db'] ?? 'pubmed';  
$term = $_REQUEST['term'] ?? '';   

$queryParams = [
    'db' => $db,
    'term' => $term,
    'retmode' => 'xml'
];
$url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" . http_build_query($queryParams);


header('Content-Type: application/xml');
readfile($url);
exit;