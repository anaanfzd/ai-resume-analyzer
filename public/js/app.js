// Global State
let selectedFile = null;
let currentApiKey = '';
let activePhase = 'p1_profile';
let analyzedData = null;
let radarChartInstance = null;
let twinChartInstance = null;
let activeQAType = 'general';
let activeTimelinePeriod = '30';

// DOM Elements
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const btnRemoveFile = document.getElementById('btnRemoveFile');
const btnAnalyze = document.getElementById('btnAnalyze');
const btnDemo = document.getElementById('btnDemo');
const btnSettings = document.getElementById('btnSettings');
const settingsModal = document.getElementById('settingsModal');
const btnCloseSettings = document.getElementById('btnCloseSettings');
const apiKeyInput = document.getElementById('apiKeyInput');
const btnSaveSettings = document.getElementById('btnSaveSettings');
const btnDeleteSettings = document.getElementById('btnDeleteSettings');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingStatusText = document.getElementById('loadingStatusText');
const currentLogStep = document.getElementById('currentLogStep');
const processingLog = document.getElementById('processingLog');
const dashboardSection = document.getElementById('dashboardSection');
const uploadSection = document.getElementById('uploadSection');
const btnReset = document.getElementById('btnReset');

/* ==========================================================================
   API Key Management
   ========================================================================== */
function initApiKey() {
  const savedKey = localStorage.getItem('career_mind_api_key');
  if (savedKey) {
    currentApiKey = savedKey;
    apiKeyInput.value = savedKey;
  }
}

btnSettings.addEventListener('click', () => {
  settingsModal.classList.add('open');
});

btnCloseSettings.addEventListener('click', () => {
  settingsModal.classList.remove('open');
});

window.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove('open');
  }
});

btnSaveSettings.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (key) {
    currentApiKey = key;
    localStorage.setItem('career_mind_api_key', key);
    alert('API Key saved successfully!');
    settingsModal.classList.remove('open');
  } else {
    alert('Please enter a valid API key.');
  }
});

btnDeleteSettings.addEventListener('click', () => {
  currentApiKey = '';
  apiKeyInput.value = '';
  localStorage.removeItem('career_mind_api_key');
  alert('API Key cleared.');
  settingsModal.classList.remove('open');
});

/* ==========================================================================
   Drag and Drop / File Selection
   ========================================================================== */
['dragenter', 'dragover'].forEach(eventName => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
  }, false);
});

dropzone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 0) {
    handleFileSelection(files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFileSelection(e.target.files[0]);
  }
});

function handleFileSelection(file) {
  const allowedExtensions = ['pdf', 'docx', 'txt'];
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    alert('Only .pdf, .docx, and .txt files are supported.');
    return;
  }

  selectedFile = file;
  fileName.textContent = file.name;
  
  // Format file size
  let sizeStr = '';
  if (file.size < 1024 * 1024) {
    sizeStr = (file.size / 1024).toFixed(1) + ' KB';
  } else {
    sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  }
  fileSize.textContent = sizeStr;

  fileInfo.classList.remove('hidden');
  btnAnalyze.classList.remove('hidden');
  btnAnalyze.removeAttribute('disabled');
}

btnRemoveFile.addEventListener('click', () => {
  selectedFile = null;
  fileInput.value = '';
  fileInfo.classList.add('hidden');
  btnAnalyze.classList.add('hidden');
  btnAnalyze.setAttribute('disabled', 'true');
});

/* ==========================================================================
   Navigation
   ========================================================================== */
document.querySelectorAll('.nav-item').forEach(button => {
  button.addEventListener('click', (e) => {
    const target = button.getAttribute('data-target');
    switchTab(target);
  });
});

