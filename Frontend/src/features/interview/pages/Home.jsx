import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../style/home.scss';
import { useInterview } from '../hooks/useInterview.js';

// ─── Icons (inline SVGs to keep UI layer self-contained) ────────────────────

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor" />
  </svg>
);

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const BrainIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.33.47 2.55 1.25 3.5H5a3 3 0 0 0 0 6h.5A3.5 3.5 0 0 0 9 20.5V21h6v-.5a3.5 3.5 0 0 0 3.5-3.5H19a3 3 0 0 0 0-6h-.25A5.5 5.5 0 0 0 14.5 2h-5z" />
  </svg>
);

const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" opacity="0.2" />
    <path d="M12 8v4m0 4h.01M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21h6m-6-3h6m-3-15a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2V15H9v-1.8C7.2 12.1 6 10.2 6 8a6 6 0 0 1 6-6z" />
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const CpuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

// ─── Sub-components ───────────────────────────────

const FeatureBadge = ({ icon, title, subtitle }) => (
  <div className="feature-badge">
    <div className="feature-badge__icon">{icon}</div>
    <div className="feature-badge__text">
      <span className="feature-badge__title">{title}</span>
      <span className="feature-badge__subtitle">{subtitle}</span>
    </div>
  </div>
);

const StepNumber = ({ number }) => (
  <div className="step-number">
    <span>{number}</span>
  </div>
);

const CharCount = ({ current, max }) => (
  <span className="char-count">{current} / {max} characters</span>
);

const TipBox = ({ tips }) => (
  <div className="tip-box">
    <div className="tip-box__header">
      <LightbulbIcon />
      <span>Tips for better results</span>
    </div>
    <ul className="tip-box__list">
      {tips.map((tip, i) => <li key={i}>{tip}</li>)}
    </ul>
  </div>
);

const InfoNote = ({ message }) => (
  <div className="info-note">
    <InfoIcon />
    <span>{message}</span>
  </div>
);

