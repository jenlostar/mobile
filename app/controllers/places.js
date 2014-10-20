var args = arguments[0] || {},
    search = Ti.UI.Android.createSearchView({
         hintText : 'Buscar'
    });

function createListItem(item) {
    var pic = 'http://placeimg.com/100/100/people/.jpg?_='+item.id;

    return {
        data: item,
        name: {text: item.name},
        description: {text: item.description},
        address: {text: item.address},
        properties: {
            width: Ti.UI.FILL,
            height: '110dip',
            backgroundColor: 'transparent',
            selectedBackgroundColor: '#FF6600',
            searchableText: item.name +' '+ item.description,
        }
    };
}

function processResponse(response) {
    var places = [];

    _.each(response, function(place) {
        if (place.schedules.length > 0) {
            places.push(createListItem(place));
        }
    });

    $.section.setItems(places);
}

function processError() {
}


function loadData() {
    $.activityIndicator.show();
    var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
            var json = JSON.parse(this.responseText);
            processResponse(json);
            json = null;
            $.activityIndicator.hide();
            $.toast.hide();
        },
        onerror: function(e) {
            Ti.API.debug(e.error);
            alert('error');
            $.activityIndicator.hide();
        },
        timeout: 15000
    });

    xhr.open('GET', Alloy.CFG.API_URL + '/places');
    xhr.send();
}

$.places.activity.onCreateOptionsMenu = function(e) {
    e.menu.add({
        title: 'Buscar lugar',
        icon: Ti.Android.R.drawable.ic_menu_search,
        actionView : search,
        showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
    });

    e.menu.add({title: 'Actualizar'}).addEventListener('click', function(e) {
        loadData();
    });
};

search.addEventListener('change', function() {
    $.listView.setSearchText(search.value);
});

$.places.addEventListener('open', function(e) {
    var abx = require('com.alcoapps.actionbarextras');

    abx.title = 'Mi Peluquería';
    abx.titleFont = 'SourceSansPro-Black.ttf';
    abx.titleColor = '#FFCEAF';

    $.places.activity.invalidateOptionsMenu();
});

$.listView.addEventListener('itemclick', function(e) {
    var item = e.section.getItemAt(e.itemIndex);
    Alloy.Globals.lugar = item.data;
    Alloy.createController('place_info', item.data);
});

$.places.open();
$.toast.show();

loadData();
