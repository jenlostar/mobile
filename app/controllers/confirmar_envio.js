var reserva = arguments[0] || {},
    crouton = require('de.manumaticx.crouton');


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

function crearElementoListaServicio(servicio, index, total) {
    return {
        servicio: servicio,
        nombre: {text: servicio.name},
        valor: {text: servicio.min_amount+' - '+ servicio.max_amount},
        tiempoEstimado: {text: servicio.duration},
        itemCheck: {text: Alloy.Globals.icons.fa_check},
        properties: {
            width: Ti.UI.FILL,
            height: '60dip',
            bottom: index == total ? '60dip' : '0dip',
            top: index == 1 ? '96dip' : '0dip',
            backgroundColor: 'transparent',
            layout: 'composite'
        }
    };
}

function enviarReserva(servicios, horaSeleccionada) {

    var xhr = Ti.Network.createHTTPClient({
        onload: function(respuesta) {
            Alloy.Globals.LO.hide();
            atras();

            if (reserva.success) {
                reserva.success(respuesta);
            }

            Alloy.Globals.servicios_seleccionados = {};

            crouton.info('Se ha creado una nueva solicitud de reserva, en un momento recibira una confirmación via correo electrónico');
        },
        onerror: function() {
            Alloy.Globals.LO.hide();
            crouton.alert('Algo salió mal, intenta nuevamente');
        },
        timeout: 15000
    });

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization', 'Bearer ' + Ti.App.Properties.getString('access_token'));
    xhr.open('POST', Alloy.CFG.API_URL + '/bookings');

    var datosReserva = {
        user_id: Ti.App.Properties.getObject('user').id,
        place_id: Alloy.Globals.lugar.id,
        date: horaSeleccionada,
        services: servicios
    };

    xhr.send(JSON.stringify(datosReserva));
}

function cargarLista() {
    var lista = [],
        servicios = _.values(Alloy.Globals.servicios_seleccionados),
        totalServicios = servicios.length,
        moment = require('alloy/moment');

    // http://www.unixtimestamp.com/index.php
    var duracionTotal = moment.unix(946684800).utc(); // 01/01/2000 00:00:00 AM UTC

    _.each(servicios, function(servicio, index) {
        lista.push(crearElementoListaServicio(servicio, (index+1), totalServicios));

        var duracionServicio = moment.unix(servicio.duration_timestamp).utc();
        duracionTotal.add(duracionServicio);
    });

    $.duracionTotal.text = formatoDuracionTotal(duracionTotal);
    $.seccionLista.setItems(lista);
}

$.fechaReserva.text = reserva.fechaCompleta.toUpperCase();

$.ventanaConfirmar.addEventListener('android:back', atras);

cargarLista();

$.ventanaConfirmar.addEventListener('open', function() {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    abx.subtitle = 'Confirmar solicitud de reserva';
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.ventanaConfirmar.activity.invalidateOptionsMenu();
});

$.enviar.addEventListener('click', function() {
    Alloy.Globals.LO.show('Enviando...');

    var servicios_id = _.keys(Alloy.Globals.servicios_seleccionados);
    enviarReserva(servicios_id, reserva.fecha);
});

$.ventanaConfirmar.open();
