
from geopandas import GeoDataFrame
from pipeline import coords_processing

from data_loader import load_couches
couches = load_couches()

def test_enregistrement():
    coords = [{"x": 455783.13, "y": 704585.08}, {"x": 455783.8, "y": 704570.1}, {"x": 455758.83, "y": 704568.97}, {"x": 455758.15, "y": 704583.96}]
    result = coords_processing(coords, couches)
    print(result.model_dump_json(indent=2))

if __name__ == "__main__":
    test_enregistrement()