import { LoadingBar } from '../Components/LoadingBar.js'
import { Modal } from '../Components/Modal.js'
import { BootstrapButton } from '../Components/BootstrapButton.js'
import { ProgressBar } from '../Components/ProgressBar.js'
import { InstallConsole } from '../Components/InstallConsole.js'
import { Container } from '../Components/Container.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { Lists } from '../Models/Lists.js'
import { LaunchApp } from './LaunchApp.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function TestInstall(param) {
    // Start loading bar animation
    const loadingBar = LoadingBar({
        displayLogo: App.get('logoLarge'),
        displayTitle: App.get('name'),
        totalCount: preLoadLists?.length || 0,
        loadingBar: 'hidden',
        onReady(event) {
            const modal = Modal({
                title: false,
                disableBackdropClose: true,
                scrollable: true,
                async addContent(modalBody) {
                    const coreLists = Lists();
                    const lists = App.lists();
                    modalBody.classList.add('install-modal');

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div><strong>${App.get('name')}</strong> isn't installed on this <a href='${App.get('site')}' target='_blank'>${App.get('site')}</a>. Would you like to install it now? You can uninstall it later.</div>
                    `);

                    const installBtn = BootstrapButton({
                        action(event) {
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

                            const logs = [];

                            logs.push('Core lists:');
                            coreLists.forEach(item => {
                                const { list } = item;

                                logs.push(`- ${list}`);
                            });
                            logs.push(' ');

                            coreLists.forEach(item => {
                                const { list, fields } = item;

                                logs.push(`Created core list '${list}'`);

                                fields.forEach(field => {
                                    const { name } = field;

                                    logs.push(`Created column '${name}'`);
                                    logs.push(`Added column '${name}' to View 'All Items'`);
                                });

                                logs.push(' ');
                            });

                            logs.push(`${App.get('name')} lists:`);
                            lists.forEach(item => {
                                const { list } = item;

                                logs.push(`- ${list}`);
                            });
                            logs.push(' ');

                            lists.forEach(item => {
                                const { list, fields } = item;

                                logs.push(`Created ${App.get('name')} list '${list}'`);

                                fields.forEach(field => {
                                    const { name } = field;

                                    logs.push(`Created column '${name}'`);
                                    logs.push(`Added column '${name}' to View 'All Items'`);
                                });

                                logs.push(' ');
                            });

                            const progressBar = ProgressBar({
                                parent: modalBody,
                                totalCount: logs.length
                            });

                            progressBar.add();

                            const installContainer = Container({
                                padding: '10px',
                                parent: modalBody,
                                overflow: 'hidden',
                                width: '100%',
                                height: '100%',
                                radius: '10px',
                                background: App.get('backgroundColor')
                            });

                            installContainer.add();

                            const installConsole = InstallConsole({
                                type: 'secondary',
                                text: '',
                                margin: '0px',
                                parent: installContainer
                            });

                            installConsole.add();
                            installConsole.get().classList.add('console');

                            let line = 0;
                            let timeout = 50;

                            for (let i = 0; i < logs.length; i++) {
                                setTimeout(() => {
                                    line++;

                                    progressBar.update();

                                    installConsole.append(/*html*/ `
                                        <div class='console-line'>
                                            <code class='line-number'>${line}</code>
                                            <code>${logs[i]}</code>
                                        </div>
                                    `);

                                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                                }, (i + 1) * timeout);
                            }

                            setTimeout(() => {
                                line++;

                                installConsole.append(/*html*/ `
                                    <div class='console-line'>
                                        <code class='line-number'>${line}</code>
                                        <code>'${App.get('name')}' installed</code>
                                    </div>
                                `);

                                // Show launch button
                                const launchBtn = BootstrapButton({
                                    type: 'primary',
                                    value: 'Launch app',
                                    classes: ['mt-3', 'w-100'],
                                    action(event) {
                                        console.log('Launch');

                                        modal.close();
                                        loadingBar.showLoadingBar();

                                        // TODO: Launch after animation end, not timeout
                                        setTimeout(() => {
                                            LaunchApp(param);
                                        }, 150);
                                    },
                                    parent: modalBody
                                });

                                launchBtn.add();

                                installConsole.get().scrollTop = installConsole.get().scrollHeight;
                            }, (logs.length + 1) * timeout);
                        },
                        classes: ['w-100 mt-5'],
                        width: '100%',
                        parent: modalBody,
                        type: 'primary',
                        value: 'Install'
                    });

                    installBtn.add();

                    const modifyBtn = BootstrapButton({
                        action(event) {
                            window.open(`${App.get('site')}/${library || 'App'}/src`);
                        },
                        classes: ['w-100 mt-2'],
                        width: '100%',
                        parent: modalBody,
                        type: 'outline-primary',
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
                                        Installation cancelled. You can safely close this page. Reload page to resume install.
                                    </div>
                                `);
                            });

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
    });

    loadingBar.add();

    Store.add({
        name: 'app-loading-bar',
        component: loadingBar
    });
}
// @END-File
