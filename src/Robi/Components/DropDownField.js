import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';
import { DropDownMenu } from './DropDownMenu.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function DropDownField(param) {
    const {
        label, labelAfter, description, value, direction, required, parent, position, width, editable, fieldMargin, maxWidth, focusout, onError, onEmpty, onSetValue
    } = param;

    let {
        list, dropDownOptions, disabled
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field ${disabled ? 'disabled' : ''} ${direction}'>
                <div class='form-field-label'>
                    <span>${label || ''}</span>
                    <!-- ${required ? /*html*/ `<span class='required'>Required</span>` : ''} -->
                </div>
                ${description ? /*html*/ `<div class='form-field-description'>${description}</div>` : ''}
                <div class='form-field-drop-down-container'>
                    <div class='form-field-drop-down' contenteditable='${editable !== false ? 'true' : 'false'}'>${dropDownOptions.map(item => item.value).includes(value) ? value : ''}</div> 
                    <!-- List options go here -->
                </div>
                ${labelAfter ? /*html*/ `<div class='form-field-label'><span>${labelAfter || ''}</span></div>` : ''}
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
            }

            #id.form-field.row {
                display: flex;
                align-items: center;
            }

            #id.form-field.row .form-field-drop-down-container {
                margin-left: 5px;
                margin-right: 5px;
            }

            #id.form-field.disabled {
                opacity: 0.75;
                pointer-events: none;
            }

            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .form-field-description {
                padding: 5px 0px;
            }

            #id .form-field-drop-down-container {
                position: relative;
            }

            #id .form-field-drop-down {
                width: ${width || '150px'};
                ${editable === false ? 'min-height: 36px;' : ''}
                font-weight: 500;
                font-size: 1em;
                padding: 5px 10px;
                margin: 2px 0px 4px 0px;
                background: white;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            #id .form-field-drop-down:active,
            #id .form-field-drop-down:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px var(--primary);
            }

            /* Validation */
            #id .bad {
                background: lightpink;
                box-shadow: 0px 0px 0px 2px crimson;
                border-radius: 4px;
            }

            /* Required */
            #id .required {
                font-size: .8em;
                font-weight: 400;
                color: red;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .form-field-drop-down`,
                event: 'keyup',
                listener(event) {
                    const data = dropDownOptions.filter(item => {
                        const query = event.target.innerText;

                        return query ? item.value.toLowerCase().includes(query.toLowerCase()) : item;
                    });

                    showDropDownMenu(event, data);
                }
            },
            {
                selector: `#id .form-field-drop-down`,
                event: 'click',
                listener(event) {
                    /** Remove menu on second click */
                    if (menu) {
                        cancelMenu();

                        return;
                    }

                    /** @todo remove menu on click outside */
                    showDropDownMenu(event, dropDownOptions);
                }
            },
            {
                selector: `#id .form-field-drop-down`,
                event: 'focusout',
                listener(event) {
                    /** Get  */
                    const value = event.target.innerText;

                    /** Check that value is valid */
                    if (value === '') {
                        cancelMenu();

                        if (onEmpty) {
                            onEmpty();
                        }
                    } else if (!dropDownOptions.map(item => item.value).includes(value)) {
                        console.log('not a valid option');

                        component.addError('Not a valid option. Please enter or select an option from the menu.');

                        if (onError) {
                            onError(value);
                        }
                    } else {
                        component.removeError();

                        cancelMenu();

                        if (focusout) {
                            focusout(event);
                        }
                    }
                }
            }
        ]
    });

    let menu;

    function cancelMenu(param = {}) {
        const {
            removeEvents
        } = param;

        if (menu) {
            if (removeEvents) {
                menu.removeEvents();
            }

            menu.cancel();
            menu = undefined;
        }
    }

    function showDropDownMenu(event, data) {
        const key = event.key;

        if (key && key.includes('Arrow') || key === 'Enter') {
            event.preventDefault();

            return;
        }

        if (data.length === 0) {
            console.log('no options to show');

            return;
        }

        /** Cancel menu */
        cancelMenu({
            removeEvents: true,
        });

        // Set menu
        menu = DropDownMenu({
            dropDownField: component,
            field: event.target,
            data,
            list,
            onSetValue(data) {
                cancelMenu();

                if (onSetValue) {
                    onSetValue(data);
                }
            }
        });

        // Add to DOM
        menu.add();
    }

    component.enable = () => {
        disabled = false;

        component.get().classList.remove('disabled');
    };

    component.disable = () => {
        disabled = true;

        component.get().classList.add('disabled');
    };

    component.setOptions = (param) => {
        const {
            list: newList, options: newOptions
        } = param;

        list = newList;
        dropDownOptions = newOptions;
    };

    component.addError = (param) => {
        component.removeError();

        let text = typeof param === 'object' ? param.text : param;

        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
            /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''}
            </div>
        `;

        component.find('.form-field-drop-down').insertAdjacentHTML('beforebegin', html);
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

    component.value = (param) => {
        const field = component.find('.form-field-drop-down');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    };

    component.getValueItemId = () => {
        return component.find('.form-field-drop-down').dataset.itemid;
    };

    return component;
}
// @END-File
