var parametros = arguments[0] || {},
    crouton = require('de.manumaticx.crouton'),
    buscar = Ti.UI.Android.createSearchView({
        hintText : 'Buscar'
    });

function crearElementoLista(item) {
    var pic = 'http://placeimg.com/100/100/people/.jpg?_='+item.id;

    return {
        data: item,
        nombre: {text: item.name},
        descripcion: {text: item.description},
        direccion: {text: item.address},
        properties: {
            width: Ti.UI.FILL,
            height: '110dip',
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
}

function procesarError() {
}


function cargarDatos() {
    Alloy.Globals.LO.show('Cargando...');
    var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
            var json = JSON.parse(this.responseText);
            procesarRespuesta(json);
            json = null;
            Alloy.Globals.LO.hide();
        },
        onerror: function(e) {
            crouton.alert('Algo salió mal, intenta nuevamente');
            Alloy.Globals.LO.hide();
        },
        timeout: 15000
    });

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization', 'Bearer ' + Ti.App.Properties.getString('access_token'));
    xhr.open('GET', Alloy.CFG.API_URL + '/places');
    xhr.send();
}

function salir() {
    Alloy.Globals.LO.show('Cerrando sesión...');

    var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
            Ti.App.Properties.setBool('registrado', false);
            Ti.App.Properties.setString('access_token', null);
            Alloy.createController('entrar', {salir: true});
            $.lugares.close();
        },
        onerror: function(e) {
            crouton.alert('Algo salió mal, intenta nuevamente');
            Alloy.Globals.LO.hide();
        },
        timeout: 15000
    });

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Authorization', 'Bearer ' + Ti.App.Properties.getString('access_token'));
    xhr.open('POST', Alloy.CFG.API_URL + '/logout');
    xhr.send();
}

$.lugares.activity.onCreateOptionsMenu = function(e) {
    e.menu.add({
        title: 'Buscar lugar',
        icon: Ti.Android.R.drawable.ic_menu_search,
        actionView : buscar,
        showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
    });

    e.menu.add({title: 'Actualizar'}).addEventListener('click', function(e) {
        cargarDatos();
    });

    e.menu.add({title: 'Salir'}).addEventListener('click', function(e) {
        salir();
    });
};

buscar.addEventListener('change', function() {
    $.lista.setSearchText(buscar.value);
});

$.lugares.addEventListener('open', function(e) {
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
    Alloy.createController('lugar_info', item.data);
});

$.lugares.open();
cargarDatos();
