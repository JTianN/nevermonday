// const API_BASE_URL = "https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net"; // เปลี่ยนให้ตรงกับ backend จริง

// export async function register({ email, password }) {
//   const response = await fetch(`${API_BASE_URL}/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await response.json();
//   if (!response.ok) throw new Error(data.message || "Registration failed");
//   return data;
// }

// export async function login({ email, password }) {
//   const response = await fetch(`${API_BASE_URL}/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await response.json();
//   if (!response.ok) throw new Error(data.message || "Login failed");
//   return data;
// }


const API_BASE_URL = "https://notify-kifarm-esdqbfc2bycadxav.eastasia-01.azurewebsites.net";

async function fetchWithTimeout(resource, options = {}, timeout = 50000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

export async function register({ email, password }) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");
    return data;
  } catch (error) {
    throw new Error(error.name === "AbortError" ? "Request timed out" : error.message);
  }
}

export async function login({ email, password }) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    // return data;
    return {
      email: data.email,    // ส่ง email
      status: data.status,  // ส่ง status ที่ได้รับจาก backend
      message: data.message // ส่ง message
    };
    
  } catch (error) {
    console.error("LOGIN ERROR:", error);  // 🐞 เช็คที่ console
    throw new Error(error.name === "AbortError" ? "Request timed out" : error.message);
  }
}
