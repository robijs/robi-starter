// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { ModalSlideUp, Button, LoadingSpinner } from '../../Robi/RobiUI.js'
import { CreateApp  } from '../../Robi/Robi.js'

/**
 * 
 * @param {*} param 
 */
export default async function Test({ parent }) {
    const copyAppBtn = Button({
        value: 'Copy app.js',
        classes: ['mr-3', 'mt-3'],
        type: 'robi',
        parent,
        async action(event) {
            await CopyFile({
                source: App.get('site'),
                target: `${App.get('site')}/Test`,
                path: 'App/src',
                file: 'app.js',
                appName: 'Test',
                appTitle: 'Test',
                primary: '#167EFB',
                secondary: '#ffffff',
                background: '#F8F8FC',
                color: '#24292f'
            });
        }
    });

    copyAppBtn.add();

    const getSiteUsersBtn = Button({
        value: 'Create dir',
        classes: ['mr-3', 'mt-3'],
        type: 'robi',
        parent,
        async action(event) {
            const url = [
                `${App.get('site')}`,
                `/_vti_bin/listdata.svc/UserInformationList`,
                `?$top=200`,
                `&$select=Name,Account,WorkEmail`,
                // `&$filter=substringof('i:0e.t|dod_adfs_provider|', Account) and (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
                `&$filter=substringof('${query}', Account) or (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
            ].join('');
            const init = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; odata=verbose'
                },
                signal: abortController.signal
            };

            const response = await fetch(url, init);
            const data = await response.json();

            console.log(data);
        }
    });

    getSiteUsersBtn.add();

    const createDirBtn = Button({
        value: 'Create dir',
        classes: ['mr-3', 'mt-3'],
        type: 'robi',
        parent,
        async action(event) {
            await fetch(`http://127.0.0.1:2035/?path=src/Routes/NewRouteDir&file=Test.js`, {
                method: 'POST',
                body: 'Test'
            });

            await Wait(1000);
        }
    });

    createDirBtn.add();

    const editTitle = Button({
        value: 'Edit title',
        classes: ['mr-3', 'mt-3'],
        type: 'robi',
        parent,
        async action(event) {
            let digest;
            let request;

            if (App.isProd()) {
                digest = await GetRequestDigest();
                request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/Test')/Files('Test.js')/$value`, {
                    method: 'GET',
                    headers: {
                        'binaryStringRequestBody': 'true',
                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                        'X-RequestDigest': digest
                    }
                });
            } else {
                request = await fetch(`http://127.0.0.1:8080/src/Routes/Test/Test.js`);
                await Wait(1000);
            }

            const value = await request.text();
            const newTitle = `'Changed'`;
            const updated = value.replace(/\/\* @START-Title \*\/([\s\S]*?)\/\* @END-Title \*\//, `/* @START-Title */${newTitle}/* @END-Title */`);

            console.log('OLD\n----------------------------------------\n', value);
            console.log('\n****************************************');
            console.log('NEW\n----------------------------------------\n', updated);
            console.log('\n****************************************');

            let setFile;

            if (App.isProd()) {
                // TODO: Make a copy of app.js first
                // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/Test')/Files/Add(url='Test.js',overwrite=true)`, {
                    method: 'POST',
                    body: updated, 
                    headers: {
                        'binaryStringRequestBody': 'true',
                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                        'X-RequestDigest': digest
                    }
                });
            } else {
                setFile = await fetch(`http://127.0.0.1:2035/?path=src/Routes/Test&file=Test.js`, {
                    method: 'POST',
                    body: updated
                });
                await Wait(1000);
            }

            console.log('Saved:', setFile);
        }
    });

    editTitle.add();

    const shrinkApp = Button({
        value: 'Shrink app',
        classes: ['mr-3', 'mt-3'],
        type: 'robi',
        parent,
        async action(event) {
            ModifyFileSlideUp({
                path: 'App/src',
                file: 'lists.js'
            });

            setTimeout(() => {
                document.querySelector('#app').style.background = 'black';
                Store.get('sidebar').get().style.borderRadius = '20px 0px 0px 20px';
                Store.get('maincontainer').get().style.borderRadius = '0px 20px 0px 0px';
                Store.get('appcontainer').get().style.borderRadius = '20px';
                Store.get('appcontainer').get().classList.add('shrink-app');
            }, 0);
        }
    });

    shrinkApp.add();

    function ModifyFileSlideUp(param) {
        const { path, file } = param;
    
        const modal = ModalSlideUp({
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
            titleStyle: 'width: 100%;',
            headerStyle: 'border-bottom: solid 1px #676E95; padding-bottom: 0px;',
            footerStyle: 'border-top: solid 1px #676E95;',
            close: false,
            scrollable: true,
            background: '#292D3E',
            centered: true,
            showFooter: false,
            async addContent(modalBody) {
                const loading = LoadingSpinner({
                    message: `Loading <span style='font-weight: 300;'>${path}/${file}</span>`,
                    classes: ['h-100', 'loading-file'],
                    parent: modalBody
                });
    
                loading.add();

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <!-- <div class='file-title d-none'>
                        <span class='file-title-text d-flex'>
                            <span class='file-icon-container'>
                                <svg class='icon file-icon file-icon-js'>
                                    <use href='#icon-javascript'></use>
                                </svg>
                            </span>
                            <span>
                                ${path}/${file}
                            </span>
                        </span>
                    </div> -->
                    <textarea class='code-mirror-container robi-code-background h-100'></textarea>
                `);
    
                let shouldReload = false;
    
                const editor = CodeMirror.fromTextArea(modal.find('.code-mirror-container'), {
                    mode: 'javascript',
                    lineNumbers: true,
                    lineWrapping: true,
                    extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                });
                editor.foldCode(CodeMirror.Pos(0, 0));
                editor.setSize(0, 0);
                editor.setOption('extraKeys', {
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
    
                if (App.isProd()) {
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
    
                            saveAndCloseBtn.get().disabled = true;
                        } else {
                            console.log('changed');
    
                            const dot = modal.find('.changed-dot');
    
                            if (!dot) {
                                modal.find('.file-title').insertAdjacentHTML('beforeend', /*html*/ `
                                    <div class='changed-dot' style='margin-left: 15px; width: 8px; height: 8px; background: white; border-radius: 50%;'></div>
                                `);
                            }
    
                            saveAndCloseBtn.get().disabled = false;
                        }
                    });
    
                    // Remove .modal-body top padding
                    modalBody.style.paddingTop = '0px';
    
                    // Save and close button
                    const saveAndCloseBtn = Button({
                        async action(event) {
                            // TODO: only save file if changed
                            await saveFile(event);
    
                            $(modal.get()).on('hidden.bs.modal', event => {
                                location.reload(true);
                            });
    
                            setTimeout(() => {
                                // Enable button
                                $(event.target)
                                    .removeAttr('disabled')
                                    .text('Saved');
    
                                // Close modal (DOM node will be removed on hidden.bs.modal event)
                                modal.close();
                            }, 1000);
                        },
                        classes: ['w-100'],
                        disabled: true,
                        width: '100%',
                        parent: modal.find('.modal-footer'),
                        type: 'light',
                        value: 'Save and close'
                    });
    
                    saveAndCloseBtn.add();
    
                    const cancelBtn = Button({
                        action(event) {
                            modal.close();
                        },
                        classes: ['w-100 mt-2'],
                        width: '100%',
                        parent: modal.find('.modal-footer'),
                        style: 'color: white;',
                        value: 'Close'
                    });
    
                    cancelBtn.add();
    
                    modal.showFooter();
                }

                // FIXME: pass in close callback behavior
                // TODO: Reverse animation on close
                $(modal.get()).on('hide.bs.modal', event => {
                    document.querySelector('#app').style.background = 'white';
                    Store.get('sidebar').get().style.borderRadius = '0px';
                    Store.get('maincontainer').get().style.borderRadius = '0px';
                    Store.get('appcontainer').get().style.borderRadius = '00px';
                    Store.get('appcontainer').get().classList.remove('shrink-app');
                });
    
                $(modal.get()).on('hide.bs.modal', checkIfSaved);
    
                function checkIfSaved(event) {
                    console.log('check if saved');
                    console.log('param:', param);
                    console.log('value:', value);
                    console.log('editor:', editor.doc.getValue());
    
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
    
                            // Wait a second to make sure changes to list.js are committed
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
                            }, 1000);
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
                                            <button class='btn btn-secondary btn-sm dont-save'>Don't Save</button>
                                            <button class='btn btn-light btn-sm ml-2 cancel'>Cancel</button>
                                        </div>
                                        <div style='display: flex; justify-content: flex-end;'>
                                            <button class='btn btn-success save'>Save</button>
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
    
                    if (App.isProd()) {
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

    const parseRoutes = Button({
        value: 'Parse routes',
        classes: ['mr-3', 'mt-3'],
        type: 'robi',
        parent,
        async action(event) {
            // const routes = app.match(/routes:([\s\S]*?)settings:/);

            // console.log(routes);

            // console.log('One: ', routes[0]);
            // console.log('Two: ', routes[1]);

            // console.log(looseJsonParse(
            //     routes[1]
            // ));

            // REPLACE
            // routes = routes.replace(/routes:([\s\S]*?)settings:/, `routes:['test'],settings`);
            // console.log(routes);
            let digest;
            let request;

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
                request = await fetch(`http://127.0.0.1:8080/src/app.js`);
                await Wait(1000);
            }
            let value = await request.text();

            const routes = value.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
            const ordered = routes[1].split(', // @ROUTE');

            // console.log('App.js:', value);
            // console.log('Routes:', routes[0]);

            const newOrder = [
                'Measures',
                'Test'
            ];

            const newRoutes = newOrder.map(path => {
                const route = ordered.find(item => item.includes(`// @START-${path}`));
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

            if (App.isProd()) {
                // TODO: Make a copy of app.js first
                // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
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
    });

    parseRoutes.add();

    const openVSCodeBtn = Button({
        value: 'VS Code',
        classes: ['mr-3', 'mt-3'],
        type: 'robi',
        parent,
        async action(event) {
            open(`vscode:${App.get('site')}/${App.get('library')}/src`);
        }
    });

    openVSCodeBtn.add();

    const createSiteBtn = Button({
        value: 'Create app',
        classes: ['mr-3', 'mt-3'],
        type: 'robi',
        parent,
        async action(event) {
            CreateApp();
        }
    });

    createSiteBtn.add();
}