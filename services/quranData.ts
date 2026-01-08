
import { Verse, SelectionRange } from "../types";

/**
 * JSON verse data structure matching the csvjson.json file format
 */
interface JSONVerse {
  surah_number: number;
  ayah_number: number;
  arabic_uthmani: string;
  blank: string;
  english_saheeh_international: string;
}

/**
 * Loads and parses the JSON file containing all Quran verses.
 * The JSON file is the sole source of truth for verse data.
 */
async function loadJSONData(): Promise<Verse[]> {
  try {
    // In Vite, files in the public folder are served from the root
    const response = await fetch('/csvjson.json');
    if (!response.ok) {
      throw new Error(`Failed to access csvjson.json: ${response.statusText}`);
    }

    const jsonData: JSONVerse[] = await response.json();
    
    if (!Array.isArray(jsonData)) {
      throw new Error("Invalid JSON format: Expected an array of verses.");
    }

    // Convert JSON format to Verse format
    return jsonData.map((item: JSONVerse) => ({
      surah_number: Number(item.surah_number),
      ayah_number: Number(item.ayah_number),
      arabic_uthmani: item.arabic_uthmani || "",
      transliteration_default: item.blank || "",
      english_text: item.english_saheeh_international || ""
    })).filter(v => !isNaN(v.surah_number) && !isNaN(v.ayah_number));
  } catch (error) {
    console.error("JSON Loading Error:", error);
    throw error;
  }
}

/**
 * Searches the csvjson.json file directly for the requested verses.
 * No internal caching is used to ensure the JSON file is the sole source of truth.
 */
export async function getVersesFromJSON(selection: SelectionRange): Promise<Verse[]> {
  try {
    // Load all verses from JSON
    const allVerses = await loadJSONData();
    
    if (allVerses.length === 0) {
      return [];
    }

    // Normalize selection parameters to ensure they are numbers (not strings)
    // This ensures we're comparing numbers to numbers when searching the JSON
    const startSurahNum = Number(selection.startSurah);
    const startAyahNum = Number(selection.startAyah);
    const endSurahNum = Number(selection.endSurah);
    const endAyahNum = Number(selection.endAyah);

    // Validate normalized numbers
    if (isNaN(startSurahNum) || isNaN(startAyahNum) || isNaN(endSurahNum) || isNaN(endAyahNum)) {
      throw new Error("Invalid selection parameters: surah and ayah numbers must be valid numbers.");
    }

    // Filter based on user request using normalized numeric values
    if (selection.type === 'single') {
      return allVerses.filter(v => 
        v.surah_number === startSurahNum && v.ayah_number === startAyahNum
      );
    }

    if (selection.type === 'surah') {
      return allVerses.filter(v => v.surah_number === startSurahNum);
    }

    if (selection.type === 'range') {
      // For range, filter verses that fall within the specified range
      // Handle both same-surah and cross-surah ranges
      return allVerses.filter(v => {
        // If verse is before start, exclude
        if (v.surah_number < startSurahNum) return false;
        if (v.surah_number === startSurahNum && v.ayah_number < startAyahNum) return false;
        
        // If verse is after end, exclude
        if (v.surah_number > endSurahNum) return false;
        if (v.surah_number === endSurahNum && v.ayah_number > endAyahNum) return false;
        
        // Otherwise include
        return true;
      });
    }

    return [];
  } catch (error) {
    console.error("JSON Retrieval Error:", error);
    throw error;
  }
}

/**
 * Validates existence of selection within the JSON file.
 */
export async function validateJSONSelection(selection: SelectionRange): Promise<string | null> {
  const verses = await getVersesFromJSON(selection);
  
  if (verses.length === 0) {
    return "The requested verse or range does not exist.";
  }

  // Cross-surah range check
  if (selection.type === 'range') {
    if (selection.startSurah > selection.endSurah || (selection.startSurah === selection.endSurah && selection.startAyah > selection.endAyah)) {
      return "Start position must be before the end position.";
    }
  }

  return null;
}
