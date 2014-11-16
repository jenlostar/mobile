var crouton = require('de.manumaticx.crouton');

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
    var fechaActual = new moment(fechaSeleccionada);
    Alloy.Globals.LO.show('Actualizando...');
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

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization', 'Bearer ' + Ti.App.Properties.getString('access_token'));
    xhr.open('GET', Alloy.CFG.API_URL+'/places/'+Alloy.Globals.lugar.id+'/bookings/'+fechaActual.format('YYYY-MM-DD'));
    xhr.send();
}

function procesarRespuesta(respuesta) {
    var horasDia = [];

    _.each(respuesta, function(hora) {
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
    if(item.disponible) {
        if(_.isEmpty(Alloy.Globals.servicios_seleccionados)) {
            crouton.alert('Debe seleccionar por lo menos un servicio para continuar con la reserva');
            return;
        }

        item.success = function(respuesta) {
            cargarLista();
        };

        Alloy.createController('confirmar_envio', item);
    } else {
        crouton.alert('La hora seleccionada no esta disponible');
    }
});
