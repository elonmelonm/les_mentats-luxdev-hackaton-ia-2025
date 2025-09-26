import geopandas as gpd
from geopandas import GeoDataFrame
import os

couche_aif = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/aif.geojson")
couche_aires_protegees = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/air_proteges.geojson")
couche_dpl = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/dpl.geojson")
couche_dpm = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/dpm.geojson")
# couche_enregistrement = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/enregistrement individuel.geojson")
couche_litige = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/litige.geojson")
couche_parcelle = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/parcelles.geojson")
couche_restriction = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/restriction.geojson")
couche_tf_demembres = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/tf_demembres.geojson")
couche_tf_en_cours = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/tf_en_cours.geojson")
couche_tf_etat = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/tf_etat.geojson")
couche_titre_reconstitue = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/titre_reconstitue.geojson")
couche_zone_inondable = GeoDataFrame.from_file("Data Hackathon_IA_2025/couche/zone_inondable.geojson")

couches = [
    (couche_aif, "aif"),
    (couche_aires_protegees, "aires_protegees"),
    (couche_dpl, "dpl"),
    (couche_dpm, "dpm"),
    #(couche_enregistrement, "enregistrement"),
    (couche_litige, "litige"),
    (couche_parcelle, "parcelle"),
    (couche_restriction, "restriction"),
    (couche_tf_demembres, "tf_demembres"),
    (couche_tf_en_cours, "tf_en_cours"),
    (couche_tf_etat, "tf_etat"),
    (couche_titre_reconstitue, "titre_reconstitue"),
    (couche_zone_inondable, "zone_inondable"),
]



def convertion_crs(couches):
    os.makedirs("Data Hackathon_IA_2025/couche/crs_4326", exist_ok=True)

    for couche in couches:
        gdf = couche[0]
        print(f"Couche: {couche[1]}")
        print(f"CRS avant reprojection: {gdf.crs}")
        gdf = gdf.to_crs(epsg=4326)
        print(f"CRS après reprojection: {gdf.crs}")
        
        try :
            output_path = f"Data Hackathon_IA_2025/couche/crs_4326/{couche[1]}_wgs84.geojson"
            gdf.to_file(output_path, driver="GeoJSON")
            print(f"Sauvegardé: {output_path}\n")
        except Exception as e:
            print(f"Erreur lors de la sauvegarde de la couche {couche[1]}: {e}\n")
            
if __name__ == "__main__":
    convertion_crs(couches)



