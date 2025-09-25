

from geopandas import GeoDataFrame

from services.analyse_empietement import analyse_empietement
from services.ocr import gemini_ocr
from schemas import AnalyseCompleteResponse

from utils.logs import logger

import time

logger.info("Début du chargement des couches GeoDataFrame")

start_time = time.time()
couche_aif = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/aif.geojson")
logger.info(f"Chargement de couche_aif terminé en {time.time() - start_time:.2f}s")

start_time = time.time()
couche_aires_protegees = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/air_proteges.geojson")
logger.info(f"Chargement de couche_aires_protegees terminé en {time.time() - start_time:.2f}s")

start_time = time.time()
couche_dpl = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/dpl.geojson")
logger.info(f"Chargement de couche_dpl terminé en {time.time() - start_time:.2f}s")

start_time = time.time()
couche_dpm = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/dpm.geojson")
logger.info(f"Chargement de couche_dpm terminé en {time.time() - start_time:.2f}s")

# couche_enregistrement = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/enregistrement individuel.geojson")

start_time = time.time()
couche_litige = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/litige.geojson")
logger.info(f"Chargement de couche_litige terminé en {time.time() - start_time:.2f}s")

start_time = time.time()
couche_parcelle = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/parcelles.geojson")
logger.info(f"Chargement de couche_parcelle terminé en {time.time() - start_time:.2f}s")

start_time = time.time()
couche_restriction = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/restriction.geojson")
logger.info(f"Chargement de couche_restriction terminé en {time.time() - start_time:.2f}s")

start_time = time.time()
couche_tf_demembres = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/tf_demembres.geojson")
logger.info(f"Chargement de couche_tf_demembres terminé en {time.time() - start_time:.2f}s")

start_time = time.time()
couche_tf_en_cours = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/tf_en_cours.geojson")
logger.info(f"Chargement de couche_tf_en_cours terminé en {time.time() - start_time:.2f}s")

start_time = time.time()
couche_tf_etat = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/tf_etat.geojson")
logger.info(f"Chargement de couche_tf_etat terminé en {time.time() - start_time:.2f}s")

start_time = time.time()
couche_titre_reconstitue = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/titre_reconstitue.geojson")
logger.info(f"Chargement de couche_titre_reconstitue terminé en {time.time() - start_time:.2f}s")

start_time = time.time()
couche_zone_inondable = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/zone_inondable.geojson")
logger.info(f"Chargement de couche_zone_inondable terminé en {time.time() - start_time:.2f}s")

logger.info("Chargement de toutes les couches terminé")

couches = [
    (couche_aif, "aif"),
    (couche_aires_protegees, "air_proteges"),
    (couche_dpl, "dpl"),
    (couche_dpm, "dpm"),
    (couche_litige, "litige"),
    (couche_parcelle, "parcelle"),
    (couche_restriction, "restriction"),
    (couche_tf_demembres, "tf_demembres"),
    (couche_tf_en_cours, "tf_en_cours"),
    (couche_tf_etat, "tf_etat"),
    (couche_titre_reconstitue, "titre_reconstitue"),
    (couche_zone_inondable, "zone_inondable")
]

def img_processing(img_path):
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

def coords_processing(coords):
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


