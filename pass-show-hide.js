const pswrdField = document.querySelector(".form input[type='password']"),//ekhane password likhe
toggleIcon = document.querySelector(".form .field i");//the icon used to toggle the visibility (toggleIcon).

toggleIcon.onclick = () =>{
  if(pswrdField.type === "password"){
    pswrdField.type = "text";//text hole dekhte parbo
    toggleIcon.classList.add("active");//oi icon ta active
  }else{
    pswrdField.type = "password";
    toggleIcon.classList.remove("active");
  }
}
