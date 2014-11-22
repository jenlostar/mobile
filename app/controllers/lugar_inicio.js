var parametros = arguments[0] || {},
    crouton = require('de.manumaticx.crouton'),
    barraCalificacion = require('titutorial.ratingbar'),
    API = require('http_client'),
    usuario = Ti.App.Properties.getObject('user'),
    lugar = Alloy.Globals.lugar;

barraCalificacion = barraCalificacion.createRatingBar({
     left: 15,
     rating: 0,
     stars: 5,
     stepSize: 1,
     isIndicator: false
});

function cambiarCalificacion(e) {
    var data = {user_id: usuario.id, place_id: lugar.id, value: e.rating},
        url = '/ratings',
        xhr = API.POST(url, actualizarValores, null, true);

    xhr.send(JSON.stringify(data));
}

function actualizarValores(json) {
    $.promedioValor.text = json.place.rating_average;
    barraCalificacion.setRating(json.value);
}

function respuestaCalificacionActual(json) {
    actualizarValores(json);
    Alloy.Globals.LO.hide();
    barraCalificacion.addEventListener('change', cambiarCalificacion);
}

function errorRespuesta() {
    crouton.alert('Algo salió mal, intenta nuevamente');
    Alloy.Globals.LO.hide();
}

function cargarCalificacionActual() {
    var url = '/ratings/current/' + lugar.id + '/' + usuario.id,
        xhr = API.GET(url, respuestaCalificacionActual, null, true);
    xhr.send();
}

cargarCalificacionActual();

$.calificar.add(barraCalificacion);
