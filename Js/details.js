// Show details view
function showMessageDetails(item) {
    if (msgTitle) msgTitle.textContent = item.subtitle;
    if (msgBody) msgBody.textContent = item.description;
    if (msgSender) msgSender.textContent = item.sender;
    if (msgReceiver) msgReceiver.textContent = item.receiver;
    if (msgNumber) msgNumber.textContent = item.number;
    if (msgDate) msgDate.textContent = item.date;
    if (msgStatus) msgStatus.textContent = item.status;

    // Hide list
    if (exportList) exportList.classList.add("d-none");

    // Hide main search bar
    if (mainSearchWrapper) mainSearchWrapper.classList.add("d-none");

    // Show details
    if (messageDetailsFull) {
        messageDetailsFull.classList.remove("d-none");
        applyAnimation(messageDetailsFull);
    }

    // Show "back to list" button
    if (backToList) backToList.classList.remove("d-none");
}

// Back to list view
function backToListView() {
    // Hide details
    if (messageDetailsFull) messageDetailsFull.classList.add("d-none");

    // Show list
    if (exportList) {
        exportList.classList.remove("d-none");
        applyAnimation(exportList);
    }

    // Show main search bar again
    if (mainSearchWrapper) mainSearchWrapper.classList.remove("d-none");

    // Hide "back to list" button
    if (backToList) backToList.classList.add("d-none");
}