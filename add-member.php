<?php
include_once "php\config.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['group_id'], $_POST['user_id'])) {
    $group_id = mysqli_real_escape_string($conn, $_POST['group_id']);
    $user_id = mysqli_real_escape_string($conn, $_POST['user_id']);

    // Insert the user into the group
    $query = "INSERT INTO group_members (group_id, user_id) VALUES ('$group_id', '$user_id')";
    if (mysqli_query($conn, $query)) {
        echo "User added to the group!";
    } else {
        echo "Error adding user: " . mysqli_error($conn);
    }
}
?>
