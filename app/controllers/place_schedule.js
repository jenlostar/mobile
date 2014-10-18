var args = arguments[0] || {},
    moment = require('alloy/moment'),
    now = new moment();

function createListItem(schedule) {

    return {
        dayNumber: {text: schedule.day},
        dayName: {text: schedule.name},
        properties: {
            width: Ti.UI.FILL,
            height: '70dip',
            backgroundColor: 'transparent'
        }
    };
}

function loadData() {
    var schedules = [];

    for (var i = 0 ; i < 7 ; i++) {
        now.add(1, 'day');
        var schedule = {day: now.format('DD'), name: now.format('ddd')};
        schedules.push(createListItem(schedule));
    }

    $.section.setItems(schedules);
}

loadData();
