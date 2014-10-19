var place = arguments[0] || {};

function cerrar() {
    $.place_info.close({animated: false});
    $.place_info = null;
}

$.place_info.addEventListener('open', function(e) {
    var abx = require('com.alcoapps.actionbarextras');

    abx.title = 'Mi Peluquería';
    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    $.place_info.activity.invalidateOptionsMenu();
});

$.inicio.imagen1.image = 'http://fpoimg.com/420x340?text=MiPeluqueria1';
$.inicio.imagen2.image = 'http://fpoimg.com/420x340?text=MiPeluqueria2';
$.inicio.imagen3.image = 'http://fpoimg.com/420x340?text=MiPeluqueria3';

$.inicio.nombreLugar.text = place.name;
$.inicio.descripcionLugar.text = place.description;
$.inicio.direccionLugar.text = place.address;
$.inicio.telefonoLugar.text = place.land_line+' - '+place.mobile_phone;

$.place_info.addEventListener('android:back', cerrar);

$.place_info.open({animated: false});

