// function doClick(e) {
//     alert($.label.text);
// }

// $.index.open();
// Alloy.createController('lugares');

if (!Ti.App.Properties.getBool('registrado', false)) {
    Alloy.createController('entrar');
}
