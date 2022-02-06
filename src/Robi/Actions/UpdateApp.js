import { Alert } from '../Components/Alert.js'
import { Modal } from '../Components/Modal.js'
import { BootstrapButton } from '../Components/BootstrapButton.js'
import { ProgressBar } from '../Components/ProgressBar.js'
import { InstallConsole } from '../Components/InstallConsole.js'
import { Container } from '../Components/Container.js'
import { LoadingSpinner } from '../Components/LoadingSpinner.js'
import { CheckLists } from './CheckLists.js'
import { Style } from './Style.js'
import { Route } from './Route.js'
import { CreateList } from './CreateList.js'
import { CreateItem } from './CreateItem.js'
import { CreateColumn } from './CreateColumn.js'
import { DeleteList } from './DeleteList.js'
import { DeleteColumn } from './DeleteColumn.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function UpdateApp() {
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

            Style({
                name: 'update-app',
                style: /*css*/ `
                    #${modal.get().id} .alert {
                        border-radius: 20px;
                    } 
                `
            });

            // Show loading
            const loadingSpinner = LoadingSpinner({
                type: 'robi',
                parent: modalBody
            });

            loadingSpinner.add();

            const {
                allLists,
                webLists,
                diffToDelete,
                toCreate,
                toDelete,
                schemaAdd,
                schemaDelete
            } = await CheckLists();

            // Remove loading
            loadingSpinner.remove();

            // Are there new lists in lists.js that need to be created?
            if (toCreate.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-robi-primary-high-contrast mb-4'>
                        <h4 class='mb-2'>Create lists</h4>
                        <div class='create-lists alert'>
                            ${toCreate
                            .sort((a, b) => a.list - b.list)
                            .map(item => {
                                return /*html*/ `
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}' checked>
                                        <label class="custom-control-label" for="checkbox-${item.list.split(' ').join('-')}">
                                            ${item.list}
                                        </label>
                                    </div>

                                    <!-- <div class="form-check ml-2">
                                        <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}' checked>
                                        <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                            ${item.list}
                                        </label>
                                    </div> -->
                                `;
                            }).join('\n')}
                        </div>
                    </div>
                `);
            }

            // Choose columns to add
            if (schemaAdd.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-robi-primary-high-contrast mb-4'>    
                        <h4 class='mb-2'>Add new fields to installed lists</h4>
                        <div class='schema-add'>
                            ${schemaAdd
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            const { list, fields } = item;
                            return /*html*/ `
                                <div class='alert'>
                                    <h5 data-list='${list}'>${list}</h5>
                                    ${fields.map(field => {
                                        return /*html*/ `
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input" value="${field}" id="checkbox-${field}" data-list='${list}' checked>
                                                <label class="custom-control-label" for="checkbox-${field}">
                                                    ${field}
                                                </label>
                                            </div>

                                            <!-- <div class="form-check ml-2">
                                                <input class="form-check-input" type="checkbox" value="${field}" id="checkbox-${field}" data-list='${list}' checked>
                                                <label class="form-check-label" for="checkbox-${field}">
                                                    ${field}
                                                </label>
                                            </div> -->
                                        `;
                                    }).join('\n')}
                                </div>
                            `;
                        }).join('\n')}
                        </div>
                    </div>
                `);
            }

            // Have lists been removed from list.js that need to be removed?
            if (toDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-robi-secondary mb-4'>
                        <h4 class='mb-2'>Delete lists</h4>
                        <div class='delete-lists alert'>
                            ${diffToDelete
                            // .sort((a, b) => a.list - b.list)
                            .sort((a, b) => a - b)
                            .map(item => {
                                return /*html*/ `
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="checkbox-${item.split(' ').join('-')}" data-list='${item}'>
                                        <label class="custom-control-label" for="checkbox-${item.split(' ').join('-')}">
                                            ${item}
                                        </label>
                                    </div>

                                    <!-- <div class="form-check ml-2">
                                        <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.split(' ').join('-')}" data-list='${item}'>
                                        <label class="form-check-label" for="checkbox-${item.split(' ').join('-')}">
                                            ${item}
                                        </label>
                                    </div> -->
                                `;
                            }).join('\n')}
                        </div>
                    </div>
                `);
            }


            // Choose columns to delete (DESTRUCTIVE)
            if (schemaDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-robi-secondary mb-4'>
                        <h4 class='mb-2'>Delete fields from installed lists</h4>
                        <div class='schema-delete'>
                            ${schemaDelete
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            const { list, fields } = item;
                            return /*html*/ `
                                <div class='alert'>
                                    <h5 data-list='${list}'>${list}</h5>
                                    ${fields.map(field => {
                                        return /*html*/ `
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input" value="${field}" id="checkbox-${field}" data-list='${list}'>
                                                <label class="custom-control-label" for="checkbox-${field}">
                                                    ${field}
                                                </label>
                                            </div>

                                            <!-- <div class="form-check ml-2">
                                                <input class="form-check-input" type="checkbox" value="${field}" id="checkbox-${field}" data-list='${list}'>
                                                <label class="form-check-label" for="checkbox-${field}">
                                                    ${field}
                                                </label>
                                            </div> -->
                                        `;
                                    }).join('\n')}
                                </div>
                            `;
                        }).join('\n')}
                        </div>
                    </div>
                `);
            }

            if (toCreate.length || toDelete.length || schemaAdd.length || schemaDelete.length) {
                const installBtn = BootstrapButton({
                    async action(event) {
                        // Get checked lists
                        const checkedCreate = [...modal.findAll('.create-lists input:checked')].map(node => allLists.find(item => item.list === node.dataset.list));
                        const checkedDelete = [...modal.findAll('.delete-lists input:checked')].map(node => webLists.find(item => item.Title === node.dataset.list));
                        const checkedSchemaAdd = [...modal.findAll('.schema-add input:checked')].map(node => {
                            const list = node.dataset.list;
                            const name = node.value;
                            const field = allLists.find(item => item.list === list).fields.find(item => item.name == name);

                            return {
                                list,
                                field
                            };
                        });
                        const checkedSchemaDelete = [...modal.findAll('.schema-delete input:checked')].map(node => {
                            return { list: node.dataset.list, name: node.value };
                        });

                        console.log('Checked Add', checkedSchemaAdd);
                        console.log('Checked Delete', checkedSchemaDelete);

                        // if (!checkedCreate.concat(checkedDelete).length) {
                        //     alert('Select at least one list');
                        //     return;
                        // }
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
                            <h3 class='console-title mb-0'>Updating <strong>lists</strong></h3>
                        `);

                        // List delete and schema delete only increment progressbar once for each pass
                        let progressCount = checkedDelete.length + +checkedSchemaDelete.length;

                        // Add progress count for lists to create
                        // TODO: Refactor to MAP => REDUCE
                        checkedCreate.forEach(item => {
                            const { fields } = item;

                            // List + 1 for install
                            progressCount = progressCount + 1;

                            fields.forEach(field => {
                                // Field +2 (add column to list and view)
                                progressCount = progressCount + 2;
                            });
                        });

                        // TODO: Refactor to MAP => REDUCE
                        checkedSchemaAdd.forEach(item => {
                            // +2 Create/Add to view
                            progressCount = progressCount + 2;
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

                        // CREATE LISTS ---------------------------------------------------------------------------------
                        if (checkedCreate.length) {
                            // 1. CORE: Add core lists to install-console
                            reinstallConsole.append(/*html*/ `
                                    <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>Create lists:</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            checkedCreate.forEach(item => {
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
                            for (let list in checkedCreate) {
                                // Create lists
                                await CreateList(checkedCreate[list]);

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

                            // Add Release Notes
                            await CreateItem({
                                list: 'ReleaseNotes',
                                data: {
                                    Summary: `New app lists created`,
                                    Description: checkedCreate.map(item => item.list).join(', ') + '.',
                                    Status: 'Published',
                                    MajorVersion: '0',
                                    MinorVersion: '1',
                                    PatchVersion: '0',
                                    ReleaseType: 'Current'
                                }
                            });

                            console.log(`Added Release Note: ${App.get('title')} lists created - ${checkedCreate.map(item => item.list).join(', ')}.`);

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'New ${App.get('title')} lists created - ${checkedCreate.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add spacer to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            let spacers = '===================';

                            // 3. Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>${spacers}</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>| Lists installed |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>${spacers}</code>
                                </div>
                                ${checkedSchemaAdd.length || checkedDelete || checkedSchemaDelete.length ?
                                    /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''}
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END CREATE -----------------------------------------------------------------------------------
                        // ADD COLUMNS ----------------------------------------------------------------------------------
                        if (checkedSchemaAdd.length) {
                            for (let item in checkedSchemaAdd) {
                                const { list, field } = checkedSchemaAdd[item];

                                await CreateColumn({
                                    list,
                                    field
                                });
                            }

                            let spacers = '===================';

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: var(--primary) !important;'>${spacers}</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: var(--primary) !important;'>| Columns created |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: var(--primary) !important;'>${spacers}</code>
                                </div>
                                ${checkedDelete.length || checkedSchemaDelete.length ?
                                    /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''}
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END ADD COLUMNS ------------------------------------------------------------------------------
                        // DELETE LISTS ---------------------------------------------------------------------------------
                        if (checkedDelete.length) {
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>Delete lists:</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            checkedDelete.forEach(item => {
                                const { Title } = item;

                                reinstallConsole.append(/*html*/ `
                                    <div class='console-line'>
                                        <!-- <code class='line-number'>0</code> -->
                                        <code>- ${Title}</code>
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
                            for (let list in checkedDelete) {
                                // Create lists
                                await DeleteList({
                                    list: checkedDelete[list].Title
                                });
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
                            await CreateItem({
                                list: 'ReleaseNotes',
                                data: {
                                    Summary: `App Lists deleted`,
                                    Description: checkedDelete.map(item => item.Title).join(', ') + '.',
                                    Status: 'Published',
                                    MajorVersion: '0',
                                    MinorVersion: '1',
                                    PatchVersion: '0',
                                    ReleaseType: 'Current'
                                }
                            });

                            console.log(`Added Release Note: App lists deleted - ${checkedDelete.map(item => item.Title).join(', ')}.`);

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'${App.get('title')} lists deleted - ${checkedDelete.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: var(--primary) !important;'>=================</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: var(--primary) !important;'>| Lists deleted |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: var(--primary) !important;'>=================</code>
                                </div>
                                ${checkedSchemaDelete.length ?
                                /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''}
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END DELETE -----------------------------------------------------------------------------------
                        // DELETE COLUMNS -------------------------------------------------------------------------------
                        if (checkedSchemaDelete.length) {
                            for (let item in checkedSchemaDelete) {
                                const { list, name } = checkedSchemaDelete[item];

                                await DeleteColumn({
                                    list,
                                    name
                                });
                            }

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>===================</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>| Columns deleted |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>===================</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END DELETE COLUMNS ---------------------------------------------------------------------------

                        modal.find('.console-title').innerHTML = `${App.get('title')} <strong>updated</strong>`;

                        // Close modal button
                        const returnBtn = BootstrapButton({
                            type: 'robi',
                            value: 'Close',
                            classes: ['w-100', 'mt-2'],
                            action(event) {
                                // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                                $(modal.get()).on('hidden.bs.modal', event => {
                                    console.log('Modal close animiation end');
                                    console.log('Reload');

                                    Route(location.href.split('#')[1] || '');
                                });

                                modal.close();
                            },
                            parent: modalBody
                        });

                        returnBtn.add();

                        // Scroll console to bottom (after launch button pushes it up);
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    },
                    classes: ['w-100', 'mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: 'robi-reverse',
                    value: `Update ${App.get('title')}`
                });

                installBtn.add();
            }

            if (!toCreate.length && !toDelete.length && !schemaAdd.length && !schemaDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-robi-primary-high-contrast'><strong>${App.get('title')}</strong> is up-to-date</div>
                `);
            }

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel install');

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
