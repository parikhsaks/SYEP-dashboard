// ============================================================================
// CSV LOADER UTILITY
// ============================================================================
// Responsible for loading raw CSV survey exports from the public `/csv` folder
// and turning them into simple `{ [columnName]: value }` rows. Higher‑level
// analytics (grouping, distributions, trends) are handled separately in
// `dataProcessor.ts`.

export interface CSVRow {
  [key: string]: string;
}

// Per-file in-memory cache so we only fetch and parse each CSV once per session.
const csvCache: { [filename: string]: CSVRow[] } = {};

/**
 * Parse CSV text into an array of objects
 */
function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;
    
    const row: CSVRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Parse a single CSV line, handling quoted fields and commas
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  values.push(current.trim());

  return values;
}

/**
 * Fetch and parse CSV file
 * @param filename - Name of the CSV file to load (defaults to 'SYEP.csv')
 */
export async function fetchCSV(filename: string = 'SYEP.csv'): Promise<CSVRow[]> {
  // Return cached data if available
  if (csvCache[filename]) {
    return csvCache[filename];
  }

  try {
    const response = await fetch(`/csv/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const csvText = await response.text();
    const parsedData = parseCSV(csvText);
    csvCache[filename] = parsedData;
    return parsedData;
  } catch (error) {
    console.error(`Error loading CSV file ${filename}:`, error);
    throw error;
  }
}

/**
 * Clear cached CSV data (useful for testing or reloading)
 * @param filename - Optional filename to clear specific cache, or clear all if not provided
 */
export function clearCSVCache(filename?: string): void {
  if (filename) {
    delete csvCache[filename];
  } else {
    // Clear all cached data
    Object.keys(csvCache).forEach(key => delete csvCache[key]);
  }
}

/**
 * Get list of available CSV files
 */
export function getAvailableCSVFiles(): string[] {
  return [
    'SYEP.csv',
    'Bikes_Not_Bombs.csv',
    'Courageous_Sailing.csv',
    'YOU.csv',
    'SpokeArt.csv',
    'BGC.csv',
    'MLK.csv',
    'PIC.csv',
    'Franklin_Park.csv',
    'Boston_Police_Department.csv',
    'Mattapan_Greater_Boston_Technology.csv',
    'West_End_House_Boys_Girls_Club.csv',
    'Vine_St_Community_Center.csv'
  ];
}

/**
 * Get friendly name for CSV file
 */
export function getCSVFriendlyName(filename: string): string {
  const friendlyNames: { [key: string]: string } = {
    'SYEP.csv': 'SYEP',
    'Bikes_Not_Bombs.csv': 'Bikes Not Bombs',
    'Courageous_Sailing.csv': 'Courageous Sailing',
    'YOU.csv': 'YOU',
    'SpokeArt.csv': 'SpokeArt',
    'BGC.csv': 'BGC',
    'MLK.csv': 'MLK',
    'PIC.csv': 'PIC',
    'Franklin_Park.csv': 'Franklin Park',
    'Boston_Police_Department.csv': 'Boston Police Department',
    'Mattapan_Greater_Boston_Technology.csv': 'Mattapan Greater Boston Technology',
    'West_End_House_Boys_Girls_Club.csv': 'West End House Boys & Girls Club',
    'Vine_St_Community_Center.csv': 'Vine St Community Center'
  };
  
  return friendlyNames[filename] || filename.replace('.csv', '').replace(/_/g, ' ');
}
