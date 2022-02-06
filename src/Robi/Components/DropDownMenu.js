import { Component } from '../Actions/Component.js'
import { Get } from '../Actions/Get.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function DropDownMenu(param) {
    const {
        dropDownField, field, data, list, onSetValue
    } = param;

    const component = Component({
        html: createList(),
        style: /*css*/ `
            /* List Containers */
            .drop-down-menu-container {
                position: relative;
            }

            /* Data list text field */
            .form-list-text {
                width: ${field.offsetWidth}px;
                font-weight: 500;
                font-size: .9em;
                padding: 5px;
                background: white;
                margin: 5px 10px;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            .form-list-text:focus,
            .form-list-text:active {
                outline: none;
            }

            /* Drop Down Menu */
            .drop-down-menu {
                width: ${field.offsetWidth}px;
                white-space: nowrap;
                font-weight: 500;
                padding: 5px 0px;
                background: white;
                margin: 5px 0px;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
                z-index: 10;
                position: absolute;
                top: 0px;
                left: 0px;
                overflow: auto;
            }

            .list-option {
                cursor: pointer;
                padding: 0px 10px;
                border-radius: 4px;
            }

            .list-option-selected {
                background: var(--primary);
                color: var(--secondary)
            }
             
            .list-option:hover {
                background: var(--primary);
                color: var(--secondary)
            }

            /** Loading Shimmer */
            .loading-item {
                border-radius: 4px;
                padding: 5px 10px;
                margin: 5px 10px;
                /* height: 21px; */
                background: #777;
            }
            
            .animate {
                animation: shimmer 2s infinite linear;
                background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
            }

            @keyframes fullView {
                100% {
                    width: 100%;
                }
            }
            
            @keyframes shimmer {
                0% {
                    background-position: -1000px 0;
                }
                100% {
                    background-position: 1000px 0;
                }
            }
        `,
        parent: field,
        position: 'afterend',
        events: [
            {
                selector: '#id .list-option',
                event: 'click',
                listener(event) {
                    const value = event.target.innerText;
                    const id = event.target.dataset.itemid;
                    const index = event.target.dataset.index;

                    addSelectionToField(value, id, index);
                }
            },
            {
                selector: field,
                event: 'keydown',
                listener: selectListOptionWithCursorKeys
            },
            {
                selector: '#id.drop-down-menu-container',
                event: 'mouseenter',
                listener(event) {
                    event.target.allowCancel = false;
                }
            },
            {
                selector: '#id.drop-down-menu-container',
                event: 'mouseleave',
                listener(event) {
                    event.target.allowCancel = true;
                }
            }
        ]
    });

    /** Create List HTML */
    function createList() {
        const fieldPositions = field.getBoundingClientRect();
        const maxHeight = window.innerHeight - fieldPositions.bottom - field.offsetHeight;

        let html = /*html*/ `
            <div class='drop-down-menu-container'>
                <div class='drop-down-menu' style='max-height: ${maxHeight}px'>
        `;

        if (data) {
            data.forEach((option, index) => {
                const {
                    id, value
                } = option;

                html += /*html*/ `
                    <div class='list-option' data-itemid='${id || 0}' data-index='${index}'>${value}</div>
                `;
            });
        } else {
            html += /*html*/ `
                <div class='loading-item animate'>Searching...</div>
            `;
        }

        html += /*html*/ `
                </div>
            </div>
        `;

        return html;
    }

    /** Set field value */
    async function addSelectionToField(value, id, index) {
        const previousValue = field.innerText;

        field.innerText = value;
        field.dataset.itemid = id;

        field.dispatchEvent(new Event('input'), {
            bubbles: true,
            cancelable: true,
        });

        if (list) {
            /** Get item */
            const item = await Get({
                list,
                filter: `Id eq ${id}`
            });

            onSetValue({
                previousValue,
                newValue: item[0]
            });
        } else {
            onSetValue({
                previousValue,
                newValue: data[parseInt(index)]
            });
        }

        dropDownField.removeError();
        component.remove();
    }

    /** Select next option with Up/Down Cursor Keys */
    function selectListOptionWithCursorKeys(event) {
        const key = event.key;

        // Exit if key pressed is not an arrow key or Enter
        if (!key.includes('Arrow') && key !== 'Enter') {
            return;
        } else {
            event.preventDefault();
        }

        const listOptions = component.findAll('.list-option');
        const currentSelected = component.find('.list-option-selected');

        // Add current selection to field if exits and Enter key pressed
        if (key === 'Enter' && currentSelected) {
            const value = currentSelected.innerText;
            const id = currentSelected.dataset.itemid;
            const index = currentSelected.dataset.index;

            addSelectionToField(value, id, index);

            return;
        }

        const currentIndex = [...listOptions].indexOf(currentSelected);
        const nextIndex = key === 'ArrowUp' ? currentIndex - 1 : key === 'ArrowDown' ? currentIndex + 1 : currentIndex;

        if (currentIndex === -1) {
            listOptions[0].classList.add('list-option-selected');
        } else {
            currentSelected.classList.remove('list-option-selected');

            if (listOptions[nextIndex]) {
                listOptions[nextIndex].classList.add('list-option-selected');
            } else if (nextIndex >= listOptions.length) {
                listOptions[0].classList.add('list-option-selected'); // Go back to beginning
            } else if (nextIndex === -1) {
                const lastIndex = listOptions.length - 1; //Go to end

                listOptions[lastIndex].classList.add('list-option-selected');
            }
        }

        scrollToListOptions();
    }

    /** Scroll current selection into view as needed */
    function scrollToListOptions() {
        // Get current selected option
        const currentSelected = component.find('.list-option-selected');

        currentSelected.scrollIntoView({
            block: 'nearest',
            inline: 'start'
        });
    }

    component.cancel = () => {
        const menuContainer = component.get();

        if (menuContainer && menuContainer.allowCancel !== false) {
            component.remove();
        }
    };

    component.removeEvents = () => {
        field.removeEventListener('keydown', selectListOptionWithCursorKeys);
    };

    return component;
}
// @END-File
