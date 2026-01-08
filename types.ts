
export interface SurahMetadata {
  id: number;
  name: string;
  transliteration: string;
  total_verses: number;
}

export interface Verse {
  surah_number: number;
  ayah_number: number;
  arabic_uthmani: string;
  transliteration_default: string; // The 'blank' column
  english_text: string; // The 'english_saheeh_international' column
}

export type ExportFormat = 'CSV' | 'XLSX';

export interface TransliterationMap {
  [key: string]: string;
}

export interface SelectionRange {
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  type: 'single' | 'range' | 'surah';
  translation: string;
  useCustomMapping: boolean;
}

export interface TranslationOption {
  id: string;
  language: string;
  name: string;
}
