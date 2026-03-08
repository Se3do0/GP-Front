let departments = [];
let colleges = [];

async function fetchColleges() {
    try {
        const response = await apiRequest(ADMIN_ENDPOINTS.getColleges);
        colleges = response?.data?.colleges || [];
        populateCollegeSelect();
    } catch (error) {
        handleApiFailure(error, "فشل تحميل الكليات");
        console.error(error);
    }
}

function populateCollegeSelect() {
    const select = document.getElementById("collegeIdInput");
    select.innerHTML = '<option value="">اختر الكلية</option>';

    colleges.forEach((college) => {
        const option = document.createElement("option");
        option.value = college.college_id;
        option.textContent = college.college_name;
        select.appendChild(option);
    });
}

async function fetchDepartments() {
    const departmentsTableBody = document.getElementById("departmentsTableBody");
    departmentsTableBody.innerHTML = renderSkeletonRows(4, 4);

    try {
        const response = await apiRequest(ADMIN_ENDPOINTS.getDepartments);
        departments = response?.data?.departments || [];
        renderDepartments(departments);
    } catch (error) {
        handleApiFailure(error, "فشل تحميل الأقسام");
        console.error(error);
    }
}

function renderDepartments(list) {
    const departmentsTableBody = document.getElementById("departmentsTableBody");
    departmentsTableBody.innerHTML = "";

    if (!Array.isArray(list) || list.length === 0) {
        departmentsTableBody.innerHTML = renderEmptyState(4);
        return;
    }

    list.forEach((department) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${escapeHtml(department.department_id)}</td>
            <td>${escapeHtml(department.department_name)}</td>
            <td>${escapeHtml(department.college_name || "-")}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editDepartment(${department.department_id})">
                        <i class="bi bi-pencil-square ms-1"></i>تعديل
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDepartment(${department.department_id})">
                        <i class="bi bi-trash ms-1"></i>حذف
                    </button>
                </div>
            </td>
        `;

        departmentsTableBody.appendChild(tr);
    });
}

async function addDepartment() {
    const departmentName = document.getElementById("departmentNameInput").value.trim();
    const collegeId = Number(document.getElementById("collegeIdInput").value);
    const roleId = Number(document.getElementById("roleIdInput").value);

    if (!departmentName || !collegeId || !roleId) {
        showWarning("يرجى ملء جميع الحقول");
        return;
    }

    try {
        await apiRequest(ADMIN_ENDPOINTS.addDepartment, {
            method: "POST",
            body: {
                departmentName,
                collegeId,
                roleId
            }
        });

        await showSuccess("تم إضافة القسم بنجاح");
        document.getElementById("departmentNameInput").value = "";
        document.getElementById("collegeIdInput").value = "";
        document.getElementById("roleIdInput").value = "";
        fetchDepartments();
    } catch (error) {
        handleApiFailure(error, "فشل إضافة القسم");
        console.error(error);
    }
}

async function deleteDepartment(departmentId) {
    const approved = await confirmDelete("القسم");
    if (!approved) {
        return;
    }

    try {
        await apiRequest(ADMIN_ENDPOINTS.deleteDepartment(departmentId), {
            method: "DELETE"
        });

        await showSuccess("تم حذف القسم بنجاح");
        fetchDepartments();
    } catch (error) {
        handleApiFailure(error, "فشل حذف القسم");
        console.error(error);
    }
}

async function editDepartment(departmentId) {
    const { value: newName } = await Swal.fire({
        title: "الاسم الجديد للقسم",
        input: "text",
        inputPlaceholder: "أدخل الاسم الجديد",
        showCancelButton: true,
        confirmButtonText: "حفظ",
        cancelButtonText: "إلغاء",
        confirmButtonColor: "#219ebc"
    });

    if (!newName || !newName.trim()) {
        return;
    }

    updateDepartment(departmentId, newName.trim());
}

async function updateDepartment(departmentId, departmentName) {
    try {
        await apiRequest(ADMIN_ENDPOINTS.updateDepartment(departmentId), {
            method: "PUT",
            body: { departmentName }
        });

        await showSuccess("تم تحديث القسم بنجاح");
        fetchDepartments();
    } catch (error) {
        handleApiFailure(error, "فشل تحديث القسم");
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchDepartments();
    fetchColleges();
});