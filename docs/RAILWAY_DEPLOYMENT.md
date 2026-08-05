# Déploiement sur Railway — Guide pas à pas

Railway est parfait pour ce projet : pas de serveur à gérer, MySQL en un clic, HTTPS automatique. Bon pour un projet public en croissance normale ; si le trafic devient très important plus tard, on pourra migrer vers un VPS (voir DEPLOYMENT.md).

## 1. Créer un compte Railway

Va sur https://railway.com et inscris-toi (le plus simple : "Se connecter avec GitHub").

## 2. Installer le CLI Railway (sur ta machine)

```
npm install -g @railway/cli
railway login
```
Ça ouvre ton navigateur pour confirmer la connexion.

## 3. Lier le projet

Depuis le dossier `backend/` de ton projet :
```
cd backend
railway init
```
Choisis "Create new project", donne-lui un nom (ex: `garoua-explorer-api`).

## 4. Ajouter une base MySQL

Va sur https://railway.com/dashboard, ouvre ton projet, clique **"+ New"** → **"Database"** → **"Add MySQL"**.
Railway provisionne la base automatiquement (aucune config manuelle).

## 5. Configurer les variables d'environnement

Dans le dashboard Railway, clique sur ton service **backend** → onglet **Variables** → ajoute :

| Variable | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `${{MySQL.MYSQL_URL}}` (référence directe au plugin MySQL, Railway remplit automatiquement) |
| `JWT_SECRET` | (génère avec `openssl rand -hex 32` dans un terminal) |
| `JWT_REFRESH_SECRET` | (génère une autre valeur avec la même commande) |
| `JWT_EXPIRES_IN` | `1d` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `*` pour l'instant (à restreindre à l'URL de ton frontend une fois qu'il existe) |

Pas besoin de définir `PORT` — Railway le fournit automatiquement et notre code le lit déjà via `process.env.PORT`.

## 6. Déployer

Toujours depuis `backend/` :
```
railway up
```
Railway détecte le `Dockerfile`, build l'image, et déploie. Ça prend 1-3 minutes.

## 7. Générer une URL publique

Dashboard → ton service backend → onglet **Settings** → section **Networking** → clique **"Generate Domain"**.

Tu obtiens une URL du type `garoua-explorer-api-production.up.railway.app`.

## 8. Vérifier que ça marche

```
https://<ton-url>.up.railway.app/api/v1/health
```
Doit répondre `{ "success": true, "data": { "status": "ok", "database": "connected" } }`.

Vérifie aussi Swagger :
```
https://<ton-url>.up.railway.app/api-docs
```

## 9. Mettre à jour Postman

Dans ta collection Postman, change la variable `baseUrl` de `http://localhost:4000/api/v1` vers `https://<ton-url>.up.railway.app/api/v1` pour tester en production.

## Pour les mises à jour futures

Après chaque changement de code, redéploie simplement avec :
```
railway up
```

## Créer ton premier compte Admin en production

La base est vide au départ. Utilise `POST /auth/register` comme d'habitude, puis passe le rôle en `ADMIN` directement en base via le dashboard Railway (onglet **Data** du plugin MySQL → table `users` → modifie la ligne).
