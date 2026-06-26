import Link from "next/link";
import { AppLogo } from "@/components/AppLogo";
import { FlowStepper } from "@/components/FlowStepper";
import { UwCreditProgressCard } from "@/components/UwCreditProgressCard";
import { UwDisclaimerBanner } from "@/components/UwDisclaimerBanner";
import { UwEquivalencyResultsTable } from "@/components/UwEquivalencyResultsTable";
import { getUwRequirementTrack } from "@/lib/uwDegreeRequirements";
import {
  UW_GUIDE_URL,
  UW_TARGET_SCHOOL,
  getCollegeGuideUrl,
  getCollegeName
} from "@/lib/uwMockData";
import { countResultsByStatus, findManyUwEquivalencies } from "@/lib/uwMatching";

type ResultsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TransferMapResultsPage({
  params,
  searchParams
}: ResultsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const sourceCollegeSlug =
    readSearchParam(resolvedSearchParams.college) || "bellevue-college";
  const sourceCollege = getCollegeName(sourceCollegeSlug);
  const courseCodes = parseCourses(readSearchParam(resolvedSearchParams.courses));
  const intendedMajor = readSearchParam(resolvedSearchParams.major) || "";
  const transferTerm = readSearchParam(resolvedSearchParams.term) || "";
  const requirementTrack = getUwRequirementTrack(
    readSearchParam(resolvedSearchParams.requirement)
  );
  const results = findManyUwEquivalencies(sourceCollegeSlug, courseCodes);
  const counts = countResultsByStatus(results);
  const collegeGuideUrl = getCollegeGuideUrl(sourceCollegeSlug);

  return (
    <main className="min-h-screen px-5 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <AppLogo />
          <FlowStepper activeStep={3} />
          <div className="flex flex-col gap-2 sm:flex-row lg:self-start">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 transition hover:border-violet-300 hover:text-violet-800"
              href="/map/new"
            >
              New plan
            </Link>
            <a
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-violet-800 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-violet-900"
              href={collegeGuideUrl || UW_GUIDE_URL}
              target="_blank"
              rel="noreferrer"
            >
              Open UW guide
            </a>
          </div>
        </header>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
            <PlanEndpoint label="Source college" title={sourceCollege} detail="Your current school" />
            <ArrowDivider />
            <PlanEndpoint label="Target school" title={UW_TARGET_SCHOOL} detail="Locked for this planner" />
            <ArrowDivider />
            <PlanEndpoint
              label="Intended major"
              title={intendedMajor || "Not entered"}
              detail={transferTerm || "Transfer term not entered"}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Courses checked" value={String(results.length)} />
            <MetricCard
              label="Official guide matches"
              tone="green"
              value={String(counts.official_guide_match)}
            />
            <MetricCard
              label="Possible matches"
              tone="amber"
              value={String(counts.possible_match)}
            />
            <MetricCard
              label="Needs advisor review"
              tone="rose"
              value={String(counts.needs_advisor_review + counts.not_found)}
            />
          </div>
        </section>

        <div className="mt-6">
          <UwCreditProgressCard requirementTrack={requirementTrack} results={results} />
        </div>

        <div className="mt-6">
          <UwDisclaimerBanner />
        </div>

        <div className="mt-6">
          <section className="min-w-0">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">
                  UW equivalency-style results
                </h1>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Language stays cautious: may transfer, possible match, or
                  needs advisor review. Map ID: {resolvedParams.id}.
                </p>
              </div>
              <a
                className="text-sm font-bold text-violet-800 underline decoration-violet-200 underline-offset-4 hover:text-violet-950"
                href={collegeGuideUrl || UW_GUIDE_URL}
                target="_blank"
                rel="noreferrer"
              >
                Open this college in UW guide
              </a>
            </div>

            <UwEquivalencyResultsTable
              fallbackGuideUrl={collegeGuideUrl}
              intendedMajor={intendedMajor}
              requirementTrack={requirementTrack}
              results={results}
            />

            <section className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
              <h2 className="font-bold">Confirm before you rely on this map</h2>
              <p className="mt-1">
                UW&apos;s guide can change, and equivalencies depend on both the
                community college curriculum and UW curriculum. Confirm final
                transfer credit with UW or an academic advisor.
              </p>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

function PlanEndpoint({
  detail,
  label,
  title
}: {
  detail: string;
  label: string;
  title: string;
}) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-xl font-black text-slate-950">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{detail}</div>
    </div>
  );
}

function ArrowDivider() {
  return (
    <div className="hidden text-2xl font-light text-slate-300 lg:block" aria-hidden="true">
      →
    </div>
  );
}

function MetricCard({
  label,
  tone,
  value
}: {
  label: string;
  tone?: "green" | "amber" | "rose";
  value: string;
}) {
  const toneClass =
    tone === "green"
      ? "border-emerald-100 bg-emerald-50 text-emerald-800"
      : tone === "amber"
        ? "border-amber-100 bg-amber-50 text-amber-800"
        : tone === "rose"
          ? "border-rose-100 bg-rose-50 text-rose-800"
          : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-wide">{label}</div>
    </div>
  );
}

function readSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function parseCourses(value: string): string[] {
  return value
    .split("|")
    .map((course) => course.trim())
    .filter(Boolean);
}
