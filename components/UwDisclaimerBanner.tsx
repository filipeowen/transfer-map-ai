const DISCLAIMER =
  "Transfer Map AI is not an official University of Washington transfer credit evaluator. Results are estimates based on available public information and should be confirmed with UW or an academic advisor.";

type UwDisclaimerBannerProps = {
  compact?: boolean;
};

export function UwDisclaimerBanner({ compact = false }: UwDisclaimerBannerProps) {
  return (
    <div
      className={`rounded-lg border border-amber-200 bg-amber-50 text-amber-950 ${
        compact ? "px-4 py-3 text-sm" : "px-5 py-4 text-sm leading-6"
      }`}
    >
      <strong className="font-semibold">Important:</strong> {DISCLAIMER}
    </div>
  );
}

export { DISCLAIMER as UW_DISCLAIMER };
