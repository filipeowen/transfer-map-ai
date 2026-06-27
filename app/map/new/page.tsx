"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { AppLogo } from "@/components/AppLogo";
import { FlowStepper } from "@/components/FlowStepper";
import { UwDisclaimerBanner } from "@/components/UwDisclaimerBanner";
import { WaCollegeSelect } from "@/components/WaCollegeSelect";
import { UW_REQUIREMENT_TRACKS } from "@/lib/uwDegreeRequirements";
import { UW_TARGET_SCHOOL } from "@/lib/uwMockData";
import { normalizeCourseCode } from "@/lib/uwMatching";
import { extractCourseCodesFromTranscriptText } from "@/lib/transcriptCourseExtraction";

const EXAMPLE_COURSES = ["ENGL& 101", "MATH& 151", "CHEM& 161", "BIOL& 160", "PSYC& 100"];

export default function NewTransferMapPage() {
  const router = useRouter();
  const [sourceCollegeSlug, setSourceCollegeSlug] = useState("bellevue-college");
  const [courseInputs, setCourseInputs] = useState<string[]>([
    "ENGL& 101",
    "MATH& 151"
  ]);
  const [courseDraft, setCourseDraft] = useState("");
  const [intendedMajor, setIntendedMajor] = useState("");
  const [transferTerm, setTransferTerm] = useState("");
  const [requirementTrackId, setRequirementTrackId] = useState(
    "arts-sciences-all-majors"
  );
  const [transcriptText, setTranscriptText] = useState("");
  const [transcriptStatus, setTranscriptStatus] = useState(
    "Upload a transcript file or paste transcript text to extract possible courses."
  );
  const [lastExtractedCourses, setLastExtractedCourses] = useState<string[]>([]);

  const normalizedPreview = useMemo(
    () => courseInputs.map(normalizeCourseCode).filter(Boolean),
    [courseInputs]
  );

  function addCourse(value = courseDraft) {
    const normalized = normalizeCourseCode(value);

    if (!normalized) {
      return;
    }

    setCourseInputs((current) =>
      current.includes(normalized) ? current : [...current, normalized]
    );
    setCourseDraft("");
  }

  function addCourses(courses: string[]) {
    const normalizedCourses = courses.map(normalizeCourseCode).filter(Boolean);

    if (normalizedCourses.length === 0) {
      return 0;
    }

    const existingCourses = new Set(courseInputs);
    const newCourses = normalizedCourses.filter(
      (course) => !existingCourses.has(course)
    );

    setCourseInputs((current) => {
      const next = new Set(current);

      normalizedCourses.forEach((course) => {
        next.add(course);
      });

      return [...next];
    });

    return newCourses.length;
  }

  function extractTranscriptCourses(text: string, sourceLabel = "transcript text") {
    const extraction = extractCourseCodesFromTranscriptText(text);
    const addedCount = addCourses(extraction.courses);

    setLastExtractedCourses(extraction.courses);

    if (extraction.courses.length === 0) {
      setTranscriptStatus(
        `No course codes were found in the ${sourceLabel}. Try pasting transcript text from the PDF.`
      );
      return;
    }

    setTranscriptStatus(
      `Found ${extraction.courses.length} possible course ${
        extraction.courses.length === 1 ? "code" : "codes"
      } from ${sourceLabel}. Added ${addedCount} new ${
        addedCount === 1 ? "course" : "courses"
      }. Review the chips before continuing.`
    );
  }

  async function handleTranscriptFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setTranscriptStatus("That file is too large for this beta. Try a smaller unofficial transcript or paste text below.");
      return;
    }

    setTranscriptStatus(`Reading ${file.name} locally in your browser...`);

    try {
      const text = await file.text();

      extractTranscriptCourses(
        text,
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
          ? `${file.name} with best-effort PDF text extraction`
          : file.name
      );
    } catch {
      setTranscriptStatus("Could not read that file. Try copying and pasting the transcript text instead.");
    } finally {
      event.target.value = "";
    }
  }

  function removeCourse(course: string) {
    setCourseInputs((current) => current.filter((item) => item !== course));
  }

  function handleCourseKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCourse();
    }
  }

  function buildMap(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCourses = courseInputs.map(normalizeCourseCode).filter(Boolean);

    const params = new URLSearchParams({
      college: sourceCollegeSlug,
      courses: normalizedCourses.join("|")
    });

    if (intendedMajor.trim()) {
      params.set("major", intendedMajor.trim());
    }

    if (transferTerm.trim()) {
      params.set("term", transferTerm.trim());
    }

    params.set("requirement", requirementTrackId);

    router.push(`/map/local?${params.toString()}`);
  }

  return (
    <main className="min-h-screen px-5 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <AppLogo />
          <FlowStepper activeStep={1} />
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 transition hover:border-violet-300 hover:text-violet-800 lg:self-start"
            href="/"
          >
            Back home
          </Link>
        </header>

        <section className="mx-auto mt-8 max-w-3xl text-center">
          <div className="inline-flex rounded-full bg-violet-50 px-4 py-1.5 text-xs font-bold text-violet-800">
            Step 1 of 3
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Tell us what you have taken.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Choose your Washington college, add your courses exactly as they
            appear, and we will compare them with local UW guide data.
          </p>
        </section>

        <form
          onSubmit={buildMap}
          className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
        >
          <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <WaCollegeSelect value={sourceCollegeSlug} onChange={setSourceCollegeSlug} />

              <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-700" htmlFor="intendedMajor">
                Intended major
                <input
                  id="intendedMajor"
                  value={intendedMajor}
                  onChange={(event) => setIntendedMajor(event.target.value)}
                  placeholder="e.g. Computer Science"
                  className="min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-violet-700 focus:ring-4 focus:ring-violet-100"
                />
                <span className="text-xs font-normal text-slate-500">
                  Optional, helps interpret major preparation.
                </span>
              </label>

              <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-700" htmlFor="targetSchool">
                Target school
                <input
                  id="targetSchool"
                  value={UW_TARGET_SCHOOL}
                  readOnly
                  className="min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-slate-50 px-3 text-base text-slate-700"
                />
                <span className="text-xs font-normal text-slate-500">
                  Locked for this focused MVP.
                </span>
              </label>

              <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-700" htmlFor="transferTerm">
                Transfer term
                <input
                  id="transferTerm"
                  value={transferTerm}
                  onChange={(event) => setTransferTerm(event.target.value)}
                  placeholder="e.g. Fall 2027"
                  className="min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-violet-700 focus:ring-4 focus:ring-violet-100"
                />
                <span className="text-xs font-normal text-slate-500">
                  Optional, helps frame your plan.
                </span>
              </label>

              <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-700 lg:col-span-2" htmlFor="requirementTrack">
                UW college or school for credit progress
                <select
                  id="requirementTrack"
                  value={requirementTrackId}
                  onChange={(event) => setRequirementTrackId(event.target.value)}
                  className="min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-violet-700 focus:ring-4 focus:ring-violet-100"
                >
                  {UW_REQUIREMENT_TRACKS.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.school} - {track.major}
                    </option>
                  ))}
                </select>
                <span className="text-xs font-normal text-slate-500">
                  Used for the results-page credit bar. If you are unsure, College of Arts and Sciences is a reasonable planning default.
                </span>
              </label>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-violet-800">
                      Transcript upload beta
                    </p>
                    <h2 className="mt-2 text-xl font-black text-slate-950">
                      Upload or paste an unofficial transcript
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      The app looks for possible course codes and adds them as editable chips.
                      Nothing is saved, and you should remove sensitive information if possible.
                    </p>
                  </div>
                  <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-violet-200 bg-white px-4 text-sm font-bold text-violet-800 transition hover:border-violet-300 hover:bg-violet-50">
                    Upload file
                    <input
                      accept=".pdf,.txt,.csv,.text,application/pdf,text/plain,text/csv"
                      className="sr-only"
                      onChange={handleTranscriptFileChange}
                      type="file"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-3">
                  <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="transcriptText">
                    Paste transcript text
                    <textarea
                      id="transcriptText"
                      value={transcriptText}
                      onChange={(event) => setTranscriptText(event.target.value)}
                      placeholder="Paste unofficial transcript text here, then extract courses."
                      className="min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-base outline-none transition focus:border-violet-700 focus:ring-4 focus:ring-violet-100"
                    />
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-6 text-slate-600">{transcriptStatus}</p>
                    <button
                      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-300"
                      disabled={!transcriptText.trim()}
                      onClick={() => extractTranscriptCourses(transcriptText)}
                      type="button"
                    >
                      Extract courses
                    </button>
                  </div>
                </div>

                {lastExtractedCourses.length > 0 ? (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Last extracted
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {lastExtractedCourses.map((course) => (
                        <span
                          className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-800"
                          key={course}
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">Enter your courses</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Add one code at a time. Use the ampersand if the course has
                      one.
                    </p>
                  </div>
                  <div className="text-sm font-bold text-slate-500">
                    {courseInputs.length} added
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <label className="sr-only" htmlFor="courseDraft">
                    Course code
                  </label>
                  <input
                    id="courseDraft"
                    value={courseDraft}
                    onChange={(event) => setCourseDraft(event.target.value)}
                    onKeyDown={handleCourseKeyDown}
                    placeholder="e.g. ENGL& 101"
                    className="min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-violet-700 focus:ring-4 focus:ring-violet-100"
                  />
                  <button
                    type="button"
                    onClick={() => addCourse()}
                    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-violet-800 px-5 text-sm font-bold text-white transition hover:bg-violet-900 focus:outline-none focus:ring-4 focus:ring-violet-100"
                  >
                    Add course
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {courseInputs.map((course) => (
                    <button
                      className="inline-flex min-h-9 items-center gap-2 rounded-full bg-slate-100 px-3 text-sm font-bold text-slate-800 transition hover:bg-rose-50 hover:text-rose-700"
                      key={course}
                      onClick={() => removeCourse(course)}
                      type="button"
                    >
                      {course}
                      <span aria-hidden="true">×</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {EXAMPLE_COURSES.map((course) => (
                    <button
                      key={course}
                      type="button"
                      onClick={() => addCourse(course)}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-violet-300 hover:text-violet-800"
                    >
                      {course}
                    </button>
                  ))}
                </div>

                <div className="mt-5 rounded-lg border border-violet-100 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
                  <strong>Washington Common Course Numbering uses an ampersand.</strong>{" "}
                  Be careful, ENGL&amp; 101 and ENGL 101 may have different UW
                  equivalencies.
                </div>

                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Normalized preview
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {normalizedPreview.length > 0 ? (
                      normalizedPreview.map((course) => (
                        <span
                          key={course}
                          className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-800"
                        >
                          {course}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Add a course to preview.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="grid min-w-0 content-start gap-4">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <h2 className="text-sm font-black text-slate-950">What this tool does</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
                {[
                  "Uses UW's public equivalency guide data",
                  "Can extract possible course codes from transcript text",
                  "Shows how your courses may transfer",
                  "Shows UW requirements they may satisfy"
                ].map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <UwDisclaimerBanner compact />

            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-violet-800 px-5 text-base font-bold text-white shadow-sm transition hover:bg-violet-900 focus:outline-none focus:ring-4 focus:ring-violet-100"
            >
              Review my courses
              <span className="ml-3" aria-hidden="true">
                →
              </span>
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}
