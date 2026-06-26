import generatedEquivalencies from "./uwGeneratedEquivalencies.json";
import type { UwEquivalency, UwPlannerInput, UwTransferResult } from "./uwTypes";

const UW_EQUIVALENCIES = generatedEquivalencies as UwEquivalency[];

export function normalizeCourseCode(courseCode: string): string {
  const upper = courseCode.trim().toUpperCase().replace(/\s+/g, " ");

  return upper
    .replace(/\s*&\s*/g, "& ")
    .replace(/^([A-Z]+)&\s*([0-9][A-Z0-9]*)$/, "$1& $2")
    .replace(/^([A-Z]+)\s+([0-9][A-Z0-9]*)$/, "$1 $2");
}

export function getCourseDepartment(courseCode: string): string {
  const normalized = normalizeCourseCode(courseCode);
  const match = normalized.match(/^([A-Z]+)&?\s+/);
  return match?.[1] ?? normalized;
}

export function findUwEquivalency(input: UwPlannerInput): UwTransferResult {
  const normalizedCourseCode = normalizeCourseCode(input.courseCode);
  const collegeRows = UW_EQUIVALENCIES.filter(
    (row) => row.sourceCollegeSlug === input.sourceCollegeSlug
  );

  const primaryMatch = collegeRows.find(
    (row) => getCourseCodeCandidates(row.sourceCourseCode).primary === normalizedCourseCode
  );

  const aliasMatch = collegeRows.find((row) =>
    getCourseCodeCandidates(row.sourceCourseCode).aliases.includes(normalizedCourseCode)
  );

  const exactMatch = primaryMatch ?? aliasMatch;

  if (exactMatch) {
    return {
      studentCourseCode: input.courseCode,
      normalizedCourseCode,
      status: "official_guide_match",
      equivalency: exactMatch,
      possibleMatches: [],
      message: `UW's public guide lists ${normalizedCourseCode} from ${exactMatch.sourceCollege} as ${exactMatch.uwEquivalent}. Confirm final credit with UW.`
    };
  }

  const department = getCourseDepartment(normalizedCourseCode);
  const possibleMatches = collegeRows
    .filter((row) => getCourseCodeCandidates(row.sourceCourseCode).department === department)
    .slice(0, 12);

  if (possibleMatches.length > 0) {
    return {
      studentCourseCode: input.courseCode,
      normalizedCourseCode,
      status: "possible_match",
      equivalency: null,
      possibleMatches,
      message:
        "No exact match was found, but similar courses from this department appear in the guide. Confirm with an advisor."
    };
  }

  return {
    studentCourseCode: input.courseCode,
    normalizedCourseCode,
    status: "needs_advisor_review",
    equivalency: null,
    possibleMatches: [],
    message:
      "This course was not found in the current local UW guide data. Check UW's official guide or ask an advisor."
  };
}

export function getCourseCodeCandidates(sourceCourseCode: string): {
  primary: string | null;
  aliases: string[];
  department: string;
} {
  const cleaned = sourceCourseCode
    .replace(/^[§*\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();
  const fullCodeRegex = /([A-Z]{2,8}&?)\s+([0-9]{2,4}[A-Z]?)/g;
  const matches = [...cleaned.matchAll(fullCodeRegex)];
  const primary = matches[0]
    ? normalizeCourseCode(`${matches[0][1]} ${matches[0][2]}`)
    : null;
  const aliases = new Set<string>();

  matches.slice(1).forEach((match) => {
    aliases.add(normalizeCourseCode(`${match[1]} ${match[2]}`));
  });

  if (matches[0]) {
    const prefix = matches[0][1];
    const afterPrimary = cleaned.slice((matches[0].index ?? 0) + matches[0][0].length);
    const beforeCondition = afterPrimary.split(/\b(formerly|same as|if|formerly known)\b/i)[0];
    const repeatedNumbers = [...beforeCondition.matchAll(/,\s*([0-9]{2,4}[A-Z]?)/g)];

    repeatedNumbers.forEach((match) => {
      aliases.add(normalizeCourseCode(`${prefix} ${match[1]}`));
    });
  }

  if (primary) {
    aliases.delete(primary);
  }

  return {
    primary,
    aliases: [...aliases],
    department: primary ? getCourseDepartment(primary) : getCourseDepartment(cleaned)
  };
}

export function findManyUwEquivalencies(
  sourceCollegeSlug: string,
  courseCodes: string[]
): UwTransferResult[] {
  return courseCodes
    .map((courseCode) => courseCode.trim())
    .filter(Boolean)
    .map((courseCode) => findUwEquivalency({ sourceCollegeSlug, courseCode }));
}

export function countResultsByStatus(results: UwTransferResult[]) {
  return results.reduce(
    (counts, result) => {
      counts[result.status] += 1;
      return counts;
    },
    {
      official_guide_match: 0,
      possible_match: 0,
      not_found: 0,
      needs_advisor_review: 0
    }
  );
}