function switchTab(targetId) {
  // Update sidebar active buttons
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.getAttribute('data-target') === targetId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update visible panels
  document.querySelectorAll('.dashboard-tab-content').forEach(panel => {
    if (panel.id === targetId) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  activePhase = targetId;
}

/* ==========================================================================
   Trigger Analysis & Loader Simulation
   ========================================================================== */
btnDemo.addEventListener('click', () => {
  simulateAnalysis(mockAnalysisData);
});

btnAnalyze.addEventListener('click', async () => {
  if (!selectedFile) return;
  
  if (!currentApiKey) {
    alert('Gemini API Key is required. Opening API configuration...');
    settingsModal.classList.add('open');
    return;
  }

  // Show Loading Screen
  loadingOverlay.classList.remove('hidden');
  resetLogs();
  
  const formData = new FormData();
  formData.append('resume', selectedFile);
  formData.append('model', document.getElementById('modelSelect').value);
  formData.append('apiKey', currentApiKey);

  try {
    updateLog('Uploading resume file...', 'active');
    await wait(800);
    updateLog('✓ Resume file upload complete', 'success');
    
    updateLog('Parsing text contents...', 'active');
    await wait(800);
    updateLog('✓ Resume text parsed successfully', 'success');

    updateLog('Contacting CareerMind AI Engine (Gemini)...', 'active');
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
      headers: {
        'x-api-key': currentApiKey
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Server returned an error');
    }

    const data = await response.json();
    updateLog('✓ Gemini AI processing finished', 'success');

    updateLog('Compiling predictive data models...', 'active');
    await wait(800);
    updateLog('✓ Prediction compiler complete', 'success');

    analyzedData = data;
    renderDashboard(data);

    await wait(400);
    loadingOverlay.classList.add('hidden');
    uploadSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');

  } catch (error) {
    alert(`Analysis failed: ${error.message}`);
    loadingOverlay.classList.add('hidden');
  }
});

// Demo offline mode simulation
async function simulateAnalysis(data) {
  loadingOverlay.classList.remove('hidden');
  resetLogs();

  updateLog('Uploading resume file...', 'active');
  await wait(700);
  updateLog('✓ Resume file upload complete', 'success');

  updateLog('Parsing text contents...', 'active');
  await wait(700);
  updateLog('✓ Resume text parsed successfully', 'success');

  updateLog('Contacting CareerMind AI Engine (Gemini)...', 'active');
  await wait(1200);
  updateLog('✓ Gemini AI processing finished', 'success');

  updateLog('Compiling predictive data models...', 'active');
  await wait(600);
  updateLog('✓ Prediction compiler complete', 'success');

  analyzedData = data;
  renderDashboard(data);

  await wait(400);
  loadingOverlay.classList.add('hidden');
  uploadSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
}

function resetLogs() {
  processingLog.innerHTML = '';
}

function updateLog(text, type) {
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.textContent = text;
  
  // Remove the active status from any previous line
  const activeLine = processingLog.querySelector('.active');
  if (activeLine) activeLine.classList.remove('active');

  processingLog.appendChild(line);
  processingLog.scrollTop = processingLog.scrollHeight;
  loadingStatusText.textContent = text.replace('✓', '').replace('...', '');
}

btnReset.addEventListener('click', () => {
  analyzedData = null;
  selectedFile = null;
  fileInput.value = '';
  fileInfo.classList.add('hidden');
  btnAnalyze.classList.add('hidden');
  btnAnalyze.setAttribute('disabled', 'true');
  
  dashboardSection.classList.add('hidden');
  uploadSection.classList.remove('hidden');
  switchTab('p1_profile');
});

/* ==========================================================================
   Dashboard Render Engine
   ========================================================================== */
function renderDashboard(data) {
  // Global Headers
  document.getElementById('summaryCandidateName').textContent = data.phase1_profile.name || 'Candidate';
  document.getElementById('summaryTargetRole').textContent = `Target Role: ${data.phase4_skill_gap.target_role || 'Software Engineer'}`;
  
  const rec = data.phase11_verdict.recommendation || 'Consider';
  const recBadgeSummary = document.getElementById('summaryVerdictBadge');
  recBadgeSummary.textContent = rec;
  recBadgeSummary.className = 'verdict-summary-badge ' + rec.toLowerCase().replace(' ', '-');

  // Phase 1: Structured Profile
  renderPhase1(data.phase1_profile);

  // Phase 2: ATS Assessment
  renderPhase2(data.phase2_ats);

  // Phase 3: Employability Gauges
  renderPhase3(data.phase3_employability);

  // Phase 4: Skill Gap & Roadmap
  renderPhase4(data.phase4_skill_gap);

  // Phase 5: Project Audit
  renderPhase5(data.phase5_project_intelligence);

  // Phase 6: Domain Readiness (Radar Chart & SW)
  renderPhase6(data.phase6_interview_readiness);

  // Phase 7: QA Simulator
  renderPhase7(data.phase7_questions);

  // Phase 8: Digital Career Twin
  renderPhase8(data.phase8_career_twin);

  // Phase 9: Optimization
  renderPhase9(data.phase9_optimization);

  // Phase 10: Roadmap improvements
  renderPhase10(data.phase10_roadmap);

  // Phase 11: Recruiter Feedback
  renderPhase11(data.phase11_verdict);
}

/* --- Render Individual Phases --- */

function renderPhase1(profile) {
  // Contact & Education
  const eduContainer = document.getElementById('profileEducation');
  eduContainer.innerHTML = '';
  profile.education.forEach(edu => {
    const item = document.createElement('div');
    item.className = 'content-item-meta';
    item.innerHTML = `
      <p class="content-item-title">${edu.degree}</p>
      <p class="content-item-sub">${edu.institution}</p>
      <p class="content-item-sub">CGPA/Score: ${edu.cgpa} | Timeline: ${edu.year}</p>
    `;
    eduContainer.appendChild(item);
  });

  // Skills categorizations
  renderTags('tagsLanguages', profile.programming_languages);
  renderTags('tagsFrameworks', profile.frameworks);
  renderTags('tagsTools', profile.tools);

  // Certifications
  const certContainer = document.getElementById('profileCertifications');
  certContainer.innerHTML = '';
  if (profile.certifications && profile.certifications.length > 0) {
    profile.certifications.forEach(cert => {
      const li = document.createElement('li');
      li.textContent = cert;
      certContainer.appendChild(li);
    });
  } else {
    certContainer.innerHTML = '<li>No specific certifications extracted</li>';
  }

  // Coding Profiles & Leadership
  const profilesContainer = document.getElementById('profileProfiles');
  profilesContainer.innerHTML = '';
  const cp = profile.coding_profiles || [];
  const lead = profile.leadership || [];
  
  cp.forEach(prof => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Coding Profile:</strong> ${prof}`;
    profilesContainer.appendChild(li);
  });
  
  lead.forEach(act => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Leadership:</strong> ${act}`;
    profilesContainer.appendChild(li);
  });

  if (cp.length === 0 && lead.length === 0) {
    profilesContainer.innerHTML = '<li>No programming profiles or leadership logs found</li>';
  }

  // Experience / Internships Timeline
  const timeline = document.getElementById('profileInternships');
  timeline.innerHTML = '';
  if (profile.internships && profile.internships.length > 0) {
    profile.internships.forEach(intern => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-header">
          <div>
            <span class="timeline-company">${intern.company}</span>
            <div class="timeline-role">${intern.role}</div>
          </div>
          <span class="timeline-date">${intern.duration}</span>
        </div>
        <p class="timeline-desc">${intern.description}</p>
      `;
      timeline.appendChild(item);
    });
  } else {
    timeline.innerHTML = '<p class="subtitle">No professional experience or internships extracted.</p>';
  }
}

function renderPhase2(ats) {
  // ATS Circular score
  const score = ats.overall_ats_score || 0;
  document.getElementById('atsScoreValue').textContent = score;
  
  const circle = document.getElementById('atsCircleProgress');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = offset;

  // Sub scores bars
  setProgressBar('scoreKeyword', 'barKeyword', ats.keyword_optimization_score || 0);
  setProgressBar('scoreFormatting', 'barFormatting', ats.formatting_score || 0);
  setProgressBar('scoreReadability', 'barReadability', ats.readability_score || 0);
  setProgressBar('scoreAppeal', 'barAppeal', ats.recruiter_appeal_score || 0);

  // Bullet lists
  renderBulletList('atsMissingKeywords', ats.missing_keywords);
  renderBulletList('atsWeakSections', ats.weak_sections.concat(ats.unnecessary_sections));
  renderBulletList('atsFormattingProblems', ats.formatting_problems);
  renderBulletList('atsRecommendations', ats.recommendations);
}

function renderPhase3(emp) {
  const container = document.getElementById('employabilityGrid');
  container.innerHTML = '';

  const labels = {
    internship: 'Internship Readiness',
    placement: 'Placement Readiness',
    startup: 'Startup Hiring Fit',
    product_company: 'Product MNC Fit',
    ai_ml_role: 'AI/ML Role Fit',
    software_engineer: 'SWE Role Fit'
  };

  const keys = ['internship', 'placement', 'startup', 'product_company', 'ai_ml_role', 'software_engineer'];
  
  keys.forEach(key => {
    const score = emp.readiness[key] || 0;
    const desc = emp.explanations[key] || '';
    
    // Choose color classes based on scores
    let colorClass = 'fill-primary';
    if (score < 50) colorClass = 'fill-primary'; // default
    if (score >= 70) colorClass = 'fill-secondary';
    if (score >= 85) colorClass = 'fill-accent';

    const card = document.createElement('div');
    card.className = 'gauge-card';
    card.innerHTML = `
      <div class="gauge-card-header">
        <span class="gauge-title">${labels[key]}</span>
        <span class="gauge-percentage">${score}%</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill ${colorClass}" style="width: ${score}%"></div>
      </div>
      <p class="gauge-explanation">${desc}</p>
    `;
    container.appendChild(card);
  });
}

function renderPhase4(skillgap) {
  document.getElementById('targetRoleName').textContent = skillgap.target_role;

  renderTags('currentSkillsContainer', skillgap.current_skills);
  renderTags('criticalSkillsContainer', skillgap.critical_missing_skills);
  renderTags('recommendedSkillsContainer', skillgap.recommended_skills || skillgap.missing_skills);

  // Roadmap Stages
  renderRoadmapStage('roadmapBeginner', skillgap.roadmap.beginner);
  renderRoadmapStage('roadmapIntermediate', skillgap.roadmap.intermediate);
  renderRoadmapStage('roadmapAdvanced', skillgap.roadmap.advanced);
}

function renderRoadmapStage(elementId, items) {
  const ul = document.getElementById(elementId);
  ul.innerHTML = '';
  if (items && items.length > 0) {
    items.forEach(it => {
      const li = document.createElement('li');
      li.textContent = it;
      ul.appendChild(li);
    });
  } else {
    ul.innerHTML = '<li>Up-to-date! No immediate targets</li>';
  }
}

function renderPhase5(projects) {
  const container = document.getElementById('projectAuditList');
  container.innerHTML = '';

  if (!projects || projects.length === 0) {
    container.innerHTML = '<p class="subtitle text-center">No projects extracted to analyze.</p>';
    return;
  }

  projects.forEach((proj, idx) => {
    const item = document.createElement('div');
    item.className = `accordion-item ${idx === 0 ? 'open' : ''}`;
    
    // Average project score calculation
    const avgScore = (
      (proj.scores.complexity + 
       proj.scores.innovation + 
       proj.scores.industry_relevance + 
       proj.scores.recruiter_impact) / 4
    ).toFixed(1);

    item.innerHTML = `
      <div class="accordion-header">
        <div class="accordion-title-block">
          <span class="accordion-title">${proj.title}</span>
          <span class="project-score-badge">Rating: ${avgScore}/10</span>
        </div>
        <div class="accordion-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      <div class="accordion-content">
        <div class="project-scores-row">
          <div class="project-score-mini">
            <span class="project-score-lbl">Complexity</span>
            <span class="project-score-num">${proj.scores.complexity}/10</span>
          </div>
          <div class="project-score-mini">
            <span class="project-score-lbl">Innovation</span>
            <span class="project-score-num">${proj.scores.innovation}/10</span>
          </div>
          <div class="project-score-mini">
            <span class="project-score-lbl">Industry Relevance</span>
            <span class="project-score-num">${proj.scores.industry_relevance}/10</span>
          </div>
          <div class="project-score-mini">
            <span class="project-score-lbl">Recruiter Impact</span>
            <span class="project-score-num">${proj.scores.recruiter_impact}/10</span>
          </div>
        </div>

        <div class="project-details-grid">
          <div class="proj-section-card strengths">
            <h4>Strengths</h4>
            <ul class="bullet-list-findings green-bullets">
              ${proj.strengths.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
          <div class="proj-section-card weaknesses">
            <h4>Weaknesses & Gaps</h4>
            <ul class="bullet-list-findings red-bullets">
              ${proj.weaknesses.concat(proj.missing_features).map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="project-details-grid mt-4">
          <div class="proj-section-card improvements">
            <h4>Code Improvements</h4>
            <ul class="bullet-list-findings blue-bullets">
              ${proj.improvements.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
          <div class="proj-section-card ai-ml">
            <h4>Suggested AI/ML Additions</h4>
            <ul class="bullet-list-findings purple-bullets">
              ${proj.suggested_ai_ml_features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;

    // Hook click listener to accordion header
    item.querySelector('.accordion-header').addEventListener('click', () => {
      item.classList.toggle('open');
    });

    container.appendChild(item);
  });
}

function renderPhase6(ready) {
  // Bullet lists
  renderBulletList('interviewStrengths', ready.strengths);
  renderBulletList('interviewWeaknesses', ready.weaknesses);

  // ChartJS Radar Setup
  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  const ctx = document.getElementById('radarChart').getContext('2d');
  
  const scores = ready.scores;
  const radarData = [
    scores.dsa || 0,
    scores.oop || 0,
    scores.dbms || 0,
    scores.os || 0,
    scores.networks || 0,
    scores.ai_ml || 0,
    scores.web_dev || 0,
    scores.communication || 0
  ];

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'AI/ML', 'Web Dev', 'Comm Skills'],
      datasets: [{
        label: 'Candidate Readiness Score (%)',
        data: radarData,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: '#8b5cf6',
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#8b5cf6',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        r: {
          angleLines: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          pointLabels: {
            color: '#94a3b8',
            font: {
              family: 'Outfit',
              size: 11
            }
          },
          ticks: {
            backdropColor: 'transparent',
            color: '#64748b',
            stepSize: 20
          },
          min: 0,
          max: 100
        }
      }
    }
  });
}

// Global variables for Phase 7 QA click switching
let currentQAData = null;

function renderPhase7(questions) {
  currentQAData = questions;
  renderQAContent();
  
  // Tabs setup
  const qaTabs = document.querySelectorAll('.qa-tab');
  qaTabs.forEach(tab => {
    tab.replaceWith(tab.cloneNode(true)); // remove previous listeners
  });

  document.querySelectorAll('.qa-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.qa-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeQAType = tab.getAttribute('data-type');
      renderQAContent();
    });
  });
}

