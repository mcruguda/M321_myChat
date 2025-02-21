document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("registerForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("usernameInput").value;
      const birthday = document.getElementById("birthdayInput").value;
      const password = document.getElementById("passwordInput").value;
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, birthday, password }),
      });
      if (response.status === 200) {
        window.location.href = "/login";
      }
    });
});
