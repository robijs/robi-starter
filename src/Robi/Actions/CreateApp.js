import { Container } from '../Components/Container.js'
import { Modal } from '../Components/Modal.js'
import { BootstrapButton } from '../Components/BootstrapButton.js'
import { BootstrapTextarea } from '../Components/BootstrapTextarea.js'
import { SingleLineTextField } from '../Components/SingleLineTextField.js'
import { ThemeField } from '../Components/ThemeField.js'
import { InstallConsole } from '../Components/installConsole.js'
import { ProgressBar } from '../Components/ProgressBar.js'
import { GetItemCount } from './GetItemCount.js'
import { CreateLibrary } from './CreateLibrary.js'
import { CreateSite } from './CreateSite.js'
import { CopyRecurse } from './CopyRecurse.js'
import { SetHomePage } from './SetHomePage.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function CreateApp() {
    console.log('Creating app...');

    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-4'>Create app</h3>
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

            // Theme
            const themeField = ThemeField({
                parent: modalBody
            });

            themeField.add();

            // Install
            const installBtn = BootstrapButton({
                action: createNewSite,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Create app'
            });

            installBtn.add();

            // Kick off new site creation
            async function createNewSite(event) {
                // Alert user if canceled
                addEventListener(
                    'beforeunload', 
                    (event) => {
                        console.log('confirm close');
                    }, 
                    {capture: true}
                );

                const title = siteTitle.value();
                const url = siteUrl.value();
                const name = appName.value();
                const description = siteDesc.value();
                const theme = themeField.value();

                console.log(title);
                console.log(url);
                console.log(name);
                console.log(description);
                console.log(theme);

                console.log('Create site');

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
                    <h3 class='console-title mb-0'>Creating <strong>${title}</strong></h3>
                `);

                // Get robi source code file count
                const fileCount = await GetItemCount({
                    list: 'App'
                });

                // const coreLists = Lists();

                // TODO: Start at 2
                // 1 - Create site
                // 2 - Create App doc lib
                let progressCount = 2 + parseInt(fileCount);

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

                // 1. Create site
                await CreateSite({
                    title,
                    description,
                    url,
                    name
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

                // 2. Create App doc lib
                await CreateLibrary({
                    name: 'App',
                    web: url
                });

                // 3. Copy files
                await CopyRecurse({
                    path: 'App',
                    library: 'App',
                    targetWeb: url,
                    filter: `Name ne 'Forms'`,
                    appName: name,
                    appTitle: title,
                    theme
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

                // 4. Set home page to app.aspx
                await SetHomePage({
                    web: url
                });

                // TODO: move to SetHomePage()
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code>Home page set to 'App/src/pages/app.aspx'</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                let spacers = '==============';

                for (let i = 0; i < title.length; i++) {
                    spacers = spacers + '=';
                }
                
                // 3. Add to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>${spacers}</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>| '${title}' created |</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>${spacers}</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // 5. Init app
                // TODO: init app automatically
                // TODO: set home page after app copied
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='mt-4'>New app <strong>${title}</strong> created at <a href='${App.get('site')}/${url}' target='_blank'>${App.get('site')}/${url}</a></div>
                `);

                // Update title
                modal.find('.console-title').innerHTML = `${modal.find('.console-title').innerHTML.replace('Creating', 'Created')}`

                // Show launch button
                const installAppBtn = BootstrapButton({
                    type: 'robi',
                    value: 'Install app',
                    classes: ['mt-3', 'w-100'],
                    action(event) {
                        // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                        $(modal.get()).on('hidden.bs.modal', event => {
                            window.open(`${App.get('site')}/${url}`);
                        });

                        modal.close();
                    },
                    parent: modalBody
                });

                installAppBtn.add();

                const modifyBtn = BootstrapButton({
                    action(event) {
                        window.open(`${App.get('site')}/${url}/${App.get('library') || 'App'}/src`);
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

                        $(modal.get()).on('hidden.bs.modal', event => {
                            console.log('modal close animiation end');
                        });

                        modal.close();
                    },
                    classes: ['w-100 mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: '',
                    value: 'Close'
                });

                cancelBtn.add();

                // Scroll console to bottom (after launch button pushes it up);
                installConsole.get().scrollTop = installConsole.get().scrollHeight;
            }

            // Close modal
            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel create site');

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
