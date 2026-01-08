
import { TransliterationMap, Verse } from "../types";

/**
 * Applies a mapping of Arabic characters to a string.
 */
export function generateCustomTransliteration(text: string, mapping: TransliterationMap): string {
  let result = "";
  const chars = Array.from(text);
  
  for (const char of chars) {
    if (mapping[char]) {
      result += mapping[char];
    } else if (/[a-zA-Z0-9\s]/.test(char)) {
      result += char;
    }
    // Note: Tashkeel is ignored unless it's explicitly in the mapping
  }
  
  return result.replace(/\s+/g, ' ').trim() || "...";
}

export function processVerses(verses: Verse[], mapping: TransliterationMap | null): any[] {
  return verses.map(v => ({
    surah_number: v.surah_number,
    ayah_number: v.ayah_number,
    arabic_uthmani: v.arabic_uthmani,
    transliteration: mapping 
      ? generateCustomTransliteration(v.arabic_uthmani, mapping) 
      : v.transliteration_default,
    translation: v.english_text
  }));
}
