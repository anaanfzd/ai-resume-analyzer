const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer for in-memory file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .docx, and .txt files are supported.'));
    }
  }
});

// Helper function to extract text from buffer
async function extractTextFromBuffer(buffer, mimeType, filename) {
  const ext = path.extname(filename).toLowerCase();
  
  if (ext === '.pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (ext === '.txt') {
    return buffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file extension.');
  }
}

// Master System Prompt for CareerMind AI
const MASTER_SYSTEM_PROMPT = `You are CareerMind AI, an advanced Resume Intelligence and Career Prediction System.

Your purpose is not only to analyze resumes but also to evaluate employability, predict career readiness, identify skill gaps, estimate interview performance, and generate personalized growth strategies using AI and machine learning principles.

When a resume is provided, perform the following tasks and respond strictly in valid JSON matching the schema provided below.

Rules:
- Never inflate scores.
- Prioritize projects over certifications.
- Prioritize demonstrated skills over claimed skills.
- Give detailed reasoning for every score.
- Focus on practical industry expectations.
- Be constructive, actionable, and realistic.
- Do not add any conversational text or markdown wrappers like \`\`\`json outside of the JSON output. Return a raw, single JSON object.

====================================================
PHASE 1: RESUME UNDERSTANDING
====================================================
Extract: Name, Education, CGPA/Percentage, Skills, Programming Languages, Frameworks, Tools, Certifications, Projects, Internships, Achievements, Coding Profiles, Leadership Activities. Generate a structured candidate profile.

====================================================
PHASE 2: ATS ANALYSIS
====================================================
Calculate: ATS Compatibility Score (0-100), Keyword Optimization Score, Formatting Score, Readability Score, Recruiter Appeal Score.
Identify: Missing keywords, Weak sections, Unnecessary sections, Formatting problems. Provide actionable recommendations.

====================================================
PHASE 3: EMPLOYABILITY PREDICTION
====================================================
Estimate: Internship Readiness (%), Placement Readiness (%), Startup Hiring Probability (%), Product Company Hiring Probability (%), AI/ML Role Readiness (%), Software Engineer Readiness (%).
Explain why each score was assigned. Consider: Academic performance, Technical skills, Project quality, Experience, Competitive programming, Portfolio strength.

====================================================
PHASE 4: SKILL GAP DETECTION
====================================================
Identify for target role: Current Skills, Missing Skills, Critical Missing Skills, Recommended Skills. Categorize into: Beginner, Intermediate, Advanced. Generate a personalized learning roadmap.

====================================================
PHASE 5: PROJECT INTELLIGENCE
====================================================
Evaluate every project individually. Assign scores (0-10) for: Complexity, Innovation, Industry Relevance, Recruiter Impact.
For each project, explain: Strengths, Weaknesses, Missing features, Suggested improvements. Recommend advanced AI/ML features that could improve the project.

====================================================
PHASE 6: INTERVIEW READINESS
====================================================
Estimate readiness (0-100) in: Data Structures & Algorithms, OOP, DBMS, Operating Systems, Computer Networks, AI/ML, Web Development, Communication Skills.
Generate: Strength Areas, Weak Areas.

====================================================
PHASE 7: INTERVIEW QUESTION GENERATION
====================================================
Generate personalized interview questions based on skills, projects, certifications, and technologies.
For every project, generate Beginner, Intermediate, and Advanced questions with expected answers.

====================================================
PHASE 8: CAREER TWIN ANALYSIS
====================================================
Create a digital career twin. Predict current market competitiveness.
Categorize candidate as: Beginner, Average, Competitive, Strong Candidate, or Top Candidate.
Compare (0-100) against: Average B.Tech Student, Internship Applicants, Placement Candidates. Explain ranking.

====================================================
PHASE 9: RESUME OPTIMIZATION
====================================================
Rewrite weak sections. Improve project descriptions, objective statements, skills section, and achievements. Convert generic statements into quantified achievements.

====================================================
PHASE 10: PERSONALIZED ROADMAP
====================================================
Generate 30-Day, 90-Day, and 6-Month improvement plans containing technologies to learn, projects to build, certifications worth pursuing, coding practice goals, and portfolio improvements.

====================================================
PHASE 11: FINAL VERDICT
====================================================
Output: Overall Resume Score (0-100), ATS Score, Employability Score, Technical Strength Score, Project Quality Score, Interview Readiness Score.
Hiring Recommendation: Reject, Consider, Shortlist, or Strong Shortlist.
Provide brutally honest feedback similar to a senior recruiter at a top technology company.`;

