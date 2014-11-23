var parametros = arguments[0] || {},
    API = require('http_client'),
    crouton = require('de.manumaticx.crouton'),
    buscar = Ti.UI.Android.createSearchView({hintText : 'Buscar'});

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

function procesarRespuesta(json) {
    var lugares = [];

    _.each(json, function(lugar) {
        lugares.push(crearElementoLista(lugar));
    });

    $.seccion.setItems(lugares);
    Alloy.Globals.LO.hide();
}

function procesarError() {
    crouton.alert('Algo salió mal, intenta nuevamente');
    Alloy.Globals.LO.hide();
}

function cargarLugares() {
    Alloy.Globals.LO.show('Cargando...');

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

    Alloy.Globals.LO.hide();
    $.lugares.close();
}

function eventoCerrarSesion() {
    Alloy.Globals.LO.show('Cerrando sesión...');

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
        crouton.confirm('Bievenido/a');
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
