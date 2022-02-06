import { Alert } from '../Components/Alert.js'
import { Modal } from '../Components/Modal.js'
import { BootstrapButton } from '../Components/BootstrapButton.js'
import { ProgressBar } from '../Components/ProgressBar.js'
import { InstallConsole } from '../Components/InstallConsole.js'
import { Container } from '../Components/Container.js'
import { Lists } from '../Models/Lists.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { UpdateItem } from './UpdateItem.js'
import { DeleteList } from './DeleteList.js'
import { CreateList } from './CreateList.js'
import { CreateItem } from './CreateItem.js'

// @START-File
/**
 *
 * @param {*} event
 */
export function ReinstallApp() {
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
            const appLists = App.lists();
            console.log(appLists);

            // All Lists
            const lists = App.lists();
            const allLists = Lists().concat(appLists);
            console.log(allLists);

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h4 class='mb-3'>All <strong>${App.get('name')}</strong> lists will be reinstalled</h4>
                <ul>
                    ${appLists
                    .sort((a, b) => a.list - b.list)
                    .map(item => {
                        return /*html*/ `
                                <li>${item.list}</li>
                            `;
                    }).join('\n')}
                </ul>
                <h4 class='mb3 mt-4'>All <strong>Core</strong> lists will be reinstalled</h4>
                <ul>
                    ${coreLists
                    .sort((a, b) => a.list - b.list)
                    .map(item => {
                        return /*html*/ `
                                <li>${item.list}</li>
                            `;
                    }).join('\n')}
                </ul>
                <div class='alert alert-danger mt-5' style='border: none; border-radius: 10px;'>
                    All items will be deleted. This can't be undone. Proceed with caution.
                </div>
            `);

            const deleteBtn = BootstrapButton({
                async action(event) {
                    console.log('Reinstall');

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
                        <h3 class='console-title mb-0'>Reinstalling <strong>${App.get('name')}</strong></h3>
                    `);

                    let progressCount = 0;

                    coreLists.forEach(item => {
                        const { fields } = item;

                        // List + 1 for delete
                        // List + 1 for reinstall
                        progressCount = progressCount + 2;

                        fields.forEach(field => {
                            // Field +2 (add column to list and view)
                            progressCount = progressCount + 2;
                        });
                    });

                    lists.forEach(item => {
                        const { fields } = item;

                        // List + 1 for delete
                        // List + 1 for reinstall
                        progressCount = progressCount + 2;

                        fields.forEach(field => {
                            // Field +2 (add column to list and view)
                            progressCount = progressCount + 2;
                        });
                    });

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

                    const reinstallConsole = InstallConsole({
                        type: 'secondary',
                        text: '',
                        margin: '0px',
                        parent: deleteContainer
                    });

                    Store.add({
                        name: 'install-console',
                        component: reinstallConsole
                    });

                    reinstallConsole.add();
                    reinstallConsole.get().classList.add('console');

                    // 1. CORE: Add core lists to install-console
                    reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete core lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    coreLists.forEach(item => {
                        const { list } = item;

                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in coreLists) {
                        // Create lists
                        await DeleteList(coreLists[list]);
                    }

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // 2. USER DEFINED: Add user defined lists to install-console
                    reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete '${App.get('name')}' lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    lists.forEach(item => {
                        const { list } = item;

                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in lists) {
                        // Create lists
                        await DeleteList(lists[list]);

                        // Add spacer to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='opacity: 0;'>Spacer</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    // REINSTALL ----------------------------------------------------------------------------------------
                    // 1. CORE: Add core lists to install-console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Create core lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    coreLists.forEach(item => {
                        const { list } = item;

                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in coreLists) {
                        // Create lists
                        await CreateList(coreLists[list]);

                        // Add spacer to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='opacity: 0;'>Spacer</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    // 2. USER DEFINED: Add user defined lists to install-console
                    reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Create '${App.get('name')}' lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    lists.forEach(item => {
                        const { list } = item;

                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in lists) {
                        // Create lists
                        await CreateList(lists[list]);

                        // Add spacer to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='opacity: 0;'>Spacer</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    const questionTypesKeyExists = await Get({
                        list: 'Settings',
                        filter: `Key eq 'QuestionTypes'`
                    });

                    if (questionTypesKeyExists[0]) {
                        console.log(`Key 'Question Types' in Settings already exists.`);

                        // 1. Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>Key 'Question Types' in Settings already exists.</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    } else {
                        const questionTypes = App.get('questionTypes');
                        // Add question types
                        await CreateItem({
                            list: 'Settings',
                            data: {
                                Key: 'QuestionTypes',
                                Value: JSON.stringify(questionTypes)
                            }
                        });

                        console.log(`Added Question Types: ${JSON.stringify(questionTypes)}`);

                        // 1. Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>Question Types ${JSON.stringify(questionTypes)} added to 'Settings'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add Release Notes
                    const releaseNoteExists = await Get({
                        list: 'ReleaseNotes',
                        filter: `Summary eq 'App installed'`
                    });

                    if (releaseNoteExists[0]) {
                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>'App installed' release note already exists.'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    } else {
                        await CreateItem({
                            list: 'ReleaseNotes',
                            data: {
                                Summary: 'App installed',
                                Description: 'Initial lists and items created.',
                                Status: 'Published',
                                MajorVersion: '0',
                                MinorVersion: '1',
                                PatchVersion: '0',
                                ReleaseType: 'Current'
                            }
                        });

                        console.log(`Added Release Note: App installed. Initial lists and items created.`);

                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>'App installed - Core lists and items created.' added to 'releaseNotes'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    if (lists.length) {
                        // Add Release Notes
                        const releaseNoteExists = await Get({
                            list: 'ReleaseNotes',
                            filter: `Summary eq '${App.get('name')} lists created'`
                        });

                        if (releaseNoteExists[0]) {
                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'${App.get('name')} lists created' release note already exists.'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        } else {
                            // Add Release Notes
                            await CreateItem({
                                list: 'ReleaseNotes',
                                data: {
                                    Summary: `${App.get('name')} lists created`,
                                    Description: lists.map(item => item.list).join(', ') + '.',
                                    Status: 'Published',
                                    MajorVersion: '0',
                                    MinorVersion: '1',
                                    PatchVersion: '0',
                                    ReleaseType: 'Current'
                                }
                            });

                            console.log(`Added Release Note: ${App.get('name')} lists created - ${lists.map(item => item.list).join(', ')}.`);

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'${App.get('name')} lists created - ${lists.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }
                    }

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Create developer account
                    const url = `${App.get('site')}/../_api/web/CurrentUser`;
                    const fetchOptions = {
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Accept': 'application/json; odata=verbose'
                        }
                    };
                    const currentUser = await fetch(url, fetchOptions);
                    const response = await currentUser.json();

                    const appUser = await Get({
                        list: App.get('usersList') || 'Users',
                        select: coreLists.find(item => item.list === App.get('usersList') || item.list === 'Users').fields.map(field => field.name),
                        filter: `Email eq '${response.d.Email}'`
                    });

                    // User already exists
                    if (appUser && appUser[0]) {
                        console.log(`User account for '${response.d.Title}' already exists.`);

                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>User account for '${response.d.Title}' already exists.</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    } else {
                        /** Create user */
                        await CreateItem({
                            list: 'Users',
                            data: {
                                Title: response.d.Title,
                                Email: response.d.Email,
                                LoginName: response.d.LoginName.split('|')[2],
                                Role: 'Developer',
                                Settings: App.get('userSettings')
                            }
                        });

                        console.log(`Created user account for '${response.d.Title}' with role 'Developer'`);

                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>User account for '${response.d.Title}' created with role 'Developer'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    // Check if app is already installed
                    const isInstalled = await GetAppSetting('Installed');

                    if (!isInstalled) {
                        // Create key 'Installed'
                        await CreateItem({
                            list: 'Settings',
                            data: {
                                Key: 'Installed',
                                Value: 'Yes'
                            }
                        });
                    } else if (isInstalled.Value === 'No') {
                        // Update key 'Installed'
                        await UpdateItem({
                            list: 'Settings',
                            itemId: isInstalled.Id,
                            data: {
                                Value: 'Yes'
                            }
                        });
                    }

                    console.log('App installed');

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    let spacers = '==================';

                    for (let i = 0; i < App.get('name').length; i++) {
                        spacers = spacers + '=';
                    }

                    // 3. Add to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: mediumseagreen !important;'>${spacers}</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: mediumseagreen !important;'>| '${App.get('name')}' reinstalled |</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: mediumseagreen !important;'>${spacers}</code>
                        </div>
                    `);

                    // END REINSTALL ------------------------------------------------------------------------------------
                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='mt-4 mb-2'>All lists have been successfully reinstall.</div>
                    `);

                    // Show return button
                    const returnBtn = BootstrapButton({
                        type: 'primary',
                        value: 'Reload',
                        classes: ['w-100'],
                        action(event) {
                            // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                            $(modal.get()).on('hidden.bs.modal', event => {
                                console.log('Modal close animiation end');
                                console.log('Reload');

                                location.reload();
                            });

                            modal.close();
                        },
                        parent: modalBody
                    });

                    returnBtn.add();

                    // Scroll console to bottom (after launch button pushes it up);
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                },
                classes: ['w-100'],
                width: '100%',
                parent: modalBody,
                type: 'danger',
                value: `Reinstall ${App.get('name')}`
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
// @END-File
