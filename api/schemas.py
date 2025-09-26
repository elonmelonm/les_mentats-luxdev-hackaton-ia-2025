from pydantic import BaseModel
from typing import Optional, List

# ------- OCR RESPONSE SCHEMAS -------


class Coordinate(BaseModel):
    x: float
    y: float

class ResponseSchema(BaseModel):
    coordinates: list[Coordinate]

# ------- ANALYSE RESPONSE SCHEMAS -------

class IntersectionResult(BaseModel):
    type: str
    coordonnees_parcelle: List[List]

class CoucheResult(BaseModel):
    has_intersection: bool
    intersections_sur_couche: Optional[IntersectionResult]
    reste_sur_couche: Optional[IntersectionResult]

class AnalyseCompleteResponse(BaseModel):
    aif: CoucheResult
    air_proteges: CoucheResult
    dpl: CoucheResult
    dpm: CoucheResult
    enregistrement_individuel: CoucheResult
    litige: CoucheResult
    parcelle: CoucheResult
    restriction: CoucheResult
    tf_demembres: CoucheResult
    tf_en_cours: CoucheResult
    tf_etat: CoucheResult
    titre_reconstitue: CoucheResult
    zone_inondable: CoucheResult
    parcelle_libre_finale: Optional[IntersectionResult]
    union_intersections: Optional[IntersectionResult]
    empietement: bool
    coordonnees_parcelle: Optional[IntersectionResult]


