from services.analyse_empietement import analyse_empietement
from services.ocr import gemini_ocr
from schemas import AnalyseCompleteResponse

from utils.logs import logger


def img_processing(img_path, couches):
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
    json_result = analyse_empietement(coords, couches)
    
    # Étape 3: Parsing du JSON en dict
    import json
    result_dict = json.loads(json_result)
    
    # Étape 4: Création du modèle Pydantic
    response = AnalyseCompleteResponse(**result_dict)
    
    logger.info("Traitement terminé avec succès")
    return response

def coords_processing(coords, couches):
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
    json_result = analyse_empietement(coords, couches)
    
    # Étape 2: Parsing du JSON en dict
    import json
    result_dict = json.loads(json_result)
    
    # Étape 3: Création du modèle Pydantic
    response = AnalyseCompleteResponse(**result_dict)
    
    logger.info("Traitement terminé avec succès")
    return response


