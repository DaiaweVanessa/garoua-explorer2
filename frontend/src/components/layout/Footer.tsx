export function Footer() {
  return (
    <footer className="border-t border-indigo/10 bg-indigo text-sable">
      <div className="mx-auto max-w-6xl px-6 py-10 text-center">
        <span className="font-display text-lg font-semibold">
          Garoua<span className="text-savane">.</span>Explorer
        </span>
        <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-sable/70">
          Votre compagnon pour découvrir Garoua : sites, hôtels, restaurants, excursions et transport.
        </p>
        <p className="mt-6 font-sans text-xs text-sable/50">
          © {new Date().getFullYear()} Garoua Explorer.
        </p>
      </div>
    </footer>
  );
}