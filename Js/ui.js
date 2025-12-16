// Animation helper
function applyAnimation(element) {
    if (!element) return;
    element.classList.remove("view-animated");
    void element.offsetWidth; // force reflow
    element.classList.add("view-animated");
}

// render navbar
fetch("components/navbar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    });

// Render list of exports
function renderList({ data, filter = "", type = null }) {
    if (!exportList) return;

    exportList.innerHTML = "";
    const term = filter.trim();

    data
        .filter(item => {
            const matchType = type ? item.type === type : true;
            const matchText = term
                ? item.title.includes(term) ||
                  item.description.includes(term) ||
                  item.subtitle.includes(term)
                : true;

            return matchType && matchText;
        })
        .forEach(item => {
            const row = document.createElement("div");
            row.className =
                "export-row d-flex align-items-center justify-content-between";

            row.innerHTML = `
                <div class="d-flex flex-column flex-grow-1">
                    <div class="d-flex align-items-center">
                        <span class="export-main-text">${item.title}</span>
                        <div class="mx-3"></div>
                        <span class="export-main-text opacity-75">${item.description}</span>
                    </div>
                    <small class="export-sub-text">${item.subtitle}</small>
                </div>
            `;

            row.addEventListener("click", () => {
                showMessageDetails(item);
            });

            exportList.appendChild(row);
        });

    if (!exportList.children.length) {
        const empty = document.createElement("div");
        empty.className = "text-center text-muted mt-4";
        empty.textContent = "لا توجد معاملات مطابقة.";
        exportList.appendChild(empty);
    }

    applyAnimation(exportList);
}
