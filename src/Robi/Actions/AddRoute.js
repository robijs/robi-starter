import { Modal } from '../Components/Modal.js'
import { BootstrapButton } from '../Components/BootstrapButton.js'
import { BootstrapDropdown } from '../Components/BootstrapDropdown.js'
import { LoadingSpinner } from '../Components/LoadingSpinner.js'
import { Alert } from '../Components/Alert.js'
import { SingleLineTextField } from '../Components/SingleLineTextField.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { CreateFolder } from '../Actions/CreateFolder.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { Wait } from './Wait.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function AddRoute(param) {
    // Show modal
    console.log('add route');

    const addRouteModal = Modal({
        title: false,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            // addRouteModal.find('.modal-dialog').style.maxWidth = 'fit-content';

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-3'>Add route</h3>
            `);

            const paths = Store.routes().filter(route => route.type !== 'system').map(route => route.path.toLowerCase());
            let pathExists;

            // Route title
            const routeTitle = SingleLineTextField({
                label: 'Title',
                parent: modalBody,
                onKeyup(event) {
                    canEnable();
                    // FIXME: Handle spaces (e.g. Test vs Test 2)
                    // TODO: Can't start with a number
                },
                onFocusout(event) {
                    const path = routeTitle.value().toTitleCase().split(' ').join('');
                    routePath.value(path);
                    showMessage(path);
                }
            });

            routeTitle.add();

            // Route path
            // TODO: Prevent creating paths that already exist
            const routePath = SingleLineTextField({
                label: 'Path',
                addon: App.get('site') + '/App/src/pages/app.aspx#',
                parent: modalBody,
                onKeydown(event) {
                    if (event.code === 'Space' || event.code === 'Tab') {
                        return false;
                    }
                },
                onKeyup(event) {
                    canEnable();

                    showMessage(routePath.value());
                }
            });

            routePath.add();

            // Route icon
            const routeIcon = BootstrapDropdown({
                label: 'Icon',
                parent: modalBody, 
                maxHeight: '150px',
                maxWidth: '100px',
                valueType: 'html',
                value: /*html*/ `
                    <div class='d-flex justify-content-center w-100' data-target='true'>
                        <svg class='icon' style='font-size: 18px; fill: ${App.get('primaryColor')};'>
                            <use href='#icon-bs-circle-fill'></use>
                        </svg>
                    </div>
                `,
                options: Store.get('svgdefs').getIcons().map(icon => {
                    return {
                        label: /*html*/ `
                            <div class='d-flex justify-content-center w-100' data-target='true'>
                                <svg class='icon' style='font-size: 18px; fill: ${App.get('primaryColor')};'>
                                    <use href='#${icon}'></use>
                                </svg>
                            </div>
                        `
                    }
                }),
                action(event) {
                    canEnable();
                }
            });

            routeIcon.add();

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
                                message: `<span style='color: ${App.get('primaryColor')};'>Adding Route<span>`,
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

                    await updateApp();
                    await createRoute();

                    if (App.get('mode') === 'prod') {
                        // Wait additional 2s
                        console.log('Waiting...');
                        await Wait(3000);
                        location.reload();
                    }

                    modal.close();

                    async function updateApp() {
                        // Update app.js
                        let digest;
                        let request;

                        if (App.get('mode') === 'prod') {
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
                            request = await fetch(`http://127.0.0.1:8080/src/app.js`);
                            await Wait(1000);
                        }

                        let content = await request.text();
                        let updatedContent;

                        // Set import
                        const imports = content.match(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/);
                        const newImports = imports[1] + `import ${routePath.value()} from './Routes/${routePath.value()}/${routePath.value()}.js'\n`
                        updatedContent = content.replace(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/, `// @START-IMPORTS${newImports}// @END-IMPORTS`);

                        // Set routes
                        const routes = content.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
                        const ordered = routes[1].split(', // @ROUTE');
                        const icon = routeIcon.value().querySelector('use').href.baseVal.replace('#icon-', '');
                        // FIXME: replace hard coded spaces (4 === 1 tab) with variable that includes 4 space characters
                        const newRoute = [
                            ``,
                            `        // @START-${routePath.value()}`,
                            `        {`,
                            `            path: '${routePath.value()}',`,
                            `            icon: '${icon}',`,
                            `            go: ${routePath.value()}`,
                            `        }`,
                            `        // @END-${routePath.value()}`,
                            ``
                        ].join('\n');

                        ordered.push(newRoute);

                        console.log('New:', ordered);

                        const newRoutes = ordered.join(', // @ROUTE');

                        console.log(newRoutes);

                        // TODO: Will you always need to add 8 spaces before // @END-ROUTES?
                        updatedContent = updatedContent.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${newRoutes}        // @END-ROUTES`);

                        console.log('OLD\n----------------------------------------\n', content);
                        console.log('\n****************************************');
                        console.log('NEW\n----------------------------------------\n', updatedContent);
                        console.log('\n****************************************');

                        let setFile;

                        if (App.get('mode') === 'prod') {
                            // TODO: Make a copy of app.js first
                            // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
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
                            setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                                method: 'POST',
                                body: updatedContent
                            });
                            await Wait(1000);
                        }

                        console.log('Saved:', setFile);
                    }

                    async function createRoute() {
                        // TODO: Move to template file
                        let contents = [
                            `import { Title } from '../../Robi/RobiUI.js'`,
                            ``,
                            `export default async function Measures({ parent, pathParts, props }) {`,
                            `    // View title`,
                            `    const viewTitle = Title({`,
                            `        title: /* @START-Title */'${routeTitle.value()}'/* @END-Title */,`,
                            `        parent,`,
                            `        date: new Date().toLocaleString('en-US', {`,
                            `            dateStyle: 'full'`,
                            `        }),`,
                            `        type: 'across'`,
                            `    });`,
                            ``,
                            `    viewTitle.add();`,
                            `}`
                        ].join('\n');

                        let newFile;

                        if (App.get('mode') === 'prod') {
                            // Create Route dir
                            await CreateFolder({
                                path: `App/src/Routes/${routePath.value()}`
                            });

                            // Create Route file
                            // TODO: Create Route dir and file
                            const path = `${App.get('library')}/src/Routes/${routePath.value()}`
                            const targetSiteUrl = App.get('site') + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + `${routePath.value()}.js` + "',overwrite=true)";
                            const srcRequestDigest = await GetRequestDigest();
                            
                            // TODO: Add check for App/src path so other paths that you might want to copy from aren't affected
                            newFile = await fetch(targetSiteUrl, {
                                method: 'POST',
                                body: contents, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': srcRequestDigest
                                }
                            });
                        } else {
                            console.log('create route dir and file');
                            // Create file (missing dirs will be created recursively)
                            newFile = await fetch(`http://127.0.0.1:2035/?path=src/Routes/${routePath.value()}&file=${routePath.value()}.js`, {
                                method: 'POST',
                                body: contents
                            });
                            await Wait(1000);
                        }
                    }
                },
                disabled: true,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Add route'
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

            // Show message if path already exists
            function showMessage(value) {
                if (paths.includes(value.toLowerCase())) {
                    // Show message
                    if (!pathExists) {
                        pathExists = Alert({
                            type: 'danger',
                            text: `A route with path <strong>${value}</strong> already exists`,
                            classes: ['alert-in', 'w-100'],
                            top: routePath.get().offsetHeight + 5,
                            parent: routePath
                        });

                        pathExists.add();
                    }
                } else {
                    // Remove message
                    if (pathExists) {
                        pathExists.remove();
                        pathExists = null;
                    }
                }
            }

            // Check if all fields are filled out and path doesn't already exist
            function canEnable() {
                if (routeTitle.value() && routePath.value() && !paths.includes(routePath.value().toLowerCase())) {
                    addRouteBtn.enable();
                } else {
                    addRouteBtn.disable();
                }
            }

            // FIXME: Experimental. Not sure if this will work everytime.
            setTimeout(() => {
                routeTitle.focus();
            }, 500);
        },
        centered: true,
        showFooter: false,
    });

    addRouteModal.add();
}
// @END-File