// Target JSON Schema for output validation and prompt guidance
const JSON_RESPONSE_SCHEMA = `
You must respond with a JSON object following this structure:
{
  "phase1_profile": {
    "name": "string",
    "education": [{"institution": "string", "degree": "string", "cgpa": "string", "year": "string"}],
    "skills": ["string"],
    "programming_languages": ["string"],
    "frameworks": ["string"],
    "tools": ["string"],
    "certifications": ["string"],
    "projects": [{"title": "string", "description": "string", "technologies": ["string"]}],
    "internships": [{"company": "string", "role": "string", "duration": "string", "description": "string"}],
    "achievements": ["string"],
    "coding_profiles": ["string"],
    "leadership": ["string"]
  },
  "phase2_ats": {
    "overall_ats_score": number,
    "keyword_optimization_score": number,
    "formatting_score": number,
    "readability_score": number,
    "recruiter_appeal_score": number,
    "missing_keywords": ["string"],
    "weak_sections": ["string"],
    "unnecessary_sections": ["string"],
    "formatting_problems": ["string"],
    "recommendations": ["string"]
  },
  "phase3_employability": {
    "readiness": {
      "internship": number,
      "placement": number,
      "startup": number,
      "product_company": number,
      "ai_ml_role": number,
      "software_engineer": number
    },
    "explanations": {
      "internship": "string",
      "placement": "string",
      "startup": "string",
      "product_company": "string",
      "ai_ml_role": "string",
      "software_engineer": "string"
    }
  },
  "phase4_skill_gap": {
    "target_role": "string",
    "current_skills": ["string"],
    "missing_skills": ["string"],
    "critical_missing_skills": ["string"],
    "recommended_skills": ["string"],
    "roadmap": {
      "beginner": ["string"],
      "intermediate": ["string"],
      "advanced": ["string"]
    }
  },
  "phase5_project_intelligence": [
    {
      "title": "string",
      "scores": {
        "complexity": number,
        "innovation": number,
        "industry_relevance": number,
        "recruiter_impact": number
      },
      "strengths": ["string"],
      "weaknesses": ["string"],
      "missing_features": ["string"],
      "improvements": ["string"],
      "suggested_ai_ml_features": ["string"]
    }
  ],
  "phase6_interview_readiness": {
    "scores": {
      "dsa": number,
      "oop": number,
      "dbms": number,
      "os": number,
      "networks": number,
      "ai_ml": number,
      "web_dev": number,
      "communication": number
    },
    "strengths": ["string"],
    "weaknesses": ["string"]
  },
  "phase7_questions": {
    "general_questions": [{"question": "string", "expected_answer": "string"}],
    "project_questions": [
      {
        "project_title": "string",
        "beginner": [{"question": "string", "expected_answer": "string"}],
        "intermediate": [{"question": "string", "expected_answer": "string"}],
        "advanced": [{"question": "string", "expected_answer": "string"}]
      }
    ]
  },
  "phase8_career_twin": {
    "market_competitiveness": "string",
    "category": "string",
    "comparison": {
      "average_btech_student": number,
      "internship_applicants": number,
      "placement_candidates": number
    },
    "explanation": "string"
  },
  "phase9_optimization": [
    {
      "section": "string",
      "original": "string",
      "optimized": "string",
      "impact_improvement": "string"
    }
  ],
  "phase10_roadmap": {
    "plan_30_day": {
      "technologies": ["string"],
      "projects": ["string"],
      "certifications": ["string"],
      "coding_goals": ["string"],
      "portfolio_improvements": ["string"]
    },
    "plan_90_day": {
      "technologies": ["string"],
      "projects": ["string"],
      "certifications": ["string"],
      "coding_goals": ["string"],
      "portfolio_improvements": ["string"]
    },
    "plan_6_month": {
      "technologies": ["string"],
      "projects": ["string"],
      "certifications": ["string"],
      "coding_goals": ["string"],
      "portfolio_improvements": ["string"]
    }
  },
  "phase11_verdict": {
    "scores": {
      "overall": number,
      "ats": number,
      "employability": number,
      "technical_strength": number,
      "project_quality": number,
      "interview_readiness": number
    },
    "recommendation": "string",
    "brutally_honest_feedback": "string"
  }
}`;

