var parametros = arguments[0] || {};

var moment = require('alloy/moment');
moment().lang('es');

var fechaActual = new Date();
var anioActual = fechaActual.getFullYear();
var mesActual = fechaActual.getMonth();
var diaActual = fechaActual.getDate();
var fechaMinima = new Date(anioActual, mesActual, diaActual + 1, 7, 0, 0);
var fechaMaxima = new Date(anioActual, mesActual, diaActual + 15, 7, 0, 0);

var fechaSeleccionada = fechaMinima;

var servicios = _.groupBy(Alloy.Globals.lugar.services, 'kind');
var tiposServicio = _.map(_.keys(servicios), function(servicio) {
    return servicio;
});

var dialogoAbierto = false;
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

function dialogoTiposServicio(e) {
    if (dialogoAbierto === true || (e.bindId && e.bindId == 'hora')) { return; }
    dialogoAbierto = true;

    horaSeleccionada = e.section.getItemAt(e.itemIndex).fecha;

    var ventanaDialogo = Ti.UI.createOptionDialog({
        persistent: true,
        cancel: -1,
        title: 'Tipo de servicio',
        options: tiposServicio,
        buttonNames: ['Cancelar']
    });

    ventanaDialogo.addEventListener('click', dialogoServicios);
    ventanaDialogo.show();
}

function dialogoServicios(e) {
    if (e.cancel === true) {
        dialogoAbierto = false;
        return;
    }
    var tipoServicio = tiposServicio[e.index];

    var serviciosPorTipo = _.where(Alloy.Globals.lugar.services, {
        kind: tipoServicio
    });

    var Dialogs = require('yy.tidialogs');

    var listadoServicios = Dialogs.createMultiPicker({
        title: 'Servicios para ' + tipoServicio,
        options: _.map(serviciosPorTipo, function(servicio) {
            return servicio.name;
        }),
        okButtonTitle: 'Continuar',
        cancelButtonTitle : 'Cancelar'
    });

    listadoServicios.addEventListener('click',function(e) {
        var indexes = e.indexes;
        var serviciosSeleccionados = [];

        _.each(serviciosPorTipo, function(servicio, index) {
            if (_.indexOf(indexes, index) >= 0) {
                serviciosSeleccionados.push(servicio);
            }
        });

        dialogoAbierto = false;

        enviarReserva(_.map(serviciosSeleccionados, function(servicio) {
            return servicio.id;
        }));
    });

    listadoServicios.addEventListener('cancel', function() {
        Ti.API.info('dialog was cancelled');
        dialogoAbierto = false;
    });

    listadoServicios.show();
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

$.controlLista.addEventListener('itemclick', dialogoTiposServicio);
