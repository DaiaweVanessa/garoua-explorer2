# Garoua Explorer — Phase 0

Socle technique : structure Clean Architecture, connexion MySQL via Prisma, serveur Express de base.

## Démarrage rapide

```bash
# 1. Lancer MySQL seul (le backend, on le lance en local pour l'instant)
docker compose up -d mysql

# 2. Backend
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Vérifie que tout fonctionne : http://localhost:4000/api/v1/health
→ doit répondre `{ "success": true, "data": { "status": "ok", "database": "connected" } }`

## Structure

- `backend/src/domain` — entités métier (à remplir en Phase 1)
- `backend/src/application` — cas d'usage (à remplir en Phase 1)
- `backend/src/infrastructure/prisma` — connexion base de données
- `backend/src/presentation` — routes Express, middlewares
- `backend/prisma/schema.prisma` — schéma complet validé (12 tables)
- `frontend/` — squelette de dossiers, à initialiser en Phase 2 (Vite + React + Tailwind)

## Prochaine étape (Phase 1)

Authentification : inscription, connexion, JWT, bcrypt, middleware de rôles (Admin/Modérateur/Utilisateur).
