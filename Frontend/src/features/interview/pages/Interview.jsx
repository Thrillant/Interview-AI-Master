import React, { useState } from 'react';
import "../style/interview.scss";

// --- Mock Data based on provided JSON ---
const interviewData = {
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "How do you handle state management in a large-scale React application, and when would you choose Context API over Redux?",
      "intention": "To test the candidate's depth in React beyond basic component rendering, ensuring they understand scalable architecture.",
      "answer": "I use Context API for low-frequency updates like user themes or authentication state to avoid prop drilling. For high-frequency, complex state updates across the app, I would prefer Redux or Zustand to prevent unnecessary re-renders.",
    },
    {
      "question": "Explain the middleware concept in Express.js and provide an example of how you would secure a route.",
      "intention": "To assess backend proficiency and knowledge of request/response cycles.",
      "answer": "Middleware functions have access to req, res, and next. To secure a route, I would create an authentication middleware that verifies a JWT from the request headers. If valid, I call next(); otherwise, I return a 401 Unauthorized status.",
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Can you describe a time you faced a significant technical roadblock in a project and how you resolved it?",
      "intention": "To evaluate problem-solving skills, persistence, and the ability to learn independently.",
      "answer": "During the AI Interview Master project, I struggled with latency when calling LLM APIs. I resolved this by implementing asynchronous processing and introducing a loading state with debouncing to optimize the user experience.",
    },
    {
      "question": "How do you ensure your code remains maintainable and efficient when working in a team environment?",
      "intention": "To check for familiarity with best practices like code reviews, documentation, and clean code principles.",
      "answer": "I follow naming conventions, write modular components, and document complex logic. I actively participate in code reviews to ensure consistency and embrace feedback to improve my coding standards.",
    }
  ],
  "skillGaps": [
    { "skill": "TypeScript", "severity": "medium" },
    { "skill": "Docker and CI/CD pipelines", "severity": "high" },
    { "skill": "Cloud Platforms (AWS)", "severity": "medium" }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "TypeScript Foundations",
      "tasks": [
        "Learn static typing and interfaces in TypeScript",
        "Convert a small React component to a .tsx file"
      ]
    },
    {
      "day": 2,
      "focus": "Deployment and DevOps Basics",
      "tasks": [
        "Understand Dockerfile basics and containerizing a simple Node.js app",
        "Learn the basics of a CI/CD pipeline using GitHub Actions"
      ]
    },
    {
      "day": 3,
      "focus": "Cloud Concepts",
      "tasks": [
        "Study basic AWS services (EC2, S3, RDS)",
        "Review JWT authentication flow and security best practices"
      ]
    }
  ]
};

// --- Icons ---
const TechIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);

const BehaviorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const RoadMapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);

const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const DatabaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);

// --- Subcomponents ---

const CircularProgress = ({ value, label, size = 120, strokeWidth = 8, color = "#22c55e" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg className="circular-progress__svg" width={size} height={size}>
        <circle className="circular-progress__bg" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} />
        <circle
          className="circular-progress__bar"
          cx={size/2}
          cy={size/2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={color}
        />
      </svg>
      <div className="circular-progress__text">
        <span className="circular-progress__value">{value}%</span>
      </div>
    </div>
  );
};

