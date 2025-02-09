document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    // Get user input from the form using IDs
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    // Get stored user details from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // Validate the login
    if (
      storedUser &&
      storedUser.username === username &&
      storedUser.password === password
    ) {
      alert("Login Successful!");
      window.location.href = "index.html"; // Redirect to the dashboard page
    } else {
      alert("Invalid credentials. Please try again.");
    }
  });
});