function renderQAContent() {
  const container = document.getElementById('qaContainer');
  container.innerHTML = '';

  if (!currentQAData) return;

  if (activeQAType === 'general') {
    const list = currentQAData.general_questions || [];
    if (list.length === 0) {
      container.innerHTML = '<p class="subtitle text-center">No general questions found.</p>';
      return;
    }
    list.forEach((qa, index) => {
      createQAItem(container, qa.question, qa.expected_answer, 'Advanced Core', `general-${index}`);
    });
  } else {
    // Project based
    const projectGroups = currentQAData.project_questions || [];
    if (projectGroups.length === 0) {
      container.innerHTML = '<p class="subtitle text-center">No project-based questions found.</p>';
      return;
    }
    projectGroups.forEach((group) => {
      const pTitle = group.project_title;
      
      const levels = ['beginner', 'intermediate', 'advanced'];
      levels.forEach(lvl => {
        const list = group[lvl] || [];
        list.forEach((qa, index) => {
          createQAItem(container, qa.question, qa.expected_answer, lvl, `proj-${pTitle}-${lvl}-${index}`, pTitle);
        });
      });
    });
  }
}

function createQAItem(parent, question, answer, level, uniqueId, projectContext = '') {
  const card = document.createElement('div');
  card.className = 'qa-item-card';
  
  const levelClass = level.toLowerCase();
  
  card.innerHTML = `
    <div class="qa-header">
      <h4 class="qa-title">${question}</h4>
      <span class="qa-level-badge ${levelClass}">${level}</span>
    </div>
    ${projectContext ? `<span class="qa-project-tag">Project Context: ${projectContext}</span>` : ''}
    <div>
      <button class="qa-toggle-btn" id="btnToggle-${uniqueId}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Reveal Expected Model Answer
      </button>
      <div class="qa-answer hidden" id="answer-${uniqueId}">
        ${answer}
      </div>
    </div>
  `;

  // Toggle reveal
  card.querySelector(`#btnToggle-${uniqueId}`).addEventListener('click', (e) => {
    const ansDiv = card.querySelector(`#answer-${uniqueId}`);
    const isHidden = ansDiv.classList.contains('hidden');
    if (isHidden) {
      ansDiv.classList.remove('hidden');
      e.currentTarget.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        Hide Expected Answer`;
    } else {
      ansDiv.classList.add('hidden');
      e.currentTarget.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Reveal Expected Model Answer`;
    }
  });

  parent.appendChild(card);
}

