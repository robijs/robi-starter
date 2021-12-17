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
        label, description, choices, value, fillIn, parent, position, width, fieldMargin, onChange
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<label>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div>
                    ${choices.map(choice => {
            const id = GenerateUUID();

            return /*html*/ `
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" id="${id}" data-label='${choice}' ${value?.includes(choice) ? 'checked' : ''}>
                                    <label class="custom-control-label" for="${id}">${choice}</label>
                                </div>
                                <!-- <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="${id}">
                                    <label class="custom-control-label" for="${id}">${choice}</label>
                                </div> -->
                            `;
        }).join('\n')}
                    ${fillIn ?
                (() => {
                    const id = GenerateUUID();
                    // FIXME: this wil probably break if fill in choice is the same as one of the choices
                    const otherValue = value?.find(item => !choices.includes(item));

                    return /*html*/ `
                                <div class="custom-control custom-checkbox d-flex align-items-center">
                                    <input type="checkbox" class="custom-control-input other-checkbox" id="${id}" data-label='Other' ${otherValue ? 'checked' : ''}>
                                    <label class="custom-control-label d-flex align-items-center other-label" for="${id}">Other</label>
                                    <input type='text' class='form-control ml-2 Other' value='${otherValue || ''}' list='autocompleteOff' autocomplete='new-password'>
                                </div>
                            `;
                })() :
                ''}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
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

            #id .custom-control-input:checked ~ .custom-control-label::before {
                color: #fff;
                border-color: ${App.get('primarColor')};
                background-color: ${App.get('primarColor')};
            }

            #id .custom-control-input:focus~.custom-control-label::before {
                box-shadow: 0 0 0 0.2rem ${App.get('primarColor') + '6b'} !important;
            }
            
            #id .custom-control-input:focus:not(:checked)~.custom-control-label::before {
                border-color: ${App.get('primarColor') + '6b'}  !important;
            }
            
            /* #id .other-label.custom-control-label::before,
            #id  .other-label.custom-control-label::after {
                top: .5rem;
            } */
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .custom-control-input',
                event: 'change',
                listener: onChange
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
                    if (event.target.value) {
                        onChange(event);
                    }
                }
            }
        ],
    });

    component.value = (param, options = {}) => {
        const checked = component.findAll('.custom-control-input:not(.other-checkbox):checked');

        const results = [...checked].map(node => node.dataset.label);

        if (fillIn) {
            // console.log(component.find('.Other').value);
            results.push(component.find('.Other').value);
        }

        return results;
    };

    return component;
}
// @END-File
