import type { ReactNode } from 'react';

/** Header band for the secondary pages, so each page is clearly its own place. */
export default function PageHeader({
  eyebrow,
  title,
  sub,
  accent,
  art,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  accent: 'blue' | 'green';
  art: ReactNode;
}) {
  return (
    <header className={`page-header page-header-${accent}`}>
      <div className="page-header-inner">
        <div>
          <p className="page-header-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-header-sub">{sub}</p>
        </div>
        <div className="page-header-art" aria-hidden="true">{art}</div>
      </div>
    </header>
  );
}

/** Small original icon: the same meaning carried by screen, light, sound, and vibration. */
export function PatternsArt() {
  return (
    <svg viewBox="0 0 220 90">
      <rect x="4" y="18" width="62" height="42" rx="6" fill="#12263f" />
      <rect x="11" y="25" width="48" height="7" rx="2" fill="#1f9d55" />
      <rect x="11" y="38" width="34" height="5" rx="2" fill="#fff" opacity=".8" />
      <rect x="11" y="47" width="24" height="5" rx="2" fill="#fff" opacity=".5" />
      <g transform="translate(84 10)">
        <rect width="16" height="11" rx="2" fill="#d42e2e" opacity=".25" />
        <rect y="13" width="16" height="11" rx="2" fill="#e8a317" opacity=".25" />
        <rect y="26" width="16" height="11" rx="2" fill="#1f9d55" />
        <rect y="39" width="16" height="11" rx="2" fill="#2f6fe0" opacity=".25" />
        <rect x="6" y="50" width="4" height="22" fill="#8a96a3" />
      </g>
      <g transform="translate(124 26)" fill="none" stroke="#2f6fe0" strokeWidth="4" strokeLinecap="round">
        <path d="M6 10 v18" /><path d="M16 4 v30" /><path d="M26 12 v14" /><path d="M36 6 v26" />
      </g>
      <g transform="translate(176 22)">
        <rect x="6" y="0" width="22" height="40" rx="5" fill="#5b636b" />
        <path d="M0 10 l-4 4 l4 4 M34 10 l4 4 l-4 4" fill="none" stroke="#e8a317" strokeWidth="3" strokeLinecap="round" />
      </g>
      <path d="M8 78 H212" stroke="#c3ccd5" strokeWidth="2" strokeDasharray="3 5" />
    </svg>
  );
}

/** Small original icon: a before/after trend with the launch marker. */
export function MetricsArt() {
  return (
    <svg viewBox="0 0 220 90">
      <path d="M10 80 H212" stroke="#c3ccd5" strokeWidth="2" />
      <path d="M110 10 V80" stroke="#8a96a3" strokeWidth="2" strokeDasharray="4 4" />
      <polyline points="12,58 32,52 50,60 70,54 92,58 110,55" fill="none" stroke="#9aa3ab" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="110,55 130,40 150,44 172,30 192,34 210,22" fill="none" stroke="#1f9d55" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="210" cy="22" r="6" fill="#1f9d55" />
      <rect x="116" y="8" width="44" height="16" rx="8" fill="#1f9d55" opacity=".15" />
      <text x="138" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1f9d55">New</text>
    </svg>
  );
}