function renderPhase8(twin) {
  document.getElementById('twinCategoryName').textContent = `${twin.category} Candidate`;
  document.getElementById('twinMarketStanding').textContent = `Market Standing: ${twin.market_competitiveness}`;
  document.getElementById('twinExplanationText').textContent = twin.explanation;

  if (twinChartInstance) {
    twinChartInstance.destroy();
  }

  const ctx = document.getElementById('twinChart').getContext('2d');
  
  twinChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Avg Student', 'Intern Applicants', 'Placement Pools', 'You (Digital Twin)'],
      datasets: [{
        label: 'Relative Competitiveness Metric',
        data: [
          twin.comparison.average_btech_student,
          twin.comparison.internship_applicants,
          twin.comparison.placement_candidates,
          // Calculate a weighted standing score based on Phase 11 Overall Score or use a mock visual max
          analyzedData ? analyzedData.phase11_verdict.scores.overall : 75
        ],
        backgroundColor: [
          'rgba(255, 255, 255, 0.05)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(6, 182, 212, 0.2)',
          'rgba(139, 92, 246, 0.6)'
        ],
        borderColor: [
          'rgba(255, 255, 255, 0.2)',
          '#3b82f6',
          '#06b6d4',
          '#8b5cf6'
        ],
        borderWidth: 2,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#94a3b8'
          },
          min: 0,
          max: 100
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#94a3b8',
            font: {
              family: 'Outfit'
            }
          }
        }
      }
    }
  });
}

