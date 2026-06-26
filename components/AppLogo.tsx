import Link from "next/link";

type AppLogoProps = {
  href?: string;
};

export function AppLogo({ href = "/" }: AppLogoProps) {
  return (
    <Link className="inline-flex items-center gap-3" href={href}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-800 text-sm font-black text-white shadow-sm">
        TM
      </span>
      <span className="text-sm font-bold tracking-tight text-slate-950">
        Transfer Map AI
      </span>
    </Link>
  );
}
