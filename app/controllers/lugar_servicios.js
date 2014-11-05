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
    return {
        servicio: servicio,
        nombre: {text: servicio.name},
        valor: {text: servicio.min_amount+' - '+ servicio.max_amount},
        tiempoEstimado: {text: servicio.duration},
        itemCheck: {text: Alloy.Globals.icons['fa-check'], visible: false},
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

$.controlLista.addEventListener('itemclick', function(e) {
    var item = e.section.getItemAt(e.itemIndex);

    if (item.itemCheck) {
        item.itemChecked = !item.itemChecked;
        item.itemCheck.visible = item.itemChecked;

        if (item.itemChecked) {
            Alloy.Globals.servicios_seleccionados[item.servicio.id] = item.servicio;
        } else {
            delete Alloy.Globals.servicios_seleccionados[item.servicio.id];
        }

        e.section.updateItemAt(e.itemIndex, item);
    }
});

cargarLista();
