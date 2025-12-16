const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const pageTitle = document.getElementById("pageTitle");
const submitBtn = document.getElementById("submitBtn");
const passwordHint = document.getElementById("passwordHint");

const fullNameInput = document.getElementById("fullNameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const roleInput = document.getElementById("roleSelect");
const departmentInput = document.getElementById("departmentInput");

const token = localStorage.getItem("adminToken");

/* ================= HELPER ================= */
async function handleApiResponse(res) {
    const data = await res.json();

    if (data.status !== "success") {
        throw new Error(data.message || "حدث خطأ غير متوقع");
    }

    return data;
}

/* ================= UPDATE MODE ================= */
if (userId) {
    pageTitle.textContent = "تعديل بيانات المستخدم";
    submitBtn.textContent = "تحديث البيانات";
    passwordHint.textContent = "اتركها فارغة في حالة عدم التغيير";

    // Optional UX improvement
    emailInput.disabled = true;

    loadUserData(userId);
}

/* ================= LOAD USER DATA ================= */
async function loadUserData(id) {
    try {
        const res = await fetch(`${BASE_URL}/api/Admin/getAllUsers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await handleApiResponse(res);

        const user = data.data.users.find(u => u.user_id == id);

        if (!user) {
            throw new Error("المستخدم غير موجود");
        }

        fullNameInput.value = user.full_name;
        emailInput.value = user.email;
        roleInput.value = String(user.role_level);
        departmentInput.value = user.department_id ?? "";


    } catch (err) {
        alert(err.message);
    }
}

/* ================= SUBMIT ================= */
submitBtn.addEventListener("click", async () => {

    if (!roleInput.value) {
        alert("من فضلك اختر الدور الوظيفي");
        return;
    }

    const payload = {
        roleId: Number(roleInput.value),
        departmentId: Number(departmentInput.value)
    };

    if (fullNameInput.value.trim()) {
        payload.fullName = fullNameInput.value.trim();
    }

    if (passwordInput.value.trim()) {
        payload.password = passwordInput.value.trim();
    }

    try {
        if (userId) {
            await updateUser(userId, payload);
        } else {
            payload.email = emailInput.value.trim();
            await addUser(payload);
        }

        alert("تم حفظ البيانات بنجاح");
        window.location.href = "admin.html";

    } catch (err) {
        alert(err.message);
    }
});

/* ================= API ================= */
async function addUser(payload) {
    const res = await fetch(`${BASE_URL}/api/Admin/AddUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    await handleApiResponse(res);
}

async function updateUser(id, payload) {
    const res = await fetch(`${BASE_URL}/api/Admin/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    await handleApiResponse(res);
}
