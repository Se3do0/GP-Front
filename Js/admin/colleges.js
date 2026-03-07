let colleges = [];

async function fetchColleges() {
    const collegesTableBody = document.getElementById("collegesTableBody");
    collegesTableBody.innerHTML = `
        <tr class="skeleton-row">
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
        </tr>
        <tr class="skeleton-row">
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
        </tr>
        <tr class="skeleton-row">
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
            <td><div class="skeleton-box"></div></td>
        </tr>
    `;

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
        renderColleges(colleges);

    } catch (err) {
        Swal.fire({ text: 'فشل تحميل الكليات', icon: 'error', confirmButtonColor: '#219ebc' });
        console.error(err);
    }
}

function renderColleges(list) {
    const collegesTableBody = document.getElementById("collegesTableBody");
    collegesTableBody.innerHTML = "";

    if (!list || !list.length) {
        collegesTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-5">
                    <i class="bi bi-inbox text-muted display-4"></i>
                    <p class="text-muted fw-bold mt-2">لا توجد بيانات مسجلة حالياً</p>
                </td>
            </tr>
        `;
        return;
    }

    list.forEach(college => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${college.college_id}</td>
            <td>${college.college_name}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary"
                        onclick="editCollege(${college.college_id})">
                    تعديل
                </button>
                <button class="btn btn-sm btn-outline-danger"
                        onclick="deleteCollege(${college.college_id})">
                    حذف
                </button>
            </td>
        `;

        collegesTableBody.appendChild(tr);
    });
}

async function addCollege() {
    const name = document.getElementById("collegeNameInput").value.trim();
    if (!name) {
        Swal.fire({ text: 'يرجى إدخال اسم الكلية', icon: 'warning', confirmButtonColor: '#219ebc' });
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/api/org/colleges`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            },
            body: JSON.stringify({
                collegeName: name
            })
        });

        const data = await res.json();

        if (data.status !== "success") {
            console.error("API returned error:", data);
            throw new Error("Add failed");
        }

        Swal.fire({ text: 'تم إضافة الكلية بنجاح', icon: 'success', confirmButtonColor: '#219ebc' });
        document.getElementById("collegeNameInput").value = "";
        fetchColleges();

    } catch (err) {
        Swal.fire({ text: 'فشل إضافة الكلية', icon: 'error', confirmButtonColor: '#219ebc' });
        console.error("Add college error:", err);
    }
}

async function editCollege(id) {
    const { value: newName } = await Swal.fire({
        title: 'أدخل الاسم الجديد للكلية:',
        input: 'text',
        showCancelButton: true,
        confirmButtonColor: '#219ebc',
        cancelButtonText: 'إلغاء'
    });
    if (newName && newName.trim()) {
        updateCollege(id, newName.trim());
    }
}

async function updateCollege(id, name) {
    try {
        const res = await fetch(
            `${BASE_URL}/api/org/colleges/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                },
                body: JSON.stringify({ collegeName: name })
            }
        );

        const data = await res.json();

        if (data.status !== "success") {
            throw new Error("Update failed");
        }

        Swal.fire({ text: 'تم تحديث الكلية بنجاح', icon: 'success', confirmButtonColor: '#219ebc' });
        fetchColleges();

    } catch (err) {
        Swal.fire({ text: 'فشل تحديث الكلية', icon: 'error', confirmButtonColor: '#219ebc' });
        console.error(err);
    }
}

async function deleteCollege(collegeId) {
    const result = await Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', cancelButtonColor: '#6c757d', confirmButtonText: 'نعم، احذف', cancelButtonText: 'إلغاء' });
    if (!result.isConfirmed) return;

    try {
        const res = await fetch(
            `${BASE_URL}/api/org/colleges/${collegeId}`,
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

        Swal.fire({ text: 'تم حذف الكلية بنجاح', icon: 'success', confirmButtonColor: '#219ebc' });
        fetchColleges();

    } catch (err) {
        Swal.fire({ text: 'فشل حذف الكلية', icon: 'error', confirmButtonColor: '#219ebc' });
        console.error(err);
    }
}

// Load on page load
document.addEventListener("DOMContentLoaded", fetchColleges);