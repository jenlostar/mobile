function crearObjeto(onLoad, onError, autenticado) {
    var xhr = Ti.Network.createHTTPClient({
        onload: function() {
            if (onLoad) {
                var json = JSON.parse(this.responseText);
                onLoad(json);
                json = null;
            }
        },
        onerror: function() {
            if (onError) {
                var json = JSON.parse(this.responseText);
                onError(json);
                json = null
            }
        },
        timeout: 15000
    });

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

    if (autenticado) {
        var accessToken = Ti.App.Properties.getString('access_token');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        accessToken = null;
    }

    return xhr;
}

exports.POST = function(url, onLoad, onError, autenticado) {
    var xhr = crearObjeto(onLoad, onError, autenticado)
    xhr.open('POST', Alloy.CFG.API + url);
    return xhr;
};

exports.GET = function(url, onLoad, onError, autenticado) {
    var xhr = crearObjeto(onLoad, onError, autenticado)
    xhr.open('GET', Alloy.CFG.API + url);
    return xhr;
}
