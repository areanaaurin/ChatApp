<?php
include_once "php\config.php"; // Make sure this file connects to the database

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['group_id']) && isset($_POST['message'])) {
    $group_id = $_POST['group_id'];
    $message = mysqli_real_escape_string($conn, $_POST['message']);
    $sent_by = $_SESSION['user_id']; // Assuming the user ID of the sender is stored in the session

    // Insert the message into the `group_messages` table
    $query = "INSERT INTO group_messages (group_id, user_id, message) VALUES ('$group_id', '$sent_by', '$message')";
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send message.']);
    }
}
