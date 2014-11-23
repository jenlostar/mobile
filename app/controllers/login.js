var parametros = arguments[0] || {},
    API = require('http_client');

function procesarRespuesta(json) {
    Ti.App.Properties.setBool('logueado', true);
    Ti.App.Properties.setString('access_token', json.access_token);
    Ti.App.Properties.setObject('user', json);
    Alloy.Globals.Loader.hide();
    Alloy.createController('lugares', {entrar: true});
    $.ventanaLogin.close();
}

function procesarError() {
    Alloy.Globals.crouton.alert('Algo salió mal, intenta nuevamente');
    Alloy.Globals.Loader.hide();
}

function eventoOpen() {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    abx.subtitle = 'Entrar';
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.ventanaLogin.activity.invalidateOptionsMenu();

    if (parametros.salir && parametros.salir === true) {
        Alloy.Globals.crouton.info('La sesión ha finalizado');
    }
}

function eventoClickRegistro() {
    Alloy.createController('registro');
    $.ventanaLogin.close();
}

function eventoClickLogin() {
    Alloy.Globals.Loader.show('Enviando...');

    var data = {
        email: $.email.value,
        password: $.clave.value
    };

    var post = API.POST({
        endpoint: '/login',
        onSuccess: procesarRespuesta,
        onError: procesarError,
        authorization: false
    });

    post.send(JSON.stringify(data));
}

require('ui').touchFeedbackButton($.entrar, $.registrarse);
require('ui').touchFeedbackButton($.recuperarContrasena);

$.ventanaLogin.addEventListener('open', eventoOpen);
$.registrarse.addEventListener('click', eventoClickRegistro);
$.entrar.addEventListener('click', eventoClickLogin);

$.ventanaLogin.open();
