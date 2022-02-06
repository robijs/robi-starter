import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Timer(param) {
    const {
        parent, start, classes, stop, reset, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='timer ${classes?.join(' ')}'>
                <h5 class='mb-0'>Run action</h5>
                <div class='stopwatch' id='stopwatch'>00:00:00</div>
                <button class='btn btn-robi-success start'>Start</button>
                <button class='btn btn-robi stop'>Stop</button>
                <button class='btn btn-robi-light reset'>Reset</button>
            </div>
        `,
        style: /*css*/ `
            #id {
                padding: 20px;
                border-radius: 20px;
                background: var(--background)
            }
            
            .stopwatch {
                margin: 20px 0px;
                font-size: 1.5em;
                font-weight: bold;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .start`,
                event: 'click',
                listener(event) {
                    component.start();
                }
            },
            {
                selector: `#id .stop`,
                event: 'click',
                listener(event) {
                    component.stop();
                }
            },
            {
                selector: `#id .reset`,
                event: 'click',
                listener(event) {
                    component.reset();
                }
            }
        ]
    });

    let time;
    let ms = 0;
    let sec = 0;
    let min = 0;

    function timer() {
        ms++;

        if (ms >= 100) {
            sec++;
            ms = 0;
        }

        if (sec === 60) {
            min++;
            sec = 0;
        }

        if (min === 60) {
            ms, sec, min = 0;
        }

        let newMs = ms < 10 ? `0${ms}` : ms;
        let newSec = sec < 10 ? `0${sec}` : sec;
        let newMin = min < 10 ? `0${min}` : min;

        component.find('.stopwatch').innerHTML = `${newMin}:${newSec}:${newMs}`;
    };

    component.start = () => {
        time = setInterval(timer, 10);

        if (start) {
            start();
        }
    };

    component.stop = () => {
        clearInterval(time);

        if (stop) {
            stop();
        }
    };

    component.reset = () => {
        ms = 0;
        sec = 0;
        min = 0;

        component.find('.stopwatch').innerHTML = '00:00:00';

        if (reset) {
            reset();
        }
    };

    return component;
}
// @END-File
