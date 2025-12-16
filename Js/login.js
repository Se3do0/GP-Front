document.addEventListener('DOMContentLoaded', () => {
    // تعريف العناصر
    const loginForm = document.querySelector('.login-form');
    const loginButton = document.querySelector('.login-button');
    const errorMessageDiv = document.getElementById('error-message');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');

    // رابط الـ API
    const API_ENDPOINT = 'https://ghared-project-1lb7.onrender.com/api/users/login';

    // --- إعدادات عرض الأخطاء ---
    function displayError(message) {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
        } else {
            alert(message);
        }
    }

    function clearError() {
        if (errorMessageDiv) {
            errorMessageDiv.style.display = 'none';
        }
    }

    // --- زرار إظهار الباسورد ---
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password'
                ? 'text'
                : 'password';

            passwordInput.setAttribute('type', type);
            passwordToggle.classList.toggle('fa-eye');
            passwordToggle.classList.toggle('fa-eye-slash');
        });
    }

    // --- دالة اللوجين الرئيسية ---
    async function handleLogin(email, password) {
        clearError();
        loginButton.disabled = true;
        loginButton.textContent = 'جاري الدخول...';

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {

                // 1️⃣ تخزين التوكن
                if (data?.data?.token) {
                    localStorage.setItem('token', data.data.token);
                }

                // 2️⃣ تخزين بيانات اليوزر
                if (data?.data) {
                    localStorage.setItem('user', JSON.stringify(data.data));
                }

                // 3️⃣ التوجيه (Routing)
                if (data.method === 'PUT') {
                    // أول تسجيل دخول
                    alert(data.message || "يرجى تحديث بياناتك للمتابعة");
                    window.location.href = 'update.html';
                } else {
                    // تسجيل دخول عادي → Inbox
                    window.location.href = 'inbox.html';
                }

            } else {
                displayError(data.message || 'البيانات غير صحيحة');
            }

        } catch (error) {
            console.error(error);
            displayError('خطأ في الاتصال بالسيرفر');
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'تسجيل دخول';
        }
    }

    // --- تشغيل الفورم ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                displayError('الرجاء إدخال البيانات كاملة');
                return;
            }

            handleLogin(email, password);
        });
    }
});
