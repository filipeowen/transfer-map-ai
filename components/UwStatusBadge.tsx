import type { UwMatchStatus } from "@/lib/uwTypes";

const STATUS_COPY: Record<UwMatchStatus, string> = {
  official_guide_match: "Official guide match",
  possible_match: "Possible match",
  not_found: "Not found",
  needs_advisor_review: "Needs advisor review"
};

const STATUS_CLASSES: Record<UwMatchStatus, string> = {
  official_guide_match: "border-emerald-200 bg-emerald-50 text-emerald-800",
  possible_match: "border-sky-200 bg-sky-50 text-sky-800",
  not_found: "border-rose-200 bg-rose-50 text-rose-800",
  needs_advisor_review: "border-amber-200 bg-amber-50 text-amber-800"
};

type UwStatusBadgeProps = {
  status: UwMatchStatus;
};

export function UwStatusBadge({ status }: UwStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[status]}`}
    >
      {STATUS_COPY[status]}
    </span>
  );
}

export function getUwStatusLabel(status: UwMatchStatus): string {
  return STATUS_COPY[status];
}
