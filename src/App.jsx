import React, { useState, useEffect } from 'react';
import { Settings, Code, Sparkles, BrainCircuit, ShieldAlert, CheckCircle, Download, Copy, Loader2, Gauge, LogOut } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [code, setCode] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [mode, setMode] = useState('beginner');
  const [modelType, setModelType] = useState('fast');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');
  const [report, setReport] = useState(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('code_reviewer_api_key');
    if (storedKey) setApiKey(storedKey);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    localStorage.setItem('code_reviewer_api_key', e.target.value);
  };

  const handleCopyCode = () => {
    if (report?.fixedCode) {
      navigator.clipboard.writeText(report.fixedCode);
      alert('Code copied to clipboard!');
    }
  };

  const handleRunAnalysis = async () => {
    if (!code.trim()) {
      setErrorStatus("Please enter some code to analyze.");
      return;
    }
    
    const activeKey = apiKey.trim();
    
    setIsLoading(true);
    setErrorStatus('');
    setReport(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          apiKey: activeKey,
          mode,
          modelType
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze code.");
      }
      
      setReport(result);
    } catch (err) {
      setErrorStatus(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 className="spinner text-purple-400" size={64} color="#a855f7" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <div className="bg-gradients"></div>
      
      <div className="container">
        <header className="header animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ marginBottom: '8px' }}><Sparkles className="inline-block mb-2 text-purple-400" size={32} /> AccuCode AI</h1>
            <p style={{ margin: 0, opacity: 0.8 }}>Get senior-level code reviews instantly. Detect bugs and optimize performance.</p>
          </div>
          <button onClick={() => signOut(auth)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
            <LogOut size={16} /> Sign out
          </button>
        </header>

        <div className="app-grid">
          {/* Left Column: Input Panel */}
          <div className="glass-panel animate-fade-in">
            <h2 className="text-xl mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '1.25rem' }}>
              <Code size={20} /> Your Code
            </h2>
            
            <textarea
              className="code-editor"
              placeholder="Paste your code here (Python, Javascript, Java, C++...)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            ></textarea>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '8px' }}>
                  <Settings size={14}/> Settings
                </label>
                <div className="controls-bar">
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className={`btn-secondary ${mode === 'beginner' ? 'active' : ''}`}
                      onClick={() => setMode('beginner')}
                    >
                      Beginner Mode
                    </button>
                    <button 
                      className={`btn-secondary ${mode === 'strict' ? 'active' : ''}`}
                      onClick={() => setMode('strict')}
                    >
                      Strict Mode
                    </button>
                  </div>
                  
                  <select 
                    className="select-input" 
                    value={modelType} 
                    onChange={(e) => setModelType(e.target.value)}
                  >
                    <option value="fast">Fast Model (Gemini Flash)</option>
                    <option value="advanced">Advanced Model (Gemini Pro)</option>
                  </select>
                </div>
              </div>

              <div>
                <input 
                  type="password" 
                  className="text-input" 
                  placeholder="Enter Gemini API Key" 
                  value={apiKey}
                  onChange={handleApiKeyChange}
                />
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', lineHeight: 1.6 }}>
                  Please try to enter your own Gemini API key to support the developer. If you don't have one, leave this place empty and hit Analyze Code directly.
                </p>
              </div>

              {errorStatus && (
                <div className="status-card error" style={{ marginTop: '8px' }}>
                  <p style={{ color: '#ef4444', display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.875rem' }}>
                    <ShieldAlert size={16} style={{ marginTop: '2px', flexShrink: 0 }} /> {errorStatus}
                  </p>
                </div>
              )}

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '16px', padding: '16px', fontSize: '1.125rem' }}
                onClick={handleRunAnalysis}
                disabled={isLoading}
              >
                {isLoading ? <><Loader2 className="spinner" /> Analyzing...</> : <><BrainCircuit /> Analyze Code</>}
              </button>
            </div>
          </div>

          {/* Right Column: Report Panel */}
          <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', textAlign: 'center' }}>
                <Loader2 size={64} className="spinner" style={{ color: '#a855f7', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500 }}>AI is inspecting your code...</h3>
                <p style={{ color: '#94a3b8', marginTop: '8px' }}>Checking syntax, logic, and complexity.</p>
              </div>
            )}

            {!isLoading && !report && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', textAlign: 'center', color: '#64748b' }}>
                <Gauge size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>Run analysis to see your code review report here.</p>
              </div>
            )}

            {!isLoading && report && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <CheckCircle size={20} style={{ color: '#4ade80' }}/> Review Report
                  </h2>
                  <button className="btn-secondary" onClick={() => window.print()}>
                    <Download size={16} /> Export PDF
                  </button>
                </div>

                <div className={`score-circle ${getScoreClass(report.score)}`}>
                  {report.score}
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '32px', marginTop: '-10px' }}>Code Quality Score</p>

                <div className="markdown-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="status-card info">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#2dd4bf', marginBottom: '8px' }}>Analysis</h3>
                    <p>{report.analysis}</p>
                  </div>

                  <div className="status-card warning">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#facc15', marginBottom: '8px' }}>Errors & Issues</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{report.errors}</p>
                  </div>

                  <div className="status-card success">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#4ade80', marginBottom: '8px' }}>Explanation & Optimization</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{report.explanation}</p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      Fixed & Optimized Code
                      <button onClick={handleCopyCode} style={{ color: '#94a3b8', background: '#1e293b', border: 'none', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', cursor: 'pointer' }}>
                        <Copy size={14} /> Copy
                      </button>
                    </h3>
                    <div className="code-block-wrapper">
                      <pre><code>{report.fixedCode}</code></pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="footer">
          <p>Built by Sishir</p>
        </footer>
      </div>
    </>
  );
}

export default App;
