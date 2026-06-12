import React, { useState, useEffect } from 'react';
import "../style/interview.scss";
import { useInterview } from '../hooks/useInterview.js';
import { useParams } from 'react-router';
import { generateResumePdf } from '../services/interview.api.js';

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

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const DatabaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);

const FileTextIcon = () => (
  <svg gap="1rem" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

// --- Subcomponents ---

const CircularProgress = ({ value, size = 120, strokeWidth = 8, color = "#22c55e" }) => {
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
      <span className="q-card__icon"><ChevronDown /></span>
    </button>
    
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

  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { interviewId } = useParams();
  const { report, loading, getReportById, getResumePdf, selectedModel } = useInterview();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  if(loading || !report) {
    return <div className="loading">Loading...</div>;
  }

  const toggleTechQ = (index) => {
    setOpenTechQs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleBehavioralQ = (index) => {
    setOpenBehavioralQs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    const url = await getResumePdf(interviewId, selectedModel);
    if (url) setPdfUrl(url);
    setIsGeneratingPdf(false);
  };

  const handleViewResume = async () => {
    setActiveTab('resume');
    if (!pdfUrl) {
      setIsGeneratingPdf(true);
      const url = await getResumePdf(interviewId, selectedModel);
      if (url) setPdfUrl(url);
      setIsGeneratingPdf(false);
    }
  };

  const renderContent = () => {
    if (activeTab === 'resume') {
      return (
        <div className="content-panel">
          <div className="content-header">
            <h2>Tailored Resume</h2>
            <span className="count-badge">ATS-Optimized</span>
            
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>

              <button 
                className="download-resume-btn" 
                onClick={handleGeneratePdf}
                disabled={isGeneratingPdf}
                style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.3)' }}
              >
                {isGeneratingPdf ? "Wait..." : pdfUrl ? "Regenerate" : "Generate"}
              </button>

              {pdfUrl && (
                <a 
                  href={pdfUrl} 
                  download={`Tailored_Resume_${interviewId}.pdf`}
                  className="download-resume-btn"
                  style={{ textDecoration: 'none' }}
                >
                  <DownloadIcon /> Download PDF
                </a>
              )}
            </div>
          </div>
          <p className="content-subtitle">Your dynamically generated resume tailored to the job description.</p>
          
          <div className="resume-preview-container" style={{ padding: 0 }}>
            {isGeneratingPdf ? (
              <div className="resume-placeholder">
                <FileTextIcon />
                <p>Generating your tailored PDF resume... This usually takes 10-15 seconds.</p>
              </div>
            ) : pdfUrl ? (
              <iframe 
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                width="100%" 
                height="700px" 
                style={{ border: 'none', borderRadius: '10px' }} 
                title="Resume PDF Preview" 
              />
            ) : (
              <div className="resume-placeholder">
                <FileTextIcon />
                <p>Failed to generate resume preview. Please try again.</p>
                <button onClick={handleViewResume} className="download-resume-btn" style={{ marginTop: '1rem' }}>Retry</button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'technical') {
      return (
        <div className="content-panel">
          <div className="content-header">
            <h2>Technical Questions</h2>
            <span className="count-badge">{report?.technicalQuestions?.length || 0} questions</span>
          </div>
          <p className="content-subtitle">AI-curated questions to assess your core competencies, system design, and problem-solving skills.</p>
          <div className="q-list">
            {report?.technicalQuestions?.map((q, i) => (
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
            <span className="count-badge">{report?.behavioralQuestions?.length || 0} questions</span>
          </div>
          <p className="content-subtitle">AI-curated questions to understand your experience, mindset and collaboration style.</p>
          <div className="q-list">
            {report?.behavioralQuestions?.map((q, i) => (
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
      const currentDay = 2; // Mocking current progress
      
      return (
        <div className="content-panel">
          <div className="content-header">
            <h2>Preparation Road Map</h2>
            <span className="count-badge">{report?.preparationPlan?.length || 0}-day plan</span>
          </div>
          <p className="content-subtitle">A structured plan to prepare and ace your interview.</p>
          
          <div className="roadmap-timeline">
            {/* Single continuous gradient track for the whole list */}
            <div className="roadmap-timeline__track"></div>
            
            {report?.preparationPlan?.map((plan, i) => {
              const status = plan.day < currentDay ? 'completed' : plan.day === currentDay ? 'in-progress' : 'pending';
              
              return (
                <div key={i} className={`timeline-item timeline-item--${status}`}>
                  <div className="timeline-item__marker">
                    <div className="timeline-item__dot"></div>
                  </div>
                  <div className="timeline-item__content">
                    <div className="timeline-item__header">
                      <span className="timeline-item__day">Day {plan.day}</span>
                      <div className="timeline-item__icon"><DatabaseIcon /></div>
                      <h3 className="timeline-item__title">{plan.focus}</h3>
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

        {/* --- Generated Resume Widget (Bottom Left) --- */}
        <div className="resume-widget">
          <div className="resume-widget__header">
            <div className="resume-widget__icon">
              <FileTextIcon />
            </div>
            <h5 className="resume-widget__title">Tailored Resume</h5>
          </div>
          <p className="resume-widget__text">ATS-optimized resume generated for this specific role.</p>
          <button 
            className="resume-widget__btn" 
            onClick={handleViewResume}
          >
            <EyeIcon /> View Resume
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="main-area">
        {renderContent()}
      </main>

      {/* --- Right Panel --- */}
      <aside className="right-panel">
        <div className="widget-box widget-box--center">
          <h4 className="widget-title">MATCH SCORE</h4>
          <CircularProgress value={report?.matchScore || 0} />
          <p className="widget-subtitle widget-subtitle--green">Strong match for this role</p>
        </div>

        <div className="widget-divider"></div>

        <div className="widget-box">
          <h4 className="widget-title">SKILL GAPS</h4>
          <div className="skills-list">
            {report?.skillGaps?.map((gap, i) => (
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