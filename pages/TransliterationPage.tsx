
import React from 'react';
import { TransliterationMap } from '../types';
import { ARABIC_LETTERS, DEFAULT_TRANS_MAP } from '../constants';

interface TransliterationPageProps {
  mapping: TransliterationMap;
  setMapping: React.Dispatch<React.SetStateAction<TransliterationMap>>;
  useCustom: boolean;
  setUseCustom: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransliterationPage: React.FC<TransliterationPageProps> = ({ mapping, setMapping, useCustom, setUseCustom }) => {
  const handleCharChange = (char: string, val: string) => {
    setMapping(prev => ({ ...prev, [char]: val }));
  };

  const handleReset = () => {
    if (confirm("Reset transliteration key to default?")) {
      setMapping({ ...DEFAULT_TRANS_MAP });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">Transliteration Key</h1>
          <p className="text-gray-500 font-medium">Customize the Latin mapping for each Arabic character.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors py-2 px-3"
          >
            Reset to Default
          </button>
          <div className="flex items-center space-x-3 bg-white border-2 border-gray-100 px-5 py-3 rounded-2xl shadow-sm">
            <span className="text-sm font-bold text-gray-800">Use Custom Mapping</span>
            <button
              onClick={() => setUseCustom(!useCustom)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                useCustom ? 'bg-black' : 'bg-gray-200'
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                useCustom ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="p-10 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {ARABIC_LETTERS.map(({ char, name }) => (
              <div key={char} className="flex flex-col space-y-3 bg-white p-5 border-2 border-gray-50 rounded-3xl transition-all hover:border-gray-200 hover:shadow-lg group">
                <div className="flex justify-between items-start">
                  <span className="text-4xl arabic-font leading-none text-black font-bold group-hover:scale-110 transition-transform">{char}</span>
                  <span className="text-[10px] text-gray-300 font-black uppercase tracking-tighter">{name}</span>
                </div>
                <input
                  type="text"
                  value={mapping[char] || ''}
                  onChange={(e) => handleCharChange(char, e.target.value)}
                  placeholder="..."
                  className="w-full text-center py-3 px-2 text-base font-bold border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black outline-none bg-gray-50 text-gray-900 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="p-8 bg-gray-900 text-[11px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-3">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Changes are saved automatically to your local browser storage.
        </div>
      </div>
    </div>
  );
};

export default TransliterationPage;
