import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function SingleLineTextField(param) {
    const {
        addon, label, description, value, readOnly, parent, position, width, margin, padding, placeholder, background, borderRadius, flex, maxWidth, fieldMargin, optional, onKeydown, onKeyup, onKeypress, fontSize, onFocusout,
    } = param;

    let events = [];

    if (onKeydown) {
        events.push({
            selector: '#id .form-control',
            event: 'keydown',
            listener: onKeydown
        });
    }

    if (onKeyup) {
        events.push({
            selector: '#id .form-control',
            event: 'keyup',
            listener: onKeyup
        });
    }

    if (onKeypress) {
        events.push({
            selector: '#id .form-control',
            event: 'keypress',
            listener: onKeypress
        });
    }

    if (onFocusout) {
        events.push({
            selector: '#id .form-control',
            event: 'focusout',
            listener: onFocusout
        });
    }

    const component = Component({
        html: /*html*/ `
            
            <div class='form-field'>
                <!-- ${label ? /*html*/ `<label>${label}${optional ? /*html*/ `<span class='optional'><i>Optional</i></span>` : ''}</label>` : ''} -->
                <!-- ${readOnly ? /*html*/ `<div class='form-field-single-line-text readonly'>${value || ''}</div>` : /*html*/ `<div class='form-field-single-line-text editable' contenteditable='true'>${value || ''}</div>`} -->
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${
                    addon ?
                    /*html*/ `
                        <div class='input-group'>
                            <div class='input-group-prepend'>
                                <div class='input-group-text'>${addon}</div>
                            </div>
                            ${
                                readOnly ?
                                /*html*/ `
                                    <div type='text' class='form-field-single-line-text readonly'>${value || ''}</div>
                                ` :
                                /*html*/ `
                                    <!-- Edge won't respect autocomplete='off', but autocomplete='new-password' seems to work -->
                                    <input type='text' class='form-control' value='${value || ''}' list='autocompleteOff' autocomplete='new-password' placeholder='${placeholder || ''}'>
                                `
                            }
                        </div>    
                    ` :
                    /*html*/ `
                        ${
                            readOnly ?
                            /*html*/ `
                                <div type='text' class='form-field-single-line-text readonly'>${value || ''}</div>
                            ` :
                            /*html*/ `
                                <!-- Edge won't respect autocomplete='off', but autocomplete='new-password' seems to work -->
                                <input type='text' class='form-control' value='${value || ''}' list='autocompleteOff' autocomplete='new-password' placeholder='${placeholder || ''}'>
                            `   
                        }
                    `
                }
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                ${flex ? `flex: ${flex};` : ''}
                ${padding ? `padding: ${padding};` : ''}
                ${borderRadius ? `border-radius: ${borderRadius};` : ''}
                ${background ? `background: ${background};` : ''}
            }

            ${readOnly ?
                /*css*/ `
                    #id label {
                        margin-bottom: 0px;
                        font-weight: 500;
                    }
                ` :
                /*css*/ `
                    #id label {
                        font-weight: 500;
                    }
                `}

            /* #id label,
            #id .form-label {
                font-size: .95em;
                font-weight: bold;
                padding: 3px 0px;
            } */

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .form-field-single-line-text {
                width: ${width || 'unset'};
                min-height: 36px;
                font-size: ${fontSize || '13px'};
                font-weight: 500;
                margin: ${margin || '2px 0px 4px 0px'};
                padding: 5px 10px;
                border-radius: 4px;
                background: white;
                border: ${App.get('defaultBorder')};
                transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            #id .form-field-single-line-text.readonly {
                font-size: 14px;
                font-weight: 400;
                color: #495057; /* Bootstrap@4.5.2 input color */
                background: transparent;
                border: solid 1px transparent;
                margin: 0px;
                /* padding: 0px; */
                padding: 0px;
            }

            #id .form-field-single-line-text.editable:active,
            #id .form-field-single-line-text.editable:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${App.get('primaryColor')};
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
        events
    });

    component.focus = () => {
        const field = component.find('.form-control');

        field?.focus();
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

        component.find('.form-field-single-line-text').insertAdjacentHTML('beforebegin', html);
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

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
