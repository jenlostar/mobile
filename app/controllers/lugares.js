var parametros = arguments[0] || {},
    API = require('http_client'),
    crouton = require('de.manumaticx.crouton'),
    buscar = Ti.UI.Android.createSearchView({
        hintText : 'Buscar'
    });

function crearElementoLista(item) {
    return {
        data: item,
        nombre: {text: item.name},
        descripcion: {text: item.description},
        properties: {
            width: Ti.UI.FILL,
            height: Ti.UI.SIZE,
            backgroundColor: 'transparent',
            selectedBackgroundColor: '#FF6600',
            searchableText: item.name +' '+ item.description,
        }
    };
}

function procesarRespuesta(respuesta) {
    var lugares = [];

    _.each(respuesta, function(lugar) {
        if (lugar.schedules.length > 0) {
            lugares.push(crearElementoLista(lugar));
        }
    });

    $.seccion.setItems(lugares);
    Alloy.Globals.LO.hide();
}

function procesarError() {
    crouton.alert('Algo salió mal, intenta nuevamente');
    Alloy.Globals.LO.hide();
}

function cargarDatos() {
    Alloy.Globals.LO.show('Cargando...');
    var xhr = API.GET('/places', procesarRespuesta, procesarError, true);
    xhr.send();
}

function procesarLogout() {
    Ti.App.Properties.setBool('registrado', false);
    Ti.App.Properties.setString('access_token', null);
    Alloy.createController('login', {salir: true});

    Alloy.Globals.LO.hide();
    $.lugares.close();
}

function salir() {
    Alloy.Globals.LO.show('Cerrando sesión...');

    var xhr = API.POST('/logout', procesarLogout, procesarError, true);
    xhr.send();
}

$.lugares.activity.onCreateOptionsMenu = function(e) {
    e.menu.add({
        title: 'Buscar lugar',
        icon: Ti.Android.R.drawable.ic_menu_search,
        actionView: buscar,
        showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
    });

    e.menu.add({title: 'Actualizar'}).addEventListener('click', function() {
        cargarDatos();
    });

    e.menu.add({title: 'Mi Perfil'}).addEventListener('click', function() {
        Alloy.createController('perfil');
    });

    e.menu.add({title: 'Salir'}).addEventListener('click', function() {
        salir();
    });
};

buscar.addEventListener('change', function() {
    $.lista.setSearchText(buscar.value);
});

$.lugares.addEventListener('open', function() {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    $.lugares.activity.invalidateOptionsMenu();

    if (parametros.entrar && parametros.entrar === true) {
        crouton.confirm('Bievenido/a');
    }
});

$.lista.addEventListener('itemclick', function(e) {
    var item = e.section.getItemAt(e.itemIndex);
    Alloy.Globals.lugar = item.data;
    Alloy.createController('lugar', item.data);
});

$.lugares.open();
cargarDatos();
