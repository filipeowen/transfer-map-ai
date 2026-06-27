import { normalizeCourseCode } from "./uwMatching";

export type TranscriptExtractionResult = {
  courses: string[];
  ignoredCount: number;
};

const COURSE_CODE_PATTERN = /\b([A-Z]{2,8})\s*(&?)\s*([0-9]{3}[A-Z]?)\b/gi;

const LIKELY_NON_COURSE_PREFIXES = new Set([
  "AUT",
  "CUM",
  "GPA",
  "QTR",
  "SEM",
  "SPR",
  "SUM",
  "WIN"
]);

export function extractCourseCodesFromTranscriptText(
  transcriptText: string
): TranscriptExtractionResult {
  const courses = new Set<string>();
  let ignoredCount = 0;

  for (const match of transcriptText.matchAll(COURSE_CODE_PATTERN)) {
    const prefix = match[1].toUpperCase();
    const number = match[3].toUpperCase();

    if (LIKELY_NON_COURSE_PREFIXES.has(prefix)) {
      ignoredCount += 1;
      continue;
    }

    const normalized = normalizeCourseCode(
      `${prefix}${match[2] ? "&" : ""} ${number}`
    );

    if (normalized) {
      courses.add(normalized);
    }
  }

  return {
    courses: [...courses],
    ignoredCount
  };
}
