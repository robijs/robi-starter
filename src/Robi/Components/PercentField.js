import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function PercentField(param) {
    const {
        label, description, value, readOnly, parent, position, width, margin, padding, background, borderRadius, flex, maxWidth, fieldMargin, optional, onKeydown, onFocusout
    } = param;

    let percentage = value !== undefined ? Math.round(parseFloat(value) * 100) : '';

    const component = Component({
        html: /*html*/ `
            <div>
                <label>${label}</label>
                <div class="input-group mb-3 ${setColor(percentage)}">
                    <input type="number" class="form-control" value="${percentage}" ${readOnly ? 'readonly' : ''}>
                    <div class="input-group-append">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                ${margin ? `margin: ${margin};` : ''}
            }

            #id label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
                margin-bottom: 0px;
            }

            #id input[readonly] {
                pointer-events: none;
            }

            /* Green */
            #id .input-group.green input,
            #id .input-group.green .input-group-text {
                background: #d4edda;
                border: solid 1px #c3e6cb;
                color: #155724;
            }

            /* Yellow */
            #id .input-group.yellow input,
            #id .input-group.yellow .input-group-text {
                background: #fff3cd;
                border: solid 1px #ffeeba;
                color: #856404;
            }

            /* Red */
            #id .input-group.red input,
            #id .input-group.red .input-group-text {
                background: #f8d7da;
                border: solid 1px #f5c6cb;
                color: #721c24;
            }

            #id input:active,
            #id input:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 1px var(--primary);
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-field-single-line-text',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id .form-field-single-line-text',
                event: 'focusout',
                listener: onFocusout
            }
        ]
    });

    function setColor(percentage) {
        if (percentage >= 100) {
            return 'green';
        }

        if (percentage < 100 && percentage >= 50) {
            return 'yellow';
        }

        if (percentage < 50) {
            return 'red';
        }

        if (!percentage || isNaN(percentage)) {
            return '';
        }
    }

    component.focus = () => {
        const field = component.find('.form-field-single-line-text');

        field.focus();
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
        const field = component.find('input');

        if (param !== undefined) {
            percentage = Math.round(parseFloat(param) * 100);

            field.value = percentage;

            const inputGroup = component.find('.input-group');
            const color = setColor(percentage);

            inputGroup.classList.remove('green', 'yellow', 'red');

            if (color) {
                inputGroup.classList.add(color);
            }
        } else {
            return field.value;
        }
    };

    return component;
}
// @END-File
