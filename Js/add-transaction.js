const addFileBtn = document.getElementById("addFileBtn"),
  filesTableBody = document.getElementById("filesTableBody"),
  filePath = document.getElementById("filePath"),
  fileDesc = document.getElementById("fileDesc"),
  successToast = document.querySelector(".success-toast"),
  deleteToast = document.querySelector(".delete-toast"),
  parentCheckboxes = document.querySelectorAll(".parent-checkbox"),
  base_url = "https://ghared-project-1lb7.onrender.com",
  filesList = [],
  USER_TOKEN = JSON.parse(localStorage.getItem("user")).token;

// Files Tab
showEmptyFile();
addFileBtn.addEventListener("click", addFile);

function addFile() {
  let actualFile = filePath.files[0];
  let localUrl = URL.createObjectURL(actualFile);
  let file = {
    originalFile: actualFile,
    url: localUrl,
    name: actualFile.name,
    desc: fileDesc.value.trim(),
    date: new Date().toLocaleDateString("en-GB"),
  };
  filesList.push(file);
  console.log(filesList);
  displayFiles();
  showToast(successToast);
  clearInput();
}

function displayFiles() {
  let displayedList = ``;
  for (let i = 0; i < filesList.length; i++) {
    displayedList += `   <tr>
                  <td>${i + 1}</td>
                  <td>${filesList[i].date}</td>
                  <td class="small">${filesList[i].desc}</td>
                  <td>
                    <a href="${filesList[i].url}" target="_blank">
                      <i class="bi bi-file-earmark-text fs-5 text-primary me-2 text-decoration-none"></i>
                    </a>
                  </td>
                  <td>
                    <button class="btn btn-link p-0" onclick="deleteFile(${i})">
                      <i class="bi bi-trash3 fs-5 text-danger"></i>
                    </button>
                  </td>
                </tr>`;
  }
  filesTableBody.innerHTML = displayedList;
  showEmptyFile();
}

function clearInput() {
  filePath.value = null;
  fileDesc.value = null;
}

function deleteFile(clicked) {
  filesList.splice(clicked, 1);
  displayFiles();
  showToast(deleteToast);
}

function showEmptyFile() {
  if (filesList.length == 0) {
    filesTableBody.innerHTML = `
          <tr>
                  <td
                    id="emptyMessage"
                    colspan="5"
                    class="text-center py-4 text-muted"
                  >
                    لا توجد مرفقات حتى الآن
                  </td>
                </tr>`;
  }
}

function showToast(toast) {
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

// Send Tab
parentCheckboxes.forEach((parent) => {
  parent.addEventListener("change", () => {
    childrenCheckboxes = parent.parentElement.nextElementSibling;
    if (parent.checked) {
      childrenCheckboxes.classList.remove("d-none");
    } else {
      childrenCheckboxes.classList.add("d-none");
      // Uncheck children if parent is unchecked
      childrenCheckboxes
        .querySelectorAll(".form-check-input")
        .forEach((checkbox) => {
          checkbox.checked = false;
        });
    }
  });
});

// ------------------------------ Add Transaction Api Functions

// Get Receivers & Types
const loadingSpinner = `
    <div class="d-flex align-items-center text-primary me-3">
        <div class="spinner-border spinner-border-sm ms-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <span>جاري التحميل...</span>
    </div>
`;
let secondaryTypesContainer = document.querySelector(
    ".secondary-types-container"
  ),
  mainTypesContainer = document.querySelector(".main-types-container"),
  receiversContainer = document.querySelector(".receiversContainer");

async function getReceiversAndTypes() {
  secondaryTypesContainer.innerHTML = loadingSpinner;
  mainTypesContainer.innerHTML = loadingSpinner;
  receiversContainer.innerHTML = loadingSpinner;
  let receivers_options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${USER_TOKEN}`,
    },
  };

  try {
    response = await fetch(
      `${base_url}/api/transactions/form-data`,
      receivers_options
    );
    result = await response.json();
    renderTypes(result.data.types);
    renderReceivers(result.data.receivers);
    console.log(result.data.receivers);
  } catch (error) {
    console.error(error);
  }
}

// Render Types
function renderTypes(types) {
  secondaryTypesContainer.innerHTML = "";
  mainTypesContainer.innerHTML = "";
  types.forEach((eachType) => {
    secondaryTypesContainer.innerHTML += `
     <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="transaction-secondary-type"
                  id='type-${eachType.id}'
                  value="${eachType.id}"
                />
                <label class="form-check-label ms-2" for="type-${eachType.id}">
                  ${eachType.name}
                </label>
              </div>
    `;

    mainTypesContainer.innerHTML = `
     <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="transaction-main-type"
                  id="new"
                  onchange = 'hideHistory()'
                />
                <label class="form-check-label ms-2" for="new">
                  معاملة جديدة
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="transaction-main-type"
                  id="reply"
                  onchange="showHistory()"
                />
                <label class="form-check-label ms-2" for="reply">
                  رد أو إستدراك لمعاملة سابقة
                </label>
              </div>`;
  });
}

// Render Receivers
function renderReceivers(receivers) {
  receiversContainer.innerHTML = "";
  receivers.forEach((eachReceiver) => {
    receiversContainer.innerHTML += `
    <div class="col-md-4">
                <div class="p-3 shadow-sm h-100">
                  <div class="form-check">
                    <input
                      class="form-check-input receiver-checkbox"
                      type="checkbox"
                      value="${eachReceiver.user_id}"
                      id="user-${eachReceiver.user_id}"
                    />
                    <label
                      class="form-check-label fw-medium"
                      for="user-${eachReceiver.user_id}"
                    >
                      ${eachReceiver.department_name}
                    </label>
                    <span class="d-block text-primary">${eachReceiver.full_name}</span>
                  </div>
                </div>
              </div>`;
  });
}

// Add Transaction
document.getElementById("sendBtn").addEventListener("click", () => {
  addTransaction(
    (draftValue = "false"),
    (alertValue = "تم إنشاء المعاملة وإرسالها بنجاح!")
  );
});
document.getElementById("saveAsDraftBtn").addEventListener("click", () => {
  addTransaction(
    (draftValue = "true"),
    (alertValue = "تم الحفظ كمسودة بنجاح!")
  );
});

let globalParentId = "";

async function addTransaction(draftValue, alertValue) {
  try {
    if (!USER_TOKEN) {
      alert("يرجى تسجيل الدخول أولاً");
      return;
    }

    let formData = new FormData();

    const subjectValue = document.getElementById("transaction-subject").value;
    const contentValue = document.getElementById("transaction-content").value;

    formData.append("subject", subjectValue);
    formData.append("content", contentValue);
    formData.append("is_draft", draftValue);
    formData.append("parent_transaction_id", globalParentId);

    const selectedType = document.querySelector(
      'input[name="transaction-secondary-type"]:checked'
    );
    if (selectedType) {
      formData.append("type_id", selectedType.value);
    } else {
      alert("يرجى اختيار نوع المعاملة");
      return;
    }

    const checkedReceivers = document.querySelectorAll(
      ".receiver-checkbox:checked"
    );

    if (checkedReceivers.length === 0) {
      alert("يرجى اختيار مستقبل واحد على الأقل");
      return;
    }

    checkedReceivers.forEach((checkbox) => {
      formData.append("receivers", checkbox.value);
    });

    filesList.forEach((fileItem) => {
      formData.append("attachments", fileItem.originalFile);
    });

    console.log("⏳ جاري إرسال المعاملة...");

    const response = await fetch(`${base_url}/api/transactions/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok || result.status === "success") {
      console.log("✅ تم الإرسال:", result);
      alert(alertValue);

      window.location.reload();
    } else {
      console.error("❌ فشل الإرسال:", result);
      alert(`حدث خطأ: ${result.message || "تأكد من البيانات"}`);
    }
  } catch (error) {
    console.error("Critical Error:", error);
    alert("حدث خطأ في الاتصال بالسيرفر");
  }
}

