document.addEventListener("DOMContentLoaded", () => {
    const updateForm = document.getElementById("update-form");
    const submitBtn = document.getElementById("updateBtn");
    const errorDiv = document.getElementById("error-message");

    const API_ENDPOINT = "https://ghared-project-1lb7.onrender.com/api/users/update";

    function showError(msg) {
        if (errorDiv) {
            errorDiv.textContent = msg;
            errorDiv.style.display = "block";
        } else {
            alert(msg);
        }
    }

    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = "جاري الحفظ...";

        try {
            const token = localStorage.getItem("token");

            const formData = {
                name: document.getElementById("name").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                department: document.getElementById("department").value.trim()
            };

            const res = await fetch(API_ENDPOINT, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                showError(data.message || "فشل تحديث البيانات");
                return;
            }

            // ✅ SUCCESS → INBOX
            window.location.href = "inbox.html";

        } catch (err) {
            console.error(err);
            showError("خطأ في الاتصال بالسيرفر");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "حفظ";
        }
    });
});
