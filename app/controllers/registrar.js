var args = arguments[0] || {},
    crouton = require('de.manumaticx.crouton'),
    genero = 'F';

function atras() {
    Alloy.createController('entrar');
    $.ventanaRegistrar.close();
}

function procesarRespuesta(data) {
    Ti.App.Properties.setBool('registrado', true);
    Ti.App.Properties.setString('access_token', data.access_token);
}

$.ventanaRegistrar.addEventListener('android:back', atras);

require('ui').touchFeedbackButton($.enviar);

$.ventanaRegistrar.addEventListener('open', function(e) {
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

$.genero.addEventListener('change', function(e) {

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
            var response = JSON.parse(this.responseText);

            Ti.API.info(JSON.stringify(response));

            if (response.errors) {
                var atributoError = Object.keys(response.errors)[0];
                var mensajeError = response.errors[atributoError][0];

                crouton.alert(L(atributoError)+': '+mensajeError);
            } else {
                crouton.alert('Algo salió mal, intenta nuevamente');
            }

            Alloy.Globals.LO.hide();
        },
        timeout: 15000
    });

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.open('POST', Alloy.CFG.API_URL + '/signup');
    xhr.send(JSON.stringify(data));
});



$.ventanaRegistrar.open();
