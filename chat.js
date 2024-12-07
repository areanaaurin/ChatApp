// eta chet page e real-time chat interactions handle kore


//elements ke select kortese
const form = document.querySelector(".typing-area"),//chat form
incoming_id = form.querySelector(".incoming_id").value,//current chat recipient er ID hold kore rakhe
inputField = form.querySelector(".input-field"),//the field where we will type the messages
sendBtn = form.querySelector("button"),//send button
chatBox = document.querySelector(".chat-box");//where the messages are displayed

// For group chat functionality
const createGroupForm = document.querySelector(".create-group-form"); // Form to create group
const groupNameInput = document.querySelector("#group-name"); // Input field for group name
const groupChatBox = document.querySelector(".group-chat-box"); // Group chat messages display
const groupInputField = document.querySelector(".group-input-field"); // Input for group message
const groupSendBtn = document.querySelector(".group-send-btn"); // Button to send group message
let activeGroupId = null; // Track the currently active group for chat


// Scroll to the bottom function
function scrollToBottom(box) {
    box.scrollTop = box.scrollHeight;
}


form.onsubmit = (e)=>{
    e.preventDefault();//Prevents the form's default submission behavior to handle sending data via AJAX instead.
}

inputField.focus();
inputField.onkeyup = ()=>{//checks if the message is typed or not, send button gets activated when any message is typed.
    if(inputField.value != ""){
        sendBtn.classList.add("active");
    }else{
        sendBtn.classList.remove("active");
    }
}

sendBtn.onclick = ()=>{//when the send button is clicked, a POST request is sent to insert-chat.php.....jeta form data ke server e pathay (jate chat message ke database e insert kora jay)
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/insert-chat.php", true);
    xhr.onload = ()=>{
      if(xhr.readyState === XMLHttpRequest.DONE){
          if(xhr.status === 200){
              inputField.value = "";
              scrollToBottom(chatBox);//nije nije scroll kore ekdom bottom jayga(thikthak message database e gele ar ki...)
          }
      }
    }
    let formData = new FormData(form);
    xhr.send(formData);//eije send korche
}



chatBox.onmouseenter = ()=>{
    chatBox.classList.add("active");
}

chatBox.onmouseleave = ()=>{//when the cursor leaves the boundary
    chatBox.classList.remove("active");
}
//The idea is that if the user has moved their mouse out of the chat area (indicating they might not be focused on reading), you can reset the active state to allow auto-scrolling again.



setInterval(() =>{//in every 500ms, it fetches the latest chat messages from get-chat.php and updates the chat box.
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/get-chat.php", true);
    xhr.onload = ()=>{
      if(xhr.readyState === XMLHttpRequest.DONE){
          if(xhr.status === 200){
            let data = xhr.response;
            chatBox.innerHTML = data;
            if(!chatBox.classList.contains("active")){//jate older message porar somoy barbar autoscroll na hoy
                scrollToBottom(chatBox);
              }
          }
      }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("incoming_id="+incoming_id);//+ is concatenating strings
}, 500);



// Create a new group
createGroupForm.onsubmit = (e) => {
    e.preventDefault();
    const groupName = groupNameInput.value.trim();
    if (groupName) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "create-group.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                const response = JSON.parse(xhr.response);
                if (response.success) {
                    alert(`Group "${groupName}" created successfully!`);
                    groupNameInput.value = ""; // Clear input
                } else {
                    alert(response.error || "Failed to create group.");
                }
            }
        };
        const formData = new FormData();
        formData.append("group_name", groupName);
        xhr.send(formData);
    } else {
        alert("Group name cannot be empty.");
    }
};

// Send a message to a group
groupSendBtn.onclick = () => {
    const message = groupInputField.value.trim();
    if (message && activeGroupId) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "send-group-message.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                const response = JSON.parse(xhr.response);
                if (response.success) {
                    groupInputField.value = ""; // Clear the input field
                    fetchGroupMessages(activeGroupId); // Refresh messages
                } else {
                    alert(response.error || "Failed to send message.");
                }
            }
        };
        const formData = new FormData();
        formData.append("group_id", activeGroupId);
        formData.append("message", message);
        xhr.send(formData);
    } else {
        alert("Message cannot be empty or no group selected.");
    }
};

// Fetch messages for the active group
function fetchGroupMessages(groupId) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "get-group-messages.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const response = JSON.parse(xhr.response);
            if (response.error) {
                alert(response.error);
            } else {
                groupChatBox.innerHTML = ""; // Clear the current messages
                response.forEach((msg) => {
                    const messageElement = document.createElement("div");
                    messageElement.classList.add("message");
                    messageElement.innerHTML = `
                        <strong>${msg.username}:</strong> ${msg.message}
                        <span class="time">${msg.sent_at}</span>
                    `;
                    groupChatBox.appendChild(messageElement);
                });
                scrollToBottom(groupChatBox);
            }
        }
    };
    const formData = new FormData();
    formData.append("group_id", groupId);
    xhr.send(formData);
}

// Switch to a group chat (example function to set active group)
function switchToGroup(groupId) {
    activeGroupId = groupId;
    fetchGroupMessages(groupId);
    groupChatBox.style.display = "block"; // Show group chat box
    chatBox.style.display = "none"; // Hide individual chat box
}

// Periodically fetch group messages
setInterval(() => {
    if (activeGroupId) {
        fetchGroupMessages(activeGroupId);
    }
}, 500); // Update every 500ms


// Clear Chat History
const clearChatBtn = document.querySelector(".clear-chat-btn");

if (clearChatBtn) {
    clearChatBtn.onclick = () => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "php/chat.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let response = xhr.response;
                    alert(response); // Notify user of success/failure
                    if (response === "Chat history cleared successfully.") {
                        chatBox.innerHTML = ""; // Clear chat messages in the UI
                    }
                }
            }
        };
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("clear_chat=true&incoming_id=" + incoming_id + "&outgoing_id=" + outgoing_id);
    };
}



// Block User
const blockUserBtn = document.querySelector(".block-user-btn");

if (blockUserBtn) {
    blockUserBtn.onclick = () => {
        if (confirm("Are you sure you want to block this user?")) {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "php/chat.php", true);
            xhr.onload = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        alert(xhr.response); // Notify user of success/failure
                    }
                }
            };
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("block_user=true&blocker_id=" + outgoing_id + "&blocked_id=" + incoming_id);
        }
    };
}

// Report User
const reportUserBtn = document.querySelector(".report-user-btn");

if (reportUserBtn) {
    reportUserBtn.onclick = () => {
        let reason = prompt("Please enter the reason for reporting this user:");
        if (reason) {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "php/chat.php", true);
            xhr.onload = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        alert(xhr.response); // Notify user of success/failure
                    }
                }
            };
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("report_user=true&reporter_id=" + outgoing_id + "&reported_id=" + incoming_id + "&reason=" + encodeURIComponent(reason));
        }
    };
}



// Image Sending
const imageInput = document.querySelector(".image-input");
const imageSendBtn = document.querySelector(".send-image-btn");

if (imageInput && imageSendBtn) {
    imageSendBtn.onclick = () => {
        let formData = new FormData(form);
        let imageFile = imageInput.files[0];

        if (imageFile) {
            formData.append("image", imageFile);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "php/chat.php", true);
            xhr.onload = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        let response = xhr.response;
                        alert(response); // Notify user of success/failure
                        if (response === "Image sent successfully.") {
                            imageInput.value = ""; // Reset the file input
                        }
                    }
                }
            };
            xhr.send(formData); // Send the image and form data
        } else {
            alert("Please select an image to send.");
        }
    };
}

  