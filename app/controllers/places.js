var args = arguments[0] || {},
    search = Ti.UI.Android.createSearchView({
         hintText : 'Buscar'
    });

function createListItem(item) {
    var pic = 'http://placeimg.com/100/100/people/.jpg?_='+item.id;

    return {
        name: {text: item.name},
        description: {text: item.description},
        photo: {image: pic},
        properties: {
            width: Ti.UI.FILL,
            height: '96dip',
            backgroundColor: 'transparent',
            searchableText: item.name +' '+ item.description,
        }
    };
}

function processResponse(response) {
    var items = [];

    _.each(response, function(item) {
        items.push(createListItem(item));
    });

    $.section.appendItems(items);
}

function processError() {
}

 var xhr = Ti.Network.createHTTPClient({
    onload: function(e) {
        var json = JSON.parse(this.responseText);
        processResponse(json);
        json = null;
    },
    onerror: function(e) {
        Ti.API.debug(e.error);
        alert('error');
    },
    timeout: 5000
});

$.places.activity.onCreateOptionsMenu = function(e) {
    e.menu.add({
        title: 'Buscar lugar',
        icon: Ti.Android.R.drawable.ic_menu_search,
        actionView : search,
        showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
    });
};

search.addEventListener('change', function() {
    $.listView.setSearchText(search.value);
});

$.places.addEventListener('open', function(e) {
    $.places.activity.invalidateOptionsMenu();
});

$.places.open();

xhr.open('GET', Alloy.CFG.API_URL + '/places');
xhr.send();
