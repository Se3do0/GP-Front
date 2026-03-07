const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const pageTitle = document.getElementById("pageTitle");
const fullNameInput = document.getElementById("fullNameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const roleInput = document.getElementById("roleInput");
const roleField = document.getElementById("roleField");
const departmentInput = document.getElementById("departmentInput");

let departments = [];

if (userId) {
    pageTitle.textContent = "تعديل بيانات المستخدم";
} else {
    roleField.style.display = "none";
}

async function fetchDepartments() {
    try {
        const response = await apiRequest(ADMIN_ENDPOINTS.getDepartments);
        departments = response?.data?.departments || [];
        populateDepartmentSelect();

        if (userId) {
            loadUserData(userId);
        }
    } catch (error) {
        handleApiFailure(error, "فشل تحميل الإدارات");
        console.error(error);
    }
}

function populateDepartmentSelect() {
    departmentInput.innerHTML = '<option value="">اختر الإدارة</option>';

    departments.forEach((department) => {
        const option = document.createElement("option");
        option.value = department.department_id;
        option.textContent = `${department.department_name}${department.college_name ? ` (${department.college_name})` : ""}`;
        departmentInput.appendChild(option);
    });
}

async function loadUserData(id) {
    try {
        const response = await apiRequest(ADMIN_ENDPOINTS.getUsers);
        const user = (response?.data?.users || []).find((item) => String(item.user_id) === String(id));

        if (!user) {
            showError("المستخدم غير موجود");
            return;
        }

        fullNameInput.value = user.full_name || "";
        emailInput.value = user.email || "";
        roleInput.value = user.role_level ?? "";
        departmentInput.value = user.department_id ?? "";
    } catch (error) {
        handleApiFailure(error, "فشل تحميل بيانات المستخدم");
        console.error(error);
    }
}

async function submitForm() {
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const departmentId = Number(departmentInput.value);

    if (!fullName || !email || !departmentId) {
        showWarning("يرجى استكمال الحقول الأساسية");
        return;
    }

    const payload = {
        fullName,
        email,
        departmentId
    };

    if (password) {
        payload.password = password;
    }

    if (userId) {
        const roleId = Number(roleInput.value);
        if (!roleId && roleId !== 0) {
            showWarning("يرجى إدخال رقم المستوى");
            return;
        }

        payload.roleId = roleId;
        updateUser(userId, payload);
    } else {
        addUser(payload);
    }
}

async function addUser(payload) {
    try {
        await apiRequest(ADMIN_ENDPOINTS.addUser, {
            method: "POST",
            body: payload
        });

        await showSuccess("تم إضافة المستخدم بنجاح");
        window.location.href = "admin.html";
    } catch (error) {
        handleApiFailure(error, "فشل إضافة المستخدم");
        console.error(error);
    }
}

async function updateUser(id, payload) {
    try {
        await apiRequest(ADMIN_ENDPOINTS.updateUser(id), {
            method: "PUT",
            body: payload
        });

        await showSuccess("تم تحديث بيانات المستخدم");
        window.location.href = "admin.html";
    } catch (error) {
        handleApiFailure(error, "فشل تحديث المستخدم");
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", fetchDepartments);
