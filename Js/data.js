//transaction types
const MESSAGE_TYPES = ["sent", "received", "draft", "deleted"];

const MESSAGE_TYPE_LABELS = {
    sent: "الصادرات",
    received: "الواردة",
    draft: "المعدة للإرسال",
    deleted: "المحذوفة"
};

// (Fake Data)
const exportsData = Array.from({ length: 20 }).map((_, i) => {
    const type = MESSAGE_TYPES[i % MESSAGE_TYPES.length];

    return {
        id: i + 1,
        title: "دكتور حفني",
        subtitle: "كتب الفرقة الأولى",
        description: "نحيط سيادتكم علماً بأن ......................................................................",
        sender: type === "received" ? "شؤون الطلاب" : "دكتور حفني",
        receiver: type === "received" ? "دكتور حفني" : "شؤون الطلاب",
        number: "EXP-2025-00" + (i + 1),
        date: "2025-12-04",
        status: MESSAGE_TYPE_LABELS[type],
        type: type
    };
});
