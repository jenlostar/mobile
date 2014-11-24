var API = require('http_client'),
    lugar = Alloy.Globals.lugar;

var moment = require('alloy/moment');
require('alloy/moment/lang/es');

var fechaActual = new Date();
var anio        = fechaActual.getFullYear();
var mes         = fechaActual.getMonth();
var dia         = fechaActual.getDate();
var fechaMinima = new Date(anio, mes, dia + 1, 7, 0, 0);
var fechaMaxima = new Date(anio, mes, dia + 7, 7, 0, 0);

var fechaSeleccionada = fechaMinima;

function textoEstado(disponible) {
    return disponible ? 'Disponible' : 'Ocupado';
}

function colorEstado(disponible) {
    return disponible ? '#555555' : '#CCCCCC';
}

function procesarRespuesta(jsonArray) {
    var listItems = [];

    _.each(jsonArray, function(hora) {
        var item = {
            fecha: hora.date,
            fechaCompleta: hora.date_extended,
            hora: {text: hora.hour_with_meridian},
            estado: {text: textoEstado(hora.available), color: colorEstado(hora.available)},
            disponible: hora.available,
            properties: {
                width: Ti.UI.FILL,
                height: '70dip',
                backgroundColor: 'transparent',
                layout: 'horizontal'
            }
        };

        listItems.push(item);
    });

    $.seccionLista.setItems(listItems);

    Alloy.Globals.Loader.hide();
}

function procesarError() {
    Alloy.Globals.crouton.alert('Algo salió mal, intenta nuevamente');
    Alloy.Globals.Loader.hide();
}

function cargarLista() {
    Alloy.Globals.Loader.show('Actualizando...');

    var fecha = new moment(fechaSeleccionada);

    var xhr = API.GET({
        endpoint: '/places/' + lugar.id + '/bookings/' + fecha.format('YYYY-MM-DD'),
        onSuccess: procesarRespuesta,
        onError: procesarError
    });

    xhr.send();
}

function actualizarInfoNavegacion() {
    var abx = require('com.alcoapps.actionbarextras'),
        fecha = new moment(fechaSeleccionada);

    abx.subtitle = fecha.format('dddd DD MMMM');
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.diaActualNavegacion.text = fecha.format('dddd DD MMMM');

    if (fecha.isAfter(fechaMinima)) {
        $.anterior.setVisible(true);
    } else {
        $.anterior.setVisible(false);
    }

    if (fecha.isBefore(fechaMaxima)) {
        $.siguiente.setVisible(true);
    } else {
        $.siguiente.setVisible(false);
    }
}

function eventoClickAnterior() {
    var diaAnterior = new moment(fechaSeleccionada).startOf('day').subtract(1, 'day');
    fechaSeleccionada = diaAnterior.toDate();
    actualizarInfoNavegacion();
    cargarLista();
}

function eventoClickSiguiente() {
    var diaSiguiente = new moment(fechaSeleccionada).startOf('day').add(1, 'day');
    fechaSeleccionada = diaSiguiente.toDate();
    actualizarInfoNavegacion();
    cargarLista();
}

function eventoClickHora(e) {
    var item = e.section.getItemAt(e.itemIndex);
    if(item.disponible) {
        if(_.isEmpty(Alloy.Globals.servicios_seleccionados)) {
            Alloy.Globals.crouton.alert('Debe seleccionar por lo menos un servicio para continuar con la reserva');
            return;
        }

        item.success = function() {
            cargarLista();
        };

        Alloy.createController('confirmar_envio', item);
    } else {
        Alloy.Globals.crouton.alert('La hora seleccionada no esta disponible');
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
