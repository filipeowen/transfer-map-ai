import { parseCreditValue } from "./uwCreditProgress";
import type { UwRequirementTrack, UwTransferResult } from "./uwTypes";

type RequirementCategory = "C" | "A&H" | "SSc" | "NSc" | "RSN";

type PlanningNoteInput = {
  intendedMajor: string;
  requirementTrack: UwRequirementTrack;
  result: UwTransferResult;
  results: UwTransferResult[];
};

type PlanningNote = {
  majorFit: string;
  creditFit: string;
};

const CATEGORY_LABELS: Record<RequirementCategory, string> = {
  C: "English Composition",
  "A&H": "Arts and Humanities",
  SSc: "Social Sciences",
  NSc: "Natural Sciences",
  RSN: "Reasoning"
};

export function getCoursePlanningNote({
  intendedMajor,
  requirementTrack,
  result,
  results
}: PlanningNoteInput): PlanningNote {
  const categories = getResultCategories(result);
  const credits = getResultCredits(result);

  return {
    majorFit: getMajorFitNote(result, intendedMajor),
    creditFit: getCreditFitNote({
      categories,
      credits,
      requirementTrack,
      result,
      results
    })
  };
}

function getMajorFitNote(result: UwTransferResult, intendedMajor: string): string {
  const major = intendedMajor.trim();

  if (!major) {
    return "Add a major to judge whether this helps with major prep.";
  }

  if (result.status !== "official_guide_match" || !result.equivalency) {
    return `Unclear for ${major} until UW or an advisor confirms the equivalency.`;
  }

  const majorKey = major.toLowerCase();
  const courseText = `${result.normalizedCourseCode} ${result.equivalency.uwEquivalent} ${result.equivalency.uwRequirement ?? ""}`.toLowerCase();

  if (
    hasAny(majorKey, ["engineering", "computer science", "cs", "data", "informatics"]) &&
    hasAny(courseText, ["math", "cse", "css", "phys", "chem", "stat", "program"])
  ) {
    return `Looks useful for ${major} prep, but confirm the exact major requirement.`;
  }

  if (
    hasAny(majorKey, ["biology", "pre-health", "pre health", "nursing", "medicine", "public health"]) &&
    hasAny(courseText, ["biol", "chem", "math", "phys", "psych", "stat"])
  ) {
    return `Looks relevant for ${major} prep or prerequisites. Confirm the required sequence.`;
  }

  if (
    hasAny(majorKey, ["business", "accounting", "finance", "marketing"]) &&
    hasAny(courseText, ["acct", "econ", "math", "stat", "qmeth", "engl", "composition"])
  ) {
    return `Looks potentially useful for ${major} prep or core skills. Confirm with Foster or an advisor.`;
  }

  if (
    hasAny(majorKey, ["psychology", "social work", "education", "policy"]) &&
    hasAny(courseText, ["psych", "soc", "educ", "engl", "composition", "stat"])
  ) {
    return `Looks potentially useful for ${major}. Ask whether it counts for major prep or only general education.`;
  }

  if (getResultCategories(result).includes("C")) {
    return `Useful for English Composition, but it may not be major prep for ${major}.`;
  }

  return `May help overall progress, but major fit for ${major} needs advisor confirmation.`;
}

