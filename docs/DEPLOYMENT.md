# Guide de déploiement — Garoua Explorer

Déploiement sur un serveur Ubuntu (VPS type DigitalOcean, OVH, Contabo...) avec Docker et Nginx en reverse proxy + HTTPS.

## 1. Prérequis serveur

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx git
sudo systemctl enable docker
```

## 2. Récupérer le projet

```bash
git clone <url-de-ton-repo> garoua-explorer
cd garoua-explorer
```

## 3. Configurer les variables d'environnement de production

```bash
cd backend
cp .env.example .env
nano .env
```

Points impératifs à changer par rapport au `.env` de développement :
- `NODE_ENV=production`
- `JWT_SECRET` et `JWT_REFRESH_SECRET` : génère des valeurs fortes avec `openssl rand -hex 32`
- `DATABASE_URL` : utilise le mot de passe MySQL de production (pas `garoua_pass`)
- `CORS_ORIGIN` : l'URL réelle de ton frontend (ex: `https://garoua-explorer.com`)

## 4. Lancer avec Docker Compose

```bash
cd ..
docker compose up -d --build
```

Vérifie que tout tourne :
```bash
docker compose ps
curl http://localhost:4000/api/v1/health
```

## 5. Configurer Nginx comme reverse proxy

Crée `/etc/nginx/sites-available/garoua-explorer` :

```nginx
server {
    listen 80;
    server_name api.garoua-explorer.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Active le site :
```bash
sudo ln -s /etc/nginx/sites-available/garoua-explorer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Activer HTTPS avec Let's Encrypt (gratuit)

```bash
sudo certbot --nginx -d api.garoua-explorer.com
```

Certbot configure automatiquement le certificat et le renouvellement (renouvellement auto tous les 90 jours, rien à faire ensuite).

## 7. Mettre à jour le CORS_ORIGIN

Une fois le frontend déployé (probablement sur un autre sous-domaine ou Vercel/Netlify), remets à jour `CORS_ORIGIN` dans `.env` avec l'URL HTTPS finale, puis :

```bash
docker compose restart backend
```

## 8. Sauvegardes de la base de données

Planifie une sauvegarde quotidienne simple avec `cron` :

```bash
# Ajouter dans crontab -e :
0 3 * * * docker exec garoua_mysql mysqldump -uroot -p$(grep MYSQL_ROOT_PASSWORD /chemin/vers/.env | cut -d= -f2) garoua_explorer > /backups/garoua_$(date +\%Y\%m\%d).sql
```

## 9. Monitoring de base

```bash
# Logs en direct
docker compose logs -f backend

# Vérifier la santé régulièrement (à mettre dans un cron d'alerte si besoin)
curl -f http://localhost:4000/api/v1/health || echo "API DOWN"
```

## Checklist finale avant mise en ligne

- [ ] Secrets JWT forts générés (pas ceux de `.env.example`)
- [ ] Mot de passe MySQL changé
- [ ] `NODE_ENV=production`
- [ ] `CORS_ORIGIN` pointe vers le vrai domaine du frontend
- [ ] HTTPS actif (certificat Let's Encrypt)
- [ ] Sauvegardes automatiques configurées
- [ ] Premier compte Admin créé et vérifié (`role: ADMIN` en base)
