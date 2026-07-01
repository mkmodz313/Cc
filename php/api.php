<?php
/**
 * MKMODZ - BACKEND BYPASS PHP INTERCEPT PROXY
 * Optional backend proxy for PHP-supported hosting environments
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$action = isset($_GET['action']) ? $_GET['action'] : '';
$url = isset($_GET['url']) ? $_GET['url'] : '';
$format = isset($_GET['format']) ? $_GET['format'] : '720';

if ($action === 'search' && !empty($url)) {
    $api_target = "https://apis.davidcyriltech.my.id/youtube/search?query=" . urlencode($url);
} else if ($action === 'download' && !empty($url)) {
    $api_target = "https://apis.davidcyriltech.my.id/download/savetube?url=" . urlencode($url) . "&format=" . urlencode($format);
} else {
    echo json_encode(["success" => false, "error" => "Invalid proxy action parameters."]);
    exit;
}

// Intercept with cURL node
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_target);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200 && $response) {
    echo $response;
} else {
    echo json_encode(["success" => false, "error" => "Target intercept bypass node failed."]);
}
?>
