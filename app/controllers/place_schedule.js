var args = arguments[0] || {},
    moment = require('alloy/moment'),
    now = new moment(),
    lastMonth = null;

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

function createMonthItem(currentMonth) {
    return {
        template: 'month',
        monthName: {text: currentMonth},
        properties: {
            width: Ti.UI.FILL,
            height: '35dip',
            backgroundColor: '#FF6600'
        }
    };
}

function loadData() {
    var schedules = [];

    for (var i = 0 ; i < 16 ; i++) {
        now.add(1, 'day');

        var schedule = {day: now.format('DD'), name: now.format('ddd')},
            currentMonth = now.format('MMMM');

        if (lastMonth != currentMonth) {
            schedules.push(createMonthItem(currentMonth));
            lastMonth = currentMonth;
        }

        schedules.push(createListItem(schedule));
    }

    $.section.setItems(schedules);
}

loadData();
