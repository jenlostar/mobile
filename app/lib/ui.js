exports.touchFeedbackNavigation = function() {

    var touchStartEvent = function (evt) {
        evt.source.setBackgroundColor('#FF6600');
    };

    var buildTouchEnd = function(_originalColor){
        return function(evt) {
            evt.source.setBackgroundColor(_originalColor);
        };
    };

    var Events = require('events');

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i],
            originalColor = source.getBackgroundColor() || 'transparent';

        Events.registerEventListener(source, 'touchstart', touchStartEvent);
        Events.registerEventListener(source, 'touchend', buildTouchEnd(originalColor));
        Events.registerEventListener(source, 'touchcancel', buildTouchEnd(originalColor));
    }
};

exports.touchFeedbackButton = function() {

    var touchStartEvent = function (evt) {
        evt.source.setBackgroundColor('#CCCCCC');
    };

    var buildTouchEnd = function(_originalColor){
        return function(evt) {
            evt.source.setBackgroundColor(_originalColor);
        };
    };

    var Events = require('events');

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i],
            originalColor = source.getBackgroundColor() || 'transparent';

        Events.registerEventListener(source, 'touchstart', touchStartEvent);
        Events.registerEventListener(source, 'touchend', buildTouchEnd(originalColor));
        Events.registerEventListener(source, 'touchcancel', buildTouchEnd(originalColor));
    }
};

exports.touchFeedbackLabel = function() {

    var touchStartEvent = function (evt) {
        evt.source.setColor('#FF6600');
    };

    var buildTouchEnd = function(_originalColor){
        return function(evt) {
            evt.source.setColor(_originalColor);
        };
    };

    var Events = require('events');

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i],
            originalColor = source.getColor() || 'transparent';

        Events.registerEventListener(source, 'touchstart', touchStartEvent);
        Events.registerEventListener(source, 'touchend', buildTouchEnd(originalColor));
        Events.registerEventListener(source, 'touchcancel', buildTouchEnd(originalColor));
    }
};
