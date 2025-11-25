# API Hackathon IA - Analyse d'Empiètement

API FastAPI pour l'analyse d'empiètement de parcelles via OCR et traitement géospatial.

## 🚀 Fonctionnalités

- **Analyse d'images** : Upload d'images de levés topographiques avec extraction OCR des coordonnées
- **Analyse de coordonnées** : Traitement direct de listes de coordonnées
- **Chatbot intelligent** : Agent conversationnel pour répondre aux questions sur les analyses
- **Détection d'empiètement** : Vérification automatique des intersections avec différentes couches géographiques

## 📋 Endpoints

### `POST /api/analyse/img`
Upload et analyse d'une image de levé topographique.
- **Input** : Fichier image (PNG, JPG, JPEG, BMP, TIFF)
- **Output** : Analyse complète d'empiètement avec toutes les couches

### `POST /api/analyse/coords`
Analyse directe de coordonnées.
- **Input** : Liste de coordonnées `[{"x": float, "y": float}]`
- **Output** : Analyse complète d'empiètement

### `POST /api/ask`
Interrogation du chatbot intelligent.
- **Input** : Question utilisateur
- **Output** : Réponse de l'agent

## 🛠️ Installation

```bash
# Installation des dépendances
pip install -r requirements.txt

# Ou avec uv
uv sync

# Lancement du serveur
uvicorn main:app --reload
```

## 📊 Couches Analysées

L'API vérifie les intersections avec 13 couches géographiques :
- AIF (Aires d'Intérêt Faunistique)
- Aires Protégées
- DPL (Domaine Public Local)
- DPM (Domaine Public Maritime)
- Enregistrement Individuel
- Litige
- Parcelles
- Restrictions
- Titres Fonciers (démembrés, en cours, état)
- Titres Reconstitués
- Zones Inondables

## 🔧 Configuration

Créez un fichier `.env` avec vos clés API :
```
LANGSMITH_API_KEY=your_key
QDRANT_API_KEY=your_key
QDRANT_URL=your_url
EXA_API_KEY=your_key
GOOGLE_API_KEY_1=your_key
GOOGLE_API_KEY_2=your_key
```

## 📁 Structure

```
├── main.py              # Point d'entrée FastAPI
├── schemas.py           # Modèles Pydantic
├── scripts/             # Scripts de traitement
├── services/            # Services métier
└── utils/               # Utilitaires
```