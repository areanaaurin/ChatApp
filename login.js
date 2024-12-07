const form = document.querySelector(".login form"),
continueBtn = form.querySelector(".button input"),
errorText = form.querySelector(".error-text");

form.onsubmit = (e)=>{
    e.preventDefault();
}


//On clicking the login button, a POST request is sent to login.php. If the login is successful, the user is redirected to users.php. Otherwise, an error message is displayed.
continueBtn.onclick = ()=>{
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/login.php", true);
    xhr.onload = ()=>{
      if(xhr.readyState === XMLHttpRequest.DONE){
          if(xhr.status === 200){
              let data = xhr.response;
              if(data === "success"){
                location.href = "users.php";
              }else{
                errorText.style.display = "block";
                errorText.textContent = data;
              }
          }
      }
    }
    let formData = new FormData(form);
    xhr.send(formData);
}

// Delete Account--new
const deleteAccountBtn = document.querySelector(".delete-account-btn");

if (deleteAccountBtn) {
    deleteAccountBtn.onclick = () => {
        if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "php/login.php", true);
            xhr.onload = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        let response = xhr.response;
                        alert(response); // Notify user of success/failure
                        if (response === "Account deleted successfully.") {
                            location.href = "index.php"; // Redirect to the homepage
                        }
                    }
                }
            };
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("delete_account=true&user_id=" + user_id);
        }
    };
}
