// ================= TRANSACTION TYPES =================
const MESSAGE_TYPES = ["sent", "received", "draft", "deleted"];

const MESSAGE_TYPE_LABELS = {
    sent: "الصادرات",
    received: "الواردة",
    draft: "المعدة للإرسال",
    deleted: "المحذوفة"
};

// ================= API CONFIG =================
const API_BASE_URL = "https://ghared-project-1lb7.onrender.com";
const INBOX_ENDPOINT = "/api/transactions/inbox";
const SENT_ENDPOINT = "/api/transactions/my-history";
const DRAFT_ENDPOINT = "/api/transactions/draft";
const DELETED_ENDPOINT = "/api/transactions/deleted";

// ================= DATA HOLDER =================
let exportsData = [];

// ================= FETCH FROM DB =================
async function GetInbox() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "./login.html";
        return [];
    }

    try {
        const res = await fetch(API_BASE_URL + INBOX_ENDPOINT, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "./login.html";
            return [];
        }

        const response = await res.json();

        if (!response || !Array.isArray(response.data)) {
            console.error("Invalid API response");
            return [];
        }

        return response.data.map((tx) => ({
            id: tx.transaction_id,
            title: tx.sender_name,
            subtitle: tx.subject,
            description: tx.subject,
            sender: tx.sender_name,
            receiver: "-",
            number: tx.code,
            date: new Date(tx.date).toLocaleDateString("ar-EG"),
            type: "received",
            status: MESSAGE_TYPE_LABELS["received"]
        }));

    } catch (error) {
        console.error("Failed to load inbox:", error);
        return [];
    }
}

async function GetSent() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "./login.html";
        return [];
    }

    try {
        const res = await fetch(API_BASE_URL + SENT_ENDPOINT, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "./login.html";
            return [];
        }

        const response = await res.json();

        if (!response || !Array.isArray(response.data)) {
            console.error("Invalid API response");
            return [];
        }

        // For sent items we need to query details endpoint to get the receiver (`to_department`).
        const data = response.data;
        const items = await Promise.all(data.map(async (tx) => {
            const full = await GetTransactionFull(tx.transaction_id);
            let toDept = "-";
            if (full && Array.isArray(full.history) && full.history.length > 0) {
                const first = full.history[0];
                toDept = first && first.to_department ? first.to_department : "-";
            }

            return {
                id: tx.transaction_id,
                title: toDept,
                subtitle: tx.subject,
                description: tx.subject,
                sender: tx.sender_name,
                receiver: toDept,
                number: tx.code,
                date: new Date(tx.date).toLocaleDateString("ar-EG"),
                type: "sent",
                status: MESSAGE_TYPE_LABELS["sent"]
            };
        }));

        return items;

    } catch (error) {
        console.error("Failed to load sent:", error);
        return [];
    }
}

async function GetDraft() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "./login.html";
        return [];
    }

    try {
        const res = await fetch(API_BASE_URL + DRAFT_ENDPOINT, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "./login.html";
            return [];
        }

        const response = await res.json();

        if (!response || !Array.isArray(response.data)) {
            console.error("Invalid API response");
            return [];
        }

        return response.data.map((tx) => ({
            id: tx.transaction_id,
            title: tx.sender_name,
            subtitle: tx.subject,
            description: tx.subject,
            sender: tx.sender_name,
            receiver: "-",
            number: tx.code,
            date: new Date(tx.date).toLocaleDateString("ar-EG"),
            type: "draft",
            status: MESSAGE_TYPE_LABELS["draft"]
        }));

    } catch (error) {
        console.error("Failed to load draft:", error);
        return [];
    }
}

async function GetDeleted() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "./login.html";
        return [];
    }

    try {
        const res = await fetch(API_BASE_URL + DELETED_ENDPOINT, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "./login.html";
            return [];
        }

        const response = await res.json();

        if (!response || !Array.isArray(response.data)) {
            console.error("Invalid API response");
            return [];
        }

        return response.data.map((tx) => ({
            id: tx.transaction_id,
            title: tx.sender_name,
            subtitle: tx.subject,
            description: tx.subject,
            sender: tx.sender_name,
            receiver: "-",
            number: tx.code,
            date: new Date(tx.date).toLocaleDateString("ar-EG"),
            type: "deleted",
            status: MESSAGE_TYPE_LABELS["deleted"]
        }));

    } catch (error) {
        console.error("Failed to load deleted:", error);
        return [];
    }
}

async function GetAllMessages() {
    const inboxData = await GetInbox();
    const sentData = await GetSent();
    const draftData = await GetDraft();
    const deletedData = await GetDeleted();
    exportsData = inboxData.concat(sentData, draftData, deletedData);

    if (typeof renderList === "function") {
        renderList({ data: exportsData });
    }
}

async function GetTransactionDetails(id) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "./login.html";
        return null;
    }

    try {
        const res = await fetch(API_BASE_URL + `/api/transactions/details/${id}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "./login.html";
            return null;
        }

        const response = await res.json();

        if (!response || !response.data || !response.data.details) {
            console.error("Invalid API response");
            return null;
        }

        return response.data.details;

    } catch (error) {
        console.error("Failed to load transaction details:", error);
        return null;
    }
}

// Returns full data object (details, attachments, history)
async function GetTransactionFull(id) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "./login.html";
        return null;
    }

    try {
        const res = await fetch(API_BASE_URL + `/api/transactions/details/${id}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "./login.html";
            return null;
        }

        const response = await res.json();

        if (!response || !response.data) {
            console.error("Invalid API response");
            return null;
        }

        return response.data;

    } catch (error) {
        console.error("Failed to load transaction full data:", error);
        return null;
    }
}
