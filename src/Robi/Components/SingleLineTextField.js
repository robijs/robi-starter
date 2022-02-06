import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function SingleLineTextField(param) {
    const {
        addon,
        background,
        borderRadius,
        classes,
        description,
        fieldMargin,
        flex,
        fontSize,
        label,
        margin,
        maxWidth,
        onFocusout,
        onKeydown,
        onKeypress,
        onKeyup,
        optional,
        padding,
        parent,
        placeholder,
        position,
        readOnly,
        value,
        width
    } = param;

    const component = Component({
        html: /*html*/ `
            
            <div class='form-field${classes ? ` ${classes.join(' ')}` : ''}'>
                ${label ? /*html*/ `<label class='field-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${
                    addon ?
                    /*html*/ `
                        <div class='input-group'>
                            <div class='input-group-prepend'>
                                <div class='input-group-text'>${addon}</div>
                            </div>
                            ${Field()}
                        </div>    
                    ` :
                    /*html*/ `
                        ${Field()}
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

            ${
                readOnly ?
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
                `
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .slot-field {
                width: ${width || 'unset'};
                font-size: ${fontSize || '13px'};
                font-weight: 500;
                margin: ${margin || '2px 0px 4px 0px'};
                padding: 5px 10px;
                border-radius: 4px;
                transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            #id .slot-field.readonly {
                font-size: 13px;
                font-weight: 400;
                color: var(--color); 
                background: transparent;
                border: solid 1px transparent;
                margin: 0px;
                padding: 0px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-control',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id .form-control',
                event: 'keyup',
                listener: onKeyup
            },
            {
                selector: '#id .form-control',
                event: 'keypress',
                listener: onKeypress
            },
            {
                selector: '#id .form-control',
                event: 'focusout',
                listener: onFocusout
            }
        ]
    });

    // NOTE: Edge won't respect autocomplete='off', but autocomplete='new-password' seems to work
    function Field() {
        return readOnly ?
        /*html*/ `
            <div type='text' class='slot-field readonly'>${value || ''}</div>
        ` :
        /*html*/ `
            <input type='text' class='form-control' value='${value || ''}' list='autocompleteOff' autocomplete='new-password' placeholder='${placeholder || ''}'>
        `;
    }

    component.focus = () => {
        const field = component.find('.form-control');

        field?.focus();
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
