const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'bharat-location-hub/public/api/states';
const OUTPUT_DIR = 'packages/shared/src/data/locations';
const INDEX_FILE = path.join(OUTPUT_DIR, 'index.ts');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function extractLocations() {
  const stateFiles = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.json'));
  const stateMap = {}; // { "State Name": "state-slug" }

  stateFiles.forEach(file => {
    const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf-8');
    const data = JSON.parse(content);
    
    // Normalize State Name
    const stateName = toTitleCase(data.state);
    const stateSlug = file.replace('.json', ''); // e.g., 'andhra-pradesh'
    
    stateMap[stateName] = stateSlug;

    // Build optimized hierarchy: District -> Taluka -> Villages
    const optimizedData = {
      name: stateName,
      districts: data.districts.map(d => ({
        name: d.name,
        talukas: d.talukas.map(t => ({
          name: t.name,
          villages: t.villages.map(v => v.name) // Just array of strings to save space
        }))
      }))
    };

    // Write individual state file
    const outputPath = path.join(OUTPUT_DIR, `${stateSlug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(optimizedData));
    console.log(`Generated ${stateSlug}.json`);
  });

  // Generate Index File with Dynamic Imports
  const indexContent = `// Auto-generated location loader
export const stateAccesor = ${JSON.stringify(stateMap, null, 2)} as const;

export type StateSlug = (typeof stateAccesor)[keyof typeof stateAccesor];

export interface LocationHierarchy {
  name: string;
  districts: {
    name: string;
    talukas: {
      name: string;
      villages: string[];
    }[];
  }[];
}

export async function getLocationData(stateName: string): Promise<LocationHierarchy | null> {
  const slug = stateAccesor[stateName as keyof typeof stateAccesor];
  if (!slug) return null;

  try {
    // Dynamic import based on slug
    const data = await import(\`./\${slug}.json\`);
    return data.default || data;
  } catch (error) {
    console.error(\`Failed to load location data for \${stateName}\`, error);
    return null;
  }
}
`;

  fs.writeFileSync(INDEX_FILE, indexContent);
  console.log(`Generated index.ts`);
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

extractLocations();
