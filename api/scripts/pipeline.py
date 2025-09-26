import json

from services.analyse_empietement import analyse_empietement
from services.analyse_empietement_optimized import analyse_empietement_optimized
from services.conversion_json_with_geojson import convertir_resultats_en_geojson, verifier_resultats_geojson
from services.ocr import gemini_ocr
from schemas import AnalyseCompleteResponse
from utils.logs import logger


def img_processing(img_path, couches, preloaded_unions):
    """
    Pipeline complet : extraction des coordonnées via OCR, analyse d'empietement, et retour du modèle Pydantic.

    Args:
        img_path (str): Chemin vers l'image à analyser.

    Returns:
        AnalyseCompleteResponse: Le résultat complet de l'analyse sous forme de modèle Pydantic.
    """
    logger.info(f"Début du traitement pour l'image : {img_path}")
    
    # Étape 1: Extraction des coordonnées via OCR
    coords = gemini_ocr(img_path)
    if not coords:
        logger.error("Aucune coordonnée extraite via OCR")
        return None
    
    logger.info(f"Coordonnées extraites : {len(coords)} points")
    
    # Étape 2: Analyse d'empietement
    json_result = analyse_empietement_optimized(coords, couches, preloaded_unions)
    
    # Étape 3: Parsing du JSON en dict
    result_dict = json.loads(json_result)

    # Etape 3.5: Conversion des géométries en GeoJSON EPSG:4326
    result_dict = convertir_resultats_en_geojson(result_dict)

    # Vérification des géométries GeoJSON - Si oui, continuer, sinon log warning et continuer
    if not verifier_resultats_geojson(result_dict):
        logger.warning("Certaines géométries dans les résultats ne sont pas des GeoJSON valides.")
    
    # Étape 4: Création du modèle Pydantic
    response = AnalyseCompleteResponse(**result_dict)
    
    logger.info("Traitement terminé avec succès")
    return response

def coords_processing(coords, couches, preloaded_unions):
    """
    Pipeline complet : analyse d'empietement à partir de coordonnées, et retour du modèle Pydantic.

    Args:
        coords (list): Liste de coordonnées à analyser.

    Returns:
        AnalyseCompleteResponse: Le résultat complet de l'analyse sous forme de modèle Pydantic.
    """
    logger.info(f"Début du traitement pour les coordonnées fournies : {len(coords)} points")
    
    if not coords:
        logger.error("Aucune coordonnée fournie pour l'analyse")
        return None
    
    # Étape 1: Analyse d'empietement
    json_result = analyse_empietement_optimized(coords, couches, preloaded_unions)
    
    # Étape 2: Parsing du JSON en dict
    result_dict = json.loads(json_result)

    # Etape 3: Conversion des géométries en GeoJSON EPSG:4326
    result_dict = convertir_resultats_en_geojson(result_dict)

    # Vérification des géométries GeoJSON - Si oui, continuer, sinon log warning et continuer
    if not verifier_resultats_geojson(result_dict):
        logger.warning("Certaines géométries dans les résultats ne sont pas des GeoJSON valides.")
    
    
    # Étape 3: Création du modèle Pydantic
    response = AnalyseCompleteResponse(**result_dict)
    
    logger.info("Traitement terminé avec succès")
    return response
