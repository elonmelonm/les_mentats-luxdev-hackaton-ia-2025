import os
import csv
import json

from data_loader import load_couches
from pipeline import img_processing

def main():
    # Load couches
    couches = load_couches()

    # Define layers in model and corresponding CSV headers
    layers_model = ['aif', 'air_proteges', 'dpl', 'dpm', 'enregistrement_individuel', 'litige', 'parcelle', 'restriction', 'tf_demembres', 'tf_en_cours', 'tf_etat', 'titre_reconstitue', 'zone_inondable']
    layers_csv = ['aif', 'air_proteges', 'dpl', 'dpm', 'enregistrement individuel', 'litige', 'parcelles', 'restriction', 'tf_demembres', 'tf_en_cours', 'tf_etat', 'titre_reconstitue', 'zone_inondable']

    # Directory with test images
    testing_data_dir = "Data Hackathon_IA_2025/Testing Data/"

    # List images
    images = [f for f in os.listdir(testing_data_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    # Output CSV file
    output_csv = 'submission_generated_2.csv'

    with open(output_csv, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile, delimiter=';')
        # Write header
        writer.writerow(['Nom_du_levé', 'Coordonnées'] + layers_csv)

        # Process each image
        for image in images:
            img_path = os.path.join(testing_data_dir, image)
            print(f"Processing {image}...")
            result = img_processing(img_path, couches)
            if result is None:
                print(f"Failed to process {image}, skipping.")
                continue

            # Extract coordinates as JSON string
            coord_str = json.dumps([{'x': c.x, 'y': c.y} for c in result.coordonnees_parcelle], ensure_ascii=False)

            # Build row
            row = [image, coord_str]
            for layer in layers_model:
                couche_result = getattr(result, layer)
                oui_non = 'OUI' if couche_result.has_intersection else 'NON'
                row.append(oui_non)

            writer.writerow(row)

    print(f"CSV generated: {output_csv}")

if __name__ == "__main__":
    main()