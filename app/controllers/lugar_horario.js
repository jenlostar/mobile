var parametros = arguments[0] || {};

var moment = require('alloy/moment');
var fechaActual = new Date();
var anioActual = fechaActual.getFullYear();
var mesActual = fechaActual.getMonth();
var diaActual = fechaActual.getDate();
var fechaMinima = new Date(anioActual, mesActual, diaActual + 1, 7, 0, 0);
var fechaMaxima = new Date(anioActual, mesActual, diaActual + 15, 7, 0, 0);

var fechaSeleccionada = fechaMinima;

var horaSeleccionada = null;

function cargarLista() {
    var horasDia = [],
        horaInicial = new moment(fechaSeleccionada).startOf('day').add(7, 'hours'),
        horaFinal = new moment(fechaSeleccionada).startOf('day').add(22, 'hours');

    while (horaInicial.diff(horaFinal) <= 0) {
        horasDia.push({
            fecha: horaInicial.format('YYYY-MM-DD HH:mm'),
            hora: {text: horaInicial.format('hh:mm A')},
            estado: {text: 'Disponible'},
            properties: {
                width: Ti.UI.FILL,
                height: '70dip',
                backgroundColor: 'transparent',
                layout: 'horizontal'
            }
        });

        horaInicial.add(30, 'minutes');
    }

    $.seccionLista.setItems(horasDia);
}

function enviarReserva(servicios) {

    var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
            var json = JSON.parse(this.responseText);
            json = null;

        },
        onerror: function(e) {
            Ti.API.debug(e.error);
            alert('error');
        },
        timeout: 15000
    });

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.open('POST', Alloy.CFG.API_URL + '/bookings');

    var post = {
        place_id: Alloy.Globals.lugar.id,
        date: horaSeleccionada,
        services: servicios
    };

    xhr.send(JSON.stringify(post));
}

function actualizarInfoNavegacion() {
    var abx = require('com.alcoapps.actionbarextras'),
        fechaActual = new moment(fechaSeleccionada);

    abx.subtitle = fechaActual.format('dddd Do');
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.diaActualNavegacion.text = fechaActual.format('dddd Do');
}

cargarLista();

require('ui').touchFeedbackNavigation($.anterior, $.siguiente);

$.ventanaReservas.addEventListener('focus', function() {
    actualizarInfoNavegacion();
});

$.siguiente.addEventListener('click', function() {
    var diaSiguiente = new moment(fechaSeleccionada).startOf('day').add(1, 'day');
    fechaSeleccionada = diaSiguiente.toDate();
    actualizarInfoNavegacion();
    cargarLista();
});

$.anterior.addEventListener('click', function() {
    var diaAnterior = new moment(fechaSeleccionada).startOf('day').subtract(1, 'day');
    fechaSeleccionada = diaAnterior.toDate();
    actualizarInfoNavegacion();
    cargarLista();
});

$.controlLista.addEventListener('itemclick', function() {

});
