
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SelectionPage from './pages/SelectionPage';
import ExportPage from './pages/ExportPage';
import { TransliterationMap, SelectionRange, Verse } from './types';
import { DEFAULT_TRANS_MAP } from './constants';

const App: React.FC = () => {
  const [customMap, setCustomMap] = useState<TransliterationMap>(() => {
    const saved = localStorage.getItem('quran_exporter_map');
    return saved ? JSON.parse(saved) : { ...DEFAULT_TRANS_MAP };
  });

  const [selection, setSelection] = useState<SelectionRange>({
    startSurah: 1,
    startAyah: 1,
    endSurah: 1,
    endAyah: 7,
    type: 'surah',
    translation: 'saheeh',
    useCustomMapping: false
  });

  const [selectedVerses, setSelectedVerses] = useState<Verse[]>([]);

  useEffect(() => {
    localStorage.setItem('quran_exporter_map', JSON.stringify(customMap));
    localStorage.setItem('quran_exporter_use_custom_mapping', String(selection.useCustomMapping));
  }, [customMap, selection.useCustomMapping]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#FDFDFD] overflow-x-hidden w-full">
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 py-6 md:py-8 border-b border-gray-50 w-full">
          <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center">
            <Link to="/" className="mb-6 hover:opacity-80 transition-all active:scale-95">
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 flex items-center gap-3">
                <span className="bg-black text-white px-3 py-1 rounded-xl">Q</span>
                QURAN VERSE EXPORTER
              </h1>
            </Link>
            
            <nav className="inline-flex bg-gray-100 p-1 rounded-2xl shadow-inner border border-gray-200 overflow-x-auto max-w-full no-scrollbar">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/select">Selection</NavLink>
              <NavLink to="/export">Export</NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[100vw]">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/select" 
                element={
                  <SelectionPage 
                    selection={selection} 
                    setSelection={setSelection} 
                    setSelectedVerses={setSelectedVerses}
                    mapping={customMap}
                    setMapping={setCustomMap}
                  />
                } 
              />
              <Route 
                path="/export" 
                element={
                  <ExportPage 
                    verses={selectedVerses} 
                    mapping={selection.useCustomMapping ? customMap : null}
                  />
                } 
              />
            </Routes>
          </div>
        </main>

        <footer className="bg-white border-t border-gray-100 py-12 w-full">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="text-xl font-black text-gray-200 mb-4 tracking-tighter uppercase">Quran Export Utility</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} Modern Islamic Scholarship Tooling</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`px-6 md:px-8 py-2.5 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap ${
        isActive 
          ? 'bg-white text-black shadow-md scale-105 border border-gray-100' 
          : 'text-gray-400 hover:text-gray-900 hover:bg-white/50'
      }`}
    >
      {children}
    </Link>
  );
};

export default App;
