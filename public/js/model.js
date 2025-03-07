const API_BASE_URL = "http://localhost:3000/";

async function loginUser(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
}

async function registerUser(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
    return response.json();
}

async function fetchJobs() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
}
