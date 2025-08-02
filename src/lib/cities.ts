export interface CityData {
  id: string;
  name: string;
  state: string;
  region: string;
  costMultiplier: number;
}

export const cities: CityData[] = [
  // South Central (baseline region)
  { id: "san-antonio", name: "San Antonio", state: "TX", region: "South Central", costMultiplier: 1.0 }, // Baseline
  { id: "houston", name: "Houston", state: "TX", region: "South Central", costMultiplier: 1.15 },
  { id: "dallas", name: "Dallas", state: "TX", region: "South Central", costMultiplier: 1.12 },
  { id: "austin", name: "Austin", state: "TX", region: "South Central", costMultiplier: 1.18 },
  { id: "oklahoma-city", name: "Oklahoma City", state: "OK", region: "South Central", costMultiplier: 0.95 },
  { id: "tulsa", name: "Tulsa", state: "OK", region: "South Central", costMultiplier: 0.92 },
  { id: "little-rock", name: "Little Rock", state: "AR", region: "South Central", costMultiplier: 0.90 },

  // Northeast (high cost region)
  { id: "new-york", name: "New York City", state: "NY", region: "Northeast", costMultiplier: 2.4 },
  { id: "boston", name: "Boston", state: "MA", region: "Northeast", costMultiplier: 2.1 },
  { id: "philadelphia", name: "Philadelphia", state: "PA", region: "Northeast", costMultiplier: 1.8 },
  { id: "pittsburgh", name: "Pittsburgh", state: "PA", region: "Northeast", costMultiplier: 1.4 },
  { id: "buffalo", name: "Buffalo", state: "NY", region: "Northeast", costMultiplier: 1.3 },
  { id: "providence", name: "Providence", state: "RI", region: "Northeast", costMultiplier: 1.7 },
  { id: "hartford", name: "Hartford", state: "CT", region: "Northeast", costMultiplier: 1.6 },

  // Southeast (moderate cost region)
  { id: "miami", name: "Miami", state: "FL", region: "Southeast", costMultiplier: 1.5 },
  { id: "atlanta", name: "Atlanta", state: "GA", region: "Southeast", costMultiplier: 1.25 },
  { id: "nashville", name: "Nashville", state: "TN", region: "Southeast", costMultiplier: 1.2 },
  { id: "raleigh", name: "Raleigh", state: "NC", region: "Southeast", costMultiplier: 1.15 },
  { id: "charlotte", name: "Charlotte", state: "NC", region: "Southeast", costMultiplier: 1.18 },
  { id: "orlando", name: "Orlando", state: "FL", region: "Southeast", costMultiplier: 1.3 },
  { id: "tampa", name: "Tampa", state: "FL", region: "Southeast", costMultiplier: 1.28 },
  { id: "jacksonville", name: "Jacksonville", state: "FL", region: "Southeast", costMultiplier: 1.2 },

  // West Coast (premium cost region)
  { id: "los-angeles", name: "Los Angeles", state: "CA", region: "West Coast", costMultiplier: 2.2 },
  { id: "san-francisco", name: "San Francisco", state: "CA", region: "West Coast", costMultiplier: 2.5 },
  { id: "san-diego", name: "San Diego", state: "CA", region: "West Coast", costMultiplier: 2.0 },
  { id: "sacramento", name: "Sacramento", state: "CA", region: "West Coast", costMultiplier: 1.8 },
  { id: "san-jose", name: "San Jose", state: "CA", region: "West Coast", costMultiplier: 2.3 },

  // Pacific Northwest (high cost region)
  { id: "seattle", name: "Seattle", state: "WA", region: "Pacific Northwest", costMultiplier: 2.0 },
  { id: "portland", name: "Portland", state: "OR", region: "Pacific Northwest", costMultiplier: 1.8 },
  { id: "spokane", name: "Spokane", state: "WA", region: "Pacific Northwest", costMultiplier: 1.4 },
  { id: "eugene", name: "Eugene", state: "OR", region: "Pacific Northwest", costMultiplier: 1.5 },
  { id: "boise", name: "Boise", state: "ID", region: "Pacific Northwest", costMultiplier: 1.3 },

  // Midwest (moderate to low cost region)
  { id: "chicago", name: "Chicago", state: "IL", region: "Midwest", costMultiplier: 1.7 },
  { id: "minneapolis", name: "Minneapolis", state: "MN", region: "Midwest", costMultiplier: 1.5 },
  { id: "detroit", name: "Detroit", state: "MI", region: "Midwest", costMultiplier: 1.2 },
  { id: "cleveland", name: "Cleveland", state: "OH", region: "Midwest", costMultiplier: 1.15 },
  { id: "indianapolis", name: "Indianapolis", state: "IN", region: "Midwest", costMultiplier: 1.1 },
  { id: "columbus", name: "Columbus", state: "OH", region: "Midwest", costMultiplier: 1.12 },
  { id: "milwaukee", name: "Milwaukee", state: "WI", region: "Midwest", costMultiplier: 1.25 },
  { id: "kansas-city", name: "Kansas City", state: "MO", region: "Midwest", costMultiplier: 1.05 },

  // Southwest (moderate cost region)
  { id: "phoenix", name: "Phoenix", state: "AZ", region: "Southwest", costMultiplier: 1.3 },
  { id: "las-vegas", name: "Las Vegas", state: "NV", region: "Southwest", costMultiplier: 1.35 },
  { id: "albuquerque", name: "Albuquerque", state: "NM", region: "Southwest", costMultiplier: 1.1 },
  { id: "tucson", name: "Tucson", state: "AZ", region: "Southwest", costMultiplier: 1.15 },
  { id: "el-paso", name: "El Paso", state: "TX", region: "Southwest", costMultiplier: 0.95 },

  // Mountain (varied cost region)
  { id: "denver", name: "Denver", state: "CO", region: "Mountain", costMultiplier: 1.6 },
  { id: "salt-lake-city", name: "Salt Lake City", state: "UT", region: "Mountain", costMultiplier: 1.4 },
  { id: "colorado-springs", name: "Colorado Springs", state: "CO", region: "Mountain", costMultiplier: 1.45 },
  { id: "fort-collins", name: "Fort Collins", state: "CO", region: "Mountain", costMultiplier: 1.5 },
  { id: "bozeman", name: "Bozeman", state: "MT", region: "Mountain", costMultiplier: 1.55 },
  { id: "reno", name: "Reno", state: "NV", region: "Mountain", costMultiplier: 1.45 }
];