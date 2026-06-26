import { UwStatusBadge } from "@/components/UwStatusBadge";
import { getCoursePlanningNote } from "@/lib/uwPlanningNotes";
import { expandUwRequirementText } from "@/lib/uwRequirementDisplay";
import type { UwRequirementTrack, UwTransferResult } from "@/lib/uwTypes";

type UwEquivalencyResultsTableProps = {
  results: UwTransferResult[];
  fallbackGuideUrl: string;
  intendedMajor: string;
  requirementTrack: UwRequirementTrack;
};

export function UwEquivalencyResultsTable({
  fallbackGuideUrl,
  intendedMajor,
  requirementTrack,
  results
}: UwEquivalencyResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
        No courses were submitted yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-[840px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Student course</th>
              <th className="px-4 py-3">University equivalency</th>
              <th className="px-4 py-3">Requirement</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Planning note</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((result) => {
              const equivalency = result.equivalency;
              const possiblePreview = result.possibleMatches
                .slice(0, 2)
                .map((match) => `${match.sourceCourseCode} may appear as ${match.uwEquivalent}`)
                .join("; ");
              const planningNote = getCoursePlanningNote({
                intendedMajor,
                requirementTrack,
                result,
                results
              });

              return (
                <tr key={`${result.normalizedCourseCode}-${result.status}`} className="align-top">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-950">
                      {result.normalizedCourseCode}
                    </div>
                    {result.studentCourseCode !== result.normalizedCourseCode ? (
                      <div className="mt-1 text-xs text-slate-500">
                        Entered as {result.studentCourseCode}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {equivalency?.uwEquivalent || possiblePreview || "Needs advisor review"}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {expandUwRequirementText(equivalency?.uwRequirement)}
                  </td>
                  <td className="px-4 py-4">
                    <UwStatusBadge status={result.status} />
                  </td>
                  <td className="max-w-sm px-4 py-4 text-slate-700">
                    <div className="grid gap-2 leading-6">
                      <p>
                        <span className="font-bold text-slate-950">Major:</span>{" "}
                        {planningNote.majorFit}
                      </p>
                      <p>
                        <span className="font-bold text-slate-950">Credit:</span>{" "}
                        {planningNote.creditFit}
                      </p>
                    </div>
                    {result.possibleMatches.length > 0 ? (
                      <div className="mt-2 text-xs text-slate-500">
                        Possible guide rows:{" "}
                        {result.possibleMatches
                          .map((match) => match.sourceCourseCode)
                          .join(", ")}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    {equivalency?.sourceUrl || result.possibleMatches[0]?.sourceUrl || fallbackGuideUrl ? (
                      <a
                        className="font-semibold text-sky-700 underline decoration-sky-200 underline-offset-4 hover:text-sky-900"
                        href={equivalency?.sourceUrl ?? result.possibleMatches[0]?.sourceUrl ?? fallbackGuideUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Transfer guide
                      </a>
                    ) : (
                      <span className="text-slate-500">Check guide</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
