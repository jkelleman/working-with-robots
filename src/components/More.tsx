import type { ReactNode } from 'react';

/**
 * Accordion for "interesting, not essential" content. Native <details>, so it
 * works with keyboard and screen readers and needs no script.
 */
export default function More({ label, hint, children, className = '', open }: {
  label: ReactNode;
  hint?: string;
  children: ReactNode;
  className?: string;
  open?: boolean;
}) {
  return (
    <details className={`more ${className}`} open={open}>
      <summary>
        <span className="more-label">{label}</span>
        {hint && <span className="more-hint">{hint}</span>}
        <span className="more-chev" aria-hidden="true" />
      </summary>
      <div className="more-body">{children}</div>
    </details>
  );
}
