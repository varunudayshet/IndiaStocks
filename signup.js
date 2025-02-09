document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.querySelector("form");

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault(); 
    const fullName = document.querySelector("#fullName").value;
    const email = document.querySelector("#email").value;
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const userDetails = {
      fullName,
      email,
      username,
      password,
    };
    localStorage.setItem("user", JSON.stringify(userDetails));
    alert("Signup Successful!");
    window.location.href = "login.html"; 
  });
});
