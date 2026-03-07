const BASE_URL = "https://ghared-project-1lb7.onrender.com";

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

loginBtn.addEventListener("click", async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/Admin/AdminLogin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailInput.value.trim(),
                password: passwordInput.value.trim()
            })
        });

        const data = await res.json();

        if (data.status !== "success") throw new Error();

        localStorage.setItem("adminToken", data.data.token);
        window.location.href = "admin.html";

    } catch {
        Swal.fire({
            text: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
            icon: 'error',
            confirmButtonColor: '#219ebc'
        });
    }
});
