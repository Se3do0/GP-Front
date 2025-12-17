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
        renderColleges(colleges);

    } catch (err) {
        alert("فشل تحميل الكليات");
        console.error(err);
    }
}

function renderColleges(list) {
    const collegesTableBody = document.getElementById("collegesTableBody");
    collegesTableBody.innerHTML = "";

    if (!list || !list.length) {
        collegesTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted">
                    لا توجد كليات
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
        alert("يرجى إدخال اسم الكلية");
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

        alert("تم إضافة الكلية بنجاح");
        document.getElementById("collegeNameInput").value = "";
        fetchColleges();

    } catch (err) {
        alert("فشل إضافة الكلية");
        console.error("Add college error:", err);
    }
}

function editCollege(id) {
    const newName = prompt("أدخل الاسم الجديد للكلية:");
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

        alert("تم تحديث الكلية بنجاح");
        fetchColleges();

    } catch (err) {
        alert("فشل تحديث الكلية");
        console.error(err);
    }
}

async function deleteCollege(collegeId) {
    const ok = confirm("هل أنت متأكد من حذف هذه الكلية؟");
    if (!ok) return;

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

        alert("تم حذف الكلية بنجاح");
        fetchColleges();

    } catch (err) {
        alert("فشل حذف الكلية");
        console.error(err);
    }
}

// Load on page load
document.addEventListener("DOMContentLoaded", fetchColleges);