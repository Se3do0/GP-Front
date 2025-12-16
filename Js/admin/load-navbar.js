async function loadNavbar() {
    const res = await fetch("../partials/admin-navbar.html");
    const html = await res.text();
    document.getElementById("navbarContainer").innerHTML = html;
}
