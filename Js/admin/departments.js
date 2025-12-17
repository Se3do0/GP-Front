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
        alert("فشل تحميل الأقسام");
        console.error(err);
    }
}

function renderDepartments(list) {
    const departmentsTableBody = document.getElementById("departmentsTableBody");
    departmentsTableBody.innerHTML = "";

    if (!list || !list.length) {
        departmentsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    لا توجد أقسام
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
        alert("يرجى ملء جميع الحقول");
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

        alert("تم إضافة القسم بنجاح");
        document.getElementById("departmentNameInput").value = "";
        document.getElementById("collegeIdInput").value = "";
        document.getElementById("roleIdInput").value = "";
        fetchDepartments();

    } catch (err) {
        alert("فشل إضافة القسم");
        console.error(err);
    }
}

async function deleteDepartment(deptId) {
    const ok = confirm("هل أنت متأكد من حذف هذا القسم؟");
    if (!ok) return;

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

        alert("تم حذف القسم بنجاح");
        fetchDepartments();

    } catch (err) {
        alert("فشل حذف القسم");
        console.error(err);
    }
}

function editDepartment(id) {
    // For now, perhaps open a prompt or something, or redirect to edit page
    const newName = prompt("أدخل الاسم الجديد للقسم:");
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

        alert("تم تحديث القسم بنجاح");
        fetchDepartments();

    } catch (err) {
        alert("فشل تحديث القسم");
        console.error(err);
    }
}

// Load on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchDepartments();
    fetchColleges();
});