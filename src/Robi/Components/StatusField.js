import { Component } from '../Actions/Component.js'

// @START-File
/**
 * {@link https://getbootstrap.com/docs/4.5/components/dropdowns/}

 * @param {Object} param
 * @returns
 */
export function StatusField(param) {
    const {
        action, label, parent, position, value, margin, padding
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='label'>${label}</div>
                <div class="dropdown">
                    <button class="btn ${setClass(value)} dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${value || "Not Started"}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <div class='dropdown-item'>Not Started</div>
                        <div class='dropdown-item'>In Progress</div>
                        <div class='dropdown-item'>Completed</div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
                padding: ${padding || '0px'};
            }

            #id .label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .dropdown-item {
                cursor: pointer;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener(event) {
                    /** Remove classes */
                    component.find('.dropdown-toggle').classList.remove('btn-outline-danger', 'btn-outline-info', 'btn-outline-success');

                    /** Add new class */
                    component.find('.dropdown-toggle').classList.add(setClass(event.target.innerText));

                    if (action) {
                        action(event);
                    }
                }
            }
        ]
    });

    function setClass(value) {
        switch (value) {
            case 'Not Started':
                return 'btn-outline-danger';
            case 'In Progress':
                return 'btn-outline-info';
            case 'Completed':
                return 'btn-outline-success';
            default:
                break;
        }
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
            field.innerText = param;
        } else {
            return field.innerText;
        }
    };

    return component;
}
// @END-File
