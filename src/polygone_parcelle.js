export function tracerParcelle(map, parcelleData) {
    // Fonction utilitaire pour créer des sources et couches polygonales
    function addPolygonLayer(id, geometry, color, popupText, options = {}) {

    if (!geometry || !geometry.type || !geometry.coordinates) return;

    // Nettoyage si déjà présent : supprimer d'abord les couches, puis la source
    if (map.getLayer(id + '-border')) map.removeLayer(id + '-border');
    if (map.getLayer(id)) map.removeLayer(id);
    if (map.getSource(id)) map.removeSource(id);

        // Ajouter une source GeoJSON (Polygon ou MultiPolygon)
        map.addSource(id, {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "geometry": geometry,
                "properties": {}
            }
        });

            // Ajouter la couche de remplissage
            map.addLayer({
                "id": id,
                "type": "fill",
                "source": id,
                "layout": {},
                "paint": {
                    "fill-color": color,
                    "fill-opacity": 0.4,
                    "fill-outline-color": color
                }
            });
            // Ajout du layer de bordure (line)
            map.addLayer({
                "id": id + '-border',
                "type": "line",
                "source": id,
                "layout": {},
                "paint": {
                    "line-color": color,
                    "line-width": 3
                }
            });

        // Ajouter le popup sur clic
        map.on('click', id, (e) => {
            new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<strong>${popupText}</strong>`)
                .addTo(map);
        });

        // Zoom sur le polygone au clic (Polygon ou MultiPolygon)
        map.on('click', id, (e) => {
            let allCoords = [];
            if (geometry.type === 'Polygon') {
                allCoords = geometry.coordinates.flat();
            } else if (geometry.type === 'MultiPolygon') {
                allCoords = geometry.coordinates.flat(2);
            }
            if (allCoords.length > 0) {
                const bounds = allCoords.reduce((b, coord) => b.extend(coord), new maplibregl.LngLatBounds(allCoords[0], allCoords[0]));
                map.fitBounds(bounds, {padding: 20});
            }
        });

        // Si demandé, centrer la carte et ajouter un marqueur au centroïde
        if (options.centerAndMarker) {
            let allCoords = [];
            if (geometry.type === 'Polygon') {
                allCoords = geometry.coordinates.flat();
            } else if (geometry.type === 'MultiPolygon') {
                allCoords = geometry.coordinates.flat(2);
            }
            if (allCoords.length > 0) {
                // Centrage avec padding important pour éviter un zoom trop rapproché
                const bounds = allCoords.reduce((b, coord) => b.extend(coord), new maplibregl.LngLatBounds(allCoords[0], allCoords[0]));
                map.fitBounds(bounds, {padding: 120}); // padding élevé, pas de maxZoom
                // Centroïde simple (moyenne)
                const centroid = allCoords.reduce((acc, c) => [acc[0]+c[0], acc[1]+c[1]], [0,0]).map(x => x/allCoords.length);
                new maplibregl.Marker({color: color})
                    .setLngLat(centroid)
                    .setPopup(new maplibregl.Popup().setText(popupText))
                    .addTo(map);
            }
        }
    }

    // Parcelle entière
    if (parcelleData.coordonnees_parcelle?.type && parcelleData.coordonnees_parcelle?.coordinates?.length) {
        addPolygonLayer("parcelle_entire", parcelleData.coordonnees_parcelle, "blue", "Parcelle entière", {centerAndMarker: true});
    }

    // Zone d'empiètement
    if (parcelleData.union_intersections?.type && parcelleData.union_intersections?.coordinates?.length) {
        addPolygonLayer("zone_empietement", parcelleData.union_intersections, "red", "Zone d'empiétement");
    }

    // Zone libre
    if (parcelleData.parcelle_libre_finale?.type && parcelleData.parcelle_libre_finale?.coordinates?.length) {
        addPolygonLayer("zone_libre", parcelleData.parcelle_libre_finale, "green", "Zone libre");
    }

    // Centroid si disponible
    if (parcelleData.centroide) {
        new maplibregl.Marker()
            .setLngLat([parcelleData.centroide.x, parcelleData.centroide.y])
            .setPopup(new maplibregl.Popup().setText("Centroid de la parcelle"))
            .addTo(map);
    }
}