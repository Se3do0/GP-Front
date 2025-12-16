// document.addEventListener('DOMContentLoaded', () => {
//     // تعريف العناصر من الـ HTML
//     const loginForm = document.querySelector('.login-form');
//     const loginButton = document.querySelector('.login-button');
//     const passwordInput = document.getElementById('password');
//     const passwordToggle = document.getElementById('password-toggle');
//     const errorMessageDiv = document.getElementById('error-message');
//     const contactButton = document.querySelector('.contact-button');

//     // رابط الـ API الحقيقي للمشروع
//     const API_ENDPOINT = 'https://ghared-project-1lb7.onrender.com/api/users/login';

//     // --- دالة إظهار رسالة الخطأ ---
//     function displayError(message) {
//         errorMessageDiv.textContent = message;
//         errorMessageDiv.style.display = 'block';
//         // إضافة أنيميشن بسيط للظهور
//         errorMessageDiv.style.animation = 'none';
//         errorMessageDiv.offsetHeight; /* trigger reflow */
//         errorMessageDiv.style.animation = 'fadeIn 0.3s ease-out';
//     }

//     // --- دالة مسح رسالة الخطأ ---
//     function clearError() {
//         errorMessageDiv.textContent = '';
//         errorMessageDiv.style.display = 'none';
//     }

//     // --- تشغيل/إيقاف رؤية كلمة المرور (أيقونة العين) ---
//     if (passwordToggle) {
//         passwordToggle.addEventListener('click', () => {
//             // لو النوع password خليه text والعكس
//             const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//             passwordInput.setAttribute('type', type);

//             // تغيير شكل الأيقونة
//             passwordToggle.classList.toggle('fa-eye');
//             passwordToggle.classList.toggle('fa-eye-slash');
//         });
//     }

//     // --- دالة التعامل مع الـ API (Login Logic) ---
//     async function handleLogin(email, password) {
//         clearError(); // امسح أي خطأ قديم

//         // 1. تغيير حالة الزرار عشان اليوزر يعرف إنه بيحمل
//         loginButton.disabled = true;
//         loginButton.textContent = 'جاري تسجيل الدخول...';

//         try {
//             // 2. إرسال الطلب للسيرفر
//             const response = await fetch(API_ENDPOINT, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 // تحويل البيانات لـ JSON
//                 body: JSON.stringify({
//                     email: email,       // المفتاح هنا لازم يكون email
//                     password: password
//                 })
//             });

//             // 3. استقبال الرد وتحويله لـ JSON
//             const responseData = await response.json();

//             if (response.ok) {
//                 // --- حالة النجاح (Success) ---

//                 // أ) تخزين التوكن (بناءً على الـ Response الجديد اللي في الصورة)
//                 // التوكن موجود جوه data.token
//                 if (responseData.data && responseData.data.token) {
//                     localStorage.setItem('token', responseData.data.token);
//                 }

//                 // ب) تخزين بيانات اليوزر (لو موجودة)
//                 if (responseData.data) {
//                     // بنخزن الـ data كلها احتياطي لو فيها معلومات اليوزر
//                     localStorage.setItem('user', JSON.stringify(responseData.data));
//                 }

//                 // ج) التحقق من التوجيه (أول مرة ولا دخول عادي)
//                 if (responseData.method === 'PUT') {
//                     // الحالة الأولى: أول مرة يسجل دخول (تحديث بيانات)
//                     alert(responseData.message); // "تسجيل الدخول الأول - يرجى تحديث الملف الشخصي"
//                     window.location.href = 'update.html'; // يروح لصفحة التحديث
//                 } else {
//                     // الحالة الثانية: دخول عادي (يوزر قديم)
//                     window.location.href = 'main.html'; // يروح للصفحة الرئيسية
//                 }

//             } else {
//                 // --- حالة الفشل (Error) ---
//                 // اعرض الرسالة اللي جاية من السيرفر أو رسالة عامة
//                 const message = responseData.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
//                 displayError(message);
//             }

//         } catch (error) {
//             // --- مشاكل الشبكة (Network Error) ---
//             console.error('Login Error:', error);
//             displayError('حدث خطأ في الاتصال بالسيرفر. تأكد من اتصالك بالإنترنت.');
//         } finally {
//             // 4. إرجاع الزرار لحالته الأصلية
//             loginButton.disabled = false;
//             loginButton.textContent = 'تسجيل دخول';
//         }
//     }

//     // --- الاستماع لحدث الـ Submit للفورم ---
//     if (loginForm) {
//         loginForm.addEventListener('submit', function (event) {
//             event.preventDefault(); // منع إعادة تحميل الصفحة

