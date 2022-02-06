import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function DateField(param) {
    const {
        label, description, parent, position, margin, value, onChange
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <input class='form-field-date form-control' type='date' ${value ? `value=${new Date(value).toISOString().split('T')[0]}` : ''}>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            /* Labels */
            #id label {
                font-weight: 500;
            }

            #id .form-field-date {
                width: auto;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id input',
                event: 'change',
                listener: onChange
            }
        ]
    });

    component.value = (param) => {
        const field = component.find('.form-field-date');

        if (param) {
            field.value = new Date(param).toISOString().split('T')[0];
        } else {
            // NOTE: Dates are hard: https://stackoverflow.com/a/31732581
            return new Date(field.value.replace(/-/g, '\/')).toLocaleDateString();
        }
    };

    return component;
}
// @END-File
