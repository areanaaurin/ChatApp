// group-chat.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("send-message-form");
    const messageBox = document.getElementById("message");
    const messageContainer = document.getElementById("group-messages");

    // Function to fetch messages
    function fetchMessages() {
        const groupId = 1; // You need to set this dynamically based on the group
        fetch('get-group-messages.php?group_id=' + groupId)
            .then(response => response.json())
            .then(data => {
                messageContainer.innerHTML = ''; // Clear previous messages
                data.forEach(message => {
                    const msgDiv = document.createElement("div");
                    msgDiv.textContent = message.username + ": " + message.message;
                    messageContainer.appendChild(msgDiv);
                });
            });
    }

    // Call fetchMessages on page load
    fetchMessages();

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = messageBox.value.trim();
        if (message) {
            // Send message to server
            fetch('send-group-message.php', {
                method: 'POST',
                body: JSON.stringify({
                    group_id: 1, // Dynamic group ID
                    message: message
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    messageBox.value = ''; // Clear message input
                    fetchMessages(); // Fetch new messages after sending
                })
                .catch(error => console.error('Error:', error));
        }
    });
});
