export type PricingTier = 'economy' | 'standard' | 'luxury';
export type BuilderType = 'owner' | 'contractor';

export interface CalculatorInputs {
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
}

export interface ConsultationForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}