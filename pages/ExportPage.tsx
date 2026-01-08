
import React, { useState, useMemo } from 'react';
import { Verse, TransliterationMap, ExportFormat } from '../types';
import { processVerses } from '../services/transliteration';
import { exportData } from '../services/exporter';
import { Link } from 'react-router-dom';

interface ExportPageProps {
  verses: Verse[];
  mapping: TransliterationMap | null;
}

const ExportPage: React.FC<ExportPageProps> = ({ verses, mapping }) => {
  const [format, setFormat] = useState<ExportFormat>('CSV');
  const [isExporting, setIsExporting] = useState(false);

  const processedData = useMemo(() => processVerses(verses, mapping), [verses, mapping]);
  const previewData = processedData.slice(0, 10);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = `Quran_Export_${new Date().toISOString().split('T')[0]}`;
      await exportData(processedData, format, filename);
    } catch (err) {
      alert("Export failed. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  if (verses.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No verses selected</h2>
        <p className="text-gray-600 mb-8 font-medium">Please select some verses before exporting.</p>
        <Link to="/select" className="px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
          Go to Selection
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">Export Ready</h1>
          <p className="text-gray-500 font-medium">Review your {verses.length} selected verses fetched from the JSON database.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
            <button
              onClick={() => setFormat('CSV')}
              className={`px-8 py-2.5 text-xs font-black rounded-xl transition-all ${format === 'CSV' ? 'bg-white text-black shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}
            >
              CSV
            </button>
            <button
              onClick={() => setFormat('XLSX')}
              className={`px-8 py-2.5 text-xs font-black rounded-xl transition-all ${format === 'XLSX' ? 'bg-white text-black shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}
            >
              EXCEL
            </button>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`h-14 px-10 bg-black text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-black/20 hover:bg-gray-800 transition-all flex items-center ${isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'}`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              `Download ${format}`
            )}
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="px-10 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Data Preview (First 10 Rows)</h3>
          <span className={`px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest ${mapping ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
            {mapping ? 'Custom Mapping Applied' : 'Native CSV Content'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-[10px] uppercase text-gray-300 font-black border-b border-gray-50">
                <th className="px-10 py-5 w-16">Ayah</th>
                <th className="px-10 py-5 text-right">Arabic</th>
                <th className="px-10 py-5">Phonetic</th>
                <th className="px-10 py-5">English (Saheeh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {previewData.map((row) => (
                <tr key={`${row.surah_number}:${row.ayah_number}`} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-10 py-8 text-sm font-black text-gray-900">{row.surah_number}:{row.ayah_number}</td>
                  <td className="px-10 py-8 text-3xl arabic-font text-right text-gray-900 leading-[1.6]">{row.arabic_uthmani}</td>
                  <td className="px-10 py-8 text-sm text-gray-600 font-medium italic leading-relaxed max-w-xs">{row.transliteration}</td>
                  <td className="px-10 py-8 text-sm text-gray-400 font-medium leading-relaxed max-w-sm">{row.translation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {processedData.length > 10 && (
          <div className="p-8 bg-gray-50 text-center border-t border-gray-50">
            <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">+ {processedData.length - 10} additional verses in selection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPage;
