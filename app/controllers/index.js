if (!Ti.App.Properties.getBool('registrado', false)) {
    Alloy.createController('entrar');
} else {
    Alloy.createController('lugares');
}
