import tempfile
import os

from fastapi import FastAPI, File, UploadFile, HTTPException, Body

from scripts.data_loader import load_couches, preload_couches
from scripts.pipeline import img_processing, coords_processing
from schemas import AnalyseCompleteResponse

app = FastAPI(title="Hackathon IA API", description="API pour l'analyse d'empietement de parcelles via OCR")

couches = load_couches()
preloaded_unions = preload_couches(couches)

@app.post("/api/analyse/img", response_model=AnalyseCompleteResponse)
async def analyse_image(file: UploadFile = File(...)):
    """
    Endpoint pour uploader une image et obtenir l'analyse complète d'empietement.

    - **file**: L'image à analyser (format supporté par l'OCR).
    
    Retourne le résultat de l'analyse sous forme de modèle Pydantic.
    """
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
        raise HTTPException(status_code=400, detail="Format d'image non supporté. Utilisez PNG, JPG, JPEG, BMP ou TIFF.")
    
    # Sauvegarder temporairement l'image
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name
    
    try:
        # Traiter l'image via le pipeline
        result = img_processing(temp_path, couches, preloaded_unions)
        if result is None:
            raise HTTPException(status_code=500, detail="Échec de l'extraction des coordonnées via OCR")
        
        return result
    finally:
        # Nettoyer le fichier temporaire
        os.unlink(temp_path)

@app.post("/api/analyse/coords", response_model=AnalyseCompleteResponse)
async def analyse_coords(coords: list = Body(...)):
    """
    Endpoint pour analyser une liste de coordonnées.

    - **coords**: Liste de coordonnées à analyser.
    
    Retourne le résultat de l'analyse sous forme de modèle Pydantic.
    """
    if not isinstance(coords, list) or not all(isinstance(pt, dict) and 'x' in pt and 'y' in pt for pt in coords):
        raise HTTPException(status_code=400, detail="Format des coordonnées invalide. Attendu: liste de dicts avec 'x' et 'y'.")
    
    try:
        result = coords_processing(coords, couches, preloaded_unions)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement des coordonnées: {str(e)}")

@app.get("/api")
async def root():
    return {"message": "API Hackathon IA - Analyse d'empietement"}

