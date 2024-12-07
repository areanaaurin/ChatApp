<?php 
  session_start();
  include_once "php/config.php";//er moddhe database connections ache

  // Check if session is valid (user is logged in),mane session er moddhe user_id ache kina
  if(!isset($_SESSION['unique_id'])){
    header("location: login.php");//na thakle login korte bolbe
    exit(); // Ensure the script stops after redirect
  }
?>

<?php include_once "header.php"; ?> 
<!-- er moddhe common html structures thake -->




<body>
  <div class="wrapper">
    <section class="chat-area">
      <header>
        <?php 
          // Check if user_id is set in the URL and sanitize it
          if (isset($_GET['user_id'])) {
            $user_id = mysqli_real_escape_string($conn, $_GET['user_id']);
            
            // Ensure user_id is not empty
            if (!empty($user_id)) {
              // Fetch user details from the database
              $sql = mysqli_query($conn, "SELECT * FROM users WHERE unique_id = '{$user_id}'");
              
              // Check if the query returned any results
              if (mysqli_num_rows($sql) > 0) {
                $row = mysqli_fetch_assoc($sql);
              } else {
                // Redirect if no user is found with the given user_id
                header("location: users.php");
                exit();
              }
            } else {
              // Redirect if user_id is empty
              header("location: users.php");
              exit();
            }
          } else {
            // Redirect if user_id is not set in the URL
            header("location: users.php");
            exit();
          }
        ?>


        <!-- ekta back icon thakbe -->
        <a href="users.php" class="back-icon"><i class="fas fa-arrow-left"></i></a>
        <img src="php/images/<?php echo $row['img']; ?>" alt="">
        <div class="details">
          <span><?php echo $row['fname'] . " " . $row['lname']; ?></span>
          <p><?php echo $row['status']; ?></p>
        </div>
      </header>

      
      <!-- Chat Messages -->
      <div class="chat-box">
        <!-- Chat messages will be dynamically loaded here -->
      </div>

      <!-- Additional Chat Controls -->
      <div class="chat-controls">
        <button class="clear-chat-btn">Clear Chat</button>
        <button class="block-user-btn">Block User</button>
        <button class="report-user-btn">Report User</button>
        <input type="file" class="image-input">
        <button class="send-image-btn">Send Image</button>
      </div>



      <!-- ekhane message textbox e input hishebe nibe, form er moddhe -->
      <form action="#" class="typing-area">
        <input type="text" class="incoming_id" name="incoming_id" value="<?php echo $user_id; ?>" hidden>
        <input type="text" name="message" class="input-field" placeholder="Type a message here..." autocomplete="off">
        <button><i class="fab fa-telegram-plane"></i></button>
      </form>
    </section>
  </div>


  <!-- chat interactions handle korbe chat.js -->
  <script src="javascript/chat.js"></script>
</body>
</html>


<!-- $conn: database er shathe connection, eta normally onno ekta file e defined tahke, ekhane config.php te define kora ache -->
<!-- mysqli_real_escape_string():sanitize kore input ke, mane special characters duur rakhe -->
<!-- mysqli_query(): executes a query -->
<!-- mysqli_num_rows(): returns the numbers of rows (retrived from the database by SQL) ..... ekhon etar 0 theke boro howar mane holo ei user_id wala keu database e exist kore, 0 hole to exist korenaa-->
<!-- mysqli_fetch_assoc(): fetches a row from the result set of a query as an associative array. -->


<?php
// Clear Chat History Functionality
if (isset($_POST['clear_chat'])) {
    $incoming_id = mysqli_real_escape_string($conn, $_POST['incoming_id']);
    $outgoing_id = mysqli_real_escape_string($conn, $_POST['outgoing_id']);
    
    // Delete chat messages for the given user pair
    $delete_query = "DELETE FROM messages WHERE (incoming_msg_id = '{$incoming_id}' AND outgoing_msg_id = '{$outgoing_id}') OR (incoming_msg_id = '{$outgoing_id}' AND outgoing_msg_id = '{$incoming_id}')";
    if (mysqli_query($conn, $delete_query)) {
        echo "Chat history cleared successfully.";
    } else {
        echo "Failed to clear chat history.";
    }
    exit();
}
?>


<?php
// Block User Functionality
if (isset($_POST['block_user'])) {
    $blocker_id = mysqli_real_escape_string($conn, $_POST['blocker_id']);
    $blocked_id = mysqli_real_escape_string($conn, $_POST['blocked_id']);

    // Insert blocked user into a separate table
    $block_query = "INSERT INTO blocked_users (blocker_id, blocked_id) VALUES ('{$blocker_id}', '{$blocked_id}')";
    if (mysqli_query($conn, $block_query)) {
        echo "User blocked successfully.";
    } else {
        echo "Failed to block user.";
    }
    exit();
}

// Report User Functionality
if (isset($_POST['report_user'])) {
    $reporter_id = mysqli_real_escape_string($conn, $_POST['reporter_id']);
    $reported_id = mysqli_real_escape_string($conn, $_POST['reported_id']);
    $reason = mysqli_real_escape_string($conn, $_POST['reason']);

    // Insert report details into a reports table
    $report_query = "INSERT INTO reports (reporter_id, reported_id, reason) VALUES ('{$reporter_id}', '{$reported_id}', '{$reason}')";
    if (mysqli_query($conn, $report_query)) {
        echo "User reported successfully.";
    } else {
        echo "Failed to report user.";
    }
    exit();
}
?>


<?php
// Image Sending Functionality
if (isset($_FILES['image'])) {
    $incoming_id = mysqli_real_escape_string($conn, $_POST['incoming_id']);
    $outgoing_id = mysqli_real_escape_string($conn, $_POST['outgoing_id']);
    $image_name = $_FILES['image']['name'];
    $image_tmp_name = $_FILES['image']['tmp_name'];

    // File upload path
    $upload_dir = "uploads/";
    $upload_file = $upload_dir . basename($image_name);
    if (move_uploaded_file($image_tmp_name, $upload_file)) {
        // Save the file path in the database
        $insert_query = "INSERT INTO messages (incoming_msg_id, outgoing_msg_id, msg, msg_type) VALUES ('{$incoming_id}', '{$outgoing_id}', '{$upload_file}', 'image')";
        if (mysqli_query($conn, $insert_query)) {
            echo "Image sent successfully.";
        } else {
            echo "Failed to save image message.";
        }
    } else {
        echo "Failed to upload image.";
    }
    exit();
}
?>


<?php
// Reactions Functionality
if (isset($_POST['react_to_message'])) {
    $message_id = mysqli_real_escape_string($conn, $_POST['message_id']);
    $reaction = mysqli_real_escape_string($conn, $_POST['reaction']);

    // Update the message with the selected reaction
    $reaction_query = "UPDATE messages SET reaction = '{$reaction}' WHERE id = '{$message_id}'";
    if (mysqli_query($conn, $reaction_query)) {
        echo "Reaction added successfully.";
    } else {
        echo "Failed to add reaction.";
    }
    exit();
}
?>