function renderPhase9(opt) {
  const container = document.getElementById('optimizationList');
  container.innerHTML = '';

  if (!opt || opt.length === 0) {
    container.innerHTML = '<p class="subtitle text-center">No optimization suggestions found.</p>';
    return;
  }

  opt.forEach(item => {
    const card = document.createElement('div');
    card.className = 'opt-card';
    card.innerHTML = `
      <div class="opt-card-header">${item.section}</div>
      <div class="opt-diff-grid">
        <div class="opt-col original">
          <span class="opt-col-lbl">Original Draft</span>
          <p class="opt-text">${item.original}</p>
        </div>
        <div class="opt-col optimized">
          <span class="opt-col-lbl">AI Enhanced Draft</span>
          <p class="opt-text">${item.optimized}</p>
        </div>
      </div>
      <div class="opt-impact-box">
        <strong>Strategic Rationale:</strong> ${item.impact_improvement}
      </div>
    `;
    container.appendChild(card);
  });
}

// Global roadmap data reference
let currentRoadmapPlans = null;

function renderPhase10(roadmap) {
  currentRoadmapPlans = roadmap;
  renderRoadmapTimelineContent();

  const roadmapTabs = document.querySelectorAll('.timeline-tab');
  roadmapTabs.forEach(tab => {
    tab.replaceWith(tab.cloneNode(true)); // remove old listeners
  });

  document.querySelectorAll('.timeline-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.timeline-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTimelinePeriod = tab.getAttribute('data-time');
      renderRoadmapTimelineContent();
    });
  });
}

