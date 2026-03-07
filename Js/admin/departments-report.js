const performanceTableBody = document.getElementById("departmentsPerformanceTableBody");
const refreshReportBtn = document.getElementById("refreshReportBtn");

const departmentsCountValue = document.getElementById("departmentsCountValue");
const totalReceivedValue = document.getElementById("totalReceivedValue");
const pendingTotalValue = document.getElementById("pendingTotalValue");

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ar-EG");
}

function getPerformanceBadge(totalReceived, pendingTransactions) {
  const received = Number(totalReceived || 0);
  const pending = Number(pendingTransactions || 0);

  if (received === 0 && pending === 0) {
    return '<span class="badge rounded-pill text-bg-secondary">بدون نشاط</span>';
  }

  if (pending > 0) {
    return '<span class="badge rounded-pill text-bg-danger">يحتاج متابعة</span>';
  }

  return '<span class="badge rounded-pill text-bg-success">ممتاز</span>';
}

function renderSummary(departments) {
  const totalDepartments = departments.length;
  const totalReceived = departments.reduce((acc, item) => acc + Number(item.total_received || 0), 0);
  const totalPending = departments.reduce((acc, item) => acc + Number(item.pending_transactions || 0), 0);

  departmentsCountValue.textContent = formatNumber(totalDepartments);
  totalReceivedValue.textContent = formatNumber(totalReceived);
  pendingTotalValue.textContent = formatNumber(totalPending);
}

function renderDepartmentsPerformance(list) {
  performanceTableBody.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    performanceTableBody.innerHTML = renderEmptyState(6);
    renderSummary([]);
    return;
  }

  const sorted = [...list].sort((a, b) => Number(b.total_received || 0) - Number(a.total_received || 0));

  sorted.forEach((department, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${escapeHtml(index + 1)}</td>
      <td>${escapeHtml(department.department_id)}</td>
      <td>${escapeHtml(department.department_name || "-")}</td>
      <td><span class="metric-chip">${formatNumber(department.total_received)}</span></td>
      <td><span class="metric-chip pending">${formatNumber(department.pending_transactions)}</span></td>
      <td>${getPerformanceBadge(department.total_received, department.pending_transactions)}</td>
    `;

    performanceTableBody.appendChild(tr);
  });

  renderSummary(sorted);
}

async function fetchDepartmentsPerformanceReport() {
  performanceTableBody.innerHTML = renderSkeletonRows(6, 6);

  try {
    const response = await apiRequest(ADMIN_ENDPOINTS.departmentsPerformanceReport);
    const departments = response?.data?.departments || [];
    renderDepartmentsPerformance(departments);
  } catch (error) {
    handleApiFailure(error, "فشل تحميل تقرير أداء الأقسام");
    console.error(error);
  }
}

refreshReportBtn?.addEventListener("click", fetchDepartmentsPerformanceReport);
document.addEventListener("DOMContentLoaded", fetchDepartmentsPerformanceReport);