function getCreditFitNote({
  categories,
  credits,
  requirementTrack,
  result,
  results
}: {
  categories: RequirementCategory[];
  credits: number | null;
  requirementTrack: UwRequirementTrack;
  result: UwTransferResult;
  results: UwTransferResult[];
}): string {
  if (result.status !== "official_guide_match" || !result.equivalency) {
    return "Do not count this yet. Ask UW whether it transfers and what requirement it may satisfy.";
  }

  if (categories.length === 0 || credits === null) {
    return "May count as elective or department credit. Ask whether you still need this kind of credit.";
  }

  const thresholds = getRequirementThresholds(requirementTrack);
  const category = pickPrimaryCategory(categories);
  const threshold = thresholds[category];
  const categoryCredits = getEnteredCreditsForCategory(results, category);
  const label = CATEGORY_LABELS[category];
  const secondaryCategory = categories.find(
    (candidate) => candidate !== category && thresholds[candidate]
  );

  if (!threshold) {
    return `May help with ${label}, but this UW track words that requirement differently. Confirm before taking more.`;
  }

  if (secondaryCategory) {
    const secondaryThreshold = thresholds[secondaryCategory];
    const secondaryCredits = getEnteredCreditsForCategory(results, secondaryCategory);
    const secondaryLabel = CATEGORY_LABELS[secondaryCategory];

    if (secondaryThreshold && categoryCredits >= threshold && secondaryCredits < secondaryThreshold) {
      return `This may complete ${label} (${categoryCredits}/${threshold}) and also help ${secondaryLabel} (${secondaryCredits}/${secondaryThreshold}). You may not need more ${label}, but likely still need more ${secondaryLabel}.`;
    }

    if (secondaryThreshold) {
      return `This may help ${label} (${categoryCredits}/${threshold}) and ${secondaryLabel} (${secondaryCredits}/${secondaryThreshold}). Confirm which bucket UW applies it to.`;
    }
  }

  if (categoryCredits > threshold) {
    return `You may already have more ${label} credit entered than this track lists (${categoryCredits}/${threshold}). Confirm before adding more.`;
  }

  if (categoryCredits === threshold) {
    return `This may complete the listed ${label} target (${categoryCredits}/${threshold}). You may not need more of this category.`;
  }

  return `This may help with ${label}. Entered courses show about ${categoryCredits}/${threshold} credits in this category.`;
}

function getRequirementThresholds(
  requirementTrack: UwRequirementTrack
): Partial<Record<RequirementCategory, number>> {
  return {
    C: parseCreditValue(requirementTrack.englishComposition) ?? undefined,
    "A&H": parseCategoryCredits(requirementTrack.areasOfInquiry, "A&H") ?? undefined,
    SSc: parseCategoryCredits(requirementTrack.areasOfInquiry, "SSc") ?? undefined,
    NSc: parseCategoryCredits(requirementTrack.areasOfInquiry, "NSc") ?? undefined,
    RSN: getReasoningCredits(requirementTrack.reasoning) ?? undefined
  };
}

function parseCategoryCredits(value: string, category: RequirementCategory): number | null {
  const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = value.match(new RegExp(`(\\d+)\\s*\\+?\\s*${escapedCategory}`, "i"));

  return match ? Number(match[1]) : null;
}

function getReasoningCredits(value: string): number | null {
  if (/none/i.test(value)) {
    return null;
  }

  if (/math\s*124\+?/i.test(value)) {
    return 5;
  }

  const numbers = [...value.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));

  if (numbers.length === 0) {
    return null;
  }

  return Math.max(...numbers);
}

function getEnteredCreditsForCategory(
  results: UwTransferResult[],
  category: RequirementCategory
): number {
  return results.reduce((total, result) => {
    if (!getResultCategories(result).includes(category)) {
      return total;
    }

    return total + (getResultCredits(result) ?? 0);
  }, 0);
}

function pickPrimaryCategory(categories: RequirementCategory[]): RequirementCategory {
  const priority: RequirementCategory[] = ["C", "RSN", "NSc", "SSc", "A&H"];

  return priority.find((category) => categories.includes(category)) ?? categories[0];
}

function getResultCategories(result: UwTransferResult): RequirementCategory[] {
  const requirement = result.equivalency?.uwRequirement ?? "";
  const categories = new Set<RequirementCategory>();

  if (/\[C\]|\bC\b|composition/i.test(requirement)) {
    categories.add("C");
  }

  if (/A&H|VLPA/i.test(requirement)) {
    categories.add("A&H");
  }

  if (/SSc|I&S/i.test(requirement)) {
    categories.add("SSc");
  }

  if (/NSc|NW/i.test(requirement)) {
    categories.add("NSc");
  }

  if (/RSN|QSR|Reasoning/i.test(requirement)) {
    categories.add("RSN");
  }

  return [...categories];
}

function getResultCredits(result: UwTransferResult): number | null {
  if (result.status !== "official_guide_match" || !result.equivalency) {
    return null;
  }

  return (
    parseCreditValue(result.equivalency.uwCredits) ??
    parseCreditValue(result.equivalency.sourceCredits)
  );
}

function hasAny(value: string, needles: string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}
