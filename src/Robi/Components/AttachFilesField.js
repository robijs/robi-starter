import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function AttachFilesField(param) {
    const {
        parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <!-- Attachments -->
            <div class='form-field-row'>
                <div class='form-field-label'>Supporting documents</div>
                <!-- Hidden file input -->
                <input type='file' multiple style='display: none;' id='drop-zone-files'>
                <!-- File Drop Zone UI -->
                <div class='drop-zone'>
                    <div class='drop-zone-preview-container'>
                        <svg class="icon"><use href="#icon-drawer2"></use></svg>
                    </div>
                    <span class='drop-zone-button-container'>
                        <span class='drop-zone-button'>Choose files</span>
                        <span class='drag-message'>or drag them here</span>
                    </span>
                </div>
            </div>
        `,
        style: /*css*/ `
        /* Rows */
            .form-field-row {
                margin-bottom: 20px;
            }

            /* Labels */
            .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px;
            }

            /* File Drop Zone */
            .drop-zone {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-evenly;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
                min-height: 200px;
                border-radius: 4px;
                border: solid 2px var(--color);
            }

            .drop-zone-button-container { 
                height: 30%;
            }

            .drop-zone-button { 
                cursor: pointer;
                display: inline-block;
                padding: 5px 10px;
                background: var(--primary);
                color: white;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
            }

            .drop-zone-preview-container {
                display: flex;
                flex-direction: row;
                justify-content: center;
            }

            .drag-over {
                background: white;
                border: solid 2px var(--primary);
            }

            .drop-zone-preview-container .icon {
                font-size: 4.5em;
                stroke: var(--color);
                fill: var(--color);
            }

            .file-preview {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .file-preview-name {
                text-align: center;
                width: 115px;
                margin-bottom: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .file-preview-remove {
                cursor: pointer;
                font-size: .7em;
                padding: 1px 3px;
                background: crimson;
                color: white;
                border-radius: 4px;
                border: solid 1px var(--border-color);
            }

            .file-icon {
                position: relative;
            }

            .file-icon .page {
                font-size: 4em;
            }

            .file-icon .type {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                font-size: 1.5em;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '.drop-zone',
                event: 'dragover drop',
                listener: preventFileOpen
            },
            {
                selector: '.drop-zone',
                event: 'dragover dragenter',
                listener: addDragAndDropClass
            },
            {
                selector: '.drop-zone',
                event: 'dragleave dragend dragexit drop',
                listener: removeDragAndDropClass
            },
            {
                selector: '.drop-zone',
                event: 'drop',
                listener: drop
            },
            {
                selector: '.drop-zone-button',
                event: 'click',
                listener(event) {
                    const fileInput = component.find(`input[type='file']`);

                    fileInput.click();
                }
            },
            {
                selector: `input[type='file']`,
                event: 'change',
                listener(event) {
                    addFiles(event.target.files);
                }
            }
        ]
    });

    /**
     * File upload preview
     */
    function updateFilePreview() {
        var input = component.find('#file_uploads');

        var curFiles = input.files;

        if (curFiles.length === 0) {
            preview.innerHTML = 'No files currently selected for upload';
        } else {
            var html = '<table style="border-collapse: collapse; border-spacing: 0px;">';

            for (var i = 0; i < curFiles.length; i++) {
                html += '<tr>' +
                    '<th style="text-align: left; border-bottom: solid 1px gray; padding: 4px">' + curFiles[i].name + '</th>' +
                    '<td style="text-align: right; border-bottom: solid 1px gray; padding: 4px">' + returnFileSize(curFiles[i].size) + '</td>' +
                    '</tr>';
            }

            html += '</table>';

            preview.innerHTML = html;
        }
    }

    function returnFileSize(number) {
        if (number < 1024) {
            return number + 'bytes';
        } else if (number >= 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + 'KB';
        } else if (number >= 1048576) {
            return (number / 1048576).toFixed(1) + 'MB';
        }
    }

    /**
     * Drag and Drop
     */
    function preventFileOpen(event) {
        console.log(event);
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
        console.log(event);
        togglePointerEvents('none');

        event.target.classList.add('drag-over');
    }

    function removeDragAndDropClass(event) {
        togglePointerEvents('unset');

        event.target.classList.remove('drag-over');
    }

    /**
     * Attach Files
     */
    let files = [];

    function drop(event) {
        addFiles(event.dataTransfer.files);
    }

    function addFiles(fileList) {
        // Use DataTransferItemList interface to access the file(s)
        [...fileList].forEach(file => {
            const alreadyDropped = files.find(droppedFile => droppedFile.name === file.name);

            if (!alreadyDropped) {
                files.push(file);
            } else {
                console.log('File already added!');
            }
        });

        updateFilePreview();
    }

    function updateFilePreview() {
        let html = '';

        files.forEach(file => {
            const ext = file.name.split('.').pop();

            html += /*html*/ `
                <div class='file-preview' draggable='true'>
                    <div class='file-icon'>
                        <svg class='icon page'><use href='#icon-file-empty'></use></svg>
                        <svg class='icon type'><use href='#icon-${selectIcon(ext)}'></use></svg>
                    </div>
                    <div class='file-preview-name'>${file.name}</div>
                    <span class='file-preview-remove'>Remove</span>
                </div>
            `;
        });

        const previewContainer = component.find('.drop-zone-preview-container');

        previewContainer.innerHTML = html;

        const icons = component.findAll('.file-preview');

        icons.forEach(icon => {
            const removeButton = icon.querySelector('.file-preview-remove');

            removeButton.addEventListener('click', removeFilePreview);

            // icon.addEventListener('dragstart', event => {
            //     event.dataTransfer.setData('text/plain', 'This node may be dragged');
            //     event.dataTransfer.effectAllowed = 'move';
            // });
            // window.addEventListener('dragover', event => {
            //     event.preventDefault();
            //     event.dataTransfer.dropEffect = 'move'
            //     togglePointerEvents('none');
            // });
        });
    }

    function removeFilePreview(event) {
        const fileName = this.previousElementSibling.innerText;
        const file = files.find(file => file.name === fileName);
        const index = files.indexOf(file);

        files.splice(index, 1);

        this.closest('.file-preview').remove();
    }

    function selectIcon(ext) {
        switch (ext) {
            case 'doc':
            case 'docx':
                return 'microsoftword';
            case 'ppt':
            case 'pptx':
            case 'pptm':
                return 'microsoftpowerpoint';
            case 'xls':
            case 'xlsx':
            case 'xltx':
            case 'xlsm':
            case 'xltm':
                return 'microsoftexcel';
            case 'pdf':
                return 'adobeacrobatreader';
            default:
                return 'file-text2';
        }
    }

    component.getFieldData = () => {
    };

    return component;
}
// @END-File