// Get History
let history = null;
async function getHistory() {
  let history_options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${USER_TOKEN}`,
    },
  };
  try {
    response = await fetch(
      `${base_url}/api/transactions/my-history`,
      history_options
    );
    result = await response.json();
    console.log(result);
    history = result;
  } catch (error) {
    console.error(error);
  }
}

// Display History
let showHistoryContainer = document.getElementById("showHistoryContainer");
showHistoryContainer.innerHTML = "";
function displayHistory(history) {
  if (!showHistoryContainer.innerHTML) {
    let content = "";
    let titleForEstdrak = `<span class='d-block me-2 fw-medium my-2'>
   الرجاء اختيار المعاملة المراد استدراكها
    </span>
    `;
    history.data.forEach((eachHistory) => {
      content += `
    <div class="history-item-wrapper">
        <input 
            class="form-check-input reply-radio d-none" 
            type="radio" 
            name="replied-to-transaction" 
            id="reply-${eachHistory.transaction_id}" 
            value="${eachHistory.transaction_id}"
            onchange="setGlobalParentId(${eachHistory.transaction_id})"
        />

        <label class="history-card-label shadow-sm" for="reply-${
          eachHistory.transaction_id
        }">
            <div class="d-flex justify-content-between align-items-center">
                <span class="history-subject">
                    <i class="bi bi-file-text me-2 text-primary"></i> ${
                      eachHistory.subject
                    }
                </span>
                
                <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill">
                    ${eachHistory.code}
                </span>
            </div>
            
            <div class="history-meta mt-2 d-flex align-items-center gap-2">
                <i class="bi bi-calendar3 small me-3"></i>
                <span>${eachHistory.date.split("T")[0]}</span>
            </div>
        </label>
    </div>`;
    });
    showHistoryContainer.innerHTML = titleForEstdrak + content;
    console.log("CALL API ESTDRAK");
  }

  showHistoryContainer.classList.replace("d-none", "d-block");
}

// Set Global Parent ID
function setGlobalParentId(sentParentId) {
  globalParentId = sentParentId;
}

// Show History
async function showHistory() {
  if (!history) {
    await getHistory();
  }

  displayHistory(history);
}

// Hide History
function hideHistory() {
  globalParentId = "";
  let checkedButton = document.querySelector(
    'input[name="replied-to-transaction"]:checked'
  );
  if (checkedButton) {
    checkedButton.checked = false;
  }
  showHistoryContainer.classList.replace("d-block", "d-none");
  console.log("UNCHECK");
}

// Run Cycle
async function runCycle() {
  try {
    await getReceiversAndTypes();
  } catch (error) {
    console.error(error);
  }
}

runCycle();
