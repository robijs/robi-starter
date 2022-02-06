import { Component } from '../Actions/Component.js'
import { EditLayout } from '../Actions/EditLayout.js'
import { ModifyFile } from '../Actions/ModifyFile.js'
import { Store } from '../Robi.js';

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export function ViewTools(param) {
    const {
        route,
        parent,
        position
    } = param;

    let isOpen = false;

    const component = Component({
        html: /*html*/ `
            <div class='viewtools'>
                <button class='btn tools' type='button'>•••</button>
                <div class='grow-in-center'>
                    <!-- Add Table -->
                    <button class='dropdown-item add-table' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 48px;'>
                                <use href='#icon-bs-table'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Table</div>
                    </button>
                    <!-- Add Chart -->
                    <button class='dropdown-item add-chart' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 48px;'>
                                <use href='#icon-bs-bar-chart'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Chart</div>
                    </button>
                    <!-- Add Text Block -->
                    <button class='dropdown-item add-text-block' type='button'>
                        <div class='icon-container'>
                            <span class='d-flex align-items-center justify-content center' style='font-size: 28; font-weight: 600; color: var(--primary);'>
                                <span>Aa</span>
                                <svg class='icon' style='font-size: 32px;'>
                                    <use href='#icon-bs-cursor-text'></use>
                                </svg>
                            </span>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Text block</div>
                    </button>
                    <!-- Add Light Button -->
                    <button class='dropdown-item add-button-light' type='button'>
                        <div class='icon-container '>
                            <div class='btn btn-robi'>Button</div>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Light</div>
                    </button>
                    <!-- Add Dark Button -->
                    <button class='dropdown-item add-button-dark' type='button'>
                        <div class='icon-container'>
                            <div class='btn btn-robi-reverse'>Button</div>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Dark</div>
                    </button>
                    <!-- Divider -->
                    <div class='dropdown-divider'></div>
                    <!-- Edit Layout -->
                    <button class='dropdown-item edit-layout' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 40px; fill: var(--color);'>
                                <use href='#icon-bs-grid-1x2'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px; color: var(--color);'>Edit Layout</div>
                    </button>
                    <!-- Edit Source -->
                    <button class='dropdown-item edit-source' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 40px; fill: var(--color);'>
                                <use href='#icon-bs-code'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px; color: var(--color);'>Edit Source</div>
                    </button>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0px;
                right: 0px;
                height: 62px;
                width: 100%;
                color: var(--primary);
            }

            #id .tools {
                cursor: pointer;
                color: var(--primary);
                font-size: 20px;
                transition: transform 300ms ease, background-color 250ms ease;
                padding: 6px 11.82px; /* sets button width to an even 50px */
            }

            #id .scale-up {
                transform: scale(2);
            }

            #id .menu {

            }

            #id .grow-in-center {
                z-index: 10000;
                top: 5px;
                position: absolute;

                transform: scale(0);
                transform-origin: top;
                opacity: 0;
                transition: transform 150ms ease, opacity 150ms ease;
            }

            #id .grow-in-center.open {
                transform: scale(1);
                transform-origin: top;
                opacity: 1;
            }

            #id .dropdown-divider {
                height: unset;
                margin: .5rem;
                overflow: hidden;
                border-left: 1px solid var(--border-color);
                border-top: none;
            }

            #id .dropdown-item {
                position: relative;
                display: flex;
                flex-direction: column;
                color: var(--primary);
                align-items: center;
                justify-content: center;
                padding: 10px;
                border-radius: 20px;
                transition: filter 300ms ease, background-color 150ms ease;
            }

            #id .dropdown-item .icon {
                fill: var(--primary);
            }

            /* Border */
            #id .border {
                border: solid 2px var(--primary);
            }

            #id .icon-container {
                border-radius: 20px;
                padding: 10px;
                width: 90px;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            #${parent.get().id} .save-edit-layout,
            #${parent.get().id} .cancel-edit-layout {
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0px;
                height: 62px;
                padding: 0px 15px;
                border-radius: 10px;
            }

            #${parent.get().id} .save-edit-layout {
                left: 0px;
            }

            #${parent.get().id} .cancel-edit-layout {
                right: 0px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .tools',
                event: 'click',
                listener(event) {
                    this.classList.add('scale-up');

                    if (!isOpen) {
                        isOpen = true;

                        component.find('.grow-in-center').classList.add('open');
                        setTimeout(() => {
                            Store.get('appcontainer').on('click', close);
                        }, 0);
                    } else {
                        close();
                    }
                }
            },
            {
                selector: '#id .edit-layout',
                event: 'click',
                listener(event) {
                    // Disable sidebar
                    Store.get('sidebar').get().style.pointerEvents = 'none';

                    // Hide tools
                    component.find('.tools').classList.add('d-none');

                    // Add Save and Cancel buttons
                    parent.append(/*html*/ `
                        <div class='edit-layout-buttons'>
                            <div class='save-edit-layout'>
                                <button type='button' class='btn'>
                                    <span style='color: var(--primary); font-size: 15px; font-weight: 500;'>Save</span>
                                </button>
                            </div>
                            <div class='cancel-edit-layout'>
                                <button type='button' class='btn'>
                                    <span style='color: var(--primary); font-size: 15px; font-weight: 500;'>Cancel</span>
                                </button>
                            </div>
                        </div>
                    `);

                    // Save
                    parent.find('.save-edit-layout').on('click', () => {
                        // Edit file
                        EditLayout({
                            order: [...parent.findAll('.robi-row')].map(row => parseInt(row.dataset.row.split('-')[1])),
                            path: `App/src/Routes/${route.path}`,
                            file: `${route.path}.js`
                        });
                    });

                    // Cancel
                    parent.find('.cancel-edit-layout').on('click', turnOfSortable);

                    // Turn off sortable
                    function turnOfSortable() {
                        // Reset order
                        [...parent.findAll('.robi-row')]
                        .sort((a, b) => parseInt(a.dataset.row.split('row-')[1]) - parseInt(b.dataset.row.split('row-')[1]))
                        .forEach(row => parent.get().append(row));

                        setTimeout(() => {
                            $(`#${parent.get().id}`).sortable('destroy');
                            $(`#${parent.get().id} .robi-row > *`).css({'pointer-events': 'auto', 'user-select': 'auto'});
                        }, 0);

                        // Remove buttons
                        parent.find('.edit-layout-buttons').remove();

                        // Show tools
                        component.find('.tools').classList.remove('d-none');

                        // Enable sidebar
                        Store.get('sidebar').get().style.pointerEvents = 'all';
                    }

                    // Turn on sortable
                    $(`#${parent.get().id}`).sortable({ items: '.robi-row' });
                    $(`#${parent.get().id} .robi-row > *`).css({'pointer-events': 'none', 'user-select': 'none'});
                }
            },
            {
                selector: '#id .edit-source',
                event: 'click',
                listener(event) {
                    ModifyFile({
                        path: `App/src/Routes/${route.path}`,
                        file: `${route.path}.js`
                    });
                }
            }
        ],
        onAdd() {

        }
    });

    function close(event) {
        isOpen = false;

        component.find('.grow-in-center').classList.remove('open');
        component.find('.tools').classList.remove('scale-up');

        Store.get('appcontainer').off('click', close);
    }

    return component;
}
// @END-File
