
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

/**
 * Converts a number to Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩)
 * Returns the Unicode string that will form a ligature with U+06DD
 */
function toArabicIndicNumerals(num: number): string {
  // Arabic-Indic digits: ٠ (U+0660) through ٩ (U+0669)
  const arabicDigits = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];
  return num.toString().split('').map(digit => arabicDigits[parseInt(digit)]).join('');
}

export function processVerses(verses: Verse[], mapping: TransliterationMap | null): any[] {
  return verses.map(v => {
    // Convert ayah number to Arabic-Indic numerals
    const arabicAyahNum = toArabicIndicNumerals(v.ayah_number);
    
    // Use U+06DD (End of Ayah marker) followed by Arabic-Indic digits
    // This creates a ligature where the number appears inside the circle
    // Works with fonts that support Arabic ligatures (Amiri, Scheherazade, Noto Sans Arabic)
    const ayahMarker = ' \u06DD' + arabicAyahNum;
    
    return {
      surah_number: v.surah_number,
      ayah_number: v.ayah_number,
      arabic_uthmani: v.arabic_uthmani + ayahMarker,
      transliteration: mapping 
        ? generateCustomTransliteration(v.arabic_uthmani, mapping) 
        : v.transliteration_default,
      translation: v.english_text
    };
  });
}
