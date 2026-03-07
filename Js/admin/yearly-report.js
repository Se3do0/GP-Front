const refreshYearlyReportBtn = document.getElementById("refreshYearlyReportBtn");
const monthlyProgressTableBody = document.getElementById("monthlyProgressTableBody");
const statusBreakdownTableBody = document.getElementById("statusBreakdownTableBody");

const yearlyTotalValue = document.getElementById("yearlyTotalValue");
const activeMonthsValue = document.getElementById("activeMonthsValue");
const statusTypesValue = document.getElementById("statusTypesValue");

function formatNum(value) {
  return Number(value || 0).toLocaleString("ar-EG");
}

function monthLabel(value) {
  if (!value || typeof value !== "string") {
    return "-";
  }

  const [year, month] = value.split("-");
  return `${month}/${year}`;
}

function renderYearlySummary(data) {
  const monthlyProgress = Array.isArray(data?.monthly_progress) ? data.monthly_progress : [];
  const statusBreakdown = data?.yearly_status_breakdown || {};

  yearlyTotalValue.textContent = formatNum(data?.total_yearly_transactions);
  activeMonthsValue.textContent = formatNum(monthlyProgress.length);
  statusTypesValue.textContent = formatNum(Object.keys(statusBreakdown).length);
}

function renderMonthlyProgress(monthlyProgress) {
  monthlyProgressTableBody.innerHTML = "";

  if (!Array.isArray(monthlyProgress) || monthlyProgress.length === 0) {
    monthlyProgressTableBody.innerHTML = renderEmptyState(3, "لا توجد بيانات شهرية متاحة");
    return;
  }

  const maxCount = Math.max(...monthlyProgress.map((item) => Number(item.transactions_count || 0)), 1);

  monthlyProgress.forEach((item) => {
    const count = Number(item.transactions_count || 0);
    const percentage = Math.round((count / maxCount) * 100);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(monthLabel(item.month))}</td>
      <td><span class="metric-chip">${formatNum(count)}</span></td>
      <td>
        <div class="progress-strip">
          <div class="progress-strip-value" style="width: ${percentage}%"></div>
        </div>
      </td>
    `;

    monthlyProgressTableBody.appendChild(tr);
  });
}

function renderStatusBreakdown(statusBreakdown) {
  statusBreakdownTableBody.innerHTML = "";

  const entries = Object.entries(statusBreakdown || {});
  if (entries.length === 0) {
    statusBreakdownTableBody.innerHTML = renderEmptyState(3, "لا توجد بيانات حالات متاحة");
    return;
  }

  const total = entries.reduce((acc, [, count]) => acc + Number(count || 0), 0);

  entries.sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0));

  entries.forEach(([statusLabel, count]) => {
    const countNumber = Number(count || 0);
    const ratio = total > 0 ? ((countNumber / total) * 100).toFixed(1) : "0.0";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(statusLabel)}</td>
      <td><span class="metric-chip">${formatNum(countNumber)}</span></td>
      <td><span class="status-ratio">${escapeHtml(ratio)}%</span></td>
    `;

    statusBreakdownTableBody.appendChild(tr);
  });
}

async function fetchYearlyProgressReport() {
  monthlyProgressTableBody.innerHTML = renderSkeletonRows(3, 4);
  statusBreakdownTableBody.innerHTML = renderSkeletonRows(3, 4);

  try {
    const response = await apiRequest(ADMIN_ENDPOINTS.yearlyProgressReport);
    const reportData = response?.data || {};

    renderYearlySummary(reportData);
    renderMonthlyProgress(reportData.monthly_progress || []);
    renderStatusBreakdown(reportData.yearly_status_breakdown || {});
  } catch (error) {
    handleApiFailure(error, "فشل تحميل التقرير السنوي");
    console.error(error);
  }
}

refreshYearlyReportBtn?.addEventListener("click", fetchYearlyProgressReport);
document.addEventListener("DOMContentLoaded", fetchYearlyProgressReport);
