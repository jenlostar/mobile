var args = arguments[0] || {},
    ratingbar = require('titutorial.ratingbar');


var ratingBar = ratingbar.createRatingBar({
     top: '30dp',
     left: 15,
     right: 15,
     rating: 2,
     stars: 5,
     stepSize: 1.5,
     isIndicator: false
});

$.detalle.add(ratingBar);
