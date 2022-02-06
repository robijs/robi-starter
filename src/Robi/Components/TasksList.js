import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function TasksList(param) {
    const {
        label, labelWeight, labelSize, options, onCheck, direction, wrap, parent, width, position, margin, padding, fieldMargin, onAddNewItem, onDelete
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<div class='form-field-label'>${label}</div>` : ''}
                ${createChoiceGroups()}
            </div>   
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            #id .form-field-label {
                font-size: ${labelSize || '1.1em'};
                font-weight: ${labelWeight || 'bold'};
                padding: 5px 0px;
            }

            #id .form-field-multi-select-container {
                display: flex;
                flex-direction: ${direction || 'column'};
                flex-wrap: ${wrap || 'wrap'};
                user-select: none;
                padding: ${padding || '0px 0px 20px 0px'};
                margin: ${margin || '0px'};
            }

            #id .form-field-multi-select-row {
                /* width: ${width || '100%'}; */
                width: ${width || 'unset'};
                display: flex;
                flex-direction: row;
            }

            #id .form-field-multi-select-row:first-child {
                margin-top: 5px;
            }

            #id .form-field-multi-select-row:not(:last-child) {
                margin-bottom: 15px;
            }

            #id .form-field-multi-select-row.flex-start {
                align-items: flex-start;
            }

            #id .form-field-multi-select-row.flex-start .form-field-multi-select-value,
            #id .form-field-multi-select-row.flex-start .select-all-title {
                margin-top: 2px;
            }

            ${direction === 'row' ?
            /*css*/ `
                    #id .form-field-multi-select-row {
                        margin-left: 20px;
                        margin-bottom: 10px;
                    }
                ` :
                ''}

            #id .form-field-multi-select-value,
            #id .select-all-title {
                white-space: nowrap;
                margin-left: 5px;
                padding: 0px;
                font-size: 1em;
                border: none;
                outline: none;
            }

            #id .select-all-title {
                color: var(--primary);
                font-weight: 500;
                padding: 5px 0px;
            }

            /** Checkboxes */
            #id label {
                margin-bottom: 0px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #id input[type='checkbox'] {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            #id input[type='checkbox'] ~ .toggle {
                width: 20px;
                height: 20px;
                position: relative;
                display: inline-block;
                vertical-align: middle;
                background: white;
                border: solid 2px lightgray;
                border-radius: 4px;
                cursor: pointer;
            }

            #id input[type='checkbox']:hover ~ .toggle {
                border-color: mediumseagreen;
            }

            #id input[type='checkbox']:checked ~ .toggle {
                border: solid 2px mediumseagreen;
                background: mediumseagreen url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
            }

            /** Add an item */
            #id .add-an-item {
                background: transparent;
                border-bottom: solid 2px gray;
                width: 100%;
                min-width: 100px;
            }

            #id .add-an-item:focus,
            #id .add-an-item:active {
                border-bottom: solid 2px var(--primary);
            }

            /** Placeholder */
            /** {@link https://stackoverflow.com/a/61659129} */
            #id [contenteditable=true]:empty:before{
                content: attr(placeholder);
                pointer-events: none;
                /* display: block; */ /* For Firefox */
            }

            /** Delete task */
            #id .delete-task {
                margin-left: 10px;
                color: firebrick;
                cursor: pointer;
                display: none;
                font-size: 1.5em;
                line-height: .75;
            }

            #id .form-field-multi-select-row:hover > .delete-task {
                display: inline;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id  input.select-all',
                event: 'change',
                listener: selectAll
            },
            {
                selector: '#id input:not(.select-all)',
                event: 'change',
                listener: toggleSelectALL
            },
            {
                selector: '#id .form-field-multi-select-value.add-an-item',
                event: 'keypress',
                listener(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();

                        /** Runtime */
                        if (onAddNewItem) {
                            onAddNewItem(event);
                        }

                        return false;
                    }
                }
            },
            {
                selector: '#id .form-field-multi-select-value.add-an-item',
                event: 'focusout',
                listener: onAddNewItem
            },
            {
                selector: '#id .form-field-multi-select-value.add-an-item',
                event: 'paste',
                /** {@link https://stackoverflow.com/a/12028136} */
                listener(e) {
                    // cancel paste
                    e.preventDefault();

                    // get text representation of clipboard
                    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

                    // insert text manually
                    document.execCommand("insertHTML", false, text);
                }
            },
            {
                selector: '#id .delete-task',
                event: 'click',
                listener(event) {
                    event.target.closest('.form-field-multi-select-row ').remove();

                    onDelete(event.target.dataset.itemid);
                }
            }
        ]
    });

    function createChoiceGroups() {
        let html = '';

        options.forEach(group => {
            const {
                title, items, align
            } = group;

            html += /*html*/ `
                <div class='form-field-multi-select-container' data-group='${title}'>
            `;

            if (title !== '') {
                html += /*html*/ `
                    <div class='form-field-multi-select-row ${align}'>
                        <label>
                            <input type='checkbox' class='select-all' data-group='${title}'>
                            <span class='toggle'></span>
                        </label>
                        <span class='select-all-title'>${title}</span>
                    </div>
                `;
            }

            items.forEach(item => {
                html += rowTemplate(item, title, align);
            });

            html += /*html*/ `
                    <div class='form-field-multi-select-row'>
                        <label>
                            <input type='checkbox' disabled>
                            <span class='toggle'></span>
                        </label>
                        <!-- <input type='text' class='form-field-multi-select-value add-an-item' placeholder='Add an item'> -->
                        <div class='form-field-multi-select-value add-an-item' placeholder='Add an item' contenteditable='true'></div>
                    </div>
                </div>
            `;
        });

        return html;
    }

    function rowTemplate(item, group, align) {
        const {
            id, value, checked, CompletedBy, Completed
        } = item;

        // console.log(id, CompletedBy);
        return /*html*/ `
            <div class='form-field-multi-select-row ${align ? align : ''}'>
                <label>
                    <input type='checkbox' data-group='${group}' data-itemid='${id}'${checked ? ' checked' : ''}>
                    <span class='toggle'></span>
                </label>
                <span class='form-field-multi-select-value'>${value}</span>
                <span class='delete-task' data-itemid='${id}'>&times;</span>
                <!-- If Completed, show name -->
                <!-- <span class="assigned-name" data-account="stephen.matheis"></span> -->
            </div>
        `;
    }

    /** Select all Radio buttons in group */
    function selectAll(event) {
        const group = this.dataset.group;
        const state = this.checked;
        const radioButtons = component.findAll(`input[data-group='${group}']`);

        radioButtons.forEach(button => {
            button.checked = state;
        });
    }

    /** Auto toggle Group Title Radio button */
    function toggleSelectALL(event) {
        const group = this.dataset.group;
        const all = component.findAll(`input[data-group='${group}']:not(.select-all)`).length;
        const checked = component.findAll(`input[data-group='${group}']:not(.select-all):checked`).length;
        const state = all === checked ? true : false;

        const selectAll = component.find(`input.select-all[data-group='${group}']`);

        if (selectAll) {
            selectAll.checked = state;
        }

        if (onCheck) {
            onCheck(event);
        }
    }

    component.setValue = (itemId, value) => {
        const checkbox = component.find(`input[data-itemid='${itemId}']`);

        if (checkbox) {
            checkbox.checked = value;
        }
    };

    component.addOption = (param) => {
        const {
            option, group
        } = param;

        const container = component.find(`.form-field-multi-select-container[data-group='${group}']`);

        container.insertAdjacentHTML('beforeend', rowTemplate(option, group, true));

        const node = component.find(`input[data-group='${group}'][data-itemid='${itemToAdd.id}']`);

        if (node) {
            node.addEventListener('change', toggleSelectALL);
        }
    };

    component.addItemAbove = (param) => {
        const {
            group, itemToAdd, item
        } = param;

        const row = item.closest('.form-field-multi-select-row');

        row.insertAdjacentHTML('beforebegin', rowTemplate(itemToAdd, group, true));

        const newCheckbox = component.find(`input[data-group='${group}'][data-itemid='${itemToAdd.id}']`);

        if (newCheckbox) {
            newCheckbox.addEventListener('change', toggleSelectALL);
        }

        const newDelete = component.find(`.delete-task[data-itemid='${itemToAdd.id}']`);

        if (newDelete) {
            newDelete.addEventListener('click', event => {
                event.target.closest('.form-field-multi-select-row ').remove();

                onDelete(event.target.dataset.itemid);
            });
        }

        item.innerText = '';
    };

    component.value = (type) => {
        const rows = component.findAll('.form-field-multi-select-row input:checked');

        return [...rows].map(item => {
            if (type === 'id') {
                return parseInt(item.dataset.itemid);
            } else {
                const value = item.closest('.form-field-multi-select-row').querySelector('.form-field-multi-select-value');

                return value.innerText;
            }
        });
    };

    return component;
}
// @END-File
