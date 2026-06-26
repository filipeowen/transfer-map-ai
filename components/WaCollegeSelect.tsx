"use client";

import { WASHINGTON_COMMUNITY_COLLEGES } from "@/lib/uwMockData";

type WaCollegeSelectProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
};

export function WaCollegeSelect({
  id = "sourceCollege",
  name = "sourceCollege",
  value,
  onChange
}: WaCollegeSelectProps) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-700" htmlFor={id}>
      Washington community or technical college
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
      >
        {WASHINGTON_COMMUNITY_COLLEGES.map((college) => (
          <option key={college.slug} value={college.slug}>
            {college.name}
          </option>
        ))}
      </select>
    </label>
  );
}