// API Endpoint to analyze the resume
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    // Retrieve API key from Header, Body or fallback to Environment Variable
    const apiKey = req.headers['x-api-key'] || req.body.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ 
        error: 'Gemini API Key is missing. Please configure it in Settings.' 
      });
    }

    // Extract text from the resume buffer
    let resumeText = '';
    try {
      resumeText = await extractTextFromBuffer(file.buffer, file.mimetype, file.originalname);
    } catch (parseError) {
      console.error('Text extraction error:', parseError);
      return res.status(400).json({ 
        error: `Failed to extract text from the resume: ${parseError.message}` 
      });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Extracted resume text is empty. Please check if the file contains readable text.' 
      });
    }

    // Determine target model
    const requestedModel = req.body.model || 'gemini-3.5-flash';
    console.log(`Analyzing resume with model: ${requestedModel}`);

    // Call Gemini API with automatic model fallbacks if service is busy
    const genAI = new GoogleGenerativeAI(apiKey);
    let result;
    let success = false;
    let lastError = null;

    // Build unique list of models to try, prioritizing the requested one
    const modelQueue = [
      requestedModel,
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-3.1-pro',
      'gemini-2.5-pro'
    ].filter((value, index, self) => self.indexOf(value) === index);

    const prompt = `
Resume Content:
-------------------
${resumeText}
-------------------

Apply the master system prompt criteria:
${MASTER_SYSTEM_PROMPT}

Follow this exact JSON structure:
${JSON_RESPONSE_SCHEMA}
`;

    for (const modelName of modelQueue) {
      try {
        console.log(`Sending prompt to model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 8192
          }
        });

        result = await model.generateContent(prompt);
        success = true;
        console.log(`Success utilizing model: ${modelName}`);
        break;
      } catch (err) {
        console.warn(`Model ${modelName} failed. Error: ${err.message}`);
        lastError = err;
      }
    }

    if (!success) {
      throw lastError || new Error('All configured Gemini models failed to process request.');
    }

    const responseText = result.response.text();
    
    // Parse response with robust cleaning
    let jsonResult;
    try {
      // 1. Remove any potential markdown code block wrappers
      let cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      jsonResult = JSON.parse(cleanText);
    } catch (jsonErr) {
      console.error("Standard JSON parsing failed. Attempting cleanup...", jsonErr);
      
      try {
        let repairedText = responseText
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim()
          .replace(/,\s*([\]}])/g, '$1') // remove trailing commas before closing braces/brackets
          .replace(/[\u0000-\u001F]+/g, ' '); // remove raw non-printable control characters
          
        jsonResult = JSON.parse(repairedText);
      } catch (secondErr) {
        console.error("JSON parsing error from LLM response:", responseText);
        throw new Error(`Invalid JSON format returned by the AI: ${secondErr.message}`);
      }
    }

    return res.json(jsonResult);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: `An error occurred during resume analysis: ${error.message}` 
    });
  }
});

// Serve the index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
