interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">Bientôt disponible</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-indigo">{title}</h1>
      <p className="mt-4 font-sans text-ink/60">Cette page arrive dans une prochaine phase de développement.</p>
    </div>
  );
}
