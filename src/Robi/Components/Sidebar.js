import { Component } from '../Actions/Component.js'
import { GenerateUUID } from '../Actions/GenerateUUID.js'
import { Route } from '../Actions/Route.js'
import { BootstrapButton } from './BootstrapButton.js'
import { BootstrapTextarea } from './BootstrapTextarea.js'
import { Modal } from './Modal.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { AddRoute } from '../Actions/AddRoute.js'
import { OrderRoutes } from '../Actions/OrderRoutes.js'
import { BlurOnSave } from '../Actions/BlurOnSave.js'
import { HideRoutes } from '../Actions/HideRoutes.js'
import { Wait } from '../Actions/Wait.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Sidebar({ parent, path }) {
    const component = Component({
        name: 'sidebar',
        html: /*html*/ `
            <div class='sidebar' data-mode='open'>
                <div class='w-100 d-flex justify-content-between align-items-center collapse-container'>
                    <span class='icon-container collapse'>
                        <svg class='icon'>
                            <use href='#icon-bs-layout-sidebar-nested'></use>
                        </svg>
                    </span>
                    <!-- Developer options --> 
                    ${
                        Store.user().Role === 'Developer' ?
                        (() => {
                            const id = GenerateUUID();

                            return /*html*/ `
                                <div class='dev-buttons-container'>
                                    <div class="dropdown">
                                        <button class="btn w-100 open-dev-menu" type="button" id="${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Edit
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="${id}">
                                            <div class="grown-in-top-left">
                                                <button class="dropdown-item modify-routes" type="button">Modify routes</button>
                                                <button class="dropdown-item reorder-routes" type="button">Reorder routes</button>
                                                <button class="dropdown-item hide-routes" type="button">Hide routes</button>
                                                <div class="dropdown-divider"></div>
                                                <button class="dropdown-item delete-routes" type="button">Delete routes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        })() : ''
                    }
                </div>
                <div class='title-container position-relative'>
                    <h3 class='title'>${App.get('title')}</h3>
                </div>
                <div class='nav-container'>
                    ${buildNav()}
                </div>
                <div style='padding: 0px 15px; overflow: hidden;'>
                ${
                    Store.user().Role === 'Developer' ?
                    /*html*/ `
                        <span class='nav add-route'>
                            <span class='icon-container' style='padding: 0px;'>
                                <span class='square d-flex' style='padding: 0px; margin: 7px'>
                                    <svg class='icon' style='font-size: 28;'><use href='#icon-bs-plus'></use></svg>
                                </span>
                            </span>
                            <span class='text' data-width='200px' style='white-space: nowrap; color: ${App.get('primaryColor')}'>New Route</span>
                        </span>
                    `: ''
                }
                </div>
                <!-- Settings -->
                <div class='settings-container'>
                    <span class='nav ${(path === 'Settings') ? 'nav-selected' : ''} settings' data-path='Settings'>
                        <span class='icon-container-wide'>
                            <svg class='icon'><use href='#icon-bs-gear'></use></svg>
                        </span>
                        <!-- <span class='text'>Settings</span> -->
                    </span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.sidebar {
                position: relative;
                user-select: none;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                background: ${App.gradientColor ? `linear-gradient(${App.get('gradientColor')})` : App.get('backgroundColor')};
                border-right: solid 1px #d6d8db80;
                height: 100vh;
                transition: width 300ms, min-width 300ms
            }

            #id.sidebar.closed {
                min-width: 0vw;
            }

            /* Title */
            #id h3 {
                padding: 0px 20px 10px 20px;
                margin: 0px;
                font-weight: 700;
                width: 100%;
                white-space: nowrap;
            }

            /* Nav Container */
            .nav-container {
                position: relative;
                overflow: overlay;
                width: 100%;
                padding: 0px 15px;
                overflow-x: hidden;
            }

            /* Settings */
            .settings-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                width: calc(100% - 30px);
                margin: 20px 15px;
            }

            .sidebar .nav {
                display: flex;
                align-items: center;
                width: 100%;
                height: 42.5px;
                cursor: pointer;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                border-radius: 10px;
                transition: width 300ms ease;
            }

            /* .sidebar .nav:not(.nav-selected):hover {
                background-color: ${App.get('primaryColor') + '20'};
            } */

            .sidebar .icon-container {
                display: flex;
                padding: 10px 10px;
            }

            .sidebar .icon-container-wide {
                display: flex;
                padding: 10px 10px;
            }

            .sidebar .nav .icon {
                fill: ${App.get('primaryColor')};
                font-size: 22px;
            }

            .sidebar .text {
                flex: 1;
                font-size: 15px;
                font-weight: 500;
                padding: 10px 0px;
                min-width: 200px;
                white-space: nowrap;
                transition: width 300ms, min-width 300ms, opacity 400ms;
            }

            .sidebar .text.collapsed {
                min-width: 0px;
                overflow: hidden;
                flex: 0;
            }

            /* Selected */
            .sidebar .nav-selected {
                background: ${App.get('primaryColor')};
            }

            .sidebar .nav.nav-selected  .icon {
                fill: white;
                stroke: white;
            }

            .sidebar .nav.nav-selected .text {
                color: white;
            }

            @media (max-width: 1300px) {
                #id.sidebar .nav .text.closed {
                    display: none;
                }
    
                #id.sidebar .logo.closed {
                    image-rendering: pixelated;
                    width: 40px;
                }
    
                #id.sidebar .open-close.closed {
                    justify-content: center;
                }
            }

            /* Edit menu */
            #id .collapse-container {
                padding: 10px 15px;
            }

            #id .collapse-container .btn {
                color: ${App.get('primaryColor')};
                font-weight: 500;
            }

            #id .collapse-container .icon {
                fill: ${App.get('primaryColor')};
                font-size: 22px;
            }
            
            #id .collapse-container .icon-container {
                cursor: pointer;
            }

            #id .dropdown-menu {
                /* box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px; */
                background: transparent;
                border-radius: 10px;
                border: none;
                padding: none;
            }

            #id .dev-buttons-container {
                position: relative;
                width: 50.41px;
                transition: width 150ms ease, opacity 150ms ease;
            }

            #id .dev-buttons-container.closed {
                display: none !important;
            }

            #id .dev-buttons-container .open-dev-menu {
                font-weight: 500;
                font-size: 15px;
            }

            #id .dev-buttons-container .dropdown-toggle:focus {
                box-shadow: none !important;
            }

            #id .dev-buttons-container .dropdown-item {
                outline: none;
                font-size: 14px;
            }

            #id .dev-buttons-container .delete-routes {
                color: firebrick;
            }

            #id .square {
                background: #e9ecef;
                border-radius: 6px;
            }

            #id .add-route {
                transition: width 150ms ease, opacity 150ms ease;
            }

            @keyframes fade-out-left {
                from {
                    transform: translateX(0px);
                    opacity: 1;
                    width: 0px;
                }
                to {
                    transform: translateX(-${App.get('title').length + 20}px);
                    opacity: 0;
                    width: 0px;
                }
            }

            @keyframes fade-out {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes fade-in-right {
                from {
                    transform: translateX(-${App.get('title').length + 20}px);
                    opacity: 0;
                    width: 0px;
                }
                to {
                    transform: translateX(0px);
                    opacity: 1;
                    width: 0px;
                }
            }

            @keyframes grown-in-top-left {
                from {
                    transform: scale(0);
                    transform-origin: top left;
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    transform-origin: top left;
                    opacity: 1;
                }
            }

            @keyframes grab-show {
                from {
                    width: 0px;
                    opacity: 0;
                }
                to {
                    width: 22px;
                    opacity: 1;
                }
            }

            @keyframes grab-show-switch {
                from {
                    width: 0px;
                    opacity: 0;
                }
                to {
                    width: 44px;
                    opacity: 1;
                }
            }

            .fade-out {
                animation: 300ms ease-in-out fade-out;
            }
            
            .fade-in {
                animation: 150ms ease-in-out fade-in;
            }

            .fade-out-left {
                animation: 150ms ease-in-out fade-out-left;
            }

            .fade-in-right {
                animation: 300ms ease-in-out fade-in-right;
            }

            .grown-in-top-left {
                animation: 150ms ease-in-out forwards grown-in-top-left;
                background: white;
                border-radius: 10px;
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                padding: .5rem;
            }

            .grab:not(.switch) {
                width: 22px;
                opacity: 1;
                padding: 10px 0px;
                display: flex;
            }

            .grab.switch {
                width: 44px;
                transform: translateX(44px);
                height: 42.5px;
                opacity: 1;
                padding: 10px 0px;
            }

            .grab-show:not(.switch) {
                animation: 300ms ease-in-out grab-show;
            }

            .grab-show.switch {
                animation: 300ms ease-in-out grab-show-switch;
            }

            .grab-show-reverse:not(.switch) {
                animation: 300ms ease-in-out forwards grab-show;
                animation-direction: reverse;
            }

            .grab-show-reverse.switch {
                animation: 300ms ease-in-out forwards grab-show-switch;
                animation-direction: reverse;
            }

            #id .nav.ui-sortable-handle {
                width: auto;
                background: ${App.get('backgroundColor')};
            }

            #id .nav.ui-sortable-helper {
                width: auto;
                background: ${App.get('backgroundColor')};
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
            }

            #id .edit-buttons {
                position: absolute;
                top: 0px;
                right: 0px;
                height: 100%;
                display: flex;
                align-items: center;
                opacity: 0;
                transition: opacity 150ms ease;
            }

            #id .save-edit,
            #id .cancel-edit {
                cursor: pointer;
                font-size: 15px;
            }

            #id .save-edit {
                margin-right: 10px;
                font-weight: 500;
                opacity: 0;
                pointer-events: none;
                transition: opacity 150ms ease;
            }

            #id .save-edit * {
                color: ${App.get('primaryColor')};
            }
        `,
        parent: parent,
        position: 'afterbegin',
        permanent: true,
        events: [
            {
                selector: '.nav:not(.control):not(.add-route)',
                event: 'click',
                listener: routeToView
            },
            {
                selector: '.logo',
                event: 'click',
                listener(event) {
                    Route(this.dataset.path);
                }
            },
            {
                selector: '#id .collapse',
                event: 'click',
                listener: toggleSidebarMode
            },
            {
                selector: '#id .add-route',
                event: 'click',
                listener(event) {
                    AddRoute();
                }
            },
            {
                selector: '#id .modify-routes',
                event: 'click',
                listener: modifyRoutes
            },
            {
                selector: '#id .reorder-routes',
                event: 'click',
                listener: reorderRoutes
            },
            {
                selector: '#id .hide-routes',
                event: 'click',
                listener: hideRoutes
            },
            {
                selector: '#id .delete-routes',
                event: 'click',
                listener: removeRoutes
            }
        ],
        onAdd() {
            setTimeout(() => {
                // Set nav width
                component.findAll('.text').forEach(node => {
                    node.style.width = `${node.offsetWidth}px`;
                    node.dataset.width = `${node.offsetWidth}px`;
                });
            }, 0); // FIXME: Will this always work, even on CarePoint/LaunchPad?

            // Window resize event
            window.addEventListener('resize', event => {
                const mode = component.get().dataset.mode;

                if (window.innerWidth <= 1305) {
                    closeSidebar(mode);
                } else {
                    openSidebar(mode);
                }
            });
        }
    });

    // TODO: blur maincontainer (add transition) and remove pointer events
    function reorderRoutes(event) {
        console.log('reorder routes');

        // Disable all routes
        component.findAll('.nav-container .nav').forEach(node => {
            node.classList.remove('nav-selected');
            node.dataset.shouldroute = 'no';
            node.style.cursor = 'initial';
        });

        // Find sortable nav
        const nav = component.findAll('.nav-container .nav:not([data-type="system"])');
        const startOrder = [...nav].map(node => node.dataset.path);

        console.log(startOrder);

        // disable edit
        component.find('.open-dev-menu').disabled = true;
        component.find('.open-dev-menu').style.opacity = '0';

        // Show cancel
        component.find('.dev-buttons-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex edit-buttons'>
                <div class='save-edit'>
                    <span>Save</span>
                </div>
                <div class='cancel-edit'>
                    <span>Cancel</span>
                </div>
            </div>
        `);

        // Transition
        component.find('.edit-buttons').style.opacity = '1';

        // Add cancel behavior
        component.find('.cancel-edit').addEventListener('click', event => {
            // Enable route
            component.findAll('.nav-container .nav').forEach(node => {
                node.dataset.shouldroute = 'yes';
                node.style.cursor = 'pointer';
            });

            // Animate cancel fade out
            component.find('.cancel-edit').addEventListener('animationend', event => {
                console.log('cancel end');

                // Select node
                const selected = location.href.split('#')[1].split('/')[0];
                component.find(`.nav[data-path='${selected}']`).style.transition = 'background-color 200ms ease';
                component.find(`.nav[data-path='${selected}']`)?.classList.add('nav-selected');
                setTimeout(() => {
                    component.find(`.nav[data-path='${selected}']`).style.transition = 'auto';
                }, 200);

                // Remove cancel edit button
                component.find('.edit-buttons')?.remove();

                // Turn edit back on
                component.find('.open-dev-menu').disabled = false;
                component.find('.open-dev-menu').style.opacity = '1';
            });
            component.find('.cancel-edit').classList.add('fade-out');
        
            // Remove sortable
            $(`#${component.get().id} .nav-container`).sortable('destroy');

            // Remove grab handles
            component.findAll('.nav-container .nav .grab').forEach(node => {
                node.addEventListener('animationend', () => node.remove());
                node.classList.add('grab-show-reverse');
            });
        });

        // Add save behavior
        component.find('.save-edit').addEventListener('click', async event => {
            const blur = BlurOnSave({
                message: 'Updating route order'
            });

            await OrderRoutes({
                routes: [...component.findAll('.nav-container .nav:not([data-type="system"])')].map(node => node.dataset.path)
            });

            await blur.off((event) => {
                console.log(event);
                location.reload();
            });
        });

        // Show grab handle
        nav.forEach(node => {
            node.insertAdjacentHTML('afterbegin', /*html*/ `
                <div class='grab'>
                    <svg class='icon'><use href='#icon-bs-list'></use></svg>
                </div>
            `);

            // Remove animation
            node.querySelector('.grab').addEventListener('animationend', event => {
                node.querySelector('.grab').classList.remove('grab-show');
            });
            node.querySelector('.grab').classList.add('grab-show');
        });

        // Make sortable
        $(`#${component.get().id} .nav-container`).sortable({
            items: '.nav:not([data-type="system"])'
        });
        
        $(`#${component.get().id} .nav-container`).disableSelection();

        $(`#${component.get().id} .nav-container`).on('sortstop', (event, ui) => {
            const newOrder = [...component.findAll('.nav-container .nav:not([data-type="system"])')].map(node => node.dataset.path);
            // console.log(startOrder,  newOrder, arraysMatch(startOrder, newOrder));

            if (arraysMatch(startOrder, newOrder)) {
                component.find('.save-edit').style.opacity = '0';
                component.find('.save-edit').style.pointerEvents = 'none';
            } else {
                component.find('.save-edit').style.opacity = '1';
                component.find('.save-edit').style.pointerEvents = 'auto';
            }
        });

        function arraysMatch(arr1, arr2) {
            // Check if the arrays are the same length
            if (arr1.length !== arr2.length) return false;
        
            // Check if all items exist and are in the same order
            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) return false;
            }
        
            // Otherwise, return true
            return true;
        };
    }

    // TODO: show hidden routes in order
    // TODO: blur maincontainer (add transition) and remove pointer events
    function hideRoutes(event) {
        console.log('hide routes');

        // Disable all routes
        component.findAll('.nav-container .nav').forEach(node => {
                node.classList.remove('nav-selected');
                node.dataset.shouldroute = 'no';
                node.style.cursor = 'initial';
        });

        // disable edit
        component.find('.open-dev-menu').disabled = true;
        component.find('.open-dev-menu').style.opacity = '0';

        // Show cancel
        component.find('.dev-buttons-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex edit-buttons'>
                <div class='save-edit'>
                    <span>Save</span>
                </div>
                <div class='cancel-edit'>
                    <span>Cancel</span>
                </div>
            </div>
        `);

        // Make visible
        component.find('.edit-buttons').style.opacity = '1';

        // Add cancel behavior
        component.find('.cancel-edit').addEventListener('click', event => {
            // Enable route
            component.findAll('.nav-container .nav').forEach(node => {
                node.dataset.shouldroute = 'yes';
                node.style.cursor = 'pointer';
            });

            // Animate cancel fade out
            component.find('.cancel-edit').addEventListener('animationend', event => {
                console.log('end cancel');

                // Select node
                const selected = location.href.split('#')[1].split('/')[0];
                component.find(`.nav[data-path='${selected}']`).style.transition = 'background-color 200ms ease';
                component.find(`.nav[data-path='${selected}']`)?.classList.add('nav-selected');
                setTimeout(() => {
                    component.find(`.nav[data-path='${selected}']`).style.transition = 'auto';
                }, 200);

                // Remove cancel edit button
                component.find('.edit-buttons')?.remove();

                // Remove hide
                // console.log(component.find('.hide-label'));
                component.find('.hide-label')?.remove();

                // Turn edit back on
                component.find('.open-dev-menu').disabled = false;
                component.find('.open-dev-menu').style.opacity = '1';
            });
            component.find('.cancel-edit').classList.add('fade-out');
        
            // Remove grab handles
            component.findAll('.nav-container .nav .grab').forEach(node => {
                node.addEventListener('animationend', () => node.remove());
                node.classList.add('grab-show-reverse');
            });
        });

        // Add save behavior
        component.find('.save-edit').addEventListener('click', async event => {
            const blur = BlurOnSave({
                message: 'Hiding routes'
            });

            //TODO: remove nav from DOM
            const routes = toHide();
            
            component.findAll('.nav-container .nav:not([data-type="system"])').forEach(node => {
                if (routes.includes(node.dataset.path)) {
                    node.remove();
                }
            })

            await HideRoutes({
                routes
            });

            // Wait an additional 2 seconds
            console.log('Waiting...')
            await Wait(2000);

            await blur.off((event) => {
                console.log(event);
                location.reload();
            });
        });

        // Add hide label
        // TODO: add absolutely positioned hide label
        component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex justify-content-end position-absolute hide-label' style='bottom: -5px; right: 25px; font-size: 14px; font-weight: 500;'>
                <div>Hide</div>
            </div>
        `);

        // Show hide switch
        const nav = component.findAll('.nav-container .nav:not([data-type="system"])');
        nav.forEach(node => {
            const id = GenerateUUID();

            node.insertAdjacentHTML('beforeend', /*html*/ `
                <div class="custom-control custom-switch grab switch">
                    <input type="checkbox" class="custom-control-input" id='${id}'>
                    <!-- <label class="custom-control-label" for="${id}">Hide</label> -->
                    <label class="custom-control-label" for="${id}"></label>
                </div>
            `);

            // Switch change
            node.querySelector('.custom-control-input').addEventListener('change', event => {
                const checked = toHide();
                console.log(checked);

                if (checked.length) {
                    component.find('.save-edit').style.opacity = '1';
                    component.find('.save-edit').style.pointerEvents = 'auto';
                } else {
                    component.find('.save-edit').style.opacity = '0';
                    component.find('.save-edit').style.pointerEvents = 'none';
                }
            });

            // Remove animation
            node.querySelector('.grab').addEventListener('animationend', event => {
                node.querySelector('.grab').classList.remove('grab-show');
            });
            node.querySelector('.grab').classList.add('grab-show');
        });

        function toHide() {
            return [...component.findAll('.nav .custom-control-input:checked')].map(node => node.closest('.nav').dataset.path);
        }
    }

    // TODO: blur maincontainer (add transition) and remove pointer events
    function modifyRoutes(event) {
        console.log('modify routes');
    }

    // TODO: blur maincontainer (add transition) and remove pointer events
    function removeRoutes(event) {
        // Show modal
        console.log('remove route');

        const modal = Modal({
            title: false,
            disableBackdropClose: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-2'>Remove route</h3>
                `);

                // Site title
                const siteTitle = SingleLineTextField({
                    label: 'Site title',
                    parent: modalBody,
                    onFocusout(event) {
                        siteUrl.value(siteTitle.value().toLowerCase().split(' ').join('-'));
                        appName.value(siteTitle.value().toTitleCase().split(' ').join(''));
                    }
                });

                siteTitle.add();

                const siteDesc = BootstrapTextarea({
                    label: 'Site description',
                    parent: modalBody
                });

                siteDesc.add();

                // Site Url
                const siteUrl = SingleLineTextField({
                    label: 'Site url',
                    addon: App.get('site') + '/',
                    parent: modalBody
                });

                siteUrl.add();

                // App name
                const appName = SingleLineTextField({
                    label: 'App name',
                    parent: modalBody
                });

                appName.add();

                const installBtn = BootstrapButton({
                    action() {
                        console.log('Create route');
                    },
                    classes: ['w-100 mt-5'],
                    width: '100%',
                    parent: modalBody,
                    type: 'danger',
                    value: 'Remove routes'
                });

                installBtn.add();

                const cancelBtn = BootstrapButton({
                    action(event) {
                        console.log('Cancel remove route');

                        modal.close();
                    },
                    classes: ['w-100 mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: 'light',
                    value: 'Cancel'
                });

                cancelBtn.add();
            },
            centered: true,
            showFooter: false,
        });

        modal.add();
    }

    function toggleSidebarMode(event) {
        const mode = component.get().dataset.mode;

        if (mode === 'open') {
            closeSidebar(mode, this);
        } else if (mode === 'closed') {
            openSidebar(mode, this);
        }
    }
    
    function closeSidebar(mode) {
        if (mode !== 'closed') {
            // Collapse nav text nodes
            component.findAll('.text').forEach(item => {
                item.classList.add('collapsed');
                item.style.width = '0px';
                item.style.opacity = '0';
            });

            // Fade out long title to the left
            component.find('.title').addEventListener('animationend', event => {
                // console.log(event.target);
                event.target.remove();
                // Set short title
                component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='fade-in title' style='text-align: center;'>${App.get('title')[0]}</h3>                
                `);
            });
            component.find('.title').classList.add('fade-out-left');

            // Fade out Edit
            component.find('.dev-buttons-container').style.opacity = '0';
            component.find('.dev-buttons-container').style.pointerEvents = 'none';
            component.find('.dev-buttons-container').style.width = '0px';

            // Fade out New route
            component.find('.add-route').style.opacity = '0';
            component.find('.add-route').style.pointerEvents = 'none';

            // Set mode
            component.get().dataset.mode = 'closed';
        }
    }

    function openSidebar(mode) {
        if (mode !== 'open') {
            // Reset nav text node width
            component.findAll('.text').forEach(item => {
                item.classList.remove('collapsed');
                item.style.width = item.dataset.width;
                item.style.opacity = '1';
            });

            // Fade in long title from the left
            component.find('.title').remove();
            component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='title fade-in-right'>${App.get('title')}</h3>
            `);
            component.find('.title').addEventListener('animationend', event => {
                // console.log(event.target);
                event.target.classList.remove('fade-in-right');
            });

            // Fade in Edit
            component.find('.dev-buttons-container').style.opacity = '1';
            component.find('.dev-buttons-container').style.pointerEvents = 'auto';
            // TODO: Get actual width on load
            // FIXME: remove hard coded width
            component.find('.dev-buttons-container').style.width = '50.41px';

            // Fade in New route
            component.find('.add-route').style.opacity = '1';
            component.find('.add-route').style.pointerEvents = 'auto';

            // Set mode
            component.get().dataset.mode = 'open';
        }
    }

    function buildNav() {
        return Store.routes()
            .filter(route => route.path !== 'Settings' && !route.hide)
            .map(route => {
                const {
                    path, icon, roles, type
                } = route;

                if (roles) {
                    if (roles.includes(Store.user().Role)) {
                        return navTemplate(path, icon, type);
                    } else {
                        return '';
                    }
                } else {
                    return navTemplate(path, icon, type);
                }

            }).join('\n');
    }

    function navTemplate(routeName, icon, type) {
        const firstPath = path ? path.split('/')[0] : undefined;

        return /*html*/ `
            <span class='nav ${(firstPath === routeName || firstPath === undefined && routeName === App.get('defaultRoute')) ? 'nav-selected' : ''}' data-path='${routeName}' data-type='${type || ''}'>
                <span class='icon-container'>
                    <svg class='icon'><use href='#icon-${icon}'></use></svg>
                </span>
                <span class='text'>${routeName.split(/(?=[A-Z])/).join(' ')}</span>
            </span>
        `;
    }

    function routeToView() {
        if (this.classList.contains('ui-sortable-handle') || this.dataset.shouldroute === 'no') {
            console.log(`don't route when sorting`);

            return;
        }

        component.findAll('.nav').forEach((nav) => {
            nav.classList.remove('nav-selected');
        });

        this.classList.add('nav-selected');

        Route(this.dataset.path);
    }

    component.selectNav = (path) => {
        component.findAll('.nav').forEach((nav) => {
            nav.classList.remove('nav-selected');
        });

        const nav = component.find(`.nav[data-path='${path}']`);

        if (nav) {
            nav.classList.add('nav-selected');
        }
    };

    return component;
}
// @END-File
