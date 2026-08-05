# Images à ajouter

Dépose ici tes propres photos (ou des photos libres de droits d'Unsplash/Pexels) :

- `hero.jpg` — photo de couverture de la page d'accueil (format large, ~1600x900px minimum)
  Idée : une vue de Garoua, la Bénoué, un marché, ou l'architecture locale.

- `places/` — un sous-dossier pour les photos de lieux individuels (hôtels, sites...),
  utilisées plus tard via le champ `url` des photos de lieux (voir POST /places/:id/photos).

Formats recommandés : `.jpg` ou `.webp`, compressés (< 300 Ko par image) pour un chargement rapide.

Une fois `hero.jpg` ajouté ici, il apparaît automatiquement en fond du hero de la page
d'accueil — aucune modification de code nécessaire, le composant `Home.tsx` le référence déjà.
