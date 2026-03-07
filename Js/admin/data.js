const BASE_URL = "https://ghared-project-1lb7.onrender.com";

const ADMIN_ENDPOINTS = {
	login: "/api/Admin/AdminLogin",
	getUsers: "/api/Admin/getAllUsers",
	addUser: "/api/Admin/AddUser",
	updateUser: (id) => `/api/Admin/users/${id}`,
	deleteUser: (id) => `/api/Admin/users/${id}`,
	getDepartments: "/api/org/departments",
	addDepartment: "/api/org/departments",
	updateDepartment: (id) => `/api/org/departments/${id}`,
	deleteDepartment: (id) => `/api/org/departments/${id}`,
	getColleges: "/api/org/colleges",
	addCollege: "/api/org/colleges",
	updateCollege: (id) => `/api/org/colleges/${id}`,
	deleteCollege: (id) => `/api/org/colleges/${id}`
};

function getAdminToken() {
	return localStorage.getItem("adminToken");
}

function buildHeaders({ requiresAuth, hasBody }) {
	const headers = {};
	if (hasBody) {
		headers["Content-Type"] = "application/json";
	}

	if (requiresAuth) {
		const token = getAdminToken();
		if (!token) {
			const tokenError = new Error("غير مصرح بالوصول");
			tokenError.status = 401;
			throw tokenError;
		}
		headers.Authorization = `Bearer ${token}`;
	}

	return headers;
}

async function parseResponseBody(response) {
	const contentType = response.headers.get("content-type") || "";
	if (!contentType.includes("application/json")) {
		return {};
	}

	try {
		return await response.json();
	} catch {
		return {};
	}
}

async function apiRequest(endpoint, options = {}) {
	const {
		method = "GET",
		body,
		requiresAuth = true
	} = options;

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		method,
		headers: buildHeaders({ requiresAuth, hasBody: body !== undefined }),
		body: body === undefined ? undefined : JSON.stringify(body)
	});

	const data = await parseResponseBody(response);

	if (!response.ok || (data.status && data.status !== "success")) {
		const message = data.message || "تعذر إكمال الطلب";
		const error = new Error(message);
		error.status = response.status;
		error.payload = data;

		if (response.status === 401) {
			localStorage.removeItem("adminToken");
		}

		throw error;
	}

	return data;
}

window.BASE_URL = BASE_URL;
window.ADMIN_ENDPOINTS = ADMIN_ENDPOINTS;
window.apiRequest = apiRequest;
