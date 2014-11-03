var parametros = arguments[0] || {},
    crouton = require('de.manumaticx.crouton');

function procesarRespuesta(data) {
    Ti.App.Properties.setBool('registrado', true);
    Ti.App.Properties.setString('access_token', data.access_token);
}

$.ventanaEntrar.addEventListener('open', function(e) {
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

    var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
            var json = JSON.parse(this.responseText);
            procesarRespuesta(json);
            json = null;
            Alloy.Globals.LO.hide();
            Alloy.createController('lugares', {entrar: true});
            $.ventanaEntrar.close();
        },
        onerror: function(e) {
            crouton.alert('Algo salió mal, intenta nuevamente');
            Alloy.Globals.LO.hide();
        },
        timeout: 15000
    });

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.open('POST', Alloy.CFG.API_URL + '/login');
    xhr.send(JSON.stringify(data));
});

$.ventanaEntrar.open();
