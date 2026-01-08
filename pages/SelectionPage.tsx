import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectionRange, Verse, TransliterationMap } from '../types';
import { SURAHS, TRANSLATIONS, ARABIC_LETTERS, DEFAULT_TRANS_MAP } from '../constants';
import { validateJSONSelection, getVersesFromJSON } from '../services/quranData';

interface SelectionPageProps {
  selection: SelectionRange;
  setSelection: React.Dispatch<React.SetStateAction<SelectionRange>>;
  setSelectedVerses: (verses: Verse[]) => void;
  mapping: TransliterationMap;
  setMapping: React.Dispatch<React.SetStateAction<TransliterationMap>>;
}

const SelectionPage: React.FC<SelectionPageProps> = ({ selection, setSelection, setSelectedVerses, mapping, setMapping }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("Processing...");
  const [isMappingSaved, setIsMappingSaved] = useState(true);

  const updateMapping = (char: string, val: string) => {
    setMapping(prev => ({ ...prev, [char]: val }));
    setIsMappingSaved(false);
  };

  const handleSurahChange = (field: 'startSurah' | 'endSurah', val: string) => {
    // Extract only the numeric surah ID from the dropdown value
    // The value should already be just the number, but we ensure it's a valid number
    const surahId = parseInt(val, 10);
    
    // Validate that we got a valid number
    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
      console.error(`Invalid surah ID: ${val}`);
      return;
    }
    
    // Find the surah metadata using only the numeric ID
    const meta = SURAHS.find(s => s.id === surahId);
    
    // Update selection with only the numeric surah ID
    setSelection(prev => ({ 
      ...prev, 
      [field]: surahId, // Ensure this is always a number
      ...(field === 'startSurah' ? { startAyah: 1 } : { endAyah: meta?.total_verses || 1 })
    }));
  };

  const handleProceed = async () => {
    if (selection.useCustomMapping && !isMappingSaved) {
      setError("Please save your transliteration mapping changes first.");
      return;
    }

    setError(null);
    setLoading(true);
      setStatusText("Loading verses from JSON...");

    try {
      // Validate selection first
      const validationError = await validateJSONSelection(selection);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      // Fetch verses from JSON
      const verses = await getVersesFromJSON(selection);

      if (verses.length === 0) {
        setError("No verses found in the JSON file for the selected range.");
        setLoading(false);
        return;
      }
      
      setSelectedVerses(verses);
      navigate('/export');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const newMap = { ...mapping };
      const lines = text.split(/\r?\n/);
      lines.forEach(line => {
        const parts = line.split(/[,\t]/);
        if (parts.length >= 2) {
          const char = parts[0].trim();
          const mapTo = parts[1].trim();
          if (char) newMap[char] = mapTo;
        }
      });
      setMapping(newMap);
      setIsMappingSaved(false);
      setError("File loaded. Please click 'Save Key Changes' to confirm.");
    };
    reader.readAsText(file);
  };

  const handleSaveMapping = () => {
    setIsMappingSaved(true);
    setError(null);
    const flashMsg = "Mapping saved successfully.";
    setError(flashMsg);
    setTimeout(() => setError(null), 3000);
  };

  const currentStartSurah = SURAHS.find(s => s.id === selection.startSurah);
  const currentEndSurah = SURAHS.find(s => s.id === selection.endSurah);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">Selection</h1>
        <p className="text-gray-500 font-medium">Export verses from the JSON database.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-6 md:p-10 shadow-sm space-y-8">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Export Scope</label>
            <div className="flex flex-wrap gap-2">
              {(['single', 'range', 'surah'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelection(prev => ({ ...prev, type }))}
                  className={`px-6 py-3 text-xs font-black rounded-xl border-2 transition-all ${
                    selection.type === type ? 'bg-black text-white border-black shadow-lg shadow-black/10' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Surah</label>
              <select
                value={selection.startSurah}
                onChange={(e) => handleSurahChange('startSurah', e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-black outline-none transition-all cursor-pointer"
              >
                {SURAHS.map(s => <option key={s.id} value={s.id}>{s.id}. {s.transliteration}</option>)}
              </select>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Translation</label>
              <select
                value={selection.translation}
                onChange={(e) => setSelection(prev => ({ ...prev, translation: e.target.value }))}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-black outline-none transition-all cursor-pointer"
              >
                <option value="saheeh">Saheeh International</option>
              </select>
              <p className="text-[9px] text-gray-400 italic">Verses are loaded from the JSON file.</p>
            </div>
          </div>

          {(selection.type === 'single' || selection.type === 'range') && (
            <div className="space-y-6">
              {selection.type === 'range' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Surah</label>
                    <select
                      value={selection.startSurah}
                      onChange={(e) => handleSurahChange('startSurah', e.target.value)}
                      className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-black outline-none transition-all cursor-pointer"
                    >
                      {SURAHS.map(s => <option key={s.id} value={s.id}>{s.id}. {s.transliteration}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Surah</label>
                    <select
                      value={selection.endSurah}
                      onChange={(e) => handleSurahChange('endSurah', e.target.value)}
                      className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-black outline-none transition-all cursor-pointer"
                    >
                      {SURAHS.map(s => <option key={s.id} value={s.id}>{s.id}. {s.transliteration}</option>)}
                    </select>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Ayah</label>
                  <input
                    type="number"
                    min={1}
                    max={currentStartSurah?.total_verses}
                    value={selection.startAyah}
                    onChange={(e) => {
                      const ayahNum = parseInt(e.target.value, 10) || 1;
                      setSelection(prev => ({ ...prev, startAyah: ayahNum }));
                    }}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>
                {selection.type === 'range' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Ayah</label>
                    <input
                      type="number"
                      min={1}
                      max={currentEndSurah?.total_verses}
                      value={selection.endAyah}
                      onChange={(e) => {
                        const ayahNum = parseInt(e.target.value, 10) || 1;
                        setSelection(prev => ({ ...prev, endAyah: ayahNum }));
                      }}
                      className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-black outline-none transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-[2rem] shadow-sm overflow-hidden transition-all duration-300">
          <div className="px-6 md:px-10 py-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-sm font-black text-gray-900 uppercase">Transliteration Mapping</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customize phonetic output from Arabic text</p>
            </div>
            
            <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner border border-gray-200">
              <button 
                onClick={() => setSelection(prev => ({ ...prev, useCustomMapping: false }))}
                className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${!selection.useCustomMapping ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Standard
              </button>
              <button 
                onClick={() => setSelection(prev => ({ ...prev, useCustomMapping: true }))}
                className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${selection.useCustomMapping ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Custom Key
              </button>
            </div>
          </div>

          {selection.useCustomMapping && (
            <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-top duration-300">
              <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest block mb-2">Instructions</span>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm">
                    Modify individual character mappings or upload a key file. This will override the default transliteration.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-[10px] font-black uppercase hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" strokeWidth="2"/></svg>
                    Upload Key
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.txt" className="hidden" />
                  <button onClick={() => { setMapping({...DEFAULT_TRANS_MAP}); setIsMappingSaved(false); }} className="px-5 py-3 bg-white border border-gray-200 text-gray-400 rounded-xl text-[10px] font-black uppercase hover:text-red-500 transition-all">Reset</button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                {ARABIC_LETTERS.map(letter => (
                  <div key={letter.char} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl group transition-all hover:border-gray-300">
                    <span className="block text-2xl arabic-font text-gray-900 mb-1 group-hover:scale-110 transition-transform">{letter.char}</span>
                    <input 
                      type="text" 
                      value={mapping[letter.char] || ''} 
                      onChange={(e) => updateMapping(letter.char, e.target.value)}
                      className="w-full text-center bg-white border border-gray-100 rounded-lg text-xs font-black py-2 focus:border-black outline-none shadow-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center border-t border-gray-50 pt-8">
                <button 
                  onClick={handleSaveMapping}
                  className={`px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    isMappingSaved ? 'bg-gray-100 text-gray-300 cursor-default' : 'bg-black text-white hover:bg-gray-800 shadow-xl shadow-black/10'
                  }`}
                >
                  {isMappingSaved ? '✓ Mapping Saved' : 'Save Key Changes'}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-5 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-center shadow-xl animate-in zoom-in duration-200">
            {error}
          </div>
        )}

        <button
          onClick={handleProceed}
          disabled={loading}
          className={`w-full py-6 md:py-8 text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-2xl transition-all ${
            loading ? 'bg-gray-400 shadow-none' : 'bg-black hover:bg-gray-800 shadow-black/20 hover:-translate-y-1'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {statusText}
            </span>
          ) : 'Preview & Export Data'}
        </button>
      </div>
    </div>
  );
};

export default SelectionPage;
