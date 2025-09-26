#!/bin/bash

# Script pour démarrer l'API FastAPI

echo "🚀 Démarrage de l'API FastAPI..."

# Aller dans le dossier api
cd api

# Activer l'environnement virtuel
source api_env/bin/activate

# Démarrer l'API avec uvicorn
echo "📡 Démarrage du serveur sur http://localhost:8000"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

echo "✅ API démarrée avec succès !"
