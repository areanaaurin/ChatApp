const searchBar = document.querySelector(".search input"),
searchIcon = document.querySelector(".search button"),
usersList = document.querySelector(".users-list");

searchIcon.onclick = ()=>{//toggle search bar visibility
  searchBar.classList.toggle("show");
  searchIcon.classList.toggle("active");
  searchBar.focus();
  if(searchBar.classList.contains("active")){
    searchBar.value = "";
    searchBar.classList.remove("active");
  }
}

searchBar.onkeyup = ()=>{//search bar query handling
  let searchTerm = searchBar.value;
  if(searchTerm != ""){
    searchBar.classList.add("active");//searchbar khali na hole active
  }else{
    searchBar.classList.remove("active");
  }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/search.php", true);//a request is sent to search.php
  xhr.onload = ()=>{
    if(xhr.readyState === XMLHttpRequest.DONE){
        if(xhr.status === 200){
          let data = xhr.response;
          usersList.innerHTML = data;
        }
    }
  }
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("searchTerm=" + searchTerm);
}

setInterval(() =>{//updates user list periodically in every 500ms
//In this case, the function inside the interval is responsible for sending a request to the server to fetch the list of users.

  let xhr = new XMLHttpRequest();
  xhr.open("GET", "php/users.php", true);
  xhr.onload = ()=>{
    if(xhr.readyState === XMLHttpRequest.DONE){
        if(xhr.status === 200){
          let data = xhr.response;
          if(!searchBar.classList.contains("active")){//jodi searchbar active na thake, tahole page ke refresh korbe(mane userlist update korbe)
            usersList.innerHTML = data;
          }
        }
    }
  }
  xhr.send();
}, 500);
//This prepares the AJAX request:
// "GET": This is the HTTP method being used. A GET request is used to fetch data from the server.
// "php/users.php": This is the file on the server that will handle the request. In this case, users.php is responsible for retrieving the updated list of users.
// true: This means the request is asynchronous, so the code execution will not pause while waiting for the server's response.

