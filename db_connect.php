<?php
$servername = "localhost";
$username = "root";
$password = ""; // Mặc định XAMPP không có pass
$dbname = "english_game_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>