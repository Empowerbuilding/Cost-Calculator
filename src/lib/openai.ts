import OpenAI from 'openai';
import { cities } from './cities';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getLocationCostData(cityId: string) {
  const city = cities.find(c => c.id === cityId);
  if (!city) throw new Error('City not found');
  return city.costMultiplier;
}

export async function getAIRecommendations(inputs: {
  bedrooms: number;
  bathrooms: number;
  garageSpace: number;
  livingSpace: number;
  patioSpace: number;
  location: string;
  sustainabilityScore: number;
  foundation: 'slab' | 'crawl' | 'basement';
  roofPitch: 'low' | 'medium' | 'high';
  interiorFinish: 'basic' | 'modern' | 'premium';
}) {
  const city = cities.find(c => c.id === inputs.location);

  // Define region-specific characteristics
  const regionData = {
    'Northeast': {
      climate: 'Cold winters, mild summers, high precipitation, frequent snow',
      challenges: 'Snow loads, freeze-thaw cycles, high energy costs, salt exposure',
      opportunities: 'Energy efficiency upgrades, basement utilization, thermal mass',
      materials: 'Brick, stone, engineered wood, metal roofing, ice barriers',
      codes: 'High energy efficiency requirements, strict snow load regulations'
    },
    'Southeast': {
      climate: 'Hot humid summers, mild winters, tropical storms, high rainfall',
      challenges: 'Hurricane resistance, humidity control, pest management, flooding',
      opportunities: 'Natural ventilation, outdoor living spaces, solar shading',
      materials: 'Hurricane-rated windows, moisture-resistant siding, metal roofs',
      codes: 'Hurricane protection requirements, flood zone regulations'
    },
    'Midwest': {
      climate: 'Extreme temperature variations, tornadoes, thunderstorms, seasonal changes',
      challenges: 'Storm protection, temperature control, foundation stability, wind loads',
      opportunities: 'Storm shelters, basement spaces, efficient HVAC, thermal barriers',
      materials: 'Storm-resistant roofing, reinforced foundations, impact windows',
      codes: 'Tornado shelter requirements, frost depth regulations'
    },
    'Southwest': {
      climate: 'Hot arid climate, intense sun exposure, minimal rainfall, dust storms',
      challenges: 'Heat management, water conservation, sun protection, dust control',
      opportunities: 'Solar power, xeriscaping, passive cooling, thermal mass',
      materials: 'Adobe, stucco, reflective roofing, shade structures, desert-adapted',
      codes: 'Water conservation requirements, solar-ready provisions'
    },
    'West Coast': {
      climate: 'Varied microclimates, earthquake risk, coastal conditions, fog exposure',
      challenges: 'Seismic requirements, coastal durability, fire resistance, salt air',
      opportunities: 'Indoor-outdoor living, sustainable design, natural lighting',
      materials: 'Seismic-rated materials, fire-resistant products, corrosion-resistant',
      codes: 'Strict seismic codes, wildfire protection requirements'
    },
    'Pacific Northwest': {
      climate: 'Frequent rain, mild temperatures, limited sun exposure, high humidity',
      challenges: 'Moisture management, mold prevention, natural light, moss growth',
      opportunities: 'Rainwater harvesting, daylighting design, green roofs',
      materials: 'Weather-resistant siding, quality waterproofing, cedar products',
      codes: 'Moisture protection requirements, rainwater management'
    },
    'Mountain': {
      climate: 'High altitude, extreme temperature swings, heavy snowfall, intense UV',
      challenges: 'Snow loads, UV exposure, thermal efficiency, altitude effects',
      opportunities: 'Views, natural materials, passive solar, thermal mass',
      materials: 'Heavy timber, stone, high-insulation products, snow guards',
      codes: 'Strict snow load requirements, high-altitude HVAC specifications'
    },
    'South Central': {
      climate: 'Hot summers, mild winters, severe storms, high humidity',
      challenges: 'Heat management, storm protection, foundation stability, clay soils',
      opportunities: 'Energy efficiency, storm shelters, outdoor spaces, shade',
      materials: 'Storm-resistant roofing, moisture barriers, pier foundations',
      codes: 'Foundation requirements, energy efficiency standards'
    }
  };

  const regionInfo = regionData[city?.region as keyof typeof regionData];

  const prompt = `As a senior construction expert in ${city?.name}, ${city?.state}, provide 3 detailed, location-specific recommendations for a ${inputs.livingSpace} sq ft home with ${inputs.bedrooms} bedrooms and ${inputs.bathrooms} bathrooms. Focus on maximizing value and addressing regional challenges.

Location Context:
- City: ${city?.name}, ${city?.state}
- Region: ${city?.region}
- Climate: ${regionInfo?.climate}
- Challenges: ${regionInfo?.challenges}
- Opportunities: ${regionInfo?.opportunities}
- Common Materials: ${regionInfo?.materials}
- Building Codes: ${regionInfo?.codes}

Project Details:
- Living Space: ${inputs.livingSpace} sq ft
- Garage: ${inputs.garageSpace} sq ft
- Patio: ${inputs.patioSpace} sq ft
- Foundation: ${inputs.foundation}
- Roof Pitch: ${inputs.roofPitch}
- Interior Finish: ${inputs.interiorFinish}
- Sustainability Priority: ${inputs.sustainabilityScore}/10

For each recommendation, provide:
1. Specific Action: What to implement
2. Regional Benefit: Why it's important for this location
3. Cost Impact: Initial cost and long-term savings
4. Local Context: How it aligns with regional practices
5. Implementation Details: Specific materials or methods
6. Code Compliance: Relevant local requirements

Format each recommendation as:
"[Action] - [Detailed explanation of regional benefits, implementation approach, and specific cost impacts. Include local building practices, material choices, and code requirements.]"

Example:
"Install a dual-zone HVAC system with humidity control - Essential for Houston's hot, humid climate. Reduces energy costs by 25-30% through targeted cooling. Meets local energy code requirements for SEER ratings. Use local-supplier Carrier systems with coastal-rated components ($8,000 initial cost, $600/year savings). Includes separate zones for upstairs/downstairs to combat heat stratification common in Texas homes."`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a local construction expert in ${city?.name}, ${city?.state} with 25+ years of experience. You have deep knowledge of regional building practices, climate considerations, and cost-effective solutions. Focus on providing detailed, actionable recommendations that specifically address local challenges and opportunities.`
        },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 1500
    });

    const recommendations = completion.choices[0].message.content
      ?.split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 3) || [];

    return recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
}

export interface MaterialAnalysis {
  roofing: string;
  siding: string;
  windows: string;
  doors: string;
  costImpact: {
    roofing: number;
    siding: number;
    windows: number;
    doors: number;
  };
}

export async function analyzeHouseImage(imageBase64: string): Promise<MaterialAnalysis> {
  const defaultAnalysis: MaterialAnalysis = {
    roofing: "Standard asphalt shingles",
    siding: "Standard vinyl siding",
    windows: "Standard double-pane windows",
    doors: "Standard fiberglass entry door",
    costImpact: {
      roofing: 1.0,
      siding: 1.0,
      windows: 1.0,
      doors: 1.0
    }
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert architectural materials analyst. Identify specific materials and provide concise, detailed descriptions. Focus on visible materials and their quality indicators."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this house image and identify:

1. Roofing Material:
- Specific material type (e.g., "architectural asphalt shingles", "slate tiles", "standing seam metal")
- Quality level (0.9=economy, 1.0=standard, 1.1-1.2=luxury)

2. Siding Material:
- Specific material type (e.g., "brick veneer", "fiber cement", "cedar shakes")
- Quality level (0.9=economy, 1.0=standard, 1.1-1.2=luxury)

3. Windows:
- Specific type (e.g., "vinyl double-hung", "aluminum-clad wood casement")
- Quality level (0.9=economy, 1.0=standard, 1.1-1.2=luxury)

4. Doors:
- Specific type (e.g., "steel with decorative glass", "solid wood craftsman")
- Quality level (0.9=economy, 1.0=standard, 1.1-1.2=luxury)

Be specific about materials identified. Avoid generic descriptions.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    const analysis = response.choices[0].message.content;
    
    if (analysis) {
      try {
        const sections = analysis.split(/\d\.\s+/);
        const costTierRegex = /Quality level.*?(\d+\.?\d*)/i;
        
        sections.forEach(section => {
          if (section.toLowerCase().includes('roofing')) {
            defaultAnalysis.roofing = extractDescription(section);
            defaultAnalysis.costImpact.roofing = extractCostTier(section, costTierRegex);
          } else if (section.toLowerCase().includes('siding')) {
            defaultAnalysis.siding = extractDescription(section);
            defaultAnalysis.costImpact.siding = extractCostTier(section, costTierRegex);
          } else if (section.toLowerCase().includes('window')) {
            defaultAnalysis.windows = extractDescription(section);
            defaultAnalysis.costImpact.windows = extractCostTier(section, costTierRegex);
          } else if (section.toLowerCase().includes('door')) {
            defaultAnalysis.doors = extractDescription(section);
            defaultAnalysis.costImpact.doors = extractCostTier(section, costTierRegex);
          }
        });
      } catch (error) {
        console.error('Error parsing analysis:', error);
      }
    }
    
    return defaultAnalysis;
  } catch (error) {
    console.error('Error analyzing house image:', error);
    throw error;
  }
}

function extractDescription(section: string): string {
  const materialMatch = section.match(/type:?\s*([^\.]+)/i);
  if (materialMatch && materialMatch[1]) {
    return materialMatch[1].trim();
  }
  
  // Fallback to first sentence if no specific material type found
  const lines = section.split('\n').filter(line => line.trim());
  if (lines.length === 0) return "";
  
  const description = lines[0].split(':').pop()?.trim() || lines[0].trim();
  return description.split('.')[0].trim();
}

function extractCostTier(section: string, regex: RegExp): number {
  const match = section.match(regex);
  if (match && match[1]) {
    const value = parseFloat(match[1]);
    return Math.max(0.9, Math.min(1.2, value));
  }
  return 1.0;
}