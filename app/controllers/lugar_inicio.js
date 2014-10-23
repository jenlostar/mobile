var parametros = arguments[0] || {},
    barraCalificacion = require('titutorial.ratingbar');


barraCalificacion = barraCalificacion.createRatingBar({
     top: '30dp',
     left: 15,
     right: 15,
     rating: 2,
     stars: 5,
     stepSize: 1.5,
     isIndicator: false
});

$.detalle.add(barraCalificacion);
