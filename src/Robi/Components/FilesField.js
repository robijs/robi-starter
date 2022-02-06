import { Component } from '../Actions/Component.js'
import { Alert } from '../Components/Alert.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function FilesField(param) {
    const {
        allowDelete,
        beforeChange,
        description,
        itemId,
        width,
        library,
        multiple,
        onUndo,
        onUpload,
        onChange,
        padding,
        margin,
        parent,
        position
    } = param;

    let {
        files
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                ${description ? /*html*/ `<div class="form-field-description text-muted">${description}</div>` : ''}
                <div class='files-list'>
                    <input type='file' style='display: none;' id='drop-zone-files' ${multiple !== false ? 'multiple' : ''}>
                    <div class='drop-zone'>
                        <!-- Hidden files input -->
                        <div class='files-list-container'>
                            ${renderFiles()}
                        </div>
                        ${
                            multiple !== false ?
                            /*html*/ `
                                <div class='count-undo-container'>
                                    <div class='count-container'>
                                        <span class='count'>${files?.length || 0}</span>
                                        <span>${files?.length === 1 ? 'file' : 'files'}</span>
                                        <span class='pending-count hidden'></span>
                                    </div>
                                    <!-- <span class='undo-all'>Delete all</span> -->
                                </div>
                            ` : ''
                        }
                    </div>
                </div>
                <button type='button' class='clear btn btn-robi-light ${files?.length === 0 || allowDelete === false ? 'd-none' : ''}' style='position: absolute; bottom: -20px; right: 0px;'>Clear</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: ${width || '100%'};
                min-width: 350px;
                position: relative;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom: 0.5rem;
            }

            #id .files-list {
                width: ${width || '100%'};
                border-radius: 20px;
                background: var(--background);
                transition: all 300ms ease-in-out;
            }

            /* Drag */
            #id .drag-over {
                position: relative;
                background: rgba(${App.get('primaryColorRGB')}, .15);
            }

            /* Hidden */
            #id .hidden {
                display: none !important;
            }

            #id .count-undo-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin: 5px 0px;
                min-height: 20px;
            }

            #id .count-container {
                font-weight: 500;
                padding-left: 15px;
                font-size: 14px;
            }

            /* Remove all */
            #id .undo-all {
                cursor: pointer;
                background: crimson;
                border-radius: 4px;
                background: crimson;
                color: white;
                padding: 2px 4px;
                font-size: 10px;
                font-weight: 500;
            }

            /* File Drop Zone */
            #id .drop-zone {
                min-height: 136.75px;
                position: relative;
                transition: all 150ms;
                margin: ${margin || '10px'};
                padding: ${padding || '40px'};
                border-radius: 20px;
            }

            #id .drop-zone-button-container {
                font-size: 14px;
            }

            #id .drop-zone-button { 
                cursor: pointer;
                display: inline-block;
                padding: 5px 10px;
                background: var(--primary);
                color: white;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
            }

            #id .files-list-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            #id .files-list-container .file-preview:not(:first-child) {
                margin-top: 10px;
            }

            #id .files-list-container .file-preview:last-child {
                margin-bottom: 5px;
            }

            #id .file-icon-container {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                ${itemId ? 'cursor: pointer;' : ''}
            }

            #id .file-name-container {
                width: 100%;
                display: flex;
                flex-direction: column;
            }

            #id .file-icon {
                display: flex;
            }

            #id .remove-container {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                min-width: 105px;
            }

            #id .remove-container .remove-icon {
                display: flex;
                cursor: pointer;
            }
            
            #id .removed {
                transform: scale(0);
                display: none;
            }

            /* Light 

            #id .file-preview {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                background: #595E68;
                transition: all 200ms;
            }

            #id .drag-over {
                background: white;
            }

            #id .file-preview-name {
                font-weight: 500;
                margin: 0px 5px;
                color: white;
                font-size: 13px;
            }

            #id .file-size {
                font-weight: 400;
                margin: 0px 5px;
                color: white;
                font-size: 11px;
            }

            #id .file-icon .type {
                font-size: 1.5em;
                stroke: white;
                fill: white;
            }

            #id .icon.remove {
                cursor: pointer;
                font-size: 1.2em;
                stroke: white;
                fill: white;
            }

            */

            /* Dark */
            #id .file-preview {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 9px 12px;
                /* padding: 9px 0px; */
                border-radius: 15px;
                background: var(--secondary);
                transition: all 200ms;
            }

            #id .file-preview-name {
                font-weight: 500;
                margin: 0px 20px 0px 5px;
                font-size: 12px;
            }

            #id .file-size {
                font-weight: 400;
                margin: 0px 20px 0px 5px;
                font-size: 10.5px;
                color: gray;
            }

            /** Icons */

            #id .file-icon .type {
                font-size: 1.5em;
                fill: var(--color);
            }

            #id .file-icon .bs-file-earmark-word {
                fill: #2B579A;
            }

            #id .file-icon .bs-file-earmark-ppt {
                fill: #B7472A;
            }

            #id .file-icon .bs-file-earmark-excel {
                fill: #217346;
            }

            #id .file-icon .bs-file-earmark-pdf {
                fill: #B30B00;
            }

            #id .file-icon .bs-file-earmark {
                fill: var(--color);
            }

            #id .remove-label {
                display: flex;
                flex-direction: column;
                margin-right: 10px;
            }

            #id .remove-label .status {
                text-align: right;
                font-size: 12px;
                white-space: nowrap;
            }

            #id .remove-label .tip {
                text-align: right;
                font-size: 10px;
            }

            #id .remove-icon {
                min-width: 26px;
            }

            #id .icon {
                font-size: 22px;
            }

            #id .icon.remove {
                fill: var(--primary);
            }

            #id .icon.undo {
                fill: mediumseagreen;
            }

            /** Spinner */
            .spinner {
                text-align: center;
            }
            
            .spinner > div {
                width: 10px;
                height: 10px;
                background-color: white;
                border-radius: 100%;
                display: inline-block;
                -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                animation: sk-bouncedelay 1.4s infinite ease-in-out both;
            }
            
            .spinner .bounce1 {
                -webkit-animation-delay: -0.32s;
                animation-delay: -0.32s;
            }
            
            .spinner .bounce2 {
                -webkit-animation-delay: -0.16s;
                animation-delay: -0.16s;
            }
            
            @-webkit-keyframes sk-bouncedelay {
                0%, 80%, 100% { -webkit-transform: scale(0) }
                40% { -webkit-transform: scale(1.0) }
            }
            
            @keyframes sk-bouncedelay {
                0%, 80%, 100% { 
                    -webkit-transform: scale(0);
                    transform: scale(0);
                } 40% { 
                    -webkit-transform: scale(1.0);
                    transform: scale(1.0);
                }
            }

            /* https://codepen.io/sdras/pen/aOgMON */
            #id .shake {
                animation: shake 820ms cubic-bezier(.36,.07,.19,.97) both;
            }

            /* Shake */
            @keyframes shake {
                10%, 90% {
                  transform: translate3d(-1px, 0, 0);
                }
                
                20%, 80% {
                  transform: translate3d(2px, 0, 0);
                }
              
                30%, 50%, 70% {
                  transform: translate3d(-4px, 0, 0);
                }
              
                40%, 60% {
                  transform: translate3d(4px, 0, 0);
                }
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .drop-zone',
                event: 'dragover drop',
                listener: preventFileOpen
            },
            {
                selector: '#id .drop-zone',
                event: 'dragover dragenter',
                listener: addDragAndDropClass
            },
            {
                selector: '#id .drop-zone',
                event: 'dragleave dragend dragexit drop',
                listener: removeDragAndDropClass
            },
            {
                selector: '#id .drop-zone',
                event: 'drop',
                listener: drop
            },
            {
                selector: '.remove-container:not(.delete-on-remove)',
                event: 'click',
                listener: removeFilePreview
            },
            {
                selector: '.remove-container.delete-on-remove .remove-icon',
                event: 'click',
                listener(event) {
                    component.delete(event);
                }
            },
            {
                selector: `input[type='file']`,
                event: 'change',
                listener(event) {
                    renderFiles(event.target.files);
                }
            },
            {
                selector: `#id .file-name-container`,
                event: 'click',
                listener() {
                    const name = files.find(file => file.name = this.dataset.filename).name;
                    const link = `${App.get('site')}/${library}/${name}`;

                    console.log('Open file:', link);

                    window.open(link);
                }
            },
            {
                selector: `#id .clear`,
                event: 'click',
                listener() {
                    files = [];

                    component.find('.files-list-container').innerHTML = '';

                    event.target.classList.add('d-none');
                }
            }
        ]
    });

    // Drag and drop
    function preventFileOpen(event) {
        event.preventDefault();

        return false;
    }

    function togglePointerEvents(value) {
        const dropZone = component.find('.drop-zone');

        [...dropZone.children].forEach(child => {
            child.style.pointerEvents = value;
        });
    }

    function addDragAndDropClass(event) {
        togglePointerEvents('none');

        // event.target.classList.add('drag-over');
        component.find('.files-list').classList.add('drag-over');
    }

    function removeDragAndDropClass(event) {
        togglePointerEvents('unset');

        // event.target.classList.remove('drag-over');
        component.find('.files-list').classList.remove('drag-over');
    }

    function drop(event) {
        let canAdd = true;

        if (beforeChange) {
            canAdd = beforeChange([...event.dataTransfer.files])
        }

        console.log(canAdd);

        if (canAdd) {
            addFiles(event.dataTransfer.files);
        }
    }

    // Files
    function addFiles(fileList) {
        console.log(multiple, fileList.length);
        
        if (multiple === false) {
            files = [];
    
            component.find('.files-list-container').innerHTML = '';

            if (fileList.length > 1) {
                component.find('.files-list').classList.add('shake');
    
                setTimeout(() => {
                    const message = Alert({
                        type: 'robi-reverse',
                        text: `Only one file can be uploaded at a time`,
                        classes: ['alert-in', 'shadow', 'w-100'],
                        top: component.get().offsetHeight - 5,
                        delay: 3000,
                        parent: component
                    });
        
                    message.add();
    
                    setTimeout(() => {
                        message.remove();
                    }, 3400);
                }, 410);
    
                setTimeout(() => {
                    component.find('.files-list').classList.remove('shake');
                }, 820);
    
                return;
            }
        }

        // Use DataTransferItemList interface to access the file(s)
        const newFiles = [...fileList]
        .filter(file => {
            const { name } = file;
            const exists = files.find(file => file.name === name);

            if (!exists) {
                return file;
            } else {
                console.log('Toast: File already added/uploaded.');

                const message = Alert({
                    type: 'danger',
                    text: `File already added`,
                    classes: ['alert-in', 'w-100'],
                    top: component.get().offsetHeight - 5,
                    parent: component
                });

                message.add();

                setTimeout(() => {
                    message.remove();
                }, 3000);
            } 
        })
        .map(file => {
            addPreview(file);

            // If item already created, upload right away
            if (itemId) {
                onUpload(file);
            }

            return file;
        });

        files = files.concat(newFiles);

        if (onChange) {
            onChange(files);
        }

        if (multiple !== false) {
            if (newFiles.length) {
                if (fileList.length) {
                    component.find('.pending-count').innerText = `(${fileList.length} pending)`;
                    component.find('.pending-count').classList.remove('hidden');
                } 
            } else {
                console.log('Toast: no new files added.');
            }
        }

        toggleClearButton();
    }

    function toggleClearButton() {
        if (files?.length) {
            component.find('.clear').classList.remove('d-none');
        } else {
            component.find('.clear').classList.add('d-none');
        }
    }

    function returnFileSize(number) {
        if (number < 1024) {
            return number + ' bytes';
        } else if (number >= 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + ' KB';
        } else if (number >= 1048576) {
            return (number / 1048576).toFixed(1) + ' MB';
        }
    }

    function addPreview(file) {
        component.find('.files-list-container').insertAdjacentHTML('beforeend', fileTemplate(file));

        // Add remove file preview event listener
        component.find(`.remove-container[data-filename='${file.name}']`).addEventListener('click', removeFilePreview);
    }

    function renderFiles() {
        return files ? files.map(file => fileTemplate(file)).join('\n') : '';
    }

    function fileTemplate(file) {
        const {
            name, size, created, author, uri
        } = file;

        const ext = name.split('.').pop();
        const icon = selectIcon(ext);

        console.log('allow delete', allowDelete);

        // TODO: add event listener for deleting items that have already been uploaded
        return /*html*/ `
            <div class='file-preview' data-filename='${name}'>
                <div class='file-icon-container'>
                    <div class='file-icon'>
                        <svg class='icon type ${icon}'><use href='#icon-${icon}'></use></svg>
                    </div>
                    <div class='file-name-container' data-filename='${name}'>
                        <div class='file-preview-name'>${name}</div>
                        <div class='file-size'>${returnFileSize(size)}</div>
                    </div>
                </div>
                <div class='remove-container ${created && allowDelete !== false ? 'delete-on-remove' : ''}' data-filename='${name}'>
                    ${
                        allowDelete !== false ?
                        /*html*/ `
                            <div class='remove-label'>
                                <div class='status'>${created ? `Added on ${new Date(created).toLocaleDateString()} By ${author.split(' ').slice(0, 2).join(' ')}` : 'Pending'}</div>
                                <div class='tip'>${created ? `${'ontouchstart' in window ? 'tap' : 'click'} to delete` : `remove`}</div>
                            </div>
                            <div class='remove-icon'>
                                <svg class='icon remove'><use href='#icon-bs-${created ? 'x-circle-fill' : 'dash-circle-fill'}'></use></svg>
                            </div>
                        ` : ''
                    }
                </div>
            </div>
        `;
    }

    // Remove file node
    function removeFilePreview(event) {
        const fileName = this.dataset.filename;
        const file = files.find(file => file.name === fileName);
        const index = files.indexOf(file);

        console.log(fileName, file, files, index);

        files.splice(index, 1);

        if (onChange) {
            onChange(files);
        }

        if (multiple !== false) {
            if (!files.length) {
                component.find('.pending-count').classList.remove('hidden');
                component.find('.pending-count').innerText = '';
            } else {
                component.find('.pending-count').innerText = `(${files.length} pending)`;
            }
        }

        this.closest('.file-preview').classList.add('removed');

        setTimeout(() => {
            this.closest('.file-preview').remove();
        }, 150);

        toggleClearButton();
    }

    function selectIcon(ext) {
        switch (ext) {
            case 'doc':
            case 'docx':
                return 'bs-file-earmark-word';
            case 'ppt':
            case 'pptx':
            case 'pptm':
                return 'bs-file-earmark-ppt';
            case 'xls':
            case 'xlsx':
            case 'xltx':
            case 'xlsm':
            case 'xltm':
                return 'bs-file-earmark-excel';
            case 'pdf':
                return 'bs-file-earmark-pdf';
            default:
                return 'bs-file-earmark';
        }
    }

    component.delete = async (event) => {
        const container = event.target.closest('.remove-container');
        const file = files.find(file => file.name === container.dataset.filename);
        const name = file.name;
        const index = files.indexOf(file);

        console.log(name, file, files, index);

        files.splice(index, 1);

        if (onChange) {
            onChange(files);
        }

        const countContainer = component.find('.count-container');
        
        if (countContainer) {
            countContainer.innerHTML = /*html*/ `
                <div class="count-container">
                    <span class="count">${files.length}</span>
                    <span>${files.length === 1 ? 'file' : 'files'}</span>
                    <span class="pending-count hidden"></span>
                </div>
            `;
        }

        container.closest('.file-preview').classList.add('removed');

        setTimeout(() => {
            container.closest('.file-preview').remove();
        }, 150);

        const digest = await GetRequestDigest();
        const response = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${library}')/Files('${name}')`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest,
                'If-Match': '*'
            }
        });

        console.log(response);

        toggleClearButton();
    };

    component.upload = () => {
        files.forEach(file => {
            onUpload(file);
        });
    };

    return component;
}
// @END-File
