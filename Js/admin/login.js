const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(
      "https://ghared-project-1lb7.onrender.com/api/users/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // SAVE TOKEN
    localStorage.setItem("token", data.token);

    // REDIRECT TO INBOX (GP-Front page)
    window.location.href = "../html/inbox.html";
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});
