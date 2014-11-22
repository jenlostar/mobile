$.index.open();

if (!Ti.App.Properties.getBool('registrado', false)) {
    Alloy.createController('login');
    $.index.close();
} else {
    Alloy.createController('lugares');
    $.index.close();
}
