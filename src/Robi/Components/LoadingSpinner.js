import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function LoadingSpinner(param) {
    const {
        font, type, color, message, classes, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='loading-spinner w-100 d-flex flex-column justify-content-center align-items-center ${classes?.join(' ')}'>
                <div class="mb-2 loading-message ${type ? `text-${type}` : 'text-robi'}" style='${`${color} !important` || 'darkgray'}; font-weight: 600;'>${message || 'Loading'}</div>
                <div class="spinner-grow ${type ? `text-${type}` : 'text-robi'}" style='color: ${`${color} !important` || 'darkgray'};' role="status"></div>
            </div>
        `,
        style: /*css*/ `
            #id * {
                color: inherit;
            }

            ${font ?
            /*css */ `
                    #id * {
                        font-family: ${font}
                    }
                ` : ''
            }
        `,
        parent,
        position,
        events: []
    });

    return component;
}
// @END-File
