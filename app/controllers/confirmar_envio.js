var reserva = arguments[0] || {},
    API = require('http_client'),
    usuario = Ti.App.Properties.getObject('user'),
    lugar = Alloy.Globals.lugar;


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

function procesarRespuesta(json) {
    Alloy.Globals.Loader.hide();
    atras();

    if (reserva.success) {
        reserva.success(json);
    }

    Alloy.Globals.servicios_seleccionados = {};
    Alloy.Globals.crouton.info('Se ha creado una nueva solicitud de reserva, en un momento recibira una confirmación via correo electrónico');
}

function procesarError() {
    Alloy.Globals.Loader.hide();
    Alloy.Globals.crouton.alert('Algo salió mal, intenta nuevamente');
}

function enviarReserva(servicios, horaSeleccionada) {
    var data = {
        user_id: usuario.id,
        place_id: lugar.id,
        date: horaSeleccionada,
        services: servicios
    };

    var xhr = API.POST({
        endpoint: '/bookings',
        onSuccess: procesarRespuesta,
        onError: procesarError
    });

    xhr.send(JSON.stringify(data));
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
    Alloy.Globals.Loader.show('Enviando...');

    var servicios_id = _.keys(Alloy.Globals.servicios_seleccionados);
    enviarReserva(servicios_id, reserva.fecha);
});

$.ventanaConfirmar.open();
