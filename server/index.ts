import express, { type Request, type Response } from "express"
import cors from "cors"
import { v4 as uuidv4 } from "uuid"

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// In-memory data storage
interface User {
  id: string
  email: string
  password: string
  name: string
  role: "patient" | "doctor" | "employer"
  createdAt: string
}

interface Patient {
  id: string
  userId: string
  age: number
  gender: string
  department: string
  riskLevel: "low" | "medium" | "high"
  vitals: Vital[]
  consultations: Consultation[]
}

interface Vital {
  id: string
  patientId: string
  timestamp: string
  heartRate: number
  bloodPressure: string
  temperature: number
  stressLevel: number
  sleepHours: number
}

interface Consultation {
  id: string
  patientId: string
  doctorId: string
  date: string
  status: "scheduled" | "completed" | "cancelled"
  notes: string
  recommendations: string[]
}

interface AIAction {
  id: string
  patientId: string
  action: string
  timestamp: string
  status: "pending" | "completed"
}

// Data stores
const users: Map<string, User> = new Map()
const patients: Map<string, Patient> = new Map()
const vitals: Vital[] = []
const consultations: Consultation[] = []
const aiActions: AIAction[] = []

// Seed initial data
function seedData() {
  // Create sample users
  const doctor1: User = {
    id: uuidv4(),
    email: "dr.smith@praana.com",
    password: "password123",
    name: "Dr. Smith",
    role: "doctor",
    createdAt: new Date().toISOString(),
  }

  const patient1: User = {
    id: uuidv4(),
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
    role: "patient",
    createdAt: new Date().toISOString(),
  }

  const employer1: User = {
    id: uuidv4(),
    email: "hr@company.com",
    password: "password123",
    name: "HR Manager",
    role: "employer",
    createdAt: new Date().toISOString(),
  }

  users.set(doctor1.id, doctor1)
  users.set(patient1.id, patient1)
  users.set(employer1.id, employer1)

  // Create sample patient
  const patientData: Patient = {
    id: uuidv4(),
    userId: patient1.id,
    age: 35,
    gender: "Male",
    department: "Engineering",
    riskLevel: "medium",
    vitals: [],
    consultations: [],
  }

  patients.set(patientData.id, patientData)

  // Add sample vitals
  for (let i = 0; i < 7; i++) {
    const vital: Vital = {
      id: uuidv4(),
      patientId: patientData.id,
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      heartRate: 72 + Math.random() * 20,
      bloodPressure: `${120 + Math.random() * 10}/${80 + Math.random() * 10}`,
      temperature: 36.5 + Math.random() * 1,
      stressLevel: Math.random() * 100,
      sleepHours: 6 + Math.random() * 3,
    }
    vitals.push(vital)
    patientData.vitals.push(vital)
  }
}

seedData()

// Auth Routes
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = Array.from(users.values()).find((u) => u.email === email && u.password === password)

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  let additionalData = null
  if (user.role === 'patient') {
    additionalData = Array.from(patients.values()).find((p) => p.userId === user.id)
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      additionalData
    },
    token: `token_${user.id}`,
    redirectPath: user.role === 'doctor' ? '/doctor-dashboard' : 
                 user.role === 'employer' ? '/employer-dashboard' : 
                 '/patient-dashboard'
  })
})

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { email, password, name, role } = req.body

  const existingUser = Array.from(users.values()).find((u) => u.email === email)
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" })
  }

  const newUser: User = {
    id: uuidv4(),
    email,
    password,
    name,
    role,
    createdAt: new Date().toISOString(),
  }

  users.set(newUser.id, newUser)

  if (role === "patient") {
    const patientData: Patient = {
      id: uuidv4(),
      userId: newUser.id,
      age: 0,
      gender: "",
      department: "",
      riskLevel: "low",
      vitals: [],
      consultations: [],
    }
    patients.set(patientData.id, patientData)
  }

  res.status(201).json({
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
    token: `token_${newUser.id}`,
  })
})

// Patient Routes
app.get("/api/patients/:userId", (req: Request, res: Response) => {
  const { userId } = req.params

  const patient = Array.from(patients.values()).find((p) => p.userId === userId)

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" })
  }

  res.json(patient)
})

app.get("/api/patients", (req: Request, res: Response) => {
  const allPatients = Array.from(patients.values())
  res.json(allPatients)
})

app.put("/api/patients/:patientId", (req: Request, res: Response) => {
  const { patientId } = req.params
  const updates = req.body

  const patient = patients.get(patientId)
  if (!patient) {
    return res.status(404).json({ error: "Patient not found" })
  }

  const updated = { ...patient, ...updates }
  patients.set(patientId, updated)

  res.json(updated)
})

