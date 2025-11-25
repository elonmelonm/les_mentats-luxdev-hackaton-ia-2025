# 🚀 Intégration API - Les Mentats Hackathon IA 2025

## 📋 Résumé de l'intégration

L'intégration de l'API FastAPI avec le frontend React est maintenant **complète** ! Voici ce qui a été implémenté :

### ✅ Fonctionnalités intégrées

1. **Service API** (`src/services/apiService.js`)
   - Communication avec l'API FastAPI
   - Gestion des erreurs et timeouts
   - Support pour l'upload d'images et l'analyse de coordonnées

2. **Analyseur d'images** (`src/components/ImageAnalyzer.jsx`)
   - Upload par drag & drop
   - Validation des formats et tailles
   - Interface utilisateur intuitive
   - Intégration avec l'API `/api/analyse/img`

3. **Analyseur de coordonnées** (`src/components/CoordinateAnalyzer.jsx`)
   - Saisie manuelle de coordonnées UTM
   - Validation des plages de coordonnées (Bénin)
   - Interface dynamique pour ajouter/supprimer des points
   - Intégration avec l'API `/api/analyse/coords`

4. **Affichage des résultats** (`src/components/AnalysisResults.jsx`)
   - Visualisation claire des résultats d'analyse
   - Détails par couche (AIF, DPL, DPM, etc.)
   - Indicateurs visuels d'empiètement
   - Informations sur la parcelle libre finale

5. **Intégration dans les pages**
   - **Topographie** : Upload et analyse d'images
   - **CarteTopographie** : Analyse de coordonnées et visualisation

6. **Configuration du proxy**
   - Proxy Vite configuré pour rediriger `/api` vers `localhost:8000`
   - Pas de problèmes CORS

## 🛠️ Architecture technique

```
Frontend (React + Vite)
├── src/services/apiService.js      # Service API
├── src/components/
│   ├── ImageAnalyzer.jsx           # Upload et analyse d'images
│   ├── CoordinateAnalyzer.jsx      # Saisie et analyse de coordonnées
│   └── AnalysisResults.jsx         # Affichage des résultats
└── src/pages/
    ├── Topographie.jsx             # Page d'analyse d'images
    └── CarteTopographie.jsx        # Page de visualisation et analyse de coords

API (FastAPI)
├── main.py                         # Endpoints API
├── scripts/pipeline.py             # Pipeline de traitement
├── schemas.py                      # Modèles Pydantic
└── services/                       # Services d'analyse
```

## 🚀 Démarrage rapide

### 1. Démarrer l'API
```bash
cd api
source api_env/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Démarrer le frontend
```bash
npm run dev
```

### 3. Accéder à l'application
- Frontend : http://localhost:5173
- API Docs : http://localhost:8000/docs

## 📊 Endpoints API utilisés

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api` | GET | Vérification de l'API |
| `/api/analyse/img` | POST | Analyse d'image via OCR |
| `/api/analyse/coords` | POST | Analyse de coordonnées |

## 🔧 Configuration

### Proxy Vite (`vite.config.js`)
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### Service API (`src/services/apiService.js`)
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

## 📱 Interface utilisateur

### Page Topographie
- **Upload d'images** : Drag & drop ou sélection de fichier
- **Formats supportés** : PNG, JPG, JPEG, BMP, TIFF
- **Taille maximale** : 10MB
- **Résultats** : Affichage détaillé avec indicateurs visuels

### Page CarteTopographie
- **Analyse de coordonnées** : Saisie manuelle de points UTM
- **Validation** : Plage de coordonnées pour le Bénin
- **Visualisation** : Carte interactive avec polygones
- **Résultats** : Sidebar avec informations détaillées

## 🧪 Tests

### Test d'analyse d'image
1. Aller sur `/topographie`
2. Uploader une image topographique
3. Vérifier l'analyse et les résultats

### Test d'analyse de coordonnées
1. Aller sur `/carte-topographie`
2. Cliquer sur "Analyser des coordonnées"
3. Saisir des coordonnées (ex: X=395400, Y=793850)
4. Vérifier l'analyse et la visualisation

## 🐛 Dépannage

### API ne démarre pas
```bash
# Vérifier l'environnement virtuel
cd api
source api_env/bin/activate

# Vérifier les dépendances
pip list

# Démarrer l'API
uvicorn main:app --reload
```

### Frontend ne se connecte pas
- Vérifier que l'API tourne sur le port 8000
- Vérifier les logs du navigateur (F12)
- Vérifier la configuration du proxy

### Erreurs de coordonnées
- Utiliser des coordonnées UTM Zone 31N
- Plage recommandée : X (300k-500k), Y (700k-900k)
- Minimum 3 points pour former un polygone

## 📈 Prochaines étapes

1. **Tests en production** avec de vraies données
2. **Optimisation des performances** pour de gros volumes
3. **Amélioration de l'interface** basée sur les retours utilisateurs
4. **Ajout de fonctionnalités** (export, historique, etc.)

## 🎯 État d'avancement

- ✅ **Installation des dépendances API**
- ✅ **Service API créé**
- ✅ **Intégration upload d'images**
- ✅ **Intégration analyse de coordonnées**
- ✅ **Affichage des résultats**
- ✅ **Configuration du proxy**

**L'intégration est complète et fonctionnelle !** 🎉
