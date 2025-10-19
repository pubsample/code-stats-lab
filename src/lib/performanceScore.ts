/**
 * Performance Score Calculator for Competitive Programming Analytics
 * 
 * Calculates a composite DSA performance score (0-100) based on multiple metrics
 * with weighted contributions from different aspects of competitive programming activity.
 */

export interface UserMetrics {
  // Rating metrics
  rating?: number;
  maxRating?: number;
  
  // Contest participation
  contestsParticipated?: number;
  maxContests?: number;
  
  // Activity consistency
  streakDays?: number;
  maxStreak?: number;
  
  // Problem solving
  upsolveCount?: number;
  maxUpsolve?: number;
  
  totalProblems?: number;
  maxProblems?: number;
  
  // Topic diversity
  topicsCovered?: number;
  maxTopics?: number;
  
  // Submission quality
  accuracy?: number; // Already a percentage (0-100)
  
  // Virtual contests
  virtualPerformance?: number; // Percentile-based (0-100)
}

export interface ScoreBreakdown {
  rating: number;
  contests: number;
  frequency: number;
  upsolve: number;
  totalProblems: number;
  topics: number;
  accuracy: number;
  virtual: number;
}

export interface PerformanceScoreResult {
  final_score: number;
  breakdown: ScoreBreakdown;
  tier: 'Beginner' | 'Intermediate' | 'Expert';
  tierColor: '🔴' | '🟡' | '🟢';
}

// Metric weights (must sum to 100)
const WEIGHTS = {
  rating: 25,
  contests: 15,
  frequency: 10,
  upsolve: 10,
  totalProblems: 15,
  topics: 10,
  accuracy: 10,
  virtual: 5,
} as const;

/**
 * Normalizes a value between 0 and 1 based on max value
 * Returns 0 if current or max is missing/invalid
 */
function normalize(current?: number, max?: number): number {
  if (!current || !max || max === 0 || current < 0) return 0;
  return Math.min(current / max, 1); // Cap at 1.0 (100%)
}

/**
 * Normalizes accuracy which is already a percentage (0-100)
 */
function normalizePercentage(percentage?: number): number {
  if (!percentage || percentage < 0) return 0;
  return Math.min(percentage / 100, 1);
}

/**
 * Determines tier based on final score
 */
function getTier(score: number): PerformanceScoreResult['tier'] {
  if (score >= 71) return 'Expert';
  if (score >= 41) return 'Intermediate';
  return 'Beginner';
}

/**
 * Gets color code for tier
 */
function getTierColor(tier: PerformanceScoreResult['tier']): PerformanceScoreResult['tierColor'] {
  switch (tier) {
    case 'Expert': return '🟢';
    case 'Intermediate': return '🟡';
    case 'Beginner': return '🔴';
  }
}

/**
 * Calculates the DSA Performance Score (0-100) based on weighted metrics
 * 
 * @param metrics - User metrics data from various competitive programming platforms
 * @returns Performance score result with breakdown and tier classification
 * 
 * @example
 * ```typescript
 * const userMetrics = {
 *   rating: 1750,
 *   maxRating: 3500,
 *   contestsParticipated: 28,
 *   maxContests: 100,
 *   streakDays: 45,
 *   maxStreak: 100,
 *   upsolveCount: 60,
 *   maxUpsolve: 200,
 *   totalProblems: 520,
 *   maxProblems: 1500,
 *   topicsCovered: 15,
 *   maxTopics: 40,
 *   accuracy: 87.5,
 *   virtualPerformance: 70
 * };
 * 
 * const result = calculatePerformanceScore(userMetrics);
 * console.log(result.final_score); // 86.4
 * ```
 */
export function calculatePerformanceScore(metrics: UserMetrics): PerformanceScoreResult {
  // Calculate normalized values for each metric
  const normalizedRating = normalize(metrics.rating, metrics.maxRating);
  const normalizedContests = normalize(metrics.contestsParticipated, metrics.maxContests);
  const normalizedFrequency = normalize(metrics.streakDays, metrics.maxStreak);
  const normalizedUpsolve = normalize(metrics.upsolveCount, metrics.maxUpsolve);
  const normalizedTotalProblems = normalize(metrics.totalProblems, metrics.maxProblems);
  const normalizedTopics = normalize(metrics.topicsCovered, metrics.maxTopics);
  const normalizedAccuracy = normalizePercentage(metrics.accuracy);
  const normalizedVirtual = normalizePercentage(metrics.virtualPerformance);

  // Calculate weighted scores for each metric
  const breakdown: ScoreBreakdown = {
    rating: parseFloat((normalizedRating * WEIGHTS.rating).toFixed(2)),
    contests: parseFloat((normalizedContests * WEIGHTS.contests).toFixed(2)),
    frequency: parseFloat((normalizedFrequency * WEIGHTS.frequency).toFixed(2)),
    upsolve: parseFloat((normalizedUpsolve * WEIGHTS.upsolve).toFixed(2)),
    totalProblems: parseFloat((normalizedTotalProblems * WEIGHTS.totalProblems).toFixed(2)),
    topics: parseFloat((normalizedTopics * WEIGHTS.topics).toFixed(2)),
    accuracy: parseFloat((normalizedAccuracy * WEIGHTS.accuracy).toFixed(2)),
    virtual: parseFloat((normalizedVirtual * WEIGHTS.virtual).toFixed(2)),
  };

  // Calculate final score (sum of all weighted scores)
  const finalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
  const roundedScore = parseFloat(finalScore.toFixed(1));

  // Determine tier
  const tier = getTier(roundedScore);
  const tierColor = getTierColor(tier);

  return {
    final_score: roundedScore,
    breakdown,
    tier,
    tierColor,
  };
}

/**
 * Validates that metrics have consistent data
 * Useful for debugging or API validation
 */
export function validateMetrics(metrics: UserMetrics): string[] {
  const warnings: string[] = [];

  if (metrics.rating && !metrics.maxRating) {
    warnings.push('Rating provided but maxRating is missing');
  }
  if (metrics.contestsParticipated && !metrics.maxContests) {
    warnings.push('Contests participated provided but maxContests is missing');
  }
  if (metrics.streakDays && !metrics.maxStreak) {
    warnings.push('Streak days provided but maxStreak is missing');
  }
  if (metrics.upsolveCount && !metrics.maxUpsolve) {
    warnings.push('Upsolve count provided but maxUpsolve is missing');
  }
  if (metrics.totalProblems && !metrics.maxProblems) {
    warnings.push('Total problems provided but maxProblems is missing');
  }
  if (metrics.topicsCovered && !metrics.maxTopics) {
    warnings.push('Topics covered provided but maxTopics is missing');
  }
  if (metrics.accuracy !== undefined && (metrics.accuracy < 0 || metrics.accuracy > 100)) {
    warnings.push('Accuracy should be between 0 and 100');
  }
  if (metrics.virtualPerformance !== undefined && (metrics.virtualPerformance < 0 || metrics.virtualPerformance > 100)) {
    warnings.push('Virtual performance should be between 0 and 100');
  }

  return warnings;
}

/**
 * Example maximum values for reference
 * These can be adjusted based on your platform's data distribution
 */
export const DEFAULT_MAX_VALUES = {
  maxRating: 3500,      // Codeforces Legendary Grandmaster
  maxContests: 100,     // Active competitive programmer
  maxStreak: 100,       // 100-day streak
  maxUpsolve: 200,      // Problems upsolved after contests
  maxProblems: 1500,    // Total problems across platforms
  maxTopics: 40,        // Number of different problem tags/topics
} as const;
