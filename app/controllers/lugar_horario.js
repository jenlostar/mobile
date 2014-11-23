var crouton = require('de.manumaticx.crouton'),
    API = require('http_client'),
    lugar = Alloy.Globals.lugar;

var moment = require('alloy/moment');
require('alloy/moment/lang/es');

var fechaActual = new Date();
var anioActual  = fechaActual.getFullYear();
var mesActual   = fechaActual.getMonth();
var diaActual   = fechaActual.getDate();
var fechaMinima = new Date(anioActual, mesActual, diaActual + 1, 7, 0, 0);
var fechaMaxima = new Date(anioActual, mesActual, diaActual + 8, 7, 0, 0);

var fechaSeleccionada = fechaMinima;

function procesarRespuesta(json) {
    var horasDia = [];

    _.each(json, function(hora) {
        horasDia.push({
            fecha: hora.date,
            fechaCompleta: hora.date_extended,
            hora: {text: hora.hour_with_meridian},
            estado: {
                text: hora.available ? 'Disponible' : 'Ocupado',
                font: {
                    fontFamily: hora.available ? 'SourceSansPro-Regular' : 'SourceSansPro-Light',
                    fontSize: '24sp'
                }
            },
            disponible: hora.available,
            properties: {
                width: Ti.UI.FILL,
                height: '70dip',
                backgroundColor: 'transparent',
                layout: 'horizontal'
            }
        });
    });

    $.seccionLista.setItems(horasDia);

    Alloy.Globals.LO.hide();
}

function procesarError() {
    crouton.alert('Algo salió mal, intenta nuevamente');
    Alloy.Globals.LO.hide();
}

function cargarLista() {
    Alloy.Globals.LO.show('Actualizando...');

    var fechaActual = new moment(fechaSeleccionada);
    var dia = fechaActual.format('YYYY-MM-DD');

    var xhr = API.GET({
        url: '/places/' + lugar.id + '/bookings/' + dia,
        onSuccess: procesarRespuesta,
        onError: procesarError
    });

    xhr.send();
}

function actualizarInfoNavegacion() {
    var abx = require('com.alcoapps.actionbarextras'),
        fechaActual = new moment(fechaSeleccionada);

    abx.subtitle = fechaActual.format('dddd DD MMMM');
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.diaActualNavegacion.text = fechaActual.format('dddd DD MMMM');
}

function eventoClickAnterior() {
    var diaAnterior = new moment(fechaSeleccionada).startOf('day').subtract(1, 'day');
    fechaSeleccionada = diaAnterior.toDate();
    actualizarInfoNavegacion();
    cargarLista();

    $.anterior.setVisible(!diaAnterior.isBefore(fechaMinima));
    $.siguiente.setVisible(!diaAnterior.isAfter(fechaMaxima));
}

function eventoClickSiguiente() {
    var diaSiguiente = new moment(fechaSeleccionada).startOf('day').add(1, 'day');
    fechaSeleccionada = diaSiguiente.toDate();
    actualizarInfoNavegacion();
    cargarLista();

    $.anterior.setVisible(!diaSiguiente.isBefore(fechaMinima));
    $.siguiente.setVisible(!diaSiguiente.isAfter(fechaMaxima));
}

function eventoClickHora(e) {
    var item = e.section.getItemAt(e.itemIndex);
    if(item.disponible) {
        if(_.isEmpty(Alloy.Globals.servicios_seleccionados)) {
            crouton.alert('Debe seleccionar por lo menos un servicio para continuar con la reserva');
            return;
        }

        item.success = function() {
            cargarLista();
        };

        Alloy.createController('confirmar_envio', item);
    } else {
        crouton.alert('La hora seleccionada no esta disponible');
    }
}

function eventoFocoVentana() {
    actualizarInfoNavegacion();
}

require('ui').touchFeedbackNavigation($.anterior, $.siguiente);

$.anterior.setVisible(false);

$.ventanaReservas.addEventListener('focus', eventoFocoVentana);
$.siguiente.addEventListener('click', eventoClickSiguiente);
$.anterior.addEventListener('click', eventoClickAnterior);
$.controlLista.addEventListener('itemclick', eventoClickHora);

cargarLista();
