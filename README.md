# CareerMind AI - Resume Intelligence & Career Prediction Platform

CareerMind AI is an advanced, full-stack Resume Intelligence and Career Prediction system. It analyzes resumes to evaluate employability, predict career readiness, identify skill gaps, estimate interview performance, and generate personalized growth roadmaps. The system is powered by Google Gemini generative models and uses modern glassmorphism design for the dashboard layout.

---

## 🚀 Key Functionalities

The analysis is broken down into **11 comprehensive phases**:

1. **Structured Candidate Profile**: Automatically extracts candidate contact information, education history, CGPA, technical skills (categorized into programming languages, frameworks, and tools), certifications, and work experience.
2. **ATS Assessment**: Calculates an overall ATS Compatibility score along with keyword optimization, formatting precision, readability metrics, and recruiter appeal. It also identifies missing keywords and formatting issues.
3. **Employability Gauges**: Estimates readiness percentages for Internships, Placement, Startups, Product Companies, and specific roles (e.g., Software Engineer, AI/ML Specialist).
4. **Skill Gap Roadmap**: Audits matching, missing, and recommended skills for a target role and builds a 3-stage upskilling roadmap (Beginner, Intermediate, Advanced).
5. **Project Audit**: Evaluates individual projects on Complexity, Innovation, Relevance, and Impact, highlighting strengths, weaknesses, and suggesting advanced AI/ML integrations.
6. **Domain Readiness**: Visualizes core Computer Science readiness (DSA, OOP, DBMS, OS, Networks, AI/ML, Web Dev) using an interactive radar chart.
7. **Mock Interview QA Simulator**: Generates custom, tailored interview questions (with expected answers) categorized by general tech and specific project levels.
8. **Digital Career Twin**: Creates a digital peer-comparison model, ranking the candidate's competitiveness against average applicants.
9. **AI Resume Text Optimization**: Provides side-by-side, quantified bullet point rewrites to replace generic experience statements with high-impact achievements.
10. **Structured Improvement Timeline**: Generates a 30-Day Sprint, 90-Day Push, and 6-Month Vision roadmap.
11. **Recruiter's Final Verdict**: Outputs a brutally honest recruiter review alongside hiring recommendations (*Reject, Consider, Shortlist, or Strong Shortlist*).

---

## 🛠️ Technologies Used

- **Frontend**:
  - HTML5 (Semantic Structure)
  - Vanilla CSS3 (Custom Glassmorphism layout, Glow FX, CSS variables, and fully responsive layout)
  - JavaScript (ES6+ async-flow UI rendering)
  - **Chart.js** (Radar & Bar charts for domain readiness and peer comparison)
- **Backend**:
  - **Node.js** with **Express.js** for API hosting
  - **Multer** for in-memory file handling
  - **pdf-parse** & **mammoth** for PDF, DOCX, and TXT parsing respectively
- **AI Integration**:
  - **Google Generative AI SDK** (`@google/generative-ai`)
  - Multi-model fallback system (`gemini-3.5-flash`, `gemini-2.5-flash`, `gemini-3.1-pro`, `gemini-2.5-pro`) to ensure high availability.

---

## 💻 Setup & Run Instructions

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Install Dependencies
Clone the repository, navigate to the folder, and run:
```bash
npm install
```

### 3. Configure API Key
Create a `.env` file in the root directory based on the `.env.example`:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: You can also enter/save the Gemini API Key directly in the web UI Settings (saved safely in your browser's local storage).

### 4. Run the Server
Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to run the platform. Feel free to load the interactive demo data to explore the UI immediately!
