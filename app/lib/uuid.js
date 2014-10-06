// http://guid.us/GUID/JavaScript

function S4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

exports.next = function() {
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};
