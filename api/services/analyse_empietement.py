import json

import geopandas as gpd

from shapely.errors import TopologicalError
from shapely.geometry import Polygon

from utils.logs import logger

# ----------------- FONCTIONS -----------------

def comparer_parcelle_with_couches(gdf_parcelle, couches):
    """
    Compare une parcelle avec plusieurs couches géographiques.

    Args:
        gdf_parcelle (GeoDataFrame): La parcelle à analyser.
        couches (list): Liste de tuples (GeoDataFrame, nom de la couche).

    Returns:
        tuple: Un dictionnaire des résultats par couche et le reste final de la parcelle.
    """
    results = {}
    reste_final = gdf_parcelle.copy()
    logger.info(f"[INIT] Reste final = {reste_final.shape[0]} géométries")

    for geodf, name in couches:
        logger.info(f"--- Début du traitement pour la couche : {name} ---")

        # Harmonisation des CRS
        if geodf.crs not in ["EPSG:32631", "EPSG:32630", "EPSG:32632"]:
            geodf = geodf.to_crs(epsg=32631)
        if gdf_parcelle.crs != geodf.crs:
            gdf_parcelle = gdf_parcelle.to_crs(geodf.crs)

        try:
            union_couche = geodf.geometry.union_all()
        except Exception as e:
            logger.error(f"[{name}] union_all impossible : {e}")
            results[name] = {
                'has_intersection': False,
                'intersections': gpd.GeoDataFrame(),
                'reste': gdf_parcelle.copy()
            }
            continue

        try:
            has_intersection = gdf_parcelle.intersects(union_couche).any()
        except Exception as e:
            logger.error(f"[{name}] intersects échoué : {e}")
            has_intersection = False

        try:
            intersections = gpd.overlay(gdf_parcelle, geodf, how='intersection')
        except Exception as e:
            logger.error(f"[{name}] overlay intersection échoué : {e}")
            intersections = gpd.GeoDataFrame()

        try:
            reste = gpd.overlay(gdf_parcelle, geodf, how='difference')
        except Exception as e:
            logger.error(f"[{name}] overlay difference échoué : {e}")
            reste = gdf_parcelle.copy()

        results[name] = {
            'has_intersection': has_intersection,
            'intersections': intersections,
            'reste': reste
        }

        try:
            if not intersections.empty:
                reste_final["geometry"] = reste_final.geometry.difference(intersections.union_all())
        except TopologicalError as e:
            logger.error(f"[{name}] erreur topologique difference : {e}")
        except Exception as e:
            logger.error(f"[{name}] update reste_final échoué : {e}")

        logger.info(f"[{name}] intersections={intersections.shape[0]}, reste_final={reste_final.shape[0]}")

    return results, reste_final


def coordonnees_to_polygon(coords):
    """
    Convertit une liste de coordonnées en un polygone.

    Args:
        coords (list): Liste de dictionnaires avec clés 'x' et 'y'.

    Returns:
        Polygon: Le polygone créé.
    """
    points = [(point['x'], point['y']) for point in coords]
    return Polygon(points)


def analyse_empietement(coords_extraites_parcelle, couches):
    """
    Analyse l'empietement d'une parcelle sur plusieurs couches géographiques.

    Args:
        coords_extraites_parcelle (list): Liste des coordonnées de la parcelle.
        couches (list): Liste de tuples (GeoDataFrame, nom de la couche).

    Returns:
        str: Résultats de l'analyse en JSON.
    """
    poly = coordonnees_to_polygon(coords_extraites_parcelle)
    gdf = gpd.GeoDataFrame(index=[0], geometry=[poly], crs="EPSG:32631")

    resultats_comparaison, parcelle_libre_finale = comparer_parcelle_with_couches(gdf, couches)

    results = {}

    for couche in couches:
        name = couche[1]
        results[name] = {}
        results[name]['has_intersection'] = bool(resultats_comparaison[name]['has_intersection'])

        if resultats_comparaison[name]['intersections'].empty:
            results[name]['intersections_sur_couche'] = None
        else:
            results[name]['intersections_sur_couche'] = resultats_comparaison[name]['intersections'].union_all()

        if resultats_comparaison[name]['reste'].empty:
            results[name]['reste_sur_couche'] = None
        else:
            results[name]['reste_sur_couche'] = resultats_comparaison[name]['reste'].union_all()

    results['parcelle_libre_finale'] = parcelle_libre_finale

    intersections_list = [
        resultats_comparaison[couche]['intersections'].union_all()
        for couche in resultats_comparaison
        if not resultats_comparaison[couche]['intersections'].empty
    ]
    if intersections_list:
        union_intersections = gpd.GeoSeries(intersections_list).union_all()
    else:
        union_intersections = None

    results['union_intersections'] = union_intersections
    results['empietement'] = any(
        results[couche[1]]['has_intersection'] for couche in couches
    )
    results['coordonnees_parcelle'] = coords_extraites_parcelle

    logger.info("Analyse terminée avec succès.")
    return json.dumps(results, default=str, indent=4)
