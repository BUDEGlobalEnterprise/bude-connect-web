// Auto-generated location loader
export const stateAccesor = {
  "Andaman & Nicobar Islands": "andaman--nicobar-islands",
  "Andhra Pradesh": "andhra-pradesh",
  "Arunachal Pradesh": "arunachal-pradesh",
  "Assam": "assam",
  "Bihar": "bihar",
  "Chandigarh": "chandigarh",
  "Chhattisgarh": "chhattisgarh",
  "Dadra & Nagar Haveli": "dadra--nagar-haveli",
  "Daman & Diu": "daman--diu",
  "Goa": "goa",
  "Gujarat": "gujarat",
  "Haryana": "haryana",
  "Himachal Pradesh": "himachal-pradesh",
  "Jammu & Kashmir": "jammu--kashmir",
  "Jharkhand": "jharkhand",
  "Karnataka": "karnataka",
  "Kerala": "kerala",
  "Lakshadweep": "lakshadweep",
  "Madhya Pradesh": "madhya-pradesh",
  "Maharashtra": "maharashtra",
  "Manipur": "manipur",
  "Meghalaya": "meghalaya",
  "Mizoram": "mizoram",
  "Nagaland": "nagaland",
  "Nct Of Delhi": "nct-of-delhi",
  "Odisha": "odisha",
  "Puducherry": "puducherry",
  "Punjab": "punjab",
  "Rajasthan": "rajasthan",
  "Sikkim": "sikkim",
  "Tamil Nadu": "tamil-nadu",
  "Tripura": "tripura",
  "Uttarakhand": "uttarakhand",
  "West Bengal": "west-bengal"
} as const;

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
    const data = await import(`./${slug}.json`);
    return data.default || data;
  } catch (error) {
    console.error(`Failed to load location data for ${stateName}`, error);
    return null;
  }
}
