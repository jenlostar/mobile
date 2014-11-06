var opciones = arguments[0] || {};

function clickCB() {}

function crearElementoListaServicio(servicio) {
    return {
        servicio: servicio,
        nombre: {text: servicio.name},
        valor: {text: servicio.min_amount+' - '+ servicio.max_amount},
        tiempoEstimado: {text: servicio.duration},
        itemCheck: {text: Alloy.Globals.icons['fa-check']},
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

    $.duracionTotal.text = duracionTotal.format('HH:mm');
    $.seccionLista.setItems(lista);
}

$.fechaReserva.text = opciones.fechaCompleta;

cargarLista();

$.dialogo.addEventListener('click', function(e) {
    Ti.API.info(e.cancel);
});

$.dialogo.show();
