// const base_url = "https://ghared-project-1lb7.onrender.com",
//   USER_TOKEN = JSON.parse(localStorage.getItem("user")).token;

// document.addEventListener("DOMContentLoaded", () => {
//   runNotifications();
// });

//  Fetch Notifications
// async function getNotifications() {
//   let get_notifs_options = {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${USER_TOKEN}`,
//     },
//   };

//   try {
//     response = await fetch(
//       `${base_url}/api/notifications?page=1&limit=5`,
//       get_notifs_options
//     );
//     result = await response.json();
//     alterBadge(result.data.unreadCount);
//   } catch (error) {
//     console.error(error);
//   }
// }

// Alter Badge
// function alterBadge(notifsNum) {
//   const notifsBadge = document.getElementById("notifications-badge");
//   if (notifsNum === 0) {
//     notifsBadge.style.display = "none";
//   } else {
//     notifsBadge.style.display = "inline-block";
//     notifsBadge.innerHTML = notifsNum;
//   }
// }

// Run
// async function runNotifications() {
//   await getNotifications();
// }
