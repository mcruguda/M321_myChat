document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("registerForm")
    .addEventListener("submit", async () => {
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
      // const data = await response.json();
      // if (data?.token) {
      //   localStorage.setItem("user", JSON.stringify(data.user));
      //   localStorage.setItem("token", data.token);
      //   window.location.href = "/";
      // } else {
      //   errorText.innerText = data;
      // }
    });
});
