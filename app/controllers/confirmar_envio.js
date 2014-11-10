var opciones = arguments[0] || {};

function clickCB() {}

function atras() {
    $.ventanaConfirmar.close();
}

function formatoDuracionTotal(duracion) {
    var horas = Number(duracion.format('H'));
    var minutos = Number(duracion.format('m'));
    var duracionLetras = [];

    if (horas > 0) {
        duracionLetras.push(horas + ' horas');
        if (minutos > 0) {
            duracionLetras.push(' y ');
        }
    }

    if (minutos > 0) {
        duracionLetras.push(minutos + ' minutos');
    }

    return duracionLetras.join('');
}

function crearElementoListaServicio(servicio) {
    return {
        servicio: servicio,
        nombre: {text: servicio.name},
        valor: {text: servicio.min_amount+' - '+ servicio.max_amount},
        tiempoEstimado: {text: servicio.duration},
        itemCheck: {text: Alloy.Globals.icons.fa_check},
        properties: {
            width: Ti.UI.FILL,
            height: '60dip',
            backgroundColor: 'transparent',
            layout: 'composite'
        }
    };
}

function cargarLista() {
    var lista = [];
    var servicios = _.values(Alloy.Globals.servicios_seleccionados);
    var moment = require('alloy/moment');

    // http://www.unixtimestamp.com/index.php
    var duracionTotal = moment.unix(946684800).utc(); // 01/01/2000 00:00:00 AM UTC

    _.each(servicios, function(servicio) {
        lista.push(crearElementoListaServicio(servicio));

        var duracionServicio = moment.unix(servicio.duration_timestamp).utc();
        duracionTotal.add(duracionServicio);
    });

    $.duracionTotal.text = formatoDuracionTotal(duracionTotal);
    $.seccionLista.setItems(lista);
}

$.fechaReserva.text = opciones.fechaCompleta.toUpperCase();

$.ventanaConfirmar.addEventListener('android:back', atras);

cargarLista();

$.ventanaConfirmar.addEventListener('open', function(e) {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    abx.subtitle = 'Confirmar solicitud de reserva';
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.ventanaConfirmar.activity.invalidateOptionsMenu();
});


$.ventanaConfirmar.open();