//             // هات العناصر هنا عشان نتأكد إننا بنجيب أحدث قيمة
//             const emailInput = document.getElementById('email');

//             // التأكد إن العناصر موجودة في الصفحة
//             if (!emailInput || !passwordInput) return;

//             const emailVal = emailInput.value.trim();
//             const passVal = passwordInput.value.trim();

//             // تحقق بسيط إن الحقول مش فاضية
//             if (emailVal === '' || passVal === '') {
//                 displayError('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
//                 return;
//             }

//             // استدعاء دالة اللوجين
//             handleLogin(emailVal, passVal);
//         });
//     }

//     // --- زر "تواصل معنا" (اختياري) ---

// });
// -----------------------------------------------------------------------------
// document.addEventListener('DOMContentLoaded', () => {
//     // تعريف العناصر
//     const loginForm = document.querySelector('.login-form');
//     const loginButton = document.querySelector('.login-button');
//     const errorMessageDiv = document.getElementById('error-message');
//     const passwordInput = document.getElementById('password');
//     const passwordToggle = document.getElementById('password-toggle');

//     // رابط الـ API
//     const API_ENDPOINT = 'https://ghared-project-1lb7.onrender.com/api/users/login';

//     // --- إعدادات عرض الأخطاء ---
//     function displayError(message) {
//         if (errorMessageDiv) {
//             errorMessageDiv.textContent = message;
//             errorMessageDiv.style.display = 'block';
//         } else {
//             alert(message);
//         }
//     }

//     function clearError() {
//         if (errorMessageDiv) {
//             errorMessageDiv.style.display = 'none';
//         }
//     }

//     // --- زرار إظهار الباسورد ---
//     if (passwordToggle) {
//         passwordToggle.addEventListener('click', () => {
//             const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//             passwordInput.setAttribute('type', type);
//             passwordToggle.classList.toggle('fa-eye');
//             passwordToggle.classList.toggle('fa-eye-slash');
//         });
//     }

//     // --- دالة اللوجين الرئيسية ---
//     async function handleLogin(email, password) {
//         clearError();
//         loginButton.disabled = true;
//         loginButton.textContent = 'جاري الدخول...';

//         try {
//             const response = await fetch(API_ENDPOINT, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email: email, password: password })
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 // 1. تخزين التوكن
//                 if (data.data && data.data.token) {
//                     localStorage.setItem('token', data.data.token);
//                 }

//                 // تخزين بيانات اليوزر (لو موجودة)
//                 if (data.data) {
//                     localStorage.setItem('user', JSON.stringify(data.data));
//                 }

//                 // 2. التوجيه (Routing)
//                 if (data.method === 'PUT') {
//                     // يوزر جديد -> صفحة التحديث
//                     window.location.href = 'update.html';
//                 } else {
//                     // يوزر قديم -> الصفحة الرئيسية
//                     window.location.href = 'main.html';
//                 }

//             } else {
//                 // بيانات غلط
//                 const message = data.message || 'البيانات غير صحيحة';
//                 displayError(message);
//             }

//         } catch (error) {
//             console.error(error);
//             displayError('خطأ في الاتصال بالسيرفر');
//         } finally {
//             loginButton.disabled = false;
//             loginButton.textContent = 'تسجيل دخول';
//         }
//     }

//     // --- تشغيل الفورم ---
//     if (loginForm) {
//         loginForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const email = document.getElementById('email').value.trim();
//             const password = document.getElementById('password').value.trim();

//             if (!email || !password) {
//                 displayError('الرجاء إدخال البيانات كاملة');
//                 return;
//             }

//             handleLogin(email, password);
//         });
//     }
// });




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
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
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
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();

            if (response.ok) {
                // 1. تخزين التوكن
                if (data.data && data.data.token) {
                    localStorage.setItem('token', data.data.token);
                }

                // تخزين بيانات اليوزر
                if (data.data) {
                    localStorage.setItem('user', JSON.stringify(data.data));
                }

                // 2. التوجيه (Routing) مع الرسالة
                if (data.method === 'PUT') {
                    // --- هنا رجعنا الـ Alert ---
                    // الرسالة: "تسجيل الدخول الأول - يرجى تحديث الملف الشخصي"
                    alert(data.message || "يرجى تحديث بياناتك للمتابعة");

                    // يوزر جديد -> صفحة التحديث
                    window.location.href = 'update.html';
                } else {
                    // يوزر قديم -> الصفحة الرئيسية
                    window.location.href = 'main.html';
                }

            } else {
                // بيانات غلط
                const message = data.message || 'البيانات غير صحيحة';
                displayError(message);
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