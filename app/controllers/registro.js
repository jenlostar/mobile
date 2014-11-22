var crouton = require('de.manumaticx.crouton'),
    API = require('http_client');

function atras() {
    Alloy.createController('entrar');
    $.ventanaRegistrar.close();
}

function procesarRespuesta(json) {
    Ti.App.Properties.setBool('registrado', true);
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

$.ventanaRegistrar.addEventListener('android:back', atras);

require('ui').touchFeedbackButton($.enviar);

$.ventanaRegistrar.addEventListener('open', function() {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    abx.subtitle = 'Crear una cuenta';
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.ventanaRegistrar.activity.actionBar.displayHomeAsUp = true;
    $.ventanaRegistrar.activity.actionBar.onHomeIconItemSelected = atras;
    $.ventanaRegistrar.activity.invalidateOptionsMenu();
});

$.enviar.addEventListener('click', function() {
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
});

$.ventanaRegistrar.open();
