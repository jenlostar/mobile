var parametros = arguments[0] || {},
    crouton = require('de.manumaticx.crouton'),
    API = require('http_client');

function procesarRespuesta(json) {
    Ti.App.Properties.setBool('registrado', true);
    Ti.App.Properties.setString('access_token', json.access_token);
    Ti.App.Properties.setObject('user', json);
    Alloy.Globals.LO.hide();
    Alloy.createController('lugares', {entrar: true});
    $.ventanaEntrar.close();
}

function procesarError() {
    crouton.alert('Algo salió mal, intenta nuevamente');
    Alloy.Globals.LO.hide();
}

$.ventanaEntrar.addEventListener('open', function() {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    abx.subtitle = 'Entrar';
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.ventanaEntrar.activity.invalidateOptionsMenu();

    if (parametros.salir && parametros.salir === true) {
        crouton.info('La sesión ha finalizado');
    }
});

require('ui').touchFeedbackButton($.enviar, $.registrarse);
require('ui').touchFeedbackButton($.recuperarContrasena);

$.registrarse.addEventListener('click', function() {
    Alloy.createController('registrar');
    $.ventanaEntrar.close();
});

$.enviar.addEventListener('click', function() {
    Alloy.Globals.LO.show('Enviando...');

    var data = {
        email: $.email.value,
        password: $.clave.value
    };

    var xhr = API.POST('/login', procesarRespuesta, procesarError, false);
    xhr.send(JSON.stringify(data));
});

$.ventanaEntrar.open();
