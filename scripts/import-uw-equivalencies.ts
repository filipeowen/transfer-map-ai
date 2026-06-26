#!/usr/bin/env tsx

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { UW_GUIDE_URL } from "../lib/uwMockData";
import type { UwEquivalency } from "../lib/uwTypes";

type ParsedCollege = {
  name: string;
  slug: string;
  uwGuideSlug: string;
  uwGuidePath: string;
};

async function main() {
  const source = process.argv[2] ?? "all";
  const shouldWrite = process.argv.includes("--write") || source === "all";

  console.error("Experimental importer: fetching UW public guide pages.");
  console.error("This script is not required at runtime once JSON is generated.");
  console.error("Review parsed output manually before using it for advising.");

  const colleges = await fetchWashingtonCollegeIndex();
  const selectedColleges =
    source === "all"
      ? colleges
      : colleges.filter(
          (college) =>
            college.slug === source ||
            college.uwGuideSlug.toLowerCase() === source.toLowerCase() ||
            college.uwGuidePath.toLowerCase().includes(source.toLowerCase())
        );

  if (selectedColleges.length === 0) {
    throw new Error(`No UW guide college matched "${source}".`);
  }

  const rows: UwEquivalency[] = [];
  const pageCache = new Map<string, string>();

  for (const college of selectedColleges) {
    const url = absoluteGuideUrl(college.uwGuidePath);
    const html = await fetchCachedPage(pageCache, url);
    const parsedRows = parseUwGuideHtml({
      html,
      sourceCollege: college.name,
      sourceCollegeSlug: college.slug,
      sourceUrl: normalizedGuideUrl(college.uwGuideSlug)
    });
    rows.push(...parsedRows);
    console.error(`${college.name}: ${parsedRows.length} rows`);
  }

  if (shouldWrite) {
    await writeFile(
      join(process.cwd(), "lib", "uwGeneratedColleges.json"),
      `${JSON.stringify(colleges.map(stripCollegePath), null, 2)}\n`
    );
    await writeFile(
      join(process.cwd(), "lib", "uwGeneratedEquivalencies.json"),
      `${JSON.stringify(rows, null, 2)}\n`
    );
    console.error(`Wrote ${colleges.length} colleges and ${rows.length} rows.`);
    return;
  }

  console.log(JSON.stringify(rows, null, 2));
}

async function fetchWashingtonCollegeIndex(): Promise<ParsedCollege[]> {
  const response = await fetch(UW_GUIDE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch UW guide index: ${response.status}`);
  }

  const html = await response.text();
  const matches = [
    ...html.matchAll(
      /<a href="(\/apply\/transfer\/equivalency-guide\/([^"]+)\/)">([^<]+)<\/a>/g
    )
  ];

  return matches.map((match) => ({
    name: cleanText(match[3]),
    slug: slugifyCollegeName(cleanText(match[3])),
    uwGuideSlug: slugifyGuidePath(match[2]),
    uwGuidePath: match[1]
  }));
}

async function fetchCachedPage(
  cache: Map<string, string>,
  url: string
): Promise<string> {
  const cached = cache.get(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  cache.set(url, html);
  return html;
}

function parseUwGuideHtml({
  html,
  sourceCollege,
  sourceCollegeSlug,
  sourceUrl
}: {
  html: string;
  sourceCollege: string;
  sourceCollegeSlug: string;
  sourceUrl: string;
}): UwEquivalency[] {
  const tables = [
    ...html.matchAll(
      /<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<table class="table table-striped">([\s\S]*?)<\/table>/gi
    )
  ];
  const today = new Date().toISOString().slice(0, 10);
  const rows: UwEquivalency[] = [];

  tables.forEach((tableMatch) => {
    const department = cleanText(tableMatch[1]).replace(/^§\s*/, "");
    const tableRows = [
      ...tableMatch[2].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)
    ];

    tableRows.forEach((rowMatch, rowIndex) => {
      const row = rowMatch[1];
      const sourceCourseCode = getClassCell(row, "cccourse");
      const uwEquivalent = getClassCell(row, "uwequiv");

      if (!sourceCourseCode || !uwEquivalent) {
        return;
      }

      rows.push({
        id: `${sourceCollegeSlug}-${slugifyCourseId(sourceCourseCode)}-${rowIndex}`,
        sourceCollege,
        sourceCollegeSlug,
        sourceCourseCode,
        sourceCredits: extractCredits(sourceCourseCode),
        uwEquivalent,
        uwCredits: extractCredits(uwEquivalent),
        uwRequirement: getClassCell(row, "uwreqs") || null,
        effectiveDate: getClassCell(row, "effdate") || null,
        department,
        notes: buildNotes(sourceCourseCode),
        sourceUrl,
        lastChecked: today
      });
    });
  });

  return rows;
}

function getClassCell(row: string, className: string): string {
  const match = row.match(
    new RegExp(
      `<td[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/td>`,
      "i"
    )
  );

  return cleanText(match?.[1] ?? "");
}

function cleanText(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, "\"")
    .replace(/&ldquo;/g, "\"")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16))
    )
    .replace(/\s+/g, " ")
    .trim();
}

function extractCredits(value: string): string | null {
  const match = value.match(/\(([\d.,\s]+)\)/);
  return match?.[1]?.trim() ?? null;
}

function buildNotes(sourceCourseCode: string): string | null {
  if (sourceCourseCode.includes("§")) {
    return "UW marks this row with §, meaning the course or program may no longer be offered by the source college.";
  }

  if (/formerly|same as|if .*taken/i.test(sourceCourseCode)) {
    return "UW's row includes a condition or historical note. Confirm how it applies to your transcript.";
  }

  return null;
}

function absoluteGuideUrl(path: string): string {
  return new URL(path, UW_GUIDE_URL).toString();
}

function normalizedGuideUrl(guideSlug: string): string {
  return `${UW_GUIDE_URL}${guideSlug}/`;
}

function slugifyGuidePath(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function slugifyCollegeName(value: string): string {
  return slugifyGuidePath(value);
}

function slugifyCourseId(value: string): string {
  return slugifyGuidePath(value).slice(0, 80);
}

function stripCollegePath(college: ParsedCollege) {
  return {
    name: college.name,
    slug: college.slug,
    uwGuideSlug: college.uwGuideSlug
  };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
