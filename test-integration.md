# Test d'intégration de l'API

## 🚀 Démarrage des services

### 1. Démarrer l'API FastAPI
```bash
cd api
source api_env/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Démarrer le frontend React
```bash
npm run dev
```

## 📋 Tests à effectuer

### Test 1: Analyse d'image
1. Aller sur http://localhost:5173/topographie
2. Glisser-déposer une image topographique (PNG, JPG, etc.)
3. Vérifier que l'analyse se lance
4. Vérifier l'affichage des résultats

### Test 2: Analyse de coordonnées
1. Aller sur http://localhost:5173/carte-topographie
2. Cliquer sur "Analyser des coordonnées"
3. Saisir des coordonnées UTM (exemple: X=395400, Y=793850)
4. Cliquer sur "Analyser les coordonnées"
5. Vérifier l'affichage des résultats sur la carte

### Test 3: Vérification de l'API
1. Aller sur http://localhost:8000/docs
2. Tester l'endpoint `/api` (GET)
3. Tester l'endpoint `/api/analyse/coords` (POST)

## 🔧 Endpoints API disponibles

- `GET /api` - Vérification de l'API
- `POST /api/analyse/img` - Analyse d'image via OCR
- `POST /api/analyse/coords` - Analyse de coordonnées

## 📊 Format des données

### Entrée (coordonnées)
```json
[
  {"x": 395400, "y": 793850},
  {"x": 395420, "y": 793850},
  {"x": 395420, "y": 793830},
  {"x": 395400, "y": 793830}
]
```

### Sortie (résultats d'analyse)
```json
{
  "empietement": false,
  "coordonnees_parcelle": [...],
  "parcelle_libre_finale": "...",
  "aif": {"has_intersection": false, ...},
  "dpl": {"has_intersection": false, ...},
  "dpm": {"has_intersection": false, ...},
  ...
}
```

## 🐛 Dépannage

### API ne démarre pas
- Vérifier que l'environnement virtuel est activé
- Vérifier que toutes les dépendances sont installées
- Vérifier les logs d'erreur

### Frontend ne se connecte pas à l'API
- Vérifier que l'API tourne sur le port 8000
- Vérifier la configuration du proxy dans vite.config.js
- Vérifier les logs du navigateur (F12)

### Erreurs CORS
- L'API FastAPI est configurée pour accepter les requêtes depuis localhost:5173
- Vérifier la configuration CORS dans main.py si nécessaire
