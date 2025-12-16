async function fetchUsers() {
    try {
        const res = await fetch(`${BASE_URL}/api/Admin/getAllUsers`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
        });

        const json = await res.json();

        if (json.status !== "success") {
            throw new Error("API error");
        }

        users = json.data.users;
        renderUsers(users);

    } catch (err) {
        alert("فشل تحميل المستخدمين");
        console.error(err);
    }
}

function renderUsers(list) {
    usersTableBody.innerHTML = "";

    if (!list || !list.length) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    لا يوجد مستخدمون
                </td>
            </tr>
        `;
        return;
    }

    const roleMap = {
        0: "مسؤول النظام",
        1: "مدير",
        2: "موظف",
        3: "مسؤول"
    };

    list.forEach(user => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${user.full_name}</td>
            <td>${user.email}</td>
            <td>${roleMap[user.role_level] ?? user.role_level}</td>
            <td>${user.department_name}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary"
                        onclick="editUser(${user.user_id})">
                    تعديل
                </button>
                <button class="btn btn-sm btn-outline-danger"
                        onclick="deleteUser(${user.user_id})">
                    حذف
                </button>
            </td>
        `;

        usersTableBody.appendChild(tr);
    });
}

async function deleteUser(userId) {
    const ok = confirm("هل أنت متأكد من حذف هذا المستخدم؟");
    if (!ok) return;

    try {
        const res = await fetch(
            `${BASE_URL}/api/Admin/users/${userId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            }
        );

        const data = await res.json();

        if (data.status !== "success") {
            throw new Error("Delete failed");
        }

        alert("تم حذف المستخدم بنجاح");
        fetchUsers();

    } catch (err) {
        alert("فشل حذف المستخدم");
        console.error(err);
    }
}

function editUser(id) {
    window.location.href = `user-form.html?id=${id}`;
}


