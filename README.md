💧 Système Intelligent de Suivi de Consommation d’Eau Domestique



📌 Description

    Ce projet est un système intelligent de surveillance de la consommation d’eau domestique en temps réel.
    Il permet aux abonnés de suivre leur consommation, de recevoir des alertes en cas de dépassement de seuils personnalisés, et d’optimiser leur utilisation de l’eau.

    L’application combine une partie IoT (ESP32 + capteur de débit d’eau) et une partie logicielle (backend + frontend) pour collecter, traiter et visualiser les données.


🚀 Fonctionnalités principales

    📊 Suivi en temps réel de la consommation d’eau (quotidienne, hebdomadaire, mensuelle).
    ⚠️ Alertes intelligentes en cas de dépassement des seuils.
    👤 Gestion des profils utilisateurs (abonnés, centres, employés).
    🗄️ Stockage des mesures dans une base de données relationnelle (MySQL).
    📈 Tableaux de bord avec statistiques et graphiques.
    🔒 Authentification simple (abonnés & employés).


🛠️ Technologies utilisées

    🔹 IoT
    ESP32 : microcontrôleur connecté au Wi-Fi.
    Capteur YF-S201 : mesure du débit d’eau.

    🔹 Backend
    Django (Python) : gestion des données et logique métier.
    MySQL : base de données relationnelle.

    🔹 Frontend
    React (Vite + TypeScript) : interface utilisateur moderne et rapide.
    TailwindCSS + ShadCN/UI : design réactif et élégant.


⚙️ Installation et utilisation

    1️⃣ Cloner le projet
    git clone https://github.com/ibrahimrh555/consomation.git
    cd consomation

    2️⃣ Backend (Django)
    cd backend
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py generer_mesures --numPolice=235
    python manage.py runserver
    Accéder au backend via :
    👉 http://127.0.0.1:8000/

    3️⃣ Frontend (React + Vite)
    cd frontend
    npm install
    npm run dev
    Accéder au frontend via :
    👉 http://localhost:3001/

📂 Structure du projet

    consomation/
    │            
    ├── core/              # App principale (abonnés, mesures, alertes)
    │   ├── managment/
    │   └── migrations/
    │
    ├── backend/           #
    │   
    │── frontend/          # Frontend React (Vite + TS)
    │   ├── src/
    │   └── public/
    │
    │── esp32/             # Code ESP32 pour capteur YF-S201
    │── manage.py
    └── README.md          # Documentation du projet


📊 Exemple de données générées

    Mesures toutes les 5 minutes (débit en L/min).
    Alertes déclenchées lors d’un dépassement du seuil configuré.
    Statistiques quotidiennes, hebdomadaires et mensuelles.


🔀 Git workflow : push & pull

🔹 Pousser des modifications (push)

    Vérifier l’état des fichiers :
    git status

    Ajouter les fichiers modifiés :
    git add .

    Faire un commit avec un message clair :
    git commit -m "1"

    Envoyer les changements vers GitHub :
    git push origin main

🔹 Récupérer les mises à jour (pull)

    Mettre à jour votre dépôt local avec la dernière version :
    git pull origin main

    En cas de conflit :
    Modifier les fichiers concernés.

    Refaire :
    git add .
    git commit -m "Résolution des conflits"
    git push origin main    



👥 Auteurs


    Projet réalisé par Rahmani Ibrahim dans le cadre d’un projet académique.


