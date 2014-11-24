var ratingBar = require('titutorial.ratingbar'),
    API = require('http_client'),
    usuario = Ti.App.Properties.getObject('user'),
    lugar = Alloy.Globals.lugar,
    barraEstrellas;

function cambiarCalificacion(e) {
    var data = {user_id: usuario.id, place_id: lugar.id, value: e.rating};

    var xhr = API.POST({
        endpoint: '/ratings',
        onSuccess: actualizarValores
    });

    xhr.send(JSON.stringify(data));
}

function actualizarValores(json) {
    $.promedioValor.text = json.place.rating_average;
    barraEstrellas.setRating(Number(json.value));
}

function respuestaCalificacionActual(json) {
    barraEstrellas = ratingBar.createRatingBar({
         left: 15,
         stars: 5,
         stepSize: 1,
         isIndicator: false,
         rating: json.value
    });

    $.promedioValor.text = json.place.rating_average;

    barraEstrellas.addEventListener('change', cambiarCalificacion);
    $.calificar.add(barraEstrellas);

    Alloy.Globals.Loader.hide();
}

function errorRespuesta() {
    Alloy.Globals.crouton.alert('Algo salió mal, intenta nuevamente');
    Alloy.Globals.Loader.hide();
}

function cargarCalificacionActual() {
    var xhr = API.GET({
        endpoint: '/ratings/current/' + lugar.id + '/' + usuario.id,
        onSuccess: respuestaCalificacionActual,
        onError: errorRespuesta
    });

    xhr.send();
}

cargarCalificacionActual();
