$.index.open();

if (Ti.App.Properties.getBool('logueado', false)) {
    Alloy.createController('lugares');
} else {
    Alloy.createController('login');
}

$.index.close();
