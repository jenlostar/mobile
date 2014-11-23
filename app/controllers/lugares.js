var parametros = arguments[0] || {},
    API = require('http_client'),
    buscar = Ti.UI.Android.createSearchView({hintText : 'Buscar'});

function procesarRespuesta(jsonArray) {
    var lugares = [];

    _.each(jsonArray, function(lugar) {
        var item = {
            data: lugar,
            nombre: {text: lugar.name},
            descripcion: {text: lugar.description},
            properties: {
                width: Ti.UI.FILL,
                height: Ti.UI.SIZE,
                backgroundColor: 'transparent',
                searchableText: lugar.name +' '+ lugar.description,
            }
        };

        lugares.push(item);
    });

    $.seccion.setItems(lugares);
    Alloy.Globals.Loader.hide();
}

function procesarError() {
    Alloy.Globals.crouton.alert('Algo salió mal, intenta nuevamente');
    Alloy.Globals.Loader.hide();
}

function cargarLugares() {
    Alloy.Globals.Loader.show('Cargando...');

    var xhr = API.GET({
        endpoint: '/places',
        onSuccess: procesarRespuesta,
        onError: procesarError
    });

    xhr.send();
}

function procesarLogout() {
    Ti.App.Properties.setBool('logueado', false);
    Ti.App.Properties.setString('access_token', null);
    Alloy.createController('login', {salir: true});

    Alloy.Globals.Loader.hide();
    $.lugares.close();
}

function eventoCerrarSesion() {
    Alloy.Globals.Loader.show('Cerrando sesión...');

    var xhr = API.POST({
        endpoint: '/logout',
        onSuccess: procesarLogout,
        onError: procesarError
    });

    xhr.send();
}

function eventoAbrirPerfil() {
    Alloy.createController('perfil');
}

function eventoActualizarLugares() {
    cargarLugares();
}

function crearMenu(e) {
    e.menu.add({
        title: 'Buscar lugar',
        icon: Ti.Android.R.drawable.ic_menu_search,
        actionView: buscar,
        showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
    });

    e.menu.add({title: 'Actualizar'}).addEventListener('click', eventoActualizarLugares);
    e.menu.add({title: 'Mi Perfil'}).addEventListener('click', eventoAbrirPerfil);
    e.menu.add({title: 'Salir'}).addEventListener('click', eventoCerrarSesion);
}

function eventoOpen() {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    $.lugares.activity.invalidateOptionsMenu();

    if (parametros.entrar && parametros.entrar === true) {
        Alloy.Globals.crouton.confirm('Bievenido/a');
    }
}

function eventoClick(e) {
    var item = e.section.getItemAt(e.itemIndex);
    Alloy.Globals.lugar = item.data;
    Alloy.createController('lugar', item.data);
}

function eventoBuscar() {
    $.lista.setSearchText(buscar.value);
}

$.lugares.activity.onCreateOptionsMenu = crearMenu;

buscar.addEventListener('change', eventoBuscar);
$.lugares.addEventListener('open', eventoOpen);
$.lista.addEventListener('itemclick', eventoClick);

$.lugares.open();

cargarLugares();
