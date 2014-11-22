var crouton = require('de.manumaticx.crouton'),
    API = require('http_client'),
    datosUsuario = Ti.App.Properties.getObject('user');


$.email.value = datosUsuario.email;
$.nombres.value = datosUsuario.first_name;
$.apellidos.value = datosUsuario.last_name;
$.telefono.value = datosUsuario.phone_number;

if (datosUsuario.gender == 'M') { // Masculino
    $.genero.setSelectedRow(0, 2);
} else if (datosUsuario.gender == 'F') { // Femenino
    $.genero.setSelectedRow(0, 1);
}

function atras() {
    $.ventanaUsuario.close();
}

function procesarRespuesta(data) {
    Ti.App.Properties.setBool('registrado', true);
    Ti.App.Properties.setString('access_token', data.access_token);
    Ti.App.Properties.setObject('user', data);

    Alloy.Globals.LO.hide();
    $.ventanaUsuario.close();
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

$.ventanaUsuario.addEventListener('android:back', atras);

require('ui').touchFeedbackButton($.enviar);

$.ventanaUsuario.addEventListener('open', function() {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    abx.subtitle = 'Perfil de usuario';
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.ventanaUsuario.activity.actionBar.displayHomeAsUp = true;
    $.ventanaUsuario.activity.actionBar.onHomeIconItemSelected = atras;
    $.ventanaUsuario.activity.invalidateOptionsMenu();
});

$.enviar.addEventListener('click', function() {
    Alloy.Globals.LO.show('Enviando...');
    var filaSeleccionada = $.genero.getSelectedRow(0);

    var data = {
        first_name: $.nombres.value,
        last_name: $.apellidos.value,
        phone_number: $.telefono.value,
        gender: filaSeleccionada.title[0],
        email: $.email.value
    };

    if (_.isEmpty($.clave.value)) {
        data.password = $.clave.value;
    }

    if (_.isEmpty($.confirmarClave.value)) {
        data.password_confirmation = $.confirmarClave.value;
    }

    var xhr = API.POST('/users/profile', procesarRespuesta, procesarError, true);
    xhr.send(JSON.stringify(data));
});

$.ventanaUsuario.open();
