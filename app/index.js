import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import "./index.scss";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx0YS1kZW52ZXIiLCJhIjoiY2s2czlyeHZlMDB0bzNlcjQ0MnoweGhtayJ9.A_2JYo7d7yPDljD96RCrEQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 13,
  center: [-122.675, 45.5051],
});


map.addControl(
  new MapBoxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: "Search here"
  })
);
map.addControl(
  new mapboxgl.NavigationControl()
);
map.on("load", () => {
  map.addSource("mapbox-traffic", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-traffic-v1",
  });
  map.addLayer({
    id: "traffic-data",
    type: "line",
    source: "mapbox-traffic",
    "source-layer": "traffic",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-width": 1.5,
      "line-color": [
        "case",
        ["==", "low", ["get", "congestion"]],
        "#00908C",
        ["==", "moderate", ["get", "congestion"]],
        "#3862AE",
        ["==", "heavy", ["get", "congestion"]],
        "#ee4e8b",
        ["==", "severe", ["get", "congestion"]],
        "#b43b71",
        "#222222",
      ],
    },
  });
});

// Add Mapillary sequence layer.
map.on('load', function () {
  
  map.addSource('mapillary', {
  'type': 'vector',
  'tiles': [
  'https://d25uarhxywzl1j.cloudfront.net/v0.1/{z}/{x}/{y}.mvt'
  ],
  'minzoom': 6,
  'maxzoom': 14
  });
  map.addLayer(
  {
  'id': 'mapillary',
  'type': 'line',
  'source': 'mapillary',
  'source-layer': 'mapillary-sequences',
  'layout': {
  'line-cap': 'round',
  'line-join': 'round'
  },
  'paint': {
  'line-opacity': 0.5,
  'line-color': 'rgb(53, 175, 109)',
  'line-width': 2
  }
  },
  'waterway-label'
  );
  });

  var layerList = document.getElementById('menu');
  var inputs = layerList.getElementsByTagName('input');
   
  function switchLayer(layer) {
  var layerId = layer.target.id;
  map.setStyle('mapbox://styles/mapbox/' + layerId);
  }
   
  for (var i = 0; i < inputs.length; i++) {
  inputs[i].onclick = switchLayer;
  }