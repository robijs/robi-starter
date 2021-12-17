import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Dialog(param) {
    const {
        classes, message, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='dialog-container'>
                <div class='dialog-box ${classes?.join(' ')}'>
                    ${message}
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id {
                position: fixed;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }

            #id .dialog-box {
                min-width: 300px;
                min-height: 150px;
                padding: 30px;
                background: white;
                border-radius: 20px;
            }
        `,
        parent: parent,
        position,
        events: []
    });

    component.value = (param) => {
        const field = component.find('.form-field-date');

        if (param) {
            field.value = new Date(param).toISOString().split('T')[0];
        } else {
            return field.value;
        }
    };

    return component;
}
// @END-File
