const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");

async function loginAdmin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showWarning("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    const originalText = loginBtn.textContent;
    loginBtn.disabled = true;
    loginBtn.textContent = "جاري تسجيل الدخول...";

    try {
        const response = await apiRequest(ADMIN_ENDPOINTS.login, {
            method: "POST",
            body: { email, password },
            requiresAuth: false
        });

        localStorage.setItem("adminToken", response?.data?.token || "");
        window.location.href = "admin.html";
    } catch (error) {
        showError(error?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة", "فشل تسجيل الدخول");
        console.error(error);
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = originalText;
    }
}

loginBtn?.addEventListener("click", loginAdmin);

passwordInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        loginAdmin();
    }
});
