import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <section className="text-center mb-10 pt-2 md:pt-4">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
          Quranic Data.<br/>
          <span className="text-gray-300">Export Tool.</span>
        </h2>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Enable teachers, students, and researchers to select any Quran verse or range and export them to CSV or Excel with custom transliteration.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            to="/select" 
            className="px-10 py-4 bg-black text-white text-lg font-bold rounded-xl shadow-xl hover:bg-gray-800 transition-all hover:-translate-y-1"
          >
            Start Selecting Verses
          </Link>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="mb-16">
        <h3 className="text-center text-sm font-black text-gray-300 uppercase tracking-[0.3em] mb-10">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg shadow-black/20">1</div>
            <h4 className="font-bold text-gray-900 mb-2">Select Verses</h4>
            <p className="text-sm text-gray-500 font-medium px-4">Choose any Surah or range from the JSON database and select your verses.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg shadow-black/20">2</div>
            <h4 className="font-bold text-gray-900 mb-2">Mapping Key</h4>
            <p className="text-sm text-gray-500 font-medium px-4">Define or upload your own transliteration scheme for Arabic characters.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg shadow-black/20">3</div>
            <h4 className="font-bold text-gray-900 mb-2">Export Data</h4>
            <p className="text-sm text-gray-500 font-medium px-4">Download a clean CSV or Excel file formatted exactly how you need it.</p>
          </div>
        </div>
      </section>

      <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-gray-50 shadow-sm mb-20 overflow-hidden">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Export Preview Sample</h4>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left text-[10px] md:text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-3 font-bold text-gray-400">Ref</th>
                  <th className="p-3 font-bold text-gray-400 text-right">Arabic</th>
                  <th className="p-3 font-bold text-gray-400">Phonetic</th>
                  <th className="p-3 font-bold text-gray-400">Translation</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-50">
                  <td className="p-3 font-bold">1:1</td>
                  <td className="p-3 text-right arabic-font text-base md:text-lg whitespace-nowrap">بِسمِ اللَّهِ الرَّحمٰنِ الرَّحيمِ</td>
                  <td className="p-3 font-medium italic">bismillāhir-raḥmānir-raḥīm</td>
                  <td className="p-3">In the name of Allah, the Entirely Merciful, the Especially Merciful</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">1:2</td>
                  <td className="p-3 text-right arabic-font text-base md:text-lg whitespace-nowrap">الحَمدُ لِلَّهِ رَبِّ العالَمينَ</td>
                  <td className="p-3 font-medium italic">alḥamdulillāhi rabbil-ʿālamīn</td>
                  <td className="p-3">All praise is due to Allah, Lord of the worlds</td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default HomePage;
