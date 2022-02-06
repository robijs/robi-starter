import { Modal } from '../Components/Modal.js'
import { BootstrapButton } from '../Components/BootstrapButton.js'
import { ProgressBar } from '../Components/ProgressBar.js'
import { InstallConsole } from '../Components/InstallConsole.js'
import { Container } from '../Components/Container.js'
import { Lists } from '../Models/Lists.js'
import { Get } from './Get.js'
import { UpdateItem } from './UpdateItem.js'
import { CreateItem } from './CreateItem.js'
import { CreateList } from './CreateList.js'
import { LaunchApp } from './LaunchApp.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'

// TODO: Remove mode and install check from InstallApp
// TODO: Move to InitializeApp or Start
// @START-File
/**
 *
 * @param {*} param
 */
export function InstallApp(param) {
    const { settings, loadingBar, isInstalled } = param;
    const { questionTypes } = settings;
    const coreLists = Lists();
    const lists = App.lists();

    console.log('Installing app...');

    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <div>
                    <strong>${App.get('name')}</strong> isn't installed on <a href='${App.get('site')}' target='_blank'>${App.get('site')}</a>. 
                    Would you like to install it now? You can uninstall it later.
                </div>
            `);

            const installBtn = BootstrapButton({
                action: installApp,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi-reverse',
                value: 'Install'
            });

            installBtn.add();

            modal.get().addEventListener('keypress', event => {
                if (event.key === 'Enter') {
                    installApp(event);
                }
            });

            async function installApp(event) {
                console.log('Install');

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
                    <h3 class='console-title mb-0'>Installing <strong>${App.get('name')}</strong></h3>
                `);

                // TODO: Start at 2
                // 0 - Create key 'QuestionTypes' in list 'Settings'
                // 1 - Create init note in list 'ReleaseNotes'
                // 2 - Create/update key 'Installed' in list 'Settings'
                let progressCount = 0;

                coreLists.forEach(item => {
                    const { fields, items } = item;

                    // + 1 for each list
                    progressCount = progressCount + 1;

                    // +2 for each field
                    progressCount = progressCount + ((fields.length * 2) || 0);

                    // +1 for each item
                    progressCount = progressCount + (items?.length || 0);
                });

                lists.forEach(item => {
                    const { fields, options, items } = item;

                    if (options?.files) {
                        // + 1 for files library 
                        progressCount = progressCount + 1;
                    }

                    // +1 for each list
                    progressCount = progressCount + 1;

                    // +2 for each field
                    progressCount = progressCount + ((fields.length * 2) || 0);

                    // +1 for each item
                    progressCount = progressCount + (items?.length || 0);
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

                const installContainer = Container({
                    padding: '10px',
                    parent: modalBody,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                    radius: '20px',
                    background: 'var(--background)'
                });

                installContainer.add();

                const installConsole = InstallConsole({
                    type: 'secondary',
                    text: '',
                    margin: '0px',
                    parent: installContainer
                });

                Store.add({
                    name: 'install-console',
                    component: installConsole
                });

                installConsole.add();
                installConsole.get().classList.add('console');

                // 1. CORE: Add core lists to install-console
                installConsole.append(/*html*/ `
                        <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code>Create core lists:</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                coreLists.forEach(item => {
                    const { list } = item;

                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>- ${list}</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                });

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Add default lists first
                for (let list in coreLists) {
                    // Create lists
                    await CreateList(coreLists[list]);

                    // Add spacer to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }

                // 2. USER DEFINED: Add user defined lists to install-console
                installConsole.append(/*html*/ `
                        <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code>Create '${App.get('name')}' lists:</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                lists.forEach(item => {
                    const { list } = item;

                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>- ${list}</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                });

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Add default lists first
                for (let list in lists) {
                    // Create lists
                    await CreateList(lists[list]);

                    // Add spacer to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }

                // Set Question Types key
                const questionTypesKeyExists = await Get({
                    list: 'Settings',
                    filter: `Key eq 'QuestionTypes'`
                });

                if (questionTypesKeyExists[0]) {
                    console.log(`Key 'Question Types' in Settings already exists.`);

                    // 1. Add to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Key 'Question Types' in Settings already exists.</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                } else {
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
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Question Types ${JSON.stringify(questionTypes)} added to 'Settings'</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Add Release Notes
                const releaseNoteExists = await Get({
                    list: 'ReleaseNotes',
                    filter: `Summary eq 'App installed'`
                });

                if (releaseNoteExists[0]) {
                    // Add to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>'App installed' release note already exists.'</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
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
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>'App installed - Core lists and items created.' added to 'releaseNotes'</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }

                if (lists.length) {
                    // Add Release Notes
                    const releaseNoteExists = await Get({
                        list: 'ReleaseNotes',
                        filter: `Summary eq '${App.get('title')} lists created'`
                    });

                    if (releaseNoteExists[0]) {
                        // Add to console
                        installConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>${App.get('title')} lists created' release note already exists.'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        installConsole.get().scrollTop = installConsole.get().scrollHeight;
                    } else {
                        // Add Release Notes
                        await CreateItem({
                            list: 'ReleaseNotes',
                            data: {
                                Summary: `${App.get('title')} lists created`,
                                Description: lists.map(item => item.list).join(', ') + '.',
                                Status: 'Published',
                                MajorVersion: '0',
                                MinorVersion: '1',
                                PatchVersion: '0',
                                ReleaseType: 'Current'
                            }
                        });

                        console.log(`Added Release Note: ${App.get('title')} lists created - ${lists.map(item => item.list).join(', ')}.`);

                        // Add to console
                        installConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>''${App.get('title')}' lists created - ${lists.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        installConsole.get().scrollTop = installConsole.get().scrollHeight;
                    }
                }

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

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
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>User account for '${response.d.Title}' already exists.</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                } else {
                    /** Create user */
                    await CreateItem({
                        list: 'Users',
                        data: {
                            Title: response.d.Title,
                            Email: response.d.Email,
                            LoginName: response.d.LoginName.split('|')[2],
                            Roles: {results : ['Developer']},
                            Settings: App.get('userSettings')
                        }
                    });

                    console.log(`Created user account for '${response.d.Title}' with role 'Developer'`);

                    // Add to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>User account for '${response.d.Title}' created with role 'Developer'</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }

                if (!isInstalled) {
                    // Create key 'Installed'
                    await CreateItem({
                        list: 'Settings',
                        data: {
                            Key: 'Installed',
                            Value: 'Yes'
                        }
                    });

                    // TODO: Pull from settings if installing a pre-existing app from a backup with a version number different from the default 0.1.0
                    // Create key 'Version'
                    await CreateItem({
                        list: 'Settings',
                        data: {
                            Key: 'Version',
                            Value: '0.1.0'
                        }
                    });

                    // TODO: Pull actual Robi build # from source of truth (where to put that?)
                    // Create key 'Build'
                    await CreateItem({
                        list: 'Settings',
                        data: {
                            Key: 'Build',
                            Value: '1.0.0'
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

                    // TODO: Update keys Version and Build
                }

                console.log('App installed');

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                let spacers = '==============================================';

                for (let i = 0; i < App.get('name').length; i++) {
                    spacers = spacers + '=';
                }

                // 3. Add to console
                //TODO: REMOVE hard coded version and build numbers
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>${spacers}</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>| '${App.get('name')}' installed | Build 1.0.0 | Version 1.0.0 |</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>${spacers}</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Show launch button
                const launchBtn = BootstrapButton({
                    type: 'robi',
                    value: 'Launch app',
                    classes: ['mt-3', 'w-100'],
                    action(event) {
                        // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                        $(modal.get()).on('hidden.bs.modal', event => {
                            console.log('Modal close animiation end');
                            console.log('Launch');

                            LaunchApp(param);
                        });

                        modal.close();
                        loadingBar.showLoadingBar();
                    },
                    parent: modalBody
                });

                launchBtn.add();

                // Scroll console to bottom (after launch button pushes it up);
                installConsole.get().scrollTop = installConsole.get().scrollHeight;
            }

            const modifyBtn = BootstrapButton({
                action(event) {
                    window.open(`${App.get('site')}/${App.get('library') || 'App'}/src`);
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: 'robi-light',
                value: 'Modify source'
            });

            modifyBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel install');

                    // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                    $(modal.get()).on('hidden.bs.modal', event => {
                        console.log('modal close animiation end');

                        // Show alert
                        appContainer.get().insertAdjacentHTML('afterend', /*html*/ `
                            <div class='position-absolute install-alert mb-0'>
                                Installation cancelled. Reload to resume install.
                            </div>
                        `);
                    });

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
