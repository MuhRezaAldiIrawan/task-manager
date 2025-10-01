const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
};

export const getTasks = async (params = {}) => {
    const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== "")).toString();

    const response = await fetch(`${API_BASE_URL}/tasks?${queryString}`, {
        headers: getAuthHeaders(),
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Unauthorized");
    }

    return response.json();
};

export const createTask = async (taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
    });
    return response.json();
};

export const updateTask = async (id, taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
    });
    return response.json();
};

export const deleteTask = async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    return response.json();
};
