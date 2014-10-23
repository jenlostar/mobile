var parametros = arguments[0] || {},
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
    $.indicadorActividad.show();
    var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
            var json = JSON.parse(this.responseText);
            procesarRespuesta(json);
            json = null;
            $.indicadorActividad.hide();
            $.toast.hide();
        },
        onerror: function(e) {
            Ti.API.debug(e.error);
            alert('error');
            $.indicadorActividad.hide();
        },
        timeout: 15000
    });

    xhr.open('GET', Alloy.CFG.API_URL + '/places');
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
};

buscar.addEventListener('change', function() {
    $.lista.setSearchText(buscar.value);
});

$.lugares.addEventListener('open', function(e) {
    var abx = require('com.alcoapps.actionbarextras');

    abx.title = 'Mi Peluquería';
    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    $.lugares.activity.invalidateOptionsMenu();
});

$.lista.addEventListener('itemclick', function(e) {
    var item = e.section.getItemAt(e.itemIndex);
    Alloy.Globals.lugar = item.data;
    Alloy.createController('lugar_info', item.data);
});

$.lugares.open();
$.toast.show();

cargarDatos();
