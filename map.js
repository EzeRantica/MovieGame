var map = L.map('map', { minZoom: 2, doubleClickZoom: false, inertiaDeceleration: 2000}).setView([51.505, -0.09], 6); // Iniciación del mapa, con vista centrada en Londres

var userMarkers = [];
var distance;
var distanceUnit = "m";
var locationForBounds;
var guessMovieIcon = L.icon({
    iconUrl: 'movie_icon.ico',
    shadowUrl: 'movie_icon.ico',

    iconSize:     [32, 32], // tamaño del ícono
    shadowSize:   [0, 0], // tamaño de la sombra del ícono
    iconAnchor:   [16, 16], // punto del ícono que corresponde al valor de locación
    shadowAnchor: [0, 0],  // punto de la sombra que corresponde al valor de locación
    popupAnchor:  [0, -20] // punto del ícono en el que aparece el popup
});
var correctLovationIcon = L.icon({
    iconUrl: 'correct_location_marker.ico',
    shadowUrl: 'correct_location_marker.ico',

    iconSize:     [32, 32], // tamaño del ícono
    shadowSize:   [0, 0], // tamaño de la sombra del ícono
    iconAnchor:   [16, 16], // punto del ícono que corresponde al valor de locación
    shadowAnchor: [0, 0],  // punto de la sombra que corresponde al valor de locación
    popupAnchor:  [0, -20] // punto del ícono en el que aparece el popup
});

//Variables de elementos DOM/HTML
var distanceTextContainerElement = document.getElementById("distanceTextContainer");
var distanceTextElement = document.getElementById("distanceText");

//Variables de estado del juego
const gameStates = ["round1",
                    "round2",
                    "round3",
                    "round4",
                    "round5",
                    "finished", 
                    "brakdown"];
var currentGameState = gameStates[0];//Inicializado en "started"
var roundIndex = 0;


// L.tileLayer(`https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=1Fq8JtVVX0h7DL78nnmo`, {
//     attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"
// }).addTo(map);

L.tileLayer(`https://api.maptiler.com/maps/topo-v2/{z}/{x}/{y}.png?key=1Fq8JtVVX0h7DL78nnmo`, {
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"
}).addTo(map);

// Creación del marcador en el evento OnClick() en el mapa
function onMapClick(e) {
    if (currentGameState != gameStates[5] && currentGameState != gameStates[6]) {
        if (!userMarkers) {
            userMarkers = L.marker(e.latlng, { icon: guessMovieIcon }).addTo(map);
            locationForBounds = e.latlng;
        } else {
            userMarkers.setLatLng(e.latlng);
            locationForBounds = e.latlng;
        }
    }
}

function MakePointOnLocation(correntLat, correctLong, location_desc){
    if (currentGameState != gameStates[5] && currentGameState != gameStates[6]) {
        userMarkers = L.marker({lat: correntLat, lng: correctLong}, {icon: correctLovationIcon}).addTo(map);
        userMarkers.bindPopup(location_desc);


        //SI HAY UN MARCADOR PUESTO POR EL JUGADOR
        //Seteo del area de zoom param mostrar ambos marcadores y la distancia entre ellos
        if (locationForBounds){
            let corner1 = L.latLng(correntLat, correctLong);
            let corner2 = L.latLng(locationForBounds.lat, locationForBounds.lng);

            //Configuración de línea entre los dos marcadores
            let latlngs = [
                [correntLat, correctLong], 
                [locationForBounds.lat, locationForBounds.lng]
            ];

            //Dibujar la línea entre los dos puntos
            var line = L.polyline(latlngs, {color: 'black', dashArray: '10, 10', dashOffset: '0'}).addTo(map);

            //Configuración de esquinas para fitBounds()
            let bounds = L.latLngBounds(corner1, corner2);
            bounds = bounds.pad(0.2);
            map.flyToBounds(bounds, {duration: 1, noMoveStart: true});
        
            let x = L.point(locationForBounds.lat, locationForBounds.lng)
        
            // distance = x.distanceTo(L.point(correntLat, correctLong));
            distance = map.distance(corner1, corner2);

            //Se toma el valor absoluto para no tener una distancia negativa
            distance = Math.abs(distance);

            //Determinar la unidad con la que se va a mostrar la distancia
            if (distance > 1000){
                distance = distance / 1000;
                distanceUnit = "km";
            }

            // console.log("Your guess was " + distance.toFixedDown(0) + " " + distanceUnit + ' from the correct location');//LOG
            distanceTextElement.innerHTML = 'Your guess was <span class="distance-highlight">' + distance.toFixedDown(0) + " " + distanceUnit + '</span> from the correct location';
            distanceTextContainerElement.style.display = "block";
        } else {
            //SI NO HAY UN SEGUNDO MARCADOR
            //Muevo la vista hacia el marcador de la locación correcta
            map.flyTo({lat: correntLat, lng: correctLong}, 17);
        }

        currentGameState = gameStates[roundIndex + 1];
        roundIndex += 1;
    }
}

// Añadir el evento de click en el mapa para crear el ícono
map.on('click', onMapClick);




























//NUMBER PROTOTYPE ADITION
Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};