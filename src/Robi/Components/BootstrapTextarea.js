import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function BootstrapTextarea(param) {
    const {
        label, parent, position, classes, value,
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='form-group'>
                    <label>${label}</label>
                    <textarea class='form-control' rows='3' ${value ? `value=${value}` : ''}></textarea>
                </div>
            </div>
        `,
        style: /*css*/ `
           #id label {
               font-weight: 500;
           }
        `,
        parent,
        position,
        events: [],
        onAdd() {
        }
    });

    component.value = (param) => {
        const field = component.find('.form-control');

        if (param !== undefined) {
            field.value = param;
        } else {
            return field.value;
        }
    };

    return component;
}
// @END-File
