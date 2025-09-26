import json
import concurrent.futures
import geopandas as gpd
from shapely.errors import TopologicalError
from shapely.geometry import Polygon
from utils.logs import logger

# ----------------- FONCTIONS OPTIMISEES -----------------


def process_couche(gdf_parcelle, geodf, name, union_couche):
    """
    Traite une couche individuellement pour parallélisation.

    Args:
        gdf_parcelle (GeoDataFrame): La parcelle à analyser.
        geodf (GeoDataFrame): La couche géographique.
        name (str): Nom de la couche.
        union_couche (Geometry): Union préchargée de la couche.

    Returns:
        dict: Résultats pour cette couche.
    """
    if union_couche is None:
        return {
            'has_intersection': False,
            'intersections': gpd.GeoDataFrame(),
            'reste': gdf_parcelle.copy()
        }

    # Harmonisation des CRS
    if gdf_parcelle.crs != geodf.crs:
        gdf_parcelle = gdf_parcelle.to_crs(geodf.crs)

    try:
        has_intersection = gdf_parcelle.intersects(union_couche).any()
    except Exception as e:
        logger.error(f"[{name}] intersects échoué : {e}")
        has_intersection = False

    # Utiliser sjoin pour des intersections plus rapides (index spatial)
    try:
        intersections = gpd.sjoin(gdf_parcelle, geodf, how='inner', predicate='intersects')
        # Convertir en GeoDataFrame avec géométrie d'intersection si nécessaire
        intersections = gpd.GeoDataFrame(intersections, geometry=intersections.geometry)
    except Exception as e:
        logger.error(f"[{name}] sjoin échoué : {e}")
        intersections = gpd.GeoDataFrame()

    # Calcul du reste avec difference
    try:
        reste = gpd.overlay(gdf_parcelle, geodf, how='difference')
    except Exception as e:
        logger.error(f"[{name}] overlay difference échoué : {e}")
        reste = gdf_parcelle.copy()

    return {
        'has_intersection': has_intersection,
        'intersections': intersections,
        'reste': reste
    }

def comparer_parcelle_with_couches_parallel(gdf_parcelle, couches, preloaded_unions):
    """
    Compare une parcelle avec plusieurs couches en parallèle.

    Args:
        gdf_parcelle (GeoDataFrame): La parcelle à analyser.
        couches (list): Liste de tuples (GeoDataFrame, nom de la couche).
        preloaded_unions (dict): Unions préchargées par nom de couche.

    Returns:
        tuple: Dictionnaire des résultats par couche et le reste final de la parcelle.
    """
    results = {}
    reste_final = gdf_parcelle.copy()
    logger.info(f"[INIT] Reste final = {reste_final.shape[0]} géométries")

    # Parallélisation avec ThreadPoolExecutor
    with concurrent.futures.ThreadPoolExecutor(max_workers=min(len(couches), 4)) as executor:
        futures = {
            executor.submit(process_couche, gdf_parcelle, geodf, name, preloaded_unions.get(name)): name
            for geodf, name in couches
        }
        for future in concurrent.futures.as_completed(futures):
            name = futures[future]
            try:
                result = future.result()
                results[name] = result

                # Mettre à jour le reste final
                if not result['intersections'].empty:
                    try:
                        intersections_union = result['intersections'].geometry.union_all()
                        reste_final = reste_final.difference(intersections_union)
                    except TopologicalError as e:
                        logger.error(f"[{name}] erreur topologique difference : {e}")
                    except Exception as e:
                        logger.error(f"[{name}] update reste_final échoué : {e}")

                logger.info(f"[{name}] intersections={result['intersections'].shape[0]}, reste_final={reste_final.shape[0]}")

            except Exception as e:
                logger.error(f"Erreur pour {name}: {e}")

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

def analyse_empietement_optimized(coords_extraites_parcelle, couches, preloaded_unions):
    """
    Analyse optimisée de l'empietement d'une parcelle sur plusieurs couches géographiques.

    Args:
        coords_extraites_parcelle (list): Liste des coordonnées de la parcelle.
        couches (list): Liste de tuples (GeoDataFrame, nom de la couche).
        preloaded_unions (dict): Unions préchargées des couches.

    Returns:
        str: Résultats de l'analyse en JSON.
    """
    poly = coordonnees_to_polygon(coords_extraites_parcelle)
    gdf = gpd.GeoDataFrame(index=[0], geometry=[poly], crs="EPSG:32631")

    resultats_comparaison, parcelle_libre_finale = comparer_parcelle_with_couches_parallel(gdf, couches, preloaded_unions)

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

    logger.info("Analyse optimisée terminée avec succès.")
    return json.dumps(results, default=str, indent=4)
