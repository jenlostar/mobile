var place = arguments[0] || {};

// Ti.API.info('Place:', JSON.stringify(place));

function close() {
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

$.home.image1.image = 'http://fpoimg.com/420x340?text=MiPeluqueria1';
$.home.image2.image = 'http://fpoimg.com/420x340?text=MiPeluqueria2';
$.home.image3.image = 'http://fpoimg.com/420x340?text=MiPeluqueria3';

$.home.placeName.text = place.name;
$.home.placeDescription.text = place.description;
$.home.placeAddress.text = place.address;
$.home.placePhone.text = place.land_line+' - '+place.mobile_phone;

$.place_info.addEventListener('android:back', close);

$.place_info.open({animated: false});

