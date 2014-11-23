function crearObjeto(options) {
    options = _.extend(options, {authorization: true});

    var xhr = Ti.Network.createHTTPClient({
        onload: function() {
            if (options.onSuccess) {
                var json = JSON.parse(this.responseText);
                options.onSuccess(json);
                json = null;
            }
        },
        onerror: function() {
            if (options.onError) {
                var json = JSON.parse(this.responseText);
                options.onError(json);
                json = null;
            }
        },
        timeout: 15000
    });

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

    if (options.authorization) {
        var accessToken = Ti.App.Properties.getString('access_token');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        accessToken = null;
    }

    return xhr;
}

function crearPeticion(metodo, options) {
    var xhr = crearObjeto(options);
    xhr.open(metodo, Alloy.CFG.API + options.endpoint);
    return xhr;
}

exports.POST = function(options) {
    return crearPeticion('POST', options);
};

exports.GET = function(options) {
    return crearPeticion('GET', options);
};
