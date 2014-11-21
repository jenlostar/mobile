var parametros = arguments[0] || {},
    crouton = require('de.manumaticx.crouton'),
    barraCalificacion = require('titutorial.ratingbar');

$.promedioValor.text = Alloy.Globals.lugar.rating_avg;

barraCalificacion = barraCalificacion.createRatingBar({
     left: 15,
     rating: 0,
     stars: 5,
     stepSize: 1,
     isIndicator: false
});

function procesarRespuesta(json) {
    Ti.API.info(JSON.stringify(json))
}

barraCalificacion.addEventListener('change', function(e) {
    var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
            var json = JSON.parse(this.responseText);
            procesarRespuesta(json);
            json = null;
            Alloy.Globals.LO.hide();
        },
        onerror: function(e) {
            crouton.alert('Algo salió mal, intenta nuevamente');
            Alloy.Globals.LO.hide();
        },
        timeout: 15000
    });

    var data = {
        user_id: Ti.App.Properties.getObject('user').id,
        place_id: Alloy.Globals.lugar.id,
        value: e.rating
    };

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization', 'Bearer ' + Ti.App.Properties.getString('access_token'));
    xhr.open('POST', Alloy.CFG.API_URL + '/ratings');
    xhr.send(JSON.stringify(data));
});

$.calificar.add(barraCalificacion);
