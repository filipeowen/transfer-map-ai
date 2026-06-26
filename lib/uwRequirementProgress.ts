import { parseCreditValue } from "./uwCreditProgress";
import type { UwRequirementTrack, UwTransferResult } from "./uwTypes";

export type UwRequirementProgressItem = {
  id: string;
  label: string;
  earnedCredits: number;
  requiredCredits: number | null;
  percent: number;
  courseCodes: string[];
  detail: string;
  status: "complete" | "in_progress" | "not_started" | "review" | "not_required";
};

type RequirementCategory =
  | "englishComposition"
  | "writing"
  | "reasoning"
  | "foreignLanguage"
  | "diversity"
  | "artsHumanities"
  | "socialSciences"
  | "naturalSciences";

type RequirementDefinition = {
  id: RequirementCategory;
  label: string;
  requiredCredits: (track: UwRequirementTrack) => number | null;
};

const REQUIREMENTS: RequirementDefinition[] = [
  {
    id: "englishComposition",
    label: "English Composition",
    requiredCredits: (track) => parseCreditValue(track.englishComposition)
  },
  {
    id: "writing",
    label: "Writing",
    requiredCredits: (track) => getWritingCredits(track.writing)
  },
  {
    id: "reasoning",
    label: "Reasoning",
    requiredCredits: (track) => getReasoningCredits(track.reasoning)
  },
  {
    id: "foreignLanguage",
    label: "Foreign Language",
    requiredCredits: (track) => getForeignLanguageCredits(track.foreignLanguage)
  },
  {
    id: "diversity",
    label: "Diversity",
    requiredCredits: () => null
  },
  {
    id: "artsHumanities",
    label: "Arts and Humanities",
    requiredCredits: (track) => parseAreaCredits(track.areasOfInquiry, "A&H")
  },
  {
    id: "socialSciences",
    label: "Social Sciences",
    requiredCredits: (track) => parseAreaCredits(track.areasOfInquiry, "SSc")
  },
  {
    id: "naturalSciences",
    label: "Natural Sciences",
    requiredCredits: (track) => parseAreaCredits(track.areasOfInquiry, "NSc")
  }
];

export function getRequirementProgressItems(
  requirementTrack: UwRequirementTrack,
  results: UwTransferResult[]
): UwRequirementProgressItem[] {
  return REQUIREMENTS.map((requirement) => {
    const requiredCredits = requirement.requiredCredits(requirementTrack);
    const matchingResults = results.filter((result) =>
      getResultRequirementCategories(result).includes(requirement.id)
    );
    const earnedCredits = matchingResults.reduce(
      (total, result) => total + (getResultCredits(result) ?? 0),
      0
    );
    const percent =
      requiredCredits && requiredCredits > 0
        ? Math.min(100, Math.round((earnedCredits / requiredCredits) * 100))
        : requiredCredits === 0
          ? 100
          : 0;

    return {
      id: requirement.id,
      label: requirement.label,
      earnedCredits,
      requiredCredits,
      percent,
      courseCodes: matchingResults.map((result) => result.normalizedCourseCode),
      detail: getProgressDetail({
        earnedCredits,
        requirement,
        requiredCredits,
        matchingResults
      }),
      status: getProgressStatus(earnedCredits, requiredCredits)
    };
  });
}

function getProgressStatus(
  earnedCredits: number,
  requiredCredits: number | null
): UwRequirementProgressItem["status"] {
  if (requiredCredits === 0) {
    return "not_required";
  }

  if (requiredCredits === null) {
    return "review";
  }

  if (earnedCredits >= requiredCredits) {
    return "complete";
  }

  if (earnedCredits > 0) {
    return "in_progress";
  }

  return "not_started";
}

function getProgressDetail({
  earnedCredits,
  matchingResults,
  requirement,
  requiredCredits
}: {
  earnedCredits: number;
  matchingResults: UwTransferResult[];
  requirement: RequirementDefinition;
  requiredCredits: number | null;
}) {
  if (requiredCredits === 0) {
    return "This selected University track does not list a separate credit requirement here.";
  }

  if (requirement.id === "diversity") {
    return "Diversity usually overlaps with other requirements. Ask an advisor which matched course, if any, can satisfy it.";
  }

  if (requiredCredits === null) {
    return "This requirement depends on placement, course sequence, or department rules. Confirm with an advisor.";
  }

  if (matchingResults.length === 0) {
    return "No submitted official-guide matches are counted here yet.";
  }

  return `Counted from ${matchingResults
    .map((result) => result.normalizedCourseCode)
    .join(", ")}. Estimated ${earnedCredits} of ${requiredCredits} credits.`;
}

function getResultRequirementCategories(result: UwTransferResult): RequirementCategory[] {
  if (result.status !== "official_guide_match" || !result.equivalency) {
    return [];
  }

  const requirement = result.equivalency.uwRequirement ?? "";
  const searchableText = [
    requirement,
    result.equivalency.sourceCourseCode,
    result.equivalency.uwEquivalent,
    result.equivalency.notes
  ]
    .filter(Boolean)
    .join(" ");
  const categories = new Set<RequirementCategory>();

  if (/\[C\]|\bC\b|composition/i.test(requirement)) {
    categories.add("englishComposition");
  }

  if (/\bW\b|writing/i.test(requirement)) {
    categories.add("writing");
  }

  if (/A&H|VLPA/i.test(requirement)) {
    categories.add("artsHumanities");
  }

  if (/SSc|I&S/i.test(requirement)) {
    categories.add("socialSciences");
  }

  if (/NSc|NW/i.test(requirement)) {
    categories.add("naturalSciences");
  }

  if (/RSN|QSR|Reasoning/i.test(requirement)) {
    categories.add("reasoning");
  }

  if (/DIV|Diversity/i.test(searchableText)) {
    categories.add("diversity");
  }

  if (/foreign language/i.test(searchableText)) {
    categories.add("foreignLanguage");
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

function parseAreaCredits(value: string, code: "A&H" | "SSc" | "NSc"): number | null {
  const escapedCode = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = value.match(new RegExp(`(\\d+)\\s*(?:-\\s*\\d+)?\\s*\\+?\\s*${escapedCode}`, "i"));

  return match ? Number(match[1]) : null;
}

function getWritingCredits(value: string): number | null {
  if (/none/i.test(value)) {
    return null;
  }

  if (/credits?/i.test(value)) {
    return parseCreditValue(value);
  }

  return null;
}

function getReasoningCredits(value: string): number | null {
  if (/none/i.test(value)) {
    return null;
  }

  if (/credits?/i.test(value)) {
    const numbers = [...value.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));

    return numbers.length > 0 ? Math.max(...numbers) : null;
  }

  if (/\b(MATH|Q SCI|STAT|QMETH)\b/i.test(value)) {
    return 5;
  }

  return null;
}

function getForeignLanguageCredits(value: string): number | null {
  if (/none/i.test(value)) {
    return 0;
  }

  if (/0\s*-\s*15|third quarter/i.test(value)) {
    return 15;
  }

  return parseCreditValue(value);
}
