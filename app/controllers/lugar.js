var lugar = arguments[0] || {};

function cerrar() {
    $.lugar.close({animated: false});
    $.lugar = null;
}

$.lugar.addEventListener('open', function() {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    $.lugar.activity.invalidateOptionsMenu();
});

$.inicio.imagen1.image = lugar.photos[0];
$.inicio.imagen2.image = lugar.photos[1];
$.inicio.imagen3.image = lugar.photos[2];

$.inicio.nombreLugar.text = lugar.name;
$.inicio.descripcionLugar.text = lugar.description;
$.inicio.direccionLugar.text = lugar.address;
$.inicio.telefonoLugar.text = lugar.land_line;

if (lugar.mobile_phone) {
    $.inicio.telefonoLugar.text += ' - '+lugar.mobile_phone;
}

$.lugar.addEventListener('android:back', cerrar);

$.lugar.open({animated: false});
