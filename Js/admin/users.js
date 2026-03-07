async function fetchUsers() {
    const usersTableBody = document.getElementById("usersTableBody");
    usersTableBody.innerHTML = `
        <tr class="skeleton-row">
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
        </tr>
        <tr class="skeleton-row">
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
        </tr>
        <tr class="skeleton-row">
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
        </tr>
    `;

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
        Swal.fire({ text: 'فشل تحميل المستخدمين', icon: 'error', confirmButtonColor: '#219ebc' });
        console.error(err);
    }
}

function renderUsers(list) {
    const usersTableBody = document.getElementById("usersTableBody");
    usersTableBody.innerHTML = "";

    if (!list || !list.length) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5">
                    <i class="bi bi-inbox text-muted display-4"></i>
                    <p class="text-muted fw-bold mt-2">لا توجد بيانات مسجلة حالياً</p>
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
    const result = await Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', cancelButtonColor: '#6c757d', confirmButtonText: 'نعم، احذف', cancelButtonText: 'إلغاء' });
    if (!result.isConfirmed) return;

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

        Swal.fire({ text: 'تم حذف المستخدم بنجاح', icon: 'success', confirmButtonColor: '#219ebc' });
        fetchUsers();

    } catch (err) {
        Swal.fire({ text: 'فشل حذف المستخدم', icon: 'error', confirmButtonColor: '#219ebc' });
        console.error(err);
    }
}

function editUser(id) {
    window.location.href = `user-form.html?id=${id}`;
}
