import type { UwEquivalency, WaCollege } from "./uwTypes";
import generatedColleges from "./uwGeneratedColleges.json";

export const UW_TARGET_SCHOOL = "University of Washington Seattle";

export const UW_GUIDE_URL =
  "https://admit.washington.edu/apply/transfer/equivalency-guide/";

export const WASHINGTON_COMMUNITY_COLLEGES: WaCollege[] =
  generatedColleges as WaCollege[];

export function getCollegeName(slug: string): string {
  return (
    WASHINGTON_COMMUNITY_COLLEGES.find((college) => college.slug === slug)?.name ??
    "Selected Washington college"
  );
}

export function getCollegeSlug(name: string): string | null {
  return (
    WASHINGTON_COMMUNITY_COLLEGES.find((college) => college.name === name)?.slug ??
    null
  );
}

export function getCollegeGuideUrl(slug: string): string {
  const guideSlug =
    WASHINGTON_COMMUNITY_COLLEGES.find((college) => college.slug === slug)
      ?.uwGuideSlug ?? slug;

  return `${UW_GUIDE_URL}${guideSlug}/`;
}

// Demo-only seed rows for local development.
// Replace and expand this file with parsed, timestamped data from UW's public
// transfer equivalency guide before using the product for real advising.
export const UW_MOCK_EQUIVALENCIES: UwEquivalency[] = [
  // Kept as a compatibility export. The app now uses generated local UW guide
  // data from lib/uwGeneratedEquivalencies.json.
];
