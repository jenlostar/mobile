var crouton = require('de.manumaticx.crouton'),
    API = require('http_client');

function eventoAtras() {
    Alloy.createController('login');
    $.ventanaRegistro.close();
}

function procesarRespuesta(json) {
    Ti.App.Properties.setBool('logueado', true);
    Ti.App.Properties.setString('access_token', json.access_token);
    Ti.App.Properties.setObject('user', json);

    Alloy.Globals.LO.hide();
    Alloy.createController('lugares', {entrar: true});
    $.ventanaEntrar.close();
}

function procesarError(json) {
    if (json.errors) {
        var atributoError = Object.keys(json.errors)[0];
        var mensajeError = json.errors[atributoError][0];

        crouton.alert(L(atributoError)+': '+mensajeError);
    } else {
        crouton.alert('Algo salió mal, intenta nuevamente');
    }

    Alloy.Globals.LO.hide();
}

function eventoOpen() {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    abx.subtitle = 'Crear una cuenta';
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.ventanaRegistro.activity.actionBar.displayHomeAsUp = true;
    $.ventanaRegistro.activity.actionBar.onHomeIconItemSelected = eventoAtras;
    $.ventanaRegistro.activity.invalidateOptionsMenu();
}

function eventoClick() {
    Alloy.Globals.LO.show('Enviando...');
    var filaSeleccionada = $.genero.getSelectedRow(0);

    var data = {
        first_name: $.nombres.value,
        last_name: $.apellidos.value,
        phone_number: $.telefono.value,
        gender: filaSeleccionada.title[0],
        email: $.email.value,
        password: $.clave.value,
        password_confirmation: $.confirmarClave.value
    };

    var xhr = API.POST('/signup', procesarRespuesta, procesarError, false);
    xhr.send(JSON.stringify(data));
}

require('ui').touchFeedbackButton($.enviar);

$.ventanaRegistro.addEventListener('android:back', eventoAtras);
$.ventanaRegistro.addEventListener('open', eventoOpen);
$.enviar.addEventListener('click', eventoClick);

$.ventanaRegistro.open();
