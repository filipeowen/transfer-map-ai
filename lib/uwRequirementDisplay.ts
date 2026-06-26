const REQUIREMENT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\[C\]|\bC\b/g, "English Composition"],
  [/\bA&H\b/g, "Arts and Humanities"],
  [/\bSSc\b/g, "Social Sciences"],
  [/\bNSc\b/g, "Natural Sciences"],
  [/\bRSN\b/g, "Reasoning"],
  [/\bQ\/SR\b/g, "Reasoning"],
  [/\bQSR\b/g, "Reasoning"],
  [/\bVLPA\b/g, "Visual, Literary, and Performing Arts"],
  [/\bI&S\b/g, "Individuals and Societies"],
  [/\bNW\b/g, "Natural World"],
  [/\bAoI\b/g, "Areas of Inquiry"],
  [/\bDIV\b/g, "Diversity"]
];

export function expandUwRequirementText(value: string | null | undefined): string {
  if (!value) {
    return "Confirm with University of Washington or an advisor";
  }

  return REQUIREMENT_REPLACEMENTS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value
  )
    .replace(/\s*\[\s*/g, "; ")
    .replace(/\s*\]\s*/g, "")
    .replace(/\s+or\s+/gi, " or ")
    .replace(/\s+/g, " ")
    .trim();
}