// Vitals Routes
app.post("/api/vitals", (req: Request, res: Response) => {
  const { patientId, heartRate, bloodPressure, temperature, stressLevel, sleepHours } = req.body

  const patient = patients.get(patientId)
  if (!patient) {
    return res.status(404).json({ error: "Patient not found" })
  }

  const vital: Vital = {
    id: uuidv4(),
    patientId,
    timestamp: new Date().toISOString(),
    heartRate,
    bloodPressure,
    temperature,
    stressLevel,
    sleepHours,
  }

  vitals.push(vital)
  patient.vitals.push(vital)

  // Check for health alerts
  const alerts = []
  if (heartRate > 100) alerts.push("High heart rate detected")
  if (stressLevel > 80) alerts.push("High stress level")
  if (sleepHours < 6) alerts.push("Insufficient sleep")

  res.status(201).json({ vital, alerts })
})

app.get("/api/vitals/:patientId", (req: Request, res: Response) => {
  const { patientId } = req.params
  const patientVitals = vitals.filter((v) => v.patientId === patientId)
  res.json(patientVitals)
})

// Consultation Routes
app.post("/api/consultations", (req: Request, res: Response) => {
  const { patientId, doctorId, date, notes } = req.body

  const consultation: Consultation = {
    id: uuidv4(),
    patientId,
    doctorId,
    date,
    status: "scheduled",
    notes,
    recommendations: [],
  }

  consultations.push(consultation)

  const patient = patients.get(patientId)
  if (patient) {
    patient.consultations.push(consultation)
  }

  res.status(201).json(consultation)
})

app.get("/api/consultations/:patientId", (req: Request, res: Response) => {
  const { patientId } = req.params
  const patientConsultations = consultations.filter((c) => c.patientId === patientId)
  res.json(patientConsultations)
})

app.put("/api/consultations/:consultationId", (req: Request, res: Response) => {
  const { consultationId } = req.params
  const updates = req.body

  const consultation = consultations.find((c) => c.id === consultationId)
  if (!consultation) {
    return res.status(404).json({ error: "Consultation not found" })
  }

  Object.assign(consultation, updates)
  res.json(consultation)
})

// AI Chat Routes
app.post("/api/ai/chat", (req: Request, res: Response) => {
  const { patientId, message } = req.body

  // Simulate AI response based on message content
  let response = ""

  if (message.toLowerCase().includes("stress")) {
    response =
      "I notice you mentioned stress. Try these techniques: deep breathing exercises, 10-minute meditation, or a short walk. Would you like specific guidance?"
  } else if (message.toLowerCase().includes("sleep")) {
    response =
      "Sleep is crucial for health. Aim for 7-9 hours. Try maintaining a consistent sleep schedule and avoiding screens 1 hour before bed."
  } else if (message.toLowerCase().includes("exercise")) {
    response =
      "Great! Regular exercise improves both physical and mental health. Aim for 150 minutes of moderate activity per week. What type of exercise do you prefer?"
  } else {
    response =
      "Thank you for sharing. Based on your vitals and health data, I recommend consulting with your doctor for personalized advice."
  }

  const action: AIAction = {
    id: uuidv4(),
    patientId,
    action: `Chat: ${message}`,
    timestamp: new Date().toISOString(),
    status: "completed",
  }

  aiActions.push(action)

  res.json({
    message: response,
    actionId: action.id,
    timestamp: new Date().toISOString(),
  })
})

app.get("/api/ai/actions/:patientId", (req: Request, res: Response) => {
  const { patientId } = req.params
  const patientActions = aiActions.filter((a) => a.patientId === patientId)
  res.json(patientActions)
})

// Health Recommendations Route
app.get("/api/recommendations/:patientId", (req: Request, res: Response) => {
  const { patientId } = req.params
  const patient = patients.get(patientId)

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" })
  }

  const recommendations = []

  if (patient.riskLevel === "high") {
    recommendations.push("Schedule urgent consultation with doctor")
    recommendations.push("Increase health monitoring frequency")
  }

  if (patient.vitals.length > 0) {
    const latestVital = patient.vitals[patient.vitals.length - 1]
    if (latestVital.stressLevel > 80) {
      recommendations.push("Practice stress management techniques")
    }
    if (latestVital.sleepHours < 6) {
      recommendations.push("Improve sleep hygiene")
    }
  }

  res.json({ recommendations })
})

// Health Summary Route
app.get("/api/health-summary/:patientId", (req: Request, res: Response) => {
  const { patientId } = req.params
  const patient = patients.get(patientId)

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" })
  }

  const recentVitals = patient.vitals.slice(-7)
  const avgHeartRate = recentVitals.reduce((sum, v) => sum + v.heartRate, 0) / recentVitals.length
  const avgStress = recentVitals.reduce((sum, v) => sum + v.stressLevel, 0) / recentVitals.length
  const avgSleep = recentVitals.reduce((sum, v) => sum + v.sleepHours, 0) / recentVitals.length

  res.json({
    patientId,
    riskLevel: patient.riskLevel,
    avgHeartRate: Math.round(avgHeartRate),
    avgStress: Math.round(avgStress),
    avgSleep: Math.round(avgSleep * 10) / 10,
    totalConsultations: patient.consultations.length,
    lastVitalUpdate: recentVitals[recentVitals.length - 1]?.timestamp,
  })
})

// Error handling
app.use((err: any, req: Request, res: Response) => {
  console.error(err)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`Praana Care Backend running on http://localhost:${PORT}`)
})
