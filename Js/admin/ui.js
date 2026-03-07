const swalBaseConfig = {
	confirmButtonColor: "#219ebc",
	customClass: {
		popup: "admin-swal"
	}
};

function escapeHtml(value) {
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;"
	};

	return String(value ?? "").replace(/[&<>"']/g, (char) => map[char]);
}

function showSuccess(message, title = "تم بنجاح") {
	return Swal.fire({
		...swalBaseConfig,
		title,
		text: message,
		icon: "success"
	});
}

function showError(message, title = "حدث خطأ") {
	return Swal.fire({
		...swalBaseConfig,
		title,
		text: message,
		icon: "error"
	});
}

function showWarning(message, title = "تنبيه") {
	return Swal.fire({
		...swalBaseConfig,
		title,
		text: message,
		icon: "warning"
	});
}

async function confirmDelete(entityLabel) {
	const result = await Swal.fire({
		...swalBaseConfig,
		title: `هل تريد حذف ${entityLabel}؟`,
		text: "لا يمكن التراجع عن هذا الإجراء.",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#dc3545",
		cancelButtonColor: "#7a8a99",
		confirmButtonText: "نعم، حذف",
		cancelButtonText: "إلغاء"
	});

	return result.isConfirmed;
}

function renderSkeletonRows(columns, rowCount = 4) {
	const rows = [];

	for (let i = 0; i < rowCount; i += 1) {
		const cells = Array.from({ length: columns })
			.map(() => "<td><div class=\"skeleton-box\"></div></td>")
			.join("");

		rows.push(`<tr class=\"skeleton-row\">${cells}</tr>`);
	}

	return rows.join("");
}

function renderEmptyState(colspan, message = "لا توجد بيانات مسجلة حالياً") {
	return `
		<tr>
			<td colspan="${colspan}">
				<div class="empty-state">
					<i class="bi bi-inbox"></i>
					<div class="fw-semibold">${escapeHtml(message)}</div>
				</div>
			</td>
		</tr>
	`;
}

function handleApiFailure(error, fallbackMessage) {
	if (error && error.status === 401) {
		Swal.fire({
			...swalBaseConfig,
			title: "انتهت الجلسة",
			text: "يرجى تسجيل الدخول مرة أخرى",
			icon: "warning"
		}).then(() => {
			localStorage.removeItem("adminToken");
			window.location.href = "admin-login.html";
		});
		return;
	}

	showError(error?.message || fallbackMessage || "تعذر إكمال العملية");
}

async function adminLogout() {
	const result = await Swal.fire({
		...swalBaseConfig,
		title: "تأكيد تسجيل الخروج",
		text: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
		icon: "question",
		showCancelButton: true,
		confirmButtonText: "تسجيل الخروج",
		cancelButtonText: "إلغاء",
		confirmButtonColor: "#dc3545",
		cancelButtonColor: "#7a8a99"
	});

	if (!result.isConfirmed) {
		return;
	}

	localStorage.removeItem("adminToken");
	window.location.href = "admin-login.html";
}

window.escapeHtml = escapeHtml;
window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.confirmDelete = confirmDelete;
window.renderSkeletonRows = renderSkeletonRows;
window.renderEmptyState = renderEmptyState;
window.handleApiFailure = handleApiFailure;
window.adminLogout = adminLogout;
