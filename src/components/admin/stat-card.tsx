export function StatCard({
  label,
  value,
  accent,
  delay = 0,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  delay?: number;
}) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-fade-up rounded-2xl border p-5 shadow-sm ${
        accent ? "border-brand/40 bg-brand/5" : "border-border bg-surface"
      }`}
    >
      <p className="text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="h-24 animate-pulse rounded-2xl border border-border bg-surface" />
  );
}
