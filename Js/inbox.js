// Inbox page initialization
document.addEventListener("DOMContentLoaded", async () => {
    currentType = "received";
    // Set active link to received
    const receivedLink = document.querySelector('.nav-link[data-type="received"]');
    if (receivedLink) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        receivedLink.classList.add('active');
    }
    // Update title
    if (listTitle) listTitle.textContent = MESSAGE_TYPE_LABELS[currentType];
    
    refreshList();
});