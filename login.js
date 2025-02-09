document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); 

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (
      storedUser &&
      storedUser.username === username &&
      storedUser.password === password
    ) {
      alert("Login Successful!");
      window.location.href = "index.html"; 
    } else {
      alert("Invalid credentials. Please try again.");
    }
  });
});
