const steps = [
  {
    n: "01",
    title: "Create your agent",
    body: "Name it, choose chat or voice, and pick a brand color and widget position.",
  },
  {
    n: "02",
    title: "Upload your knowledge",
    body: "Add your documents. ensight chunks and indexes them into a private knowledge base.",
  },
  {
    n: "03",
    title: "Embed the snippet",
    body: "Copy one line of code into your site and your agent goes live instantly.",
  },
  {
    n: "04",
    title: "Watch it learn",
    body: "Review conversations and analytics to see what visitors ask — and improve over time.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border/60 bg-bg"
    >
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Live in four steps
            </h2>
            <p className="mt-4 max-w-md text-muted">
              No ML expertise, no servers to manage. Go from sign-up to a
              working agent on your site in a single afternoon.
            </p>

            <ol className="mt-10 space-y-8">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-5">
                  <span className="font-mono text-sm font-semibold text-brand-accent">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl shadow-brand/20">
            <div className="flex items-center gap-1.5 px-3 py-2.5">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span className="h-3 w-3 rounded-full bg-green-400/70" />
              <span className="ml-2 font-mono text-xs text-slate-400">index.html</span>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-5 font-mono text-[13px] leading-relaxed text-slate-200">
              <code>
                <span className="text-muted">{"<!-- Add ensight to your site -->"}</span>
                {"\n"}
                <span className="text-slate-500">{"<script"}</span>
                {"\n  "}
                <span className="text-brand-accent">src</span>
                <span className="text-slate-400">=</span>
                <span className="text-emerald-300">{'"https://cdn.ensight.ai/widget.js"'}</span>
                {"\n  "}
                <span className="text-brand-accent">data-agent</span>
                <span className="text-slate-400">=</span>
                <span className="text-emerald-300">{'"pk_live_a8f3…"'}</span>
                {"\n"}
                <span className="text-slate-500">{"></script>"}</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
