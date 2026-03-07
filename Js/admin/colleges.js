let colleges = [];

async function fetchColleges() {
    const collegesTableBody = document.getElementById("collegesTableBody");
    collegesTableBody.innerHTML = renderSkeletonRows(3, 4);

    try {
        const response = await apiRequest(ADMIN_ENDPOINTS.getColleges);
        colleges = response?.data?.colleges || [];
        renderColleges(colleges);
    } catch (error) {
        handleApiFailure(error, "فشل تحميل الكليات");
        console.error(error);
    }
}

function renderColleges(list) {
    const collegesTableBody = document.getElementById("collegesTableBody");
    collegesTableBody.innerHTML = "";

    if (!Array.isArray(list) || list.length === 0) {
        collegesTableBody.innerHTML = renderEmptyState(3);
        return;
    }

    list.forEach((college) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${escapeHtml(college.college_id)}</td>
            <td>${escapeHtml(college.college_name)}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editCollege(${college.college_id})">
                        <i class="bi bi-pencil-square ms-1"></i>تعديل
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCollege(${college.college_id})">
                        <i class="bi bi-trash ms-1"></i>حذف
                    </button>
                </div>
            </td>
        `;

        collegesTableBody.appendChild(tr);
    });
}

async function addCollege() {
    const collegeName = document.getElementById("collegeNameInput").value.trim();
    if (!collegeName) {
        showWarning("يرجى إدخال اسم الكلية");
        return;
    }

    try {
        await apiRequest(ADMIN_ENDPOINTS.addCollege, {
            method: "POST",
            body: { collegeName }
        });

        await showSuccess("تم إضافة الكلية بنجاح");
        document.getElementById("collegeNameInput").value = "";
        fetchColleges();
    } catch (error) {
        handleApiFailure(error, "فشل إضافة الكلية");
        console.error(error);
    }
}

async function editCollege(collegeId) {
    const { value: newName } = await Swal.fire({
        title: "الاسم الجديد للكلية",
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

    updateCollege(collegeId, newName.trim());
}

async function updateCollege(collegeId, collegeName) {
    try {
        await apiRequest(ADMIN_ENDPOINTS.updateCollege(collegeId), {
            method: "PUT",
            body: { collegeName }
        });

        await showSuccess("تم تحديث الكلية بنجاح");
        fetchColleges();
    } catch (error) {
        handleApiFailure(error, "فشل تحديث الكلية");
        console.error(error);
    }
}

async function deleteCollege(collegeId) {
    const approved = await confirmDelete("الكلية");
    if (!approved) {
        return;
    }

    try {
        await apiRequest(ADMIN_ENDPOINTS.deleteCollege(collegeId), {
            method: "DELETE"
        });

        await showSuccess("تم حذف الكلية بنجاح");
        fetchColleges();
    } catch (error) {
        handleApiFailure(error, "فشل حذف الكلية");
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", fetchColleges);