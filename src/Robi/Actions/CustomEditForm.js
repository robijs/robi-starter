import { Modal } from '../Components/Modal.js'
import { BootstrapButton } from '../Components/BootstrapButton.js'
import { LoadingSpinner } from '../Components/LoadingSpinner.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { App } from '../Core/App.js'
import { Wait } from './Wait.js'
import { EditFormTemplate } from '../Templates/EditFormTemplate.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function CustomEditForm({ list, display, fields }) {
    const addRouteModal = Modal({
        title: false,
        scrollable: true,
        close: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            addRouteModal.find('.modal-dialog').style.maxWidth = 'fit-content';
            addRouteModal.find('.modal-dialog').style.minWidth = '800px';

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-4'>Custom edit form</h3>
                <div>
                    <strong>${display || list}</strong> doesn't have a custom edit form yet. Would you like to create one?
                </div>
            `);

            const addRouteBtn = BootstrapButton({
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
                                message: `<span style='color: var(--primary);'>Creating custom Edit Form<span>`,
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

                    await updateSchema();
                    await createForm();

                    if (App.isProd()) {
                        await Wait(5000);
                    }

                    location.reload();

                    modal.close();

                    async function updateSchema() {
                        // Update app.js
                        let digest;
                        let request;

                        if (App.isProd()) {
                            // digest = await GetRequestDigest();
                            // request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('lists.js')/$value`, {
                            //     method: 'GET',
                            //     headers: {
                            //         'binaryStringRequestBody': 'true',
                            //         'Accept': 'application/json;odata=verbose;charset=utf-8',
                            //         'X-RequestDigest': digest
                            //     }
                            // });
                        } else {
                            request = await fetch(`http://127.0.0.1:8080/src/Lists/${list}/Schema.js`);
                            await Wait(1000);
                        }

                        let content = await request.text();
                        let updatedContent = content.trim().replace(/[\s]*?(export default {[\s\S]*?})$/, `\nimport EditForm from './EditForm.js'\n\n$1`).trim();
                        updatedContent = updatedContent.replace(/(\s\S*?})$/, `,\n    editForm: EditForm$1`);

                        console.log(updatedContent);

                        let setFile;

                        if (App.isProd()) {
                            setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='lists.js',overwrite=true)`, {
                                method: 'POST',
                                body: updatedContent, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            setFile = await fetch(`http://127.0.0.1:2035/?path=src/Lists/${list}&file=Schema.js`, {
                                method: 'POST',
                                body: updatedContent
                            });
                            await Wait(1000);
                        }

                        console.log('Saved:', setFile);
                    }

                    async function createForm() {
                        const contents = EditFormTemplate({
                            list,
                            display,
                            fields: fields
                        });

                        console.log(contents);
                    
                        let newFile;

                        // TODO: Create Forms sub directory if it doesn't exist
                        if (App.isProd()) {
                            // // Create Route dir
                            // await CreateFolder({
                            //     path: `App/src/Routes/${routePath.value()}`
                            // });

                            // // Create Route file
                            // // TODO: Create Route dir and file
                            // const path = `${App.get('library')}/src/Routes/${routePath.value()}`
                            // const targetSiteUrl = App.get('site') + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + `${routePath.value()}.js` + "',overwrite=true)";
                            // const srcRequestDigest = await GetRequestDigest();
                            
                            // // TODO: Add check for App/src path so other paths that you might want to copy from aren't affected
                            // newFile = await fetch(targetSiteUrl, {
                            //     method: 'POST',
                            //     body: contents, 
                            //     headers: {
                            //         'binaryStringRequestBody': 'true',
                            //         'Accept': 'application/json;odata=verbose;charset=utf-8',
                            //         'X-RequestDigest': srcRequestDigest
                            //     }
                            // });
                        } else {
                            console.log('create route dir and file');
                            // Create file (missing dirs will be created recursively)
                            newFile = await fetch(`http://127.0.0.1:2035/?path=editform&file=${list}`, {
                                method: 'POST',
                                body: contents
                            });
                            await Wait(1000);
                        }
                    }
                },
                classes: ['w-100 mt-4'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Create'
            });

            addRouteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel add route');

                    addRouteModal.close();
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

    addRouteModal.add();
}
// @END-File
