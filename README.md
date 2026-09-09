# AquaWatch — Suivi intelligent de consommation d’eau

AquaWatch est une application web de suivi de la consommation d’eau domestique en temps réel. Elle associe un capteur de débit connecté à un ESP32, une API Django REST et un tableau de bord React moderne.

## Fonctionnalités

- suivi du débit et du volume consommé ;
- tableau de bord quotidien, hebdomadaire et mensuel ;
- objectifs personnalisés de consommation ;
- alertes de fuite et de surconsommation ;
- historique et comparaison des mesures ;
- espace utilisateur protégé par authentification.

## Architecture

| Partie | Technologies |
|---|---|
| IoT | ESP32, capteur de débit YF-S201 |
| Backend | Python, Django, Django REST Framework |
| Base de données | MySQL 8 (local, tests et production) |
| Frontend | React, TypeScript, Vite |
| Interface | Tailwind CSS, shadcn/ui, Recharts |

```text
Capteur YF-S201 → ESP32 → API Django REST → MySQL
                                  ↓
                         Dashboard React
```

## Prérequis

- Python 3.11 ou version supérieure ;
- Node.js 20 ou version supérieure ;
- npm ;
- une instance MySQL 8 locale ou hébergée.

## Installation

### 1. Cloner la branche modernisée

```bash
git clone --branch modernisation-fullstack https://github.com/ibrahimrh555/Suivi_de_Consommation_d_Eau.git
cd Suivi_de_Consommation_d_Eau
```

### 2. Configurer l’environnement

Copiez le fichier d’exemple, puis adaptez les valeurs à votre environnement :

```powershell
Copy-Item .env.example .env
```

Sous macOS ou Linux :

```bash
cp .env.example .env
```

Variables principales :

| Variable | Description |
|---|---|
| `DJANGO_SECRET_KEY` | Clé secrète Django |
| `DJANGO_DEBUG` | Mode développement (`True` ou `False`) |
| `DATABASE_URL` | Connexion MySQL au format `mysql://user:password@host:3306/database` |
| `DB_SSL_REQUIRED` | Active TLS pour une base MySQL hébergée (`True` ou `False`) |
| `CORS_ALLOWED_ORIGINS` | Origines autorisées pour le frontend |
| `VITE_API_URL` | URL de l’API utilisée par React |

Ne publiez jamais votre fichier `.env` ni vos identifiants de base de données.
Pour MySQL, retirez l’ancien paramètre PostgreSQL `?sslmode=require` de l’URL ;
utilisez `DB_SSL_REQUIRED=True` lorsque TLS est nécessaire.

### 3. Lancer le backend

Depuis la racine du projet :

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Le backend est disponible sur `http://127.0.0.1:8000/` et l’API sous `/core/`.

Pour créer un compte administrateur :

```bash
python manage.py createsuperuser
```

### 4. Lancer le frontend

Dans un deuxième terminal :

```bash
cd frontend
npm install
npm run dev
```

Vite affiche l’adresse locale du frontend dans le terminal.

## Vérification du frontend

```bash
cd frontend
npm run lint
npm run build
```

## Déploiement gratuit

La production utilise :

- Cloudflare Pages pour le frontend ;
- Koyeb pour l'API Django ;
- un fournisseur MySQL compatible avec une connexion externe sécurisée.

Les Pull Requests vers `main` doivent réussir les contrôles backend et frontend.
Le workflow de production ne s'exécute qu'après un push ou un merge dans `main`.

### Configuration GitHub

Dans **Settings → Secrets and variables → Actions**, ajoutez :

Secrets :

- `KOYEB_API_TOKEN`
- `KOYEB_SERVICE_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Variables :

- `VITE_API_URL` : par exemple `https://aquawatch.koyeb.app/core`
- `CLOUDFLARE_PAGES_PROJECT` : nom du projet Pages

### Configuration Koyeb

Configurez le service depuis le dépôt GitHub, branche `main`, avec le
`Dockerfile` situé à la racine. Ajoutez au service :

- `DATABASE_URL`
- `DB_SSL_REQUIRED=True` si votre fournisseur MySQL impose TLS
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS=.koyeb.app`
- `DJANGO_SECURE_SSL_REDIRECT=True`
- `CORS_ALLOWED_ORIGINS=https://votre-site.pages.dev`
- `CSRF_TRUSTED_ORIGINS=https://votre-site.pages.dev`

Le point de contrôle de disponibilité est `/health/`.

## Structure du projet

```text
Suivi_de_Consommation_d_Eau/
├── backend/        # Configuration Django
├── core/           # Modèles, API, logique métier et migrations
├── esp32/          # Programme du capteur connecté
├── frontend/       # Application React + TypeScript
├── .env.example    # Exemple de configuration
├── manage.py
└── requirements.txt
```

## Récupérer les mises à jour de cette branche

```bash
git fetch origin
git switch modernisation-fullstack
git pull origin modernisation-fullstack
```

Si la branche n’existe pas encore localement :

```bash
git fetch origin
git switch --track origin/modernisation-fullstack
```

## Auteur

Projet académique réalisé par **Rahmani Ibrahim**.
