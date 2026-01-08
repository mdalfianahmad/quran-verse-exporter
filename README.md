# Quran Verse Exporter

A web application for exporting Quranic verses from a CSV database to CSV or Excel formats with custom transliteration support.

## Features

- Select individual verses, ranges, or entire surahs
- Export to CSV or Excel format
- Custom transliteration mapping
- Reads directly from `quran_data.csv`

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:3000`)

## CSV Format

The app expects a CSV file named `quran_data.csv` with the following columns:
- `surah_number` - The surah number
- `ayah_number` - The ayah number
- `arabic_uthmani` - Arabic text in Uthmani script
- `blank` - Transliteration (can be blank)
- `english_saheeh_international` - English translation
