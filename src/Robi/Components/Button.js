import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Button(param) {
    const {
        type, value, display, margin, parent, action, disabled, width
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-button ${type}-button ${disabled ? 'disabled' : ''}'>${value}</div>
        `,
        style: /*css*/ `
            #id.form-button {
                cursor: pointer;
                display: ${display || 'inline-block'};
                margin: ${margin || '0px 20px 0px 0px'};
                padding: 5px 25px;
                font-size: .9em;
                font-weight: 500;
                text-align: center;
                white-space: nowrap;
                border-radius: 10px;
                width: ${width || 'fit-content'};
            }

            #id.disabled {
                pointer-events: none;
                filter: opacity(0.75);
            }

            #id.normal-button {
                color: var(--primary);
                background: var(--button-background);
                border: solid 1px transparent;
            }

            #id.back-button,
            #id.hollow-button,
            #id.cancel-button {
                color: rgba(${App.get('primaryColorRGB')}, .9);
                background: transparent;
                border: solid 1px rgba(${App.get('primaryColorRGB')}, .9);
            }

            #id.create-button,
            #id.update-button {
                color: white;
                background: mediumseagreen;
                border: solid 2px seagreen;
            }

            #id.create-button *,
            #id.update-button * {
                color: white;
            }

            #id.stop-button {
                color: white;
                background: crimson;
                border: solid 2px firebrick;
            }

            #id.delete-button {
                color: firebrick;
                text-decoration: underline;
                font-size: .9em;
            }

            /* .delete-button {
                color: white;
                background: firebrick;
                border: solid 2px firebrick;
                box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);
            } */
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '#id.form-button',
                event: 'click',
                listener(event) {
                    if (!event.target.classList.contains('disabled')) {
                        action(event);
                    } else {
                        console.log(event.target, '\tis disbaled');
                    }
                }
            }
        ]
    });

    component.setValue = (html) => {
        component.get().innerHTML = html;

        return component;
    };

    component.disable = () => {
        component.get().classList.add('disabled');

        return component;
    };

    component.enable = () => {
        component.get().classList.remove('disabled');

        return component;
    };

    return component;
}
// @END-File
