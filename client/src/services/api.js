const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('skillswap_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const api = {
  // Authentication & Security (Task 4)
  async login(emailOrUsn, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsn, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async quickLogin(userId) {
    const res = await fetch(`${API_BASE}/auth/quick-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Quick login failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getSecurityVerification() {
    const res = await fetch(`${API_BASE}/auth/verify`);
    return res.json();
  },

  // Database Verification (Task 3)
  async getDatabaseVerification() {
    const res = await fetch(`${API_BASE}/database/verify`);
    return res.json();
  },

  // Stats & Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  // Skills
  async getSkills() {
    const res = await fetch(`${API_BASE}/skills`);
    return res.json();
  },

  async addSkill(skill) {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill),
    });
    return res.json();
  },

  // Users
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/users/current`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getUserById(id) {
    const res = await fetch(`${API_BASE}/users/${id}`);
    return res.json();
  },

  async updateUser(id, data) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Matches
  async getMatches(userId = 'usr_1') {
    const res = await fetch(`${API_BASE}/matches?userId=${userId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Slots & Locking
  async getSlots(teacherId = '') {
    const query = teacherId ? `?teacher_id=${teacherId}` : '';
    const res = await fetch(`${API_BASE}/slots${query}`);
    return res.json();
  },

  async lockSlot(slotId, userId = 'usr_1') {
    const res = await fetch(`${API_BASE}/slots/lock`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ slot_id: slotId, user_id: userId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to lock slot');
    return data;
  },

  async unlockSlot(slotId, userId = 'usr_1') {
    const res = await fetch(`${API_BASE}/slots/unlock`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ slot_id: slotId, user_id: userId }),
    });
    return res.json();
  },

  // Sessions
  async getSessions() {
    const res = await fetch(`${API_BASE}/sessions`);
    return res.json();
  },

  async bookSession(sessionData) {
    const res = await fetch(`${API_BASE}/sessions/book`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sessionData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Booking failed');
    return data;
  },

  async completeSession(sessionId) {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/complete`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Chat Messages
  async getMessages(peerId) {
    const res = await fetch(`${API_BASE}/messages/${peerId}`);
    return res.json();
  },

  async sendMessage(messageData) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(messageData),
    });
    return res.json();
  },

  // Feedback & Ratings
  async getFeedback() {
    const res = await fetch(`${API_BASE}/feedback`);
    return res.json();
  },

  async submitFeedback(feedbackData) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(feedbackData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Feedback submission failed');
    return data;
  },
};
