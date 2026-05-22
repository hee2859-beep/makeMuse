/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FacialMarker {
  id: string;
  name: string;
  xPercent: number; // 0-100% target of the canvas dimensions
  yPercent: number;
  label: string;
}

export interface SkinData {
  textureScore: number;     // 0-100 range: high = higher texture/flakes/flaws
  rednessScore: number;     // 0-100 range: high = more redness (a* activation)
  moistureScore: number;    // 0-100 range: high = higher hydration/reflection luminance
  skinTone: string;         // Light Beige, Natural Sandy, Deep Bronze, etc.
  personalColor: string;    // One of the 12 season types (e.g. Spring Warm Light)
  analyzedAt: string | null;
  profileId?: string;       // Associates with a specific user profile
}

export interface UserProfile {
  id: string;
  name: string;
  skinType: 'dry' | 'oily' | 'sensitive' | 'normal';
  notes: string;
  avatarColor: string; // Tailwinds color hex/class for visual grouping
}

export interface MakeupEvaluation {
  baseUniformity: number;       // 0-100 range: high = worse cakeyness / standard deviation anomaly
  eyelinerSymmetry: number;     // 0-20px range: eyeliner endpoint offset difference
  lipBorderOverstep: number;    // 0-100 range: high = lip overflow/slippage
  feedbackMessage: string;      // The AI custom generated commentary from Gemini
  analyzedAt: string | null;
}

export type PersonalColorSeason =
  | 'Spring Warm Light'
  | 'Spring Warm Bright'
  | 'Spring Warm Warm'
  | 'Summer Cool Light'
  | 'Summer Cool Muted'
  | 'Summer Cool Cool'
  | 'Autumn Warm Muted'
  | 'Autumn Warm Deep'
  | 'Autumn Warm Warm'
  | 'Winter Cool Bright'
  | 'Winter Cool Deep'
  | 'Winter Cool Cool';

export interface PersonalColorDetail {
  seasonName: PersonalColorSeason;
  koreanName: string;
  category: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  description: string;
  bestHexes: string[];
  makeupPalette: {
    base: string;
    blush: string;
    lip: string;
    eyeshadow: string;
  };
  recommendation: string;
}

export interface Tutorial {
  id: string;
  title: string;
  koreanTitle: string;
  level: 'Beginner' | 'Intermediate' | 'Master';
  levelNum: number; // 1-10 level scale
  requiredPrepScore: number; // Minimal skin prep score to unlock
  requiredColorUnlock: boolean; // True if it matches the current personal color season
  duration: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  steps: string[];
  // Overlay guidelines for AR (Relative % coords on viewport canvas: cheek x, y, eye x, y, lip x, y)
  arGuideLines: {
    type: 'blush' | 'eyeliner' | 'lips' | 'contour';
    color: string;
    points: Array<{ x: number; y: number }>;
    label: string;
  }[];
}
