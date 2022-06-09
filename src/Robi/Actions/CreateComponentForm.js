import { Modal } from '../Components/Modal.js'
import { Button } from '../Components/Button.js'
import { LoadingSpinner } from '../Components/LoadingSpinner.js'
import { SingleLineTextField } from '../Components/SingleLineTextField.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { CreateFolder } from '../Actions/CreateFolder.js'
import { App } from '../Core/App.js'
import { ComponentTemplate } from '../Templates/ComponentTemplate.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function CreateComponentForm({ parent, route }) {
    const addRouteModal = Modal({
        title: false,
        scrollable: true,
        close: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            addRouteModal.find('.modal-dialog').style.maxWidth = 'fit-content';
            addRouteModal.find('.modal-dialog').style.minWidth = '800px';

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-3'>Create a new component</h3>
            `);

            // TODO: Prevent creating components that already exist
            const fileName = SingleLineTextField({
                label: 'Name',
                addon: `src/Routes/${route.path}/`,
                parent: modalBody,
                onKeydown(event) {
                    if (event.code === 'Space' || event.code === 'Tab') {
                        return false;
                    }
                },
                onKeyup(event) {
                    if (fileName.value()) {
                        addFileBtn.enable();
                    } else {
                        addFileBtn.disable();
                    }
                }
            });

            fileName.add();

            const addFileBtn = Button({
                async action() {
                    // TODO: Generalize show save modal and blur background
                    // Update app.js first or live-server will reload when
                    // Route/Path/Path.js is created
                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        scrollable: true,
                        shadow: true,
                        async addContent(modalBody) {
                            modal.find('.modal-content').style.width = 'unset';

                            const loading = LoadingSpinner({
                                message: /*html*/ `
                                    <span style='color: var(--primary);'>
                                        <span>Creating component</span>
                                        <span style='font-weight: 700; font-family:'>'${fileName.value()}'</span>
                                    <span>
                                `,
                                type: 'robi',
                                classes: ['p-4'],
                                parent: modalBody
                            });
                
                            loading.add();
                        },
                        centered: true,
                        showFooter: false,
                        position: 'afterend'
                    });

                    modal.add();

                    // Blur entire app
                    document.querySelector('#app').style.transition = 'filter 150ms';
                    document.querySelector('#app').style.filter = 'blur(5px)';

                    addImportToRoute();
                    createNewFile();

                    // if (App.isProd()) {
                    //     await Wait(5000);
                    // } else {
                    //     await Wait(1000);
                    // }

                    // $(modal.get()).on('hidden.bs.modal', function (e) {
                    //     location.reload();
                    // });

                    // modal.close();

                    async function addImportToRoute() {
                        let digest;
                        let request;

                        // TODO: Update SharePoint API

                        if (App.isProd()) {
                            digest = await GetRequestDigest();
                            request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('app.js')/$value`, {
                                method: 'GET',
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            request = await fetch(`http://127.0.0.1:8080/src/Routes/${route.path}/${route.path}.js`);
                        }

                        let content = await request.text();

                        // Set import
                        const imports = content.match(/\/\/ @START-Imports([\s\S]*?)\/\/ @END-Imports/);
                        const newImports = imports[1] + `import ${fileName.value()} from './${fileName.value()}.js'\n`
                        const updatedContent = content.replace(/\/\/ @START-Imports([\s\S]*?)\/\/ @END-Imports/, `// @START-Imports${newImports}// @END-Imports`);

                        let setFile;

                        if (App.isProd()) {
                            setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
                                method: 'POST',
                                body: updatedContent, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            setFile = await fetch(`http://127.0.0.1:2035/?path=src/Routes/${route.path}&file=${route.path}.js`, {
                                method: 'POST',
                                body: updatedContent
                            });
                        }
                    }

                    async function createNewFile() {
                        const contents = ComponentTemplate({
                            name: fileName.value()
                        });

                        if (App.isProd()) {
                            // Create Route dir
                            await CreateFolder({
                                path: `App/src/Routes/${fileName.value()}`
                            });

                            // Create Route file
                            // TODO: Create Route dir and file
                            const path = `${App.get('library')}/src/Routes/${fileName.value()}`
                            const targetSiteUrl = App.get('site') + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + `${fileName.value()}.js` + "',overwrite=true)";
                            const srcRequestDigest = await GetRequestDigest();
                            
                            // TODO: Add check for App/src path so other paths that you might want to copy from aren't affected
                            const newFile = await fetch(targetSiteUrl, {
                                method: 'POST',
                                body: contents, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': srcRequestDigest
                                }
                            });

                            return newFile;
                        }
                        
                        const newFile = await fetch(`http://127.0.0.1:2035/?path=src/Routes/${route.path}&file=${fileName.value()}.js`, {
                            method: 'POST',
                            body: contents
                        });

                        return newFile;
                    }
                },
                disabled: true,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Create component'
            });

            addFileBtn.add();

            const cancelBtn = Button({
                action(event) {
                    addRouteModal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();

            setTimeout(() => {
                fileName.focus();
            }, 350);
        },
        parent,
        // centered: true,
        showFooter: false,
    });

    addRouteModal.add();
}
// @END-File
