<?php
include_once "php\config.php"; // Make sure this file connects to the database

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['group_name']) && isset($_POST['members'])) {
    $group_name = mysqli_real_escape_string($conn, $_POST['group_name']);
    $created_by = $_SESSION['user_id']; // Assuming the user ID of the creator is stored in the session
    $members = $_POST['members']; // Array of member IDs
    
    // Insert group data into `groups` table
    $query = "INSERT INTO groups (group_name, created_by) VALUES ('$group_name', '$created_by')";
    if (mysqli_query($conn, $query)) {
        $group_id = mysqli_insert_id($conn); // Get the newly created group ID

        // Insert the group creator as a member
        $query = "INSERT INTO group_members (group_id, user_id) VALUES ('$group_id', '$created_by')";
        mysqli_query($conn, $query);

        // Insert other members into `group_members` table
        foreach ($members as $member_id) {
            $query = "INSERT INTO group_members (group_id, user_id) VALUES ('$group_id', '$member_id')";
            mysqli_query($conn, $query);
        }

        echo json_encode(['success' => true, 'message' => 'Group created successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error creating group.']);
    }
}
