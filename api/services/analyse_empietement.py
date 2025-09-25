import json
import warnings

import geopandas as gpd
import pandas as pd

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


def analyse_parcelles(input_data, couches, csv_output_path="resultat_empietement.csv"):
    """
    Analyse plusieurs parcelles et sauvegarde les résultats dans un CSV.

    Args:
        input_data: Liste, DataFrame ou chemin CSV des coordonnées.
        couches (list): Liste de tuples (GeoDataFrame, nom de la couche).
        csv_output_path (str): Chemin du fichier CSV de sortie.

    Returns:
        tuple: DataFrame des résultats et JSON de la dernière analyse.
    """

    if isinstance(input_data, list):
        for i, pt in enumerate(input_data):
            if not isinstance(pt, dict):
                raise ValueError(f"Element {i} de la liste n'est pas un dict")
            if len(pt.keys()) != 2:
                raise ValueError(f"Element {i} de la liste n'a pas exactement 2 clés")
            if set(pt.keys()) != {"x", "y"}:
                warnings.warn(
                    f"Element {i} de la liste n'a pas les clés 'x' et 'y', "
                    f"mais {list(pt.keys())}. On continue quand même."
                )
        df = pd.DataFrame({"Coordonnées": [input_data]})  

    elif isinstance(input_data, pd.DataFrame):
        df = input_data.copy()
    elif isinstance(input_data, str):
        if not input_data.lower().endswith(".csv"):
            raise ValueError("Le fichier doit être un .csv")
        df = pd.read_csv(input_data)
    else:
        raise TypeError("input_data doit être une liste, un DataFrame ou un chemin CSV")

    if "Coordonnées" not in df.columns:
        coords_col = None
        for col in df.columns:
            first_val = df[col].iloc[0]
            if isinstance(first_val, list) and len(first_val) > 0:
                if isinstance(first_val[0], dict) and len(first_val[0].keys()) == 2:
                    coords_col = col
                    break
        if coords_col is None:
            raise ValueError("Impossible de trouver la colonne des coordonnées")
        df.rename(columns={coords_col: "Coordonnées"}, inplace=True)

    rows = []
    for idx, row in df.iterrows():
        coords = row["Coordonnées"]
        try:
            analyse_json = analyse_empietement(coords, couches)
            analyse_dict = json.loads(analyse_json)
        except Exception as e:
            analyse_dict = {"error": str(e)}

        line_result = {"Coordonnées": coords}
        for _, couche_name in couches:
            if "error" in analyse_dict:
                line_result[couche_name] = "ERREUR"
            else:
                has_emp = analyse_dict.get(couche_name, {}).get("has_intersection", False)
                line_result[couche_name] = "OUI" if has_emp else "NON"

        rows.append(line_result)

    df_final = pd.DataFrame(rows)
    df_final.to_csv(csv_output_path, index=False)
    """# save the json file
    with open("analyse_empietement_complete.json", "w") as f:
        f.write(analyse_json)  # last"""
    
    return df_final, analyse_empietement(coords, couches)

def process_analyse_parcelle(input_data, couches, csv_output_path="submission.csv"):
    """
    Traite l'analyse des parcelles avec gestion d'erreurs.

    Args:
        input_data: Liste, DataFrame ou chemin CSV des coordonnées.
        couches (list): Liste de tuples (GeoDataFrame, nom de la couche).
        csv_output_path (str): Chemin du fichier CSV de sortie.

    Returns:
        tuple: DataFrame des résultats et JSON de l'analyse.
    """
    try:
        submission, analyse_complete_json = analyse_parcelles(input_data, couches, csv_output_path)
        logger.info(f"Analyse des parcelles terminée. Résultats sauvegardés dans {csv_output_path}.")
        return submission, analyse_complete_json
    except Exception as e:
        logger.error(f"Erreur lors de l'analyse des parcelles : {e}")
        raise


"""# ----------------- MAIN -----------------
if __name__ == "__main__":
    # Exemple de test
    coords_test = [{"x": 395393.03, "y": 793873.05}, {"x": 395415.44, "y": 793865.76}, {"x": 395405.55, "y": 793839.98}, {"x": 395383.93, "y": 793846.97}]

    logger.info("Lancement du script principal")
    submission_data, analyse_json = process_analyse_parcelle(coords_test, couches)
    print(submission_data)"""
