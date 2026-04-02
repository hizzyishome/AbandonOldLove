// src/utils/date.ts

/**
 * Calculates how many days have passed since a given date string.
 * @param dateStr ISO date string
 */
export function getDaysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays;
}
