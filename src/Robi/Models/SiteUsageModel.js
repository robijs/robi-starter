import { StartAndEndOfWeek } from './StartAndEndOfWeek.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function SiteUsageModel(param) {
    const {
        visits,
    } = param;

    /** Today */
    const itemsCreatedToday = visits.filter(createdToday);

    function createdToday(item) {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (created.toDateString() == today.toDateString()) {
            return item;
        }
    }

    /** Week */
    const itemsCreatedThisWeek = visits.filter(createdThisWeek);

    function createdThisWeek(item) {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        // if (created >= monday) {
        if (created >= StartAndEndOfWeek().sunday) {
            return item;
        }
    }

    /** Month */
    const firstOfMonth = startOfMonth();

    function startOfMonth(date) {
        const now = date ? new Date(date) : new Date();

        now.setHours(0, 0, 0, 0);
        now.setDate(1);

        return now;
    }

    const itemsCreatedThisMonth = visits.filter(createdThisMonth);

    function createdThisMonth(item) {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        if (created >= firstOfMonth) {
            return item;
        }
    }

    /** Year */
    const firstOfYear = startOfYear();

    function startOfYear(date) {
        const now = date ? new Date(date) : new Date();

        now.setHours(0, 0, 0, 0);
        now.setDate(1);
        now.setMonth(0);

        return now;
    }

    const itemsCreatedThisYear = visits.filter(item => {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        if (created >= firstOfYear) {
            return item;
        }
    });

    /** Chart - Today */
    const today = [
        {
            label: 'Visits',
            data: []
        }
    ];

    for (let i = 0; i < 24; i++) {
        today[0].data.push(itemsCreatedToday.filter(byHour, i));
    }

    function byHour(item) {
        const created = new Date(item.Created);

        const hourBegin = new Date();
        hourBegin.setHours(this, 0, 0, 0);

        const hourEnd = new Date();
        hourEnd.setHours(this + 1, 0, 0, 0);

        // console.log(this);
        // console.log(created);
        // console.log(hourBegin);
        // console.log(hourEnd);
        // console.log('---');
        if (created >= hourBegin && created < hourEnd) {
            return item;
        }
    }

    /** Chart - Week */
    const week = [
        {
            label: 'Visits',
            data: [
                itemsCreatedThisWeek.filter(byDayOfWeek, 0),
                itemsCreatedThisWeek.filter(byDayOfWeek, 1),
                itemsCreatedThisWeek.filter(byDayOfWeek, 2),
                itemsCreatedThisWeek.filter(byDayOfWeek, 3),
                itemsCreatedThisWeek.filter(byDayOfWeek, 4),
                itemsCreatedThisWeek.filter(byDayOfWeek, 5),
                itemsCreatedThisWeek.filter(byDayOfWeek, 6) /** Saturday */
            ]
        }
    ];

    function byDayOfWeek(item) {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        const day = StartAndEndOfWeek().sunday;
        day.setDate(day.getDate() + this);
        day.setHours(0, 0, 0, 0);

        if (created.toDateString() === day.toDateString()) {
            return item;
        }
    }

    /** Chart - Month */
    const days = daysInMonth(new Date().getMonth() + 1); /** passed in month starts at 1 for Jan, not 0 */

    function daysInMonth(month) {
        const date = new Date();

        date.setMonth(month);
        date.setDate(0);

        return date.getDate();
    }

    const month = [
        {
            label: 'Visits',
            data: []
        }
    ];

    for (let i = 1; i <= days; i++) {
        month[0].data.push(itemsCreatedThisMonth.filter(byDate, i));
    }

    function byDate(item) {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        const day = new Date();
        day.setDate(this);
        day.setHours(0, 0, 0, 0);

        if (created.toDateString() === day.toDateString()) {
            return item;
        }
    }

    /** Chart - Year */
    const year = [
        {
            label: 'Visits',
            data: []
        }
    ];

    for (let i = 0; i <= 11; i++) {
        const date = new Date();
        const yyyy = date.getFullYear();

        const firstOfMonth = new Date(yyyy, i, 1);
        const lastOfMonth = new Date(yyyy, i + 1, 0);

        // console.log('Index:', i);
        // console.log('First:', firstOfMonth);
        // console.log('Last:', lastOfMonth);
        // console.log('------------------');
        year[0].data.push(visits.filter(createdThisMonth));

        function createdThisMonth(item) {
            const created = new Date(item.Created);
            created.setHours(0, 0, 0, 0);

            if (created >= firstOfMonth && created <= lastOfMonth) {
                return item;
            }
        }
    }

    return {
        visits: {
            today: itemsCreatedToday,
            week: itemsCreatedThisWeek,
            month: itemsCreatedThisMonth,
            year: itemsCreatedThisYear,
        },
        chart: {
            today,
            week,
            month,
            year
        }
    };
}
// @END-File
