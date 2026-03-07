let departments = [];
let colleges = [];

async function fetchColleges() {
    try {
        const res = await fetch(`${BASE_URL}/api/org/colleges`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
        });

        const json = await res.json();

        if (json.status !== "success") {
            throw new Error("API error");
        }

        colleges = json.data.colleges;
        populateCollegeSelect();

    } catch (err) {
        console.error("Failed to load colleges:", err);
    }
}

function populateCollegeSelect() {
    const select = document.getElementById("collegeIdInput");
    select.innerHTML = '<option value="">اختر الكلية</option>';
    colleges.forEach(college => {
        const option = document.createElement("option");
        option.value = college.college_id;
        option.textContent = college.college_name;
        select.appendChild(option);
    });
}

async function fetchDepartments() {
    const departmentsTableBody = document.getElementById("departmentsTableBody");
    departmentsTableBody.innerHTML = `
        <tr class="skeleton-row">
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
        </tr>
        <tr class="skeleton-row">
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
        </tr>
    `;

    try {
        const res = await fetch(`${BASE_URL}/api/org/departments`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
        });

        const json = await res.json();

        if (json.status !== "success") {
            throw new Error("API error");
        }

        departments = json.data.departments;
        renderDepartments(departments);

    } catch (err) {
        Swal.fire({ text: 'فشل تحميل الأقسام', icon: 'error', confirmButtonColor: '#219ebc' });
        console.error(err);
    }
}

function renderDepartments(list) {
    const departmentsTableBody = document.getElementById("departmentsTableBody");
    departmentsTableBody.innerHTML = "";

    if (!list || !list.length) {
        departmentsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-5">
                    <i class="bi bi-inbox text-muted display-4"></i>
                    <p class="text-muted fw-bold mt-2">لا توجد بيانات مسجلة حالياً</p>
                </td>
            </tr>
        `;
        return;
    }

    list.forEach(dept => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${dept.department_id}</td>
            <td>${dept.department_name}</td>
            <td>${dept.college_name || '-'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary"
                        onclick="editDepartment(${dept.department_id})">
                    تعديل
                </button>
                <button class="btn btn-sm btn-outline-danger"
                        onclick="deleteDepartment(${dept.department_id})">
                    حذف
                </button>
            </td>
        `;

        departmentsTableBody.appendChild(tr);
    });
}

async function addDepartment() {
    const name = document.getElementById("departmentNameInput").value.trim();
    const collegeId = Number(document.getElementById("collegeIdInput").value);
    const roleId = Number(document.getElementById("roleIdInput").value);

    if (!name || !collegeId || !roleId) {
        Swal.fire({ text: 'يرجى ملء جميع الحقول', icon: 'warning', confirmButtonColor: '#219ebc' });
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/api/org/departments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            },
            body: JSON.stringify({
                departmentName: name,
                collegeId: collegeId,
                roleId: roleId
            })
        });

        const data = await res.json();

        if (data.status !== "success") {
            throw new Error("Add failed");
        }

        Swal.fire({ text: 'تم إضافة القسم بنجاح', icon: 'success', confirmButtonColor: '#219ebc' });
        document.getElementById("departmentNameInput").value = "";
        document.getElementById("collegeIdInput").value = "";
        document.getElementById("roleIdInput").value = "";
        fetchDepartments();

    } catch (err) {
        Swal.fire({ text: 'فشل إضافة القسم', icon: 'error', confirmButtonColor: '#219ebc' });
        console.error(err);
    }
}

async function deleteDepartment(deptId) {
    const result = await Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', cancelButtonColor: '#6c757d', confirmButtonText: 'نعم، احذف', cancelButtonText: 'إلغاء' });
    if (!result.isConfirmed) return;

    try {
        const res = await fetch(
            `${BASE_URL}/api/org/departments/${deptId}`,
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

        Swal.fire({ text: 'تم حذف القسم بنجاح', icon: 'success', confirmButtonColor: '#219ebc' });
        fetchDepartments();

    } catch (err) {
        Swal.fire({ text: 'فشل حذف القسم', icon: 'error', confirmButtonColor: '#219ebc' });
        console.error(err);
    }
}

async function editDepartment(id) {
    const { value: newName } = await Swal.fire({
        title: 'أدخل الاسم الجديد للقسم:',
        input: 'text',
        showCancelButton: true,
        confirmButtonColor: '#219ebc',
        cancelButtonText: 'إلغاء'
    });
    if (newName && newName.trim()) {
        updateDepartment(id, newName.trim());
    }
}

async function updateDepartment(id, name) {
    try {
        const res = await fetch(
            `${BASE_URL}/api/org/departments/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                },
                body: JSON.stringify({ departmentName: name })
            }
        );

        const data = await res.json();

        if (data.status !== "success") {
            throw new Error("Update failed");
        }

        Swal.fire({ text: 'تم تحديث القسم بنجاح', icon: 'success', confirmButtonColor: '#219ebc' });
        fetchDepartments();

    } catch (err) {
        Swal.fire({ text: 'فشل تحديث القسم', icon: 'error', confirmButtonColor: '#219ebc' });
        console.error(err);
    }
}

// Load on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchDepartments();
    fetchColleges();
});