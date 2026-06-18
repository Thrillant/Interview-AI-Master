# 👩🏻‍💻 Interview AI Master

**Interview AI Master** is an intelligent, full-stack web application designed to give candidates a competitive edge. By analyzing a candidate's resume and a target job description, the platform utilizes Google's Gemini AI to generate a highly personalized interview strategy, complete with tailored technical questions, behavioral assessments, skill gap analysis, and a dynamically generated ATS-optimized PDF resume.

## ✨ Features

* 🧠 **AI-Powered Analysis:** Leverages `gemini-3.1-flash-lite` (and other Gemini models) to deeply analyze resumes and job descriptions.
* 📄 **Smart PDF Extraction:** Securely uploads and parses candidate `.pdf` resumes to extract core competencies.
* 🎯 **Custom Interview Strategy:**
* **Technical & Behavioral Questions:** Generates role-specific questions with intentions and model answers.
* **Skill Gap Analysis:** Identifies missing skills and categorizes them by severity (Low, Medium, High).
* **14-Day Roadmap:** Creates a day-by-day preparation plan to get interview-ready.


* 🎨 **Dynamic Resume Generation:** Uses **Puppeteer** to dynamically write, format, and generate a customized, ATS-friendly A4 PDF resume tailored strictly to the target job description.
* 🔒 **Secure Authentication:** JWT-based authentication with HTTP-only, cross-site secure cookies and bcrypt password hashing.

## 💻 Tech Stack

**Frontend:**

* React.js (Vite)
* SCSS / CSS Modules for custom styling
* Axios (API client)
* React Router DOM

**Backend:**

* Node.js & Express.js
* MongoDB & Mongoose
* Google GenAI SDK
* Puppeteer (Headless PDF generation)
* PDF-Parse (Resume text extraction)
* Multer (File uploads)

## 🚀 Live Demo

* **Link:** [Interview AI Master](https://interview-ai-master.vercel.app)

---

## 🛠️ Local Development Setup

To run this project locally, you will need Node.js and MongoDB installed on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/YourUsername/Interview-AI-Master.git
cd Interview-AI-Master

```

### 2. Backend Setup

```bash
cd Backend
npm install

```

Create a `.env` file inside the `Backend` directory and add the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
FRONTEND_URL=http://localhost:5173

```

Start the backend server:

```bash
npm run dev

```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd Frontend
npm install

```

Create a `.env` file inside the `Frontend` directory (if using Vite):

```env
VITE_API_URL=http://localhost:3000

```

Start the frontend development server:

```bash
npm run dev

```

---

## ☁️ Deployment Notes

This project is configured for cloud deployment with strict security and performance settings:

* **Cross-Origin Resource Sharing (CORS):** The backend explicitly trusts the frontend origin to allow secure cross-site cookie transmission (`sameSite: "none"`, `secure: true`).
* **Cloud Puppeteer Support:** The backend includes a `puppeteer.config.cjs` cache setup and runs Chrome with `--no-sandbox` and `--single-process` flags to prevent memory leaks and ensure stable PDF generation on serverless/Linux environments like Render.
* **Rate Limiting & Proxy Trust:** Configured `express-rate-limit` with `app.set('trust proxy', 1)` to accurately monitor traffic behind cloud load balancers.

## 👨‍💻 Author

**Suvodip Howladar** *Creative Developer & Full Stack Engineer* Building intelligent network systems and modern web applications.

---

*If you like this project, please consider giving it a ⭐ on GitHub!*

---
