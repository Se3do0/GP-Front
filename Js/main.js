let currentType = "sent";
let currentSearchTerm = "";

function refreshList() {
    renderList({
        data: exportsData,
        filter: currentSearchTerm,
        type: currentType
    });
}

// Load navbar component
fetch("components/navbar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    });


document.addEventListener("DOMContentLoaded", () => {
    if (listTitle && MESSAGE_TYPE_LABELS[currentType]) {
        listTitle.textContent = MESSAGE_TYPE_LABELS[currentType];
    }
    refreshList();

    // back to list buttons
    if (btnBack) btnBack.addEventListener("click", backToListView);
    if (backToList) backToList.addEventListener("click", backToListView);

    // Sidebar filtering
    sidebarLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            sidebarLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const type = link.getAttribute("data-type");
            currentType = type || "sent";

            if (listTitle && MESSAGE_TYPE_LABELS[currentType]) {
                listTitle.textContent = MESSAGE_TYPE_LABELS[currentType];
            }

            backToListView();
            refreshList();
        });
    });

    // Desktop search
    if (searchInput) {
        searchInput.addEventListener("input", e => {
            currentSearchTerm = e.target.value;
            refreshList();
        });
    }

    if (clearSearch) {
        clearSearch.addEventListener("click", () => {
            searchInput.value = "";
            currentSearchTerm = "";
            refreshList();
        });
    }

    // Mobile search
    if (searchInputSm) {
        searchInputSm.addEventListener("input", e => {
            const value = e.target.value;
            currentSearchTerm = value;
            if (searchInput) searchInput.value = value;
            refreshList();
        });
    }

    if (clearSearchSm) {
        clearSearchSm.addEventListener("click", () => {
            searchInputSm.value = "";
            if (searchInput) searchInput.value = "";
            currentSearchTerm = "";
            refreshList();
        });
    }
});
