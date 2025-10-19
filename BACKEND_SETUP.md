# Praana Care Backend Setup

## Installation

1. Navigate to the server directory:
\`\`\`bash
cd server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The backend will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Patients
- `GET /api/patients/:userId` - Get patient by user ID
- `GET /api/patients` - Get all patients
- `PUT /api/patients/:patientId` - Update patient info

### Vitals
- `POST /api/vitals` - Add new vital reading
- `GET /api/vitals/:patientId` - Get patient vitals

### Consultations
- `POST /api/consultations` - Schedule consultation
- `GET /api/consultations/:patientId` - Get patient consultations
- `PUT /api/consultations/:consultationId` - Update consultation

### AI Chat
- `POST /api/ai/chat` - Send chat message
- `GET /api/ai/actions/:patientId` - Get AI actions for patient

### Health Data
- `GET /api/recommendations/:patientId` - Get health recommendations
- `GET /api/health-summary/:patientId` - Get health summary

## Sample Login Credentials

- **Doctor**: dr.smith@praana.com / password123
- **Patient**: john@example.com / password123
- **Employer**: hr@company.com / password123

## Frontend Integration

The frontend uses the `apiClient` from `src/lib/api-client.ts` to communicate with the backend. Make sure the backend is running before starting the frontend.

## Data Storage

Currently uses in-memory storage. Data will be lost when the server restarts. For production, integrate with a database like PostgreSQL or MongoDB.
