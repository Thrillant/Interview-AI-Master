# Interview AI Master

Interview AI Master is an intelligent, AI-powered platform designed to help candidates prepare for their dream jobs. By analyzing a candidate's resume or profile alongside a target job description, the application generates a comprehensive, personalized interview strategy in seconds.

## ✨ Features

- **AI-Powered Analysis**: Utilizes Google's Gemini models (`@google/genai`) to deeply analyze job requirements and candidate profiles.
- **Custom Interview Strategies**: Generates tailored technical questions, behavioral questions, and a structured preparation roadmap.
- **Resume Parsing & Optimization**: Extracts information from uploaded PDF resumes (`pdf-parse`) and generates ATS-optimized tailored resumes using Puppeteer.
- **Secure Authentication**: Robust user authentication system using JWT and bcrypt.
- **Modern UI/UX**: A sleek, responsive, and interactive frontend built with React and Sass, featuring dark mode aesthetics and micro-animations.
- **Dynamic Scoring**: Provides a match score between the candidate's profile and the job description, highlighting skill gaps and strengths.

## 🛠️ Technology Stack

**Frontend:**
- React 19 (via Vite)
- React Router (for navigation)
- Sass (for styling and design system)
- Axios (for API communication)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ORM)
- JSON Web Tokens (JWT) & bcryptjs (Authentication & Security)
- Google Gen AI SDK (AI Engine)
- Puppeteer (PDF generation)
- pdf-parse (Resume parsing)
- Zod (Schema validation)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Interview AI Master"
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   ```
   - Create a `.env` file in the `Backend` directory and add your environment variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     GEMINI_API_KEY=your_google_gemini_api_key
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Setup Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Open the Application**
   - The React app will typically be running on `http://localhost:5173/` (or the port specified by Vite).
   - The backend API will be running on `http://localhost:5000/`.

## 📁 Project Structure

```text
Interview AI Master/
├── Backend/                # Express server and API logic
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   └── services/       # AI and PDF processing logic
│   ├── server.js           # Entry point
│   └── package.json
└── Frontend/               # React application
    ├── src/
    │   ├── components/     # Shared UI components
    │   ├── features/       # Feature-based modules (auth, interview)
    │   ├── services/       # API integration
    │   └── styles/         # Global SCSS styles
    ├── index.html
    └── package.json
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is licensed under the ISC License.
