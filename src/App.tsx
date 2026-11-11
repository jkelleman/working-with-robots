import { Suspense, lazy, useEffect, useState } from 'react';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import Station, { type A11yPrefs } from './pages/Station';
import Patterns from './pages/Patterns';
import Process from './pages/Process';
import IntroModal from './components/IntroModal';
import { DriveUnit } from './components/Illustrations';
const Metrics = lazy(() => import('./pages/Metrics'));
const Sources = lazy(() => import('./pages/Sources'));

const DEFAULT_PREFS: A11yPrefs = {
  highContrast: false,
  largeText: false,
  audioGuidance: false,
  colorSafe: true,
  leftHanded: false,
  reducedSound: false,
};

const INTRO_KEY = 'wgs-intro-seen';

function introSeen(): boolean {
  try { return localStorage.getItem(INTRO_KEY) === '1'; } catch { return false; }
}

function loadPrefs(): A11yPrefs {
  try {
    const raw = localStorage.getItem('wgs-prefs');
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function App() {
  const [prefs, setPrefs] = useState<A11yPrefs>(loadPrefs);
  const [introOpen, setIntroOpen] = useState(() => !introSeen());
  const closeIntro = () => {
    setIntroOpen(false);
    try { localStorage.setItem(INTRO_KEY, '1'); } catch { /* storage unavailable: show again next visit */ }
  };

  useEffect(() => {
    try { localStorage.setItem('wgs-prefs', JSON.stringify(prefs)); } catch { /* storage unavailable */ }
    document.documentElement.dataset.contrast = prefs.highContrast ? 'high' : 'normal';
    document.documentElement.dataset.text = prefs.largeText ? 'large' : 'normal';
  }, [prefs]);

  return (
    <HashRouter>
      <a className="skip" href="#main">Skip to content</a>
      <header className="app-header">
        <div className="brand">
          <svg className="brand-mark" viewBox="0 0 120 40" width="34" height="14" aria-hidden="true"><DriveUnit x={2} y={2} w={116} /></svg>
          Working With Robots
          <span className="tag">Concept</span>
        </div>
        <nav aria-label="Main">
          <NavLink to="/" end>Station</NavLink>
          <NavLink to="/process">Process</NavLink>
          <NavLink to="/patterns">Patterns</NavLink>
          <NavLink to="/metrics">Metrics</NavLink>
          <NavLink to="/sources">Sources</NavLink>
        </nav>
        <div className="header-actions">
          <button className="btn btn-sm" onClick={() => setIntroOpen(true)} aria-haspopup="dialog">About</button>
        </div>
      </header>

      <IntroModal open={introOpen} onClose={closeIntro} />

      <main id="main">
        <Routes>
          <Route path="/" element={<Station prefs={prefs} />} />
          <Route path="/process" element={<Process prefs={prefs} setPrefs={setPrefs} />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/metrics" element={<Suspense fallback={<p>Loading charts…</p>}><Metrics /></Suspense>} />
          <Route path="/sources" element={<Suspense fallback={<p>Loading…</p>}><Sources /></Suspense>} />
        </Routes>
      </main>

      <footer className="app-footer">
        A design concept by Jen Kelleman. Fictional station and synthetic data. Not affiliated with any company.
      </footer>
    </HashRouter>
  );
}
