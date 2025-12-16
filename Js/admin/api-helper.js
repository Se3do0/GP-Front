async function handleApiResponse(res) {
    const data = await res.json();

    if (data.status !== "success") {
        throw new Error(data.message || "حدث خطأ غير متوقع");
    }

    return data;
}
