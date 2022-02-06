import { Component } from '../Actions/Component.js'
import { GenerateUUID } from '../Actions/GenerateUUID.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function MultiChoiceField(param) {
    const {
        choices,
        description,
        fieldMargin,
        fillIn,
        label,
        onChange,
        parent,
        position,
        validate,
        value
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<label class='field-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='checkbox-container'>
                    ${
                        choices.map(choice => {
                            const id = GenerateUUID();

                            return /*html*/ `
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" id="${id}" data-label='${choice}' ${value?.includes(choice) ? 'checked' : ''}>
                                    <label class="custom-control-label" for="${id}">${choice}</label>
                                </div>
                            `;
                        }).join('\n')
                    }
                    ${
                        fillIn ?
                        (() => {
                            const id = GenerateUUID();
                            // FIXME: this wil probably break if fill in choice is the same as one of the choices
                            const otherValue = value ? value.find(item => !choices.includes(item)) : '';

                            return /*html*/ `
                                <div class="custom-control custom-checkbox d-flex align-items-center">
                                    <input type="checkbox" class="custom-control-input other-checkbox" id="${id}" data-label='Other' ${otherValue ? 'checked' : ''}>
                                    <label class="custom-control-label d-flex align-items-center other-label" for="${id}">Other</label>
                                    <input type='text' class='form-control ml-2 Other' value='${otherValue || ''}' list='autocompleteOff' autocomplete='new-password'>
                                </div>
                            `;
                        })() : ''
                    }
                </div>
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
            
            #id .custom-control-label {
                font-size: 13px;
                font-weight: 400;
                white-space: nowrap;
            }
            
            #id .checkbox-container {
                border-radius: 10px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .custom-control-input',
                event: 'change',
                listener(event) {
                    console.log(event.target.checked);

                    if (validate) {
                        validate();
                    }

                    if (onChange) {
                        onChange(event);
                    }
                }
            },
            {
                selector: '#id .Other',
                event: 'click',
                listener(event) {
                    component.find('input[data-label="Other"]').checked = true;
                }
            },
            {
                selector: '#id .Other',
                event: 'focusout',
                listener(event) {
                    if (!event.target.value) {
                        component.find('input[data-label="Other"]').checked = false;
                    }
                }
            },
            {
                selector: '#id .Other',
                event: 'keyup',
                listener(event) {
                    if (event.target.value && onChange) {
                        onChange(event);
                    }
                }
            },
            {
                selector: '#id .Other',
                event: 'focusout',
                listener(event) {
                    if (validate) {
                        validate(event);
                    }
                }
            }
        ],
    });

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
        const checked = component.findAll('.custom-control-input:not(.other-checkbox):checked');
        const results = [...checked].map(node => node.dataset.label);
        const other = component.find('.custom-control-input.other-checkbox:checked');

        if (fillIn && other) {
            results.push(component.find('.Other').value);
        }

        return results;
    };

    return component;
}
// @END-File
