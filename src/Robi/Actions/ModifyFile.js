import { Modal } from '../Components/Modal.js'
import { LoadingSpinner } from '../Components/LoadingSpinner.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { Wait } from './Wait.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function ModifyFile(param) {
    const { path, file } = param;

    const modal = Modal({
        title: /*html*/ `
            <div class='file-title' style='user-select: none;'>
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
        headerStyle: 'padding-bottom: 0px;',
        footerStyle: 'border-top: solid 1px #676E95;',
        closeStyle: 'padding: 16px;',
        scrollable: true,
        // background: '#292D3E',
        background: '#1e1e1e',
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
                autoCloseBrackets: true,
                styleActiveLine: true,
                foldGutter: true,
                matchBrackets: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                keyword: {
                    "import": "special",
                    "export": "special",
                    "default": "special",
                    "await": "special",
                }
            });
            editor.foldCode(CodeMirror.Pos(0, 0));
            editor.setSize(0, 0);
            editor.setOption('extraKeys', {
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
            let docValue = '';

            function setEditor() {
                editor.setSize('100%', '100%');
                editor.setOption('viewportMargin', Infinity);
                editor.setOption('theme', 'vscode-dark');
                editor.getDoc().setValue(value);
                editor.focus();

                docValue = editor.doc.getValue();

                // Watch for changes
                editor.on('change', event => {
                    if (docValue === editor.doc.getValue()) {
                        console.log('unchanged');

                        const dot = modal.find('.changed-dot');

                        if (dot) {
                            dot.remove();
                        }
                    } else {
                        console.log('changed');

                        const dot = modal.find('.changed-dot');

                        if (!dot) {
                            modal.find('.file-title').insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='changed-dot' style='margin-left: 15px; width: 8px; height: 8px; background: white; border-radius: 50%;'></div>
                            `);
                        }
                    }
                });

                // Remove .modal-body top padding
                modalBody.style.paddingTop = '0px';
            }

            $(modal.get()).on('hide.bs.modal', checkIfSaved);

            async function checkIfSaved(event) {
                // Don't close just yet
                event.preventDefault();

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

                        // Wait 5 seconds to make sure changes are committed
                        if (App.isProd()) {
                            await Wait(5000);
                        }

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
                        return false;
                    } else {
                        // FIXME: Why doesn't reuturn false/true work?
                        // Remove checkIfSaved before closing
                        $(modal.get()).off('hide.bs.modal', checkIfSaved);
                        modal.close();
                        
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
// @END-File
