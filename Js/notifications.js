const notifsContainer = document.getElementById("notificationsContainer"),
  page = 1,
  limit = 10,
  base_url = "https://ghared-project-1lb7.onrender.com",
  USER_TOKEN = JSON.parse(localStorage.getItem("user")).token,
  loadingSpinner = `<div id="initialLoader" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>`;

//  Fetch Notifications
async function getNotifications() {
  notifsContainer.innerHTML = loadingSpinner;
  let get_notifs_options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${USER_TOKEN}`,
    },
  };

  try {
    response = await fetch(
      `${base_url}/api/notifications?page=${page}&limit=${limit}`,
      get_notifs_options
    );
    result = await response.json();
    console.log(result);
    displayNotifications(result);
  } catch (error) {
    console.error(error);
  }
}

// Display Notifications
function displayNotifications(notifs_api_result) {
  content = "";
  if (notifs_api_result.status === "success") {
    notifications = notifs_api_result.data.notifications;

    notifications.forEach((eachNotif) => {
      let is_read = eachNotif.is_read === false ? "unread" : "";
      content += `
<div class="notification-item ${is_read}">
  
  <div class="sender-avatar">
    ${eachNotif.senderName[0]}
  </div>

  <div class="notif-content">
    <h6 class="notif-subject">${eachNotif.subject}</h6>
    <div class="notif-sender">
      <i class="bi bi-person me-1"></i> ${eachNotif.senderName}
    </div>
    <p class="notif-snippet">${eachNotif.messageSnippet}</p>
  </div>

  <div class="d-flex flex-column align-items-end gap-2 ms-2">
    
    <div class="notif-date">
      ${eachNotif.date.split("T")[0]}
    </div>

    ${
      eachNotif.is_read === false
        ? `
      <i class="bi bi-check2-circle icon-mark-read" 
         title="تعليم كمقروء"
         onclick="markAsRead(${eachNotif.notification_id})">
      </i>
    `
        : ""
    }

  </div>

</div>
`;
    });
  }
  notifsContainer.innerHTML = content;
}

async function markAsRead(notifID) {
  let mark_read_options = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${USER_TOKEN}`,
      "Content-Type": "application/json",
    },
  };

  try {
    response = await fetch(
      `${base_url}/api/notifications/${notifID}/read`,
      mark_read_options
    );
    result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  await getNotifications();
}

// Run
async function run() {
  await getNotifications();
}

run();
