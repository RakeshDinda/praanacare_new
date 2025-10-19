const API_BASE_URL = "http://localhost:3001/api"

interface ApiResponse<T> {
  data?: T
  error?: string
}

interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
    additionalData?: any
  }
  token: string
  redirectPath: string
}

const apiClient = {
  // Auth
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  async register(email: string, password: string, name: string, role: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role }),
    })
    return response.json()
  },

  // Patients
  async getPatient(userId: string) {
    const response = await fetch(`${API_BASE_URL}/patients/${userId}`)
    return response.json()
  },

  async getAllPatients() {
    const response = await fetch(`${API_BASE_URL}/patients`)
    return response.json()
  },

  async updatePatient(patientId: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Vitals
  async addVital(patientId: string, vital: any) {
    const response = await fetch(`${API_BASE_URL}/vitals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, ...vital }),
    })
    return response.json()
  },

  async getVitals(patientId: string) {
    const response = await fetch(`${API_BASE_URL}/vitals/${patientId}`)
    return response.json()
  },

  // Consultations
  async scheduleConsultation(patientId: string, doctorId: string, date: string, notes: string) {
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, doctorId, date, notes }),
    })
    return response.json()
  },

  async getConsultations(patientId: string) {
    const response = await fetch(`${API_BASE_URL}/consultations/${patientId}`)
    return response.json()
  },

  async updateConsultation(consultationId: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // AI Chat
  async sendChatMessage(patientId: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, message }),
    })
    return response.json()
  },

  async getAIActions(patientId: string) {
    const response = await fetch(`${API_BASE_URL}/ai/actions/${patientId}`)
    return response.json()
  },

  // Recommendations
  async getRecommendations(patientId: string) {
    const response = await fetch(`${API_BASE_URL}/recommendations/${patientId}`)
    return response.json()
  },

  // Health Summary
  async getHealthSummary(patientId: string) {
    const response = await fetch(`${API_BASE_URL}/health-summary/${patientId}`)
    return response.json()
  },
}

export { apiClient }
