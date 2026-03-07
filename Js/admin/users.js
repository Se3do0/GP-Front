let users = [];

function getUsersRoleLabel(roleLevel) {
    const roleMap = {
        0: "مسؤول النظام",
        1: "مدير",
        2: "موظف",
        3: "مسؤول"
    };

    return roleMap[roleLevel] ?? roleLevel;
}

async function fetchUsers() {
    const usersTableBody = document.getElementById("usersTableBody");
    usersTableBody.innerHTML = renderSkeletonRows(5, 4);

    try {
        const response = await apiRequest(ADMIN_ENDPOINTS.getUsers);
        users = response?.data?.users || [];
        renderUsers(users);
    } catch (error) {
        handleApiFailure(error, "فشل تحميل المستخدمين");
        console.error(error);
    }
}

function renderUsers(list) {
    const usersTableBody = document.getElementById("usersTableBody");
    usersTableBody.innerHTML = "";

    if (!Array.isArray(list) || list.length === 0) {
        usersTableBody.innerHTML = renderEmptyState(5);
        return;
    }

    list.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${escapeHtml(user.full_name)}</td>
            <td dir="ltr">${escapeHtml(user.email)}</td>
            <td>${escapeHtml(getUsersRoleLabel(user.role_level))}</td>
            <td>${escapeHtml(user.department_name || "-")}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editUser(${user.user_id})">
                        <i class="bi bi-pencil-square ms-1"></i>تعديل
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.user_id})">
                        <i class="bi bi-trash ms-1"></i>حذف
                    </button>
                </div>
            </td>
        `;

        usersTableBody.appendChild(tr);
    });
}

async function deleteUser(userId) {
    const approved = await confirmDelete("المستخدم");
    if (!approved) {
        return;
    }

    try {
        await apiRequest(ADMIN_ENDPOINTS.deleteUser(userId), { method: "DELETE" });
        await showSuccess("تم حذف المستخدم بنجاح");
        fetchUsers();
    } catch (error) {
        handleApiFailure(error, "فشل حذف المستخدم");
        console.error(error);
    }
}

function editUser(id) {
    window.location.href = `user-form.html?id=${id}`;
}

document.addEventListener("DOMContentLoaded", fetchUsers);
