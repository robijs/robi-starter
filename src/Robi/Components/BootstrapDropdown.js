import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function BootstrapDropdown(param) {
    const {
        action, label, description, parent, position, options, value, fieldMargin, padding, setWidthDelay, maxHeight, maxWidth, valueType, buttonStyle
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='dropdown'>
                    <button class='btn dropdown-toggle' ${buttonStyle ? `style='${buttonStyle}'` : ''} type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                        ${value || `<span style='opacity: 0;'>Choose</span>`}
                    </button>
                    <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                        <div class='scroll-container'>
                            ${buildDropdown(options)}
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                padding: ${padding || '0px'};
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .dropdown-toggle {
                min-height: 33.5px;
                min-width: 160px;
                font-size: 13px;
                border-radius: 0.125rem 0px;
                border: 1px solid #ced4da;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #id .dropdown-item {
                font-size: 13px;
                cursor: pointer;
            }

            #id .dropdown-menu {
                margin: .125rem;
                padding: .125rem;
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
                ${maxWidth ? `min-width: ${maxWidth};` : ''}
            }

            #id .dropdown-item {
                border-radius: 8px;
            }

            #id .dropdown-item:hover {
                background: ${App.get('primaryColor') + '20'};
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

                    if (action) {
                        action(event);
                    }
                }
            }
            // TODO: Add scroll through this with up and down arrow keys
        ],
        onAdd() {
            // // FIXME: Why does adding a timeout work?
            // setTimeout(() => {
            //     // FIXME: assumes maxWidth is px
            //     component.find('.dropdown-toggle').style.width = `${component.find('.dropdown-menu').offsetWidth || (parseInt(maxWidth?.replace('px')) || 160)}px`;
            //     component.find('.dropdown-menu').classList.remove('hidden');
            // }, setWidthDelay || 100);
        }
    });

    function buildDropdown(items) {
        return items
            .map(dropdown => dropdownTemplate(dropdown))
            .join('\n');
    }

    function dropdownTemplate(dropdown) {
        const {
            label, path
        } = dropdown;

        return /*html*/ `
            <div class='dropdown-item' data-path='${path || ''}'>${label}</div>
        `;
    }

    component.setDropdownMenu = (list) => {
        component.find('.dropdown-menu').innerHTML = buildDropdown(list);

        component.findAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', action);
        });
    };

    component.value = (param) => {
        const field = component.find('.dropdown-toggle');

        if (param !== undefined) {
            if (valueType === 'html') {
                field.innerHTML = param;
            } else {
                field.innerText = param;
            }
        } else {
            if (valueType === 'html') {
                return component.find('.dropdown-toggle');
            } else {
                return field.innerText;
            }
        }
    };

    component.selected = () => {
        const field = component.find('.dropdown-toggle');

        return options.find(item => item.label === field.innerText)?.path
    };

    return component;
}
// @END-File
