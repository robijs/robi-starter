import { Component } from '../Actions/Component.js'
import { GenerateUUID } from '../Robi.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function ChoiceField(param) {
    const {
        onChange,
        buttonStyle,
        classes,
        description,
        fillIn,
        fieldMargin,
        flex,
        label,
        maxHeight,
        maxWidth,
        onFocusout,
        options,
        padding,
        parent,
        position,
        readOnly,
        value,
        valueType,
        validate
    } = param;

    if (fillIn) {
        const choices = options.map(o => o.label);
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
                                        <input type="checkbox" class="custom-control-input" id="${id}" data-label='${choice}' ${value === choice ? 'checked' : ''}>
                                        <label class="custom-control-label" for="${id}">${choice}</label>
                                    </div>
                                `;
                            }).join('\n')
                        }
                        ${
                            (() => {
                                const id = GenerateUUID();
                                // FIXME: this wil probably break if fill in choice is the same as one of the choices
                                const otherValue = value && !choices.includes(value) ? value : '';
    
                                return /*html*/ `
                                    <div class="custom-control custom-checkbox d-flex align-items-center">
                                        <input type="checkbox" class="custom-control-input other-checkbox" id="${id}" data-label='Other' ${otherValue ? 'checked' : ''}>
                                        <label class="custom-control-label d-flex align-items-center other-label" for="${id}">Other</label>
                                        <input type='text' class='form-control ml-2 Other' value='${otherValue || ''}' list='autocompleteOff' autocomplete='new-password'>
                                    </div>
                                `;
                            })()
                        }
                    </div>
                </div>
            `,
            style: /*css*/ `
                #id.form-field {
                    position: relative;
                    margin: ${fieldMargin || '0px 0px 20px 0px'};
                    width: inherit;
                    ${flex ? `flex: ${flex};` : ''}
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

                        // Deselect all
                        component.findAll('.custom-control-input').forEach(node => node.checked = false);

                        // Except current
                        event.target.checked = true;

                        // FIXME: is this necessary?
                        // Remove other text if not selected
                        if (!event.target.classList.contains('other-checkbox')) {
                            component.find('.Other').value = '';
                        }
    
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
                        // Deselect all
                        component.findAll('.custom-control-input').forEach(node => node.checked = false);

                        // But not .other-checkbox
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
                setState('bs-check-circle-fill', 'seagreen');
            } else {
                setState('bs-exclamation-circle-fill', 'crimson');
            }

            function setState(icon, color) {
                component.find('.field-label').style.color = color;
                component.append(/*html*/ `
                    <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                        <svg class='icon' style='fill: ${color}; font-size: 22px;'>
                            <use href='#icon-${icon}'></use>
                        </svg>
                    </div>
                `);
            }
        };
    
        // TODO: Set value
        component.value = (param, options = {}) => {
            const checked = component.find('.custom-control-input:checked');

            if (checked.classList.contains('other-checkbox')) {
                console.log(component.find('.Other').value);
                return component.find('.Other').value;
            } else {
                return checked.dataset.label;
            }
        };
    
        return component;
    }

    const id = GenerateUUID();

    const component = Component({
        html: /*html*/ `
            <div class='form-field${classes ? ` ${classes.join(' ')}` : ''}'>
                ${label ? /*html*/ `<label class='field-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='dropdown'>
                    ${
                        readOnly ? 
                        /*html*/ `
                            ${
                                (() => {
                                    const { label, path, id } = value;

                                    return /*html*/ `
                                        <div class='btn btn-choice' style='cursor: initial;' data-id='${id}'>
                                            <span data-path='${path || ''}' >${label}</span>
                                        </div>
                                    `;
                                })()
                            }
                        ` : 
                        /*html*/ `
                            <button class='btn btn-choice dropdown-toggle' ${buttonStyle ? `style='${buttonStyle}'` : ''} type='button' id='${id}' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                ${value || `<span style='opacity: 0;'>Choose</span>`}
                            </button>
                            <div class='dropdown-menu' aria-labelledby='${id}'>
                                <div class='scroll-container'>
                                    ${buildDropdown(options)}
                                </div>
                            </div>   
                        `
                    }
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                padding: ${padding || '0px'};
                ${flex ? `flex: ${flex};` : ''}
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .dropdown-item {
                font-size: 13px;
                cursor: pointer;
            }

            #id .dropdown-menu {
                margin: 5px 0px 0px 0px;
                padding: .125rem;
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
                ${maxWidth ? `min-width: ${maxWidth};` : ''}
            }

            #id .dropdown-item {
                border-radius: 8px;
            }

            #id .dropdown-item:hover {
                background: var(--primary-20);
            }

            #id .scroll-container {
                overflow: overlay;
                ${maxHeight ? `max-height: ${maxHeight};` : ''}
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
            }

            #id .scroll-container::-webkit-scrollbar-thumb {
                min-height: 20px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener(event) {
                    if (valueType === 'html') {
                        // component.find('.dropdown-toggle').innerHTML = this.querySelector('[data-target="true"').innerHTML;
                        component.find('.dropdown-toggle').innerHTML = this.innerHTML;
                    } else {
                        component.find('.dropdown-toggle').innerText = event.target.innerText;
                    }

                    component.find('.dropdown-toggle').dataset.id = this.dataset.id;

                    if (onChange) {
                        onChange(event);
                    }
                }
            },
            {
                selector: `#id .dropdown-toggle`,
                event: 'focusout',
                listener: onFocusout
            }
        ]
    });

    function buildDropdown(items) {
        return items
            .map(dropdown => dropdownTemplate(dropdown))
            .join('\n');
    }

    function dropdownTemplate(dropdown) {
        const {
            label, path, id
        } = dropdown;

        return /*html*/ `
            <button type='button' class='dropdown-item' data-path='${path || ''}' data-id='${id}'>${label}</button>
        `;
    }

    component.setDropdownMenu = (list) => {
        component.find('.dropdown-menu').innerHTML = buildDropdown(list);

        component.findAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', onChange);
        });
    };

    component.value = (param) => {
        const field = component.find('.btn-choice');
        
        if (param !== undefined) {
            let label = typeof param === 'object' ? param.label : param;
            if (valueType === 'html') {
                field.innerHTML = label;
            } else {
                field.innerText = label;
            }
            if (param.id) {
                field.dataset.id = param.id;
            }
            if (param.path) {
                field.dataset.path = param.path;
            }
        } else {
            if (valueType === 'html') {
                return component.find('.btn-choice');
            } else {
                return field.innerText === 'Choose' ? '' : field.innerText;
            }
        }
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

    component.selected = () => {
        const field = component.find('.btn-choice');

        return readOnly ? value.path : options.find(item => item.label === field.innerText)?.path;
    };

    component.data = () => {
        return readOnly ? value : options[parseInt(component.find('.btn-choice').dataset.id)];
    };

    return component;
}
// @END-File
