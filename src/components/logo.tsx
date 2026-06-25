import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="9" fill="url(#ensight-g)" />
      <path
        d="M11 12.5h8M11 16h8M11 19.5h5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="22" cy="19.5" r="1.6" fill="#bae6fd" />
      <defs>
        <linearGradient
          id="ensight-g"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );
}
