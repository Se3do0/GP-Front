const loginForm = document.getElementById("login-form");

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value?.trim();

  if (!email || !password) {
    showWarning("يرجى إدخال البريد الإلكتروني وكلمة المرور");
    return;
  }

  try {
    const response = await apiRequest(ADMIN_ENDPOINTS.login, {
      method: "POST",
      body: { email, password },
      requiresAuth: false
    });

    localStorage.setItem("adminToken", response?.data?.token || "");
    window.location.href = "admin.html";
  } catch (error) {
    showError(error?.message || "فشل تسجيل الدخول");
    console.error(error);
  }
});
