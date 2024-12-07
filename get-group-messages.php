<?php
include_once "php\config.php"; // Make sure this file connects to the database

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['group_id'])) {
    $group_id = $_POST['group_id'];

    // Query to fetch messages for a specific group
    $query = "SELECT gm.message, gm.sent_at, u.fname AS username
              FROM group_messages gm
              JOIN users u ON gm.user_id = u.user_id
              WHERE gm.group_id = '$group_id'
              ORDER BY gm.sent_at DESC";
    $result = mysqli_query($conn, $query);

    $messages = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $messages[] = $row;
    }

    echo json_encode($messages);
}
