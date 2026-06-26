import type { UwRequirementTrack } from "./uwTypes";

export const UW_MINIMUM_BACCALAUREATE_CREDITS = 180;

export const UW_DEGREE_OVERVIEW_URL =
  "https://advising.uw.edu/degree-overview/your-uw-degree/";

export const UW_REQUIREMENTS_BY_COLLEGE_URL =
  "https://advising.uw.edu/degree-overview/general-education/requirements-by-college-and-school/";

// Example local data extracted from UW Undergraduate Advising's public
// requirements-by-college page. Refresh this if UW changes the page content.
export const UW_REQUIREMENT_TRACKS: UwRequirementTrack[] = [
  {
    id: "arts-sciences-all-majors",
    school: "College of Arts and Sciences",
    major: "All majors",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "20 A&H, 20 SSc, 20 NSc, 15 additional",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "Through third quarter of first-year sequence",
    reasoning: "4 or 5 credits from the RSN list",
    comments: null,
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "built-environments-architectural-design",
    school: "College of Built Environments",
    major: "Architectural Design",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "20 A&H, 20 SSc, 20 NSc, 5 additional",
    englishComposition: "5 credits",
    writing: "7 credits",
    foreignLanguage: "None",
    reasoning: "MATH 112, 124, or Q SCI 291",
    comments: "No ARCH except 150, 151, and 251 may count toward AoI; NSc includes calculus.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "built-environments-architecture",
    school: "College of Built Environments",
    major: "Architecture",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "20 A&H, 20 SSc, 20 NSc, 5 additional",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "MATH 112, 124, or Q SCI 291",
    comments: "No ARCH except 150, 151, and 251 may count toward AoI; NSc includes calculus.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "built-environments-cep",
    school: "College of Built Environments",
    major: "Community, Environment & Planning",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "20 A&H, 20 SSc, 20 NSc",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "4 or 5 credits from the Q/SR list; MATH 112 or 124 recommended",
    comments: "CEP 200 (SSc) recommended; Areas of Inquiry must include an approved Diversity course.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "built-environments-construction-management",
    school: "College of Built Environments",
    major: "Construction Management",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "10 A&H, 12-14 SSc, 24 NSc",
    englishComposition: "5 credits",
    writing: "7 credits",
    foreignLanguage: "None",
    reasoning: "MATH 112, 124, or Q SCI 291",
    comments: "A&H includes COM 220; SSc recommends ECON 200 and CM 250. Cannot use CM 412 for Writing credit.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "built-environments-landscape-architecture",
    school: "College of Built Environments",
    major: "Landscape Architecture",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "20 A&H, 20 SSc, 20 NSc",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "4 or 5 credits from the RSN list",
    comments: "No L ARCH except 300 may count toward AoI; drawing class recommended.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "built-environments-real-estate",
    school: "College of Built Environments",
    major: "Real Estate",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "20 A&H, 20 SSc, 20 NSc",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "5 credits from the RSN list; MATH 112, MATH 124, QMETH 201 or Q SCI 291 recommended",
    comments: "Areas of Inquiry must include an approved Diversity course.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "education-early-childhood-family-studies",
    school: "College of Education",
    major: "Early Childhood and Family Studies",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "15 A&H, 15 SSc, 15 NSc, 15 additional",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "5 credits from the RSN list",
    comments: "No more than 15 credits ECFS courses can count toward Areas of Inquiry.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "education-communities-organizations",
    school: "College of Education",
    major: "Education, Communities and Organizations",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "15 A&H, 15 SSc, 15 NSc, 15 additional",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "4 or 5 credits from the RSN list",
    comments: "No more than 15 credits EDUC courses can count toward Areas of Inquiry.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "education-early-care-online",
    school: "College of Education",
    major: "Early Care and Education (Online Option)",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "10 A&H, 30 SSc, 10 NSc, 10 additional A&H or NSc",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "5 credits from the RSN list",
    comments: "No more than 15 credits ECFS-prefix courses can count toward Areas of Inquiry.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "education-studies",
    school: "College of Education",
    major: "Education Studies",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "15 A&H, 15 SSc, 15 NSc, 15 additional",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "4 or 5 credits from the RSN list",
    comments: "No more than 15 credits EDUC courses can count toward Areas of Inquiry.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "engineering-all-majors",
    school: "College of Engineering",
    major: "All majors",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "10 A&H, 10 SSc, 4-10 additional A&H or SSc, 40+ NSc",
    englishComposition: "5 credits",
    writing: "7 credits, see departments",
    foreignLanguage: "None",
    reasoning: "MATH 124+",
    comments: null,
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "environment-all-majors",
    school: "College of the Environment",
    major: "All majors",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "10 A&H, 20 SSc, 20 NSc, 10 additional",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "10 credits",
    comments: "10 credits of SSc and 10 credits of NSc must be outside the major.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "evans-public-policy-all-majors",
    school: "Daniel J. Evans School of Public Policy & Governance",
    major: "All majors",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "10 A&H, 20 SSc, 20 NSc, 10 additional",
    englishComposition: "5 credits; minimum 2.0 grade",
    writing: "10 credits",
    foreignLanguage: "0-15 credits, depending on placement or high school background",
    reasoning: "4 or 5 credits",
    comments: "Minimum 20 credits of Areas of Inquiry requirements must be outside of major requirements.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "information-school-all-majors",
    school: "Information School",
    major: "All majors",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "20 A&H, 20 SSc, 20 NSc",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "5 credits",
    comments: "SSc includes INFO 200; no more than 15 credits of INFO courses can count toward Areas of Inquiry.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "foster-business-all-majors",
    school: "Michael G. Foster School of Business",
    major: "All majors",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "20 A&H, 20 SSc, 20 NSc",
    englishComposition: "5 credits",
    writing: "2 courses, see department",
    foreignLanguage: "None",
    reasoning: "MATH 112, 124, or Q SCI 291",
    comments: "SSc includes ECON; NSc includes calculus and statistics.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "medicine-medical-laboratory-science",
    school: "School of Medicine",
    major: "Medical Laboratory Science",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "10 A&H, 10 SSc, 40+ NSc",
    englishComposition: "5 credits",
    writing: "7 credits",
    foreignLanguage: "None",
    reasoning: "1 from a list of STAT classes",
    comments: null,
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "nursing-all-majors",
    school: "School of Nursing",
    major: "All majors",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "15 A&H, 15 SSc, 26+ NSc",
    englishComposition: "5 credits",
    writing: "5 credits plus additional in the major",
    foreignLanguage: "None",
    reasoning: "STAT plus 1 course from department list",
    comments: "SSc includes NURS 201.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "public-health-all-majors",
    school: "School of Public Health",
    major: "All majors",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "10 A&H, 10 SSc, 20 NSc, 25 additional",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "None",
    reasoning: "4 or 5 credits from the RSN list",
    comments: "SPH students are encouraged to use first-year language courses for the A&H by completing the third quarter course.",
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  },
  {
    id: "social-work-all-majors",
    school: "School of Social Work",
    major: "All majors",
    minimumDegreeCredits: UW_MINIMUM_BACCALAUREATE_CREDITS,
    areasOfInquiry: "20 A&H, 20 SSc, 20 NSc, 15 additional",
    englishComposition: "5 credits",
    writing: "10 credits",
    foreignLanguage: "Through third quarter of first-year sequence",
    reasoning: "4 or 5 credits from the RSN list",
    comments: null,
    sourceUrl: UW_REQUIREMENTS_BY_COLLEGE_URL,
    lastChecked: "2026-06-26"
  }
];

export function getUwRequirementTrack(trackId: string | null | undefined) {
  return (
    UW_REQUIREMENT_TRACKS.find((track) => track.id === trackId) ??
    UW_REQUIREMENT_TRACKS[0]
  );
}
