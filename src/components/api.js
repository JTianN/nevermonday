const API_BASE_URL = "https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net";

// (1) อัปเดต users (status เป็น 1)
export async function updateUserStatus(email, data) {
    const response = await fetch(`${API_BASE_URL}/update/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const resData = await response.json();
    if (!response.ok) {
        throw new Error(resData.detail || "Update user failed");
    }
    return resData;
}

// (2) สร้าง profile_user ใหม่
export async function createProfileUser(data) {
    const response = await fetch(`${API_BASE_URL}/profile_users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const resData = await response.json();
    if (!response.ok) {
        throw new Error(resData.detail || "Create profile user failed");
    }
    return resData;
}
