var parametros = arguments[0] || {},

    fechaActual = new Date(),
    anioActual = fechaActual.getFullYear(),
    mesActual = fechaActual.getMonth(),
    diaActual = fechaActual.getDate(),

    fechaMinima = new Date(anioActual, mesActual, diaActual + 1),
    fechaMaxima = new Date(anioActual, mesActual, diaActual + 15),

    calendario = Ti.UI.createPicker({
        type: Ti.UI.PICKER_TYPE_DATE,
        minDate: fechaMinima,
        maxDate: fechaMaxima,
        value: fechaMinima
    }),

    fechaSeleccionada = fechaMinima;

$.ventanaReservas.addEventListener('focus', function() {
    calendario.showDatePickerDialog({
        title: 'Seleccione un día',
        okButtonTitle: 'Continuar',
        callback: function(e) {
            cargarLista();
        }
    });
});

function cargarLista() {

    var horasDia = [],
        moment = require('alloy/moment'),
        horaInicial = new moment(fechaSeleccionada).add(7, 'hours'),
        horaFinal = new moment(fechaSeleccionada).add(23, 'hours');

    Ti.API.info(JSON.stringify(horaInicial));

    while (horaInicial.diff(horaFinal) <= 0) {
        horasDia.push({
            hora: {text: horaInicial.format('hh:mm A')},
            estado: {text: 'Disponible'},
            properties: {
                width: Ti.UI.FILL,
                height: '70dip',
                backgroundColor: 'transparent',
                layout: 'horizontal'
            }
        });

        horaInicial.add(30, 'minutes');
    }

    $.seccionLista.setItems(horasDia);
}

$.controlLista.addEventListener('itemclick', function() {

});