const DropZone = ({ onFileSelect, fileName }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect?.(file);
  };

  return (
    <div
      className={`drop-zone${isDragging ? ' drop-zone--active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf"
        onChange={(e) => onFileSelect?.(e.target.files[0])}
      />
      <div className="drop-zone__icon"><UploadIcon /></div>
      {fileName
        ? <p className="drop-zone__filename">{fileName}</p>
        : <>
            <p className="drop-zone__primary">Drag &amp; drop your resume here</p>
            <p className="drop-zone__or">or</p>
            <button type="button" className="drop-zone__btn" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
              Choose File
            </button>
            <p className="drop-zone__hint">PDF (Max 3MB)</p>
          </>
      }
    </div>
  );
};

const FooterLink = ({ label }) => (
  <a href="#" className="footer-link">{label}</a>
);

// ─── Home Page ─────────────────────────────────────────────────────

const Home = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  
  // Local state for the UI dropdown
  const [localSelectedModel, setLocalSelectedModel] = useState('gemini-3.5-flash'); 
  
  // Extract setSelectedModel from the hook to update the global context
  const { loading, generateReport, reports, getAllReports, setSelectedModel } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    if (getAllReports) {
      getAllReports(); 
    }
  }, []);

  const handleGenerateReport = async () => {
    if (!resumeFile && !selfDescription.trim()) {
      alert("Please provide either a resume or a self-description to generate the interview strategy.");
      return;
    }

    // 1. Save the choice to the global context so Interview.jsx can use it later
    if (setSelectedModel) {
      setSelectedModel(localSelectedModel);
    }
    
    // 2. Pass the selected model along with other form data to the backend
    const data = await generateReport({
        resume: resumeFile, 
        selfDescription, 
        jobDescription,
        aiModel: localSelectedModel 
    });
    
    if (data && data._id) {
      navigate(`/interview/${data._id}`);
    }
  }

  if (loading) {
    return (
      <main className="home" style={{ justifyContent: 'center' }}>
        <div className="home__card" style={{ maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SparkleIcon />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f0f0f6' }}>Analyzing Profile...</h2>
          <p style={{ fontSize: '0.85rem', color: '#8888a8', lineHeight: '1.5' }}>
            Please wait while our AI builds your custom interview strategy. This usually takes 15-30 seconds.
          </p>
        </div>
      </main>
    );
  }

  const JD_MAX = 5000;
  const SD_MAX = 1000;

  return (
    <main className="home">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="home__hero">
        <h1 className="home__hero-title">
          Create Your Custom<br />
          <span className="home__hero-accent">
            Interview Plan <SparkleIcon />
          </span>
        </h1>
        <p className="home__hero-subtitle">
          Let our AI analyze the job requirements and your unique profile<br />
          to build a winning strategy tailored just for you.
        </p>

        <div className="home__badges">
          <FeatureBadge icon={<BrainIcon />} title="AI-Powered Analysis" subtitle="Deep job & profile insights" />
          <FeatureBadge icon={<SparkleIcon />} title="Personalized Strategy" subtitle="Custom plan for your goals" />
          <FeatureBadge icon={<ShieldIcon />} title="Better Interview Outcomes" subtitle="Stand out with confidence" />
        </div>
      </header>

      {/* ── Main form card ───────────────────────────────────────────── */}
      <section className="home__card">

        {/* Left panel — Job Description */}
        <div className="home__panel home__panel--left">
          <div className="panel-header">
            <StepNumber number="1" />
            <h2 className="panel-header__title">Target Job Description</h2>
            <span className="panel-header__required">Required</span>
          </div>
          <p className="panel-header__desc">
            Paste the full job description to help our AI understand the role better.
          </p>

          <div className="textarea-wrapper">
            <textarea
              className="home__textarea"
              id="jobDescription"
              name="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value.slice(0, JD_MAX))}
              placeholder='e.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."'
              rows={12}
            />
            <CharCount current={jobDescription.length} max={JD_MAX} />
          </div>

          <TipBox tips={[
            'Include responsibilities, requirements, and nice-to-haves',
            'The more details, the better your plan',
          ]} />
        </div>

        {/* Right panel — Your Profile */}
        <div className="home__panel home__panel--right">
          <div className="panel-header">
            <StepNumber number="2" />
            <h2 className="panel-header__title">Your Profile</h2>
          </div>

          {/* Resume upload */}
          <div className="profile-section">
            <p className="profile-section__label">
              Upload Resume <span className="profile-section__tag">Best Results</span>
            </p>
            <DropZone onFileSelect={setResumeFile} fileName={resumeFile?.name} />
          </div>

          <div className="divider"><span>OR</span></div>

          {/* Self-description */}
          <div className="profile-section">
            <p className="profile-section__label">
              Quick Self-Description <span className="profile-section__tag profile-section__tag--muted">Optional</span>
            </p>
            <div className="textarea-wrapper">
              <textarea
                className="home__textarea home__textarea--short"
                id="selfDescription"
                name="selfDescription"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value.slice(0, SD_MAX))}
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                rows={4}
              />
              <CharCount current={selfDescription.length} max={SD_MAX} />
            </div>
          </div>
          
          {/* AI Model Selection */}
          <div className="profile-section" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <p className="profile-section__label">
              <CpuIcon /> AI Engine <span className="profile-section__tag profile-section__tag--muted">Configuration</span>
            </p>
            <select 
              className="home__select" 
              value={localSelectedModel} 
              onChange={(e) => setLocalSelectedModel(e.target.value)}
            >
              <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite</option>
              <option value="gemini-3-flash-preview">Gemini 3.0 Flash Preview</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>

        </div>
      </section>

      {/* ── CTA bar ──────────────────────────────────────────────────── */}
      <div className="home__cta-bar">
        <div className="cta-bar__info">
          <div className="cta-bar__sparkle"><SparkleIcon /></div>
          <p className="cta-bar__text">
            Our AI will analyze the job requirements and your profile to create a<br />
            step-by-step interview strategy tailored to your success.
          </p>
        </div>
        <button
         type="button" className="cta-bar__button" onClick={handleGenerateReport}>
          <SparkleIcon />
          Generate My Interview Strategy
        </button>
      </div>

      {/* ── Recent Reports History ─────────────────────────────────────── */}
      {reports && reports.length > 0 && (
        <section className="home__history">
          <div className="history-header">
            <h2 className="history-header__title">Recent Interview Plans</h2>
          </div>
          <div className="history-grid">
            {reports.slice(0, 12).map((report) => (
              <div 
                key={report._id} 
                className="history-card" 
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div className="history-card__icon">
                  <FileIcon />
                </div>
                <div className="history-card__content">
                  <h3 className="history-card__title">{report.title || 'Strategy Report'}</h3>
                  <span className="history-card__date">
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                <div className="history-card__score">
                  <span>{report.matchScore ? `${report.matchScore}% Match` : 'Ready'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Footer badges ─────────────────────────────────────────────── */}
      <div className="home__footer-badges">
        <FeatureBadge icon={<BrainIcon />} title="AI-Powered Strategy Generation" subtitle="Advanced models for accurate insights" />
        <FeatureBadge icon={<ClockIcon />} title="Takes ~30 seconds" subtitle="Get your plan in less than a minute" />
        <FeatureBadge icon={<ShieldIcon />} title="Your Data is Secure" subtitle="We value your privacy and security" />
      </div>

      {/* ── Page footer ───────────────────────────────────────────────── */}
      <footer className="home__page-footer">
        <FooterLink label="Privacy Policy" />
        <span className="footer-dot">•</span>
        <FooterLink label="Terms of Service" />
        <span className="footer-dot">•</span>
        <FooterLink label="Help Center" />
      </footer>

    </main>
  );
};

export default Home;