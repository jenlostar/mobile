$.index.open();

if (!Ti.App.Properties.getBool('registrado', false)) {
    Alloy.createController('entrar');
    $.index.close();
} else {
    Alloy.createController('lugares');
    $.index.close();
}
