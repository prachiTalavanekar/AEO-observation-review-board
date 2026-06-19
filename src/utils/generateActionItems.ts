import type { Observation } from "@/types/observation";

/**
 * Rule-based action item generator.
 * Always generates 3 baseline items.
 * Adds competitor-specific items when competitors are present.
 */
export function generateActionItems(observation: Observation): string[] {
  const items: string[] = [
    "Add FAQ schema markup to improve AI answer eligibility",
    "Improve website content to better match target query intent",
    "Increase topical authority with in-depth content and backlinks",
  ];

  if (observation.competitor_names.length > 0) {
    const competitors = observation.competitor_names.join(", ");
    items.push(
      `Create comparison pages against competitors: ${competitors}`
    );
  }

  return items;
}
