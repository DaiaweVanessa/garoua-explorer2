import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-indigo/10 bg-indigo text-sable">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <span className="font-display text-xl font-semibold">
              Garoua<span className="text-savane">.</span>Explorer
            </span>
            <p className="mt-3 max-w-xs font-sans text-sm text-sable/70">
              Votre compagnon pour découvrir Garoua : sites, hôtels, restaurants, excursions et transport.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-sm font-bold uppercase tracking-wide text-savane">Explorer</h4>
            <ul className="mt-4 space-y-2 font-sans text-sm text-sable/80">
              <li><Link to="/lieux?category=sites-touristiques" className="hover:text-savane">Sites touristiques</Link></li>
              <li><Link to="/lieux?category=hotels" className="hover:text-savane">Hôtels</Link></li>
              <li><Link to="/lieux?category=restaurants" className="hover:text-savane">Restaurants</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm font-bold uppercase tracking-wide text-savane">Autour de Garoua</h4>
            <ul className="mt-4 space-y-2 font-sans text-sm text-sable/80">
              <li><Link to="/garoua" className="hover:text-savane">Histoire &amp; culture</Link></li>
              <li><Link to="/transport" className="hover:text-savane">Transport</Link></li>
              <li><Link to="/evenements" className="hover:text-savane">Événements</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm font-bold uppercase tracking-wide text-savane">Compte</h4>
            <ul className="mt-4 space-y-2 font-sans text-sm text-sable/80">
              <li><Link to="/connexion" className="hover:text-savane">Se connecter</Link></li>
              <li><Link to="/inscription" className="hover:text-savane">Créer un compte</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-sable/10 pt-6 font-sans text-xs text-sable/50">
          © {new Date().getFullYear()} Garoua Explorer. Projet étudiant — CS4122.
        </div>
      </div>
    </footer>
  );
}
