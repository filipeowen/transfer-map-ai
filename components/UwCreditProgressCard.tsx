import { estimateUwCredits } from "@/lib/uwCreditProgress";
import { UW_DEGREE_OVERVIEW_URL } from "@/lib/uwDegreeRequirements";
import { expandUwRequirementText } from "@/lib/uwRequirementDisplay";
import { getRequirementProgressItems } from "@/lib/uwRequirementProgress";
import type { UwRequirementTrack, UwTransferResult } from "@/lib/uwTypes";

type UwCreditProgressCardProps = {
  requirementTrack: UwRequirementTrack;
  results: UwTransferResult[];
};

export function UwCreditProgressCard({
  requirementTrack,
  results
}: UwCreditProgressCardProps) {
  const estimate = estimateUwCredits(results);
  const requirementProgress = getRequirementProgressItems(requirementTrack, results);
  const percent = Math.min(
    100,
    Math.round((estimate.countedCredits / requirementTrack.minimumDegreeCredits) * 100)
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-violet-800">
                Estimated degree progress
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {estimate.countedCredits} of {requirementTrack.minimumDegreeCredits} University credits
              </h2>
            </div>
            <div className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-sm font-black text-violet-900">
              {percent}%
            </div>
          </div>

          <div
            aria-label="Estimated progress toward UW minimum baccalaureate credits"
            aria-valuemax={requirementTrack.minimumDegreeCredits}
            aria-valuemin={0}
            aria-valuenow={estimate.countedCredits}
            className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-700 via-sky-600 to-emerald-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            This counts official-guide matches with readable credit values. If a
            UW credit value is missing, the estimate uses the source-course
            credit value shown in the guide row.
          </p>

          <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
            <CreditFact label="Counted courses" value={String(estimate.countedCourses)} />
            <CreditFact label="Needs review" value={String(estimate.notCountedCourses)} />
            <CreditFact
              label="Missing credits"
              value={String(estimate.officialMatchesMissingCredits)}
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            UW says baccalaureate degrees generally require at least 180
            college quarter credits. This is not a degree audit, and credits may
            apply differently by major.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Requirement context
          </p>
          <h3 className="mt-2 text-lg font-black text-slate-950">
            {requirementTrack.school}
          </h3>
          <p className="mt-1 text-sm font-bold text-slate-700">
            {requirementTrack.major}
          </p>

          <dl className="mt-4 grid gap-3 text-sm leading-5">
            <RequirementLine
              label="Areas of Inquiry"
              value={expandUwRequirementText(requirementTrack.areasOfInquiry)}
            />
            <RequirementLine label="English Composition" value={requirementTrack.englishComposition} />
            <RequirementLine label="Writing" value={requirementTrack.writing} />
            <RequirementLine label="Foreign Language" value={requirementTrack.foreignLanguage} />
            <RequirementLine
              label="Reasoning"
              value={expandUwRequirementText(requirementTrack.reasoning)}
            />
          </dl>

          {requirementTrack.comments ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
              {expandUwRequirementText(requirementTrack.comments)}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
            <a
              className="text-violet-800 underline decoration-violet-200 underline-offset-4 hover:text-violet-950"
              href={requirementTrack.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Requirement page
            </a>
            <a
              className="text-violet-800 underline decoration-violet-200 underline-offset-4 hover:text-violet-950"
              href={UW_DEGREE_OVERVIEW_URL}
              target="_blank"
              rel="noreferrer"
            >
              Degree overview
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
              <p className="text-xs font-bold uppercase tracking-wide text-violet-800">
              Requirement progress bars
            </p>
            <h3 className="mt-2 text-xl font-black text-slate-950">
              Where your matched courses may count
            </h3>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            These bars count official-guide matches only. Some courses may count
            in more than one area, and final placement still needs University or
            advisor confirmation.
          </p>
        </div>

        <div className="mt-5 grid gap-x-8 gap-y-5 lg:grid-cols-2">
          {requirementProgress.map((item) => (
            <RequirementProgressBar item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CreditFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="text-lg font-black text-slate-950">{value}</div>
      <div className="mt-0.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );
}

function RequirementLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
      <dt className="font-bold text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

function RequirementProgressBar({
  item
}: {
  item: ReturnType<typeof getRequirementProgressItems>[number];
}) {
  const valueLabel =
    item.requiredCredits === null
      ? "Advisor review"
      : item.requiredCredits === 0
        ? "Not listed"
        : `${item.earnedCredits} / ${item.requiredCredits} credits`;
  const barClass =
    item.status === "complete"
      ? "bg-emerald-500"
      : item.status === "in_progress"
        ? "bg-violet-700"
        : item.status === "review"
          ? "bg-amber-400"
          : item.status === "not_required"
            ? "bg-slate-300"
            : "bg-slate-300";
  const displayedPercent =
    item.status === "review" && item.courseCodes.length > 0
      ? 35
      : item.status === "not_required"
        ? 100
        : item.percent;

  return (
    <div className="border-t border-slate-100 pt-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-black text-slate-950">{item.label}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
        </div>
        <div className="shrink-0 text-right text-sm font-black text-slate-800">
          {valueLabel}
        </div>
      </div>
      <div
        aria-label={`${item.label} progress`}
        aria-valuemax={item.requiredCredits ?? 100}
        aria-valuemin={0}
        aria-valuenow={
          item.requiredCredits === null ? displayedPercent : item.earnedCredits
        }
        className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
      >
        <div
          className={`h-full rounded-full transition-all ${barClass}`}
          style={{ width: `${displayedPercent}%` }}
        />
      </div>
      {item.courseCodes.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.courseCodes.map((courseCode) => (
            <span
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700"
              key={courseCode}
            >
              {courseCode}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
