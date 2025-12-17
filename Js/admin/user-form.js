const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const pageTitle = document.getElementById("pageTitle");
const fullNameInput = document.getElementById("fullNameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const roleInput = document.getElementById("roleInput");
const departmentInput = document.getElementById("departmentInput");

const token = localStorage.getItem("adminToken");
let departments = [];

// لو Update
if (userId) {
    pageTitle.textContent = "تعديل بيانات المستخدم";
    loadUserData(userId);
} else {
    // Hide role input for add
    document.getElementById("roleInput").parentElement.style.display = 'none';
}

async function fetchDepartments() {
    try {
        const res = await fetch(`${BASE_URL}/api/org/departments`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const json = await res.json();

        if (json.status !== "success") {
            throw new Error("API error");
        }

        departments = json.data.departments;
        populateDepartmentSelect();

    } catch (err) {
        console.error("Failed to load departments:", err);
    }
}

function populateDepartmentSelect() {
    departmentInput.innerHTML = '<option value="">اختر الإدارة</option>';
    departments.forEach(dept => {
        const option = document.createElement("option");
        option.value = dept.department_id;
        option.textContent = `${dept.department_name}${dept.college_name ? ` (${dept.college_name})` : ''}`;
        departmentInput.appendChild(option);
    });
}

/* ================= LOAD USER ================= */
async function loadUserData(id) {
    try {
        const res = await fetch(`${BASE_URL}/api/Admin/getAllUsers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const json = await res.json();
        const user = json.data.users.find(u => u.user_id == id);

        if (!user) return alert("المستخدم غير موجود");

        fullNameInput.value = user.full_name;
        emailInput.value = user.email;
        roleInput.value = user.role_level;
        departmentInput.value = user.department_id ?? "";

    } catch {
        alert("فشل تحميل بيانات المستخدم");
    }
}

/* ================= SUBMIT ================= */
async function submitForm() {
    const payload = {
        email: emailInput.value,
        departmentId: Number(departmentInput.value)
    };

    if (fullNameInput.value.trim()) {
        payload.fullName = fullNameInput.value;
    }

    if (passwordInput.value.trim()) {
        payload.password = passwordInput.value;
    }

    if (userId) {
        payload.roleId = Number(roleInput.value);
        await updateUser(userId, payload);
    } else {
        await addUser(payload);
    }
}

/* ================= API ================= */

async function addUser(payload) {
    try {
        const res = await fetch(`${BASE_URL}/api/Admin/AddUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.status !== "success") throw new Error();

        alert("تم إضافة المستخدم بنجاح");
        window.location.href = "admin.html";

    } catch {
        alert("فشل إضافة المستخدم");
    }
}

async function updateUser(id, payload) {
    try {
        const res = await fetch(
            `${BASE_URL}/api/Admin/users/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await res.json();
        if (data.status !== "success") throw new Error();

        alert("تم تحديث بيانات المستخدم");
        window.location.href = "admin.html";

    } catch {
        alert("فشل تحديث المستخدم");
    }
}

// Load departments on page load
document.addEventListener("DOMContentLoaded", fetchDepartments);
