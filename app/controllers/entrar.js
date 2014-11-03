var args = arguments[0] || {};

$.ventanaEntrar.addEventListener('open', function(e) {
    var abx = require('com.alcoapps.actionbarextras');

    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    abx.subtitle = 'Entrar';
    abx.subtitleFont = 'SourceSansPro-Semibold.ttf';
    abx.subtitleColor = '#FFCEAF';

    $.ventanaEntrar.activity.invalidateOptionsMenu();
});

require('ui').touchFeedbackButton($.entrar, $.registrarse);
require('ui').touchFeedbackButton($.recuperarContrasena);

$.ventanaEntrar.open();
