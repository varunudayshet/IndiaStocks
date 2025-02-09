document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.querySelector("form");

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    // Get user input values
    const fullName = document.querySelector("#fullName").value;
    const email = document.querySelector("#email").value;
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;

    // Validate that the passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Store user details in localStorage
    const userDetails = {
      fullName,
      email,
      username,
      password,
    };

    // Save the user details to localStorage
    localStorage.setItem("user", JSON.stringify(userDetails));

    // Success message and redirect
    alert("Signup Successful!");
    window.location.href = "login.html"; // Redirect to login page
  });
});
