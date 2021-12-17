// Copyright 2021 Stephen Matheis

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER
// RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
// CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
// CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

import {
    Alert,
    AppContainer,
    BootstrapButton,
    BootstrapDropdown,
    BootstrapTextarea,
    Container,
    Developer,
    Files,
    FixedToast,
    Help,
    InstallConsole,
    LoadingBar,
    LoadingSpinner,
    MainContainer,
    Missing,
    Modal,
    ProgressBar,
    QuestionAndReplies,
    QuestionBoard,
    QuestionTypes,
    ReleaseNotesContainer,
    Settings,
    Sidebar,
    SingleLineTextField,
    SourceTools,
    SvgDefs,
    ThemeField,
    Title,
    Toast,
    Unauthorized,
    Users,
    ViewContainer
} from './RobiUI.js'

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
// Hello world!
export async function AddColumnToView(param) {
    const {
        list,
        view,
        name,
        updateProgressCount
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Views/GetByTitle('${view || 'All Items'}')/ViewFields/addViewField('${name}')`,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    const newField = await Post(postOptions);

    // Console success
    console.log(`Added to ${view || 'All Items'}: ${name}.`);

    // Append to install-console
    const installConsole = Store.get('install-console');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Added '${name}' to '${view || 'All Items'}' view</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    const progressBar = Store.get('install-progress-bar');

    if (progressBar && updateProgressCount !== false) {
        progressBar.update();
    }

    return newField.d;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function AddLinks(param) {
    const {
        links,
    } = param;

    const head = document.querySelector('head');

    if (!links) {
        return;
    }

    links.forEach(link => head.append(createLinkElement(link)));

    function createLinkElement(link) {
        const {
            rel,
            as,
            href,
            path
        } = link;

        const linkElement = document.createElement('link');

        linkElement.setAttribute('rel', rel || 'stylesheet');

        if (as) {
            linkElement.setAttribute('as', as);
        }

        const relativePath = App.get('mode') === 'prod' ? `${App.get('site')}/${App.get('library')}/src` : `/src/`;

        // TODO: default relative path might not be right, test locally and on SP
        linkElement.setAttribute('href', `${path || relativePath}${href}`);

        return linkElement;
    }
}

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
            addRouteModal.find('.modal-dialog').style.maxWidth = 'fit-content';

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
                type: 'light',
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

/**
 * 
 * @param {Object} param - Single function argument.
 * @param {String} param.string - Name of the SharePoint list.
 * @param {Number} param.id - SharePoint list item id.
 * @param {Files} param.files - Type FileList. From <input type='files'>. {@link https://developer.mozilla.org/en-US/docs/Web/API/FileList}
 * 
 * @returns {Object} SharePoint list item.
 */
export async function AttachFiles(param) {
    /** Destructure Interface */
    const {
        list,
        itemId,
        files
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // Upload responses
    const responses = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = file.name;
        const fileBuffer = await getFileBuffer(file);

        const upload = await fetch(`${App.get('site')}/_api/web/lists/getbytitle('${list}')/items(${itemId})/AttachmentFiles/add(FileName='${name}')`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; odata=verbose',
                'content-type': 'application/json; odata=verbose',
                'X-RequestDigest': requestDigest,
            },
            body: fileBuffer
        });

        responses.push(upload);
    }

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    await Promise.all(responses);

    const getUpdatedItem = await Get({
        list,
        filter: `Id eq ${itemId}`,
        select: `Attachments,AttachmentFiles${list === ',References' ? 'Description' : ''}`,
        expand: 'AttachmentFiles',
    });

    return getUpdatedItem[0];
}

/**
 * Determines if role (defaults to current user's role from store.user().Role)
 * is authorized to access passed in view as string or objection property param.view
 * @param {(String|Object)} param most likely a View name as a string
 * @param {string} param.view if param is a object, view is a required property
 * @param {string} param.role if param is a object, role is an optional propety
 * @returns {(undefied|false|true)}
 */
export function Authorize(param) {
    let role, view;

    if (typeof param === 'string') {
        role = Store.user().Role;
        view = param;
    } else if (typeof param === 'object') {
        role = param.role || Store.user().Role;
        view = param.view;
    }

    /** Find route */
    const route = Store.routes().find(item => item.path === view);

    /** If route not found, return undefined */
    if (!route) {
        return;
    }

    const {
        roles
    } = route;

    /** If roles property not defined on route object, return undefined */
    if (roles) {
        if (roles.includes(role)) {
            /** Authorized if role is included in roles array */
            console.log(`${Store.user().Title} authorized to access '${view}' as a '${role}'`)
            return true;
        } else {
            /** Unauthroized if role is not included in roles array */
            if (param.route !== false) {
                /** If param.route isn't set to false, route to View 403 */
                Route('403');
            }

            return false;
        }
    } else {
        return undefined;
    }
}

/**
 * 
 * @param {*} param0 
 */
export function BlurOnSave({ message }) {
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
                message: `<span style='color: ${App.get('primaryColor')};'>${message}<span>`,
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

    return {
        async off(onClose) {
            await Wait(1500);

            document.querySelector('#app').style.transition = 'unset';
            document.querySelector('#app').style.filter = 'unset';

            modal.close(onClose);
        }
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function CheckLists() {
    const listsToIgnore = ['App', 'Composed Looks', 'Documents', 'Master Page Gallery', 'MicroFeed', 'Site Assets', 'Site Pages'];
    const coreLists = Lists();
    const appLists = App.lists();
    const allLists = coreLists.concat(appLists);
    const filesLists = allLists.filter(item => item.options?.files).map(item => { return { list: `${item.list}Files` } }); // Don't include ListNameFiles if options.files is true
    const webLists = await GetWebLists();
    const installedLists = webLists.map(item => item.Title).filter(x => allLists.map(item => item.list).includes(x));
    const diffToCreate = allLists.map(item => item.list).filter(x => !webLists.map(item => item.Title).includes(x));
    const diffToDelete = webLists.map(item => item.Title).filter(x => !allLists.concat(filesLists).map(item => item.list).includes(x) && !listsToIgnore.includes(x));
    console.log('All Lists:', allLists);
    console.log('Files Lists:', filesLists);
    console.log('Web Lists:', webLists);
    console.log('Installed Lists:', installedLists);
    console.log('Create:', diffToCreate);
    console.log('Delete:', diffToDelete);

    // News lists that need to be created
    const toCreate = diffToCreate.map(list => allLists.find(item => item.list === list));

    // Existing lists that need to be deleted
    // TODO: Show checklist of lists that could be deleted, default to DO NOT Delete
    const toDelete = diffToDelete.map(list => webLists.find(item => item.Title === list));

    // Has the schema changed on any lists?
    const fieldsToIgnore = ['ContentTypeId', 'Title', '_ModerationComments', 'File_x0020_Type', 'ID', 'Id', 'ContentType', 'Modified', 'Created', 'Author', 'Editor', '_HasCopyDestinations', '_CopySource', 'owshiddenversion', 'WorkflowVersion', '_UIVersion', '_UIVersionString', 'Attachments', '_ModerationStatus', 'Edit', 'LinkTitleNoMenu', 'LinkTitle', 'LinkTitle2', 'SelectTitle', 'InstanceID', 'Order', 'GUID', 'WorkflowInstanceID', 'FileRef', 'FileDirRef', 'Last_x0020_Modified', 'Created_x0020_Date', 'FSObjType', 'SortBehavior', 'PermMask', 'FileLeafRef', 'UniqueId', 'SyncClientId', 'ProgId', 'ScopeId', 'HTML_x0020_File_x0020_Type', '_EditMenuTableStart', '_EditMenuTableStart2', '_EditMenuTableEnd', 'LinkFilenameNoMenu', 'LinkFilename', 'LinkFilename2', 'DocIcon', 'ServerUrl', 'EncodedAbsUrl', 'BaseName', 'MetaInfo', '_Level', '_IsCurrentVersion', 'ItemChildCount', 'FolderChildCount', 'AppAuthor', 'AppEditor'];
    const libraryFieldsToIgnore = [
        'Modified_x0020_By',
        'Created_x0020_By',
        '_SourceUrl',
        '_SharedFileIndex',
        'TemplateUrl',
        'xd_ProgID',
        'xd_Signature',
        'i3e7b0477ad24f0693a0b6cb17b27bf1',
        'TaxCatchAll',
        'TaxCatchAllLabel',
        'Document_x0020_Type',
        '_dlc_DocId',
        '_dlc_DocIdUrl',
        '_dlc_DocIdPersistId',
        'mb7b7c6cb3b94febb95b36ae1f78ffc5',
        'Organization',
        'ba60022a341749df97d7a0ab674012b7',
        'Document_x0020_Status',
        'File_x0020_Size',
        'CheckedOutUserId',
        'IsCheckedoutToLocal',
        'CheckoutUser',
        'VirusStatus',
        'CheckedOutTitle',
        '_CheckinComment',
        'LinkCheckedOutTitle',
        'FileSizeDisplay',
        'SelectFilename',
        'ParentVersionString',
        'ParentLeafName',
        'DocConcurrencyNumber',
        'Combine',
        'RepairDocument'
    ];
    const schemaAdd = [];
    const schemaDelete = [];

    installedLists
        .map(listName => {
            const { list, fields, template } = allLists.find(item => item.list === listName);

            return { list, fields, template, web: webLists.find(item => item.Title === listName) };
        })
        .forEach(item => {
            const { list, fields, template, web } = item;

            const webFields = web.Fields.results.map(webField => {
                const { StaticName, TypeDisplayName } = webField;

                return { name: StaticName, type: TypeDisplayName };
            });

            console.log(list, template);

            const fieldsToCreate = fields.map(item => item.name).filter(x => !webFields.map(item => item.name).includes(x));
            const fieldsToDelete = webFields.map(item => item.name).filter(x => !fields.map(item => item.name).includes(x) && !fieldsToIgnore.includes(x) && (template === 101 ? !libraryFieldsToIgnore.includes(x) : true));

            console.log();

            if (fieldsToCreate.length) {
                schemaAdd.push({
                    list,
                    fields: fieldsToCreate
                });
            }

            if (fieldsToDelete.length) {
                schemaDelete.push({
                    list,
                    fields: fieldsToDelete
                });
            }

            console.log('List:', list);
            console.log('--------------------');
            // console.log('List Fields:', fields);
            // console.log('Web Fields:', webFields);
            console.log('Create fields:', fieldsToCreate);
            console.log('Remove fields:', fieldsToDelete);
            console.log(' ');
        });

    console.log('Fields to add:', schemaAdd);
    console.log('Fields to delete:', schemaDelete);

    return { 
        coreLists,
        appLists,
        allLists,
        filesLists,
        webLists,
        installedLists,
        diffToCreate,
        diffToDelete,
        toCreate,
        toDelete,
        schemaAdd,
        schemaDelete
    };
}

/** {@link https://css-tricks.com/converting-color-spaces-in-javascript/} */
const Colors = {
    "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
    "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
    "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
    "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
    "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
    "honeydew": "#f0fff0", "hotpink": "#ff69b4",
    "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
    "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
    "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
    "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead", "navy": "#000080",
    "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
    "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
    "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
    "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00", "yellowgreen": "#9acd32"
};

export { Colors }

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Component(param) {
    const {
        name,
        locked,
        html,
        style,
        parent,
        position,
        onAdd
    } = param;

    let {
        events
    } = param;

    const id = Store.getNextId();

    /** @private */
    function addStyle() {
        const styleNodeWithSameName = document.querySelector(`style[data-name='${name}']`);

        if (name && styleNodeWithSameName) {
            return;
        }

        const css = /*html*/ `
            <style type='text/css' data-name='${name || id}' data-type='component' data-locked='${name || locked ? 'yes' : 'no'}' >
                ${style.replace(/#id/g, `#${id}`)}
            </style>
        `;
        const head = document.querySelector('head');

        head.insertAdjacentHTML('beforeend', css);
    }

    function insertElement(localParent) {
        localParent = localParent || parent;

        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(html, 'text/html');
        const newElement = parsedHTML.body.firstElementChild;

        newElement.id = id;

        try {
            let parentElement;

            if (!localParent) {
                parentElement = document.querySelector('#app');
            } else if (localParent instanceof Element) {
                parentElement = localParent;
            } else if (localParent instanceof Object) {
                parentElement = localParent.get();
            }

            parentElement.insertAdjacentElement(position || 'beforeend', newElement);
        } catch (error) {
            console.log('Parent element removed from DOM. No need to render component.');
        }
    }

    function addEventListeners() {
        if (!events) {
            return;
        }

        events.forEach(item => {
            const eventTypes = item.event.split(' ');

            eventTypes.forEach(event => {
                if (typeof item.selector === 'string') {
                    const replaceIdPlaceholder = item.selector.replace(/#id/g, `#${id}`);

                    document.querySelectorAll(replaceIdPlaceholder).forEach((node) => {
                        node.addEventListener(event, item.listener);
                    });
                } else {
                    item.selector.addEventListener(event, item.listener);
                }
            });
        });
    }

    return {
        addEvent(param) {
            /** Register event */
            events.push(param);

            /** Add event listner */
            const {
                event,
                listener
            } = param;

            this.get().addEventListener(event, listener);
        },
        /** @todo remove this method */
        removeEvent(param) {
            const {
                selector,
                event,
                listener
            } = param;

            /** Find event */
            const eventItem = events.find(item => item.selector === selector && item.event === event && item.listener === listener);

            /** Deregister event */
            const index = events.indexOf(eventItem);

            console.log(index);

            /** Remove event element from events array */
            events.splice(index, 1);

            /** Remove event listner */
            selector.addEventListener(event, listener);
        },
        removeEvents() {
            events.forEach(item => {
                const eventTypes = item.event.split(' ');

                eventTypes.forEach(event => {
                    if (typeof item.selector === 'string') {
                        const replaceIdPlaceholder = item.selector.replace(/#id/g, `#${id}`);

                        document.querySelectorAll(replaceIdPlaceholder).forEach((node) => {
                            node.removeEventListener(event, item.listener);
                        });
                    } else {
                        item.selector.removeEventListener(event, item.listener);
                    }
                });
            });
        },
        getParam() {
            return param;
        },
        get() {
            return document?.querySelector(`#${id}`);
        },
        find(selector) {
            return this.get()?.querySelector(selector);
        },
        findAll(selector) {
            return this.get()?.querySelectorAll(selector);
        },
        closest(selector) {
            return this.get()?.closest(selector);
        },
        // element() {
        //     const parser = new DOMParser();
        //     const parsedHTML = parser.parseFromString(html, 'text/html');

        //     return parsedHTML.body.firstElementChild;
        // },
        hide() {
            this.get().style.display = 'none';
        },
        show(display) {
            this.get().style.display = display || 'revert';
        },
        refresh() {
            this.remove();

            /** @todo This does not reset local variables (e.g. files array in Component_AttachFilesField) */
            this.add();
        },
        remove(delay = 0) {
            const node = this.get();

            if (delay) {
                setTimeout(findAndRemoveStyleAndNode, delay);
            } else {
                findAndRemoveStyleAndNode();
            }

            function findAndRemoveStyleAndNode() {
                const styleNode = document.querySelector(`style[data-name='${id}']`);

                if (styleNode) {
                    styleNode.remove();
                }

                if (node) {
                    node.remove();
                }
            }
        },
        empty() {
            this.get().innerHTML = '';
        },
        append(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('beforeend', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('beforeend', param);
            }
        },
        before(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('beforebegin', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('beforebegin', param);
            }
        },
        add(localParent) {
            addStyle();
            insertElement(localParent);
            addEventListeners();

            if (onAdd) {
                onAdd();
            }
        }
    };
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function CopyFile(param) {
    const {
        source,
        target,
        path,
        file,
        appName,
        appTitle,
        theme
    } = param;

    const sourceSiteUrl = source + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files('" + file + "')/$value";
    const targetSiteUrl = target + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + file + "',overwrite=true)";
    const srcRequestDigest = await GetRequestDigest({ site: source });
    const getFileValue = await fetch(sourceSiteUrl, {
        method: 'GET',
        headers: {
            'binaryStringRequestBody': 'true',
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': srcRequestDigest
        }
    });

    let contents = file === 'app.js' ? await getFileValue.text() : await getFileValue.arrayBuffer();

    // TODO: Add check for App/src path so other paths that you might want to copy an app.js file from aren't affected
    if (file === 'app.js') {
        console.log('CopyFile.js', {
            source,
            target,
            path,
            file,
            appName,
            appTitle,
            theme
        });

        // Name
        contents = contents.replace(/\/\* @START-name \*\/([\s\S]*?)\/\* @END-name \*\//, `/* @START-name */'${appName}'/* @END-name */`);

        // Title
        contents = contents.replace(/\/\* @START-title \*\/([\s\S]*?)\/\* @END-title \*\//, `/* @START-title */'${appTitle}'/* @END-title */`);

        // Theme
        contents = contents.replace(/\/\* @START-theme \*\/([\s\S]*?)\/\* @END-theme \*\//, `/* @START-theme */'${theme}'/* @END-theme */`);
    }

    console.log(contents);

    const newFile = await fetch(targetSiteUrl, {
        method: 'POST',
        body: contents, 
        headers: {
            'binaryStringRequestBody': 'true',
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': srcRequestDigest
        }
    });

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    if (newFile) {
        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created file '${file}'</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        if (progressBar) {
            progressBar.update();
        }
    }

    return newFile;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function CopyRecurse(param) {
    const { 
        path,
        filter,
        targetWeb,
        appName,
        appTitle,
        theme,
    } = param;
    
    // 1. Look for files at top level of source site
    const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files`;
    
    console.log(url);

    const requestDigest = await GetRequestDigest();
    const options = {
        method: 'GET',
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-type": "application/json; odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    };
    const query = await fetch(url, options);
    const response = await query.json();

    if (response.d.results.length) {
        console.log(`Top level files in '${path}'`)
        
        for (let item in response.d.results) {
            const file = response.d.results[item];
            const { Name } = file;

            await CopyFile({
                source: App.get('site'),
                target: `${App.get('site')}/${targetWeb}`,
                path,
                file: Name,
                appName,
                appTitle,
                theme
            });

            console.log(`File '${Name}' copied.`);
        }
    } else {
        console.log(`No files in '${path}'`);
    }

    // 2. Look for directories
    const dirs = await GetFolders({ path, filter });

    for (let item in dirs) {
        const file = dirs[item];
        const { Name } = file;
        
        console.log(`- ${Name}`);
        // 3 Create dirs
        await CreateFolder({
            web: targetWeb,
            path: `${path}/${Name}`
        });

        console.log(`Folder '${Name}' copied.`);

        // Recurse into dir
        await CopyRecurse({
            path: `${path}/${Name}`,
            targetWeb,
            appName,
            appTitle,
            theme
        });
    }

    return true;
}

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
                type: 'robi-reverse',
                value: 'Create app'
            });

            installBtn.add();

            // Trigger install on enter
            // modal.get().addEventListener('keypress', event => {
            //     if (event.ctrlKey && event.code === 'Enter') {
            //         event.preventDefault();

            //         createNewSite(event);
            //     }
            // });

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
                    background: App.get('backgroundColor')
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
                        <code style='color: ${App.get('primaryColor')} !important;'>${spacers}</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: ${App.get('primaryColor')} !important;'>| '${title}' created |</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: ${App.get('primaryColor')} !important;'>${spacers}</code>
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

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export async function CreateColumn(param) {
    const {
        list,
        field,
        view,
        updateProgressCount
    } = param;

    const {
        name,
        type,
        choices,
        fillIn,
        title,
        lookupList,
        lookupField,
        value
    } = field;

    // Get new request digest
    const requestDigest = await GetRequestDigest();
    const getField = await fetch(`${App.get('site')}/_api/web/lists/getByTitle('${list}')/fields`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': requestDigest
        }
    });
    const response = await getField.json();

    // Existing list columns 
    const fields = response?.d?.results.map(item => item.Title);

    // Don't create columns with reserved SharePoint names or already exist
    if (fields.includes(name)) {
        await exists();
        return;
    }

    // Robi reserves some column names as well
    const robiFields = [ 'Files' ];

    if (robiFields.includes(name)) {
        await reserved();
        return;
    }

    async function exists() {
        // Console 
        console.log(`Column '${name}' already exists or is a reserved SharePoint name.`);

        // Add to Install Console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code style='color: orange'>Column '${name}' already exists or is a reserved SharePoint name.</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        // Update column instead
        await UpdateColumn(param);

        const progressBar = Store.get('install-progress-bar');

        if (progressBar && updateProgressCount !== false) {
            // +1 since not adding to column to view
            progressBar.update();
        }

        // TODO: Update progress bar or error out if update fails
        return;
    }

    async function reserved() {
        // Console 
        console.log(`Column '${name}' is reserved for Robi. A list column with this name can't be created.`);

        // Add to Install Console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code style='color: orange'>Column '${name}' is reserved for Robi. A list column with this name can't be created.</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        // Update column instead
        await UpdateColumn(param);

        const progressBar = Store.get('install-progress-bar');

        if (progressBar && updateProgressCount !== false) {
            // +1 since not adding to column to view
            progressBar.update();
        }

        // TODO: Update progress bar or error out if update fails
        return;
    }

    let data = {};

    if (type === 'choice') {
        data = { 
            __metadata: { 
                "type": "SP.FieldChoice" 
            },
            FieldTypeKind: 6,
            Title: name,
            DefaultValue: value,
            Choices: { 
                // __metadata: { 
                //     "type": "Collection(Edm.String)" 
                // }, 
                results: choices 
            }
        };
    } else if (type === 'multichoice') {
        data = { 
            __metadata: { 
                "type": "SP.FieldChoice" 
            },
            FieldTypeKind: 15,
            Title: name,
            FillInChoice: fillIn,
            DefaultValue: value,
            Choices: { 
                results: choices 
            }
        };
    } else if (type === 'lookup') {
        const listGuid = await GetListGuid(lookupList);

        data = { 
            __metadata: { 
                "type": "SP.FieldCreationInformation" 
            }, 
            FieldTypeKind: 7,
            Title: title, 
            LookupListId: listGuid,
            LookupFieldName: lookupField
        };
    } else {
        data = {
            __metadata: {
                'type': `SP.Field`,
            },
            Title: name,
            FieldTypeKind: fieldType(type),
            DefaultValue: value
        }
    }

    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields`,
        data,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    /**
     * @desc FieldTypeKind for SharePoint
     *  
     * @type {FieldTypeKind} - 2 (Single Line of Text)
     * @type {FieldTypeKind} - 3 (Mulitiple Lines of Text)
     * @type {FieldTypeKind} - 4 (Date)
     * @type {FieldTypeKind} - 6 (Choice)
     * @type {FieldTypeKind} - 7 (Lookup)
     * @type {FieldTypeKind} - 9 (Number)
     * @type {FieldTypeKind} - 20 (Person or Group)
     * 
     */
    function fieldType(type) {
        switch (type.toLowerCase()) {
            case 'slot':
                return 2;
            case 'mlot':
                return 3;
            case 'date':
                return 4;
            case 'choice':
                return 6;
            case 'lookup':
                return 7;
            case 'number':
                return 9;
            case 'multichoice':
                return 15;
            case 'pp':
                return 20;
            default:
                break;
        }
    }

    const newField = await Post(postOptions);

    // Console success
    console.log(`Created column '${name}'`);

    // Append to install-console
    const installConsole = Store.get('install-console');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Created column '${name}'</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    const progressBar = Store.get('install-progress-bar');

    if (progressBar && updateProgressCount !== false) {
        progressBar.update();
    }

    /** Add column to All Items view */
    await AddColumnToView({
        list,
        name,
        view,
        updateProgressCount
    });

    return newField.d;
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function CreateFolder(param) {
    const {
        site,
        web,
        path
    } = param;

    // TODO: check if folder already exists

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    const postOptions = {
        url: `${site || App.get('site')}${web ? `/${web}` : ''}/_api/web/folders`,
        // url: `${web ? `${site}/${web}` : App.get('site')}/_api/web/folders`,
        data: {
            "__metadata":{
                "type":"SP.Folder"
            },
            "ServerRelativeUrl": `${path}`
        },
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    const copyItem = await Post(postOptions);

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    if (copyItem) {
        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code style='opacity: 0;'>Spacer</code>
                </div>
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created folder '${path}'</code>
                </div>
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>----------------------------------------</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        if (progressBar) {
            progressBar.update();
        }
    }

    return copyItem;
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function CreateItem(param) {
    const {
        type,
        list,
        select,
        expand,
        data,
        notify,
        message,
        wait
    } = param;

    if (App.get('mode') === 'prod') {
        const requestDigest = await GetRequestDigest();

        data.__metadata = {
            'type': `SP.Data.${type || list}ListItem`
        }

        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/items`,
            data,
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        }

        let newItem = await Post(postOptions);

        if (!newItem) {
            return;
        }

        const refetechedNewItem = await Get({
            list,
            select,
            expand,
            filter: `Id eq ${newItem.d.Id}`
        });

        if (notify) {
            const notification = Toast({
                text: message || `Item created`
            });

            notification.add();
            notification.remove(6000);
        }

        return refetechedNewItem[0];
    } else if (App.get('mode') === 'dev') {
        const body = data;

        // DataTables and other components requied null fields.
        // SharePoint returns them by default, but lists created with json-server don't
        // have schemas.
        // Append fields from lists.js with value null.
        const lists = App.lists();
        const { fields } = Lists().concat(lists).find(item => item.list === list);

        for (let field in fields) {
            const { name } = fields[field];

            if (name in body === false) {
                body[name] = null;
            }
        }

        body.AuthorId = body.AuthorId || App.get('dev').user.SiteId;
        body.Author = body.Author || { Title: App.get('dev').user.Title };
        body.EditorId = body.EditorId || App.get('dev').user.SiteId;
        body.Editor = body.Editor || { Title: App.get('dev').user.Title };

        const date = new Date().toUTCString();
        body.Created = date;
        body.Modified = date;

        const options = {
            method: `POST`,
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        const response = await fetch(`http://localhost:3000/${list}`, options);
        const newItem = await response.json();
        
        if (list !== 'Log' && list !== 'Errors') {
            if (wait !== false) {
                await Wait(500);
            }
        }

        return newItem;
    }
}

/**
 * Create SharePoint list item.
 * @param {Object} param        Interface to UpdateItem() module.   
 * @param {String} param.list   SharePoint list name.
 * @param {Array}  param.fields SharePoint fields.
 */
export async function CreateLibrary(param) {
    const {
        name,
        web,
        fields
    } = param;

    const newLibrary = await CreateList({
        list: name,
        web,
        fields,
        template: 101
    });

    if (newLibrary) {        
        return newLibrary;
    }
}

/**
 * Create SharePoint list item.
 * @param {Object} param        Interface to UpdateItem() module.   
 * @param {String} param.list   SharePoint list name.
 * @param {Array}  param.fields SharePoint fields.
 */
export async function CreateList(param) {
    const {
        list,
        options,
        web,
        fields,
        template,
        items,
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest({web});

    // Check if list exists
    const listResponse = await fetch(`${App.get('site')}${web ? `/${web}` : ''}/_api/web/lists/GetByTitle('${list}')`, {
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
        }
    });
    
    const getList = await listResponse.json();

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    const listType = template && template === 101 ? 'library' : 'list';

    if (getList.d) {
        console.log(`${listType} ${list} already created.`);

        // Append to install-console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>${listType} '${list}' already created</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            // +1 for the list
            progressBar.update();

            // +2 for each field
            if (fields?.length) {
                for (let i = 0; i < fields.length; i++) {
                    progressBar.update();
                    progressBar.update();
                }
            }
        }
        return;
    } else {
        // console.log(getList);
    }

    const postOptions = {
        url: `${App.get('site')}${web ? `/${web}` : ''}/_api/web/lists`,
        data: {
            __metadata: {
                'type': `SP.List`,
            },
            'BaseTemplate': template || 100,
            'Title': list
        },
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    /** Create list */
    const newList = await Post(postOptions);

    if (newList) {
        // Console success
        console.log(`Created ${listType} '${list}'`);

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created ${listType} '${list}'</code>
                </div>
                ${
                    template !== 101 ?
                    /*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>----------------------------------------</code>
                        </div>
                    ` :
                    ''
                }
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        if (progressBar) {
            progressBar.update();
        }

        // If Files option enabled, create doc library
        if (options?.files) {
            console.log(`Files enabled. Create '${list}Files' doc lib.`);
            const filesLib = await CreateLibrary({
                name: `${list}Files`
            });

            await CreateColumn({
                list: `${list}Files`,
                field: {
                    name: 'ParentId',
                    type: 'number'
                },
                view: 'All Documents',
                updateProgressCount: false
            });
            
            console.log(`${list}Files:`, filesLib);
        }

        // Create fields
        for (let field in fields) {
            await CreateColumn({
                list,
                field: fields[field],
                view: template === 101 ? 'All Documents' : 'All Items'
            });
        }

        // Create items
        if (items) {
            for (let item in items) {
                const newItem = await CreateItem({
                    list: list,
                    data: items[item]
                });
    
                if (installConsole) {
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Created item in list '${list}' with Id ${newItem.Id}</code>
                        </div>
                    `);
        
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }
        
                if (progressBar) {
                    progressBar.update();
                }
            }
        }

        return newList.d;
    }
}

/**
 * Create SharePoint site.
 * @param {Object} param Interface to UpdateItem() module.   
 * @param {String} param.name SharePoint site name.
 * @param {String} param.url SharePoint site url.
 */
export async function CreateSite(param) {
    const {
        url,
        title,
        description
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // Check if site exists
    const siteResponse = await fetch(`${App.get('site')}/${url}`, {
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
        }
    });

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Creating site '${title}', please don't leave the page...</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    if (siteResponse.status !== 404) {
        console.log(`Site '${title}' already created.`);

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Site '${title}' already created</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            // +1 for the list
            progressBar.update();

            // +? litsts, plus all their fields?
        }

        return;
    }

    const postOptions = {
        url: `${App.get('site')}/_api/web/webinfos/add`,
        data: {
            'parameters': {
                '__metadata':  {
                    'type': 'SP.WebInfoCreationInformation'
                },
                'Url': url,
                'Title': title,
                'Description': description || 'This site was created with Robi.',
                'Language': 1033,
                'WebTemplate': 'sts',
                'UseUniquePermissions': false
            }
        },
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    /** Create site */
    const newSite = await Post(postOptions);

    console.log('New site:', newSite);

    if (newSite) {
        // Console success
        console.log(`Created site '${title}'`);

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created site '${title}'</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        // Deactivate MDS
        const getNewRD = await Post({
            url: `${App.get('site')}/${url}/_api/contextinfo`,
            headers: {
                "Accept": "application/json; odata=verbose",
            }
        });
        const newRD = getNewRD.d.GetContextWebInformation.FormDigestValue;
        await fetch(`${App.get('site')}/${url}/_api/web`, {
            method: 'POST',
            body: JSON.stringify({ 
                '__metadata': { 'type': 'SP.Web' },
                'EnableMinimalDownload': false
            }),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                'X-HTTP-Method': 'MERGE',
                "X-RequestDigest": newRD
            }
        });
        console.log('MDS deactivated');

        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Minimal Download Strategy (MDS) deactivated</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
        
        if (progressBar) {
            progressBar.update();
        }

        return newSite;
    }
}

/**
 * 
 * @param {*} lists 
 * @returns 
 */
export async function Data(lists) {
    let responses;

    if (lists) {
        responses = await Promise.all(lists.map(param => {
            const {
                list,
                label,
                select,
                expand,
                filter,
                orderby
            } = param;

            return Get({
                list,
                select,
                expand,
                filter,
                orderby,
                action() {
                    Store.get('app-loading-bar').update({
                        newDisplayText: label
                    });
                }
            });
        }));
    }

    await Store.get('app-loading-bar')?.end();

    return responses
}

/**
 * 
 * @param {*} event 
 */
export function DeleteApp() {
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
                        background: App.get('backgroundColor')
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
                            <code style='color: ${App.get('primaryColor')} !important;'>${spacers}</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: ${App.get('primaryColor')} !important;'>| '${App.get('name')}' deleted |</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: ${App.get('primaryColor')} !important;'>${spacers}</code>
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

/**
 * 
 * @param {*} param 
 */
export async function DeleteAttachments(param) {
    const {
        list,
        itemId,
        fileNames
    } = param;

    /** Get new request digest */
    const requestDigest = await GetRequestDigest();

    /** Upload responses */
    /** @todo Refactor with map? */
    const responses = [];

    for (let i = 0; i < fileNames.length; i++) {
        const upload = await fetch(`${App.get('site')}/_api/web/lists/getbytitle('${list}')/items(${itemId})/AttachmentFiles/getByFileName('${fileNames[i]}')`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json; odata=verbose',
                'content-type': 'application/json; odata=verbose',
                'X-HTTP-Method': 'DELETE',
                'X-RequestDigest': requestDigest,
            },
        });

        responses.push(upload);
    }

    await Promise.all(responses);
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export async function DeleteColumn(param) {
    const {
        list,
        name
    } = param;

    // Don't create columns with reserved SharePoint names
    if (name === 'Title' || name === 'Id') {
        // Console 
        console.log(`Column '${name}'can't be deleted`);

        // Add to Install Console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Column '${name}'can't be deleted</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            progressBar.update();
        }

        return;
    }
    
    // Get new request digest
    const requestDigest = await GetRequestDigest();
    
    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields/GetByTitle('${name}')`,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
            "IF-MATCH": "*",
            "X-HTTP-Method": "DELETE",
        }
    }

    const deletedField = await Post(postOptions);

    // Console success
    console.log(`Deleted column '${name}'`);

    // Append to install-console
    const installConsole = Store.get('install-console');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Deleted column '${name}' from list '${list}'</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    const progressBar = Store.get('install-progress-bar');

    if (progressBar) {
        progressBar.update();
    }

    return deletedField;
}

/**
 * Update SharePoint list item.
 * @param {Object}  param          - Interface to UpdateItem() module.
 * @param {string}  param.list     - SharePoint List Name.
 * @param {number}  param.itemId   - Item Id of item in param.list.
 * @param {boolean} [param.notify] - If false, don't display notification.
 */
export async function DeleteItem(param) {
    const {
        list,
        itemId,
        filter,
    } = param;

    if (App.get('mode') === 'prod') {
        /** Get item by id */
        const getItems = await Get({
            list,
            filter: itemId ? `Id eq ${itemId}` : filter
        });

        // const item = getItems[0];

        /** Get new request digest */
        const requestDigest = await GetRequestDigest();

        await Promise.all(getItems.map(item => {
            const postOptions = {
                url: item.__metadata.uri,
                headers: {
                    "Content-Type": "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose",
                    "X-HTTP-Method": "DELETE",
                    "X-RequestDigest": requestDigest,
                    "If-Match": item.__metadata.etag
                }
            }

            return Post(postOptions);
        }));
    } else if (App.get('mode') === 'dev') {
        const options = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        const response = await fetch(`http://localhost:3000/${list}/${itemId}`, options);
        const deletedItem = await response.json();

        return deletedItem;
    }
}

/**
 * Update SharePoint list item.
 * @param {Object}  param          - Interface to UpdateItem() module.
 * @param {string}  param.list     - SharePoint List Name.
 * @param {number}  param.itemId   - Item Id of item in param.list.
 * @param {boolean} [param.notify] - If false, don't display notification.
 */
export async function DeleteList(param) {
    const {
        list,
        options,
        updateProgressCount
    } = param;

    if (App.get('mode') === 'prod') {
        // TODO: Check if list exists first

        /** Get new request digest */
        const requestDigest = await GetRequestDigest();

        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')`,
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-HTTP-Method": "DELETE",
                "X-RequestDigest": requestDigest,
                "If-Match": "*" // dangerous, check etag
            }
        }

        await Post(postOptions);

        // Console success
        console.log(`Deleted list '${list}'`);

        // Append to install-console
        const deleteConsole = Store.get('install-console');

        if (deleteConsole) {
            deleteConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Deleted list '${list}'</code>
                </div>
            `);

            deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar && updateProgressCount !== false) {
            progressBar.update();
        }

        // Delete files
        if (options?.files) {
            await DeleteList({
                list: `${list}Files`,
                updateProgressCount: false
            });
        }
    } else if (App.get('mode') === 'dev') {
        const options = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        const response = await fetch(`http://localhost:3000/${list}`, options);
        const deletedItem = await response.json();

        return deletedItem;
    }
}

/**
 * {@link https://stackoverflow.com/a/2117523}
 */
export function GenerateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function Get(param) {
    const {
        list,
        filter,
        select,
        expand,
        orderby,
        top,
        skip,
        paged,
        startId,
        api,
        path,
        action,
        mode
    } = param;

    /** Add abort signal */
    const abortController = new AbortController();

    Store.addAbortController(abortController);

    const url = `${path || App.get('site')}/_api/web/lists/GetByTitle`;

    const options = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        },
        signal: abortController.signal
    };

    if (App.get('mode') === 'prod' || mode === 'prod') {
        const itemCount = await GetItemCount({
            apiPath: path,
            list
        });

        if (!itemCount) {
            // Always return at least an empty array if query fails for any reason
            return [];
        }

        const queryFilterString = [
            insertIf(filter, 'filter'),
            insertIf(select, 'select'),
            insertIf(expand, 'expand'),
            insertIf(orderby, 'orderby'),
            insertIf(skip, 'skip'),
            paged ? `$skiptoken=Paged=TRUE${startId ? `&P_ID=${startId}` : ''}` : undefined,
            // paged ? `$skiptoken=Paged=TRUE&P_ID=${startId ? startId : itemCount}`: undefined,
        ]
            .filter(x => x)
            .join('&');

        function insertIf(value, parameter) {
            return value ? `$${parameter}=${value}` : undefined;
        }

        try {
            const response = await fetch(api || `${`${url}('${list}')/items?$top=${top || itemCount || ''}`}&${queryFilterString || ''}`, options);
            const data = await response.json();

            if (action) {
                action(data);
            }

            if (paged || skip) {
                return data.d;
            } else if (Array.isArray(data)) {
                return data
            } else {
                return data.d.results;
            }
        } catch (error) {
            console.log('Fetch request aborted.');
        }
    } else if (App.get('mode') === 'dev' || mode === 'dev') {
        const queries = filter ? filter.split(' or ') : [ '' ];

        const fetchAll = await Promise.all(queries.map( async query => {
            const queryFilterString = [
                formatFilter(query),
                formatOrder(orderby)
            ]
            .filter(x => x)
            .join('&');

    
            return await fetch(`http://localhost:3000/${list}${queryFilterString ? `?${queryFilterString}` : ''}`, options);
        }));
        
        function formatFilter(value) {
            if (value) {
                return value
                    // .replaceAll(' or ', ' and ')
                    .split(' and ')
                    .map(group => {
                        if (group.includes('(substringof(')) {
                            const [value, column] = group.replace(`(substringof('`, '').replace(`',`, '').replace(') eq true', '').split(' ');

                            return `${column}_like=${value}`;
                        } else {
                            const [field, operator, value] = group.match(/(?:[^\s"']+|['"][^'"]*["'])+/g); /** {@link https://stackoverflow.com/a/16261693} see jobrad's comment Mar 24 '17 at 17:16 */

                            return `${field}${operator === 'eq' ? '=' : operator === 'ne' ? '_ne=' : ''}${value.replace(/["']/g, "")}`;
                        }
                    })
                    .join('&');
            }
        }

        /** GET /posts?_sort=views&_order=asc */
        function formatOrder(value) {
            if (value) {
                const [field, order] = value.split(' ');

                return `_sort=${field}&_order=${order}`;
            }
        }

        // await Wait(500);
        return (await Promise.all(fetchAll.map(async response => await response.json()))).flat();
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function GetADUsers(param) {
    const {
        query
    } = param;

    const abortController = new AbortController();
    // const url = window.location.href.split('/SiteAssets')[0] + '/_vti_bin/client.svc/ProcessQuery';
    const url = `${App.get('site')}/_vti_bin/client.svc/ProcessQuery`

    function getPostRequestHeaders(requestDigest) {
        if (!requestDigest) {
            throw new Error('Request Digest is required to send your request.');
        }

        return {
            'Accept': 'application/json; odata=verbose',
            'Content-Type': 'application/json; odata=verbose',
            'X-RequestDigest': requestDigest,
        };
    }

    function createSearchPayload(queryString, options) {
        options = {
            AllowEmailAddresses: false,
            AllowMultipleEntities: true,
            AllUrlZones: false,
            ForceClaims: false,
            MaximumEntitySuggestions: 30,
            PrincipalSource: 15,
            PrincipalType: 5,
            Required: true,
            SharePointGroupID: 0,
            UrlZone: 0,
            UrlZoneSpecified: false,
            WebApplicationID: '{00000000-0000-0000-0000-000000000000}',
        }

        return '<Request xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009" SchemaVersion="15.0.0.0" LibraryVersion="15.0.0.0" ApplicationName="Javascript Library">' +
            '<Actions>' +
            '<StaticMethod TypeId="{de2db963-8bab-4fb4-8a58-611aebc5254b}" Name="ClientPeoplePickerSearchUser" Id="0">' +
            '<Parameters>' +
            '<Parameter TypeId="{ac9358c6-e9b1-4514-bf6e-106acbfb19ce}">' +
            '<Property Name="AllowEmailAddresses" Type="Boolean">' + options.AllowEmailAddresses + '</Property>' +
            '<Property Name="AllowMultipleEntities" Type="Boolean">' + options.AllowMultipleEntities + '</Property>' +
            '<Property Name="AllUrlZones" Type="Boolean">' + options.AllUrlZones + '</Property>' +
            '<Property Name="EnabledClaimProviders" Type="Null" />' +
            '<Property Name="ForceClaims" Type="Boolean">' + options.ForceClaims + '</Property>' +
            '<Property Name="MaximumEntitySuggestions" Type="Number">' + options.MaximumEntitySuggestions + '</Property>' +
            '<Property Name="PrincipalSource" Type="Number">' + options.PrincipalSource + '</Property>' +
            '<Property Name="PrincipalType" Type="Number">' + options.PrincipalType + '</Property>' +
            '<Property Name="QueryString" Type="String">' + queryString + '</Property>' +
            '<Property Name="Required" Type="Boolean">' + options.Required + '</Property>' +
            '<Property Name="SharePointGroupID" Type="Number">' + options.SharePointGroupID + '</Property>' +
            '<Property Name="UrlZone" Type="Number">' + options.UrlZone + '</Property>' +
            '<Property Name="UrlZoneSpecified" Type="Boolean">' + options.UrlZoneSpecified + '</Property>' +
            '<Property Name="Web" Type="Null" />' +
            '<Property Name="WebApplicationID" Type="String">' + options.WebApplicationID + '</Property>' +
            '</Parameter>' +
            '</Parameters>' +
            '</StaticMethod>' +
            '</Actions>' +
            '<ObjectPaths />' +
            '</Request>';
    }

    function createPostRequest(data, requestDigest) {
        data = typeof (data) === 'string' ? data : JSON.stringify(data)

        return {
            method: 'POST',
            body: data,
            headers: getPostRequestHeaders(requestDigest),
        };
    }

    return {
        abortController,
        response: GetRequestDigest()
            .then(reqDigest => {
                // Create Active Directory Search Payload
                const reqData = createSearchPayload(query)
                const reqOptions = Object.assign(createPostRequest(reqData, reqDigest), {
                    signal: abortController.signal
                });

                return fetch(url, reqOptions)
                    .then(async response => {
                        console.log(response);

                        const data = await response.json();

                        return data;

                        let result = JSON.parse(data[2]);

                        result.forEach(acct => {
                            acct.Title = acct.DisplayText
                            acct.LoginName = acct.Key
                        });

                        return result;
                    })
            })
            // response: GetRequestDigest().then(requestDigest => {
            //     const init = {
            //         method: 'POST',
            //         body: JSON.stringify(createSearchPayload(query)),
            //         headers : { 
            //             'Content-Type': 'application/json; charset=UTF-8',
            //             'Accept': 'application/json; odata=verbose',
            //             'X-RequestDigest': requestDigest,
            //         },
            //         signal: abortController.signal 
            //     };

            //     return fetch(url, init).then(async response => {
            //         const data = await response.json();

            //         console.log(data);

            //         let result = JSON.parse(data[2]);

            //         result.forEach(acct => {
            //             acct.Title = acct.DisplayText;
            //             acct.LoginName = acct.Key;
            //         });

            //         return result;
            //     })
            // })
            .catch(error => {
                // console.log(error);
            })
    };
}

/**
 * 
 * @param {*} prop 
 * @returns 
 */
export async function GetAppSetting(prop) {
    const getItem = await Get({
        list: 'Settings',
        filter: `Key eq '${prop}'`
    });

    return getItem ? getItem[0] : undefined;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetAttachments(param) {
    const {
        list,
        itemId
    } = param;

    const item = await Get({
        list,
        select: 'Attachments,AttachmentFiles',
        expand: 'AttachmentFiles',
        filter: `Id eq ${itemId}`
    });

    try {
        return item[0].AttachmentFiles.results;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetByUri(param) {
    const {
        uri,
        select,
        expand
    } = param;

    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    let queryFilterString = '';

    if (select) {
        queryFilterString += `${queryFilterString ? '&' : ''}$select=${select}`;
    }

    if (expand) {
        queryFilterString += `${queryFilterString ? '&' : ''}$expand=${expand}`;
    }

    const response = await fetch(`${uri}?${queryFilterString}`, headers);
    const data = await response.json();

    if (data && data.d) {
        return data.d;
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetCurrentUser(param) {
    const {
        list
    } = param;

    const fetchOptions = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        }
    };

    if (App.get('mode') === 'prod') {
        const url = `${App.get('site')}/../_api/web/CurrentUser`;
        const currentUser = await fetch(url, fetchOptions);
        const response = await currentUser.json();
        const email = response.d.Email;
        const appUser = await Get({
            list: list || 'Users',
            // TODO: Replace with call to Model().Lists() map => internal field names + Id field
            // select: fields.map(field => field.name),
            filter: `Email eq '${email}'`
        });

        if (appUser && appUser[0]) {
            console.log(`%cUser: ${appUser[0].Title}.`, 'background: seagreen; color: white');

            // Add SiteId prop to Users list item
            appUser[0].SiteId = response.d.Id;

            // Return Users list item
            return appUser[0];
        } else {
            console.log(response.d);

            const {
                Title,
                Email,
                LoginName
            } = response.d;

            console.log(`%cMissing user account.`, 'color: red');
            console.log(`Creating user account for ${Title}....`);

            /** Create user */
            const newUser = await CreateItem({
                list: 'Users',
                data: {
                    Title,
                    Email,
                    LoginName: LoginName.split('|')[2],
                    Role: App.get('userDefaultRole') /** Default, can be changed later */,
                    Settings: App.get('userSettings')
                }
            });

            if (newUser) {
                console.log(`%cUser account for ${Title} created!`, 'color: mediumseagreen');
            } else {
                console.log(`%cFailed to create a user account for ${Title}. Check POST data.`, 'background: firebrick; color: white');
            }

            return newUser;
        }
    } else if (App.get('mode') === 'dev') {
        const currentUser = await fetch(`http://localhost:3000/users?LoginName=${App.get('dev').user.LoginName}`, fetchOptions);
        const response = await currentUser.json();

        const {
            Title,
            Email,
            LoginName,
            Role,
            SiteId,
            Settings
        } = App.get('dev').user;

        if (response[0]) {
            console.log(`%cFound user account for '${response[0].Title}'.`, 'color: mediumseagreen');
            return response[0];
        } else {
            console.log(`%cMissing user account.`, 'color: red');
            console.log(`Creating user account for ${Title}....`);

            /** Create user */
            const newUser = await CreateItem({
                list: 'Users',
                data: {
                    Title,
                    Email,
                    LoginName,
                    Role,
                    SiteId,
                    Settings: Settings || App.get('userSettings')
                }
            });

            if (newUser) {
                console.log(`%cCreated user account for ${Title}!`, 'color: mediumseagreen');
                return newUser;
            } else {
                console.log(`%cFailed to create a user account for ${Title}. Check POST data.`, 'color: firebrick');
            }
        }
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetFolders(param) {
    const { path, filter } = param;
    
    // 2. Look for directories
    const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/folders${filter ? `?$select=Name&$filter=${filter}` : ''}`;
    const requestDigest = await GetRequestDigest();
    const options = {
        method: 'GET',
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-type": "application/json; odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    };
    const query = await fetch(url, options);
    const response = await query.json();

    return response?.d?.results;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetItemCount(param) {
    const {
        list,
        path,
        type
    } = param;

    let {
        apiPath
    } = param;

    apiPath = apiPath || App.get('site');
    const url = type === 'lib' ? `${apiPath}/_api/web/GetFolderByServerRelativeUrl('${path}')/ItemCount` : `${apiPath}/_api/web/lists/GetByTitle('${list}')/ItemCount`;

    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        }
    };

    try {
        const response = await fetch(url, headers);

        if (!response.ok) {
            // await Error({
            //     Message: response.status.toString(),
            //     Source: import.meta.url,
            //     Line: 0,
            //     ColumnNumber: 0,
            //     Error: JSON.stringify(new Error().stack.replace('Error\n    at ', ''))
            // });
        }

        const data = await response.json();

        return data.d.ItemCount;
    } catch (error) {
        // console.log(error);
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetLib(param) {
    const {
        path,
        type,
        filter,
        select,
        expand,
        orderby
    } = param;

    const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/${type || 'Files'}`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const itemCount = await GetItemCount({
        path,
        type: 'lib'
    });

    let queryFilterString = `$filter=${filter}`;

    if (select) {
        queryFilterString += `${queryFilterString ? '&' : ''}$select=${select}`;
    }

    if (expand) {
        queryFilterString += `${queryFilterString ? '&' : ''}$expand=${expand}`;
    }

    if (orderby) {
        queryFilterString += `${queryFilterString ? '&' : ''}$orderby=${orderby}`;
    }

    try {
        const response = await fetch(`${`${url}?$top=${itemCount}`}&${queryFilterString || ''}`, headers);

        const data = await response.json();

        if (Array.isArray(data)) {
            return data
        } else {
            return data.d.results;
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetList(param) {
    const {
        listName
    } = param;

    const url = `${App.get('site')}/_api/web/lists/GetByTitle('${listName}')`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const response = await fetch(url, headers);

    if (response) {
        const data = await response.json();

        if (data && data.d) {
            return data.d;
        }
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function GetListGuid(param) {
    const {
        listName: list
    } = param;

    const url = `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Id`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const response = await fetch(url, headers);

    if (response) {
        const data = await response.json();

        if (data && data.d) {
            return data.d;
        }
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetRequestDigest(param = {}) {
    const { web, site } = param;

    const getRequestDigest = await Post({
        url: `${site || App.get('site')}${web ? `/${web}` : ''}/_api/contextinfo`,
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });

    return getRequestDigest.d.GetContextWebInformation.FormDigestValue;
}

/**
 *
 * @returns
 */
export async function GetRootRequestDigest() {
    const getRequestDigest = await Post({
        url: `/_api/contextinfo`,
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });

    return getRequestDigest.d.GetContextWebInformation.FormDigestValue;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function GetSiteUsers(param) {
    const {
        query
    } = param;

    const abortController = new AbortController();
    const init = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        },
        signal: abortController.signal
    };

    let url;

    if (App.get('mode') === 'prod') {
        // const url = `${App.get('domain')}/_api/web/siteusers?$filter=substringof('${query.toLowerCase()}',LoginName) eq true and substringof('i%3A0%23.w',LoginName) eq true`;
        // const url = [
        //     `${App.get('site')}`,
        //     `/_api/web/SiteUserInfoList/items`,
        //     // `?$top=200`,
        //     `&$select=Id,Title,FirstName,LastName,Name,EMail`,
        //     `&$filter=substringof('${query}', Name) or (substringof('${query}', Title) or substringof('${query}', EMail) or substringof('${query}', FirstName) or substringof('${query}', LastName))&$orderby=Name`
        // ].join('');
        // const url = [
        //     `${App.get('site')}`,
        //     `/_api/web/SiteUserInfoList/items`,
        //     // `?$top=200`,
        //     `&$filter=(substringof('${query}', Name) or (substringof('${query}', Title) or substringof('${query}', EMail))&$orderby=Name`
        // ].join('');
        url = [
            `${App.get('site')}`,
            `/_vti_bin/listdata.svc/UserInformationList`,
            // `?$top=200`,
            `&$select=Id,Name,Account,WorkEmail`,
            // `&$filter=substringof('i:0e.t|dod_adfs_provider|', Account) and (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
            `&$filter=substringof('${query}', Account) or (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
        ].join('');
    } else if (App.get('mode') === 'dev') {
        url = `http://localhost:3000/users`;
    }

    return {
        abortController,
        response: fetch(url, init).then(async (response) => {
            const data = await response.json();

            // return data.d.results;
            return data?.d;
        })
        .catch(error => {
            // console.log(error);
        })
    };
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetWebLists() {
    const url = `${App.get('site')}/_api/web/lists/?$select=*,Fields&$expand=Fields`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const response = await fetch(url, headers);

    if (response) {
        const data = await response.json();

        if (data && data.d && data.d.results) {
            return data.d.results;
        }
    }
}

/**
 * 
 * @param {*} H 
 * @returns 
 */
function HexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;

    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }

    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;

    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
        h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return h + "," + s + "%," + l + "%";
}

export { HexToHSL }

/**
 * 
 * @param {*} hex 
 * @returns 
 */
function HexToRGB(hex) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `${r},${g},${b}`;
}

export { HexToRGB }

/**
 *
 * @param {*} param
 */
export async function HideRoutes({ routes }) {
    console.log(routes);

    let digest;
    let request;

    if (App.get('mode') === 'prod') {
        digest = await GetRequestDigest();
        request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files('app.js')/$value`, {
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
    let value = await request.text();

    const allRoutes = value.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
    const routeObjects = allRoutes[1].split(', // @ROUTE');

    // Add hide property
    console.log(routeObjects);
    const newRoutes = routeObjects.map(route => {
        const [ query, path ] = route.match(/path: '([\s\S]*?)',/);

        if (routes.includes(path)) {
            console.log(path);
            console.log('hide route');
            
            // FIXME: will it always been 12 spaces?
            // FIXME: can we guarentee that this search is alawys unique?
            route = route.replace(`path: '${path}',`, `path: '${path}',\n            hide: true,`);
        }

        return route;
    }).join(', // @ROUTE');

    const updated = value.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${newRoutes}// @END-ROUTES`);

    console.log('OLD\n----------------------------------------\n', value);
    console.log('\n****************************************');
    console.log('NEW\n----------------------------------------\n', updated);
    console.log('\n****************************************');

    let setFile;

    if (App.get('mode') === 'prod') {
        // TODO: Make a copy of app.js first
        // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
        setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files/Add(url='app.js',overwrite=true)`, {
            method: 'POST',
            body: updated, 
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
    } else {
        setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
            method: 'POST',
            body: updated
        });
        await Wait(1000);
    }

    console.log('Saved:', setFile);
}

/**
 *
 * @param {*} param
 */
export function History(param) {
    const {
        url, title
    } = param;

    if (!history.state || history.state.url != url) {
        history.pushState({
            url: url,
            title: title
        }, title, url);
    }

    document.title = title;
}

/**
 * 
 * @param {*} hsl
 * @param {*} reduceBy
 * @returns
 */
function HSLDarker(hsl, reduceBy = 0) {
    let [h, s, l] = hsl.split(',');
    
    const num = parseInt(l.replace('%,', ''));
    
    l = `${num - reduceBy}%`;
    
    return [h, s, l].join(',');
}

export { HSLDarker }

/**
 *
 * @param {*} param
 */
export function InitializeApp(param) {
    const { settings, routes } = param;
    const { preLoadLists } = settings;

    if (App.get('mode') === 'prod') {
        console.log('Mode: prod');

        // Start loading bar animation
        const loadingBar = LoadingBar({
            displayLogo: App.get('logoLarge'),
            displayTitle: App.get('title'),
            totalCount: preLoadLists?.length || 0,
            loadingBar: 'hidden',
            async onReady() {
                // Check if app is already installed
                const isInstalled = await GetAppSetting('Installed');

                if (!isInstalled || isInstalled.Value === 'No') {
                    InstallApp({
                        isInstalled,
                        settings,
                        loadingBar,
                        routes
                    });

                    return;
                } else {
                    if (preLoadLists?.length) {
                        loadingBar.showLoadingBar();
                    }

                    LaunchApp(param);
                }
            }
        });

        loadingBar.add();

        Store.add({
            name: 'app-loading-bar',
            component: loadingBar
        });
    } else {
        console.log('Mode: dev');

        if (App.get('dev').testInstall) {
            console.log('TODO: Mirror prod install process');
            // TODO: Mirror prod install process
            // TestInstall({
            //     settings,
            //     loadingBar
            // });
        } else {
            LaunchApp(param);
        }
    }
}

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
                    background: App.get('backgroundColor')
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
                            Role: 'Developer',
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
                        <code style='color: ${App.get('primaryColor')} !important;'>${spacers}</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: ${App.get('primaryColor')} !important;'>| '${App.get('name')}' installed | Build 1.0.0 | Version 1.0.0 |</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: ${App.get('primaryColor')} !important;'>${spacers}</code>
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

/**
 *
 * @param {*} param
 */
export async function LaunchApp(param) {
    const {
        routes, sidebar, settings
    } = param;

    const {
        title, logo, usersList, beforeLoad, preLoadLists, svgSymbols, sessionStorageData, sidebarDropdown
    } = settings;

    /** Set sessions storage */
    SetSessionStorage({
        sessionStorageData
    });

    /** Get list items */
    const data = await Data(preLoadLists);

    if (data) {
        /** Add list items to store */
        preLoadLists.forEach((param, index) => {
            const {
                list
            } = param;

            Store.add({
                type: 'list',
                list,
                items: data[index]
            });
        });
    }

    /** Load svg definitions */
    const svgDefs = SvgDefs({
        svgSymbols
    });

    svgDefs.add();

    Store.add({
        name: 'svgdefs',
        component: svgDefs
    });

    /** Get AD user and Users list item properties */
    Store.user(await GetCurrentUser({
        list: usersList
    }));

    /** Get current route */
    const path = location.href.split('#')[1];

    /** Attach Router to browser back/forward event */
    window.addEventListener('popstate', (event) => {
        if (event.state) {
            Route(event.state.url.split('#')[1], {
                scrollTop: Store.viewScrollTop()
            });
        }
    });

    /** Store routes */
    Store.setRoutes(routes.concat(Routes));

    // Get app container
    const appContainer = Store.get('appcontainer');

    /** Sidebar Component */
    const sidebarParam = {
        logo,
        parent: appContainer,
        path,
        sidebarDropdown
    };

    const sidebarComponent = sidebar ? sidebar(sidebarParam) : Sidebar(sidebarParam);

    Store.add({
        name: 'sidebar',
        component: sidebarComponent
    });

    sidebarComponent.add();

    /** Main Container */
    const mainContainer = MainContainer({
        parent: appContainer
    });

    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });

    mainContainer.add();

    /** Run callback defined in settings Before first view loads */
    if (beforeLoad) {
        await beforeLoad();
    }

    /** Show App Container */
    appContainer.show('flex');

    /** Generate Session Id */
    const sessionId = GenerateUUID();

    /** Format Title for Sessin/Local Storage keys */
    const storageKeyPrefix = settings.title.split(' ').join('-');

    /** Set Session Id */
    sessionStorage.setItem(`${storageKeyPrefix}-sessionId`, sessionId);

    /** Log in*/
    try {
        Log({
            Title: `${Store.user().Title || 'User'} logged in`,
            Message: `${Store.user().Email || 'User'} successfully loaded ${title}`,
            StackTrace: new Error().stack,
            Module: import.meta.url
        });
    } catch (error) {
        console.error(error);
    }

    /** Run current route on page load */
    Route(path, {
        log: false
    });

    /** Check Local Storage for release notes */
    const isReleaseNotesDismissed = localStorage.getItem(`${storageKeyPrefix}-releaseNotesDismissed`);

    if (!isReleaseNotesDismissed) {
        /** Release Notes */
        const releaseNotes = FixedToast({
            type: 'robi',
            title: `New version ${'0.1.0'}`,
            message: `View release notes`,
            bottom: '20px',
            right: '10px',
            action(event) {
                const modal = Modal({
                    fade: true,
                    background: settings.secondaryColor,
                    centered: true,
                    close: true,
                    addContent(modalBody) {
                        ReleaseNotesContainer({
                            margin: '0px',
                            parent: modalBody,
                        });
                    },
                    parent: appContainer
                });

                modal.add();
            },
            onClose(event) {
                /** Set Local Storage */
                localStorage.setItem(`${storageKeyPrefix}-releaseNotesDismissed`, 'true');
            },
            parent: appContainer
        });

        releaseNotes.add();
    }
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function Log(param) {
    const {
        Title, Message, StackTrace, Module
    } = param;

    if (App.get('mode') === 'prod') {
        /** Get new request digest */
        const requestDigest = await GetRequestDigest();

        /** @todo Check if Log exists, create if not */
        /**
         * SharePoint Ceate List REST API
         * @interface
         * @property {string} url - SharePoint 2013 API
         *
         */
        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('Log')/items`,
            data: {
                Title,
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message: JSON.stringify({
                    body: Message,
                    location: location.href,
                    role: Store.user().Role
                }),
                StackTrace: JSON.stringify(StackTrace.replace('Error\n    at ', '')),
                Module,
                __metadata: {
                    'type': `SP.Data.LogListItem`
                }
            },
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        };

        const newItem = await Post(postOptions);

        console.log(`%cLog: ${Title}`, 'background: #1e1e1e; color: #fff');

        return newItem.d;
    } else if (App.get('mode') === 'dev') {
        const newLog = await CreateItem({
            list: 'Log',
            data: {
                Title,
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message: JSON.stringify({
                    body: Message,
                    location: location.href,
                    role: Store.user().Role
                }),
                StackTrace: JSON.stringify(StackTrace.replace('Error\n    at ', '')),
                UserAgent: navigator.userAgent,
                Module
            }
        });

        console.log(`%cLog: ${Title}`, 'background: #1e1e1e; color: #fff');

        return newLog;
    }
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function LogError(param) {
    const {
        Message, Error, Source, Line, ColumnNumber
    } = param;

    if (App.get('mode') === 'prod') {
        /** Get new request digest */
        /**
         * @author Wil Pacheco & John Westhuis
         * Added temporary alert to prevent infinite error loop when reporting error, & reload page for user.
         *
         * @author Stephen Matheis
         * @to Wilfredo Pacheo, John Westhuis
         * Catching the request digest promise was a great idea. Jealous I didn't think of it >_<;
         */
        const requestDigest = await GetRequestDigest().catch(e => {
            alert('Your session has expired, your page will now reload.');
            location.reload();
        });

        /** @todo check if Errors list exits, create if not */
        /**
         * Pass this object to fetch
         *
         * @interface
         * @property {string} url - SharePoint 2013 API
         *
         */
        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('Errors')/items`,
            data: {
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message,
                Error,
                Source,
                UserAgent: navigator.userAgent,
                __metadata: {
                    'type': `SP.Data.ErrorsListItem`
                }
            },
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        };

        const newItem = await Post(postOptions);

        console.log(`%cError: ${Message}`, 'background: crimson; color: #fff');

        return newItem.d;
    } else if (App.get('mode') === 'dev') {
        const newLog = await CreateItem({
            list: 'Errors',
            data: {
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message,
                Error,
                Source,
            }
        });

        console.log(`%cError: ${Message}`, 'background: crimson; color: #fff');

        return newLog;
    }
}

/**
 *
 * @param {*} param
 */
export async function ModifyFile(param) {
    const { path, file } = param;

    const modal = Modal({
        title: /*html*/ `
            <div class='file-title'>
                <span class='file-title-text d-flex'>
                    <span class='file-icon-container'>
                        <svg class='icon file-icon file-icon-js'>
                            <use href='#icon-javascript'></use>
                        </svg>
                    </span>
                    <span style='font-weight: 300;'>
                        ${path}/${file}
                    </span>
                </span>
            </div>
        `,
        classes: ['scrollbar-wide'],
        titleStyle: 'width: 100%;',
        // headerStyle: 'border-bottom: solid 1px #676E95; padding-bottom: 0px;',
        headerStyle: 'padding-bottom: 0px;',
        footerStyle: 'border-top: solid 1px #676E95;',
        closeStyle: 'padding: 16px;',
        // close: false,
        scrollable: true,
        background: '#292D3E',
        centered: true,
        showFooter: false,
        async addContent(modalBody) {
            // Change modal default styles
            modal.find('.modal-dialog').style.maxWidth = '100%';
            modal.find('.modal-dialog').style.margin = '1.75rem';
            modalBody.style.height = '100vh';

            const loading = LoadingSpinner({
                message: `Loading <span style='font-weight: 300;'>${path}/${file}</span>`,
                type: 'white',
                classes: ['h-100', 'loading-file'],
                parent: modalBody
            });

            loading.add();

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <textarea class='code-mirror-container robi-code-background h-100'></textarea>
            `);

            let shouldReload = false;

            const editor = CodeMirror.fromTextArea(modal.find('.code-mirror-container'), {
                mode: 'javascript',
                indentUnit: 4,
                lineNumbers: true,
                lineWrapping: true,
                autoCloseBrackets: true,
                extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
            });
            editor.foldCode(CodeMirror.Pos(0, 0));
            editor.setSize(0, 0);
            editor.setOption('extraKeys', {
                // Tab(cm) {
                //     const spaces = Array(cm.getOption("indentUnit")).join(" ");
                //     console.log(spaces);

                //     cm.replaceSelection(spaces);
                // },
                'Tab': 'indentMore',
                'Shift-Tab': 'indentLess',
                'Ctrl-/'(cm) {
                    editor.toggleComment({
                        // this prop makes sure comments retain indented code
                        // https://github.com/codemirror/CodeMirror/issues/3765#issuecomment-171819763
                        indent: true
                    });
                },
                async 'Ctrl-S'(cm) {
                    // TODO: only save file if changed
                    console.log('save file');
                    // Save file
                    await saveFile();


                    // Add changed message
                    const changedMessaage = modal.find('.changed-message');

                    if (!changedMessaage) {
                        modal.find('.file-title-text').insertAdjacentHTML('beforeend', /*html*/ `
                            <div class='changed-message' style='margin-left: 10px; color: seagreen'>CHANGED (will reload on close)</div>
                        `);
                    }

                    // Set reload flag
                    shouldReload = true;

                },
                'Alt-W'(cm) {
                    console.log('close');
                    modal.close();
                },
                'Ctrl-Q'(cm) {
                    console.log('close file, check if saved');
                }
            });

            let fileValueRequest;
            let requestDigest;

            if (App.get('mode') === 'prod') {
                const sourceSiteUrl = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files('${file}')/$value`;

                requestDigest = await GetRequestDigest();

                fileValueRequest = await fetch(sourceSiteUrl, {
                    method: 'GET',
                    headers: {
                        'binaryStringRequestBody': 'true',
                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                        'X-RequestDigest': requestDigest
                    }
                });

            } else {
                const devPath = path.replace('App/', '');
                fileValueRequest = await fetch(`http://127.0.0.1:8080/${devPath}/${file}`);
                await Wait(1000);
            }

            // Overriden on save
            // FIXME: Doesn't work with app.js.
            let value = await fileValueRequest.text();

            // Always wait an extra 100ms for CodeMirror to settle.
            // For some reason, gutter width's won't apply 
            // correctly if the editor is modified too quickly.
            setTimeout(() => {
                // Remove loading message
                loading.remove();

                // Set codemirror
                setEditor();
            }, 100);

            // FIXME: Remember initial codemirorr doc value
            // compare this with current doc value
            let docValue;

            function setEditor() {
                editor.setSize('auto', 'auto');
                editor.setOption('viewportMargin', Infinity);
                editor.setOption('theme', 'material-palenight');
                editor.getDoc().setValue(value);
                editor.focus();

                docValue = editor.doc.getValue();

                // Watch for changes
                editor.on('change', event => {
                    // if (value === editor.doc.getValue()) {
                    if (docValue === editor.doc.getValue()) {
                        console.log('unchanged');

                        const dot = modal.find('.changed-dot');

                        if (dot) {
                            dot.remove();
                        }

                        // saveAndCloseBtn.get().disabled = true;
                    } else {
                        console.log('changed');

                        const dot = modal.find('.changed-dot');

                        if (!dot) {
                            modal.find('.file-title').insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='changed-dot' style='margin-left: 15px; width: 8px; height: 8px; background: white; border-radius: 50%;'></div>
                            `);
                        }

                        // saveAndCloseBtn.get().disabled = false;
                    }
                });

                // Remove .modal-body top padding
                modalBody.style.paddingTop = '0px';

                // // Save and close button
                // const saveAndCloseBtn = BootstrapButton({
                //     async action(event) {
                //         // TODO: only save file if changed
                //         await saveFile(event);

                //         $(modal.get()).on('hidden.bs.modal', event => {
                //             location.reload(true);
                //         });

                //         setTimeout(() => {
                //             // Enable button
                //             $(event.target)
                //                 .removeAttr('disabled')
                //                 .text('Saved');

                //             // Close modal (DOM node will be removed on hidden.bs.modal event)
                //             modal.close();
                //         }, 1000);
                //     },
                //     classes: ['w-100'],
                //     disabled: true,
                //     width: '100%',
                //     parent: modal.find('.modal-footer'),
                //     type: 'light',
                //     value: 'Save and close'
                // });

                // saveAndCloseBtn.add();

                // const cancelBtn = BootstrapButton({
                //     action(event) {
                //         modal.close();
                //     },
                //     classes: ['w-100 mt-2'],
                //     width: '100%',
                //     parent: modal.find('.modal-footer'),
                //     style: 'color: white;',
                //     value: 'Close'
                // });

                // cancelBtn.add();

                // modal.showFooter();
            }

            $(modal.get()).on('hide.bs.modal', checkIfSaved);

            function checkIfSaved(event) {
                console.log('check if saved');
                console.log('param:', param);
                console.log('value:', value);
                console.log('editor:', editor.doc.getValue());

                // if (value === editor.doc.getValue()) {
                if (docValue === editor.doc.getValue()) {
                    console.log('unchanged');

                    if (shouldReload) {
                        // Dialog box
                        Store.get('appcontainer').append(/*html*/ `
                            <div class='dialog-container' style="position: fixed; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 10000">
                                <div class='dialog-box d-flex' style='min-width: 300px; min-height: 150px; padding: 30px; background: white; border-radius: 20px;'>
                                    <!-- Append loading spinner -->
                                </div>
                            </div>
                        `);

                        const loading = LoadingSpinner({
                            message: `Reloading`,
                            parent: Store.get('appcontainer').find('.dialog-box')
                        });

                        loading.add();

                        // Wait 5 seconds to make sure changes to list.js are committed
                        console.log('Wait 5s');
                        setTimeout(() => {
                            // Remove checkIfSaved before closing
                            $(modal.get()).off('hide.bs.modal', checkIfSaved);

                            // Remove dialog box
                            $(modal.get()).on('hide.bs.modal', event => {
                                Store.get('appcontainer').find('.dialog-container').remove();
                            });

                            // Reload
                            $(modal.get()).on('hidden.bs.modal', event => {
                                location.reload(true);
                            });

                            // Close modal (DOM node will be destroyed)
                            modal.close();
                        }, 5000);
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    console.log('changed');

                    Store.get('appcontainer').append(/*html*/ `
                        <div class='dialog-container' style="position: fixed; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 10000">
                            <div class='dialog-box' style='padding: 30px; background: white; border-radius: 20px;'>
                                <div class='mb-2' style=''>
                                    Do you want to save the changes you made to list.js?
                                </div>
                                <div class='mb-4' style='font-size: 13px;'>
                                    Your changes will be lost if you don't save them.
                                </div>
                                <div class='button-container' style='display: flex; justify-content: space-between;'>
                                    <div style='display: flex; justify-content: flex-start;'>
                                        <button class='btn btn-robi-light btn-sm dont-save'>Don't Save</button>
                                        <button class='btn btn-sm ml-2 cancel'>Cancel</button>
                                    </div>
                                    <div style='display: flex; justify-content: flex-end;'>
                                        <button class='btn btn-robi save'>Save</button>
                                    <div>
                                </div>
                            </div>
                        </div>
                    `);

                    // Don't save
                    Store.get('appcontainer').find('.dialog-box .dont-save').addEventListener('click', event => {
                        // Remove save diaglog box
                        Store.get('appcontainer').find('.dialog-container').remove();

                        // Remove checkIfSaved before closing
                        $(modal.get()).off('hide.bs.modal', checkIfSaved);

                        // Close modal (DOM node will be destroyed)
                        modal.close();
                    });

                    // Cancel
                    Store.get('appcontainer').find('.dialog-box .cancel').addEventListener('click', event => {
                        // Remove save dialog
                        Store.get('appcontainer').find('.dialog-container').remove();
                    });

                    // Save
                    Store.get('appcontainer').find('.dialog-box .save').addEventListener('click', async (event) => {
                        // Save file
                        await saveFile(event);

                        // Remove save dialog
                        Store.get('appcontainer').find('.dialog-container').remove();

                        // Remove checkIfSaved before closing
                        $(modal.get()).off('hide.bs.modal', checkIfSaved);

                        // Listen for modal has closed event, reload page since file changed
                        $(modal.get()).on('hidden.bs.modal', event => {
                            location.reload(true);
                        });

                        // Close modal
                        setTimeout(() => {
                            // Enable button
                            $(event.target)
                                .removeAttr('disabled')
                                .text('Saved');

                            // Close modal (DOM node will be removed on hidden.bs.modal event)
                            modal.close();
                        }, 1000);
                    });

                    return false;
                }
            }

            async function saveFile(event) {
                if (event) {
                    // Disable button - Prevent user from clicking this item more than once
                    $(event.target)
                        .attr('disabled', '')
                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving');
                }

                let currentValue = editor.getDoc().getValue();

                // console.log(currentValue);
                // TODO: Move to SetFile action
                let setFile;

                if (App.get('mode') === 'prod') {
                    setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/Add(url='${file}',overwrite=true)`, {
                        method: 'POST',
                        body: currentValue,
                        headers: {
                            'binaryStringRequestBody': 'true',
                            'Accept': 'application/json;odata=verbose;charset=utf-8',
                            'X-RequestDigest': requestDigest
                        }
                    });
                } else {
                    const devPath = path.replace('App/', '');
                    setFile = await fetch(`http://127.0.0.1:2035/?path=${devPath}&file=${file}`, {
                        method: 'POST',
                        body: currentValue
                    });
                    await Wait(1000);
                }

                if (setFile) {
                    const dot = modal.find('.changed-dot');

                    if (dot) {
                        dot.remove();
                    }

                    docValue = currentValue;

                    return setFile;
                }
            }
        }
    });

    modal.add();
}

/**
 * 
 * @param {*} color 
 * @returns 
 */
function NameToHex(color) {
    return Colors[color.toLowerCase()] || color;
}

export { NameToHex }

/**
 *
 * @param {*} param
 */
export async function OrderRoutes({ routes }) {
    console.log(routes);

    let digest;
    let request;

    if (App.get('mode') === 'prod') {
        digest = await GetRequestDigest();
        request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files('app.js')/$value`, {
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
    let value = await request.text();

    const allRoutes = value.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
    const routeObjects = allRoutes[1].split(', // @ROUTE');

    // console.log('App.js:', value);
    // console.log('Routes:', routes[0]);

    const newRoutes = routes.map(path => {
        // FIXME: change to regex, will find routes that are similar
        const route = routeObjects.find(item => item.includes(`// @START-${path}`));
        // console.log(`Path: // @START-${path} -> Route: ${route}`);

        return route;
    }).join(', // @ROUTE');

    console.log(newRoutes);

    const updated = value.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${newRoutes}// @END-ROUTES`);

    console.log('OLD\n----------------------------------------\n', value);
    console.log('\n****************************************');
    console.log('NEW\n----------------------------------------\n', updated);
    console.log('\n****************************************');

    let setFile;

    if (App.get('mode') === 'prod') {
        // TODO: Make a copy of app.js first
        // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
        setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files/Add(url='app.js',overwrite=true)`, {
            method: 'POST',
            body: updated, 
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
        // await Wait (1500);
    } else {
        setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
            method: 'POST',
            body: updated
        });
        await Wait(1000);
    }

    console.log('Saved:', setFile);
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function Post(param) {
    const {
        url, headers, data
    } = param;

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });

    try {
        return await response.json();
    } catch (error) {
        // console.log(error);
    }
}

/**
 *
 * @param {*} event
 */
export function ReinstallApp() {
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
                        background: App.get('backgroundColor')
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

/**
 *
 * @param {*} event
 */
export function ResetApp() {
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
            console.log(lists);

            // All Lists
            const allLists = Lists().concat(appLists);
            console.log(allLists);

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h4 class='mb-3'>Select <strong>${App.get('name')}</strong> lists to reset</span></h4>
                ${appLists
                    .sort((a, b) => a.list - b.list)
                    .map(item => {
                        return /*html*/ `
                            <div class="form-check ml-2">
                                <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}'>
                                <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                    ${item.list}
                                </label>
                            </div>
                        `;
                    }).join('\n')}
                <h4 class='mt-4 mb-3'>Select <strong>Core</strong> lists to reset</h4>
                ${coreLists
                    .filter(item => item.list !== 'Settings')
                    .sort((a, b) => a.list - b.list)
                    .map(item => {
                        return /*html*/ `
                            <div class="form-check ml-2">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}'>
                                <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                    ${item.list}
                                </label>
                            </div>
                        `;
                    }).join('\n')}
                <div class='alert alert-danger mt-5' style='border: none; border-radius: 10px;'>
                    All items in selected lists will be deleted. This can't be undone. Proceed with caution.
                </div>
            `);

            const deleteBtn = BootstrapButton({
                async action(event) {
                    console.log('Reinstall');

                    // Get checked lists
                    const checkedLists = [...modal.findAll('.form-check-input:checked')].map(node => allLists.find(item => item.list === node.dataset.list));

                    console.log(checkedLists);

                    if (!checkedLists.length) {
                        alert('Select at least one list to reset.');
                        return;
                    }

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
                        <h3 class='console-title mb-0'>Reseting <strong>lists</strong></h3>
                    `);

                    let progressCount = 0;

                    checkedLists.forEach(item => {
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
                        background: App.get('backgroundColor')
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
                            <code>Delete lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    checkedLists.forEach(item => {
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
                    for (let list in checkedLists) {
                        // Create lists
                        await DeleteList(checkedLists[list]);
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

                    // RESET ----------------------------------------------------------------------------------------
                    // 1. CORE: Add core lists to install-console
                    reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Create lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    checkedLists.forEach(item => {
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
                    for (let list in checkedLists) {
                        // Create lists
                        await CreateList(checkedLists[list]);

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

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    let spacers = '===============';

                    // for (let i = 0; i < App.get('name').length; i++) {
                    //     spacers = spacers + '=';
                    // }
                    // 3. Add to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: ${App.get('primaryColor')} !important;'>${spacers}</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: ${App.get('primaryColor')} !important;'>| Lists reset |</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: ${App.get('primaryColor')} !important;'>${spacers}</code>
                        </div>
                    `);

                    // END RESET ------------------------------------------------------------------------------------
                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='mt-4 mb-4'>All selected lists have been successfully reset. You can safely close this modal.</div>
                    `);

                    // Show return button
                    const returnBtn = BootstrapButton({
                        type: 'robi-light',
                        value: 'Close',
                        classes: ['w-100'],
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
                classes: ['w-100'],
                width: '100%',
                parent: modalBody,
                type: 'robi-reverse',
                value: `Reset lists`
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

/**
 *
 * @param {*} path
 * @param {*} options
 * @returns
 */
export function Route(path = App.get('defaultRoute'), options = {}) {
    const {
        scrollTop
    } = options;

    /** Remove styles in head */
    document.querySelectorAll(`head style[data-locked='no']`).forEach(node => node.remove());

    /** Remove modal overlay */
    const overlay = document.querySelector('.modal-backdrop');

    if (overlay) {
        overlay.remove();
    }

    /** Abort all pending fetch requests */
    Store.abortAll();

    /** Terminate all running workers */
    Store.terminateWorkers();

    /** Get references to core app components */
    const appContainer = Store.get('appcontainer');
    const svgDefs = Store.get('svgdefs');
    const sidebar = Store.get('sidebar');
    const mainContainer = Store.get('maincontainer');

    /** Set scroll top */
    Store.viewScrollTop(mainContainer.get().scrollTop);

    // Turn padding back on
    // mainContainer.paddingOn();
    /** Remove all events attached to the maincontainer */
    mainContainer.removeEvents();

    /** Empty mainconatainer DOM element */
    mainContainer.empty();

    /** Empty store */
    Store.empty();

    /** Re-add core app component references to store */
    Store.add({
        name: 'appcontainer',
        component: appContainer
    });
    Store.add({
        name: 'svgdefs',
        component: svgDefs
    });
    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });
    Store.add({
        name: 'sidebar',
        component: sidebar
    });

    // FIXME: Experimental.
    // Trying to solve the problem where components are
    // added to the current view after the user routes away from 
    // the view the component is added from.
    // 
    // This only happens when a fetch request begins when 
    // a view is first routed to but is aborted if the user
    // routes away before the request can finish.
    // Components created and added later are still 'running'
    // in the background.
    // 
    // Most views use Store.get('maincontainer') as their parent.
    // This means components will still be added because they're
    // finding the new maincontainer for that view.
    const viewContainer = ViewContainer({
        parent: mainContainer,
    });

    viewContainer.add();

    // Check route path
    const pathAndQuery = path.split('?');
    const pathParts = pathAndQuery[0].split('/');

    // Only select first path, remove any ? that might be passed in
    const route = Store.routes().find(item => item.path === pathParts[0]);

    if (!route) {
        // TODO: Reset history state?
        Route('404');

        return;
    }

    // Add source tools
    if (route.type !== 'system' && Store.user().Role === 'Developer') {
        const srcTools = SourceTools({
            route,
            parent: viewContainer
        });

        srcTools.add();

        // // FIXME: experimental
        // viewContainer.get().addEventListener('keypress', event => {
        //     if (event.ctrlKey && event.key === 'M') {
        //         event.preventDefault();
        //         ModifyFile({
        //             path: `App/src/Routes/${route.path}`,
        //             file: `${route.path}.js`
        //         });
        //     }
        // });
    }

    // Set browswer history state
    History({
        url: `${location.href.split('#')[0]}${(path) ? `#${path}` : ''}`,
        title: `${App.get('title')}${(path) ? ` - ${pathAndQuery[0]}` : ''}`
        // title: `${App.title}${(path) ? ` - ${path}` : ''}`
    });

    sidebar.selectNav(route.path);

    // Log route
    if (options.log !== false) {
        try {
            Log({
                Title: 'Route',
                Message: `${Store.user().Email || 'User'} routed to ${route.path}`,
                StackTrace: new Error().stack,
                // SessionId: '', // randomly generated UUID
                Module: import.meta.url
            });
        } catch (error) {
            console.error(error);
        }
    }

    /** Call .go() method */
    route.go({
        parent: viewContainer,
        pathParts,
        props: queryStringToObject(path.split('?')[1])
    });

    /**
     * Modified from {@link https://stackoverflow.com/a/61948784}
     */
    function queryStringToObject(queryString) {
        if (!queryString) {
            return {};
        };

        const pairs = queryString.split('&');
        // → ["foo=bar", "baz=buzz"]
        const array = pairs.map(el => {
            const parts = el.split('=');
            return parts;
        });
        // → [["foo", "bar"], ["baz", "buzz"]]
        return Object.fromEntries(array);
        // → { "foo": "bar", "baz": "buzz" }
    }

    /** Set Scroll Top */
    /** @todo this needs to run only after all async calls have completed */
    /** @note maybe Views should always return a promise? */
    /** @note or could just use a callback passed to the view */
    if (scrollTop) {
        console.log(scrollTop);

        Store.get('maincontainer').get().scrollTo({
            top: scrollTop
        });
    }
}

/**
 * @example
 *  await SendEmail({
 *      From: 'i:0e.t|dod_adfs_provider|1098035555@mil',
 *      To:['i:0e.t|dod_adfs_provider|1098035555@mil'],
 *      CC: [
 *          'i:0e.t|dod_adfs_provider|1098035555@mil'
 *      ],
 *      Subject: `QPP - Test`,
 *      Body: `
 *          <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
 *              <p>Test</p>
 *          </div>
 *      `
 *  });
 *
 */
export async function SendEmail(param) {
    const {
        From, To, CC, Subject, Body
    } = param;

    const requestDigest = await GetRequestDigest();
    const headers = {
        "Accept": "application/json;odata=verbose",
        "Content-type": "application/json; odata=verbose",
        "X-RequestDigest": requestDigest,
    };

    /** {@link https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-csom/jj171404(v=office.15)} */
    const properties = {
        'properties': {
            __metadata: {
                type: 'SP.Utilities.EmailProperties'
            },
            From: From,
            To: {
                results: [To]
            },
            CC: {
                results: CC || []
            },
            Body,
            Subject: Subject
        }
    };

    console.log(JSON.stringify(properties));

    const response = await fetch(`${App.get('site')}/_api/SP.Utilities.Utility.SendEmail`, {
        method: 'POST',
        headers,
        body: JSON.stringify(properties)
    });

    return response;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function SetHomePage(param = {}) {
    const { file, web, site } = param;

    const requestDigest = await GetRequestDigest({ web });
    const headers = {
        "Accept": "application/json;odata=verbose",
        "Content-type": "application/json; odata=verbose",
        "IF-MATCH": "*",
        "X-HTTP-Method": "PATCH",
        "X-RequestDigest": requestDigest,
    };

    const properties = {
        '__metadata': {
            'type': 'SP.Folder'
        },
        'WelcomePage': file || 'App/src/pages/app.aspx'
    };

    const response = await fetch(`${site || App.get('site')}${web ? `/${web}` : ''}/_api/web/rootfolder`, {
        method: 'POST',
        headers,
        body: JSON.stringify(properties)
    });

    return response;
}

/**
 * Set session storage key value pairs.
 * @param {Object}   param          Interface to module.
 */
export async function SetSessionStorage(param) {
    const {
        sessionStorageData
    } = param;

    if (!sessionStorageData) {
        return;
    }

    sessionStorageData.forEach(item => {
        const {
            key, value
        } = item;

        sessionStorage.setItem(key, value);
    });
}

/**
 *
 * @param {*} param
 */
export function Start(param) {
    const {
        settings
    } = param;

    const {
        links,
    } = settings;

    // Set app settings
    App.set(param);

    // toTitleCase string method polyfil
    String.prototype.toTitleCase = function () {
        return this
            .toLowerCase()
            .split(' ')
            .map(word => word.replace(word[0], word[0]?.toUpperCase()))
            .join(' ');
    };

    // splitCameCase
    String.prototype.splitCamelCase = function () {
        return this.split(/(?=[A-Z])/).join(' ');
    }

    if (App.get('errorLogging') === 'on') {
        /** Format error objects for JSON.stringify() to work properly */
        function replaceErrors(key, value) {
            if (value instanceof Error) {
                var error = {};

                Object.getOwnPropertyNames(value).forEach(function (key) {
                    error[key] = value[key];
                });

                return error;
            }

            return value;
        }

        /** Log errors to SharePoint list */
        window.onerror = async (message, source, lineno, colno, error) => {
            LogError({
                Message: message,
                Source: source,
                Error: JSON.stringify(error, replaceErrors)
            });
        };

        /** Log errors from Promises to SharePoint list */
        window.addEventListener("unhandledrejection", event => {
            LogError({
                Message: event.reason.message,
                Source: import.meta.url,
                Error: event.reason.stack
            });
        });
    }

    /** Start app on page load */
    window.onload = async () => {
        // Add links to head
        AddLinks({
            links
        });

        // Add appcontainer
        const appContainer = AppContainer();

        Store.add({
            name: 'appcontainer',
            component: appContainer
        });

        appContainer.add();

        // Pass start param to InstallApp
        InitializeApp(param);
    };
}

/**
 * 
 * @param {*} param 
 */
export function Style(param) {
    const {
        name,
        locked,
        style
    } = param;

    const node = document.querySelector(`style[data-name='${name}']`);

    if (node) {
        node.remove();
    }

    const css = /*html*/ `
        <style type='text/css' data-name='${name || id}' data-type='style' data-locked='${locked ? 'yes' : 'no'}'>
            ${style}
        </style>
    `;
    const head = document.querySelector('head');

    head.insertAdjacentHTML('beforeend', css);
}

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

/**
 *
 * @param {*} param
 */
export function UpdateApp() {
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
                            background: App.get('backgroundColor')
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
                                    <code style='color: ${App.get('primaryColor')} !important;'>${spacers}</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: ${App.get('primaryColor')} !important;'>| Columns created |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: ${App.get('primaryColor')} !important;'>${spacers}</code>
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
                                    <code style='color: ${App.get('primaryColor')} !important;'>=================</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: ${App.get('primaryColor')} !important;'>| Lists deleted |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: ${App.get('primaryColor')} !important;'>=================</code>
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
                            classes: ['w-100'],
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

/**
 * Update SharePoint list field.
 * @param {Object}   param          Interface to UpdateItem() module.
 * @param {string}   param.list     SharePoint list Name.
 */
export async function UpdateColumn(param) {
    const {
        list, field
    } = param;

    const {
        name, description, type, choices, fillIn, title, required, lookupList, lookupField, value
    } = field;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // TODO: Check if field exists first
    const getField = await fetch(`${App.get('site')}/_api/web/lists/getByTitle('${list}')/fields/getbytitle('${name}')`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': requestDigest
        }
    });
    const response = await getField.json();

    if (!response?.d) {
        // FIXME: update progress bar or error out?
        console.log(`Field ${name} not found in list ${list}.`);
        return;
    }

    let data = {
        "__metadata": {
            "type": response.d.__metadata.type
        }
    };

    // if (choices !== undefined) {
    //     // data. = '';
    // }
    // if (fillIn !== undefined) {
    //     // data. = '';
    // }
    // if (title !== undefined) {
    //     // data. = '';
    // }
    // if (lookupList !== undefined) {
    //     // data. = '';
    // }
    // if (lookupField !== undefined) {
    //     // data. = '';
    // }
    if (required !== undefined) {
        data.Required = required;
    }

    if (description !== undefined) {
        data.Description = description;
    }

    if (value !== undefined) {
        data.DefaultValue = value;
    }

    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields/GetByTitle('${name}')`,
        data,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
            "X-RequestDigest": requestDigest,
        }
    };

    await Post(postOptions);

    try {
        // Console success
        console.log(`Updated column '${name}'`);

        // Append to install-console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Updated column '${name}'</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            progressBar.update();
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Update SharePoint list item.
 * @param {Object}  param          - Interface to UpdateItem() module.
 * @param {string}  param.list     - SharePoint List Name.
 * @param {number}  param.itemId   - Item Id of item in param.list.
 * @param {boolean} [param.notify] - If false, don't display notification.
 */
export async function UpdateItem(param) {
    const {
        list, itemId, select, expand, data, wait
    } = param;

    console.log(`List: ${list}, Item: ${itemId}, Data:`, data);

    // Exit if no data passed in
    if (Object.getOwnPropertyNames(data).length === 0) {
        return;
    }

    if (App.get('mode') === 'prod') {
        // Get item by id
        const getItem = await Get({
            list,
            filter: `Id eq ${itemId}`
        });

        const item = getItem[0];

        // Get new request digest
        const requestDigest = await GetRequestDigest();

        // Add SharePoint List Item Type metadata property to passed in data object
        data.__metadata = {
            'type': item.__metadata.type
        };

        // Define Post interface
        const postOptions = {
            url: item.__metadata.uri,
            data: data,
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-HTTP-Method": "MERGE",
                "X-RequestDigest": requestDigest,
                "If-Match": item.__metadata.etag
            }
        };

        // Post update
        await Post(postOptions);

        // Get updated item
        const getUpdatedItem = await Get({
            list,
            select,
            expand,
            filter: `Id eq ${itemId}`
        });

        const updatedItem = getUpdatedItem[0];

        return updatedItem;
    } else {
        const body = data;

        body.EditorId = body.EditorId || App.get('dev').user.SiteId;
        body.Editor = body.Editor || { Title: App.get('dev').user.Title };

        const date = new Date().toUTCString();
        body.Modified = date;

        const options = {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        };

        const response = await fetch(`http://localhost:3000/${list}/${itemId}`, options);
        if (wait !== false) {
            await Wait(500);
        }

        if (response) {
            // Get updated item
            const getUpdatedItem = await Get({
                list,
                select,
                expand,
                filter: `Id eq ${itemId}`
            });

            const updatedItem = getUpdatedItem[0];

            return updatedItem;
        }
    }
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function UploadFile(param) {
    const {
        file, data, library
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();
    const fileBuffer = await getFileBuffer(file);
    const upload = await fetch(`${App.get('site')}/_api/web/folders/GetByUrl('${library}')/Files/add(overwrite=true,url='${file.name}')`, {
        method: 'POST',
        headers: {
            "Accept": "application/json;odata=verbose",
            'content-type': 'application/json; odata=verbose',
            "X-RequestDigest": requestDigest,
            "content-length": fileBuffer.byteLength
        },
        body: fileBuffer
    });

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    const response = await upload.json();

    let item = await GetByUri({
        uri: response.d.ListItemAllFields.__deferred.uri
    });

    let itemToReturn;

    if (data) {
        const updateItemParam = {
            list: library,
            itemId: item.Id,
            select: `*,Author/Title,Editor/Title`,
            expand: `File,Author,Editor`,
            data
        };

        itemToReturn = await UpdateItem(updateItemParam);
    } else {
        itemToReturn = item;
    }

    return itemToReturn;
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function UploadFiles(param) {
    const {
        files, path
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // Upload responses
    const uploads = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = file.name;
        const fileBuffer = await getFileBuffer(file);

        // const upload = await fetch(`${App.get('site')}/_api/web/folders/GetByUrl('/${site}/${list}')/Files/add(url='${name}',overwrite=true)`, {
        // const upload = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/add(url='${name}',overwrite=true)`, {
        // const upload = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/add`, {
        const upload = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/add(url='${name}')`, {
            method: 'POST',
            headers: {
                "Accept": "application/json;odata=verbose",
                'content-type': 'application/json; odata=verbose',
                "X-RequestDigest": requestDigest,
            },
            body: fileBuffer
        });

        uploads.push(upload);
    }

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    const responses = await Promise.all(uploads);
    const updatedItems = await Promise.all(responses.map(async (response) => {
        const data = await response.json();

        return GetByUri({
            uri: data.d.ListItemAllFields.__deferred.uri
        });
    }));

    return updatedItems;
}

/**
 * 
 * @param {*} ms 
 * @returns 
 */
export function Wait(ms) {
    console.log(`Waiting ${ms}ms`);
    
    return new Promise(resolve => setTimeout(resolve, ms));
}

let appSettings = {};
let appLists;

const App = {
    lists() {
        return appLists;
    },
    set(param) {
        const { lists, routes, settings } = param;
        const { library, defaultRoute, theme } = settings;

        // Set lists
        appLists = lists;

        // Set mode
        if (location.href.includes('localhost') || location.href.includes('127.0.0.1')) {
            settings.mode = 'dev';
        } else {
            settings.mode = 'prod';
        }

        // Set library
        if (!library) {
            settings.library = 'App';
        }

        // Set site
        if (settings.mode === 'prod') {
            console.log('Site:', location.href.split(library || '/App/')[0]);
            console.log('App library:', settings.library);

            settings.site = location.href.split(library || '/App/')[0];
        } else {
            settings.site = 'http://localhost';
        }

        // Set default route
        if (!defaultRoute) {
            settings.defaultRoute = routes.map(route => route.path)[0];
        }

        // Set colors
        const { primary, secondary, background, color } = Themes.find(item => item.name === theme);

        // Primary
        settings.primaryColor = NameToHex(primary);
        settings.primaryColorRGB = HexToRGB(settings.primaryColor);
        settings.primaryColorHSL = HexToHSL(settings.primaryColor);

        // Secondary
        settings.secondaryColor = secondary;

        // Background
        settings.backgroundColor = background;

        // Default color
        settings.defaultColor = color;

        // Set all
        appSettings = settings;
    },
    get(prop) {
        return appSettings[prop];
    }
}

Object.freeze(App);

export { App }

const Routes = [
    {
        path: '403',
        type: 'system',
        hide: true,
        go(param) {
            Unauthorized(param);
        }
    },
    {
        path: '404',
        type: 'system',
        hide: true,
        go(param) {
            Missing(param);
        }
    },
    {
        path: 'Developer',
        type: 'system',
        roles: [
            'Developer'
        ],
        icon: 'code-slash',
        go(param) {
            Developer(param);
        }
    },
    {
        path: 'Help',
        type: 'system',
        icon: 'info-circle',
        go(param) {
            Help(param);
        }
    },
    {
        path: 'Questions',
        type: 'system',
        icon: 'chat-right-text',
        go(param) {
            const {
                parent,
                pathParts
            } = param;

            if (pathParts.length === 1) {
                QuestionTypes(param);
            } else if (pathParts.length === 2) {
                QuestionBoard({
                    parent,
                    path: pathParts[1]
                });
            } else if (pathParts.length === 3) {
                QuestionAndReplies({
                    parent,
                    path: pathParts[1],
                    itemId: parseInt(pathParts[2])
                });
            }
        }
    },
    {
        path: 'Settings',
        type: 'system',
        icon: 'bs-gear',
        go(param) {
            Settings(param);
        }
    },
    {
        path: 'Users',
        type: 'system',
        roles: [
            'Developer',
            'Administrator'
        ],
        icon: 'people',
        go(param) {
            const {
                parent,
                pathParts
            } = param;

            if (pathParts.length === 1) {
                Users(param);
            } else if (pathParts.length === 2) {
                Users({
                    itemId: parseInt(pathParts[1]),
                    parent
                });
            }
        }
    }
];

export { Routes }

const store = {
    elementIdCounter: 0,
    viewScrollTop: 0,
    data: {},
    abortControllers: [],
    workers: [],
    components: {},
    models: {},
    lists: {},
    user: {},
    routes: []
};

const Store = {
    add(param) {
        const {
            type,
        } = param;

        switch (type) {
            case 'list':
                {
                    const {
                        list,
                        items
                    } = param;
        
                    store.lists[list] = items;
                    break;
                }
            case 'model':
                {
                    const {
                        name,
                        model
                    } = param;
        
                    store.models[name] = model;
                    break;
                }
            default:
                {
                    const {
                        name
                    } = param;
        
                    store.components[name] = param;
                    break;
                }
        }
    },
    addWorker(worker) {
        store.workers.push(worker);
    },
    terminateWorkers() {
        store.workers.forEach(worker => {
            worker.terminate();
        });
    },
    addAbortController(controller) {
        store.abortControllers.push(controller);
    },
    getAbortControllers() {
        return store.abortControllers;
    },
    abortAll() {
        store.abortControllers.forEach(controller => {
            controller.abort();
        });
    },
    get(name) {
        if (store.components[name]) {
            return store.components[name].component;
        } else if (store.lists[name]) {
            return store.lists[name];
        } else if(store.models[name]) {
            return store.models[name];
        } else {
            return undefined;
        }
    },
    getNextId() {
        return `App-${store.elementIdCounter++}`; 
    },
    remove(name) {
        store.components[name].component.remove();
        
        delete store.components[name];
    },
    // register(actionData) {
    //     store.data.push(actionData);
    // },
    // deregister(actionData) {
    //     const index = store.data.indexOf(actionData);

    //     store.data.splice(index, 1);
    // },
    // recall() {
    //     return store.data;
    // },
    empty() {
        store.components = {};
        // TODO: Do we want to persist data when routing?
        // store.data = [];
    },
    user(userInfo) {
        if (typeof userInfo === 'object') {
            store.user = userInfo;
        } else {
            return store.user;
        }
    },
    viewScrollTop(param) {
        if (param) {
            if (typeof param === 'number') {
                store.viewScrollTop = param;
            } else {
                console.log(`${param} is not a number`);
            }
        } else {
            return store.viewScrollTop;
        }
    },
    removeData(name) {
        delete store.data[name];
    },
    setData(name, data) {
        store.data[name] = data;
    },
    getData(name) {
        return store.data[name];
    },
    setRoutes(routes) {
        store.routes = routes;
    },
    routes() {
        return store.routes;
    }
}

Object.freeze(Store);

export { Store }

/**
 * @param {*} param
 * @returns
 */
export function Lists() {
    return [
        {
            list: 'Settings',
            fields: [
                {
                    name: "Key",
                    type: 'slot'
                },
                {
                    name: "Value",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'Comments',
            fields: [
                {
                    name: "FK_ParentId",
                    type: 'number'
                },
                {
                    name: "Comment",
                    type: 'mlot'
                },
                {
                    name: "SubmitedBy",
                    type: 'slot'
                },
                {
                    name: "LoginName",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Errors',
            fields: [
                {
                    name: "SessionId",
                    type: 'slot'
                },
                {
                    name: "Message",
                    type: 'mlot'
                },
                {
                    name: "Error",
                    type: 'mlot'
                },
                {
                    name: "Source",
                    type: 'mlot'
                },
                {
                    name: "UserAgent",
                    type: 'mlot'
                },
                {
                    name: "Status",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Log',
            fields: [
                {
                    name: "SessionId",
                    type: 'slot'
                },
                {
                    name: "Message",
                    type: 'mlot'
                },
                {
                    name: "StackTrace",
                    type: 'mlot'
                },
                {
                    name: "Module",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'ReleaseNotes',
            fields: [
                {
                    name: "Summary",
                    type: 'slot'
                },
                {
                    name: "Description",
                    type: 'mlot'
                },
                {
                    name: "Status",
                    type: 'slot'
                },
                {
                    name: "MajorVersion",
                    type: 'slot'
                },
                {
                    name: "MinorVersion",
                    type: 'slot'
                },
                {
                    name: "PatchVersion",
                    type: 'slot'
                },
                {
                    name: "ReleaseType",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Roles',
            fields: [
                {
                    name: 'Title',
                    required: false,
                    value: 'View',
                    type: 'slot'
                },
                {
                    name: 'Role',
                    type: 'slot'
                }
            ],
            items: [
                {
                    Role: 'Administrator'
                },
                {
                    Role: 'Developer'
                },
                {
                    Role: 'User'
                }
            ]
        },
        {
            list: 'Questions',
            fields: [
                {
                    name: 'Body',
                    type: 'mlot'
                },
                {
                    name: 'ParentId',
                    type: 'number'
                },
                {
                    name: 'QuestionId',
                    type: 'number'
                },
                {
                    name: 'QuestionType',
                    type: 'slot'
                },
                {
                    name: 'Featured',
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Users',
            fields: [
                {
                    name: 'Title',
                    display: 'Name',
                    required: false,
                    type: 'slot'
                },
                {
                    name: 'Email',
                    type: 'slot'
                },
                {
                    name: "LoginName",
                    display: 'Login Name',
                    type: 'slot'
                },
                {
                    name: "Role",
                    type: 'choice',
                    choices: [
                        'Administrator',
                        'Developer',
                        'User'
                    ]
                },
                {
                    name: "Settings",
                    type: 'mlot'
                }
            ],
            views: [
                {
                    name: 'Users',
                    fields: [
                        'Title',
                        'Email',
                        'LoginName',
                        'Role'
                    ]
                }
            ]
        }
    ];
}

/**
 *
 * @param {*} param
 * @returns
 */

export function QuestionModel(param) {
    const {
        question, replies
    } = param;

    question.replies = replies || [];

    question.addReply = (reply) => {
        question.replies.push(reply);
    };

    return question;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function QuestionsModel(param) {
    const {
        filter
    } = param;

    /** Get Questions */
    const messages = await Get({
        list: 'Questions',
        filter,
        select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
        orderby: 'Id desc',
        expand: `Author/Id,Editor/Id`
    });

    /** Questions */
    const questions = messages.filter(question => question.ParentId === 0);

    /** Replies */
    const replies = messages.filter(question => question.ParentId !== 0);

    /** Model */
    const Model_Questions = questions.map(question => {
        // question.replies = replies.filter(reply => reply.QuestionId === question.Id);
        // return question;
        return QuestionModel({
            question,
            replies: replies.filter(reply => reply.QuestionId === question.Id)
        });
    });

    Store.add({
        type: 'model',
        name: 'Model_Questions',
        model: Model_Questions
    });

    return Model_Questions;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function SiteUsageModel(param) {
    const {
        visits,
    } = param;

    /** Today */
    const itemsCreatedToday = visits.filter(createdToday);

    function createdToday(item) {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (created.toDateString() == today.toDateString()) {
            return item;
        }
    }

    /** Week */
    const itemsCreatedThisWeek = visits.filter(createdThisWeek);

    function createdThisWeek(item) {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        // if (created >= monday) {
        if (created >= StartAndEndOfWeek().sunday) {
            return item;
        }
    }

    /** Month */
    const firstOfMonth = startOfMonth();

    function startOfMonth(date) {
        const now = date ? new Date(date) : new Date();

        now.setHours(0, 0, 0, 0);
        now.setDate(1);

        return now;
    }

    const itemsCreatedThisMonth = visits.filter(createdThisMonth);

    function createdThisMonth(item) {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        if (created >= firstOfMonth) {
            return item;
        }
    }

    /** Year */
    const firstOfYear = startOfYear();

    function startOfYear(date) {
        const now = date ? new Date(date) : new Date();

        now.setHours(0, 0, 0, 0);
        now.setDate(1);
        now.setMonth(0);

        return now;
    }

    const itemsCreatedThisYear = visits.filter(item => {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        if (created >= firstOfYear) {
            return item;
        }
    });

    /** Chart - Today */
    const today = [
        {
            label: 'Visits',
            data: []
        }
    ];

    for (let i = 0; i < 24; i++) {
        today[0].data.push(itemsCreatedToday.filter(byHour, i));
    }

    function byHour(item) {
        const created = new Date(item.Created);

        const hourBegin = new Date();
        hourBegin.setHours(this, 0, 0, 0);

        const hourEnd = new Date();
        hourEnd.setHours(this + 1, 0, 0, 0);

        // console.log(this);
        // console.log(created);
        // console.log(hourBegin);
        // console.log(hourEnd);
        // console.log('---');
        if (created >= hourBegin && created < hourEnd) {
            return item;
        }
    }

    /** Chart - Week */
    const week = [
        {
            label: 'Visits',
            data: [
                itemsCreatedThisWeek.filter(byDayOfWeek, 0),
                itemsCreatedThisWeek.filter(byDayOfWeek, 1),
                itemsCreatedThisWeek.filter(byDayOfWeek, 2),
                itemsCreatedThisWeek.filter(byDayOfWeek, 3),
                itemsCreatedThisWeek.filter(byDayOfWeek, 4),
                itemsCreatedThisWeek.filter(byDayOfWeek, 5),
                itemsCreatedThisWeek.filter(byDayOfWeek, 6) /** Saturday */
            ]
        }
    ];

    function byDayOfWeek(item) {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        const day = StartAndEndOfWeek().sunday;
        day.setDate(day.getDate() + this);
        day.setHours(0, 0, 0, 0);

        if (created.toDateString() === day.toDateString()) {
            return item;
        }
    }

    /** Chart - Month */
    const days = daysInMonth(new Date().getMonth() + 1); /** passed in month starts at 1 for Jan, not 0 */

    function daysInMonth(month) {
        const date = new Date();

        date.setMonth(month);
        date.setDate(0);

        return date.getDate();
    }

    const month = [
        {
            label: 'Visits',
            data: []
        }
    ];

    for (let i = 1; i <= days; i++) {
        month[0].data.push(itemsCreatedThisMonth.filter(byDate, i));
    }

    function byDate(item) {
        const created = new Date(item.Created);
        created.setHours(0, 0, 0, 0);

        const day = new Date();
        day.setDate(this);
        day.setHours(0, 0, 0, 0);

        if (created.toDateString() === day.toDateString()) {
            return item;
        }
    }

    /** Chart - Year */
    const year = [
        {
            label: 'Visits',
            data: []
        }
    ];

    for (let i = 0; i <= 11; i++) {
        const date = new Date();
        const yyyy = date.getFullYear();

        const firstOfMonth = new Date(yyyy, i, 1);
        const lastOfMonth = new Date(yyyy, i + 1, 0);

        // console.log('Index:', i);
        // console.log('First:', firstOfMonth);
        // console.log('Last:', lastOfMonth);
        // console.log('------------------');
        year[0].data.push(visits.filter(createdThisMonth));

        function createdThisMonth(item) {
            const created = new Date(item.Created);
            created.setHours(0, 0, 0, 0);

            if (created >= firstOfMonth && created <= lastOfMonth) {
                return item;
            }
        }
    }

    return {
        visits: {
            today: itemsCreatedToday,
            week: itemsCreatedThisWeek,
            month: itemsCreatedThisMonth,
            year: itemsCreatedThisYear,
        },
        chart: {
            today,
            week,
            month,
            year
        }
    };
}

/**
 * @link https://stackoverflow.com/a/12793705
 *
 * Modified By
 * @author Stephen Matheis
 * @email stephen.a.matheis.ctr@mail.mil
 * @date 2020.11.16
 *
 * - Replaced 'var' with 'const'
 * - Changed return value to @Object from @Array
 */

export function StartAndEndOfWeek(date) {
    // set local variable
    const now = date ? new Date(date) : new Date();

    // set time to some convenient value
    now.setHours(0, 0, 0, 0);

    // // Get Monday
    // const monday = new Date(now);
    // // monday.setDate(monday.getDate() - monday.getDay() + 1);
    // monday.setDate(monday.getDate() - (6 - monday.getDay()));
    // // Get Sunday
    // const sunday = new Date(now);
    // // sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    // sunday.setDate(sunday.getDate() + monday.getDay());
    // Get Sunday
    const sunday = new Date(now);
    // monday.setDate(monday.getDate() - monday.getDay() + 1);
    sunday.setDate(sunday.getDate() - sunday.getDay());

    // Get Sunday
    const saturday = new Date(now);
    // sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    saturday.setDate(saturday.getDate() + (6 + saturday.getDay()));

    // Return object of date objects
    return {
        sunday,
        saturday
    };
}

const Themes = [
    { name: 'Blue', primary: '#167EFB', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Brown', primary: '#A52A2A', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Gray', primary: '#708090', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Green', primary: '#2E8B57', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Gold', primary: '#B8860B', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Magenta', primary: '#8B008B', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Orange', primary: '#FF8C00', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Pink', primary: '#C71585', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Purple', primary: '#6A5ACD', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Red', primary: '#e63e44', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Slate', primary: '#2F4F4F', secondary: 'white', background: '#F8F8FC', color: '#24292f'},
    { name: 'Teal', primary: '#008080', secondary: 'white', background: '#F8F8FC', color: '#24292f'}
]

export { Themes };
