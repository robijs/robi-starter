import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function PhoneField(param) {
    const {
        label, parent, position, onSetValue
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <div class='form-field-label'>${label}</div>
                <div class='form-field-phone'>
                    <div class='form-field-phone-number form-field-phone-open'>(</div>
                    <div class='form-field-phone-number form-field-phone-areacode' contenteditable='true'></div>
                    <div class='form-field-phone-number form-field-phone-close'>)</div>
                    <div class='form-field-phone-number form-field-phone-prefix' contenteditable='true'></div>
                    <div class='form-field-phone-number form-field-phone-hyphen'>-</div>
                    <div class='form-field-phone-number form-field-phone-linenumber' contenteditable='true'></div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin-bottom: 10px;
            }

            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px;
            }

            #id .form-field-phone {
                width: 140px;
                font-size: .9em;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: solid 1px var(--border-color);
            }

            #id .form-field-phone-number {
                display: inline-block;
            }

            #id .form-field-phone-number:active,
            #id .form-field-phone-number:focus {
                outline: none;
                border: none;
            }

            #id .form-field-phone-areacode {
                width: 22px;
            }

            #id .form-field-phone-prefix {
                width: 25px;
            }

            #id .form-field-phone-linenumber {
                width: 35px;
            }
            
            /** Focused */
            #id .focused {
                box-shadow: 0px 0px 0px 2px var(--primary);
                border: solid 1px transparent;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .form-field-phone-number`,
                event: 'focusin',
                listener(event) {
                    component.find('.form-field-phone').classList.add('focused');
                }
            },
            {
                selector: `#id .form-field-phone-number`,
                event: 'focusout',
                listener(event) {
                    component.find('.form-field-phone').classList.remove('focused');
                }
            },
            {
                selector: `#id .form-field-phone-areacode`,
                event: 'keyup',
                listener(event) {
                    if (event.target.innerText.length === 3) {
                        component.find('.form-field-phone-prefix').focus();
                    }
                }
            },
            {
                selector: `#id .form-field-phone-prefix`,
                event: 'keyup',
                listener(event) {
                    if (event.target.innerText.length === 3) {
                        component.find('.form-field-phone-linenumber').focus();
                    }
                }
            },
            {
                selector: `#id .form-field-phone-linenumber`,
                event: 'keyup',
                listener(event) {
                    if (event.target.innerText.length === 4) {
                        component.find('.form-field-phone-prefix').focus();

                        onSetValue();
                    }
                }
            },
        ]
    });

    component.value = (param) => {
        const areacode = component.find('.form-field-phone-areacode');
        const prefix = component.find('.form-field-phone-prefix');
        const linenumber = component.find('.form-field-phone-linenumber');

        if (param) {
            const number = param.replace(/[^a-zA-Z0-9 ]/g, '');

            areacode.innerText = number.slice(0, 3);
            prefix.innerText = number.slice(3, 6);
            linenumber.innerText = number.slice(6, 10);
        } else {
            return areacode.innerText + prefix.innerText + linenumber.innerText;
        }
    };

    return component;
}
// @END-File
