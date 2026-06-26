export type UwEquivalency = {
  id: string;
  sourceCollege: string;
  sourceCollegeSlug: string;
  sourceCourseCode: string;
  sourceCredits: string | null;
  uwEquivalent: string;
  uwCredits: string | null;
  uwRequirement: string | null;
  effectiveDate: string | null;
  department: string | null;
  notes: string | null;
  sourceUrl: string;
  lastChecked: string;
};

export type UwMatchStatus =
  | "official_guide_match"
  | "possible_match"
  | "not_found"
  | "needs_advisor_review";

export type UwTransferResult = {
  studentCourseCode: string;
  normalizedCourseCode: string;
  status: UwMatchStatus;
  equivalency: UwEquivalency | null;
  possibleMatches: UwEquivalency[];
  message: string;
};

export type WaCollege = {
  name: string;
  slug: string;
  uwGuideSlug: string;
};

export type UwPlannerInput = {
  sourceCollegeSlug: string;
  courseCode: string;
};

export type UwRequirementTrack = {
  id: string;
  school: string;
  major: string;
  minimumDegreeCredits: number;
  areasOfInquiry: string;
  englishComposition: string;
  writing: string;
  foreignLanguage: string;
  reasoning: string;
  comments: string | null;
  sourceUrl: string;
  lastChecked: string;
};
