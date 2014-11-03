var lugar = arguments[0] || {};

function cerrar() {
    $.lugar_info.close({animated: false});
    $.lugar_info = null;
}

$.lugar_info.addEventListener('open', function(e) {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    $.lugar_info.activity.invalidateOptionsMenu();
});

$.inicio.imagen1.image = 'http://fpoimg.com/420x340?text=MiPeluqueria1';
$.inicio.imagen2.image = 'http://fpoimg.com/420x340?text=MiPeluqueria2';
$.inicio.imagen3.image = 'http://fpoimg.com/420x340?text=MiPeluqueria3';

$.inicio.nombreLugar.text = lugar.name;
$.inicio.descripcionLugar.text = lugar.description;
$.inicio.direccionLugar.text = lugar.address;
$.inicio.telefonoLugar.text = lugar.land_line;

if (lugar.mobile_phone) {
    $.inicio.telefonoLugar.text += ' - '+lugar.mobile_phone;
}

$.lugar_info.addEventListener('android:back', cerrar);

$.lugar_info.open({animated: false});

