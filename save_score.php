<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db_connect.php';

// Nhận dữ liệu JSON từ React gửi sang
$data = json_decode(file_get_contents("php://input"));

if(isset($data->username) && isset($data->game_type) && isset($data->score)) {
    $user = $conn->real_escape_string($data->username);
    $game = $conn->real_escape_string($data->game_type);
    $score = $data->score;

    $sql = "INSERT INTO scores (username, game_type, score) VALUES ('$user', '$game', '$score')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Score saved successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}

$conn->close();
?>