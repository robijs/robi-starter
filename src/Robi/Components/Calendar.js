import { Component } from '../Actions/Component.js'

// @START-File
/**
 * Modified from: https://codepen.io/zellwk/pen/xNpKwp
 * 
 * @param {*} param
 * @returns
 */
export function Calendar(param) {
    const {
        wide,
        onChange,
        parent,
        position
    } = param;

    let events = param.events || [];

    let date = param.date ? new Date(param.date) : new Date();

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const component = Component({
        html: /*html*/ `
            <div class='calendar'>
                <div class='month'>
                    <svg class='icon prev'>
                        <use href='#icon-bs-chevron-compact-left'></use>
                    </svg>
                    <div class='date'>
                        ${title()}
                    </div>
                    <svg class='icon next'>
                        <use href='#icon-bs-chevron-compact-right'></use>
                    </svg>
                </div>
                <div class='weekdays'>
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div class='days'>
                    ${days()}
                </div>
            </div>
        `,
        style: /*css*/ `
            .calendar {
                width: ${wide ? '100%' : '364px'};
                border-radius: 30px;
                -webkit-border-radius: 30px;
                -moz-border-radius: 30px;
                -ms-border-radius: 30px;
                -o-border-radius: 30px;
                user-select: none;
            }
            
            .month {
                width: 100%;
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                text-align: center;
            }
            
            .month .icon {
                cursor: pointer;
                font-size: 22px;
                fill: var(--primary);
            }
            
            .month h6 {
                margin-bottom: 4px;
                font-weight: 700;
                color: var(--primary);
            }
            
            .month time {
                cursor: pointer;
                font-size: 13px;
            }
            
            .weekdays {
                width: 100%;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
            }
            
            .weekdays div {
                font-size: 14px;
                width: ${wide ? 'calc(100% / 7)' : 'calc(364px / 7)'};
                ${wide ? 'margin: 6px;' : ''}
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .days {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
            }
            
            .days div {
                margin: 6px;
                font-size: 13px;
                width: ${wide ? 'calc(( 100% - 84px ) / 7)' : 'calc(280px / 7)'};
                height: ${wide ? '50px' : '40px'};
                display: flex;
                justify-content: center;
                align-items: center;
                transition: background-color 0.2s;
                -webkit-transition: background-color 0.2s;
                -moz-transition: background-color 0.2s;
                -ms-transition: background-color 0.2s;
                -o-transition: background-color 0.2s;
            }
            
            .prev-date,
            .next-date {
                opacity: 0.5;
            }
            
            .today {
                background-color: var(--primary);
                color: var(--secondary);
                border-radius: 10px;
            }

            .event {
                font-weight: 500;
                background-color: var(--primary-19);
                color: var(--primary);
                border-radius: 10px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .prev',
                event: 'click',
                listener(event) {
                    rebuild(-1);
                }
            },
            {
                selector: '#id .next',
                event: 'click',
                listener(event) {
                    rebuild(1);
                }
            },
            {
                selector: '#id .month time',
                event: 'click',
                listener(event) {
                    rebuild();
                }
            }
        ],
        onAdd() {

        }
    });

    function title() {
        return /*html*/ `
            <h6>${months[date.getMonth()]} ${date.getFullYear()}</h6>       
            <time datetime='${date.getFullYear()}-${date.toLocaleDateString('en-US', { month: '2-digit' })}'>
                ${new Date().toDateString()}
            </time>
        `
    }

    function days() {
        // console.log('Events:', events.map(d => d.toDateString()));

        date.setDate(1);

        const lastDay = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDate();

        const prevLastDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            0
        ).getDate();

        const firstDayIndex = date.getDay();

        const lastDayIndex = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDay();

        const nextDays = 7 - lastDayIndex - 1;

        let days = '';

        for (let x = firstDayIndex; x > 0; x--) {
            const day = prevLastDay - x + 1;
            const { dateTime, isEvent } = getDate(day, -1);

            days += /*html*/ `
                <div class='prev-date ${isEvent ? 'event' : ''}'>
                    <time datetime='${dateTime}'>${day}</time>
                </div>
            `;
        }

        for (let i = 1; i <= lastDay; i++) {
            const { dateTime, isEvent } = getDate(i);

            days += /*html*/ `
                <div class='${i === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear() ? 'today' : ''} ${isEvent ? 'event' : ''}'>
                    <time datetime='${dateTime}'>${i}</time>
                </div>
            `;
        }

        for (let j = 1; j <= nextDays; j++) {
            const { dateTime, isEvent } = getDate(j, 1);

            days += /*html*/ `
                <div class='next-date ${isEvent ? 'event' : ''}'>
                    <time datetime='${dateTime}'>${j}</time>
                </div>
            `;
        }

        return days;
    }

    function getDate(d, m = 0) {
        const day = new Date(date.getFullYear(), date.getMonth() + m, d);
        const dateTime = day.toISOString().split('T')[0];
        const isEvent = events.map(date => date.toLocaleDateString()).includes(day.toLocaleDateString());

        // console.log('Day:', day.toLocaleDateString());

        return {
            day,
            dateTime: dateTime,
            isEvent
        }
    }

    function rebuild(offset) {
        if (typeof offset === 'number') {
            date.setMonth(date.getMonth() + offset);
        } else {
            date = new Date();
        }

        if (onChange) {
            onChange(date);
        }

        render();
    }

    function render() {
        component.find('.date').innerHTML = title();
        component.find('.days').innerHTML = days();

        component.find('.month time').on('click', () => {
            rebuild();
        })
    }

    component.setEvents = (newEvents) => {
        events = newEvents;
    }

    component.setDate = (d) => {
        date = new Date(d);

        // if (onChange) {
        //     onChange(date);
        // }

        render();
    }

    return component;
}
// @END-File
