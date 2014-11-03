var args = arguments[0] || {},
    crouton = require('de.manumaticx.crouton');

function procesarRespuesta(data) {
    Ti.App.Properties.setBool('registrado', true);
    Ti.App.Properties.setString('access_token', data.access_token);
    $.ventanaEntrar.close();
}

$.ventanaEntrar.addEventListener('open', function(e) {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    abx.subtitle = 'Entrar';
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.ventanaEntrar.activity.invalidateOptionsMenu();
});

require('ui').touchFeedbackButton($.entrar, $.registrarse);
require('ui').touchFeedbackButton($.recuperarContrasena);

$.entrar.addEventListener('click', function() {
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
            crouton.confirm('Bievenido/a');
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
