// Show details view
function showMessageDetails(details) {
    if (msgTitle) msgTitle.textContent = details.subject;
    if (msgBody) msgBody.textContent = details.content;
    if (msgSender) msgSender.textContent = details.sender_name;
    if (msgReceiver) msgReceiver.textContent = "-";  // Not in response
    if (msgNumber) msgNumber.textContent = details.code;
    if (msgDate) msgDate.textContent = new Date(details.date).toLocaleDateString("ar-EG");
    if (msgStatus) msgStatus.textContent = details.current_status;

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