function renderRoadmapTimelineContent() {
  const container = document.getElementById('roadmapTimelineDetails');
  container.innerHTML = '';

  if (!currentRoadmapPlans) return;

  let planKey = 'plan_30_day';
  if (activeTimelinePeriod === '90') planKey = 'plan_90_day';
  if (activeTimelinePeriod === '180') planKey = 'plan_6_month';

  const plan = currentRoadmapPlans[planKey];
  if (!plan) return;

  // Render left column cards
  const leftCol = document.createElement('div');
  leftCol.className = 'timeline-subcard';
  leftCol.innerHTML = `
    <h3>Core Tech Stack & Projects</h3>
    <div class="tech-tag-group">
      <h4>Technologies to acquire</h4>
      <div class="tag-container mt-2">
        ${plan.technologies.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
    <div class="alert-separator"></div>
    <h4>Target Projects to develop</h4>
    <ul class="bullet-list mt-2">
      ${plan.projects.map(p => `<li>${p}</li>`).join('')}
    </ul>
  `;

  // Render right column cards
  const rightCol = document.createElement('div');
  rightCol.className = 'timeline-subcard';
  rightCol.innerHTML = `
    <h3>Practice & Certifications</h3>
    <h4>Practice Targets</h4>
    <ul class="bullet-list mt-2">
      ${plan.coding_goals.map(cg => `<li>${cg}</li>`).join('')}
    </ul>
    <div class="alert-separator"></div>
    <h4>Valued Certifications</h4>
    <ul class="bullet-list mt-2">
      ${plan.certifications.map(c => `<li>${c}</li>`).join('')}
    </ul>
    <div class="alert-separator"></div>
    <h4>Portfolio Improvements</h4>
    <ul class="bullet-list mt-2">
      ${plan.portfolio_improvements.map(pi => `<li>${pi}</li>`).join('')}
    </ul>
  `;

  container.appendChild(leftCol);
  container.appendChild(rightCol);
}

