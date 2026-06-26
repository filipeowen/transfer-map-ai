type FlowStepperProps = {
  activeStep: 1 | 2 | 3;
};

const STEPS = [
  { number: 1, label: "Your courses" },
  { number: 2, label: "Review" },
  { number: 3, label: "Results" }
] as const;

export function FlowStepper({ activeStep }: FlowStepperProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-2">
      {STEPS.map((step, index) => {
        const active = step.number === activeStep;
        const complete = step.number < activeStep;

        return (
          <div className="flex flex-1 items-center" key={step.number}>
            <div className="grid justify-items-center gap-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-bold ${
                  active
                    ? "border-violet-800 bg-violet-800 text-white"
                    : complete
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-300 bg-white text-slate-500"
                }`}
              >
                {step.number}
              </span>
              <span
                className={`text-xs font-semibold ${
                  active ? "text-slate-950" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <div
                className={`mx-3 h-px flex-1 ${
                  complete ? "bg-emerald-200" : "bg-slate-200"
                }`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