const QuestionAccordion = ({ qIndex, question, intention, answer, isOpen, onToggle }) => (
  <div className={`q-card ${isOpen ? 'q-card--open' : ''}`}>
    <button className="q-card__header" onClick={onToggle}>
      <span className="q-card__badge">Q{qIndex}</span>
      <h3 className="q-card__title">{question}</h3>
      {/* 1. We now use a single Chevron icon so we can rotate it smoothly in CSS */}
      <span className="q-card__icon"><ChevronDown /></span>
    </button>
    
    {/* 2. Added a wrapper div and removed the {isOpen && ...} condition */}
    <div className="q-card__body-wrapper">
      <div className="q-card__body">
        <div className="q-card__section">
          <span className="q-card__label">INTENTION</span>
          <p className="q-card__text">{intention}</p>
        </div>
        <div className="q-card__section">
          <span className="q-card__label q-card__label--green">MODEL ANSWER</span>
          <p className="q-card__text">{answer}</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---

const Interview = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const [openTechQs, setOpenTechQs] = useState({ 0: true });
  const [openBehavioralQs, setOpenBehavioralQs] = useState({ 0: true });

  const toggleTechQ = (index) => {
    setOpenTechQs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleBehavioralQ = (index) => {
    setOpenBehavioralQs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const renderContent = () => {
    if (activeTab === 'technical') {
      return (
        <div className="content-panel">
          <div className="content-header">
            <h2>Technical Questions</h2>
            <span className="count-badge">{interviewData.technicalQuestions.length} questions</span>
          </div>
          <div className="q-list">
            {interviewData.technicalQuestions.map((q, i) => (
              <QuestionAccordion
                key={i}
                qIndex={i + 1}
                question={q.question}
                intention={q.intention}
                answer={q.answer}
                isOpen={openTechQs[i]}
                onToggle={() => toggleTechQ(i)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'behavioral') {
      return (
        <div className="content-panel">
          <div className="content-header">
            <h2>Behavioral Questions</h2>
            <span className="count-badge">{interviewData.behavioralQuestions.length} questions</span>
          </div>
          <p className="content-subtitle">AI-curated questions to understand your experience, mindset and collaboration style.</p>
          <div className="q-list">
            {interviewData.behavioralQuestions.map((q, i) => (
              <QuestionAccordion
                key={i}
                qIndex={i + 1}
                question={q.question}
                intention={q.intention}
                answer={q.answer}
                isOpen={openBehavioralQs[i]}
                onToggle={() => toggleBehavioralQ(i)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'roadmap') {
      const currentDay = 2; // Mocking progress
      
      return (
        <div className="content-panel">
          <div className="content-header">
            <h2>Preparation Road Map</h2>
            <span className="count-badge">{interviewData.preparationPlan.length}-day plan</span>
          </div>
          <p className="content-subtitle">A structured plan to prepare and ace your interview.</p>
          
          <div className="roadmap-timeline">
            {interviewData.preparationPlan.map((plan, i) => {
              const status = plan.day < currentDay ? 'completed' : plan.day === currentDay ? 'in-progress' : 'pending';
              
              return (
                <div key={i} className={`timeline-item timeline-item--${status}`}>
                  <div className="timeline-item__marker">
                    <div className="timeline-item__dot"></div>
                    {i !== interviewData.preparationPlan.length - 1 && <div className="timeline-item__line"></div>}
                  </div>
                  <div className="timeline-item__content">
                    <div className="timeline-item__header">
                      <span className="timeline-item__day">Day {plan.day}</span>
                      <div className="timeline-item__icon"><DatabaseIcon /></div>
                      <h3 className="timeline-item__title">{plan.focus}</h3>
                      <div className="timeline-item__status">
                        {status === 'completed' && <><CheckIcon /> Completed</>}
                        {status === 'in-progress' && 'In Progress'}
                        {status === 'pending' && 'Pending'}
                      </div>
                    </div>
                    <ul className="timeline-item__tasks">
                      {plan.tasks.map((task, j) => (
                        <li key={j}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="interview-dashboard">
      
      {/* --- Sidebar --- */}
      <aside className="sidebar">
        <h4 className="sidebar__title">SECTIONS</h4>
        <nav className="sidebar__nav">
          <button 
            className={`nav-btn ${activeTab === 'technical' ? 'nav-btn--active' : ''}`}
            onClick={() => setActiveTab('technical')}
          >
            <TechIcon /> Technical Questions
          </button>
          <button 
            className={`nav-btn ${activeTab === 'behavioral' ? 'nav-btn--active' : ''}`}
            onClick={() => setActiveTab('behavioral')}
          >
            <BehaviorIcon /> Behavioral Questions
          </button>
          <button 
            className={`nav-btn ${activeTab === 'roadmap' ? 'nav-btn--active' : ''}`}
            onClick={() => setActiveTab('roadmap')}
          >
            <RoadMapIcon /> Road Map
          </button>
        </nav>

        {activeTab === 'roadmap' && (
          <div className="progress-widget">
            <h5 className="progress-widget__title">YOUR PROGRESS</h5>
            <CircularProgress value={65} size={80} strokeWidth={6} color="#e83e8c" />
            <span className="progress-widget__label">Overall Progress</span>
            <div className="progress-widget__bar-bg">
              <div className="progress-widget__bar-fill" style={{ width: '65%' }}></div>
            </div>
            <span className="progress-widget__fraction">2 / 3 Completed</span>
          </div>
        )}
      </aside>

      {/* --- Main Content --- */}
      <main className="main-area">
        {renderContent()}
      </main>

      {/* --- Right Panel --- */}
      <aside className="right-panel">
        <div className="widget-box widget-box--center">
          <h4 className="widget-title">MATCH SCORE</h4>
          <CircularProgress value={interviewData.matchScore} />
          <p className="widget-subtitle widget-subtitle--green">Strong match for this role</p>
        </div>

        <div className="widget-divider"></div>

        <div className="widget-box">
          <h4 className="widget-title">SKILL GAPS</h4>
          <div className="skills-list">
            {interviewData.skillGaps.map((gap, i) => (
              <div key={i} className={`skill-chip skill-chip--${gap.severity}`}>
                <span className="skill-chip__icon">
                  {gap.severity === 'high' ? <BehaviorIcon /> : gap.severity === 'medium' ? <DatabaseIcon /> : <CheckIcon />}
                </span>
                <span className="skill-chip__text">{gap.skill}</span>
              </div>
            ))}
          </div>
        </div>

        {activeTab === 'roadmap' && (
          <div className="stay-on-track">
            <h4 className="stay-on-track__title">✨ Stay on Track</h4>
            <p className="stay-on-track__text">Complete each day's goals to build confidence and improve outcomes.</p>
          </div>
        )}
      </aside>

    </div>
  );
};

export default Interview;