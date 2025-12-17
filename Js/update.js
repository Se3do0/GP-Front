document.addEventListener("DOMContentLoaded", () => {
  console.log("Update Page Loaded...");

  const form = document.getElementById("personal-data-form");
  const submitButton = document.querySelector(".submit-button");
  const notificationContainer = document.getElementById(
    "notification-container"
  );

  // 1. التحقق من التوكن
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // 2. تعبئة الإيميل تلقائياً
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      if (userData.email) {
        const emailInput = document.getElementById("email");
        if (emailInput) emailInput.value = userData.email;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  const API_ENDPOINT =
    "https://ghared-project-1lb7.onrender.com/api/users/profile/update";

  // دالة الإشعارات
  function showNotification(message, type = "success") {
    // لو مفيش كونتينر، نعرض Alert عادي عشان اليوزر يشوف الرسالة
    if (!notificationContainer) {
      alert(message);
      return;
    }

    const notification = document.createElement("div");
    notification.className = `alert alert-${
      type === "success" ? "success" : "danger"
    } position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = "9999"; // رقم كبير عشان يظهر فوق كل حاجة
    notification.textContent = message;
    notificationContainer.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // --- التعامل مع الـ Submit ---
  if (form) {
    form.addEventListener("submit", async (event) => {
      console.log("Submit button clicked!"); // تأكيد إن الزرار شغال
      event.preventDefault();

      // تعريف العناصر
      const usernameInput = document.getElementById("username");
      const emailInput = document.getElementById("email");
      const mobileInput = document.getElementById("mobile");
      const passwordInput = document.getElementById("password");
      const confirmPasswordInput = document.getElementById("confirm-password"); // خانة التأكيد
      const fileInput = document.getElementById("profile-picture");

      // --- التحقق من صحة البيانات (Validation) ---

      // 1. تأكد إن الإيميل موجود
      if (!emailInput) {
        alert("خطأ تقني: خانة البريد الإلكتروني غير موجودة (تأكد من ملف HTML)");
        return;
      }

      // 2. التحقق من تطابق الباسورد (الجزء الجديد)
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (password && password.trim() !== "") {
        if (password !== confirmPassword) {
          showNotification(
            "كلمة المرور وتأكيد كلمة المرور غير متطابقين!",
            "error"
          );
          return; // وقف الكود هنا ومتبعتش للسيرفر
        }
        if (password.length < 6) {
          showNotification("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
          return;
        }
      }

      // --- تجهيز البيانات للإرسال ---
      const formData = new FormData();
      formData.append("fullName", usernameInput.value);
      formData.append("email", emailInput.value);
      formData.append("mobileNumber", mobileInput.value);

      // لو كاتب باسورد (وعدى من التحقق فوق) ابعته
      if (password && password.trim() !== "") {
        formData.append("password", password);
      }

      if (fileInput && fileInput.files[0]) {
        formData.append("profileImage", fileInput.files[0]);
      }

      // قفل الزرار
      submitButton.disabled = true;
      submitButton.textContent = "جاري الحفظ...";

      try {
        console.log("Sending data to API..."); // تأكيد بدء الاتصال
        const response = await fetch(API_ENDPOINT, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        console.log("Response status:", response.status); // حالة الرد
        const data = await response.json();

        if (response.ok) {
          showNotification("تم تحديث البيانات بنجاح!", "success");

          if (data.data) {
            localStorage.setItem("user", JSON.stringify(data.data));
          }

          setTimeout(() => {
            window.location.href = "home.html";
          }, 1500);
        } else {
          showNotification(data.message || "فشل التحديث", "error");
          console.log("API Error:", data); // عشان نشوف الخطأ في الكونسول
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        showNotification("خطأ في الاتصال بالسيرفر", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "تحديث البيانات الشخصية";
      }
    });
  } else {
    console.error("Form element not found!"); // لو الفورم مش مقرية أصلاً
  }
});
