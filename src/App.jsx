import React, { useState, useEffect } from 'react';
import { Settings, Code, Sparkles, BrainCircuit, ShieldAlert, CheckCircle, Download, Copy, Loader2, Gauge } from 'lucide-react';
import './index.css';

function App() {
  const [code, setCode] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [mode, setMode] = useState('beginner'); // 'beginner' or 'strict'
  const [modelType, setModelType] = useState('fast'); // 'fast' or 'advanced'
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');
  const [report, setReport] = useState(null);

  // Load API key from local storage initially
  useEffect(() => {
    const storedKey = localStorage.getItem('code_reviewer_api_key');
    if (storedKey) setApiKey(storedKey);
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
    
    // Check if user provided key, otherwise we let the server handle it
    const activeKey = apiKey.trim();
    
    // We don't block them locally anymore if it's empty, we pass blank so server uses its own key
    
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

  return (
    <>
      <div className="bg-gradients"></div>
      
      <div className="container">
        <header className="header animate-fade-in">
          <h1><Sparkles className="inline-block mb-2 text-purple-400" size={40} /> AccuCode AI</h1>
          <p>Get senior-level code reviews instantly. Detect bugs, optimize performance, and level up your coding skills.</p>
        </header>

        <div className="app-grid">
          {/* Left Column: Input Panel */}
          <div className="glass-panel animate-fade-in">
            <h2 className="text-xl mb-4 flex items-center gap-2"><Code size={20} /> Your Code</h2>
            
            <textarea
              className="code-editor"
              placeholder="Paste your code here (Python, Javascript, Java, C++...)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            ></textarea>

            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1"><Settings size={14}/> Settings</label>
                <div className="controls-bar">
                  <div className="flex gap-2">
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
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Please try to enter your own Gemini API key to support the developer. If you don't have one, leave this place empty and hit Analyze Code directly.
                </p>
              </div>

              {errorStatus && (
                <div className="status-card error mt-2">
                  <p className="text-red-400 flex items-center gap-2">
                    <ShieldAlert size={16} /> {errorStatus}
                  </p>
                </div>
              )}

              <button 
                className="btn-primary w-full mt-4 py-4 text-lg" 
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
              <div className="flex flex-col items-center justify-center h-full text-center p-12">
                <Loader2 size={64} className="spinner text-purple-400 mb-4" />
                <h3 className="text-xl font-medium">AI is inspecting your code...</h3>
                <p className="text-gray-400 mt-2">Checking syntax, logic, and complexity.</p>
              </div>
            )}

            {!isLoading && !report && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-12">
                <Gauge size={64} className="mb-4 opacity-50" />
                <p>Run analysis to see your code review report here.</p>
              </div>
            )}

            {!isLoading && report && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl flex items-center gap-2"><CheckCircle size={20} className="text-green-400"/> Review Report</h2>
                  <button className="btn-secondary" onClick={() => window.print()}>
                    <Download size={16} /> Export PDF
                  </button>
                </div>

                <div className={`score-circle ${getScoreClass(report.score)}`}>
                  {report.score}
                </div>
                <p className="text-center text-sm text-gray-400 mb-8 mt-[-10px]">Code Quality Score</p>

                <div className="space-y-6 markdown-content">
                  <div className="status-card info">
                    <h3 className="text-lg font-medium text-cyan-400 mb-2">Analysis</h3>
                    <p>{report.analysis}</p>
                  </div>

                  <div className="status-card warning">
                    <h3 className="text-lg font-medium text-yellow-400 mb-2">Errors & Issues</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{report.errors}</p>
                  </div>

                  <div className="status-card success">
                    <h3 className="text-lg font-medium text-green-400 mb-2">Explanation & Optimization</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{report.explanation}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center justify-between">
                      Fixed & Optimized Code
                      <button onClick={handleCopyCode} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm bg-gray-800 px-2 py-1 rounded">
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
