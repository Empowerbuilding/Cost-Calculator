import { PricingTier } from '../types';

export const CONTRACTOR_MARKUP = 0.18;

export const FOUNDATION_FACTORS = {
  slab: 1,
  crawl: 1.08,  // Changed from 1.15 to 1.08 (8% increase)
  basement: 1.2  // Changed from 1.4 to 1.2 (20% increase)
};

export const ROOF_PITCH_FACTORS = {
  low: 1,
  medium: 1.05,  // Changed from 1.1 to 1.05 (5% increase)
  high: 1.1      // Changed from 1.2 to 1.1 (10% increase)
};

export const INTERIOR_FINISH_FACTORS = {
  basic: 1,
  modern: 1.15,
  premium: 1.35
};

// Cost factors adjusted based on 2025 San Antonio market rates
// These are base prices that get multiplied by square footage or count
export const COST_FACTORS: Record<PricingTier, {
  bedroom: number;  // Cost per bedroom (includes framing, electrical, HVAC)
  bathroom: number; // Cost per bathroom (includes plumbing, fixtures, tile)
  garage: number;   // Cost per sq ft of garage
  living: number;   // Cost per sq ft of living space
  patio: number;    // Cost per sq ft of patio
}> = {
  economy: {
    bedroom: 8000,   // Basic fixtures and finishes
    bathroom: 6000,  // Standard fixtures, basic tile
    garage: 45,      // Basic slab and framing
    living: 85,      // Basic finishes and materials
    patio: 25       // Simple concrete finish
  },
  standard: {
    bedroom: 12000,  // Mid-grade fixtures and finishes
    bathroom: 9000,  // Quality fixtures, better tile
    garage: 60,      // Enhanced electrical and finishing
    living: 110,     // Better quality materials
    patio: 35       // Textured or stamped concrete
  },
  luxury: {
    bedroom: 18000,  // High-end fixtures and finishes
    bathroom: 15000, // Premium fixtures, custom tile
    garage: 85,      // Full finishing, epoxy floors
    living: 150,     // Premium materials and finishes
    patio: 50       // Custom stonework or premium finish
  }
};