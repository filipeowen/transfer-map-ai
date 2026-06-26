import Link from "next/link";
import { AppLogo } from "@/components/AppLogo";
import { UwDisclaimerBanner } from "@/components/UwDisclaimerBanner";

const featureCards = [
  {
    title: "Check courses",
    body: "Enter Washington college course codes and see what UW's public guide lists."
  },
  {
    title: "Understand credit",
    body: "Separate guide matches, possible matches, and courses needing advisor review."
  },
  {
    title: "Plan with confidence",
    body: "Create focused advisor questions before you register for the next term."
  }
];

const confusionPoints = [
  {
    title: "Hard to find info",
    body: "UW's guide is public, but long, dense, and easy to misread."
  },
  {
    title: "Ampersand matters",
    body: "ENGL& 101 and ENGL 101 may have different UW equivalencies."
  },
  {
    title: "It is more than transfer",
    body: "You still need to know whether a course helps your intended major."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
        <AppLogo />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
          <a className="hover:text-violet-800" href="#how-it-works">
            How it works
          </a>
          <a className="hover:text-violet-800" href="#why">
            Why it helps
          </a>
          <a className="hover:text-violet-800" href="#confirm">
            Disclaimer
          </a>
        </nav>
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-violet-800 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-violet-900 focus:outline-none focus:ring-4 focus:ring-violet-100"
          href="/map/new"
        >
          Get started
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-24 lg:pt-16">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit rounded-full bg-violet-50 px-4 py-1.5 text-xs font-bold text-violet-800">
            Washington CC to UW Transfer Planner
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Plan your Washington CC transfer to{" "}
            <span className="text-violet-800">UW</span> before you waste credits.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Enter your community college courses and see how they may appear in
            UW&apos;s transfer equivalency guide, what requirements they may
            satisfy, and what to confirm with an advisor.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/map/new"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-violet-800 px-5 text-base font-bold text-white shadow-sm transition hover:bg-violet-900 focus:outline-none focus:ring-4 focus:ring-violet-100"
            >
              Build my UW transfer map
              <span className="ml-3" aria-hidden="true">
                →
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-base font-bold text-slate-800 transition hover:border-violet-300 hover:text-violet-800 focus:outline-none focus:ring-4 focus:ring-violet-100"
            >
              See how it works
            </a>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {featureCards.map((feature) => (
              <div
                className="rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm"
                key={feature.title}
              >
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-violet-50 text-sm font-black text-violet-800">
                  {feature.title.charAt(0)}
                </div>
                <h2 className="text-sm font-bold text-slate-950">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-10 h-52 w-52 rounded-full bg-violet-100/60 blur-3xl" />
          <div className="absolute -right-8 bottom-10 h-52 w-52 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="text-sm font-bold text-slate-950">
                  Tacoma Community College to UW Seattle
                </div>
                <div className="text-xs text-slate-500">Transfer map preview</div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                Transfer guide data
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <MetricPreview label="Courses" value="3" />
              <MetricPreview label="Guide matches" value="3" tone="green" />
              <MetricPreview label="Review" value="0" tone="amber" />
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
              {[
                ["ENGL& 101", "ENGL 131 (5)", "English Composition", "Official guide match"],
                ["MATH& 151", "MATH 124 (5)", "Natural Sciences / Reasoning", "Official guide match"],
                ["AVF 113", "Needs advisor review", "Confirm", "Possible match"]
              ].map(([course, equiv, req, status]) => (
                <div
                  className="grid gap-3 border-b border-slate-100 bg-white p-4 last:border-b-0 sm:grid-cols-[7rem_1fr_7rem]"
                  key={course}
                >
                  <div className="font-bold text-slate-950">{course}</div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{equiv}</div>
                    <div className="mt-1 text-xs text-slate-500">{req}</div>
                  </div>
                  <div className="text-xs font-bold text-violet-800">{status}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <UwDisclaimerBanner compact />
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8"
        id="why"
      >
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            Why transfer planning is confusing
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            The problem is not that information is hidden. It is that students
            have to connect course codes, requirements, dates, and major prep by
            themselves.
          </p>
        </div>
        <div className="grid gap-4">
          {confusionPoints.map((point) => (
            <div
              className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[2.5rem_1fr]"
              key={point.title}
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-sm font-black text-violet-800">
                {point.title.charAt(0)}
              </span>
              <div>
                <h3 className="font-bold text-slate-950">{point.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{point.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-5 pb-24 sm:px-6 lg:px-8"
        id="how-it-works"
      >
        <div className="rounded-lg bg-violet-900 p-6 text-white shadow-soft sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <div className="text-5xl font-black">W</div>
              <h2 className="mt-5 text-2xl font-black tracking-tight">
                Built for Washington students.
              </h2>
              <p className="mt-3 text-sm leading-6 text-violet-100">
                Focused on UW Seattle transfer planning, with careful language
                and advisor-ready next steps.
              </p>
              <Link
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-bold text-violet-900 transition hover:bg-violet-50"
                href="/map/new"
              >
                Get started for free
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Select your college",
                "Add course codes",
                "Confirm the plan"
              ].map((step, index) => (
                <div
                  className="rounded-lg border border-white/15 bg-white/10 p-4"
                  key={step}
                >
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-black text-violet-900">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 font-bold">{step}</h3>
                  <p className="mt-2 text-sm leading-6 text-violet-100">
                    {index === 0
                      ? "Choose from UW's Washington college guide list."
                      : index === 1
                        ? "Use exact codes like ENGL& 101 or MATH& 151."
                        : "Bring the output to UW or your advisor."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8" id="confirm">
        <UwDisclaimerBanner />
      </section>
    </main>
  );
}

function MetricPreview({
  label,
  tone,
  value
}: {
  label: string;
  tone?: "green" | "amber";
  value: string;
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-800"
      : tone === "amber"
        ? "bg-amber-50 text-amber-800"
        : "bg-slate-50 text-slate-900";

  return (
    <div className={`rounded-lg border border-slate-200 p-4 ${toneClass}`}>
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-wide">{label}</div>
    </div>
  );
}
