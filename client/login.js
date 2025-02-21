document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("usernameInputLogin").value;
      const password = document.getElementById("passwordInputLogin").value;
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        if (data?.token) {
          localStorage.setItem("token", data.token);
        } else {
          errorText.innerText = data;
        }

        window.location.href = "/";
      } else if (response.status == 401) {
        document.getElementById("error-msg").innerText =
          "Benutzer oder Passwort falsch";
      } else if (response.status == 404 || response.status == 500) {
        document.getElementById("error-msg").innerText =
          "Server nicht erreichbar, probieren sie später nochmal";
      } else {
        document.getElementById("error-msg").innerText =
          "Ein Fehler ist aufgetretten";
      }
    });
});
