const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Luu accessToken trong bien nho (khong dung localStorage de tranh XSS token theft;
// se mat khi F5 trang - can goi lai /auth/refresh luc app khoi dong, xem AuthContext)
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// Ham goi API dung chung - tu dong gan Authorization header, tu dong parse JSON
async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include", // gui kem cookie (refreshToken)
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // response khong co body (vd 204 No Content)
  }

  if (!res.ok) {
    const error = new Error(data?.message || `Loi HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ==================== AUTH ====================
export const authApi = {
  signup: (payload) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  signin: (payload) =>
    request("/auth/signin", { method: "POST", body: JSON.stringify(payload) }),
  signout: () => request("/auth/signout", { method: "POST" }),
  refresh: () => request("/auth/refresh", { method: "POST" }),
};

// ==================== PLANETS ====================
export const planetsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/planets${qs ? `?${qs}` : ""}`);
  },
  getById: (id) => request(`/planets/${id}`),
  search: (q) => request(`/planets/search?q=${encodeURIComponent(q)}`),
};

// ==================== CHATBOT ====================
export const chatbotApi = {
  sendMessage: (message, conversationId) =>
    request("/chatbot/message", {
      method: "POST",
      body: JSON.stringify({ message, conversationId }),
    }),
  getHistory: (conversationId) => request(`/chatbot/history/${conversationId}`),
  listHistories: () => request("/chatbot/history"),
};

// ==================== STARGAZING ====================
export const stargazingApi = {
  getRecommendations: (lat, lng) =>
    request(`/stargazing/recommendations?lat=${lat}&lng=${lng}`),
  identifyConstellation: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${BASE_URL}/stargazing/constellations/identify`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Loi upload anh");
      return data;
    });
  },
};

// ==================== OBSERVATORIES ====================
export const observatoriesApi = {
  getNearby: (lat, lng, radius) =>
    request(
      `/observatories/nearby?lat=${lat}&lng=${lng}&radius=${radius || 100}`,
    ),
};

// ==================== SKY EVENTS ====================
export const skyEventsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/sky-events${qs ? `?${qs}` : ""}`);
  },
  subscribeAlerts: (eventTypes) =>
    request("/sky-events/alerts/subscribe", {
      method: "POST",
      body: JSON.stringify({ eventTypes }),
    }),
};

// ==================== NEWS ====================
export const newsApi = {
  getSummary: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/news/summary${qs ? `?${qs}` : ""}`);
  },
};

// ==================== ANALYTICS ====================
export const analyticsApi = {
  track: (eventType, metadata) =>
    request("/analytics/track", {
      method: "POST",
      body: JSON.stringify({ eventType, metadata }),
    }),
};

// ==================== USERS ====================
export const usersApi = {
  getMe: () => request("/users/me"),
  updateMe: (payload) =>
    request("/users/me", { method: "PATCH", body: JSON.stringify(payload) }),
  changePassword: (payload) =>
    request("/users/me/password", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
