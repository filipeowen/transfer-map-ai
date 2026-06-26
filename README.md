# Washington CC to UW Transfer Planner

Transfer Map AI is focused on one MVP:

**Washington community and technical college students exploring transfer to University of Washington Seattle.**

Students select a Washington community or technical college, enter course codes, optionally add an intended major and transfer term, then see UW equivalency-style results generated from UW's public transfer equivalency guide pages.

The results page also includes an estimated credit progress bar. It compares
readable credits from official-guide matches against UW's published minimum of
180 academic credits for a baccalaureate degree, with a selected UW
college/school requirement context from UW Undergraduate Advising.

## Disclaimer

Transfer Map AI is not an official University of Washington transfer credit evaluator. Results are estimates based on available public information and should be confirmed with UW or an academic advisor.

The app uses cautious language such as "UW's guide lists this as," "may transfer as," "possible match," and "needs advisor review." It should help students prepare better advising questions, not replace official transfer credit evaluation.

## Current Focus

- Source schools: 34 Washington community and technical colleges from UW's public guide index
- Target school: University of Washington Seattle
- Runtime data source: generated local JSON parsed from UW public guide pages
- Generated equivalency rows: 37,828 at the last import
- Paid AI APIs: none
- Supabase: optional future storage only, not required

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

Useful checks:

```bash
npm run typecheck
npm run build
```

## UW Data Files

Generated college metadata:

```text
lib/uwGeneratedColleges.json
```

Generated equivalency rows:

```text
lib/uwGeneratedEquivalencies.json
```

The importer is:

```text
scripts/import-uw-equivalencies.ts
```

Refresh the local data from UW's public guide:

```bash
npm run import:uw -- all --write
```

The importer fetches UW's guide index, discovers college guide URLs, parses each guide table, and writes local JSON in the `UwEquivalency[]` shape. It should still be treated as an experimental parser because UW can change page markup.

UW college/school requirement context lives in:

```text
lib/uwDegreeRequirements.ts
```

That file is seeded from UW Undergraduate Advising's public pages:

- `https://advising.uw.edu/degree-overview/your-uw-degree/`
- `https://advising.uw.edu/degree-overview/general-education/requirements-by-college-and-school/`

The credit progress bar is an estimate, not a degree audit. It counts official
guide matches with readable UW credit values. If a UW credit value is missing,
it falls back to the source-course credit value shown in the guide row.

## Matching Rules

Course matching lives in:

```text
lib/uwMatching.ts
```

The matcher:

- Normalizes capitalization
- Normalizes extra spaces
- Preserves ampersands
- Treats `ENGL& 101` and `ENGL 101` as different courses
- Matches primary course codes inside UW rows such as `ENGL& 101 (5) formerly ENGL 101`
- Handles common grouped rows such as `ACCT& 201, 202`
- Returns exact matches as `official_guide_match`
- Returns same-department rows as `possible_match`
- Marks unknown courses as `needs_advisor_review`
- Links every result row to the selected college's UW public guide page

## Type Shape

```ts
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
```

## Supabase

Supabase is intentionally optional. The app runs with local generated data and URL-based plans. If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are added later, storage can be introduced without changing the core matching logic.

## Future Roadmap

- Add major requirement matching
- Add plan export
- Add saved transfer plans
- Add transcript upload only after privacy review
- Add advisor dashboard
- Add official source update checks
- Add automated tests for UW parser edge cases
