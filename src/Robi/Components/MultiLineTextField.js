import { App } from '../Core/App.js'
import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function MultiLineTextField(param) {
    const {
        label, description, optional, value, readOnly, placeHolder, parent, position, minHeight, width, fieldMargin, padding, onKeydown, onKeyup, onFocusout
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<label class='field-label'>${label}${optional ? /*html*/ `<span class='optional'><i>Optional</i></span>` : ''}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${readOnly ? /*html*/ `<div class='form-field-multi-line-text readonly'>${value || placeHolder}</div>` : /*html*/ `<div class='form-field-multi-line-text editable' contenteditable='true'>${value || ''}</div>`}
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                width: inherit;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .form-field-multi-line-text {
                color: var(--color);
                margin-top: 2px;
                margin-bottom: 4px;
                padding: 0.375rem 0.75rem;
            }

            #id .form-field-multi-line-text > * {
                color: var(--color);
            }

            #id .form-field-multi-line-text.editable {
                min-height: ${minHeight || `200px`};
                width: ${width || 'unset'};
                border-radius: 4px;
                border: 1px solid var(--border-color);
            }

            #id .form-field-multi-line-text.editable:active,
            #id .form-field-multi-line-text.editable:focus {
                outline: none;
            }

            /** Readonly */
            #id .form-field-multi-line-text.readonly {
                user-select: none;
                background: transparent;
                border: solid 1px rgba(0, 0, 0, .05);
                background: white;
                border-radius: 4px;
            }

            /* Optional */
            #id .optional {
                margin: 0px 5px;
                font-size: .8em;
                color: gray;
                font-weight: 400;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'focusout',
                listener: onFocusout
            },
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'keyup',
                listener: onKeyup
            }
        ]
    });

    component.focus = () => {
        const field = component.find('.form-field-multi-line-text');

        field.focus();
    };

    component.isValid = (state) => {
        const node = component.find('.is-valid-container');

        if (node) {
            node.remove();
        }

        if (state) {
            component.find('.field-label').style.color = 'seagreen';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: seagreen; font-size: 22px;'>
                        <use href='#icon-bs-check-circle-fill'></use>
                    </svg>
                </div>
            `);
        } else {
            component.find('.field-label').style.color = 'crimson';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: crimson; font-size: 22px;'>
                        <use href='#icon-bs-exclamation-circle-fill'></use>
                    </svg>
                </div>
            `);
        }
    };

    component.value = (param, options = {}) => {
        const field = component.find('.form-field-multi-line-text');

        if (param !== undefined) {
            field.innerHTML = param;
        } else {
            if (options.plainText === true) {
                return field.innerText;
            } else {
                return field.innerHTML;
            }
        }
    };

    return component;
}
// @END-File
