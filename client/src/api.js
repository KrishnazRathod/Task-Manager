const BASE = import.meta.env.VITE_API_URL || "";
const API = `${BASE}/api/tasks`;

async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.error || "Request failed";
    const details = data.details ? ` — ${data.details.join("; ")}` : "";
    throw new Error(message + details);
  }
  return data;
}

export function fetchTasks(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const suffix = query.toString() ? `?${query}` : "";
  return request(`${API}${suffix}`);
}

export function createTask(payload) {
  return request(API, { method: "POST", body: JSON.stringify(payload) });
}

export function updateTask(id, payload) {
  return request(`${API}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function deleteTask(id) {
  return request(`${API}/${id}`, { method: "DELETE" });
}
