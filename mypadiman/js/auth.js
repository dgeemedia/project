// js/auth.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
      loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        // Basic example: store login details in localStorage
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        // In production, this should be a call to your backend API for authentication
        if (email && password) {
          localStorage.setItem("user", JSON.stringify({ email }));
          window.location.href = "dashboard.html";
        }
      });
    }
  });
  