import { Alert } from '../Components/Alert.js'
import { Modal } from '../Components/Modal.js'
import { BootstrapButton } from '../Components/BootstrapButton.js'
import { ProgressBar } from '../Components/ProgressBar.js'
import { InstallConsole } from '../Components/InstallConsole.js'
import { Container } from '../Components/Container.js'
import { Lists } from '../Models/Lists.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { DeleteList } from './DeleteList.js'

// @START-File
/**
 * 
 * @param {*} event 
 */
export function DeleteApp() {
    if (App.isDev()) {
        const modal = Modal({
            title: false,
            centered: true,
            showFooter: false,
            close: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');
                
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h4 class='mb-3'>Dev mode instructions</h4>
                `);
        
                const info = Alert({
                    type: 'robi-secondary',
                    text: /*html*/`
                        <code>npm run reset</code>
                    `,
                    parent: modalBody
                });
        
                info.add();
            }
        });

        modal.add();

        return;
    }

    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            // Core lists
            const coreLists = Lists();
            console.log(coreLists);

            // App lists
            // const appLists = lists;
            const appLists = App.lists();
            console.log(coreLists);

            // All Lists
            const lists = App.lists();
            const allLists = Lists().concat(lists);
            console.log(allLists);

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h4 class='mb-3'>All <strong>${App.get('name')}</strong> lists and items will be deleted</h4>
                <ul>
                    ${
                        appLists
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            return /*html*/ `
                                <li>${item.list}</li>
                            `
                        }).join('\n')
                    }
                </ul>
                <h4 class='mt-3 mb-3'>All <strong>Core</strong> lists and items will be deleted</h4>
                <ul>
                    ${
                        coreLists
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            return /*html*/ `
                                <li>${item.list}</li>
                            `
                        }).join('\n')
                    }
                </ul>
                <div class='alert alert-danger mt-5' style='border: none; border-radius: 10px;'>
                    This can't be undone. Proceed with caution.
                </div>
            `);

            const deleteBtn = BootstrapButton({
                async action(event) {
                    console.log('Delete');

                    modal.find('.modal-content').style.width = 'unset';

                    modalBody.style.height = `${modalBody.offsetHeight}px`;
                    modalBody.style.width = `${modalBody.offsetWidth}px`;
                    modalBody.style.overflowY = 'unset';
                    modalBody.style.display = 'flex';
                    modalBody.style.flexDirection = 'column',
                        modalBody.style.transition = 'all 300ms ease-in-out';
                    modalBody.innerHTML = '';
                    modalBody.style.height = '80vh';
                    modalBody.style.width = '80vw';

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='console-title mb-0'>Deleting <strong>${App.get('name')}</strong></h3>
                    `);

                    let progressCount = allLists.length;

                    const progressBar = ProgressBar({
                        parent: modalBody,
                        totalCount: progressCount
                    });

                    Store.add({
                        name: 'install-progress-bar',
                        component: progressBar
                    });

                    progressBar.add();

                    const deleteContainer = Container({
                        padding: '10px',
                        parent: modalBody,
                        overflow: 'hidden',
                        width: '100%',
                        height: '100%',
                        radius: '10px',
                        background: 'var(--background)'
                    });

                    deleteContainer.add();

                    const deleteConsole = InstallConsole({
                        type: 'secondary',
                        text: '',
                        margin: '0px',
                        parent: deleteContainer
                    });

                    Store.add({
                        name: 'install-console',
                        component: deleteConsole
                    });

                    deleteConsole.add();
                    deleteConsole.get().classList.add('console');

                    // 1. CORE: Add core lists to install-console
                    deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete core lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    coreLists.forEach(item => {
                        const { list } = item;

                        deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in coreLists) {
                        // Create lists
                        await DeleteList(coreLists[list]);
                    }

                    // Add spacer to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // 2. USER DEFINED: Add user defined lists to install-console
                    deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete '${App.get('name')}' lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    lists.forEach(item => {
                        const { list } = item;

                        deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in lists) {
                        // Create lists
                        await DeleteList(lists[list]);

                        // Add spacer to console
                        deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='opacity: 0;'>Spacer</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                    }

                    console.log('App deleted');


                    let spacers = '==============';

                    for (let i = 0; i < App.get('name').length; i++) {
                        spacers = spacers + '=';
                    }
                    
                    // 3. Add to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: var(--primary) !important;'>${spacers}</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: var(--primary) !important;'>| '${App.get('name')}' deleted |</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: var(--primary) !important;'>${spacers}</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // TODO: Convert path below to Install button with href to ${App.get('library)}/src/pages/app.aspx
                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='mt-4 mb-2'>All lists and data for <strong>${App.get('name')}</strong> were successfully deleted.</div>
                        <div class='mb-4'>Go to <a href='${App.get('site')}/${App.get('library')}/src/pages/app.aspx'>Site Contents > App > src > pages > app.aspx</a> to reinstall.</div>
                    `);

                    // Show return button
                    const returnBtn = BootstrapButton({
                        type: 'robi',
                        value: 'Site Contents',
                        classes: ['w-100'],
                        action(event) {
                            // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                            $(modal.get()).on('hidden.bs.modal', event => {
                                console.log('Modal close animiation end');
                                console.log('Launch');

                                // Go to SharePoint site home page
                                location = `${App.get('site')}/_layouts/15/viewlsts.aspx`;
                            });

                            modal.close();
                        },
                        parent: modalBody
                    });

                    returnBtn.add();

                    // Scroll console to bottom (after launch button pushes it up);
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                },
                classes: ['w-100'],
                width: '100%',
                parent: modalBody,
                type: 'robi-reverse',
                value: 'Delete all lists and data'
            });

            deleteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel delete');

                    modal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();
        },
        centered: true,
        showFooter: false,
    });

    modal.add();
}
// @END-File