function renderPhase11(verdict) {
  // Score display
  const score = verdict.scores.overall || 0;
  document.getElementById('verdictOverallScore').textContent = score;

  // Recommendation Badge
  const rec = verdict.recommendation || 'Consider';
  const badge = document.getElementById('verdictRecommendation');
  badge.textContent = rec;
  badge.className = 'verdict-rec-badge ' + rec.toLowerCase().replace(' ', '-');

  // Breakdown sub-bars
  setProgressBar('vScoreAts', 'vBarAts', verdict.scores.ats || 0, true);
  setProgressBar('vScoreEmp', 'vBarEmp', verdict.scores.employability || 0, true);
  setProgressBar('vScoreTech', 'vBarTech', verdict.scores.technical_strength || 0, true);
  setProgressBar('vScoreProj', 'vBarProj', verdict.scores.project_quality || 0, true);
  setProgressBar('vScoreInt', 'vBarInt', verdict.scores.interview_readiness || 0, true);

  // Recruiter honest feedback
  document.getElementById('verdictHonestFeedback').textContent = verdict.brutally_honest_feedback;
}

/* --- Helper Utilities --- */

function renderTags(containerId, list) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if (list && list.length > 0) {
    list.forEach(item => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = item;
      container.appendChild(span);
    });
  } else {
    container.innerHTML = '<span class="subtitle">None extracted</span>';
  }
}

function renderBulletList(containerId, list) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if (list && list.length > 0) {
    list.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      container.appendChild(li);
    });
  } else {
    container.innerHTML = '<li>None identified</li>';
  }
}

function setProgressBar(textId, barId, score, ratioFormat = false) {
  const textEl = document.getElementById(textId);
  const barEl = document.getElementById(barId);
  
  if (ratioFormat) {
    textEl.textContent = `${score}/100`;
  } else {
    textEl.textContent = `${score}%`;
  }

  // Trigger DOM reflow so width transition works
  setTimeout(() => {
    barEl.style.width = `${score}%`;
  }, 50);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Startup Initialization
window.addEventListener('DOMContentLoaded', () => {
  initApiKey();
});
