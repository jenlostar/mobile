var parametros = arguments[0] || {};

var serviciosAgrupados = _.groupBy(Alloy.Globals.lugar.services, 'kind');

function crearElementoListaTipoServicio(nombre) {
    return {
        tipoServicio: {text: nombre},
        template: 'tipoServicio',
        properties: {
            width: Ti.UI.FILL,
            height: '25dip',
            backgroundColor: 'transparent',
            layout: 'composite'
        }
    };
}

function crearElementoListaServicio(servicio) {
    var moment = require('alloy/moment');

    return {
        nombre: {text: servicio.name},
        valor: {text: 'V. '+servicio.min_amount+' y '+ servicio.max_amount},
        tiempoEstimado: {text: 'T. '+servicio.duration},
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
    _.each(serviciosAgrupados, function(servicios, tipo) {
        lista.push(crearElementoListaTipoServicio(tipo));
        _.each(servicios, function(servicio) {
            lista.push(crearElementoListaServicio(servicio));
        });
    });
    $.seccionLista.setItems(lista);
}

cargarLista();
