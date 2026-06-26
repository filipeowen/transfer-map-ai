import type { UwTransferResult } from "./uwTypes";

export type UwCourseCreditEstimate = {
  courseCode: string;
  credits: number | null;
  creditSource: "uw_equivalency" | "source_course" | "unreadable" | "not_counted";
};

export type UwCreditEstimate = {
  countedCredits: number;
  countedCourses: number;
  officialMatchesMissingCredits: number;
  notCountedCourses: number;
  courseEstimates: UwCourseCreditEstimate[];
};

export function estimateUwCredits(results: UwTransferResult[]): UwCreditEstimate {
  const courseEstimates = results.map((result): UwCourseCreditEstimate => {
    if (result.status !== "official_guide_match" || !result.equivalency) {
      return {
        courseCode: result.normalizedCourseCode,
        credits: null,
        creditSource: "not_counted"
      };
    }

    const uwCredits = parseCreditValue(result.equivalency.uwCredits);

    if (uwCredits !== null) {
      return {
        courseCode: result.normalizedCourseCode,
        credits: uwCredits,
        creditSource: "uw_equivalency"
      };
    }

    const sourceCredits = parseCreditValue(result.equivalency.sourceCredits);

    if (sourceCredits !== null) {
      return {
        courseCode: result.normalizedCourseCode,
        credits: sourceCredits,
        creditSource: "source_course"
      };
    }

    return {
      courseCode: result.normalizedCourseCode,
      credits: null,
      creditSource: "unreadable"
    };
  });

  return {
    countedCredits: courseEstimates.reduce(
      (total, estimate) => total + (estimate.credits ?? 0),
      0
    ),
    countedCourses: courseEstimates.filter((estimate) => estimate.credits !== null).length,
    officialMatchesMissingCredits: courseEstimates.filter(
      (estimate) => estimate.creditSource === "unreadable"
    ).length,
    notCountedCourses: courseEstimates.filter(
      (estimate) => estimate.creditSource === "not_counted"
    ).length,
    courseEstimates
  };
}

export function parseCreditValue(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const match = value.match(/\d+(?:\.\d+)?/);

  return match ? Number(match[0]) : null;
}
