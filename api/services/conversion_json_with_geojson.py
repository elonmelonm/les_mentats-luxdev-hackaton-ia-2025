import json

from pyproj import Transformer
from shapely import wkt
from shapely.geometry import mapping, shape
from shapely.geometry.base import BaseGeometry

from utils.logs import logger


# Transformer depuis EPSG:32631 -> EPSG:4326 (à adapter à ton CRS initial)
transformer = Transformer.from_crs("EPSG:32631", "EPSG:4326", always_xy=True)

def reproj_coords(coords):
    """Reprojeter une liste de coordonnées en EPSG:4326, ignorer Z si présent."""
    logger.debug(f"Reprojection de {len(coords)} coordonnées.")
    new_coords = []
    for c in coords:
        if isinstance(c, (tuple, list)) and len(c) >= 2:
            x, y = c[0], c[1]  # on ignore z si présent
            x2, y2 = transformer.transform(x, y)
            new_coords.append([x2, y2])
    return new_coords

def reproj_geom(g):
    """Convertit une géométrie shapely en GeoJSON reprojeté."""
    logger.debug(f"Reprojection de la géométrie de type {g.geom_type}.")
    if g.is_empty:
        return None
    if g.geom_type == "Polygon":
        return {
            "type": "Polygon",
            "coordinates": [reproj_coords(g.exterior.coords)]
        }
    elif g.geom_type == "MultiPolygon":
        return {
            "type": "MultiPolygon",
            "coordinates": [
                [reproj_coords(p.exterior.coords)] for p in g.geoms
            ]
        }
    elif g.geom_type == "Point":
        x, y = g.x, g.y
        x2, y2 = transformer.transform(x, y)
        return {"type": "Point", "coordinates": [x2, y2]}
    else:
        return mapping(g)

def to_geojson(geom):
    """Convertit une string WKT ou une géométrie shapely en GeoJSON reprojeté (EPSG:4326)."""
    if geom is None or geom == "None":
        return None

    logger.debug(f"Conversion en GeoJSON, type d'entrée: {type(geom)}")
    if isinstance(geom, dict) and "type" in geom:
        try:
            g = shape(geom)  # convertir en shapely
            return reproj_geom(g)
        except Exception as e:
            logger.warning(f"Impossible de parser GeoJSON: {e}")
            return None
        
    # Si c’est une string, tenter de parser en WKT
    if isinstance(geom, str):
        try:
            g = wkt.loads(geom)
            return reproj_geom(g)
        except Exception:
            logger.warning(f"Impossible de parser WKT: {geom[:50]}...")
            return None
    
    # Si déjà shapely
    if isinstance(geom, BaseGeometry):
        return reproj_geom(geom)

    logger.warning(f"Type de géométrie non supporté pour la conversion: {type(geom)}")
    return None


def convertir_resultats_en_geojson(results):
    """Prend l'objet results issu de analyse_empietement et convertit les géométries en GeoJSON EPSG:4326"""
    logger.info("Début de la conversion des résultats en GeoJSON.")
    output = {}

    for couche, data in results.items():
        logger.debug(f"Traitement de la couche: {couche}")
        try :
            if isinstance(data, dict):  # Couches
                output[couche] = {}
                output[couche]['has_intersection'] = data['has_intersection']
                output[couche]['intersections_sur_couche'] = (
                    to_geojson(data['intersections_sur_couche'])
                    if data['intersections_sur_couche'] else None
                )
                output[couche]['reste_sur_couche'] = (
                    to_geojson(data['reste_sur_couche'])
                    if data['reste_sur_couche'] else None
                )
            else:  # Clés globales
                if couche == "parcelle_libre_finale":
                    output[couche] = to_geojson(data) if data else None
                elif couche == "union_intersections":
                    output[couche] = to_geojson(data) if data else None
                elif couche == "coordonnees_parcelle":
                    # Conversion en GeoJSON Polygon
                    coords = [(pt["x"], pt["y"]) for pt in data]
                    reprojected = [transformer.transform(x, y) for x, y in coords]
                    output[couche] = {
                        "type": "Polygon",
                        "coordinates": [reprojected]
                    }
                else:
                    output[couche] = data  # bools, flags...
        except Exception as e:
            logger.error(f"Erreur lors de la conversion de la couche {couche}: {e}")
            output[couche] = None

    logger.info("Conversion en GeoJSON terminée.")
    return output


def verifier_geojson(obj):
    """Vérifie que l'objet est un GeoJSON valide minimal"""
    if obj is None:
        return True
    if "type" not in obj:
        logger.warning("GeoJSON invalide: clé 'type' manquante.")
        return False
    if obj["type"] not in ["Feature", "FeatureCollection", "Point", "LineString", 
                           "Polygon", "MultiPolygon", "MultiLineString", "MultiPoint"]:
        logger.warning(f"GeoJSON invalide: type '{obj['type']}' non supporté.")
        return False
    if "coordinates" not in obj and obj["type"] != "FeatureCollection":
        logger.warning("GeoJSON invalide: clé 'coordinates' manquante.")
        return False
    return True


def verifier_resultats_geojson(results):
    """Parcourt toutes les clés et valide les GeoJSON"""
    logger.info("Début de la vérification des résultats GeoJSON.")
    for couche, data in results.items():
        if isinstance(data, dict):
            for k, v in data.items():
                if "intersections" in k or "reste" in k:
                    if not verifier_geojson(v):
                        logger.error(f"{couche}.{k} invalide")
                    else:
                        logger.info(f"{couche}.{k} OK")
        else:
            if "parcelle" in couche or "union" in couche:
                if not verifier_geojson(data):
                    logger.error(f"{couche} invalide")
                else:
                    logger.info(f"{couche} OK")
    logger.info("Vérification des GeoJSON terminée.")
    return True
"""
if __name__ == "__main__":
    logger.info("Démarrage du script de test pour la conversion GeoJSON.")
    from scripts.data_loader import load_couches
    
    from services.analyse_empietement import analyse_empietement
    from schemas import AnalyseCompleteResponse

    couches = load_couches()
    
    results_json = analyse_empietement([{"x": 395393.03, "y": 793873.05}, {"x": 395415.44, "y": 793865.76}, {"x": 395405.55, "y": 793839.98}, {"x": 395383.93, "y": 793846.97}], couches)
    geojson_results = convertir_resultats_en_geojson(json.loads(results_json))
    
    etat_geojson = verifier_resultats_geojson(geojson_results)
    logger.info(f"Résultats convertis en GeoJSON avec reprojection en EPSG:4326 :{etat_geojson}")
    # print(geojson_results)
    response = AnalyseCompleteResponse(**geojson_results)
    print(response)
    # Sauvegarde du résultat GeoJSON
    output_filename = "analyse_empietement_complete_geojson_finale.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(geojson_results, f, indent=2)
    logger.info(f"Résultats GeoJSON sauvegardés dans '{output_filename}'.")
"""
