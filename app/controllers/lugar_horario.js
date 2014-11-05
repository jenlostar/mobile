var parametros = arguments[0] || {},
    crouton = require('de.manumaticx.crouton');

var moment = require('alloy/moment');
require('alloy/moment/lang/es');

var fechaActual = new Date();
var anioActual = fechaActual.getFullYear();
var mesActual = fechaActual.getMonth();
var diaActual = fechaActual.getDate();
var fechaMinima = new Date(anioActual, mesActual, diaActual + 1, 7, 0, 0);
var fechaMaxima = new Date(anioActual, mesActual, diaActual + 8, 7, 0, 0);

var fechaSeleccionada = fechaMinima;

function cargarLista() {
    var horasDia = [],
        horaInicial = new moment(fechaSeleccionada).startOf('day').add(7, 'hours'),
        horaFinal = new moment(fechaSeleccionada).startOf('day').add(19, 'hours');

    while (horaInicial.diff(horaFinal) <= 0) {
        horasDia.push({
            fecha: horaInicial.format('YYYY-MM-DD HH:mm'),
            fechaCompleta: horaInicial.format('dddd DD YYYY hh:mm A'),
            hora: {text: horaInicial.format('hh:mm A')},
            estado: {text: 'Disponible'},
            properties: {
                width: Ti.UI.FILL,
                height: '70dip',
                backgroundColor: 'transparent',
                layout: 'horizontal'
            }
        });

        horaInicial.add(60, 'minutes');
    }

    $.seccionLista.setItems(horasDia);
}

function enviarReserva(servicios, horaSeleccionada) {

    var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
            Alloy.Globals.LO.hide();
            crouton.info('Se ha creado una nueva solicitud de reserva, en un momento recibira una confirmación via correo electrónico');
        },
        onerror: function(e) {
            Alloy.Globals.LO.hide();
            crouton.alert('Algo salió mal, intenta nuevamente');
        },
        timeout: 15000
    });

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization', 'Bearer ' + Ti.App.Properties.getString('access_token'));
    xhr.open('POST', Alloy.CFG.API_URL + '/bookings');

    var post = {
        user_id: Ti.App.Properties.getObject('user').id,
        place_id: Alloy.Globals.lugar.id,
        date: horaSeleccionada,
        services: servicios
    };

    xhr.send(JSON.stringify(post));
}

function actualizarInfoNavegacion() {
    var abx = require('com.alcoapps.actionbarextras'),
        fechaActual = new moment(fechaSeleccionada);

    abx.subtitle = fechaActual.format('dddd DD MMMM');
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.diaActualNavegacion.text = fechaActual.format('dddd DD MMMM');
}

cargarLista();

require('ui').touchFeedbackNavigation($.anterior, $.siguiente);

$.ventanaReservas.addEventListener('focus', function() {
    actualizarInfoNavegacion();
});

$.anterior.setVisible(false);

$.siguiente.addEventListener('click', function() {
    var diaSiguiente = new moment(fechaSeleccionada).startOf('day').add(1, 'day');
    fechaSeleccionada = diaSiguiente.toDate();
    actualizarInfoNavegacion();
    cargarLista();

    $.anterior.setVisible(!diaSiguiente.isBefore(fechaMinima));
    $.siguiente.setVisible(!diaSiguiente.isAfter(fechaMaxima));
});

$.anterior.addEventListener('click', function() {
    var diaAnterior = new moment(fechaSeleccionada).startOf('day').subtract(1, 'day');
    fechaSeleccionada = diaAnterior.toDate();
    actualizarInfoNavegacion();
    cargarLista();

    $.anterior.setVisible(!diaAnterior.isBefore(fechaMinima));
    $.siguiente.setVisible(!diaAnterior.isAfter(fechaMaxima));
});

$.controlLista.addEventListener('itemclick', function(e) {
    var item = e.section.getItemAt(e.itemIndex);

    if(_.isEmpty(Alloy.Globals.servicios_seleccionados)) {
        crouton.alert('Debe seleccionar por lo menos un servicio para continuar con la reserva');
        return;
    }

    // Alloy.Globals.LO.show('Enviando...');

    // var servicios_id = _.keys(Alloy.Globals.servicios_seleccionados);
    // enviarReserva(servicios_id, item.fecha);

    Alloy.createController('confirmar_envio', item);
});
