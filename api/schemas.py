from pydantic import BaseModel
from typing import Optional

# ------- OCR RESPONSE SCHEMAS -------


class Coordinate(BaseModel):
    x: float
    y: float

class ResponseSchema(BaseModel):
    coordinates: list[Coordinate]

# ------- ANALYSE RESPONSE SCHEMAS -------

"""class AnalyseResponseSchema(BaseModel):
    # Nom_du_levé;Coordonnées;aif;air_proteges;dpl;dpm;enregistrement individuel;litige;parcelles;restriction;tf_demembres;tf_en_cours;tf_etat;titre_reconstitue;zone_inondable
    nom_du_leve: str
    coordonnees: list[Coordinate]
    aif: bool
    air_proteges: bool
    dpl: bool
    dpm: bool
    enregistrement_individuel: bool
    litige: bool
    parcelles: bool
    restriction: bool
    tf_demembres: bool
    tf_en_cours: bool
    tf_etat: bool
    titre_reconstitue: bool
    zone_inondable: bool"""

class CoucheResult(BaseModel):
    has_intersection: bool
    intersections_sur_couche: Optional[str]
    reste_sur_couche: Optional[str]

class AnalyseCompleteResponse(BaseModel):
    aif: CoucheResult
    air_proteges: CoucheResult
    dpl: CoucheResult
    dpm: CoucheResult
    litige: CoucheResult
    parcelle: CoucheResult
    restriction: CoucheResult
    tf_demembres: CoucheResult
    tf_en_cours: CoucheResult
    tf_etat: CoucheResult
    titre_reconstitue: CoucheResult
    zone_inondable: CoucheResult
    parcelle_libre_finale: str
    union_intersections: Optional[str]
    empietement: bool
    coordonnees_parcelle: list[Coordinate]


