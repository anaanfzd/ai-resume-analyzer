// Mock data matching the CareerMind AI schema
const mockAnalysisData = {
  "phase1_profile": {
    "name": "Alex Mercer",
    "education": [
      {
        "institution": "Tech Institute of Engineering",
        "degree": "B.Tech in Computer Science",
        "cgpa": "8.2 / 10",
        "year": "2022 - 2026 (Expected)"
      }
    ],
    "skills": ["Python", "JavaScript", "SQL", "HTML/CSS", "React", "Node.js", "Express", "Scikit-Learn", "Pandas", "NumPy", "Git", "GitHub"],
    "programming_languages": ["Python", "JavaScript", "SQL"],
    "frameworks": ["React", "Express", "Scikit-Learn"],
    "tools": ["Git", "GitHub", "VS Code", "Jupyter Notebook", "Postman"],
    "certifications": [
      "Deep Learning Specialization - Coursera",
      "Python for Data Science - IBM"
    ],
    "projects": [
      {
        "title": "SmartPredict: Housing Prices Forecaster",
        "description": "Developed a machine learning model to forecast residential prices using Scikit-Learn. Handled missing data imputation, categorical encoding, and feature scaling on a dataset of 5,000+ homes.",
        "technologies": ["Python", "Scikit-Learn", "Pandas", "Jupyter Notebook"]
      },
      {
        "title": "DevPort: Portfolio & Developer Network",
        "description": "Built a responsive single page application in React with a Node.js/Express backend. Integrated mock REST APIs and custom CSS glassmorphic components.",
        "technologies": ["JavaScript", "React", "Node.js", "Express", "CSS3"]
      }
    ],
    "internships": [
      {
        "company": "Cognitive Solutions Co.",
        "role": "Machine Learning Intern",
        "duration": "3 Months (Summer 2025)",
        "description": "Assisted in data cleansing, EDA, and training basic classification models. Improved the processing speed of data preprocessing scripts by 15% using vectorized operations."
      }
    ],
    "achievements": [
      "Top 15% in Global ML Hackathon 2025",
      "Solved 250+ LeetCode problems"
    ],
    "coding_profiles": [
      "LeetCode: alex_m_25",
      "GitHub: github.com/alexmercer-dev"
    ],
    "leadership": [
      "Technical Lead at Campus Coding Club",
      "Organized Tech-Fest 2025 Web Dev Workshop"
    ]
  },
  "phase2_ats": {
    "overall_ats_score": 76,
    "keyword_optimization_score": 72,
    "formatting_score": 85,
    "readability_score": 80,
    "recruiter_appeal_score": 68,
    "missing_keywords": ["Docker", "Kubernetes", "CI/CD Pipelines", "TensorFlow", "PyTorch", "AWS / Cloud", "REST API Optimization"],
    "weak_sections": [
      "Projects section: The descriptions are slightly passive and do not quantify the direct impact or system accuracy.",
      "Objective Statement: Very generic, reads like a standard template."
    ],
    "unnecessary_sections": [
      "Interests / Hobbies: Listening to music and playing gaming does not add value for a core tech or ML engineering role."
    ],
    "formatting_problems": [
      "Mixed single-column and double-column formats which confuse older ATS parsers.",
      "Usage of vertical progress bars to show skill competency levels (ATS cannot parse these visuals)."
    ],
    "recommendations": [
      "Convert your resume into a clean, single-column format utilizing clear section headings.",
      "Remove skill level bars. Replace them with a comma-separated list categorized by Languages, Frameworks, and Tools.",
      "Rewrite project bullets to include quantitative results (e.g. Accuracy, latency reduction, user count)."
    ]
  },
  "phase3_employability": {
    "readiness": {
      "internship": 88,
      "placement": 78,
      "startup": 82,
      "product_company": 68,
      "ai_ml_role": 62,
      "software_engineer": 75
    },
    "explanations": {
      "internship": "High readiness. Has a previous internship under their belt, solid academic standing, and basic project foundations.",
      "placement": "Strong potential, but needs to sharpen core CS fundamentals (OS, DBMS) and solve more advanced algorithms to pass top product company OA rounds.",
      "startup": "Excellent fit for startups due to dual capability in Web Development (React/Node) and Machine Learning, demonstrating high adaptability.",
      "product_company": "Decent chances, but top tier companies (MNCs) require much stronger DSA profiles, system design awareness, and deployment skills (Cloud/Docker).",
      "ai_ml_role": "Moderate readiness. While they possess Scikit-Learn skills, they lack Deep Learning frameworks (PyTorch/TensorFlow) and model deployment (MLOps) experience.",
      "software_engineer": "Solid foundation in JavaScript, Node.js, and general programming, making them highly trainable for standard SWE entry-level roles."
    }
  },
  "phase4_skill_gap": {
    "target_role": "AI/ML & Software Engineer",
    "current_skills": ["Python", "JavaScript", "React", "Node.js", "Scikit-Learn", "Pandas", "SQL"],
    "missing_skills": ["PyTorch", "TensorFlow", "Docker", "MLOps (MLflow / DVC)", "AWS", "FastAPI"],
    "critical_missing_skills": ["Docker", "PyTorch", "FastAPI (Model Deployment)", "CI/CD"],
    "recommended_skills": ["MongoDB", "TypeScript", "TailwindCSS"],
    "roadmap": {
      "beginner": [
        "Learn FastAPI to deploy ML models as REST APIs.",
        "Understand Docker basics: writing Dockerfiles and containerizing a simple application."
      ],
      "intermediate": [
        "Study PyTorch or TensorFlow for deep learning applications (Neural networks, CNNs).",
        "Implement CI/CD concepts using GitHub Actions to automate code checks."
      ],
      "advanced": [
        "Explore AWS EC2 / S3 to deploy ML systems in production.",
        "Learn MLOps principles using MLflow to track parameters, metrics, and models."
      ]
    }
  },
  "phase5_project_intelligence": [
    {
      "title": "SmartPredict: Housing Prices Forecaster",
      "scores": {
        "complexity": 5,
        "innovation": 4,
        "industry_relevance": 6,
        "recruiter_impact": 5
      },
      "strengths": [
        "Implemented standard regression algorithms and data preprocessing pipeline properly.",
        "Clean folder structure and documentation on GitHub."
      ],
      "weaknesses": [
        "Lacks cross-validation details, and hyperparameter tuning is very basic.",
        "Static dataset (Boston/Kaggle housing) which recruiters see thousands of times."
      ],
      "missing_features": [
        "No interactive interface for end-users to input values and get real-time forecasts.",
        "No automated data drift checks or online monitoring."
      ],
      "improvements": [
        "Build a simple frontend interface (e.g., Streamlit or React) connected to a backend model API.",
        "Perform advanced feature engineering like polynomial features and regularized regression (Lasso/Ridge)."
      ],
      "suggested_ai_ml_features": [
        "Integrate an Explainable AI framework (SHAP or LIME) to visualize and explain feature contributions for individual predictions."
      ]
    },
    {
      "title": "DevPort: Portfolio & Developer Network",
      "scores": {
        "complexity": 6,
        "innovation": 5,
        "industry_relevance": 7,
        "recruiter_impact": 6
      },
      "strengths": [
        "Full-stack integration is working with Express backend and React state management.",
        "Uses clean CSS design and responsive layout."
      ],
      "weaknesses": [
        "Backend lacks authentication (JWT) and secure session management.",
        "Database is currently simulated; lacks persistent production-ready database integration."
      ],
      "missing_features": [
        "User profile custom upload (needs cloud storage like AWS S3 or Cloudinary).",
        "OAuth integration for Google/GitHub sign-in."
      ],
      "improvements": [
        "Integrate MongoDB or PostgreSQL for database persistence.",
        "Add JWT authentication with token refreshing."
      ],
      "suggested_ai_ml_features": [
        "Build a content-based recommendation engine that suggests developer connections or matching projects based on user skills."
      ]
    }
  ],
  "phase6_interview_readiness": {
    "scores": {
      "dsa": 65,
      "oop": 80,
      "dbms": 70,
      "os": 55,
      "networks": 50,
      "ai_ml": 60,
      "web_dev": 78,
      "communication": 82
    },
    "strengths": [
      "Excellent communication and presentation capability.",
      "Clear OOP definitions and usage of modular practices.",
      "Strong JavaScript and React frontend development experience."
    ],
    "weaknesses": [
      "Operating Systems: Weak knowledge of threading, scheduling algorithms, and memory paging.",
      "Computer Networks: Needs to review HTTP/HTTPS protocols, TCP/IP handshake, and sockets.",
      "DSA: Harder dynamic programming and graph traversals need rigorous practice."
    ]
  },
  "phase7_questions": {
    "general_questions": [
      {
        "question": "What is the difference between Supervised and Unsupervised Learning?",
        "expected_answer": "Supervised learning uses labeled training datasets (input-output pairs) to learn a mapping function, whereas unsupervised learning analyzes unlabeled data to detect underlying structures, patterns, or clusters (e.g., K-Means clustering)."
      },
      {
        "question": "Explain Event Loop in Node.js.",
        "expected_answer": "The Event Loop allows Node.js to perform non-blocking I/O operations by offloading tasks to the system kernel whenever possible. It constantly checks the call stack and executes callback functions from the message queue once the stack is empty."
      }
    ],
    "project_questions": [
      {
        "project_title": "SmartPredict: Housing Prices Forecaster",
        "beginner": [
          {
            "question": "Why did you choose a regression model instead of classification for housing predictions?",
            "expected_answer": "Housing prices are continuous quantitative values, making it a regression task. Classification is used for predicting categorical labels (discrete classes)."
          }
        ],
        "intermediate": [
          {
            "question": "How did you handle outliers in your housing price dataset?",
            "expected_answer": "I used interquartile range (IQR) filtering and log-transformations on right-skewed target variables (prices) to mitigate the leverage of high-value outlier properties on the regression lines."
          }
        ],
        "advanced": [
          {
            "question": "If your regression model has high training accuracy but low test accuracy, what does this indicate, and how would you resolve it?",
            "expected_answer": "This indicates overfitting (high variance). I would resolve it by: introducing regularization (L1 Lasso / L2 Ridge), simplifying model architecture, reducing features via recursive elimination, or obtaining more training records."
          }
        ]
      },
      {
        "project_title": "DevPort: Portfolio & Developer Network",
        "beginner": [
          {
            "question": "What is the purpose of React state vs props?",
            "expected_answer": "State is a local data storage that is managed within the component itself and can change over time. Props are read-only variables passed down from a parent component to customize its children."
          }
        ],
        "intermediate": [
          {
            "question": "How does Express handle middleware, and what did you use it for in DevPort?",
            "expected_answer": "Express middleware functions have access to the request (req) and response (res) objects, and can execute code, modify requests, and end the cycle. I used it for parsing incoming JSON bodies and handling CORS approvals."
          }
        ],
        "advanced": [
          {
            "question": "If you had to scale DevPort to support 100,000 active users, how would you manage the database queries?",
            "expected_answer": "I would implement connection pooling, index frequently searched fields (like username or skills), add a Redis caching layer for read-heavy operations, and separate read and write replicas to offload primary nodes."
          }
        ]
      }
    ]
  },
  "phase8_career_twin": {
    "market_competitiveness": "Top 25% of Engineering Applicants",
    "category": "Competitive",
    "comparison": {
      "average_btech_student": 82,
      "internship_applicants": 75,
      "placement_candidates": 68
    },
    "explanation": "You are positioned well above the average B.Tech candidate due to your hands-on internship experience and functional ML knowledge. However, to stand out among top placement candidates, you need to transition your projects from local scripts to deployed systems (Docker/AWS) and raise your DSA competence."
  },
  "phase9_optimization": [
    {
      "section": "Objective Statement",
      "original": "Motivated B.Tech student seeking a challenging role in software engineering or machine learning where I can utilize my skills and learn new technologies.",
      "optimized": "Aspiring ML & Software Engineer with hands-on internship experience building classification models and React applications. Seeking to leverage skills in Python, Scikit-Learn, and Express to build production-grade AI platforms.",
      "impact_improvement": "Converts a passive template into a targeted summary highlighting specific technologies and domain capability."
    },
    {
      "section": "SmartPredict Description",
      "original": "Worked on a housing prices prediction project in Python. Loaded the dataset, cleaned the missing data, and built regression models to estimate the prices of houses.",
      "optimized": "Engineered an end-to-end regression pipeline in Scikit-Learn that forecasted prices across 5,000+ records, decreasing prediction mean absolute error (MAE) by 12% through targeted log-transformations and outlier elimination.",
      "impact_improvement": "Adds action verbs ('Engineered', 'Forecasted'), details model parameters, and quantifies the improvement metrics (decreased MAE by 12%)."
    }
  ],
  "phase10_roadmap": {
    "plan_30_day": {
      "technologies": ["FastAPI", "Docker basics", "PostgreSQL"],
      "projects": ["REST API Model Wrapper (deploy SmartPredict model using FastAPI inside a Docker container)"],
      "certifications": ["Docker Essentials (Free Course)"],
      "coding_goals": ["Solve 2 problems per day on LeetCode focusing on Arrays and Hashing (Target: 60+ solved)"],
      "portfolio_improvements": ["Add detailed READMEs with architecture diagrams and API request/response examples to GitHub."]
    },
    "plan_90_day": {
      "technologies": ["PyTorch", "GitHub Actions (CI/CD)", "JWT Authentication"],
      "projects": ["Secure DevPort Backend: Integrate PostgreSQL, add JWT auth, and automate test checks with CI/CD"],
      "certifications": ["AWS Cloud Practitioner"],
      "coding_goals": ["Focus on Stack, Queue, and Tree data structures on LeetCode (Target: 120+ solved)"],
      "portfolio_improvements": ["Deploy DevPort frontend on Vercel and FastAPI backend on Render with live database links."]
    },
    "plan_6_month": {
      "technologies": ["AWS EC2/S3", "MLflow (MLOps)", "SHAP (Explainable AI)"],
      "projects": ["Deploy production-ready housing forecaster with SHAP visual analytics, tracked via MLflow and hosted on AWS EC2"],
      "certifications": ["TensorFlow Developer Certificate or PyTorch Deep Learning Specialization"],
      "coding_goals": ["Master Graph algorithms and Dynamic Programming on LeetCode (Target: 250+ solved)"],
      "portfolio_improvements": ["Create a custom unified portfolio website showcasing live system links, architecture sheets, and blogs."]
    }
  },
  "phase11_verdict": {
    "scores": {
      "overall": 73,
      "ats": 76,
      "employability": 75,
      "technical_strength": 72,
      "project_quality": 62,
      "interview_readiness": 68
    },
    "recommendation": "Consider",
    "brutally_honest_feedback": "Your resume has a decent foundation, but it screams 'academic tutorial'. Having a housing prediction project using the Kaggle dataset is the equivalent of submitting basic homework—it does not prove to me that you can build enterprise software. You lack deployment experience (no Docker, no cloud, no databases) which means you cannot push code to production on day one. Your DSA scores are average, which will get you filtered out of core product rounds. To get a Strong Shortlist, turn your scripts into live dockerized applications, host them online, learn JWT security, and get those Leetcode numbers up. You have the raw capability; now build systems, not just scripts."
  }
};
