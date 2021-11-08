import { AddStyle, AttachFiles, Component, CreateItem, CreateList, DeleteAttachments, DeleteItem, DeleteList, Get, GetAppSetting, GetADUsers, GetSiteUsers, GetWebLists, Route } from './Actions.js'
import { App } from '../Core/Settings.js'
import { Lists } from './Models.js';
import Store from './Store.js'
import lists from '../lists.js';

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Alert(param) {
    const {
        text,
        close,
        margin,
        width,
        parent,
        position
    } = param;

    let {
        type
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='alert alert-${type}' role='alert'${margin ? ` style='margin: ${margin};'` : ''}>
                ${text}
                ${close ?
                    /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''
            }
            </div>
        `,
        style: /*css*/ `
            #id {
                font-size: 14px;
                border-radius: 10px;
                border: none;
            }
            
            #id *:not(button) {
                color: inherit;
            }

            #id.alert-blank {
                padding: 0px;    
            }
            
            ${width ?
                /*css*/ `
                    #id {
                        width: ${width};
                    }
                ` :
                ''
            }
        `,
        parent,
        position
    });

    component.update = (param) => {
        const {
            type: newType,
            text: newText
        } = param;

        const alert = component.get();

        if (type) {
            alert.classList.remove(`alert-${type}`);
            alert.classList.add(`alert-${newType}`);

            type = newType;
        }

        if (text) {
            alert.innerHTML = newText;
        }
    }

    return component;
}

/**
 * 
 * @returns 
 */
export function AppContainer() {
    const component = Component({
        html: /*html*/ `
            <div class='appcontainer'></div>
        `,
        style: /*css*/ `
            .appcontainer {
                display: none;
            }

            *, html {
                font-family: ${App.fontFamily || ` -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`};
                box-sizing: border-box;
                color: ${App.get('primaryColor')};
            }
            
            body {
                padding: 0px;
                margin: 0px;
                box-sizing: border-box;
                background: ${App.get('secondaryColor')};
                overflow: hidden;
            }
            
            body::-webkit-scrollbar { 
                display: none; 
            }
            
            ::-webkit-scrollbar {
                width: 15px;
                height: 10px;
            }
            
            ::-webkit-scrollbar-track {
                background: inherit;
            }
            
            ::-webkit-scrollbar-thumb {
                background: gray;
                width: 8px;
                height: 8px;
                border: 3px solid transparent;
                border-radius: 8px;
                background-clip: content-box;
            }
            
            table {
                border-collapse: collapse;
            }
            
            /* Stop Chrome from changing input background color when autocomplete enabled */
            input:-webkit-autofill,
            input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus, 
            input:-webkit-autofill:active  {
                box-shadow: 0 0 0 30px white inset !important;
            }
            
            .highlight {
                background: #fff3d4 !important;
                border-right: solid 3px #f6b73c !important;
            }
            
            .smooth-tranisition {
                transition: all 300ms ease-in-out;
            }

            .icon {
                display: inline-block;
                width: 1em;
                height: 1em;
                stroke-width: 0;
                stroke: ${App.get('secondaryColor')};
                fill: ${App.get('secondaryColor')};
            }

            /** Wait */
            .appcontainer.wait,
            .appcontainer.wait * {
                pointer-events: none;
                cursor: wait !important;
            }

            /* Override default Bootstrap Alert */
            #id .alert {
                font-size: 14px;
                border-radius: 10px;
                border: none;
            }
            
            @keyframes fade-in-bottom {
                0% {
                    bottom: -10px;
                    transform: scale(.5);
                    opacity: 0;
                }
            
                100% {
                    bottom: 10px;
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `,
        position: 'afterbegin',
        events: []
    });

    component.wait = (value) => {
        if (value) {
            component.get().classList.add('wait');
        } else {
            component.get().classList.remove('wait');
        }
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function AttachFilesButton(param) {
    const {
        value,
        list,
        id,
        margin,
        onAdd,
        parent,
        action
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='attach-files'>
                <div class='attach-files-button'>${value}</div>
                <!-- Hidden file input -->
                <input type='file' multiple style='display: none;' id='drop-zone-files'>
            </div>
        `,
        style: /*css*/ `
            #id .attach-files-button {
                cursor: pointer;
                margin: ${margin || '0px 20px 0px 0px'};
                padding: 5px 10px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
                color: ${App.get('secondaryColor')};
                background: mediumseagreen;
                border: solid 2px seagreen;
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '#id .attach-files-button',
                event: 'click',
                listener(event) {
                    const fileInput = component.find(`input[type='file']`);

                    if (fileInput) {
                        fileInput.click();
                    }
                }
            },
            {
                selector: `#id input[type='file']`,
                event: 'change',
                async listener(event) {
                    const files = event.target.files;
                    if (files.length > 0) {
                        const attachedFiles = await AttachFiles({
                            list,
                            id,
                            files
                        });

                        if (onAdd) {
                            onAdd(attachedFiles);
                        }
                    }
                }
            }
        ]
    });

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function AttachFilesField(param) {
    const {
        parent,
        position
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
                border: solid 2px ${App.get('defaultColor')};
            }

            .drop-zone-button-container { 
                height: 30%;
            }

            .drop-zone-button { 
                cursor: pointer;
                display: inline-block;
                padding: 5px 10px;
                background: ${App.get('primaryColor')};
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
                border: solid 2px ${App.get('primaryColor')};
            }

            .drop-zone-preview-container .icon {
                font-size: 4.5em;
                stroke: ${App.get('defaultColor')};
                fill: ${App.get('defaultColor')};
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
                border:  ${App.get('defaultBorder')};
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
                    addFiles(event.target.files)
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

    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Attachments(param) {
    const {
        attachments,
        list,
        itemId,
        label,
        labelWeight,
        labelSize,
        parent,
        position,
        onDelete
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='attachments'>
                ${label ? /*html*/ `<div class='attachments-label'>${label}</div>` : ''}
                <div class='attachments-links-container'>
                    ${addLinks()}
                </div>
            </div>
        `,
        style: /*css*/ `
            .attachments-label {
                font-size: ${labelSize || '1.1em'};
                font-weight: ${labelWeight || 'bold'};
                padding-bottom: 5px;
            }

            #id .attachment-row {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            }

            #id .remove-row {
                cursor: pointer;
                padding: 2px 4px;
                margin-left: 5px;
                /* margin-left: 20px; */
                /* background: firebrick;
                color: white; */
                color: darkslategray;
                border-radius: 4px;
                /* font-size: .8em; */
                font-size: 1.5em;
                line-height: 0;
            }

            /** Icons */
            .file-icon {
                display: inline-block;
                position: relative;
                margin-right: 5px;
            }

            .file-icon .page {
                font-size: 2em;
                stroke: ${App.defaultColor};
                fill: ${App.defaultColor}
            }

            .file-icon .type {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                font-size: 1em;
            }
            
            /** None */
            #id .none {
                font-size: 1em;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .remove-row',
                event: 'click',
                listener: removeRow
            }
        ]
    });

    function addLinks() {
        let html = '';

        if (attachments.length > 0) {
            attachments.forEach(file => {
                html += linkTemplate(file);
            });
        } else {
            html += /*html*/ `
                <div class='none'>None</div>
            `
        }

        return html;
    }

    function linkTemplate(file) {
        const ext = file.FileName.split('.').pop();

        // console.log(file);

        return /*html*/ `
            <div class='attachment-row' data-uri='${file.__metadata.uri}' data-name='${file.FileName}'>
                <div class='file-icon'>
                    <svg class='icon page'><use href='#icon-file-empty'></use></svg>
                    <svg class='icon type'><use href='#icon-${selectIcon(ext)}'></use></svg>
                </div>
                <span>
                    <a href='${file.ServerRelativeUrl}' target='_blank'>${file.FileName}</a>
                </span>
                <span class='remove-row'>&times;</span>
            </div>
        `;
    }

    function selectIcon(ext) {
        switch (ext.toLowerCase()) {
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

    async function removeRow(event) {
        const row = event.target.closest('.attachment-row');
        const check = confirm(`Are you sure you want to delete '${row.dataset.name}'?`);

        if (check) {
            await DeleteAttachments({
                list,
                itemId,
                fileNames: [
                    row.dataset.name
                ]
            });

            row.remove();

            const rows = component.findAll('.attachment-row');

            if (rows.length === 0) {
                component.find('.attachments-links-container').innerHTML = /*html*/ `<div class='none'>None</div>`;
            }

            if (onDelete) {
                onDelete()
            }
        }
    }

    /** 
     * This is the eager way to do it.
     *
     * @todo check if file already present
     */
    component.refresh = (attachments) => {
        /** Set HTML */
        if (attachments.length > 0) {
            component.find('.attachments-links-container').innerHTML = attachments.map(file => linkTemplate(file)).join('\n');
        }

        /** Add event listeners */
        component.findAll('.remove-row').forEach(item => {
            item.addEventListener('click', removeRow);
        });
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Banner(param) {
    const {
        text,
        fixed,
        parent,
        position,
        type
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='banner ${fixed ? 'fixed' : 'normal'} ${type || ''}'>${text}</div>
        `,
        style: /*css*/ `
            #id.banner {
                cursor: default;
                font-size: 1.5em;
                border-radius: 4px;
                /* border: ${App.get('defaultBorder')}; */
            }

            #id.fixed {
                background: lightyellow;
                border-left: solid 4px gold;
                position: fixed;
                top: 5px;
                right: 15px;
                padding: 5px;
            }

            #id.normal {
                display: inline-block;
                background: white;
                border-left: solid 10px ${App.get('primaryColor')};
                margin: 20px 0px;
                padding: 10px;
            }

            #id.info {
                background: linen;
                border-left: solid 10px orange;
            }

            #id.good {
                background: lightgreen;
                border-left: solid 10px mediumseagreen;
            }
        `,
        parent,
        position
    });

    return component;
}

/**
 * {@link https://getbootstrap.com/docs/4.5/components/buttons/}
 * 
 * @example btn-primary
 * @example btn-secondary
 * @example btn-success
 * @example btn-danger
 * @example btn-warning
 * @example btn-info
 * @example btn-light
 * @example btn-dark
 * 
 * @example btn-outline-primary
 * @example btn-outline-secondary
 * @example btn-outline-success
 * @example btn-outline-danger
 * @example btn-outline-warning
 * @example btn-outline-info
 * @example btn-outline-light
 * @example btn-outline-dark
 * 
 * @param {Object} param 
 * @returns 
 */
export function BootstrapButton(param) {
    const {
        action,
        parent,
        position,
        classes,
        margin,
        type,
        value
    } = param;

    const component = Component({
        html: /*html*/ `
            <button type="button" class="btn btn-${type} ${classes?.join(' ')}">${value}</button>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || ''};
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id`,
                event: 'click',
                listener: action
            }
        ]
    });

    component.enable = () => {
        component.get().disabled = true;
    }

    component.disable = () => {
        component.get().disabled = false;
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function BootstrapDropdown(param) {
    const {
        action,
        label,
        parent,
        position,
        options,
        value,
        margin,
        padding
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <label>${label}</label>
                <div class='dropdown'>
                    <button class='btn dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                        ${value}
                    </button>
                    <div class='dropdown-menu hidden' aria-labelledby='dropdownMenuButton'>
                        ${buildDropdown(options)}
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px 0px 20px 0px'};
                padding: ${padding || '0px'};
            }

            #id label {
                font-size: .95em;
                font-weight: bold;
                padding: 3px 0px;
            }

            #id .dropdown-toggle {
                font-size: .95em;
                border-radius: 0.25rem;
                border: 1px solid #ced4da;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #id .dropdown-item {
                font-size: .95em;
                cursor: pointer;
            }

            #id .hidden {
                display: block;
                visibility: hidden;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener(event) {
                    component.find('.dropdown-toggle').innerText = event.target.innerText;

                    if (action) {
                        action(event);
                    }
                }
            }
        ],
        onAdd() {
            // FIXME: Why does this work?
            setTimeout(() => {
                component.find('.dropdown-toggle').style.width = `${component.find('.dropdown-menu').offsetWidth}px`;
                component.find('.dropdown-menu').classList.remove('hidden');
            }, 200);
        }
    });

    function buildDropdown(items) {
        return items
        .map(dropdown => dropdownTemplate(dropdown))
        .join('\n');
    }

    function dropdownTemplate(dropdown) {
        const {
            label,
            path
        } = dropdown;

        return /*html*/ `
            <div class='dropdown-item' data-path='${path || ''}'>${label}</div>
        `;
    }

    component.setDropdownMenu = (list) => {
        component.find('.dropdown-menu').innerHTML = buildDropdown(list);

        component.findAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', action);
        });
    }

    component.value = (param) => {
        const field = component.find('.dropdown-toggle');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Button(param) {
    const {
        type,
        value,
        display,
        margin,
        parent,
        action,
        disabled,
        width
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-button ${type}-button ${disabled ? 'disabled' : ''}'>${value}</div>
        `,
        style: /*css*/ `
            #id.form-button {
                cursor: pointer;
                display: ${display || 'inline-block'};
                margin: ${margin || '0px 20px 0px 0px'};
                padding: 5px 10px;
                font-size: .9em;
                font-weight: 400;
                text-align: center;
                white-space: nowrap;
                border-radius: .25rem;
                width: ${width || 'fit-content'};
            }

            #id.disabled {
                pointer-events: none;
                filter: opacity(0.75);
            }

            #id.normal-button {
                color: white;
                background: rgba(${App.get('primaryColorRGB')}, .9);
                border: solid 1px transparent;
            }

            #id.back-button,
            #id.hollow-button,
            #id.cancel-button {
                color: rgba(${App.get('primaryColorRGB')}, .9);
                background: transparent;
                border: solid 1px rgba(${App.get('primaryColorRGB')}, .9);
            }

            #id.create-button,
            #id.update-button {
                color: white;
                background: mediumseagreen;
                border: solid 2px seagreen;
            }

            #id.create-button *,
            #id.update-button * {
                color: white;
            }

            #id.stop-button {
                color: white;
                background: crimson;
                border: solid 2px firebrick;
            }

            #id.delete-button {
                color: firebrick;
                text-decoration: underline;
                font-size: .9em;
            }

            /* .delete-button {
                color: white;
                background: firebrick;
                border: solid 2px firebrick;
                box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);
            } */
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '#id.form-button',
                event: 'click',
                listener(event) {
                    if (!event.target.classList.contains('disabled')) {
                        action(event);
                    } else {
                        console.log(event.target, '\tis disbaled');
                    }
                }
            }
        ]
    });

    component.setValue = (html) => {
        component.get().innerHTML = html;

        return component
    }

    component.disable = () => {
        component.get().classList.add('disabled');

        return component
    }

    component.enable = () => {
        component.get().classList.remove('disabled');

        return component
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Card(param) {
    const {
        title,
        fontSize,
        description,
        titleColor,
        titleWeight,
        titleBorder,
        titleBackground,
        background,
        padding,
        margin,
        minWidth,
        parent,
        width,
        position,
        action
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='round-card'>
                ${title ? /*html*/ `<div class='round-card-title'>${title}</div>` : ''}
                ${description ? /*html*/ `<div class='mt-2 round-card-description'>${description}</div>` : ''}
            </div>
        `,
        style: /*css*/ `
            #id.round-card {
                display: inline-flex;
                flex-direction: column;
                background: ${background || 'white'};
                padding: ${padding || '20px'};
                margin: ${margin || '0px'};
                min-width: ${minWidth || 'initial'};
                width: ${width || 'initial'};
                border-radius: 10px;
                /* border: ${App.get('defaultBorder')}; */
                border: none;
                cursor: ${action ? 'pointer' : 'initial'};
            }

            #id .round-card-title {
                font-size: 1em;
                margin: ${padding === '0px' ? `0px` : '-20px -20px 0px -20px'}; /** FIXME: will break with passed in padding  */
                padding: 10px 20px; /** FIXME: will break with passed in padding  */
                font-weight: ${titleWeight || '700'};
                background: ${titleBackground || 'white'}; /** FIXME: Experimental */ /* alternate color: #d0d0d04d */
                border-radius: 10px 10px 0px 0px;
                color: ${titleColor || App.get('defaultColor')};
                border-bottom: ${App.get('defaultBorder')};
            }

            #id .round-card-description {
                
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener: (event) => {
                    if (action) {
                        action(event);
                    }
                }
            }
        ]
    });

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Comments(param) {
    const {
        comments,
        parent,
        position,
        width,
        parentId
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='comments-container'>
                <!-- Border -->
                <div class='comments-border'>
                    <div class='comments-border-count-container'>
                        <div class='comments-border-count'>
                            <span>${comments.length}</span>
                        </div>
                    </div>
                    <div class='comments-border-name'>
                        <div>${comments.length > 1 || comments.length === 0 ? 'Comments' : 'Comment'}</div>
                    </div>
                    <div class='comments-border-line-container'>
                        <div class='comments-border-line'></div>
                    </div>
                </div>
                <!-- Comments -->
                <div class='comments'>
                    <div class='reverse'>
                        ${createCommentsHTML()}
                    </div>
                </div>
                <!-- New Comment -->
                <div class='new-comment-container'>
                    <div class='new-comment' contenteditable='true'></div>
                    <!-- Button -->
                    <div class='new-comment-button-container'>
                        <div class='new-comment-button'>
                            <svg class='icon'>
                                <use href='#icon-arrow-up2'></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            .comments-container {
                width: ${width || '100%'};
                max-height: 80vw;
                padding-bottom: 20px;
                /* border-bottom: solid 2px ${App.get('primaryColor')}; */
            }

            .comments-border {
                display: flex;
                flex-direction: row;
                margin-top: 30px;
            }

            .comments-border-count {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin: 5px 5px 5px 0px;
                background: ${App.get('primaryColor')};
                display: grid;
                place-content: center;
            }

            .comments-border-count span {
                color: white;
                font-size: 1.5em;
                font-weight: 700;
            }

            .comments-border-name {
                display: grid;
                place-content: center;
                font-size: 1.5em;
                font-weight: 700;
            }

            .comments-border-line-container {
                flex: 2;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 10px 0px 10px 10px;
            }

            .comments-border-line {
                height: 2px;
                flex: 1;
                margin-top: 7px;
                background: ${App.get('primaryColor')};
            }

            /* New Comment */
            #id .new-comment-container {
                display: flex;
                background: white;
                border-radius: 4px;
                margin: 10px 30px;
            }

            #id .new-comment {
                overflow-wrap: anywhere;
                flex: 2;
                font-size: .9em;
                font-weight: 500;
                padding: 10px 20px;
                border-radius: 4px 0px 0px 4px;
                border-left: solid 1px rgba(0, 0, 0, .1);
                border-top: solid 1px rgba(0, 0, 0, .1);
                border-bottom: solid 1px rgba(0, 0, 0, .1);
            }

            #id .new-comment:active,
            #id .new-comment:focus{
                outline: none;
                border-left: solid 1px ${App.get('primaryColor')};
                border-top: solid 1px ${App.get('primaryColor')};
                border-bottom: solid 1px ${App.get('primaryColor')};
            }

            #id .new-comment-button-container,
            #id .new-comment-button-container {
                border-radius: 0px 4px 4px 0px;
                border-right: solid 1px rgba(0, 0, 0, .1);
                border-top: solid 1px rgba(0, 0, 0, .1);
                border-bottom: solid 1px rgba(0, 0, 0, .1);
            }

            #id .new-comment:active ~ .new-comment-button-container,
            #id .new-comment:focus ~ .new-comment-button-container {
                border-radius: 0px 4px 4px 0px;
                border-right: solid 1px ${App.get('primaryColor')};
                border-top: solid 1px ${App.get('primaryColor')};
                border-bottom: solid 1px ${App.get('primaryColor')};
            }

            /* Button */
            #id .new-comment-button {
                cursor: pointer;
                display: inline-block;
                margin: 5px;
                padding: 5px 7.5px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
                color: white;
                background: ${App.get('primaryColor')};
            }

            #id .new-comment-button .icon {
                font-size: 1.2em;
            }

            /* Comments */
            #id .comments {
                display: flex;
                flex-direction: column-reverse;
                max-height: 60vh;
                padding: 0px 30px;
                overflow: overlay;
            }

            /* Comment */
            #id .comment-container {
                display: flex;
                justify-content: flex-start;
            }

            #id .comment {
                margin: 10px 0px;
                padding: 7.5px 15px;
                border-radius: 4px;
                background: rgba(${App.get('primaryColorRGB')}, .1);
                border: solid 1px rgba(0, 0, 0, .05);
                max-width: 70%;
            }

            #id .comment-date-container {
                display: flex;
                align-items: center;
                font-size: .8em;
            }

            #id .comment-author {
                font-weight: 500;
                padding-right: 10px;
            }

            #id .comment-text {
                display: flex;
                flex-direction: column;
                padding-top: 5px;
            }

            /* Current User Comment */
            #id .comment-container.mine {
                justify-content: flex-end;
            }

            #id .comment-container.mine .comment {
                background: rgba(${App.get('primaryColorRGB')}, .8);
                border: solid 1px transparent;
            }

            #id .comment-container.mine .comment * {
                color: white;
            }

            /** New Comment */
            /*
            #id .animate-new-comment {
                animation: slide-up 1000ms ease-out 0s forwards;
            }

            @keyframes slide-up {
                0% {
                    transform: translateY(100%);
                }

                100% {
                    transform: translateY(0%);
                }
            }
            */
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .new-comment',
                event: 'keydown',
                async listener(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();

                        component.find('.new-comment-button').click();
                    }
                }
            },
            {
                selector: '#id .new-comment-button',
                event: 'click',
                async listener(event) {
                    const field = component.find('.new-comment');
                    const Comment = field.innerHTML;
                    const SubmittedBy = Store.user().Title
                    const LoginName = Store.user().LoginName;

                    if (Comment) {
                        const newItem = await CreateItem({
                            list: 'Comments',
                            data: {
                                FK_ParentId: parseInt(parentId),
                                Comment,
                                SubmittedBy,
                                LoginName
                            }
                        });

                        component.addComment(newItem, true);

                        field.innerHTML = '';
                    } else {
                        console.log('new comment field is empty');
                    }
                }
            }
        ]
    });

    function createCommentsHTML() {
        let html = '';

        comments.forEach(item => {
            html += commentTemplate(item);
        });

        return html;
    }

    function dateTemplate(date) {
        const d = new Date(date);

        return /*html*/ `
            <div class='comment-date'>${d.toLocaleDateString()} ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
        `
    }

    function commentTemplate(comment, isNew) {
        return /*html*/ `
            <div class='comment-container${comment.LoginName === Store.user().LoginName ? ' mine' : ''}${isNew ? ' animate-new-comment' : ''}' data-itemid='${comment.Id}'>
                <div class='comment'>
                    <div class='comment-date-container'>
                        ${comment.LoginName !== Store.user().LoginName ? /*html*/`<div class='comment-author'>${comment.SubmittedBy}</div>` : ''}
                        ${dateTemplate(comment.Created)}
                    </div>
                    <div class='comment-text'><div>${comment.Comment}</div></div>
                </div>
            </div>
        `;
    }

    component.addComment = (comment, scroll) => {
        const comments = component.findAll('.comment-container');
        const itemIds = [...comments].map(node => parseInt(node.dataset.itemid));

        if (itemIds.length > 0) {
            // console.log('new\t', itemIds, comment.Id);

            itemIds.push(comment.Id);
            itemIds.sort((a, b) => a - b);

            // console.log('sort\t', itemIds);

            const index = itemIds.indexOf(comment.Id);

            // console.log('index\t', index);

            comments[index - 1].insertAdjacentHTML('afterend', commentTemplate(comment, true));
        } else {
            component.find('.reverse').insertAdjacentHTML('beforeend', commentTemplate(comment, true));
        }


        if (scroll) {
            component.find('.comments').scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // container.insertAdjacentHTML('beforeend', commentTemplate(comment, true));

        const counter = component.find('.comments-border-count span');
        const newCount = parseInt(counter.innerText) + 1;

        counter.innerText = newCount;

        const text = component.find('.comments-border-name');

        text.innerText = newCount > 1 ? 'Comments' : 'Comment'
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Container(param) {
    const {
        align,
        background,
        border,
        borderBottom,
        borderLeft,
        borderRight,
        borderTop,
        display,
        flex,
        flexwrap,
        shadow,
        direction,
        height,
        justify,
        margin,
        padding,
        parent,
        position,
        radius,
        width,
        maxWidth,
        minWidth,
        overflow,
        overflowX,
        overflowY,
        userSelect,
        layoutPosition,
        top,
        bottom,
        left,
        right,
        zIndex
    } = param;

    return Component({
        html: /*html*/ `
            <div class='container'></div>
        `,
        style: /*css*/ `
            #id {
                user-select: ${userSelect || 'initial'};
                -webkit-user-select: ${userSelect || 'initial'};
                -moz-user-select: ${userSelect || 'initial'};
                -ms-user-select: ${userSelect || 'initial'};
                background: ${background || 'none'};
                flex-wrap: ${flexwrap || 'unset'};
                flex-direction: ${direction || 'row'};
                justify-content: ${justify || 'flex-start'};
                align-items: ${align || 'flex-start'};
                height: ${height || 'unset'};
                width: ${width || 'unset'};
                max-width: ${maxWidth || 'unset'};
                min-width: ${minWidth || 'unset'};
                margin: ${margin || '0'};
                padding: ${padding || '0'};
                border-radius: ${radius || 'unset'};
                border-top: ${borderTop || 'none'};
                border-right: ${borderRight || 'none'};
                border-bottom: ${borderBottom || 'none'};
                border-left: ${borderLeft || 'none'};
                border: ${border || 'initial'};
                box-shadow: ${shadow || 'none'};
                flex: ${flex || 'unset'};
                display: ${display || 'flex'};
                /** @todo is this the best method? */
                ${overflow ?
                `overflow: ${overflow}` :
                ''
            }
                ${overflowX ?
                `overflow-x: ${overflowX}` :
                ''
            }
                ${overflowY ?
                `overflow-y: ${overflowY}` :
                ''
            }
                ${zIndex ?
                `z-index: ${zIndex};` :
                ''
            }
                ${layoutPosition ?
                `position: ${layoutPosition};` :
                ''
            }
                ${top ?
                `top: ${top};` :
                ''
            }
                ${bottom ?
                `bottom: ${bottom};` :
                ''
            }
                ${left ?
                `left: ${left};` :
                ''
            }
                ${right ?
                `right: ${right};` :
                ''
            }
            }
        `,
        parent,
        position,
        events: [

        ]
    });
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function DashboardBanner(param) {
    const {
        margin,
        padding,
        border,
        parent,
        data,
        background,
        position,
        width,
        weight
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='dashboard-banner'>
                ${buildDashboard()}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '10px'};
                padding: ${padding || '8px'};
                background: ${background || 'white'};
                border-radius: 8px;
                border: ${border || App.get('defaultBorder')};
                display: flex;
                justify-content: space-between;
                overflow: overlay;
                ${width ? `width: ${width};` : ''}
            }

            #id .dashboard-banner-group {
                flex: 1;
                padding: 8px;
                border-radius: 8px;
                font-weight: ${weight || 'normal'};
                display: flex;
                flex-direction: column;
                align-items: center;
                /* justify-content: center; */
            }

            #id .dashboard-banner-group.selected {
                background: #e9ecef !important;
            }

            #id .dashboard-banner-group:not(:last-child) {
                margin-right: 10px;
                /* margin-right: 20px; */
            }

            #id .dashboard-banner-group[data-action='true'] {
                cursor: pointer;
            }

            #id .dashboard-banner-label,
            #id .dashboard-banner-description {
                white-space: nowrap;
                font-size: 13px;
            }

            #id .dashboard-banner-value {
                font-size: 28px;
                font-weight: 600;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: `#id .dashboard-banner-group[data-action='true']`,
                event: 'click',
                listener(event) {
                    const item = data.find(item => item.label === this.dataset.label);

                    item?.action(item);
                }
            }
        ]
    });

    function buildDashboard() {
        let html = '';

        data.forEach(item => {
            const {
                label,
                value,
                description,
                action,
                color,
                background
            } = item;

            html += /*html*/ `
                <div class='dashboard-banner-group' style='background: ${background || 'transparent'}' data-label='${label}' data-action='${action ? 'true' : 'false'}'>
                    <div class='dashboard-banner-label' style='color: ${color || App.get('defaultColor')}'>${label}</div>
                    <div class='dashboard-banner-value' style='color: ${color || App.get('defaultColor')}'>${value}</div>
                    <div class='dashboard-banner-description' style='color: ${color || App.get('defaultColor')}'>${description || ''}</div>
                </div>
            `;
        });

        return html;
    }

    component.group = (label) => {
        const group = component.find(`.dashboard-banner-group[data-label='${label}']`);

        if (group) {
            return {
                group,
                data: {
                    label: group.querySelector('.dashboard-banner-label').innerHTML,
                    value: group.querySelector('.dashboard-banner-value').innerHTML,
                    description: group.querySelector('.dashboard-banner-description').innerHTML
                }
            }
        }
    }

    component.select = (label) => {
        component.find(`.dashboard-banner-group[data-label='${label}']`)?.classList.add('selected');
    }

    component.deselect = (label) => {
        component.find(`.dashboard-banner-group[data-label='${label}']`)?.classList.remove('selected');
    }

    component.deselectAll = () => {
        component.findAll(`.dashboard-banner-group`).forEach(group => group?.classList.remove('selected'));
    }

    component.update = (groups) => {
        groups.forEach(item => {
            const {
                label,
                value,
                description,
            } = item;

            const valueField = component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-value`);

            if (valueField && value !== undefined) {
                valueField.innerText = value;
            }

            const descriptionField = component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-description`);

            if (descriptionField && description !== undefined) {
                descriptionField.innerText = description;
            }
        });
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function DataTable(param) {
    const {
        headers,
        headerFilter,
        columns,
        buttons,
        cursor,
        checkboxes,
        striped,
        border,
        paging,
        search,
        info,
        ordering,
        order,
        rowId,
        addCSS,
        data,
        onRowClick,
        onSearch,
        onDraw,
        toolbar,
        fontSize,
        nowrap,
        onSelect, // How do you turn select on?  i see the event but no option to enable it;
        onDeselect,
        rowCallback,
        createdRow,
        width,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <table class=
                'table table-sm 
                hover
                w-100 
                ${striped !== false ? 'table-striped' : 'table-not-striped'} 
                ${border !== false ? 'table-bordered' : 'table-not-bordered'} 
                animated 
                fadeIn
                ${nowrap !== false ? 'nowrap' : ''}'
            >
                <thead>
                    ${buildHeader()}
                </thead>    
            </table>
        `,
        style: /*css*/ `
            /** Horizontal scroll */
            #id_wrapper .row-2 {
                width: inherit;
            }

            #id_wrapper .row-2 .col-md-12 {
                overflow-x: overlay;
                padding-right: 0px;
                padding-left: 0px;
                padding-bottom: 10px;
                margin-right: 15px;
                margin-left: 15px;
            }

            /** Table */
            #id_wrapper {
                width: ${width || 'initial'};
                /* overflow-x: overlay; */
            }

            #id tr {
                cursor: ${cursor || 'pointer'};
            }

            /* 
            Toolbar 
            paging: false,
            search: false,
            ordering: false,
            */
            ${
                paging === false && search === false && ordering === false ?
                /*css*/ `
                    #id_wrapper .datatable-toolbar {
                        margin: 0px !important;
                    }
                ` :
                ''
            }

            #id_wrapper .datatable-toolbar {
                font-size: .9em;
                padding: 0px 15px;
                margin: 0px 0px 10px 0px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
            }

            #id_wrapper .datatable-toolbar .cell {
                display: flex;
                align-items: center;
            }

            #id_wrapper .datatable-toolbar .dataTables_length label,
            #id_wrapper .datatable-toolbar .dataTables_filter label {
                margin: 0px;
            }

            /** Buttons */
            #id_wrapper .btn-group {
                margin: 0px 10px 0px 0px;
            }

            #id_wrapper .btn {
                font-size: .9em;
                padding: 4px 8px;
            }

            #id_wrapper .datatable-toolbar .btn-secondary {
                background: ${App.get('primaryColor')};
                border-color: ${App.get('primaryColor')};
                margin-right: 10px;
                border-radius: .25rem;
            }

            #id_wrapper .datatable-toolbar .btn-secondary:focus {
                box-shadow: none;
            }

            #id_wrapper .datatable-toolbar .btn-secondary span {
                color: white;
            }

            /** Add Item Button */
            #id_wrapper .datatable-toolbar .add-item {
                background: seagreen;
                border: solid 1px seagreen;
                padding: 0px 10px;
            }

            #id_wrapper .datatable-toolbar .add-item span {
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
            }

            #id_wrapper .datatable-toolbar .add-item .icon {
                font-size: 16pt;
                margin-right: 5px;
                margin-left: -5px;
                stroke: white;
                fill: white;
            }

            /** Disabled Button */
            #id_wrapper .datatable-toolbar .disabled .icon {
                stroke: gray !important;
                fill: gray !important;
            }

            /** Delete Item Button */
            #id_wrapper .datatable-toolbar .delete-item {
                font-size: 20px;
                background: transparent;
                border: none;
            }

            #id_wrapper .datatable-toolbar .delete-item:hover {
                background: #e9ecef;
            }

            #id_wrapper .datatable-toolbar .delete-item span {
                display: flex;
                justify-content: center;
                align-items: center;
                color: firebrick;
            }

            #id_wrapper .datatable-toolbar .delete-item .icon {
                stroke: firebrick;
                fill: firebrick;
            }

            /** HTML5 Buttons */
            #id_wrapper .dt-buttons {
                flex-wrap: nowrap !important;
            }

            #id_wrapper .buttons-html5.ml-50 {
                margin-left: 50px;
            }

            #id_wrapper .buttons-html5 {
                background: #e9ecef !important;
                color: #444;
                font-weight: 500;
                border: 1px solid transparent !important;
            }

            #id_wrapper .buttons-html5 span{
                color: ${App.get('primaryColor')} !important;
            }

            @media (max-width: 1366px) {
                #id_wrapper .datatable-toolbar .add-item {
                    margin-right: 30px;
                }

                #id_wrapper .buttons-html5.ml-50 {
                    margin-left: 25px;
                }
            }

            /** Select and Search */
            #id_wrapper .custom-select {
                border: 1px solid transparent;
                background: #e9ecef;
            }

            #id_wrapper input[type='search'] {
                border: 1px solid transparent;
                background: #e9ecef;
            }

            #id_wrapper input[type='search']:active,
            #id_wrapper input[type='search']:focus,
            #id_wrapper select:focus,
            #id_wrapper select:focus {
                border: 1px solid transparent;
                outline: none;
            }

            #id_wrapper input[type='search']::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 16px;
                width: 16px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill=''><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
            }

            /** Footer */
            #id_wrapper .datatable-footer {
                padding: 0px 15px;
                margin: 10px 0px 0px 0px;
                width: 100%;
                font-size: .85em;
                display: flex;
                justify-content: space-between;
            }

            #id_wrapper .datatable-footer .cell.left {
                display: flex;
                align-items: center;
            }

            /** Info */
            #id_wrapper .dataTables_info {
                padding: 0px;
            }

            /** Pagination */
            #id_wrapper .page-item .page-link {
                color: unset;
                border: none; /* FIXME: Experimental */
                padding: 3px 7px;
                border-radius: 6px;
            }

            #id_wrapper .page-item .page-link:focus {
                box-shadow: none;
            }

            #id_wrapper .page-item.active .page-link {
                color: white;
                background: ${App.get('primaryColor')};;
                border: solid 1px ${App.get('primaryColor')};
            }

            #id_wrapper .page-link:hover {
                background: rgb(${App.get('primaryColorRGB')}, .15);
            }

            /** Form control */
            #id_wrapper .form-control:focus {
                box-shadow: none;
                outline: none;
            }

            /** Table */
            #id_wrapper .dataTable {
                border-collapse: collapse !important;
                font-size: ${fontSize || '14px'};
            }

            /** Not Bordered*/
            #id_wrapper .table-not-bordered {
                border: none;
            }
            
            #id_wrapper .table-not-bordered thead td,
            #id_wrapper .table-not-bordered thead th {
                border-top: none;
            }
            
            /** Headers */
            #id_wrapper .table-border thead th {
                border-bottom: solid 1px rgb(${App.get('primaryColorRGB')}, .3);
                background: rgb(${App.get('primaryColorRGB')}, .2);
                color: ${App.get('primaryColor')};
            }

            #id_wrapper :not(.table-border) thead th {
                vertical-align: bottom;
                border-bottom-width: 1px;
            }

            /** Cells */
            #id_wrapper td,
            #id_wrapper th {
                border-top: none;
            }
            
            #id_wrapper td:focus {
                outline: none;
            }

            #id_wrapper td.bold {
                font-weight: 500;
            }

            /** Sorting */
            #id_wrapper .sorting_asc::before,
            #id_wrapper .sorting_asc::after,
            #id_wrapper .sorting_desc::before,
            #id_wrapper .sorting_desc::after {
                color: ${App.get('primaryColor')};
            }

            #id_wrapper .sorting::after,
            #id_wrapper .sorting_asc::after,
            #id_wrapper .sorting_desc::after {
                right: .1em;
            }

            /** Select Checkbox */
            #id_wrapper tbody td.select-checkbox {
                vertical-align: middle;
            }

            #id_wrapper tbody td.select-checkbox:before, 
            #id_wrapper tbody th.select-checkbox:before {
                content: ' ';
                margin: 0 auto;
                border: solid 2px lightgray;
                border-radius: 4px;
                position: initial;
                display: block;
                width: 16px;
                height: 16px;
                box-sizing: border-box;
            }

            #id_wrapper tbody td.select-checkbox:after, 
            #id_wrapper tbody th.select-checkbox:after {
                margin-top: -18px;
                top: auto;
                text-shadow: none;
                color: ${App.get('defaultColor')};
                font-weight: bolder;
                font-size: 10pt;
            }

            /** Selected Row */
            #id_wrapper tbody > tr.selected {
                background-color: ${App.get('sidebarBackgroundColor')};
            }

            /** Overflow MLOT field */
            #id_wrapper tbody td .dt-mlot {
                max-width: 200px;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            /* Bootstrap 5 overrides */
            #id_wrapper .table>:not(caption) > * > * {
                border-bottom-width: 0px;
            } 

            #id_wrapper .table > :not(:first-child) {
                border-top: none;
            }

            #id_wrapper .table thead {
                border-bottom-color: lightgray;
            }

            ${addCSS || ''}
        `,
        parent,
        position,
        events: [
            {
                selector: `#id`,
                event: 'click',
                listener(event) {
                    
                }
            }
        ],
        onAdd() {
            setData({
                columns,
                data,
                onRowClick,
            });
        }
    });

    function buildHeader() {
        let html = /*html*/ `
            <tr>
        `;

        headers.forEach(item => {
            html += /*html*/ `
                <th>${item}</th>
            `;
        });

        html += /*html*/ `
            </tr>
        `
        return html;
    }

    function setData(param) {
        const {
            columns,
            data,
            onRowClick,
        } = param;

        if (!component.get()) {
            return;
        }
        
        const tableId = `#${component.get().id}`;

        const options = {
            dom: `
                <'row'
                    <'datatable-toolbar'
                        <'cell left'
                            Bl
                        >
                        <'cell right'
                            ${search !== false ? 'f' : ''}
                        >
                    >
                >
                <'row row-2'
                    <'col-md-12'
                        t
                    >
                >
                <'row'
                    <'datatable-footer'
                        <'cell left'
                            ${info !== false ? 'i' : ''}
                        >
                        <'cell right'
                            p
                        >
                    >
                >
            `,
            rowId,
            processing: true,
            // responsive: true,
            /**
             * Testing
             * 
             * https://datatables.net/reference/option/deferRender
             */
            deferRender: true,
            order: order || [[1, 'asc']],
            columns,
            buttons: buttons || []
        };

        if (paging === false) {
            options.paging = false;
        } else {
            options.pageLength = 25;
        }

        if (ordering === false) {
            options.ordering = false;
        }

        if (checkboxes) {
            options.columnDefs = [
                {
                    targets: 0,
                    defaultContent: '',
                    orderable: false,
                    className: 'select-checkbox'
                }
            ];

            options.select = {
                style: 'multi+shift',
                selector: 'td:first-child'
            };
        } else {
            // options.select = 'single';
        }

        if (rowCallback) {
            options.rowCallback = rowCallback;
        }

        if (createdRow) {
            options.createdRow = createdRow;
        }

        if (headerFilter) {
            options.initComplete = function () {
                console.log('footer filter');

                var footer = $(this).append('<tfoot><tr></tr></tfoot>');

                // Apply the search
                this.api().columns().every( function (index) {
                    var that = this;

                    var data = this.data();

                    if (index === 6) {
                        return;
                    }

                    // Append input
                    // $(`${tableId} tfoot tr`).append('<th><input type="text" style="width:100%;" placeholder="Search column"></th>');
                    $(footer).append('<th><input type="text" style="width:100%;" placeholder="Search column"></th>');
     
                    $( 'input', this.footer() ).on( 'keyup change clear', function () {
                        if ( that.search() !== this.value ) {
                            that
                                .search( this.value )
                                .draw();
                        }
                    } );
                } );
            }
        }

        // console.log('Table options:', options);

        // FIXME: Experimental
        options.preDrawCallback = function (settings) {
            var pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
            pagination.toggle(this.api().page.info().pages > 1);
        }

        /** Create table. */
        const table = $(tableId).DataTable(options)
        .on('click', 'tr', function(rowData) {
            /** DO NOT Change this to an arrow function! this reference required */
            if (rowData.target.classList.contains('select-checkbox')) {
                return;
            }
            rowData = $(tableId).DataTable().row(this).data();

            if (rowData && onRowClick) {
                onRowClick({
                    row: this,
                    item: rowData
                });
            }
        });

        /** Search event callback */
        if (onSearch) {
            table.on('search.dt', function(e, settings) {
                // console.log('Column search', table.columns().search().toArray());
                // console.log('Global search', table.search());

                onSearch({
                    jqevent: e,
                    table: table
                });
            });
        }

        /** Draw event callback */
        if (onDraw) {
            table.on('draw', function(e, settings) {
                // console.log('Column search', table.columns().search().toArray());
                // console.log('Global search', table.search());

                onDraw({
                    jQEvent: e,
                    table: table
                });
            });
        }

        /** Select callback */
        if (onSelect) {
            table.on('select', function(e, dt, type, indexes) {
                onSelect({
                    e,
                    dt,
                    type,
                    indexes
                });
            });
        }

        /** Deselect callback */
        if (onDeselect) {
            table.on('deselect', function(e, dt, type, indexes) {
                onDeselect({
                    e,
                    dt,
                    type,
                    indexes
                });
            });
        }

        /** Load and draw data. */
        table.rows.add(data).draw();

        /** Adjust columns */
        table.columns.adjust().draw();

        /** Header filter */
        if (headerFilter) {
            $(`${tableId} tfoot th`).each( function () {
                var title = $(this).text();
                $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
            } );
        }
    }

    component.DataTable = () => {
        return $(`#${component.get()?.id}`)?.DataTable();
    }

    component.search = (term, column) => {
        $(`#${component.get().id}`).DataTable().columns(column).search(term).draw();
    }

    component.findRowById = (id) => {
        return $(`#${component.get().id}`).DataTable().row(`#${id}`);
    }
    
    component.updateRow = (param) => {
        const {
            row,
            data
        } = param;

        $(`#${component.get().id}`).DataTable().row(row).data(data).draw();
    }

    component.selected = () => {
        return $(`#${component.get().id}`).DataTable().rows({selected: true}).data().toArray();
    }

    component.addRow = (param) => {
        const {
            data
        } = param;

        $(`#${component.get().id}`).DataTable().row.add(data).draw();
    }

    component.removeRow = (itemId) => {
        $(`#${component.get().id}`).DataTable().row(`#${itemId}`).remove().draw();
    }

    component.getButton = (className) => {
        return component.get().closest('.dataTables_wrapper').querySelector(`button.${className}`);
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function DateField(param) {
    const {
        label,
        date,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <div class='form-field-label'>${label}</div>
                <input class='form-field-date' type='date' ${date ? `value=${date.toISOString().split('T')[0]}` : ''}>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin-bottom: 20px;
            }

            /* Labels */
            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px;
            }

            #id .form-field-date {
                font-size: .9em;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            #id .form-field-date:active,
            #id .form-field-date:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${App.get('primaryColor')};
            }
        `,
        parent: parent,
        position,
        events: [

        ]
    });

    component.value = (param) => {
        const field = component.find('.form-field-date');

        if (param) {
            field.value = new Date(param).toISOString().split('T')[0];
        } else {
            return field.value;
        }
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function DevConsole(param) {
    const { parent, position } = param;

    AddStyle({
        name: 'console-box',
        style: /*css*/ `
            .console {
                width: 100%;
                height: 100%;
                overflow: overlay;
                background: #1E1E1E;
            }

            .console * {
                color: #CCCCCC !important;
            }

            .console-title {
                font-family: 'M PLUS Rounded 1c', sans-serif; /* FIXME: experimental */
            }

            .line-number {
                display: inline-block;
                font-weight: 600;
                width: 30px;
            }

            .install-modal {
                padding: 60px;
            }

            .install-alert {
                left: 10px;
                right: 10px;
                bottom: 10px;
                border-radius: 10px;
                padding: 10px 15px;
                border: none;
                background: #1E1E1E;
                color: white !important;
                animation: fade-in-bottom 200ms ease-in-out forwards;
            };

            .install-alert * {
                color: white !important;
            };
        `
    });

    const component = Component({
        html: /*html*/ `
            <div>
                <!-- <div class='dev-console-title'>Developer Tools</div> -->
                <!-- <div class='alert alert-warning'>
                    <p><strong>These actions affect all users. Some changes can't be reversed.</strong></p>
                    <hr>
                    <p class="mb-0"><strong>Please proceed with caution.</strong></p>
                </div> -->
                <div class='dev-console'>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Update ${App.get('title')}</div>
                            <div class='dev-console-description'>Install new lists from <code>App/src/lists.js</code>.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-success dev-console-button update'>Update ${App.get('title')}</button>
                        </div>
                    </div>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Reset lists</div>
                            <div class='dev-console-description'>Remove all items from selected core lists from <code>App/src/Core/Models.js > Lists()</code> and <strong>${App.get('title')}</strong> lists in <code>App/src/lists.js</code>. All items from selected lists will be deleted. This can't be undone.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-secondary dev-console-button reset'>Choose lists to reset</button>
                        </div>
                    </div>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Reinstall ${App.get('title')}</div>
                            <div class='dev-console-description'>Delete and recreate all core lists from <code>App/src/Core/Models.js > Lists()</code> and <strong>${App.get('title')}</strong> lists in <code>App/src/lists.js</code>. All items will be deleted. This can't be undone.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-secondary dev-console-button reinstall'>Remove data and reinstall ${App.get('title')}</button>
                        </div>
                    </div>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Delete ${App.get('title')}</div>
                            <div class='dev-console-description'>Delete all core and <strong>${App.get('title')}</strong> lists. All items will be deleted. This can't be undone. You will need to install the app again later.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-danger dev-console-button delete'>Delete all lists and data</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                padding: 20px 0px;
            }
            
            #id .alert {
                border: none;
                border-radius: 20px;
            }

            #id .dev-console-title {
                font-size: 1.5em;
                font-weight: 700;
                color: #24292f;
                margin-bottom: 10px;
            }

            #id .dev-console {
                width: 100%;
                /* padding: 40px; */
                /* border: solid 2px ${App.get('primaryColor')}; */
                border-radius: 20px;
                display: flex;
                flex-direction: column;
            }

            #id .dev-console-row {
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 20px 30px;
                border-radius: 20px;
                background: ${App.get('sidebarBackgroundColor')};
            }

            #id .dev-console-text {
                max-width: 700px;
            }

            #id .dev-console-label {
                font-weight: 600;
            }

            #id .dev-console-row:not(:last-child) {
                margin-bottom: 20px;
            }

            #id .dev-console-button {
                font-weight: 600;
                font-size: 14px;
                height: fit-content;
                border-radius: 10px;
                width: 230px;
                border: none;
            }

            #id .btn-danger {
                background: firebrick;
            }

            #id .btn-success {
                background: seagreen;
            }

            #id .btn-secondary {
                background: white;
                color: firebrick;
            }

            #id .dev-console-button:focus,
            #id .dev-console-button:active {
                box-shadow: none;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .update',
                event: 'click',
                async listener(event) {
                    console.log('Update app');

                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        async addContent(modalBody) {
                            modalBody.classList.add('install-modal');

                            // Show loading
                            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='loading-spinner w-100 d-flex flex-column justify-content-center align-items-center'>
                                    <div class="mb-2" style='font-weight: 600; color: darkgray'>Loading lists</div>
                                    <div class="spinner-grow" style='color: darkgray' role="status"></div>
                                </div>
                            `);

                            // Check lists
                            const coreLists = Lists();
                            const appLists = lists;
                            const allLists = coreLists.concat(appLists);
                            const webLists = await GetWebLists();
                            const diff = allLists.map(item => item.list).filter(x => !webLists.map(item => item.Title).includes(x));
                            console.log(webLists, allLists, diff);
        
                            console.log(event.target.innerText);

                            const toCreate = diff.map(list => allLists.find(item => item.list === list));
                            
                            // Remove loading
                            modal.find('.loading-spinner').remove();

                            if (!toCreate.length) {
                                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                    <h4 class='mb-3'>No new lists to install</h4>
                                `);
                            } else {
                                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                    <h4 class='mb-1'>New lists to install</h4>
                                    ${
                                        toCreate
                                        .sort((a, b) => a.list - b.list)
                                        .map(item => {
                                            return /*html*/ `
                                                <div class="form-check ml-2">
                                                    <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}' checked>
                                                    <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                                        ${item.list}
                                                    </label>
                                                </div>
                                            `
                                        }).join('\n')
                                    }
                                `);

                                const installBtn = BootstrapButton({
                                    async action(event) {
                                        console.log('Install');

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

                                            // List + 1 for install
                                            progressCount = progressCount + 1;

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
                                            background: '#1E1E1E'
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

                                        // Install ----------------------------------------------------------------------------------------

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

                                    if (lists.length) {
                                            // Add Release Notes
                                            await CreateItem({
                                                list: 'ReleaseNotes',
                                                data: {
                                                    Summary: `New ${App.get('title')} lists created`,
                                                    Description: checkedLists.map(item => item.list).join(', ') + '.',
                                                    Status: 'Published',
                                                    MajorVersion: '0',
                                                    MinorVersion: '1',
                                                    PatchVersion: '0',
                                                    ReleaseType: 'Current'
                                                }
                                            });

                                            console.log(`Added Release Note: ${App.get('title')} lists created - ${checkedLists.map(item => item.list).join(', ')}.`);

                                            // Add to console
                                            reinstallConsole.append(/*html*/ `
                                                <div class='console-line'>
                                                    <!-- <code class='line-number'>0</code> -->
                                                    <code>'New ${App.get('title')} lists created - ${checkedLists.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
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

                                        let spacers = '===================';

                                        // for (let i = 0; i < App.get('title').length; i++) {
                                        //     spacers = spacers + '=';
                                        // }
                                        
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
                                        `);

                                        // END RESET ------------------------------------------------------------------------------------

                                        modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                            <div class='mt-4 mb-4'>All new lists have been successfully installed. You can safely close this modal.</div>
                                        `);

                                        // Show return button
                                        const returnBtn = BootstrapButton({
                                            type: 'primary',
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
                                    classes: ['w-100', 'mt-4'],
                                    width: '100%',
                                    parent: modalBody,
                                    type: 'success',
                                    value: `Install lists`
                                });

                                installBtn.add();
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
            },
            {
                selector: '#id .reset',
                event: 'click',
                listener(event) {
                    console.log(event.target.innerText);

                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        async addContent(modalBody) {
                            modalBody.classList.add('install-modal');

                            // Core lists
                            const coreLists = Lists();
                            console.log(coreLists);

                            // App lists
                            const appLists = lists;
                            console.log(coreLists);

                            // All Lists
                            const allLists = Lists().concat(appLists);
                            console.log(allLists);

                            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='mt-3 mb-1'>Select <strong>${App.get('title')}</strong> lists to reset <span style='border-radius: 10px; background: ghostwhite; color: firebrick; font-weight: 500; padding: 5px 10px;'>all items will be deleted</span></div>
                                ${
                                    appLists
                                    .sort((a, b) => a.list - b.list)
                                    .map(item => {
                                        return /*html*/ `
                                            <div class="form-check ml-2">
                                                <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}'>
                                                <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                                    ${item.list}
                                                </label>
                                            </div>
                                        `
                                    }).join('\n')
                                }
                                <div class='mt-4 mb-1'>Select <strong>Core</strong> lists to reset</div>
                                ${
                                    coreLists
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
                                        `
                                    }).join('\n')
                                }
                                <div class='alert alert-danger mt-5' style='border: none; border-radius: 10px;'>
                                    This can't be undone. Proceed with caution.
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
                                        background: '#1E1E1E'
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
                                            filter: `Summary eq '${App.get('title')} lists created'`
                                        });

                                        if (releaseNoteExists[0]) {
                                            // Add to console
                                            reinstallConsole.append(/*html*/ `
                                                <div class='console-line'>
                                                    <!-- <code class='line-number'>0</code> -->
                                                    <code>'${App.get('title')} lists created' release note already exists.'</code>
                                                </div>
                                            `);

                                            // Scroll console to bottom
                                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
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
                                            reinstallConsole.append(/*html*/ `
                                                <div class='console-line'>
                                                    <!-- <code class='line-number'>0</code> -->
                                                    <code>'${App.get('title')} lists created - ${lists.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
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

                                    // for (let i = 0; i < App.get('title').length; i++) {
                                    //     spacers = spacers + '=';
                                    // }
                                    
                                    // 3. Add to console
                                    reinstallConsole.append(/*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='color: mediumseagreen !important;'>${spacers}</code>
                                        </div>
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='color: mediumseagreen !important;'>| Lists reset |</code>
                                        </div>
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='color: mediumseagreen !important;'>${spacers}</code>
                                        </div>
                                    `);

                                    // END RESET ------------------------------------------------------------------------------------

                                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                        <div class='mt-4 mb-4'>All selected lists have been successfully reset. You can safely close this modal.</div>
                                    `);

                                    // Show return button
                                    const returnBtn = BootstrapButton({
                                        type: 'primary',
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
                                type: 'danger',
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
            },
            {
                selector: '#id .reinstall',
                event: 'click',
                listener(event) {
                    console.log(event.target.innerText);

                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        async addContent(modalBody) {
                            modalBody.classList.add('install-modal');

                            // Core lists
                            const coreLists = Lists();
                            console.log(coreLists);

                            // App lists
                            const appLists = lists;
                            console.log(coreLists);

                            // All Lists
                            const allLists = Lists().concat(lists);
                            console.log(allLists);

                            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='mt-3'>All <strong>${App.get('title')}</strong> lists will be reinstalled <span style='border-radius: 10px; background: ghostwhite; color: firebrick; font-weight: 500; padding: 5px 10px;'>all items will be deleted</span></div>
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
                                <div>All <strong>Core</strong> lists will be reinstalled <span style='border-radius: 10px; background: ghostwhite; color: firebrick; font-weight: 500; padding: 5px 10px;'>all user generated items will be deleted</span></div>
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
                                        <h3 class='console-title mb-0'>Reinstalling <strong>${App.get('title')}</strong></h3>
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
                                        background: '#1E1E1E'
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
                                            <code>Delete '${App.get('title')}' lists:</code>
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
                                            <code>Create '${App.get('title')}' lists:</code>
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
                                            filter: `Summary eq '${App.get('title')} lists created'`
                                        });

                                        if (releaseNoteExists[0]) {
                                            // Add to console
                                            reinstallConsole.append(/*html*/ `
                                                <div class='console-line'>
                                                    <!-- <code class='line-number'>0</code> -->
                                                    <code>'${App.get('title')} lists created' release note already exists.'</code>
                                                </div>
                                            `);

                                            // Scroll console to bottom
                                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
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
                                            reinstallConsole.append(/*html*/ `
                                                <div class='console-line'>
                                                    <!-- <code class='line-number'>0</code> -->
                                                    <code>'${App.get('title')} lists created - ${lists.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
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

                                    for (let i = 0; i < App.get('title').length; i++) {
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
                                            <code style='color: mediumseagreen !important;'>| '${App.get('title')}' reinstalled |</code>
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
                                value: `Reinstall ${App.get('title')}`
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
            },
            {
                selector: '#id .delete',
                event: 'click',
                async listener(event) {
                    console.log(event.target.innerText);

                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        async addContent(modalBody) {
                            modalBody.classList.add('install-modal');

                            // Core lists
                            const coreLists = Lists();
                            console.log(coreLists);

                            // App lists
                            const appLists = lists;
                            console.log(coreLists);

                            // All Lists
                            const allLists = Lists().concat(lists);
                            console.log(allLists);

                            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='mt-3'><strong>${App.get('title')}</strong> lists that will be deleted</div>
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
                                <div><strong>Core</strong> lists that will be deleted</div>
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
                                        <h3 class='console-title mb-0'>Deleting <strong>${App.get('title')}</strong></h3>
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
                                        background: '#1E1E1E'
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
                                            <code>Delete '${App.get('title')}' lists:</code>
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

                                    for (let i = 0; i < App.get('title').length; i++) {
                                        spacers = spacers + '=';
                                    }
                                    
                                    // 3. Add to console
                                    deleteConsole.append(/*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='color: crimson !important;'>${spacers}</code>
                                        </div>
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='color: crimson !important;'>| '${App.get('title')}' deleted |</code>
                                        </div>
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='color: crimson !important;'>${spacers}</code>
                                        </div>
                                    `);

                                    // Scroll console to bottom
                                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                        <div class='mt-4 mb-2'>All lists and data for <strong>${App.get('title')}</strong> have been successfully deleted.</div>
                                        <div class='mb-4'>You can install it again at <strong>Site Contents > App > src > pages > app.aspx</strong></div>
                                    `);

                                    // Show return button
                                    const returnBtn = BootstrapButton({
                                        type: 'primary',
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
                                classes: ['w-100 mt-5'],
                                width: '100%',
                                parent: modalBody,
                                type: 'danger',
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
            }
        ]
    });

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function DropDownField(param) {
    const {
        label,
        labelAfter,
        description,
        value,
        direction,
        required,
        parent,
        position,
        width,
        editable,
        fieldMargin,
        maxWidth,
        focusout,
        onError,
        onEmpty,
        onSetValue
    } = param;

    let {
        list,
        dropDownOptions,
        disabled
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field ${disabled ? 'disabled' : ''} ${direction}'>
                <div class='form-field-label'>
                    <span>${label || ''}</span>
                    <!-- ${required ? /*html*/ `<span class='required'>Required</span>` : ''} -->
                </div>
                ${description ? /*html*/`<div class='form-field-description'>${description}</div>` : ''}
                <div class='form-field-drop-down-container'>
                    <div class='form-field-drop-down' contenteditable='${editable !== false ? 'true' : 'false'}'>${dropDownOptions.map(item => item.value).includes(value) ? value : ''}</div> 
                    <!-- List options go here -->
                </div>
                ${labelAfter ? /*html*/ `<div class='form-field-label'><span>${labelAfter || ''}</span></div>` : ''}
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
            }

            #id.form-field.row {
                display: flex;
                align-items: center;
            }

            #id.form-field.row .form-field-drop-down-container {
                margin-left: 5px;
                margin-right: 5px;
            }

            #id.form-field.disabled {
                opacity: 0.75;
                pointer-events: none;
            }

            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .form-field-description {
                padding: 5px 0px;
            }

            #id .form-field-drop-down-container {
                position: relative;
            }

            #id .form-field-drop-down {
                width: ${width || '150px'};
                ${editable === false ? 'min-height: 36px;' : ''}
                font-weight: 500;
                font-size: 1em;
                padding: 5px 10px;
                margin: 2px 0px 4px 0px;
                background: white;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            #id .form-field-drop-down:active,
            #id .form-field-drop-down:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${App.get('primaryColor')};
            }

            /* Validation */
            #id .bad {
                background: lightpink;
                box-shadow: 0px 0px 0px 2px crimson;
                border-radius: 4px;
            }

            /* Required */
            #id .required {
                font-size: .8em;
                font-weight: 400;
                color: red;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .form-field-drop-down`,
                event: 'keyup',
                listener(event) {
                    const data = dropDownOptions.filter(item => {
                        const query = event.target.innerText;

                        return query ? item.value.toLowerCase().includes(query.toLowerCase()) : item;
                    });

                    showDropDownMenu(event, data);
                }
            },
            {
                selector: `#id .form-field-drop-down`,
                event: 'click',
                listener(event) {
                    /** Remove menu on second click */
                    if (menu) {
                        cancelMenu();

                        return;
                    }

                    /** @todo remove menu on click outside */
                    showDropDownMenu(event, dropDownOptions);
                }
            },
            {
                selector: `#id .form-field-drop-down`,
                event: 'focusout',
                listener(event) {
                    /** Get  */
                    const value = event.target.innerText;

                    /** Check that value is valid */
                    if (value === '') {
                        cancelMenu();

                        if (onEmpty) {
                            onEmpty();
                        }
                    } else if (!dropDownOptions.map(item => item.value).includes(value)) {
                        console.log('not a valid option');

                        component.addError('Not a valid option. Please enter or select an option from the menu.');

                        if (onError) {
                            onError(value);
                        }
                    } else {
                        component.removeError();

                        cancelMenu();

                        if (focusout) {
                            focusout(event);
                        }
                    }
                }
            }
        ]
    });

    let menu;

    function cancelMenu(param = {}) {
        const {
            removeEvents
        } = param;

        if (menu) {
            if (removeEvents) {
                menu.removeEvents();
            }

            menu.cancel();
            menu = undefined;
        }
    }

    function showDropDownMenu(event, data) {
        const key = event.key;

        if (key && key.includes('Arrow') || key === 'Enter') {
            event.preventDefault();

            return;
        }

        if (data.length === 0) {
            console.log('no options to show');

            return;
        }

        /** Cancel menu */
        cancelMenu({
            removeEvents: true,
        });

        // Set menu
        menu = DropDownMenu({
            dropDownField: component,
            field: event.target,
            data,
            list,
            onSetValue(data) {
                cancelMenu();

                if (onSetValue) {
                    onSetValue(data);
                }
            }
        });

        // Add to DOM
        menu.add();
    }

    component.enable = () => {
        disabled = false;

        component.get().classList.remove('disabled');
    }

    component.disable = () => {
        disabled = true;

        component.get().classList.add('disabled');
    }

    component.setOptions = (param) => {
        const {
            list: newList,
            options: newOptions
        } = param;

        list = newList;
        dropDownOptions = newOptions;
    }

    component.addError = (param) => {
        component.removeError();

        let text = typeof param === 'object' ? param.text : param;

        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
                    /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''
            }
            </div>
        `;

        component.find('.form-field-drop-down').insertAdjacentHTML('beforebegin', html);
    }

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    }

    component.value = (param) => {
        const field = component.find('.form-field-drop-down');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    }

    component.getValueItemId = () => {
        return component.find('.form-field-drop-down').dataset.itemid;
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function DropDownMenu(param) {
    const {
        dropDownField,
        field,
        data,
        list,
        onSetValue
    } = param;

    const component = Component({
        html: createList(),
        style: /*css*/ `
            /* List Containers */
            .drop-down-menu-container {
                position: relative;
            }

            /* Data list text field */
            .form-list-text {
                width: ${field.offsetWidth}px;
                font-weight: 500;
                font-size: .9em;
                padding: 5px;
                background: white;
                margin: 5px 10px;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            .form-list-text:focus,
            .form-list-text:active {
                outline: none;
            }

            /* Drop Down Menu */
            .drop-down-menu {
                width: ${field.offsetWidth}px;
                white-space: nowrap;
                font-weight: 500;
                padding: 5px 0px;
                background: white;
                margin: 5px 0px;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
                z-index: 10;
                position: absolute;
                top: 0px;
                left: 0px;
                overflow: auto;
            }

            .list-option {
                cursor: pointer;
                padding: 0px 10px;
                border-radius: 4px;
            }

            .list-option-selected {
                background: ${App.get('primaryColor')};
                color: ${App.get('secondaryColor')}
            }
             
            .list-option:hover {
                background: ${App.get('primaryColor')};
                color: ${App.get('secondaryColor')}
            }

            /** Loading Shimmer */
            .loading-item {
                border-radius: 4px;
                padding: 5px 10px;
                margin: 5px 10px;
                /* height: 21px; */
                background: #777;
            }
            
            .animate {
                animation: shimmer 2s infinite linear;
                background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
            }

            @keyframes fullView {
                100% {
                    width: 100%;
                }
            }
            
            @keyframes shimmer {
                0% {
                    background-position: -1000px 0;
                }
                100% {
                    background-position: 1000px 0;
                }
            }
        `,
        parent: field,
        position: 'afterend',
        events: [
            {
                selector: '#id .list-option',
                event: 'click',
                listener(event) {
                    const value = event.target.innerText;
                    const id = event.target.dataset.itemid;
                    const index = event.target.dataset.index;

                    addSelectionToField(value, id, index);
                }
            },
            {
                selector: field,
                event: 'keydown',
                listener: selectListOptionWithCursorKeys
            },
            {
                selector: '#id.drop-down-menu-container',
                event: 'mouseenter',
                listener(event) {
                    event.target.allowCancel = false;
                }
            },
            {
                selector: '#id.drop-down-menu-container',
                event: 'mouseleave',
                listener(event) {
                    event.target.allowCancel = true;
                }
            }
        ]
    });

    /** Create List HTML */
    function createList() {
        const fieldPositions = field.getBoundingClientRect();
        const maxHeight = window.innerHeight - fieldPositions.bottom - field.offsetHeight;

        let html = /*html*/ `
            <div class='drop-down-menu-container'>
                <div class='drop-down-menu' style='max-height: ${maxHeight}px'>
        `;

        if (data) {
            data.forEach((option, index) => {
                const {
                    id,
                    value
                } = option;

                html += /*html*/ `
                    <div class='list-option' data-itemid='${id || 0}' data-index='${index}'>${value}</div>
                `;
            });
        } else {
            html += /*html*/ `
                <div class='loading-item animate'>Searching...</div>
            `;
        }

        html += /*html*/ `
                </div>
            </div>
        `;

        return html;
    }

    /** Set field value */
    async function addSelectionToField(value, id, index) {
        const previousValue = field.innerText;

        field.innerText = value;
        field.dataset.itemid = id;

        field.dispatchEvent(new Event('input'), {
            bubbles: true,
            cancelable: true,
        });

        if (list) {
            /** Get item */
            const item = await Get({
                list,
                filter: `Id eq ${id}`
            });

            onSetValue({
                previousValue,
                newValue: item[0]
            });
        } else {
            onSetValue({
                previousValue,
                newValue: data[parseInt(index)]
            });
        }

        dropDownField.removeError();
        component.remove();
    }

    /** Select next option with Up/Down Cursor Keys */
    function selectListOptionWithCursorKeys(event) {
        const key = event.key;

        // Exit if key pressed is not an arrow key or Enter
        if (!key.includes('Arrow') && key !== 'Enter') {
            return;
        } else {
            event.preventDefault();
        }

        const listOptions = component.findAll('.list-option');
        const currentSelected = component.find('.list-option-selected');

        // Add current selection to field if exits and Enter key pressed
        if (key === 'Enter' && currentSelected) {
            const value = currentSelected.innerText;
            const id = currentSelected.dataset.itemid;
            const index = currentSelected.dataset.index;

            addSelectionToField(value, id, index);

            return;
        }

        const currentIndex = [...listOptions].indexOf(currentSelected);
        const nextIndex = key === 'ArrowUp' ? currentIndex - 1 : key === 'ArrowDown' ? currentIndex + 1 : currentIndex;

        if (currentIndex === -1) {
            listOptions[0].classList.add('list-option-selected');
        } else {
            currentSelected.classList.remove('list-option-selected');

            if (listOptions[nextIndex]) {
                listOptions[nextIndex].classList.add('list-option-selected');
            } else if (nextIndex >= listOptions.length) {
                listOptions[0].classList.add('list-option-selected'); // Go back to beginning
            } else if (nextIndex === -1) {
                const lastIndex = listOptions.length - 1; //Go to end

                listOptions[lastIndex].classList.add('list-option-selected');
            }
        }

        scrollToListOptions();
    }

    /** Scroll current selection into view as needed */
    function scrollToListOptions() {
        // Get current selected option
        const currentSelected = component.find('.list-option-selected');

        currentSelected.scrollIntoView({
            block: 'nearest',
            inline: 'start'
        });
    }

    component.cancel = () => {
        const menuContainer = component.get();

        if (menuContainer && menuContainer.allowCancel !== false) {
            component.remove();
        }
    }

    component.removeEvents = () => {
        field.removeEventListener('keydown', selectListOptionWithCursorKeys);
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Files(param) {
    const {
        remove,
        files,
        list,
        label,
        labelWeight,
        labelSize,
        parent,
        position,
        onAdd,
        onDelete
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='files'>
                ${label ? /*html*/ `<div class='files-label'>${label}</div>` : ''}
                <div class='files-table-container'>
                    ${createFilesTable(files)}
                </div>
                <div class='files-add-button-container'>
                    <div class='files-add-button'>Add file</div>
                    <!-- Hidden file input -->
                    <input type='file' multiple style='display: none;' id='drop-zone-files'>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
            }

            #id .files-table-container {
                border: solid 1px rgba(0, 0, 0, .05);
                padding: 10px;
                background: white;
                border-radius: 4px;
            }

            .files-label {
                font-size: ${labelSize || '1.1em'};
                font-weight: ${labelWeight || 'bold'};
                padding: 5px 0px;
            }

            #id th,
            #id td {
                padding: 5px 15px;
                /* white-space: nowrap; */
            }

            #id td:nth-child(2) {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 300px;
            }

            #id .remove {
                cursor: pointer;
                /* margin-left: 20px; */
                /* background: firebrick;
                color: white; */
                color: crimson;
                font-weight: 700;
                border-radius: 4px;
                /* font-size: .8em; */
                font-size: 1.5em;
                line-height: 0;
            }

            /** Icons */
            .file-icon {
                display: inline-block;
                position: relative;
                margin-right: 5px;
            }

            .file-icon .page {
                font-size: 2em;
                stroke: ${App.get('defaultColor')};
                fill: ${App.get('defaultColor')}
            }

            .file-icon .type {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                font-size: 1em;
            }
            
            /** None */
            #id .none {
                font-size: 1em;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
            }

            /** Button */
            .files-add-button-container {
                display: flex;
                justify-content: flex-end;
                margin: 10px 0px 0px 0px;
            }

            .files-add-button {
                cursor: pointer;
                padding: 5px 10px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
                color: ${App.get('secondaryColor')};
                background: ${App.get('primaryColor')};
                border: solid 2px ${App.get('primaryColor')};
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .files-add-button',
                event: 'click',
                listener(event) {
                    const fileInput = component.find(`input[type='file']`);

                    /** Empty files value */
                    fileInput.value = '';

                    if (fileInput) {
                        fileInput.click();
                    }
                }
            },
            {
                selector: `#id input[type='file']`,
                event: 'change',
                async listener(event) {
                    const files = event.target.files;

                    if (files.length > 0 && onAdd) {
                        onAdd(files);
                    }
                }
            },
            {
                selector: '#id .remove',
                event: 'click',
                listener: removeRow
            }
        ]
    });

    function createFilesTable(files) {
        let html = '';

        if (files.length > 0) {
            html += /*html*/ `
                <table class='files-table'>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Created</th>
                            <!-- <th>Author</th> -->
                            <th>Modified</th>
                            <!-- <th>Editor</th> -->
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            files.forEach(file => {
                html += fileTemplate(file);
            });

            html += /*html*/ `
                    </tbody>
                </table>
            `;
        } else {
            html += /*html*/ `
                <div class='none'>None</div>
            `;
        }

        return html;
    }

    function fileTemplate(file) {
        const {
            id,
            name,
            created,
            author,
            authorAccount,
            modified,
            editor,
            uri
        } = file;

        const ext = name.split('.').pop();

        return /*html*/ `
            <tr class='file-row' data-uri="${uri}" data-itemid='${id}' data-name='${name}'>
                <td>
                    <div class='file-icon'>
                        <svg class='icon page'><use href='#icon-file-empty'></use></svg>
                        <svg class='icon type'><use href='#icon-${selectIcon(ext)}'></use></svg>
                    </div>
                </td>
                <td>
                    <span>
                        <a href='../../${list}/${name}' title='${name}' target='_blank'>${name}</a>
                    </span>
                </td>
                <td>
                    <div>${author}</div>
                    <div>${created}</div>
                </td>
                <!-- <td>${author}</td> -->
                <td>
                    <div>${editor}</div>
                    <div>${modified}</div>
                </td>
                <!-- <td>${editor}</td> -->
                <td>
                    ${remove || authorAccount === App.user.Account ? /*html*/ `<span class='remove'>&times;</span>` : ''}
                </td>
            </tr>
        `;
    }

    function selectIcon(ext) {
        switch (ext.toLowerCase()) {
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

    async function removeRow(event) {
        const row = event.target.closest('.file-row');
        const check = confirm(`Are you sure you want to delete '${row.dataset.name}'?`);

        if (check) {
            await DeleteItem({
                list,
                itemId: parseInt(row.dataset.itemid)
            });

            row.remove();

            const rows = component.findAll('.file-row');

            if (rows.length === 0) {
                component.find('.files-table-container').innerHTML = createFilesTable([]);
            }

            if (onDelete) {
                onDelete()
            }
        }
    }


    component.addFile = (file) => {
        /** Check if file already exists in table */
        const row = component.find(`.file-row[data-itemid='${file.id}']`);

        if (row) {
            console.log('already in table');

            return;
            /** add updated message */
        }

        /** Add file row to table */
        const tbody = component.find('.files-table tbody');

        if (tbody) {
            tbody.insertAdjacentHTML('beforeend', fileTemplate(file));
        } else {
            component.find('.files-table-container').innerHTML = createFilesTable([file]);
        }

        /** Add remove event listener*/
        component.find(`.file-row[data-itemid='${file.id}'] .remove`).addEventListener('click', removeRow);
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function FixedToast(param) {
    const {
        top,
        bottom,
        left,
        right,
        title,
        message,
        action,
        onClose,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='fixed-toast slide-in inverse-colors'>
                <div class='fixed-toast-title'>
                    <strong class='mr-auto'>${title}</strong>
                    <button type='button' class='ml-4 mb-1 close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </div>
                <div class='fixed-toast-message'>
                    ${message}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.fixed-toast {
                position: fixed;
                z-index: 1000;
                font-size: 1em;
                max-width: 385px;
                padding: 20px;
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
                border-radius: 4px;
                ${top ?
                `top: ${top};` :
                ''
            }
                ${bottom ?
                `bottom: ${bottom};` :
                ''
            }
                ${left ?
                `left: ${left};` :
                ''
            }
                ${right ?
                `right: ${right};` :
                ''
            }
            }

            #id.inverse-colors {
                background: ${App.get('primaryColor')};
            }

            #id.inverse-colors * {
                color: white;
            }

            /** Slide In */
            .slide-in {
                animation: slidein 500ms ease-in-out forwards;
            }

            /** Slide Out */
            .slide-out {
                animation: slideout 500ms ease-in-out forwards;
            }

            /* Close */
            #id .close {
                outline: none;
            }

            /* Title */
            #id .fixed-toast-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            /** Message */
            #id .fixed-toast-message {
                cursor: pointer;
            }

            @keyframes slidein {
                from {
                    /* opacity: 0; */
                    transform: translate(400px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(-10px);
                }
            }

            @keyframes slideout {
                from {
                    /* opacity: 0; */
                    transform: translate(-10px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(400px);
                }
            }
        `,
        position,
        parent,
        events: [
            {
                selector: '#id .fixed-toast-message',
                event: 'click',
                listener: action
            },
            {
                selector: '#id .close',
                event: 'click',
                listener(event) {
                    /** Run close callback */
                    if (onClose) {
                        onClose(event);
                    }

                    /** Animate and remove component */
                    component.get().addEventListener('animationend', event => {
                        console.log('end slide out');

                        component.remove();
                    });

                    component.get().classList.remove('slide-in');
                    component.get().classList.add('slide-out');
                }
            }
        ]
    });

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function FoldingCube(param) {
    const {
        label,
        margin,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='folding-cube-container'>
                <div class='folding-cube-label'>${label || ''}</div>
                <div class="sk-folding-cube">
                    <div class="sk-cube1 sk-cube"></div>
                    <div class="sk-cube2 sk-cube"></div>
                    <div class="sk-cube4 sk-cube"></div>
                    <div class="sk-cube3 sk-cube"></div>
                </div>
            <div>
        `,
        style:  /*css*/ `
            /** Container */
            .folding-cube-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: ${margin || '0px'};;
            }

            /** Label */
            .folding-cube-label {
                font-weight: 400;
                color: ${App.get('primaryColor')};
            }

            /** Folding cube1 */
            .sk-folding-cube {
                margin: 20px auto;
                width: 40px;
                height: 40px;
                position: relative;
                -webkit-transform: rotateZ(45deg);
                transform: rotateZ(45deg);
            }

            .sk-folding-cube .sk-cube {
                float: left;
                width: 50%;
                height: 50%;
                position: relative;
                -webkit-transform: scale(1.1);
                -ms-transform: scale(1.1);
                transform: scale(1.1); 
            }

            .sk-folding-cube .sk-cube:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${App.get('primaryColor')};
                -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
                animation: sk-foldCubeAngle 2.4s infinite linear both;
                -webkit-transform-origin: 100% 100%;
                -ms-transform-origin: 100% 100%;
                transform-origin: 100% 100%;
            }

            .sk-folding-cube .sk-cube2 {
                -webkit-transform: scale(1.1) rotateZ(90deg);
                transform: scale(1.1) rotateZ(90deg);
            }

            .sk-folding-cube .sk-cube3 {
                -webkit-transform: scale(1.1) rotateZ(180deg);
                transform: scale(1.1) rotateZ(180deg);
            }

            .sk-folding-cube .sk-cube4 {
                -webkit-transform: scale(1.1) rotateZ(270deg);
                transform: scale(1.1) rotateZ(270deg);
            }

            .sk-folding-cube .sk-cube2:before {
                -webkit-animation-delay: 0.3s;
                animation-delay: 0.3s;
            }

            .sk-folding-cube .sk-cube3:before {
                -webkit-animation-delay: 0.6s;
                animation-delay: 0.6s; 
            }

            .sk-folding-cube .sk-cube4:before {
                -webkit-animation-delay: 0.9s;
                animation-delay: 0.9s;
            }

            @-webkit-keyframes sk-foldCubeAngle {
                0%, 10% {
                    -webkit-transform: perspective(140px) rotateX(-180deg);
                    transform: perspective(140px) rotateX(-180deg);
                    opacity: 0; 
                } 
                
                25%, 75% {
                    -webkit-transform: perspective(140px) rotateX(0deg);
                    transform: perspective(140px) rotateX(0deg);
                    opacity: 1; 
                } 
                
                90%, 100% {
                    -webkit-transform: perspective(140px) rotateY(180deg);
                    transform: perspective(140px) rotateY(180deg);
                    opacity: 0; 
                } 
            }
          
            @keyframes sk-foldCubeAngle {
                0%, 10% {
                    -webkit-transform: perspective(140px) rotateX(-180deg);
                    transform: perspective(140px) rotateX(-180deg);
                    opacity: 0; 
                } 
                
                25%, 75% {
                    -webkit-transform: perspective(140px) rotateX(0deg);
                    transform: perspective(140px) rotateX(0deg);
                    opacity: 1; 
                } 
                
                90%, 100% {
                    -webkit-transform: perspective(140px) rotateY(180deg);
                    transform: perspective(140px) rotateY(180deg);
                    opacity: 0; 
                }
            }
        `,
        parent,
        position,
        events: [

        ]
    });

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Heading(param) {
    const {
        text,
        size,
        color,
        height,
        weight,
        margin,
        padding,
        parent,
        width,
        align
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='heading'>
                <div class='text'>${text}</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                height: ${height || 'unset'};
                display: flex;
                align-items: center;
                margin: ${margin || '50px 0px 20px 0px'};
                padding: ${padding || '0px'};
                width: ${width || 'initial'};
            }    

            #id .text {
                font-size: ${size || '1.25em'};
                font-weight: ${weight || '500'};
                color: ${color || App.get('primaryColor')};
                margin: 0px;
                text-align: ${align || 'left'};
            }

            #id .text * {
                color: ${color || App.get('primaryColor')};
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [

        ]
    });

    component.setHeading = (newTitle) => {
        component.find('.text').innerText = newTitle;
    }

    return component;
}

// TODO: increment install-console line number
/**
 * 
 * @param {*} param 
 * @returns 
 */
 export function InstallConsole(param) {
    const {
        text,
        close,
        margin,
        width,
        parent,
        position
    } = param;

    let {
        type
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='alert alert-${type}' role='alert'${margin ? ` style='margin: ${margin};'` : ''}>
                ${text}
                ${close ?
                    /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''
            }
            </div>
        `,
        style: /*css*/ `
            #id {
                font-size: 14px;
                border-radius: 10px;
                border: none;
            }
            
            #id *:not(button) {
                color: inherit;
            }

            #id.alert-blank {
                padding: 0px;    
            }
            
            ${width ?
                /*css*/ `
                    #id {
                        width: ${width};
                    }
                ` :
                ''
            }
        `,
        parent,
        position
    });

    component.update = (param) => {
        const {
            type: newType,
            text: newText
        } = param;

        const alert = component.get();

        if (type) {
            alert.classList.remove(`alert-${type}`);
            alert.classList.add(`alert-${newType}`);

            type = newType;
        }

        if (text) {
            alert.innerHTML = newText;
        }
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function ItemInfo(param) {
    const {
        item,
        width,
        maxWidth,
        position,
        parent,
    } = param;

    const {
        Created,
        Modified,
        Editor,
        Author
    } = item;

    const createdDate = new Date(Created);
    const modifiedDate = new Date(Modified);

    const component = Component({
        html: /*html*/ `
            <div>
                <table>
                    <tr>
                        <th>Created</th>
                        <td>${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}</td>
                    </tr>
                    <tr>
                        <th class='gap'></th>
                        <td class='gap'>${Author.Title}</td>
                    </tr>
                    <tr>
                        <th>Last modified</th>
                        <td>${modifiedDate.toLocaleDateString()} ${modifiedDate.toLocaleTimeString()}</td>
                    </tr>
                    <tr>
                        <th></th>
                        <td>${Editor.Title}</td>
                    </tr>
                </table>
            </div>

            <!--
            <div class='item-info'>
                <div class=item-info-group>
                    <div class='item-info-row'>
                        <span class='item-info-label'>Created</span>
                        <span class='item-info-value'>${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}</span>
                    </div>
                    <div class='item-info-row'>
                        <span class='item-info-label'>Created by</span>
                        <span class='item-info-value'>${Author.Title}</span>
                    </div>
                </div>
                <div class=item-info-group>
                    <div class='item-info-row'>
                        <span class='item-info-label'>Last Modified</span>
                        <span class='item-info-value'>${modifiedDate.toLocaleDateString()} ${modifiedDate.toLocaleTimeString()}</span>
                    </div>
                    <div class='item-info-row'>
                        <span class='item-info-label'>Last Modified by</span>
                        <span class='item-info-value'>${Editor.Title}</span>
                    </div>
                </div>
            </div>
            -->
        `,
        style: /*css*/ `
            #id {
                font-size: .8em;
                margin-top: 40px;
                width: ${width || '100%'};
                max-width: ${maxWidth || '100%'};
                display: flex;
                justify-content: flex-end;
            }

            #id table th {
                text-align: right;
                padding-right: 10px;
            }

            #id table .gap {
                padding-bottom: 15px;
            }

            /*
            #id .item-info-group {
                margin-bottom: 15px;
            }

            #id .item-info-label {
                font-weight: 500;
                min-width: 120px;
            }
            */
        `,
        parent,
        position,
        events: [

        ]
    });

    component.modified = item => {
        const {
            Modified,
            Editor,
        } = item;

        const modifiedDate = new Date(Modified);
        const node = component.find('.item-info-modified');

        node.innerHTML = /*html*/ `<b>Last modified on</b> ${modifiedDate.toLocaleDateString()} <b>at</b> ${modifiedDate.toLocaleTimeString()} <b>by</b> ${Editor.Title}`;
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function LoadingBar(param) {
    const {
        displayTitle,
        displayLogo,
        displayText,
        loadingBar,
        onReady,
        parent,
        totalCount
    } = param;

    const logoPath = App.get('mode') === 'prod' ? '../Images' : `${App.get('site')}/src/Images`;

    const component = Component({
        html: /*html*/ `
            <div class='loading-bar'>
                <div class='loading-message'>
                    <!-- <div class='loading-message-logo'></div> -->
                    <img class='loading-message-logo' src='${logoPath}/${displayLogo}' />
                    <div class='loading-message-title'>${displayTitle}</div>
                    <div class='loading-bar-container ${loadingBar || ''}'>
                        <div class='loading-bar-status'></div>
                    </div>
                    <div class='loading-message-text'>${displayText || ''}</div>
                </div>
            </div>
        `,
        style:  /*css*/ `
            .loading-bar {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 50%;
                height: 100%;
                margin: auto;
                position: absolute;
                top: 0px; 
                left: 0; 
                bottom: 0;
                right: 0;
                animation: fadein 350ms ease-in-out forwards;
                transform: translateY(36px);
            }

            .loading-message {
                /* width: 90%; */
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .loading-message-title{
                font-family: 'M PLUS Rounded 1c', sans-serif; /* FIXME: experimental */
                font-size: 3em; /* original value 3em */
                font-weight: 700;
                text-align: center;
            }

            /** TURNED OFF */
            .loading-message-text {
                display: none;
                min-height: 36px;
                font-size: 1.5em;
                font-weight: 400;
                text-align: center;
            }

            .loading-bar-container {
                width: 90%; /** original value 15% */
                margin-top: 15px;
                background: lightgray;
                border-radius: 10px;
            }
            
            .loading-bar-status {
                width: 0%;
                height: 15px;
                background: lightslategray;
                border-radius: 10px;
                transition: width 100ms ease-in-out;
            }

            .hidden {
                opacity: 0;
            }

            /* Logo */
            #id .loading-message-logo {
                max-width: 193px;
            }

            @keyframes fadein {
                from {
                    opacity: 0;
                    transform: scale(0);
                }

                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .fadeout {
                animation: fadeout 350ms ease-in-out forwards;
            }

            @keyframes fadeout {
                from {
                    opacity: 1;
                    transform: scale(1);
                    
                }

                to {
                    opacity: 0;
                    transform: scale(0);
                }
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '.loading-bar',
                event: 'listItemsReturned',
                listener() {
                    component.update(++counter);
                }
            },
            {
                selector: '.loading-bar',
                event: 'animationend',
                listener: ready
            }
        ]
    });

    function ready(event) {
        if (onReady) {
            onReady(event);
        }

        component.get().removeEventListener('animationend', ready);
    }

    let counter = 1;

    component.update = (param = {}) => {
        const {
            newDisplayText
        } = param;

        const progressBar = component.get();
        const statusBar = progressBar.querySelector('.loading-bar-status');
        const text = progressBar.querySelector('.loading-message-text');
        const percentComplete = (counter / totalCount) * 100;

        if (newDisplayText) {
            text.innerText = newDisplayText;
        }

        if (statusBar) {
            statusBar.style.width = `${percentComplete}%`;
            counter++;
        }
    }

    component.end = () => {
        return new Promise((resolve, reject) => {
            const loadingBar = component.get();

            if (loadingBar) {
                loadingBar.classList.add('fadeout');

                loadingBar.addEventListener('animationend', (event) => {
                    loadingBar.remove();
                    resolve(true);
                });
            }
        });
    }

    component.showLoadingBar = () => {
        component.find('.loading-bar-container').classList.remove('hidden');
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
 export function ProgressBar(param) {
    const {
        parent,
        totalCount
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='loading-bar-container'>
                <div class='loading-bar-status'></div>
            </div>
        `,
        style:  /*css*/ `
            .loading-bar-container {
                width: 100%;
                margin: 1rem 0rem;
                background: lightgray;
                border-radius: 10px;
            }
            
            .loading-bar-status {
                width: 0%;
                height: 15px;
                background: lightslategray;
                border-radius: 10px;
                transition: width 100ms ease-in-out;
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '.loading-bar',
                event: 'listItemsReturned',
                listener() {
                    component.update(++counter);
                }
            }
        ]
    });

    let counter = 1;

    component.update = () => {
        const progressBar = component.get();
        const statusBar = progressBar.querySelector('.loading-bar-status');
        const percentComplete = (counter / totalCount) * 100;

        if (statusBar) {
            statusBar.style.width = `${percentComplete}%`;
            counter++;
        }
    }

    component.showLoadingBar = () => {
        component.find('.loading-bar-container').classList.remove('hidden');
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function MainContainer(param) {
    const {
        parent
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='maincontainer'></div>
        `,
        style: /*css*/ `
            .maincontainer {
                position: relative;
                padding: 40px; /* 15px 30px; */
                flex: 1;
                height: 100vh;
                overflow: overlay;
            }

            .maincontainer.dim {
                filter: blur(25px);
                user-select: none;
                overflow: hidden,
            }
        `,
        parent,
        position: 'beforeend',
        events: []
    });

    component.dim = (toggle) => {
        const maincontainer = component.get();

        if (toggle) {
            maincontainer.classList.add('dim');
        } else {
            maincontainer.classList.remove('dim');
        }
    }

    component.paddingOff = () => {
        component.get().style.padding = '0px';
    }

    component.paddingOn = () => {
        component.get().style.padding = '40px'; // 15px 30px;
    }

    component.eventsOff = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'none';
        });
    }

    component.eventsOn = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'initial';
        });
    }
    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Modal(param) {
    const {
        title,
        addContent,
        buttons,
        centered,
        fade,
        background,
        fullSize,
        showFooter,
        scrollable,
        parent,
        disableBackdropClose,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <!-- Modal -->
            <!-- <div class='modal${fade ? ' fade' : ''}' tabindex='-1' role='dialog' aria-hidden='true'> -->
            <div class='modal fade' tabindex='-1' role='dialog' aria-hidden='true' ${disableBackdropClose ? 'data-keyboard="false" data-backdrop="static"' : ''}>
                <!-- <div class='modal-dialog modal-dialog-zoom ${scrollable !== false ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'> -->
                <div class='modal-dialog modal-dialog-zoom ${scrollable ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'>
                    <div class='modal-content'>
                        ${
                            title ?
                                /*html*/ `<div class='modal-header'>
                                    <h5 class='modal-title'>${title || ''}</h5>
                                    <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                                        <!-- <span aria-hidden='true'>&times;</span> -->
                                        <span aria-hidden='true'>Close</span>
                                    </button>
                                </div>`
                            : ''
                        }
                        <div class='modal-body'>
                            <!-- Form elements go here -->
                        </div>
                        <div class='modal-footer${showFooter ? '' : ' hidden'}'>
                            ${addFooterButtons()}
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /** Title */
            #id .modal-title {
                color: ${App.get('primaryColor')};
            }

            /* Override default bootstrap padding */
            /* #id .modal-header {
                padding: 40px 40px 0px 40px;
            }

            #id .modal-body{
                padding: 40px;
            }

            #id .modal-footer {
                padding: 0px 40px 40px 40px;;
            } */

            /** Modal Dialog */
            /* 
            #id .modal-dialog {
                max-height: -webkit-fill-available;
                overflow: overlay;
                border-radius: 4px;
            }

            @media (min-width: 576px) {
                #id .modal-dialog {
                    margin: 1.6rem auto; 
                }
            } */

            #id.modal {
                overflow-y: overlay;
            }

            #id.modal.show {
                padding-left: 0px !important;
            }

            /** Modal Content */
            #id .modal-content {
                border-radius: 10px;
                border: none;
                background: ${background || ''};
            }

            /** Modal Body */
            #id .modal-body {

            }

            /** Header */
            #id .modal-header {
                border-bottom: none;
            }
            
            /** Footer */
            #id .modal-footer {
                border-top: none;
            }

            /** Button radius */
            #id .btn {
                border-radius: 10px;
            }

            #id .btn * {
                color: inherit;
            }

            /** Button color */
            #id .btn-success {
                background: seagreen;
                border: solid 1px seagreen;
            }

            #id .btn-primary {
                background: royalblue;
                border: solid 1px royalblue;
            }

            #id .btn-danger {
                background: firebrick;
                border: solid 1px firebrick;
            }

            #id .btn-secondary {
                background: none;
                border: solid 1px transparent;
                color: ${App.get('defaultColor')};
                font-weight: 500;
            }

            /** Button focus */
            #id .btn:focus {
                box-shadow: none;
            }

            /** Close focus */
            #id .close:focus {
                outline: none;
            }

            /** Close */
            #id .close {
                font-size: 1em;
                font-weight: 500;
                text-shadow: unset;
                opacity: 1;
            }

            #id .close span {
                color: ${App.get('primaryColor')};
            }

            /** Footer */
            #id .modal-footer.hidden {
                display: none;
            }

            /** Zoom in */
            #id.fade {
                transition: opacity 75ms linear;
            }

            #id.modal.fade .modal-dialog {
                transition: transform 150ms ease-out, -webkit-transform 150ms ease-out;
            }

            #id.modal.fade .modal-dialog.modal-dialog-zoom {
                -webkit-transform: translate(0,0)scale(.5);
                transform: translate(0,0)scale(.5);
            }
            #id.modal.show .modal-dialog.modal-dialog-zoom {
                -webkit-transform: translate(0,0)scale(1);
                transform: translate(0,0)scale(1);
            }

            /** Override bootstrap defaults */
            ${fullSize ?
                /*css*/ `
                    #id .modal-lg, 
                    #id .modal-xl,
                    #id .modal-dialog {
                        max-width: initial !important;
                        margin: 40px !important;
                    }
                ` :
                ''
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .btn`,
                event: 'click',
                listener(event) {
                    const button = buttons.footer.find(item => item.value === event.target.dataset.value);

                    if (button && button.onClick) {
                        button.onClick(event);
                    }
                }
            }
        ],
        onAdd() {
            $(`#${component.get().id}`).modal();

            if (addContent) {
                addContent(component.getModalBody());
            }

            /** Close listener */
            $(component.get()).on('hidden.bs.modal', function (e) {
                component.remove();
            });

            if (title) {
                /** Scroll listener */
                component.find('.modal-body').addEventListener('scroll', event => {
                    if (event.target.scrollTop > 0) {
                        event.target.style.borderTop = `solid 1px ${App.get('sidebarBorderColor')}`;
                    } else {
                        event.target.style.borderTop = `none`;
                    }
                });
            }
        }
    });

    function addFooterButtons() {
        let html = '';

        if (buttons && buttons.footer && Array.isArray(buttons.footer) && buttons.footer.length > 0) {
            // Delete button on left
            const deleteButton = buttons.footer.find(button => button.value.toLowerCase() === 'delete');

            if (deleteButton) {
                const { value, disabled, data, classes, inlineStyle } = deleteButton;
                html += /*html*/ `
                    <div style='flex: 2'>
                        <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                    </div>
                `
            }

            html += /*html*/ `
                <div>
            `
            
            // All other buttons on right
            buttons.footer
            .filter(button => button.value.toLowerCase() !== 'delete')
            .forEach(button => {
                const {
                    value,
                    disabled,
                    data,
                    classes,
                    inlineStyle
                } = button;

                html += /*html*/ `
                    <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                `;
            });

            html += /*html*/ `
                </div>
            `
        }

        return html;
    }

    function buildDataAttributes(data) {
        if (!data) {
            return '';
        }

        return data
            .map(attr => {
                const {
                    name,
                    value
                } = attr;

                return `data-${name}='${value}'`
            })
            .join(' ');
    }

    component.getModalBody = () => {
        return component.find('.modal-body');
    }

    component.hideFooter = () => {
        component.find('.modal-footer').classList.add('hidden');
    }

    component.showFooter = () => {
        component.find('.modal-footer').classList.remove('hidden');
    }

    component.getModal = () => {
        return $(`#${component.get().id}`);
    }

    component.close = () => {
        return $(`#${component.get().id}`).modal('hide');
    }

    component.getButton = value => {
        return component.find(`button[data-value='${value}']`);
    }

    component.scrollable = value => {
        if (value === true) {
            component.find('.modal-dialog').classList.add('modal-dialog-scrollable');
        } else if (value === false) {
            component.find('.modal-dialog').classList.remove('modal-dialog-scrollable');
        }
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function MultiLineTextField(param) {
    const {
        label,
        labelSize,
        description,
        optional,
        value,
        readOnly,
        placeHolder,
        parent,
        position,
        minHeight,
        width,
        fieldMargin,
        fontWeight,
        fontSize,
        padding,
        onKeydown,
        onFocusout
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/`<label>${label}${optional ? /*html*/ `<span class='optional'><i>Optional</i></span>` : ''}</label>` : ''}
                ${description ? /*html*/`<div class='form-field-description'>${description}</div>` : ''}
                ${readOnly ? /*html*/ `<div class='form-field-multi-line-text readonly'>${value || placeHolder}</div>` : /*html*/ `<div class='form-field-multi-line-text editable' contenteditable='true'>${value || ''}</div>`}
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                width: inherit;
            }

            #id label {
                font-size: .95em;
                font-weight: bold;
                padding: 3px 0px;
            }

            #id .form-field-description {
                font-size: .95em;
                font-weight: 400;
                padding-left: 5px;
                padding-top: 5px;
                margin-bottom: 15px;
            }

            #id .form-field-multi-line-text {
                font-size: 1em;
                font-weight: ${fontWeight || '500'};
                font-size: ${fontSize || '.85em'};
                margin-top: 2px;
                margin-bottom: 4px;
                padding: ${padding || '10px'};
            }

            #id .form-field-multi-line-text.editable {
                min-height: ${minHeight || `200px`};
                width: ${width || 'unset'};
                background: white;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
                transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            #id .form-field-multi-line-text.editable:active,
            #id .form-field-multi-line-text.editable:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${App.get('primaryColor')};
            }

            /** Readonly */
            #id .form-field-multi-line-text.readonly {
                user-select: none;
                background: transparent;
                border: solid 1px rgba(0, 0, 0, .05);
                background: white;
                border-radius: 4px;
            }

            /* Optional */
            #id .optional {
                margin: 0px 5px;
                font-size: .8em;
                color: gray;
                font-weight: 400;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'focusout',
                listener: onFocusout
            },
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'keydown',
                listener: onKeydown
            }
        ]
    });

    component.focus = () => {
        const field = component.find('.form-field-multi-line-text');

        field.focus();
    }

    component.value = (param, options = {}) => {
        const field = component.find('.form-field-multi-line-text');

        if (param !== undefined) {
            field.innerHTML = param;
        } else {
            if (options.plainText === true) {
                return field.innerText;
            } else {
                return field.innerHTML;
            }
        }
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function MultiSelectCheckbox(param) {
    const {
        label,
        description,
        options,
        onCheck,
        direction,
        wrap,
        parent,
        width,
        position,
        margin,
        padding,
        fieldMargin
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<div class='form-field-label'>${label}</div>` : ''}
                ${description ? /*html*/`<div class='form-field-description'>${description}</div>` : ''}
                ${createChoiceGroups()}
            </div>   
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .form-field-description {
                padding: 5px 0px;
            }

            #id .form-field-multi-select-container {
                display: flex;
                flex-direction: ${direction || 'column'};
                flex-wrap: ${wrap || 'wrap'};
                user-select: none;
                /*margin: 2px 20px;*/
                padding: ${padding || '0px 0px 20px 0px'};
                margin: ${margin || '0px'};
            }

            #id .form-field-multi-select-container:last-child {
                padding: 0px;
            }

            #id .form-field-multi-select-row {
                width: ${width || '120px'};
                /* margin-left: 20px; */
                display: flex;
                flex-direction: row;
                align-items: center;
            }

            #id .form-field-multi-select-row.flex-start {
                width: ${width || '120px'};
                margin-left: 20px;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
            }

            #id .form-field-multi-select-row.flex-start .form-field-multi-select-value,
            #id .form-field-multi-select-row.flex-start .select-all-title {
                margin-top: 2px;
            }

            ${direction === 'row' ?
                /*css*/`
                    #id .form-field-multi-select-row {
                        margin-left: 20px;
                        margin-bottom: 10px;
                    }
                ` :
                ''
            }

            #id .form-field-multi-select-value,
            #id .select-all-title {
                margin-left: 5px;
            }

            #id .select-all-title {
                color: ${App.get('primaryColor')};
                font-weight: 500;
                padding: 5px 0px;
            }

            #id input[type='checkbox'] {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            #id input[type='checkbox'] ~ .toggle {
                width: 20px;
                height: 20px;
                position: relative;
                display: inline-block;
                vertical-align: middle;
                background: white;
                border: solid 2px lightgray;
                border-radius: 4px;
                cursor: pointer;
            }

            #id input[type='checkbox']:hover ~ .toggle {
                border-color: mediumseagreen;
            }
            

            #id input[type='checkbox']:checked ~ .toggle {
                border: solid 2px mediumseagreen;
                background: mediumseagreen url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
            }

            /** List Styles */
            #id ul {
                margin: 0px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id  input.select-all',
                event: 'change',
                listener: selectAll
            },
            {
                selector: '#id input:not(.select-all)',
                event: 'change',
                listener: toggleSelectALL
            }
        ]
    });

    function createChoiceGroups() {
        let html = ''

        options.forEach(group => {
            const {
                title,
                items,
                align
            } = group;

            html += /*html*/ `
                <div class='form-field-multi-select-container' data-group='${title}'>
            `;

            if (title !== '') {
                html += /*html*/ `
                    <div class='form-field-multi-select-row ${align}'>
                        <label>
                            <input type='checkbox' class='select-all' data-group='${title}'>
                            <span class='toggle'></span>
                        </label>
                        <span class='select-all-title'>${title}<span>
                    </div>
                `;
            }

            items.forEach(item => {
                html += rowTemplate(item, title, align);
            });

            html += /*html*/ `
                </div>
            `
        });

        return html;
    }

    function rowTemplate(item, group, align) {
        const {
            id,
            value,
            checked
        } = item;

        return /*html*/ `
            <div class='form-field-multi-select-row ${align}'>
                <label>
                    <input type='checkbox' data-group='${group}' data-value='${value}' data-itemid='${id}'${checked ? ' checked' : ''}>
                    <span class='toggle'></span>
                </label>
                <span class='form-field-multi-select-value'>${value}<span>
            </div>
        `;
    }

    /** Select all Radio buttons in group */
    function selectAll(event) {
        const group = this.dataset.group;
        const state = this.checked;
        const radioButtons = component.findAll(`input[data-group='${group}']`);

        radioButtons.forEach(button => {
            button.checked = state;
        });
    }

    /** Auto toggle Group Title Radio button */
    function toggleSelectALL(event) {
        const group = this.dataset.group;
        const all = component.findAll(`input[data-group='${group}']:not(.select-all)`).length;
        const checked = component.findAll(`input[data-group='${group}']:not(.select-all):checked`).length;
        const state = all === checked ? true : false;

        const selectAll = component.find(`input.select-all[data-group='${group}']`);

        if (selectAll) {
            selectAll.checked = state;
        }

        if (onCheck) {
            onCheck(event);
        }
    }

    component.setValue = (itemId, value) => {
        const checkbox = component.find(`input[data-itemid='${itemId}']`);

        if (checkbox) {
            checkbox.checked = value;
        }
    }

    component.addOption = (param) => {
        const {
            option,
            group
        } = param;

        const container = component.find(`.form-field-multi-select-container[data-group='${group}']`);

        container.insertAdjacentHTML('beforeend', rowTemplate(option, group, true));
    }

    component.value = (type) => {
        const rows = component.findAll('.form-field-multi-select-row input:checked');

        return [...rows].map(item => {
            if (type === 'id') {
                return parseInt(item.dataset.itemid);
            }

            const value = item.closest('.form-field-multi-select-row').querySelector('.form-field-multi-select-value')

            return value.innerText;
        });
    }

    component.checked = () => {
        const rows = component.findAll('.form-field-multi-select-row input:checked');

        return [...rows].map(item => {
            const id = parseInt(item.dataset.itemid);
            const value = item.closest('.form-field-multi-select-row').querySelector('.form-field-multi-select-value').innerText;

            return {
                id,
                value
            };
        });
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function NameField(param) {
    const {
        label,
        description,
        fieldMargin,
        parent,
        position,
        onSelect,
        onClear,
        onSearch
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <div class='form-field-label'>${label}</div>
                ${description ? /*html*/`<div class='form-field-description'>${description}</div>` : ''}
                <div class='input-group'>
                    <div class='toggle-search-list' data-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                        <input class='form-field-name form-control mr-sm-2' type='search' placeholder='Search' aria-label='Search'>
                    </div>
                    <div class='dropdown-menu'>
                    <!-- Show search spinner by -->
                        <a href='javascript:void(0)' class='dropdown-item' data-path=''>
                            <span class='searching'>
                                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> 
                                Searching for CarePoint accounts...
                            <span>
                        </a>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            /* Labels */
            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .form-field-description {
                font-size: .9em;
                padding: 5px 0px;
            }

            #id .form-field-name {
                /* font-size: .9em; */
                /* font-weight: 500; */
                margin-top: 2px;
                margin-bottom: 4px;
                margin-right: 20px;
                min-height: 36px;
                max-width: 300px;
                min-width: 300px;
                padding: 5px 10px;
                background: white;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            #id .form-field-name::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 16px;
                width: 16px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill=''><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
            }

            #id .form-field-name:active,
            #id .form-field-name:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${App.get('primaryColor')};
            }

            /** Errors */
            #id span.alert-link:hover {
                cursor: pointer;
                text-decoration: underline;
            }

            /** Dropdown */
            #id .dropdown-menu {
                padding: 0px;
                overflow-y: overlay;
            }

            #id .dropdown-item-container {
                overflow-y: overlay;
            }

            #id .dropdown-menu a {
                outline: none;
                border: none;
            }
            
            #id .dropdown-item,
            #id .dropdown-item:focus,
            #id .dropdown-item:active, {
                cursor: pointer;
                outline: none;
                border: none;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .toggle-search-list`,
                event: 'keydown',
                listener(event) {
                    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !component.find('.dropdown-menu').classList.contains('show')) {
                        event.preventDefault();
                        event.stopPropagation();

                        return false;
                    }
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    if (!event.target.value) {
                        if (component.find('.dropdown-menu').classList.contains('show')) {
                            component.find('.toggle-search-list').click();
                        }

                        return;
                    }

                    /** Show dropdown menu  */
                    if (!component.find('.dropdown-menu').classList.contains('show')) {
                        component.find('.toggle-search-list').click();
                    }

                    /** Get menu node */
                    const menu = component.find('.dropdown-menu');

                    /** Reset list */
                    menu.innerHTML = /*html*/ `
                        <a href='javascript:void(0)' class='dropdown-item' data-path=''>
                            <span class='searching'>
                                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> 
                                Searching for CarePoint accounts...
                            <span>
                        </a>
                    `;

                    /** Search accounts */
                    searchSiteUsers(event);
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'click',
                listener(event) {
                    event.stopPropagation();
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'keydown',
                listener(event) {
                    if (event.key === 'Escape' || event.key === 'Backspace') {
                        component.find('.toggle-search-list').click();
                        component.find(`input[type='search']`).focus();

                        event.preventDefault();

                        return false;
                    }
                }
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'click',
                listener(event) {
                    /** Set input value */
                    component.find('.form-field-name').value = event.target.innerText;

                    /** Get item */
                    const item = data.find(user => user.info.Account === event.target.dataset.account);

                    /** Call passed in onSelect function */
                    onSelect({
                        event,
                        users: item.Info
                    });
                }
            }
        ]
    });

    /** Dropdown */
    function dropdownItemTemplate(item) {
        const {
            value,
            info
        } = item;

        const {
            Account
        } = info;

        return /*html*/ `
            <a href='javascript:void(0)' class='dropdown-item' data-account='${Account}'>${value}</a>
        `;
    }

    component.showSearchList = (param) => {
        const {
            items
        } = param;

        /** Get menu node */
        const menu = component.find('.dropdown-menu');

        /** Check if items exist*/
        if (items.length > 0) {
            /** Show if not open  */
            if (!menu.classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }

            menu.innerHTML = /*html*/ `
                <div class='dropdown-item-container'>
                    ${items.map(item => dropdownItemTemplate(item)).join('\n')}
                </div>
            `

        } else {
            if (menu.classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }
        }
    }

    /** Search site users */
    let queries = [];
    let data = [];

    async function searchSiteUsers(event) {
        event.preventDefault();

        /** Abort previous queries */
        queries.forEach(query => {
            query.abortController.abort();
        });

        const query = event.target.value.toLowerCase();

        if (query === '') {
            event.target.dataset.itemid = '';

            // resetMenu();
            // removeSpinner();

            console.log('reset');

            return;
        }

        removeNonefoundMessage();
        // addSpinner();

        const newSearch = GetSiteUsers({
            query
        });

        queries.push(newSearch);

        console.log(newSearch);

        const response = await newSearch.response;

        if (response) {
            data = response.map(user => {
                const {
                    Name
                } = user;

                return {
                    value: Name,
                    info: user
                };
            });

            if (data.length > 0) {
                // removeSpinner();
                // addDropDownMenu(event, data);
                component.showSearchList({
                    items: data
                });
            } else {
                // removeSpinner();
                addNoneFoundMessage();
            }
        }
    }

    /** Add none found message */
    function addNoneFoundMessage() {
        const message = component.find('.none-found');

        if (!message) {
            const html = /*html*/ `
                <span class='none-found' style='color: firebrick;'>
                    No accounts found that match this name.
                </span>
            `;

            component.get().insertAdjacentHTML('beforeend', html);
        }
    }

    /** Remove none found message */
    function removeNonefoundMessage() {
        const message = component.find('.none-found');

        if (message) {
            message.remove();
        }
    }

    component.focus = () => {
        const field = component.find('.form-field-name');

        field.focus();
    }

    component.addError = (param) => {
        /** Remove previous errors */
        component.removeError();

        /** Param can be a string or an object */
        let text = typeof param === 'object' ? param.text : param;

        /** Build error HTML */
        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
                    /*html*/ ` 
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                    `
                : ''
            }
            </div>
        `;

        /** Add HTML to DOM */
        component.find('.form-field-name').insertAdjacentHTML('beforebegin', html);

        /** Add Event Listeners to embedded links */
        component.findAll('.alert .alert-link').forEach(link => {
            link.addEventListener('click', event => {
                if (event.target.dataset.route) {
                    Route(event.target.dataset.route);
                }
            });
        });
    }

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    }

    component.value = (param) => {
        const nameField = component.find(`.form-field-name`);

        if (param) {
            nameField.innerText = param;
        } else if (param === '') {
            nameField.innerText = '';
        } else {
            const nameAndAccount = nameField.innerText.replace(' (US)', '').split(' - ');
            const fullName = nameAndAccount[0];
            const nameParts = fullName.split(', ');
            const lastName = nameParts[0];
            const firstNameParts = nameParts[1].split(' ');
            const firstName = firstNameParts[0];
            const command = firstNameParts[firstNameParts.length - 1];
            const accountParts = nameAndAccount[1].split('\\');
            const domain = accountParts[0];
            const account = accountParts[1];

            return {
                fullName,
                lastName,
                firstName,
                domain,
                account,
                command
            };
        }
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function NewReply(param) {
    const {
        width,
        action,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='comments-container'>
                <div class='new-reply-label'>New reply</div>
                <!-- New Comment -->
                <div class='new-comment-container'>
                    <div class='new-comment' contenteditable='true'></div>
                    <!-- Button -->
                    <div class='new-comment-button-container'>
                        <div class='new-comment-button'>
                            <svg class='icon'>
                                <use href='#icon-arrow-up2'></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            .comments-container {
                width: ${width || '100%'};
                max-height: 80vw;
                padding-bottom: 20px;
            }

            /* New Comment */
            #id .new-comment-container {
                display: flex;
                background: white;
                border-radius: 4px;
            }

            #id .new-comment {
                overflow-wrap: anywhere;
                flex: 2;
                font-size: .9em;
                font-weight: 500;
                padding: 10px 20px;
                border-radius: 4px 0px 0px 4px;
                border-left: solid 1px rgba(0, 0, 0, .1);
                border-top: solid 1px rgba(0, 0, 0, .1);
                border-bottom: solid 1px rgba(0, 0, 0, .1);
            }

            #id .new-comment:active,
            #id .new-comment:focus{
                outline: none;
                border-left: solid 1px ${App.get('primaryColor')};
                border-top: solid 1px ${App.get('primaryColor')};
                border-bottom: solid 1px ${App.get('primaryColor')};
            }

            #id .new-comment-button-container,
            #id .new-comment-button-container {
                border-radius: 0px 4px 4px 0px;
                border-right: solid 1px rgba(0, 0, 0, .1);
                border-top: solid 1px rgba(0, 0, 0, .1);
                border-bottom: solid 1px rgba(0, 0, 0, .1);
            }

            #id .new-comment:active ~ .new-comment-button-container,
            #id .new-comment:focus ~ .new-comment-button-container {
                border-radius: 0px 4px 4px 0px;
                border-right: solid 1px ${App.get('primaryColor')};
                border-top: solid 1px ${App.get('primaryColor')};
                border-bottom: solid 1px ${App.get('primaryColor')};
            }

            /* Button */
            #id .new-comment-button {
                cursor: pointer;
                display: inline-block;
                margin: 5px;
                padding: 5px 7.5px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
                color: white;
                background: ${App.get('primaryColor')};
            }

            #id .new-comment-button .icon {
                font-size: 1.2em;
            }

            /* Label */
            #id .new-reply-label {
                font-weight: 500;
                margin-bottom: 5px;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .new-comment',
                event: 'keydown',
                async listener(event) {
                    if (event.ctrlKey && event.key === 'Enter') {
                        event.preventDefault();

                        component.find('.new-comment-button').click();
                    }
                }
            },
            {
                selector: '#id .new-comment-button',
                event: 'click',
                async listener(event) {
                    const field = component.find('.new-comment');
                    const value = field.innerHTML;

                    if (value) {
                        action(value);

                        field.innerHTML = '';
                    } else {
                        console.log('new comment field is empty');
                    }
                }
            }
        ]
    });

    component.focus = () => {
        component.find('.new-comment').focus();
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function NumberField(param) {
    const {
        label,
        description,
        value,
        readOnly,
        parent,
        position,
        width,
        margin,
        padding,
        background,
        borderRadius,
        flex,
        maxWidth,
        fieldMargin,
        optional,
        onChange,
        onKeydown,
        onKeyup,
        onFocusout
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <label>${label}</label>
                <input type="number" class="form-control" value="${value !== undefined ? parseFloat(value) : ''}">
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            #id label {
                font-size: .95em;
                font-weight: bold;
                padding: 3px 0px;
            }

            #id input:active,
            #id input:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 1px ${App.get('primaryColor')};
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id input',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id input',
                event: 'keyup',
                listener: onKeyup
            },
            {
                selector: '#id input',
                event: 'focusout',
                listener: onFocusout
            },
            {
                selector: '#id input',
                event: 'change',
                listener: onChange
            }
        ]
    });

    component.focus = () => {
        const field = component.find('.form-field-single-line-text');

        field.focus();
    }

    component.addError = (param) => {
        component.removeError();

        let text = typeof param === 'object' ? param.text : param;

        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
                    /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''
            }
            </div>
        `;

        component.find('.form-field-single-line-text').insertAdjacentHTML('beforebegin', html);
    }

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    }

    component.value = (param) => {
        const field = component.find('input');

        if (param !== undefined) {
            field.value = parseFloat(param);
        } else {
            return field.value;
        }
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function PercentField(param) {
    const {
        label,
        description,
        value,
        readOnly,
        parent,
        position,
        width,
        margin,
        padding,
        background,
        borderRadius,
        flex,
        maxWidth,
        fieldMargin,
        optional,
        onKeydown,
        onFocusout
    } = param;

    let percentage = value !== undefined ? Math.round(parseFloat(value) * 100) : '';

    const component = Component({
        html: /*html*/ `
            <div>
                <label>${label}</label>
                <div class="input-group mb-3 ${setColor(percentage)}">
                    <input type="number" class="form-control" value="${percentage}" ${readOnly ? 'readonly' : ''}>
                    <div class="input-group-append">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                ${margin ? `margin: ${margin};` : ''}
            }

            #id label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
                margin-bottom: 0px;
            }

            #id input[readonly] {
                pointer-events: none;
            }

            /* Green */
            #id .input-group.green input,
            #id .input-group.green .input-group-text {
                background: #d4edda;
                border: solid 1px #c3e6cb;
                color: #155724;
            }

            /* Yellow */
            #id .input-group.yellow input,
            #id .input-group.yellow .input-group-text {
                background: #fff3cd;
                border: solid 1px #ffeeba;
                color: #856404;
            }

            /* Red */
            #id .input-group.red input,
            #id .input-group.red .input-group-text {
                background: #f8d7da;
                border: solid 1px #f5c6cb;
                color: #721c24;
            }

            #id input:active,
            #id input:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 1px ${App.get('primaryColor')};
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-field-single-line-text',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id .form-field-single-line-text',
                event: 'focusout',
                listener: onFocusout
            }
        ]
    });

    function setColor(percentage) {
        if (percentage >= 100) {
            return 'green';
        }

        if (percentage < 100 && percentage >= 50) {
            return 'yellow';
        }

        if (percentage < 50) {
            return 'red';
        }

        if (!percentage || isNaN(percentage)) {
            return '';
        }
    }

    component.focus = () => {
        const field = component.find('.form-field-single-line-text');

        field.focus();
    }

    component.addError = (param) => {
        component.removeError();

        let text = typeof param === 'object' ? param.text : param;

        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
                    /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''
            }
            </div>
        `;

        component.find('.form-field-single-line-text').insertAdjacentHTML('beforebegin', html);
    }

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    }

    component.value = (param) => {
        const field = component.find('input');

        if (param !== undefined) {
            percentage = Math.round(parseFloat(param) * 100);

            field.value = percentage;

            const inputGroup = component.find('.input-group');
            const color = setColor(percentage);

            inputGroup.classList.remove('green', 'yellow', 'red');

            if (color) {
                inputGroup.classList.add(color);
            }
        } else {
            return field.value;
        }
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function PhoneField(param) {
    const {
        label,
        parent,
        position,
        onSetValue
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <div class='form-field-label'>${label}</div>
                <div class='form-field-phone'>
                    <div class='form-field-phone-number form-field-phone-open'>(</div>
                    <div class='form-field-phone-number form-field-phone-areacode' contenteditable='true'></div>
                    <div class='form-field-phone-number form-field-phone-close'>)</div>
                    <div class='form-field-phone-number form-field-phone-prefix' contenteditable='true'></div>
                    <div class='form-field-phone-number form-field-phone-hyphen'>-</div>
                    <div class='form-field-phone-number form-field-phone-linenumber' contenteditable='true'></div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin-bottom: 20px;
            }

            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px;
            }

            #id .form-field-phone {
                width: 140px;
                font-size: .9em;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            #id .form-field-phone-number {
                display: inline-block;
            }

            #id .form-field-phone-number:active,
            #id .form-field-phone-number:focus {
                outline: none;
                border: none;
            }

            #id .form-field-phone-areacode {
                width: 22px;
            }

            #id .form-field-phone-prefix {
                width: 25px;
            }

            #id .form-field-phone-linenumber {
                width: 35px;
            }
            
            /** Focused */
            #id .focused {
                box-shadow: 0px 0px 0px 2px ${App.get('primaryColor')};
                border: solid 1px transparent;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .form-field-phone-number`,
                event: 'focusin',
                listener(event) {
                    component.find('.form-field-phone').classList.add('focused');
                }
            },
            {
                selector: `#id .form-field-phone-number`,
                event: 'focusout',
                listener(event) {
                    component.find('.form-field-phone').classList.remove('focused');
                }
            },
            {
                selector: `#id .form-field-phone-areacode`,
                event: 'keyup',
                listener(event) {
                    if (event.target.innerText.length === 3) {
                        component.find('.form-field-phone-prefix').focus();
                    }
                }
            },
            {
                selector: `#id .form-field-phone-prefix`,
                event: 'keyup',
                listener(event) {
                    if (event.target.innerText.length === 3) {
                        component.find('.form-field-phone-linenumber').focus();
                    }
                }
            },
            {
                selector: `#id .form-field-phone-linenumber`,
                event: 'keyup',
                listener(event) {
                    if (event.target.innerText.length === 4) {
                        component.find('.form-field-phone-prefix').focus();

                        onSetValue();
                    }
                }
            },
        ]
    });

    component.value = (param) => {
        const areacode = component.find('.form-field-phone-areacode');
        const prefix = component.find('.form-field-phone-prefix');
        const linenumber = component.find('.form-field-phone-linenumber');

        if (param) {
            const number = param.replace(/[^a-zA-Z0-9 ]/g, '');

            areacode.innerText = number.slice(0, 3);
            prefix.innerText = number.slice(3, 6);
            linenumber.innerText = number.slice(6, 10);
        } else {
            return areacode.innerText + prefix.innerText + linenumber.innerText;
        }
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Question(param) {
    const {
        question,
        margin,
        parent,
        onEdit,
        position
    } = param;

    const {
        Title,
        Body,
        Featured,
        Author,
        Editor,
        Created,
        Modified,
        replies
    } = question;

    const replyCount = replies.length;
    const lastReply = replies[0];

    const component = Component({
        html: /*html*/ `
            <div class='question'>
                <div class='card'>
                    <div class='card-body'>
                        <h5 class='card-title'>
                            <span class='title-text'>${Title}</span>
                            ${Featured ?
                                /*html*/ `
                                    <span class='badge badge-info' role='alert'>Featured</span>
                                ` :
                ''
            }
                        </h5>
                        <h6 class='card-subtitle mb-2 text-muted'>${Author.Title} ${formatDate(Created)}</h6>
                        <div class='card-text mb-2'>${Body || ''}</div>
                        <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title} ${formatDate(Modified)} ` : ''}</h6>
                    </div>
                    ${buildFooter(lastReply)}
                </div>
                ${Author.Name === Store.user().LoginName ?
                    /*html*/ `
                        <div class='edit-button-container'>
                            <button type='button' class='btn btn-primaryColor edit'>Edit question</button>
                        </div>
                    ` :
                ''
            }
                <div class='reply-count'>
                    <span class='reply-count-label'>Replies</span>
                    <span class='badge badge-secondary reply-count-value'>${replyCount}</span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
            }

            #id .card-subtitle {
                font-size: .9em;
                font-weight: 400;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            /** Edit button */
            #id .btn-primaryColor {
                background: ${App.get('primaryColor')};
                color: white;
            }

            #id .btn-primaryColor:focus,
            #id .btn-primaryColor:active {
                box-shadow: none;
            }
            
            #id .edit-button-container {
                display: flex;
                justify-content: flex-end;
                margin: 20px 0px;
            }

            /** Replies */
            #id .reply-count {
                margin: 20px 0px;
                font-size: 1.3em;
            }
            
            #id .badge-info {
                padding: 4px 8px;
                margin: 0px;
                font-weight: 400;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .edit',
                event: 'click',
                listener: onEdit
            }
        ]
    });

    function formatDate(date) {
        const thisDate = new Date(date);

        if (isToday(thisDate)) {
            // console.log('is today');
        }

        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
            hour: 'numeric',
            minute: 'numeric'
        })}
        `;
    }

    function isToday(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function isGreaterThanOneHour(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function buildFooter(lastReply) {
        if (lastReply) {
            return /*html*/ `
                <div class='card-footer question-last-reply'>
                   ${lastReplyTemplate(lastReply)}
                </div>
            `;
        } else {
            return '';
        }
    }

    function lastReplyTemplate(lastReply) {
        const {
            Author,
            Body,
            Created
        } = lastReply;

        return /*html*/ `
            <span>
                <span>Last reply by ${Author.Title}</span>
                <span>${formatDate(Created)}</span>
            </span>
            <p class='card-text mt-2'>${Body}</p>
        `;
    }

    function edited(created, modified) {
        // console.log(`CREATED:\t${formatDate(created)}`)
        // console.log(`MODIFIED:\t${formatDate(modified)}`);

        if (formatDate(created) !== formatDate(modified)) {
            return true;
        } else {
            return false;
        }
    }

    component.setQuestion = (param) => {
        const {
            Title,
            Body,
            Modified,
            Editor
        } = param;

        component.find('.title-text').innerHTML = Title;
        component.find('.card-text').innerHTML = Body || '';
        component.find('.edit-text').innerHTML = `Last edited by ${Editor.Title} ${formatDate(Modified)}`;
    }

    component.addCount = () => {
        const replyCount = component.find('.reply-count-value');

        replyCount.innerText = parseInt(replyCount.innerText) + 1;
    }

    component.updateLastReply = (reply) => {
        let footer = component.find('.card-footer');

        if (footer) {
            footer.innerHTML = lastReplyTemplate(reply);
        } else {
            component.find('.card').insertAdjacentHTML('beforeend', buildFooter(reply));
        }

    }

    component.editButton = () => {
        return component.find('.edit');
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function QuestionCard(param) {
    const {
        question,
        label,
        path,
        margin,
        parent,
        position
    } = param;

    const {
        Id,
        Title,
        Body,
        Featured,
        Author,
        Editor,
        Created,
        Modified,
        replies
    } = question;

    const replyCount = replies.length;
    const lastReply = replies.sort((a, b) => {
        a = a.Id;
        b = b.Id;

        /** Descending */
        if (a > b) {
            return -1;
        }

        if (a < b) {
            return 1;
        }

        // names must be equal
        return 0;
    })[0];

    const component = Component({
        html: /*html*/ `
            <div class='card'>
                <div class='card-body'>
                    <h5 class='card-title'>
                        <span>${Title}</span>
                        ${Featured ?
                            /*html*/ `
                                <span class='badge badge-info' role='alert'>Featured</span>
                            ` :
                ''
            }
                        ${label === 'new' ?
                            /*html*/ `
                                <span class='badge badge-warning' role='alert'>New</span>
                            ` :
                ''
            }
                        ${replyCount ?
                            /*html*/ `
                                <span class='reply-count'>
                                    <span class='reply-count-label'>Replies</span>
                                    <span class='badge badge-secondary'>${replyCount}</span>
                                </span>
                            ` :
                ''
            }
                    </h5>
                    <!-- <h6 class='card-subtitle mb-2 text-muted'>Asked by ${Author.Title} ${formatDate(Created)}</h6> -->
                    <h6 class='card-subtitle mb-2 text-muted'>${Author.Title} ${formatDate(Created)}</h6>
                    <div class='card-text mb-2'>${Body || ''}</div>
                    <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title} ${formatDate(Modified)} ` : ''}</h6>
                </div>
                ${buildFooter(lastReply)}
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                max-width: 700px;
                margin: ${margin || '0px'};
                cursor: pointer;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
            }

            #id .reply-count {
                margin-left: 1.25rem;
            }

            #id .reply-count-label {
                font-size: .8em;
                font-weight: 400;
            }

            #id .card-subtitle {
                font-size: .9em;
                font-weight: 400;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            #id .question-last-reply {
                font-size: .8em;
                font-weight: 400;
            }

            /** Alert */
            #id .badge-info {
                font-size: .8em;
                padding: 4px 8px;
                margin: 0px;
                font-weight: 400;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    Route(`${path}/${Id}`);
                }
            }
        ]
    });

    function formatDate(date) {
        const thisDate = new Date(date);

        if (isToday(thisDate)) {
            // console.log('is today');
        }

        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
            hour: 'numeric',
            minute: 'numeric'
        })}
        `;
    }

    function isToday(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function isGreaterThanOneHour(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }


    function buildFooter(lastReply) {
        if (lastReply) {
            const {
                Author,
                Body,
                Created
            } = lastReply;

            return /*html*/ `
                <div class='card-footer question-last-reply'>
                    <span>
                        <span>Last reply by ${Author.Title}</span>
                        <span>${formatDate(Created)}</span>
                    </span>
                    <p class='card-text mt-2'>${Body}</p>
                </div>
            `;
        } else {
            return '';
        }
    }

    function edited(created, modified) {
        // console.log(`CREATED:\t${formatDate(created)}`)
        // console.log(`MODIFIED:\t${formatDate(modified)}`);

        if (formatDate(created) !== formatDate(modified)) {
            return true;
        } else {
            return false;
        }
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function QuestionsToolbar(param) {
    const {
        selected,
        parent,
        onFilter,
        onSearch,
        onClear,
        onAsk,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='btn-toolbar mb-3' role='toolbar' aria-label='Toolbar with button groups' id='App-18'>
                <button type='button' class='btn btn-primary ask-a-question'>Ask a question</button>
                <div class='input-group'>
                    <input class='form-control mr-sm-2 search-questions' type='search' placeholder='Search' aria-label='Search'>
                </div>    
                <div class='btn-group mr-2' role='group' aria-label='First group'>
                    ${buildFilters()}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: 20px 0px 0px 0px;
                align-items: center;
            }

            #id .btn:focus,
            #id .btn:active {
                box-shadow: none ;
            }
            
            #id .search-questions {
                min-width: 250px;
                margin: 0rem .5rem;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .filter',
                event: 'click',
                listener(event) {
                    const isSelected = event.target.classList.contains('btn-outline-primary');

                    /** Deselect all options */
                    component.findAll('.filter').forEach(button => {
                        button.classList.remove('btn-primary');
                        button.classList.add('btn-outline-primary');
                    });

                    if (isSelected) {
                        event.target.classList.remove('btn-outline-primary');
                        event.target.classList.add('btn-primary');
                    } else {
                        event.target.classList.remove('btn-primary');
                        event.target.classList.add('btn-outline-primary');
                    }

                    onFilter(event.target.innerText);
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    onSearch(event.target.value.toLowerCase());
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            },
            {
                selector: `#id .ask-a-question`,
                event: 'click',
                listener: onAsk
            }
        ]
    });

    function buildFilters() {
        const filterOptions = [
            'All',
            'Mine',
            'Unanswered',
            'Answered',
            'Featured'
        ];

        return filterOptions.map(option => {
            return /*html*/ `
                <button type='button' class='btn ${selected === option ? 'btn-primary' : 'btn-outline-primary'} filter'>${option}</button>
            `
        }).join('\n');
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function QuestionType(param) {
    const {
        title,
        path,
        questions,
        parent,
        position
    } = param;

    const lastEntry = questions[questions.length - 1];

    const { Editor, Modified } = lastEntry || { Editor: '', Modified: '' };

    const component = Component({
        html: /*html*/ `
            <div class='question-type mb-3'>
                <div class='question-type-title mb-1'>${title}</div>
                <div class='question-count mb-1'>${questions.length} questions</div>
                <div class='question-date'>${Modified ? `Last updated: ${Editor.Title} ${formatDate(Modified)}` : ''}</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                border-radius: 20px;
                padding: 20px;
                background: ${App.get('sidebarBackgroundColor')};
                cursor: pointer;
            }

            #id .question-type-title {
                font-weight: 600;
            }

            #id .question-count {
                font-size: 14px;
            }

            #id .question-date {
                font-size: 14px;
                color: gray;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    Route(`Questions/${path}`);
                }
            }
        ]
    });

    function formatDate(date) {
        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
            hour: 'numeric',
            minute: 'numeric'
        })}
        `;
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function ReleaseNotes(param) {
    const {
        version,
        notes,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='release-notes'>
                <div class='release-notes-version'>Version <strong>${version}</strong></div>
                ${buildNotes(notes)}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin-top: 10px;
            }

            #id .release-notes-version {
                font-size: 1.4em;
                color: mediumpurple;
                margin-bottom: 10px;
            }

            #id .release-notes-version strong {
                color: mediumpurple;
            }
        `,
        parent: parent,
        position,
        events: [

        ]
    });

    function buildNotes(notes) {
        let html = /*html*/ `
            <ul>
        `;

        notes.forEach(note => {
            const {
                Summary,
                Description
            } = note;

            html += /*html*/ `
                <li>
                    <strong>${Summary}</strong>
                    &mdash;
                    ${Description}
                </li>
            `;
        });

        html += /*html*/ `
            </ul>
        `;

        return html;
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Reply(param) {
    const {
        reply,
        label,
        margin,
        onEdit,
        parent,
        position
    } = param;

    const {
        Body,
        Author,
        Editor,
        Created,
        Modified
    } = reply;

    const component = Component({
        html: /*html*/ `
            <div class='card'>
                ${Author.Name === Store.user().LoginName ?
                    /*html*/ `
                        <div class='button-group'>
                            <button type='button' class='btn btn-secondary cancel'>Cancel</button>
                            <button type='button' class='btn btn-primaryColor edit'>Edit reply</button>
                        </div>
                    ` :
                ''
            }
                <div class='card-body'>
                    <h6 class='card-subtitle mb-2 text-muted'>
                        <span>${Author.Title} ${formatDate(Created)}</span>
                        ${label === 'new' ?
                            /*html*/ `
                                <span class='badge badge-warning' role='alert'>New</span>
                            ` :
                ''
            }
                    </h6>
                    <div class='card-text mb-2'>${Body || ''}</div>
                    <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title} ${formatDate(Modified)} ` : ''}</h6>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
                position: relative;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
            }

            #id .card-subtitle {
                font-size: .9em;
                font-weight: 400;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            /* Reply */
            #id .button-group {
                position: absolute;
                display: none;
                top: 5px;
                right: 5px;
            }

            #id .button-group .btn {
                margin-left: 5px;
            }
            
            #id .edit,
            #id .cancel {
                font-size: .8em;
                padding: .275rem .75rem;
            }

            #id .cancel {
                display: none;
            }

            #id:hover .button-group {
                display: flex !important;
            }

            #id .btn-primaryColor {
                background: ${App.get('primaryColor')};
                color: white;
            }

            #id .btn-primaryColor:focus,
            #id .btn-primaryColor:active {
                box-shadow: none;
            }

            #id .editable {
                padding: 10px;
                margin-top: 20px;
                border: solid 2px mediumseagreen;
                border-radius: 4px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .cancel',
                event: 'click',
                listener(event) {
                    event.target.style.display = 'none';

                    const editButton = component.find('.edit');
                    editButton.innerText = 'Edit reply';
                    editButton.classList.add('btn-primaryColor');
                    editButton.classList.remove('btn-success');

                    const buttonGroup = component.find('.button-group');
                    buttonGroup.style.display = 'none';

                    const cardText = component.find('.card-text');
                    cardText.setAttribute('contenteditable', false);
                    cardText.classList.remove('editable');
                }
            },
            {
                selector: '#id .edit',
                event: 'click',
                listener(event) {
                    const cardText = component.find('.card-text');
                    const buttonGroup = component.find('.button-group');
                    const cancelButton = component.find('.cancel');

                    if (event.target.innerText === 'Edit reply') {
                        event.target.innerText = 'Update';
                        event.target.classList.remove('btn-primaryColor');
                        event.target.classList.add('btn-success');

                        cardText.setAttribute('contenteditable', true);
                        cardText.classList.add('editable');
                        cardText.focus();

                        cancelButton.style.display = 'block';
                        buttonGroup.style.display = 'flex';
                    } else {
                        onEdit(cardText.innerHTML);

                        event.target.innerText = 'Edit reply';
                        event.target.classList.add('btn-primaryColor');
                        event.target.classList.remove('btn-success');

                        cardText.setAttribute('contenteditable', false);
                        cardText.classList.remove('editable');

                        cancelButton.style.display = 'none';
                        buttonGroup.style.display = 'none';
                    }
                }
            }
        ]
    });

    function formatDate(date) {
        const thisDate = new Date(date);

        if (isToday(thisDate)) {
            // console.log('is today');
        }

        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
            hour: 'numeric',
            minute: 'numeric'
        })}
        `;
    }

    function isToday(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function isGreaterThanOneHour(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function edited(created, modified) {
        // console.log(`CREATED:\t${formatDate(created)}`)
        // console.log(`MODIFIED:\t${formatDate(modified)}`);

        if (formatDate(created) !== formatDate(modified)) {
            return true;
        } else {
            return false;
        }
    }

    component.setModified = (param) => {
        const {
            Modified,
            Editor
        } = param;

        component.find('.edit-text').innerHTML = `Last edited by ${Editor.Title} ${formatDate(Modified)}`;
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function RequestAssitanceInfo(param) {
    const {
        data,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class="request-assitance-info">
                ${buildInfo()}
                <div class="alert alert-light" role="alert">
                    <p class="mb-3">For general CarePoint issues, please contact:</p>
                    <div>
                        <h6 class="mb-2">DHA Global Service Center (GSC)</h6>
                        <p class="mb-1">
                            <a href="tel:18006009332" class="alert-link">1 (800) 600-9332</a>
                        </p>
                        <p class="mb-2">Use the keyword <strong><i>MHS Information Platform</i></strong> or <strong><i>MIP</strong></i></p>
                        <p class="mb-1">
                            <a href="mailto:dhagsc@mail.mil" class="alert-link">dhagsc@mail.mil</a>
                        </p>
                        <p class="mb-0">
                            <a href="https://gsc.health.mil/" class="alert-link">https://gsc.health.mil</a>
                        </p>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id p {
                font-size: 14px;
            }
        `,
        parent: parent,
        position,
        events: [

        ]
    });

    function buildInfo() {
        return data.map(item => {
            const {
                label,
                name,
                title,
                email,
                phone,
            } = item;

            return /*html*/ `
                <div class="alert alert-info" role="alert">
                    <p class="mb-3">${label}</p>
                    <div>
                        <h5 class="mb-1">${name}</h5>
                        <p class="mb-2">${title}</p>
                        <p class="mb-1">
                            <a href="mailto:${email}" class="alert-link">${email}</a>
                        </p>
                        <p class="mb-0">
                            <a href="tel:${phone.replace(/([()-.\s])+/g, '')}" class="alert-link">${phone}</a>
                        </p>
                    </div>
                </div>
            `;
        }).join('\n');
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function SectionStepper(param) {
    const {
        title,
        sections,
        scrollElement,
        action,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='section-stepper'>
                <div class='section-title-group'>
                    ${title ? /*html*/`<div class='section-title'>${title.text}</div>` : ''}
                    <div class='section-group-container'>
                        ${createHTML()}
                    </div>
                </div>
                <div class='section-legend'>
                    <!-- <h3>Legend</h3> -->
                    <!-- Not Started -->
                    <div class='section-group'>
                        <div class='section-circle-bar-container'>
                            <div class='section-circle not-started'></div>
                        </div>
                        <div class='section-name'>
                            <span class='section-name-text'>Not Started</span>
                        </div>
                    </div>
                    <!-- Started -->
                    <div class='section-group'>
                        <div class='section-circle-bar-container'>
                            <div class='section-circle started'></div>
                        </div>
                        <div class='section-name'>
                            <span class='section-name-text'>Started</span>
                        </div>
                    </div>
                    <!-- Not Started -->
                    <div class='section-group'>
                        <div class='section-circle-bar-container'>
                            <div class='section-circle complete'></div>
                        </div>
                        <div class='section-name'>
                            <span class='section-name-text'>Complete</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Root */
            #id.section-stepper {
                height: 100%;
                padding: 15px 13px 5px 13px;
                display: inline-flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: overlay;
                border-right: solid 1px ${App.get('sidebarBorderColor')};
            }

            /* Buttons */
            #id .btn-secondary {
                background: #dee2e6;
                color: #444;
                border-color: transparent;
            }

            /* Title */
            #id .section-title {
                font-size: 1em;
                text-align: center;
                color: white;
                background: mediumslateblue;
                border-radius: 10px;
                margin-bottom: 15px;
                padding: .275rem .75rem;
                cursor: pointer;
            }

            /* Sections */
            #id .section-group {
                display: flex;
                justify-content: flex-start;
            }

            /* Circle and Bar Container */
            #id .section-circle-bar-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            /* Circle */
            #id .section-circle {
                user-select: none;
                /* border-radius: 50%; */
                border-radius: 25%;
                width: 24px;
                height: 24px;
                padding: 6px;
                background: ${App.get('primaryColor')};
                border: solid 1px transparent;
                color: white;
                text-align: center;
                line-height: .6;
            }

            #id .section-circle.not-started {
                background: #e9ecef;
                color: #444;
            }

            #id .section-circle.started {
                /* Green */
                color: #155724;
                background-color: #d4edda;

                /* Blue */
                color: white;
                background-color: #007bff;

                /* Orange */
                /* color: #212529; */
                /* background-color: #ffc107; */
                /* background: orange; */
                /* color: white; */
            }

            #id .section-circle.complete {
                color: #fff;
                background-color: #28a745;
                /* background: mediumseagreen;
                color: white; */
            }

            #id .section-circle.error {
                background: #f8d7da;
                color: #721c24;
                border-color: #721c24;
            }

            /* Bar */
            #id .section-bar {
                background: ${App.get('primaryColor')};
                height: 10px;
                /* width: 1px; */
                /* margin: 5px 0px; */
            }

            /* Name */
            #id .section-name {
                font-weight: 500;
                white-space: nowrap;
            }

            #id .section-name-text {
                margin: 0px 8px;
                font-size: 14px;
            }

            #id .section-name-text.selected {
                border-bottom: solid 2px ${App.get('primaryColor')};
            }

            /* Legend */
            #id .section-legend .section-group {
                margin: 5px 0px;
            }

            #id .section-legend {
                font-size: .8em;
            }

            #id .section-legend .section-circle {
                width: 20px;
                height: 20px;
                padding: 3px;
            }

            /* Hover */
            #id .section-group-container .section-circle:hover,
            .section-group-container .section-name-text:hover {
                cursor: pointer;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            // {
            //     selector: '#id .section-group',
            //     event: 'click',
            //     listener: scrollToSection
            // },
            {
                selector: '#id .section-group',
                event: 'click',
                listener: action
            },
            {
                selector: '#id .section-title',
                event: 'click',
                listener(event) {
                    if (title && title.action) {
                        title.action(event);
                    }
                }
            }
        ]
    });

    function createHTML() {
        let html = '';

        sections.forEach((section, index, sections) => {

            const {
                name,
                status
            } = section;

            const ReadinessTitle = 'MTF Readiness Demand Signal'

            html += /*html*/ `
                <div class='section-group'>
                    <div class='section-circle-bar-container'>
                        <div class='section-circle ${status}' data-name='${name}'>${index + 1}</div>
            `;

            if (index < sections.length - 1) {
                html += /*html*/ `
                    <div class='section-bar'></div>
                `;
            }
           
            html += /*html*/ `
                    </div>
                    <div class='section-name'>
                        <span class='section-name-text' data-name='${name}'>${
                            name === 'Readiness' ? 
                            ReadinessTitle : 
                            name
                        }</span>
                    </div>
                </div>
            `;
        });

        return html;
    }

    function scrollToSection(event) {
        const maincontainer = Store.get('maincontainer');
        const name = this.querySelector('.section-name-text').innerText;
        const title = [...maincontainer
            .findAll(`[class*='title'], h1, h2, h3, h4, h5, h6`)]
            .find(node => node.innerText === name);
        const top = title.classList.contains('section-title') ? title.parentElement.offsetTop - title.offsetHeight : title.offsetTop;

        scrollElement.get().scrollTo({
            top,
            behavior: 'smooth'
        });
    }

    component.select = section => {
        const name = component.find(`.section-name-text[data-name='${section}']`);

        // console.log(name);

        if (name) {
            name.classList.add('selected');
        }
    }

    component.deselect = section => {
        const name = component.find(`.section-name-text[data-name='${section}']`);

        if (name) {
            name.classList.remove('selected');
        }
    }

    component.update = sections => {
        sections.forEach(section => {
            const {
                name,
                status
            } = section;

            const circle = component.find(`.section-circle[data-name='${name}']`);

            circle.classList.remove('complete', 'started','not-started');
            circle.classList.add(status);
        });
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Sidebar(param) {
    const {
        parent,
        logo,
        path,
        sidebarDropdown
    } = param;

    const logoPath = App.get('mode') === 'prod' ? '../Images' : `/src/Images`;

    const component = Component({
        html: /*html*/ `
            <div class='sidebar' data-mode='open'>
                <img src ='${logoPath}/${logo}' class='logo' data-path='${App.get('defaultRoute')}'>
                ${sidebarDropdown ?
                    /*html*/ `
                        <div class='dropdown-container'>
                            <div class='dropdown-label mb-2'>${sidebarDropdown.label}</div>
                            <div class="dropdown">
                                <button class="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${sidebarDropdown.getSelected()}</button>
                                <div class="dropdown-menu mt-1" aria-labelledby="dropdownMenuButton">
                                    ${buildDropdown(sidebarDropdown.items)}
                                </div>
                            </div>
                        </div>
                    ` :
                ''
            }
                <div class='nav-container'>
                    ${buildNav()}
                </div>
                <div class='settings-container'>
                    <!-- Settings -->
                    <span class='nav ${(path === 'Settings') ? 'nav-selected' : ''} settings' data-path='Settings'>
                        <span class='icon-container-wide'>
                            <svg class='icon'><use href='#icon-bs-gear'></use></svg>
                        </span>
                        <span class='text'>Settings</span>
                    </span>
                    <!-- Open / Close -->
                    <span class='open-close'>
                        <svg class='icon'><use href='#icon-caret-left'></use></svg>
                    </span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.sidebar {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                background: ${App.gradientColor ? `linear-gradient(${App.gradientColor})` : App.get('sidebarBackgroundColor')};
                border-radius: 20px;
                margin: 20px 0px 20px 20px;
            }

            /* Nav Container */
            .nav-container {
                background: white;
                margin: 0px 15px;
                border-radius: 10px;
                overflow: overlay;
            }

            /* Settings */
            .settings-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                width: calc(100% - 30px);
            }

            .settings {
                border-radius: 10px;
                background: white;
                margin: 0px 15px;
            }

            .sidebar .nav {
                display: flex;
                align-items: center;
                width: 100%;
                min-height: 42px; /** TODO: Variable. Set manually */
                cursor: pointer;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                color: ${App.get('secondaryColor')};
            }

            .sidebar .nav-selected {
                box-shadow: 0px -1px 0px 0px #e4e4e6;
                background: #e4e4e6;
            }

            .sidebar .nav .icon-container {
                display: flex;
                padding: 10px 15px;
            }

            
            .sidebar .nav .icon-container-wide {
                display: flex;
                padding: 10px 15px;
            }

            .sidebar .nav .icon {
                fill: ${App.get('sidebarTextColor')};
                stroke: ${App.get('sidebarTextColor')};
                font-size: 22px;
            }

            .sidebar .nav .text {
                flex: 1;
                color: ${App.get('sidebarTextColor')};
                font-size: 15px;
                font-weight: 500;
                padding: 10px 15px 9px 15px;
            }

            .sidebar .nav:not(:last-child):not(.settings) .text {
                border-bottom: solid 1px #e4e4e6;
            }

            .sidebar .nav .icon:hover,
            .sidebar .nav-selected .icon {
                fill: ${App.get('sidebarTextColor')};
                stroke: ${App.get('sidebarTextColor')};
            }

            /* Open/Close */ 
            .sidebar .open-close {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                width: 100%;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                padding: 15px 0px;
                color: ${App.get('secondaryColor')};
            }

            .sidebar .open-close .icon {
                cursor: pointer;
                fill: ${App.get('sidebarTextColor')};
                stroke: ${App.get('sidebarTextColor')};
                font-size: 1em;
            }

            /* Logo */
            #id .logo {
                cursor: pointer;
                margin: 15px 0px;
                transition: all 150ms;
                max-height: 31px;
                object-fit: scale-down;
            }

            /* Drop down */
            #id .dropdown-container {
                margin-bottom: 10px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            #id .dropdown-container.closed {
                display: none;
            }
            
            #id .dropdown-label {
                color: ${App.get('sidebarTextColor')};
                font-size: 1.1em;
                font-weight: 500;
            }

            #id .dropdown-toggle {
                font-size: 14px;
            }

            #id .btn:focus,
            #id .btn:active {
                box-shadow: none;
            }

            #id .dropdown-menu {
                min-width: initial;
            }

            #id .dropdown-item {
                font-size: 14px;
                padding: 6px 12px;
                cursor: pointer;
            }

            #id .dropdown-item::after {
                display: inline-block;
                margin-left: .255em;
                vertical-align: .255em;
                content: "";
                border-top: .3em solid transparent;
                border-right: .3em solid transparent;
                border-bottom: 0;
                border-left: .3em solid transparent;
                box-sizing: border-box;
            }
            
            /* Collapse */
            #id.sidebar .nav .text.closed {
                display: none;
            }

            #id.sidebar .logo.closed {
                width: 40px;
            }

            #id.sidebar .open-close.closed {
                justify-content: center;
            }

            @media (max-width: 1300px) {
                #id.sidebar .nav .text.closed {
                    display: none;
                }
    
                #id.sidebar .logo.closed {
                    image-rendering: pixelated;
                    width: 40px;
                }
    
                #id.sidebar .open-close.closed {
                    justify-content: center;
                }
            }
        `,
        parent: parent,
        position: 'afterbegin',
        permanent: true,
        events: [
            {
                selector: '.nav',
                event: 'click',
                listener: routeToView
            },
            {
                selector: '.logo',
                event: 'click',
                listener(event) {
                    Route(this.dataset.path);
                }
            },
            {
                selector: '#id .dropdown-item',
                event: 'click',
                listener: onDropdown
            },
            {
                selector: '#id .open-close',
                event: 'click',
                listener: toggleSidebarMode
            }
        ],
        onAdd() {
            /** Window resize event */
            window.addEventListener('resize', event => {
                const mode = component.get().dataset.mode;
                const icon = component.find('.open-close');

                if (window.innerWidth <= 1250) {
                    closeSidebar(mode, icon);
                } else {
                    openSidebar(mode, icon);
                }
            });
        }
    });

    function toggleSidebarMode(event) {
        const mode = component.get().dataset.mode;

        console.log(mode);

        if (mode === 'open') {
            closeSidebar(mode, this);
        } else if (mode === 'closed') {
            openSidebar(mode, this);
        }
    }

    function closeSidebar(mode, icon) {
        if (mode !== 'closed') {
            /** Add classes */
            component.find('.logo').src = `${logoPath}/${App.get('logoSmall')}`;
            component.find('.logo').classList.add('closed');
            component.find('.dropdown-container')?.classList.add('closed');
            component.findAll('.text').forEach(item => item.classList.add('closed'));
            icon.classList.add('closed');

            /** Update icon */
            icon.querySelector('.icon use').setAttribute('href', '#icon-caret-right');

            /** Set mode */
            component.get().dataset.mode = 'closed';

            /** Log close action */
            console.log(`Close sidebar.`);
        }
    }

    function openSidebar(mode, icon) {
        if (mode !== 'open') {
            /** Remove Classes */
            component.find('.logo').src = `${logoPath}/${App.get('logo')}`;
            component.find('.logo').classList.remove('closed');
            // component.find('.dropdown-container').classList.remove('closed');
            component.findAll('.text').forEach(item => item.classList.remove('closed'));
            icon.classList.remove('closed');

            /** Update icon */
            icon.querySelector('.icon use').setAttribute('href', '#icon-caret-left');

            /** Set mode */
            component.get().dataset.mode = 'open';

            /** Log open action */
            console.log(`Open sidebar.`);
        }
    }

    function onDropdown(event) {
        const key = event.target.dataset.key;
        const value = event.target.dataset.value;

        /** Update session storage */
        sessionStorage.setItem(key, value);

        /** Update label */
        component.find('.dropdown-toggle').innerText = event.target.innerText;

        /** Update dropdown menu */
        component.find('.dropdown-menu').innerHTML = buildDropdown(sidebarDropdown.items);

        /** Add events */
        component.findAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', onDropdown);
        });

        if (sidebarDropdown.action) {
            sidebarDropdown.action(event);
        }

        /** Route */
        const path = location.href.split('#')[1];

        Route(path);
    }

    function buildNav() {
        return Store.routes()
            .filter(route => route.path !== 'Settings' && !route.hide)
            .map(route => {
                const {
                    path,
                    icon,
                    roles
                } = route;

                if (roles) {
                    if (roles.includes(Store.user().Role)) {
                        return navTemplate(path, icon);
                    } else {
                        return '';
                    }
                } else {
                    return navTemplate(path, icon);
                }

            }).join('\n');
    }

    function navTemplate(routeName, icon) {
        const firstPath = path ? path.split('/')[0] : undefined;

        return /*html*/ `
            <span class='nav ${(firstPath === routeName || firstPath === undefined && routeName === App.get('defaultRoute')) ? 'nav-selected' : ''}' data-path='${routeName}'>
                <span class='icon-container'>
                    <svg class='icon'><use href='#icon-${icon}'></use></svg>
                </span>
                <span class='text'>${routeName.split(/(?=[A-Z])/).join(' ')}</span>
            </span>
        `;
    }

    function buildDropdown(items) {
        // console.info(items)
        return items
            //.filter(item => item.label !== sidebarDropdown.getSelected()) /** filter out current selection */
            .map(item => {
                const {
                    label,
                    key,
                    value
                } = item;

                /** Highlights selected Fiscal Year @author Wilfredo Pacheco 20210810 */
                var active = '';
                const isSelected = sessionStorage.getItem(key) === value
                if (isSelected) { active = 'active' }

                return /*html*/ ` 
                <span class='dropdown-item ${active}' data-key='${key}' data-value='${value}'>${label}</span>
            `
            }).join('\n');
    }

    function routeToView() {
        component.findAll('.nav').forEach((nav) => {
            nav.classList.remove('nav-selected');
        });

        this.classList.add('nav-selected');

        Route(this.dataset.path);
    }

    component.selectNav = (path) => {
        component.findAll('.nav').forEach((nav) => {
            nav.classList.remove('nav-selected');
        });

        const nav = component.find(`.nav[data-path='${path}']`);

        if (nav) {
            nav.classList.add('nav-selected');
        }
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function SingleLineTextField(param) {
    const {
        addon,
        label,
        description,
        value,
        readOnly,
        parent,
        position,
        width,
        margin,
        padding,
        background,
        borderRadius,
        flex,
        maxWidth,
        fieldMargin,
        optional,
        onKeydown,
        fontSize,
        onFocusout
    } = param;

    let events = [];

    if (onKeydown) {
        events.push({
            selector: '#id .form-control',
            event: 'keydown',
            listener: onKeydown
        });
    }

    if (onFocusout) {
        events.push({
            selector: '#id .form-control',
            event: 'focusout',
            listener: onFocusout
        });
    }

    const component = Component({
        html: /*html*/ `
            
            <div class='form-field'>
                <!-- ${label ? /*html*/`<label>${label}${optional ? /*html*/ `<span class='optional'><i>Optional</i></span>` : ''}</label>` : ''} -->
                <!-- ${readOnly ? /*html*/ `<div class='form-field-single-line-text readonly'>${value || ''}</div>` : /*html*/ `<div class='form-field-single-line-text editable' contenteditable='true'>${value || ''}</div>`} -->
                <label class='form-label'>${label}</label>
                ${description ? /*html*/`<div class='form-field-description'>${description}</div>` : ''}
                <div class="input-group">
                    ${addon ? /*html*/ `<span class='input-group-text'>${addon}</span>` : ''}
                    <input type='text' class='form-control' value='${value || ''}' autocomplete='off' ${readOnly ? 'readonly' : ''}>
                </div>         
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                ${flex ? `flex: ${flex};` : ''}
                ${padding ? `padding: ${padding};` : ''}
                ${borderRadius ? `border-radius: ${borderRadius};` : ''}
                ${background ? `background: ${background};` : ''}
            }

            #id label,
            #id .form-label {
                font-size: .95em;
                font-weight: bold;
                padding: 3px 0px;
            }

            #id .form-field-description {
                padding: 5px 0px;
            }

            #id .form-field-single-line-text {
                width: ${width || 'unset'};
                min-height: 36px;
                font-size: ${fontSize || '.85em'};
                font-weight: 500;
                margin: ${margin || '2px 0px 4px 0px'};
                padding: 5px 10px;
                border-radius: 4px;
                background: white;
                border: ${App.get('defaultBorder')};
                transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            #id .form-field-single-line-text.readonly {
                background: transparent;
                border: solid 1px transparent;
                margin: 0px;
                /* padding: 0px; */
                padding: 0px;
            }

            #id .form-field-single-line-text.editable:active,
            #id .form-field-single-line-text.editable:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${App.get('primaryColor')};
            }

            /* Optional */
            #id .optional {
                margin: 0px 5px;
                font-size: .8em;
                color: gray;
                font-weight: 400;
            }
        `,
        parent: parent,
        position,
        events
    });

    component.focus = () => {
        const field = component.find('.form-field-single-line-text');

        setTimeout(() => {
            console.log(field);
            field.focus();
        }, 0);
    }

    component.addError = (param) => {
        component.removeError();

        let text = typeof param === 'object' ? param.text : param;

        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
                    /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''
            }
            </div>
        `;

        component.find('.form-field-single-line-text').insertAdjacentHTML('beforebegin', html);
    }

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    }

    component.value = (param) => {
        const field = component.find('.form-control');

        if (param !== undefined) {
            field.value = param;
        } else {
            return field.value;
        }
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function SiteUsage(param) {
    const {
        border,
        margin,
        padding,
        data,
        parent,
        position,
        onClick
    } = param;

    const {
        visits,
    } = data;

    const screenWidth = window.screen.width;
    const chartWidth = screenWidth > 1500 ? 800 : 500;

    const component = Component({
        html: /*html*/ `
            <div class='dashboard-long-card'>
                <!-- Chart -->
                <div class='dashboard-long-card-container'>
                    <div class='dashboard-long-card-chart-title'></div>
                    <div class='dashboard-long-card-chart-container'>
                        <canvas class="myChart" width="${chartWidth}" height="275"></canvas>
                    </div>
                </div>
                <!-- Text -->
                <div class='dashboard-long-card-container'>
                    ${createInfoGroup('Today', 'today')}
                    ${createInfoGroup('This Week', 'week')}
                    ${createInfoGroup('This Month', 'month')}
                    ${createInfoGroup('This Year', 'year')}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '20px'};
                padding: ${padding || '10px'};
                background: white;
                border-radius: 4px;
                border: ${border || App.get('defaultBorder')};
                display: flex;
                flex: 1;
                overflow: auto;
            }

            /** Left/Right Containers */
            #id .dashboard-long-card-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 100%;
            }

            /** Text */
            #id .info-group {
                cursor: pointer;
                margin: 5px 0px;
            }

            #id .dashboard-long-card-info {
                display: flex;
                justify-content: space-between;
                font-size: 1.1em;
            }

            #id .dashboard-long-card-info.smaller {
                font-size: .8em;
            }

            #id .dashboard-long-card-info-label {
                font-weight: 500;
                margin-right: 30px;             
            }

            /** Chart */
            #id .dashboard-long-card-chart-container {
                margin-right: 30px;
            }

            #id .dashboard-long-card-chart-title {
                color: ${App.get('primaryColor')};
                font-size: 1.1em;
                font-weight: 500;
                text-align: center;
            }

            /** Label - mimic bootstrap input */
            #id .info-group {
                display: flex;
                justify-content: space-between;
                width: 100%;
                font-weight: 500;
                background: #e9ecef;
                border-radius: 8px;
                padding: 5px;
            }

            #id .info-label {
                padding: 5px;
                font-size: 13px;
                width: 80px;
            }

            #id .info-count {
                border-radius: 8px;
                padding: 5px;
                background: #2d3d501a;
                border: none;
                width: 70px;
                text-align: center;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .info-group',
                event: 'click',
                listener(event) {
                    const label = this.dataset.label;

                    if (label) {
                        onClick(label);
                    }
                }
            }
        ]
    });

    function createInfoGroup(label, property) {
        return /*html*/ `
            <div class="info-group" data-label='${property}'>
                <div class='info-label'>${label}</div>
                <div class="info-count">${visits[property].length}</div>
            </div>
        `;
    }

    component.setTitle = (text) => {
        const title = component.find('.dashboard-long-card-chart-title');

        title.innerText = text;
    }

    component.clearChart = () => {
        const chartContainer = component.find('.dashboard-long-card-chart-container');

        chartContainer.innerHTML = /*html*/ `<canvas class="myChart" width="${chartWidth}" height="275"></canvas>`;
    }

    component.getChart = () => {
        return component.find('.myChart').getContext('2d');
    }

    return component;
}

/**
 * {@link https://getbootstrap.com/docs/4.5/components/dropdowns/}

 * @param {Object} param 
 * @returns 
 */
export function StatusField(param) {
    const {
        action,
        label,
        parent,
        position,
        value,
        margin,
        padding
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='label'>${label}</div>
                <div class="dropdown">
                    <button class="btn ${setClass(value)} dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${value || "Not Started"}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <div class='dropdown-item'>Not Started</div>
                        <div class='dropdown-item'>In Progress</div>
                        <div class='dropdown-item'>Completed</div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
                padding: ${padding || '0px'};
            }

            #id .label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .dropdown-item {
                cursor: pointer;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener(event) {
                    /** Remove classes */
                    component.find('.dropdown-toggle').classList.remove('btn-outline-danger', 'btn-outline-info', 'btn-outline-success');

                    /** Add new class */
                    component.find('.dropdown-toggle').classList.add(setClass(event.target.innerText));

                    if (action) {
                        action(event);
                    }
                }
            }
        ]
    });

    function setClass(value) {
        switch (value) {
            case 'Not Started':
                return 'btn-outline-danger';
            case 'In Progress':
                return 'btn-outline-info';
            case 'Completed':
                return 'btn-outline-success';
            default:
                break;
        }
    }

    component.setDropdownMenu = (list) => {
        component.find('.dropdown-menu').innerHTML = buildDropdown(list);

        component.findAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', action);
        });
    }

    component.value = (param) => {
        const field = component.find('.dropdown-toggle');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function SvgDefs(param) {
    const {
        svgSymbols,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <svg aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <symbol id="icon-home" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M32 19l-6-6v-9h-4v5l-6-6-16 16v1h4v10h10v-6h4v6h10v-10h4z"></path>
                    </symbol>
                    <symbol id="icon-pencil" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                    </symbol>
                    <symbol id="icon-alarm" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M16 4c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14-6.268-14-14-14zM16 29.25c-6.213 0-11.25-5.037-11.25-11.25s5.037-11.25 11.25-11.25c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25zM29.212 8.974c0.501-0.877 0.788-1.892 0.788-2.974 0-3.314-2.686-6-6-6-1.932 0-3.65 0.913-4.747 2.331 4.121 0.851 7.663 3.287 9.96 6.643v0zM12.748 2.331c-1.097-1.418-2.816-2.331-4.748-2.331-3.314 0-6 2.686-6 6 0 1.082 0.287 2.098 0.788 2.974 2.297-3.356 5.838-5.792 9.96-6.643z"></path>
                        <path d="M16 18v-8h-2v10h8v-2z"></path>
                    </symbol>
                    <symbol id="icon-drawer" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M31.781 20.375l-8-10c-0.19-0.237-0.477-0.375-0.781-0.375h-14c-0.304 0-0.591 0.138-0.781 0.375l-8 10c-0.142 0.177-0.219 0.398-0.219 0.625v9c0 1.105 0.895 2 2 2h28c1.105 0 2-0.895 2-2v-9c0-0.227-0.077-0.447-0.219-0.625zM30 22h-7l-4 4h-6l-4-4h-7v-0.649l7.481-9.351h13.039l7.481 9.351v0.649z"></path>
                        <path d="M23 16h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                        <path d="M25 20h-18c-0.552 0-1-0.448-1-1s0.448-1 1-1h18c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                    </symbol>
                    <symbol id="icon-user" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>
                    </symbol>
                    <symbol id="icon-users" viewBox="0 0 36 32">
                        <title></title>
                        <path d="M24 24.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>
                        <path d="M10.225 24.854c1.728-1.13 3.877-1.989 6.243-2.513-0.47-0.556-0.897-1.176-1.265-1.844-0.95-1.726-1.453-3.627-1.453-5.497 0-2.689 0-5.228 0.956-7.305 0.928-2.016 2.598-3.265 4.976-3.734-0.529-2.39-1.936-3.961-5.682-3.961-6 0-6 4.029-6 9 0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h8.719c0.454-0.403 0.956-0.787 1.506-1.146z"></path>
                    </symbol>
                    <symbol id="icon-user-plus" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"></path>
                        <path d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-4v4h-2v-4h-4v-2h4v-4h2v4h4v2z"></path>
                    </symbol>
                    <symbol id="icon-user-minus" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"></path>
                        <path d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-10v-2h10v2z"></path>
                    </symbol>
                    <symbol id="icon-cog" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M29.181 19.070c-1.679-2.908-0.669-6.634 2.255-8.328l-3.145-5.447c-0.898 0.527-1.943 0.829-3.058 0.829-3.361 0-6.085-2.742-6.085-6.125h-6.289c0.008 1.044-0.252 2.103-0.811 3.070-1.679 2.908-5.411 3.897-8.339 2.211l-3.144 5.447c0.905 0.515 1.689 1.268 2.246 2.234 1.676 2.903 0.672 6.623-2.241 8.319l3.145 5.447c0.895-0.522 1.935-0.82 3.044-0.82 3.35 0 6.067 2.725 6.084 6.092h6.289c-0.003-1.034 0.259-2.080 0.811-3.038 1.676-2.903 5.399-3.894 8.325-2.219l3.145-5.447c-0.899-0.515-1.678-1.266-2.232-2.226zM16 22.479c-3.578 0-6.479-2.901-6.479-6.479s2.901-6.479 6.479-6.479c3.578 0 6.479 2.901 6.479 6.479s-2.901 6.479-6.479 6.479z"></path>
                    </symbol>
                    <symbol id="icon-stats-dots" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M4 28h28v4h-32v-32h4zM9 26c-1.657 0-3-1.343-3-3s1.343-3 3-3c0.088 0 0.176 0.005 0.262 0.012l3.225-5.375c-0.307-0.471-0.487-1.033-0.487-1.638 0-1.657 1.343-3 3-3s3 1.343 3 3c0 0.604-0.179 1.167-0.487 1.638l3.225 5.375c0.086-0.007 0.174-0.012 0.262-0.012 0.067 0 0.133 0.003 0.198 0.007l5.324-9.316c-0.329-0.482-0.522-1.064-0.522-1.691 0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3-0.067 0-0.133-0.003-0.198-0.007l-5.324 9.316c0.329 0.481 0.522 1.064 0.522 1.691 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-0.604 0.179-1.167 0.487-1.638l-3.225-5.375c-0.086 0.007-0.174 0.012-0.262 0.012s-0.176-0.005-0.262-0.012l-3.225 5.375c0.307 0.471 0.487 1.033 0.487 1.637 0 1.657-1.343 3-3 3z"></path>
                    </symbol>
                    <symbol id="icon-stats-bars" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M0 26h32v4h-32zM4 18h4v6h-4zM10 10h4v14h-4zM16 16h4v8h-4zM22 4h4v20h-4z"></path>
                    </symbol>
                    <symbol id="icon-clipboard-add-solid" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M21 27h-3v-1h3v-3h1v3h3v1h-3v3h-1v-3zM24 20.498v-13.495c0-1.107-0.891-2.004-1.997-2.004h-1.003c0 0.002 0 0.003 0 0.005v0.99c0 1.111-0.897 2.005-2.003 2.005h-8.994c-1.109 0-2.003-0.898-2.003-2.005v-0.99c0-0.002 0-0.003 0-0.005h-1.003c-1.103 0-1.997 0.89-1.997 2.004v20.993c0 1.107 0.891 2.004 1.997 2.004h9.024c-0.647-1.010-1.022-2.211-1.022-3.5 0-3.59 2.91-6.5 6.5-6.5 0.886 0 1.73 0.177 2.5 0.498v0zM12 4v-1.002c0-1.1 0.898-1.998 2.005-1.998h0.99c1.111 0 2.005 0.895 2.005 1.998v1.002h2.004c0.551 0 0.996 0.447 0.996 0.999v1.002c0 0.556-0.446 0.999-0.996 0.999h-9.009c-0.551 0-0.996-0.447-0.996-0.999v-1.002c0-0.556 0.446-0.999 0.996-0.999h2.004zM14.5 4c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5v0zM21.5 32c3.038 0 5.5-2.462 5.5-5.5s-2.462-5.5-5.5-5.5c-3.038 0-5.5 2.462-5.5 5.5s2.462 5.5 5.5 5.5v0z"></path>
                    </symbol>
                    <symbol id="icon-clipboard-add-outline" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M21 26v-3h1v3h3v1h-3v3h-1v-3h-3v-1h3zM17.257 30h-10.26c-1.107 0-1.997-0.897-1.997-2.004v-20.993c0-1.114 0.894-2.004 1.997-2.004h1.003c0.003-1.109 0.898-2 2.003-2h0.997c0.001-1.662 1.348-3 3.009-3h0.982c1.659 0 3.008 1.343 3.009 3h0.997c1.108 0 2 0.895 2.003 2v0h1.003c1.107 0 1.997 0.897 1.997 2.004v14.596c1.781 0.91 3 2.763 3 4.9 0 3.038-2.462 5.5-5.5 5.5-1.708 0-3.234-0.779-4.243-2v0 0zM23 21.207v-14.204c0-0.554-0.455-1.003-1-1.003h-1c-0.003 1.109-0.898 2-2.003 2h-8.994c-1.108 0-2-0.895-2.003-2h-1c-0.552 0-1 0.439-1 1.003v20.994c0 0.554 0.455 1.003 1 1.003h9.6c-0.383-0.75-0.6-1.6-0.6-2.5 0-3.038 2.462-5.5 5.5-5.5 0.52 0 1.023 0.072 1.5 0.207v0 0zM12 4h-2.004c-0.55 0-0.996 0.443-0.996 0.999v1.002c0 0.552 0.445 0.999 0.996 0.999h9.009c0.55 0 0.996-0.443 0.996-0.999v-1.002c0-0.552-0.445-0.999-0.996-0.999h-2.004v-1.002c0-1.103-0.894-1.998-2.005-1.998h-0.99c-1.107 0-2.005 0.898-2.005 1.998v1.002zM14.5 4c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5v0zM21.5 31c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5v0z"></path>
                    </symbol>
                    <symbol id="icon-aid-kit" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M28 8h-6v-4c0-1.1-0.9-2-2-2h-8c-1.1 0-2 0.9-2 2v4h-6c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-16c0-2.2-1.8-4-4-4zM12 4h8v4h-8v-4zM24 22h-6v6h-4v-6h-6v-4h6v-6h4v6h6v4z"></path>
                    </symbol>
                    <symbol id="icon-cross" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
                    </symbol>
                    <symbol id="icon-plus" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
                    </symbol>
                    <symbol id="icon-checkmark" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M27 4l-15 15-7-7-5 5 12 12 20-20z"></path>
                    </symbol>
                    <symbol id="icon-assignment_turned_in" viewBox="0 0 24 24">
                        <title></title>
                        <path d="M9.984 17.016l8.016-8.016-1.406-1.406-6.609 6.563-2.578-2.578-1.406 1.406zM12 3q-0.422 0-0.703 0.281t-0.281 0.703 0.281 0.727 0.703 0.305 0.703-0.305 0.281-0.727-0.281-0.703-0.703-0.281zM18.984 3q0.797 0 1.406 0.609t0.609 1.406v13.969q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.797 0-1.406-0.609t-0.609-1.406v-13.969q0-0.797 0.609-1.406t1.406-0.609h4.172q0.328-0.891 1.078-1.453t1.734-0.563 1.734 0.563 1.078 1.453h4.172z"></path>
                    </symbol>
                    <symbol id="icon-bin2" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M6 32h20l2-22h-24zM20 4v-4h-8v4h-10v6l2-2h24l2 2v-6h-10zM18 4h-4v-2h4v2z"></path>
                    </symbol>
                    <symbol id="icon-search" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path>
                    </symbol>
                    <symbol id="icon-blocked" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M27.314 4.686c-3.022-3.022-7.040-4.686-11.314-4.686s-8.292 1.664-11.314 4.686c-3.022 3.022-4.686 7.040-4.686 11.314s1.664 8.292 4.686 11.314c3.022 3.022 7.040 4.686 11.314 4.686s8.292-1.664 11.314-4.686c3.022-3.022 4.686-7.040 4.686-11.314s-1.664-8.292-4.686-11.314zM28 16c0 2.588-0.824 4.987-2.222 6.949l-16.727-16.727c1.962-1.399 4.361-2.222 6.949-2.222 6.617 0 12 5.383 12 12zM4 16c0-2.588 0.824-4.987 2.222-6.949l16.727 16.727c-1.962 1.399-4.361 2.222-6.949 2.222-6.617 0-12-5.383-12-12z"></path>
                    </symbol>
                    <!-- Arrows -->
                    <symbol id="icon-arrow-up" viewBox="0 0 32 32">
                        <path d="M16 1l-15 15h9v16h12v-16h9z"></path>
                    </symbol>
                    <symbol id="icon-arrow-down" viewBox="0 0 32 32">
                        <path d="M16 31l15-15h-9v-16h-12v16h-9z"></path>
                    </symbol>
                    <symbol id="icon-arrow-right" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M31 16l-15-15v9h-16v12h16v9z"></path>
                    </symbol>
                    <symbol id="icon-arrow-left" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M1 16l15 15v-9h16v-12h-16v-9z"></path>
                    </symbol>
                    <!-- Drop Zone -->
                    <symbol id="icon-drawer2" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M31.781 20.375l-8-10c-0.19-0.237-0.477-0.375-0.781-0.375h-14c-0.304 0-0.591 0.138-0.781 0.375l-8 10c-0.142 0.177-0.219 0.398-0.219 0.625v9c0 1.105 0.895 2 2 2h28c1.105 0 2-0.895 2-2v-9c0-0.227-0.077-0.447-0.219-0.625zM30 22h-7l-4 4h-6l-4-4h-7v-0.649l7.481-9.351h13.039l7.481 9.351v0.649z"></path>
                    </symbol>
                    <symbol id="icon-file-text2" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
                        <path d="M23 26h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                        <path d="M23 22h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                        <path d="M23 18h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                    </symbol>
                    <!-- Empty Page -->
                    <symbol id="icon-file-empty" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
                    </symbol>
                    <!-- Word -->
                    <symbol id="icon-microsoftword" viewBox="0 0 32 32">
                        <title></title>
                        <path fill="#2b579a" style="fill: var(--color1, #2b579a)" d="M31.999 4.977v22.063c0 0.188-0.067 0.34-0.199 0.461-0.135 0.125-0.295 0.184-0.48 0.184h-11.412v-3.060h9.309v-1.393h-9.317v-1.705h9.309v-1.392h-9.303v-1.72h9.307v-1.376h-9.307v-1.724h9.307v-1.392h-9.307v-1.705h9.307v-1.391h-9.307v-1.74h9.307v-1.325h-9.307v-3.457h11.416c0.199 0 0.36 0.064 0.477 0.199 0.14 0.132 0.2 0.293 0.199 0.475zM18.2 0.855v30.296l-18.2-3.149v-23.912l18.2-3.24zM15.453 9.799l-2.279 0.14-1.461 9.047h-0.033c-0.072-0.428-0.34-1.927-0.82-4.489l-0.852-4.351-2.139 0.107-0.856 4.244c-0.5 2.472-0.779 3.911-0.852 4.315h-0.020l-1.3-8.333-1.96 0.104 2.1 10.511 2.179 0.14 0.82-4.091c0.48-2.4 0.76-3.795 0.82-4.176h0.060c0.081 0.407 0.341 1.832 0.82 4.28l0.82 4.211 2.36 0.14 2.64-11.8z"></path>
                    </symbol>
                    <!-- Excel -->
                    <symbol id="icon-microsoftexcel" viewBox="0 0 32 32">
                        <title></title>
                        <path fill="#217346" style="fill: var(--color4, #217346)" d="M31.404 4.136h-10.72v1.984h3.16v3.139h-3.16v1h3.16v3.143h-3.16v1.028h3.16v2.972h-3.16v1.191h3.16v2.979h-3.16v1.191h3.16v2.996h-3.16v2.185h10.72c0.169-0.051 0.311-0.251 0.424-0.597 0.113-0.349 0.172-0.633 0.172-0.848v-21.999c0-0.171-0.059-0.273-0.172-0.309-0.113-0.035-0.255-0.053-0.424-0.053zM30.013 25.755h-5.143v-2.993h5.143v2.996zM30.013 21.571h-5.143v-2.98h5.143zM30.013 17.4h-5.143v-2.959h5.143v2.961zM30.013 13.4h-5.143v-3.139h5.143v3.14zM30.013 9.241h-5.143v-3.12h5.143v3.14zM0 3.641v24.801l18.88 3.265v-31.416l-18.88 3.36zM11.191 22.403c-0.072-0.195-0.411-1.021-1.011-2.484-0.599-1.461-0.96-2.312-1.065-2.555h-0.033l-2.025 4.82-2.707-0.183 3.211-6-2.94-6 2.76-0.145 1.824 4.695h0.036l2.060-4.908 2.852-0.18-3.396 6.493 3.5 6.624-3.065-0.18z"></path>
                    </symbol>
                    <!-- PowerPoint -->
                    <symbol id="icon-microsoftpowerpoint" viewBox="0 0 32 32">
                        <title></title>
                        <path fill="#d24726" style="fill: var(--color2, #d24726)" d="M31.312 5.333h-11.389v4.248c0.687-0.52 1.509-0.784 2.473-0.784v4.131h4.099c-0.020 1.159-0.42 2.136-1.201 2.924-0.779 0.789-1.757 1.195-2.917 1.221-0.9-0.027-1.72-0.297-2.439-0.82v2.839h8.959v1.393h-8.961v1.724h8.953v1.376h-8.959v3.12h11.391c0.461 0 0.68-0.243 0.68-0.716v-19.976c0-0.456-0.219-0.68-0.68-0.68zM23.040 12.248v-4.165c1.16 0.027 2.133 0.429 2.917 1.213 0.781 0.784 1.188 1.768 1.208 2.952zM11.008 12.317c-0.071-0.268-0.187-0.476-0.351-0.629-0.16-0.149-0.376-0.259-0.644-0.328-0.3-0.081-0.609-0.12-0.92-0.12l-0.96 0.019v3.999h0.035c0.348 0.021 0.713 0.021 1.1 0 0.38-0.020 0.74-0.12 1.079-0.3 0.417-0.3 0.667-0.7 0.748-1.219 0.080-0.521 0.052-1.021-0.085-1.481zM0 4.079v23.928l18.251 3.153v-30.32zM13.617 14.861c-0.5 1.159-1.247 1.9-2.245 2.22-0.999 0.319-2.077 0.443-3.239 0.372v4.563l-2.401-0.279v-12.536l3.812-0.199c0.707-0.044 1.405 0.033 2.088 0.24 0.687 0.203 1.229 0.612 1.631 1.229 0.4 0.615 0.625 1.328 0.68 2.14 0.049 0.812-0.057 1.563-0.325 2.249z"></path>
                    </symbol>
                    <!-- Adobe PDF -->
                    <symbol id="icon-adobeacrobatreader" viewBox="0 0 32 32">
                        <title></title>
                        <path fill="#ee3f24" style="fill: var(--color1, #ee3f24)" d="M31.464 20.491c-0.947-1.013-2.885-1.596-5.632-1.596-1.467 0-3.167 0.147-5.013 0.493-1.043-1.027-2.083-2.227-3.076-3.627-0.707-0.987-1.324-2.027-1.893-3.053 1.084-3.387 1.608-6.147 1.608-8.133 0-2.229-0.804-4.555-3.12-4.555-0.711 0-1.421 0.433-1.8 1.067-1.044 1.877-0.573 5.991 1.223 10.053-0.671 2.027-1.38 3.964-2.267 6.14-0.771 1.835-1.659 3.725-2.564 5.461-5.205 2.112-8.573 4.579-8.889 6.512-0.139 0.729 0.099 1.4 0.609 1.933 0.177 0.147 0.848 0.727 1.973 0.727 3.453 0 7.093-5.707 8.943-9.147 1.42-0.48 2.84-0.916 4.257-1.353 1.557-0.431 3.12-0.777 4.54-1.020 3.647 3.339 6.861 3.867 8.477 3.867 1.989 0 2.699-0.823 2.937-1.496 0.373-0.867 0.093-1.827-0.336-2.32zM29.617 21.896c-0.139 0.725-0.851 1.208-1.848 1.208-0.28 0-0.52-0.049-0.804-0.096-1.813-0.433-3.511-1.355-5.204-2.808 1.667-0.285 3.080-0.333 3.973-0.333 0.987 0 1.84 0.043 2.413 0.192 0.653 0.141 1.693 0.58 1.46 1.84zM19.587 19.62c-1.227 0.253-2.552 0.552-3.925 0.924-1.088 0.297-2.221 0.632-3.36 1.027 0.617-1.203 1.139-2.365 1.611-3.471 0.571-1.36 1.040-2.76 1.513-4.061 0.467 0.813 0.987 1.64 1.507 2.373 0.853 1.16 1.747 2.267 2.64 3.227zM13.387 1.64c0.193-0.387 0.573-0.581 0.904-0.581 0.993 0 1.183 1.157 1.183 2.080 0 1.557-0.472 3.923-1.28 6.623-1.416-3.76-1.513-6.907-0.807-8.121zM8.184 24.169c-2.413 4.057-4.731 6.577-6.151 6.577-0.28 0-0.516-0.1-0.707-0.244-0.285-0.288-0.427-0.629-0.331-1.013 0.284-1.453 2.981-3.484 7.188-5.32z"></path>
                    </symbol>
                    <!-- Chart Buttons -->
                    <symbol id="icon-open-circle" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 28c-6.627 0-12-5.373-12-12s5.373-12 12-12c6.627 0 12 5.373 12 12s-5.373 12-12 12z"></path>
                    </symbol>
                    <symbol id="icon-stats-dots" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M4 28h28v4h-32v-32h4zM9 26c-1.657 0-3-1.343-3-3s1.343-3 3-3c0.088 0 0.176 0.005 0.262 0.012l3.225-5.375c-0.307-0.471-0.487-1.033-0.487-1.638 0-1.657 1.343-3 3-3s3 1.343 3 3c0 0.604-0.179 1.167-0.487 1.638l3.225 5.375c0.086-0.007 0.174-0.012 0.262-0.012 0.067 0 0.133 0.003 0.198 0.007l5.324-9.316c-0.329-0.482-0.522-1.064-0.522-1.691 0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3-0.067 0-0.133-0.003-0.198-0.007l-5.324 9.316c0.329 0.481 0.522 1.064 0.522 1.691 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-0.604 0.179-1.167 0.487-1.638l-3.225-5.375c-0.086 0.007-0.174 0.012-0.262 0.012s-0.176-0.005-0.262-0.012l-3.225 5.375c0.307 0.471 0.487 1.033 0.487 1.637 0 1.657-1.343 3-3 3z"></path>
                    </symbol>
                    <symbol id="icon-stats-bars" viewBox="0 0 32 32">
                        <title></title>
                        <path d="M0 26h32v4h-32zM4 18h4v6h-4zM10 10h4v14h-4zM16 16h4v8h-4zM22 4h4v20h-4z"></path>
                    </symbol>
                    <!-- Kanban / Todo -->
                    <symbol id="icon-list" viewBox="0 0 32 32">
                        <path d="M0 0h8v8h-8zM12 2h20v4h-20zM0 12h8v8h-8zM12 14h20v4h-20zM0 24h8v8h-8zM12 26h20v4h-20z"></path>
                    </symbol>
                    <!-- User Guide -->
                    <symbol id="icon-book" viewBox="0 0 32 32">
                        <path d="M28 4v26h-21c-1.657 0-3-1.343-3-3s1.343-3 3-3h19v-24h-20c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24v-28h-2z"></path>
                        <path d="M7.002 26v0c-0.001 0-0.001 0-0.002 0-0.552 0-1 0.448-1 1s0.448 1 1 1c0.001 0 0.001-0 0.002-0v0h18.997v-2h-18.997z"></path>
                    </symbol>
                    <!-- Slides -->
                    <symbol id="icon-images" viewBox="0 0 36 32">
                        <path d="M34 4h-2v-2c0-1.1-0.9-2-2-2h-28c-1.1 0-2 0.9-2 2v24c0 1.1 0.9 2 2 2h2v2c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-24c0-1.1-0.9-2-2-2zM4 6v20h-1.996c-0.001-0.001-0.003-0.002-0.004-0.004v-23.993c0.001-0.001 0.002-0.003 0.004-0.004h27.993c0.001 0.001 0.003 0.002 0.004 0.004v1.996h-24c-1.1 0-2 0.9-2 2v0zM34 29.996c-0.001 0.001-0.002 0.003-0.004 0.004h-27.993c-0.001-0.001-0.003-0.002-0.004-0.004v-23.993c0.001-0.001 0.002-0.003 0.004-0.004h27.993c0.001 0.001 0.003 0.002 0.004 0.004v23.993z"></path>
                        <path d="M30 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
                        <path d="M32 28h-24v-4l7-12 8 10h2l7-6z"></path>
                    </symbol>
                    <symbol id="icon-sad2" viewBox="0 0 32 32">
                        <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM22 8c1.105 0 2 0.895 2 2s-0.895 2-2 2-2-0.895-2-2 0.895-2 2-2zM10 8c1.105 0 2 0.895 2 2s-0.895 2-2 2-2-0.895-2-2 0.895-2 2-2zM22.003 24.398c-1.224-2.036-3.454-3.398-6.003-3.398s-4.779 1.362-6.003 3.398l-2.573-1.544c1.749-2.908 4.935-4.855 8.576-4.855s6.827 1.946 8.576 4.855l-2.573 1.544z"></path>
                    </symbol>
                    <symbol id="icon-notification" viewBox="0 0 32 32">
                        <path d="M16 3c-3.472 0-6.737 1.352-9.192 3.808s-3.808 5.72-3.808 9.192c0 3.472 1.352 6.737 3.808 9.192s5.72 3.808 9.192 3.808c3.472 0 6.737-1.352 9.192-3.808s3.808-5.72 3.808-9.192c0-3.472-1.352-6.737-3.808-9.192s-5.72-3.808-9.192-3.808zM16 0v0c8.837 0 16 7.163 16 16s-7.163 16-16 16c-8.837 0-16-7.163-16-16s7.163-16 16-16zM14 22h4v4h-4zM14 6h4v12h-4z"></path>
                    </symbol>
                    <symbol id="icon-download" viewBox="0 0 32 32">
                        <path d="M16 18l8-8h-6v-8h-4v8h-6zM23.273 14.727l-2.242 2.242 8.128 3.031-13.158 4.907-13.158-4.907 8.127-3.031-2.242-2.242-8.727 3.273v8l16 6 16-6v-8z"></path>
                    </symbol>
                    <!-- Meetings -->
                    <symbol id="icon-bookmarks" viewBox="0 0 32 32">
                        <path d="M8 4v28l10-10 10 10v-28zM24 0h-20v28l2-2v-24h18z"></path>
                    </symbol>
                    <!-- Calendar -->
                    <symbol id="icon-calendar" viewBox="0 0 32 32">
                        <path d="M10 12h4v4h-4zM16 12h4v4h-4zM22 12h4v4h-4zM4 24h4v4h-4zM10 24h4v4h-4zM16 24h4v4h-4zM10 18h4v4h-4zM16 18h4v4h-4zM22 18h4v4h-4zM4 18h4v4h-4zM26 0v2h-4v-2h-14v2h-4v-2h-4v32h30v-32h-4zM28 30h-26v-22h26v22z"></path>
                    </symbol>
                    <!-- Arrow Up (Round) -->
                    <symbol id="icon-arrow-up2" viewBox="0 0 32 32">
                        <path d="M27.414 12.586l-10-10c-0.781-0.781-2.047-0.781-2.828 0l-10 10c-0.781 0.781-0.781 2.047 0 2.828s2.047 0.781 2.828 0l6.586-6.586v19.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-19.172l6.586 6.586c0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586c0.781-0.781 0.781-2.047 0-2.828z"></path>
                    </symbol>
                    <!-- Checkbox Checked -->
                    <symbol id="icon-checkbox-checked" viewBox="0 0 32 32">
                        <path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>
                    </symbol>
                    <!-- Files Empty -->
                    <symbol id="icon-files-empty" viewBox="0 0 32 32">
                        <path d="M28.681 11.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-11.5c-1.379 0-2.5 1.122-2.5 2.5v23c0 1.378 1.121 2.5 2.5 2.5h19c1.378 0 2.5-1.122 2.5-2.5v-15.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 9.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268v0zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-19c-0.271 0-0.5-0.229-0.5-0.5v-23c0-0.271 0.229-0.5 0.5-0.5 0 0 11.499-0 11.5 0v7c0 0.552 0.448 1 1 1h7v15.5z"></path>
                        <path d="M18.841 1.319c-1.612-1.182-2.393-1.319-2.841-1.319h-11.5c-1.378 0-2.5 1.121-2.5 2.5v23c0 1.207 0.86 2.217 2 2.45v-25.45c0-0.271 0.229-0.5 0.5-0.5h15.215c-0.301-0.248-0.595-0.477-0.873-0.681z"></path>
                    </symbol>
                    <!-- Question -->
                    <symbol id="icon-question" viewBox="0 0 32 32">
                        <path d="M14 22h4v4h-4zM22 8c1.105 0 2 0.895 2 2v6l-6 4h-4v-2l6-4v-2h-10v-4h12zM16 3c-3.472 0-6.737 1.352-9.192 3.808s-3.808 5.72-3.808 9.192c0 3.472 1.352 6.737 3.808 9.192s5.72 3.808 9.192 3.808c3.472 0 6.737-1.352 9.192-3.808s3.808-5.72 3.808-9.192c0-3.472-1.352-6.737-3.808-9.192s-5.72-3.808-9.192-3.808zM16 0v0c8.837 0 16 7.163 16 16s-7.163 16-16 16c-8.837 0-16-7.163-16-16s7.163-16 16-16z"></path>
                    </symbol>
                    <!-- Pie Chart -->
                    <symbol id="icon-pie-chart" viewBox="0 0 32 32">
                        <path d="M14 18v-14c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14c0-2.251-0.532-4.378-1.476-6.262l-12.524 6.262zM28.524 7.738c-2.299-4.588-7.043-7.738-12.524-7.738v14l12.524-6.262z"></path>
                    </symbol>
                    <!-- Flag -->
                    <symbol id="icon-flag" viewBox="0 0 32 32">
                        <path d="M0 0h4v32h-4v-32z"></path>
                        <path d="M26 20.094c2.582 0 4.83-0.625 6-1.547v-16c-1.17 0.922-3.418 1.547-6 1.547s-4.83-0.625-6-1.547v16c1.17 0.922 3.418 1.547 6 1.547z"></path>
                        <path d="M19 1.016c-1.466-0.623-3.61-1.016-6-1.016-3.012 0-5.635 0.625-7 1.547v16c1.365-0.922 3.988-1.547 7-1.547 2.39 0 4.534 0.393 6 1.016v-16z"></path>
                    </symbol>
                    <!-- Info -->
                    <symbol id="icon-info" viewBox="0 0 32 32">
                        <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
                        <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
                        <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                    </symbol>
                    <!--- Zoom in -->
                    <symbol id="icon-zoom-in" viewBox="0 0 32 32">
                        <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM14 6h-4v4h-4v4h4v4h4v-4h4v-4h-4z"></path>
                    </symbol>
                    <!-- Zoom out -->
                    <symbol id="icon-zoom-out" viewBox="0 0 32 32">
                        <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM6 10h12v4h-12z"></path>
                    </symbol>
                    <!-- Earth -->
                    <symbol id="icon-earth" viewBox="0 0 32 32">
                        <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 30c-1.967 0-3.84-0.407-5.538-1.139l7.286-8.197c0.163-0.183 0.253-0.419 0.253-0.664v-3c0-0.552-0.448-1-1-1-3.531 0-7.256-3.671-7.293-3.707-0.188-0.188-0.442-0.293-0.707-0.293h-4c-0.552 0-1 0.448-1 1v6c0 0.379 0.214 0.725 0.553 0.894l3.447 1.724v5.871c-3.627-2.53-6-6.732-6-11.489 0-2.147 0.484-4.181 1.348-6h3.652c0.265 0 0.52-0.105 0.707-0.293l4-4c0.188-0.188 0.293-0.442 0.293-0.707v-2.419c1.268-0.377 2.61-0.581 4-0.581 2.2 0 4.281 0.508 6.134 1.412-0.13 0.109-0.256 0.224-0.376 0.345-1.133 1.133-1.757 2.64-1.757 4.243s0.624 3.109 1.757 4.243c1.139 1.139 2.663 1.758 4.239 1.758 0.099 0 0.198-0.002 0.297-0.007 0.432 1.619 1.211 5.833-0.263 11.635-0.014 0.055-0.022 0.109-0.026 0.163-2.541 2.596-6.084 4.208-10.004 4.208z"></path>
                    </symbol>
                    <!-- Push pin -->
                    <symbol id="icon-pushpin" viewBox="0 0 32 32">
                        <path d="M17 0l-3 3 3 3-7 8h-7l5.5 5.5-8.5 11.269v1.231h1.231l11.269-8.5 5.5 5.5v-7l8-7 3 3 3-3-15-15zM14 17l-2-2 7-7 2 2-7 7z"></path>
                    </symbol>
                    <!-- Embed 2 -->
                    <symbol id="icon-embed2" viewBox="0 0 40 32">
                        <path d="M26 23l3 3 10-10-10-10-3 3 7 7z"></path>
                        <path d="M14 9l-3-3-10 10 10 10 3-3-7-7z"></path>
                        <path d="M21.916 4.704l2.171 0.592-6 22.001-2.171-0.592 6-22.001z"></path>
                    </symbol>
                    <!-- Play 3 -->
                    <symbol id="icon-play3" viewBox="0 0 100 100">
                        <path d="M18.75 12.5l62.5 37.5-62.5 37.5z"></path>
                    </symbol>
                    <!-- Display -->
                    <symbol id="icon-display" viewBox="0 0 100 100">
                        <path d="M0 6.25v62.5h100v-62.5h-100zM93.75 62.5h-87.5v-50h87.5v50zM65.625 75h-31.25l-3.125 12.5-6.25 6.25h50l-6.25-6.25z"></path>
                    </symbol>
                    <!-- Bootstrap: Caret left fill -->
                    <symbol id="icon-caret-left-fill" viewBox="0 0 16 16">
                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                    </symbol>
                    <!-- Bootstrap: Caret left -->
                    <symbol id="icon-caret-left" viewBox="0 0 16 16">
                        <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z"/>
                    </symbol>
                    <!-- Bootstrap: Caret right fill -->
                    <symbol id="icon-caret-right-fill" viewBox="0 0 16 16">
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                    </symbol>
                    <!-- Bootstrap: Caret right -->
                    <symbol id="icon-caret-right" viewBox="0 0 16 16">
                        <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                    </symbol>
                    <!-- Bootstrap: Chat right text -->
                    <symbol id="icon-chat-right-text" viewBox="0 0 16 16">
                        <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                        <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                    </symbol>
                    <!-- Bootstrap: People -->
                    <symbol id="icon-people" viewBox="0 0 16 16">
                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                    </symbol>
                    <!-- Bootstrap: Code square -->
                    <symbol id="icon-code-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z"/>
                    </symbol>
                    <!-- Bootstrap: Code slash -->
                    <symbol id="icon-code-slash" viewBox="0 0 16 16">
                        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
                    </symbol>
                    <!-- Bootstrap: Info -->
                    <symbol id="icon-bs-info" viewBox="0 0 16 16">
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </symbol>
                    <!-- Bootstrap: Info circle -->
                    <symbol id="icon-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </symbol>
                    <!-- Bootstrap: Gear -->
                    <symbol id="icon-bs-gear" viewBox="0 0 16 16">
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                    </symbol>
                    <!-- Bootstrap: Plus -->
                    <symbol id="icon-bs-plus" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </symbol>
                    <!-- Bootstrap: Cloud arrow up -->
                    <symbol id="icon-bs-cloud-arrow-up" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                    </symbol>
                    <!-- Bootstrap: Clipboard Check -->
                    <symbol id="icon-bs-clipboard-check" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </symbol>
                    <!-- Bootstrap: Activity -->
                    <symbol id="icon-bs-activity" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>
                    </symbol>
                     <!-- Bootstrap: Wrench -->
                    <symbol id="icon-bs-wrench" viewBox="0 0 16 16">
                        <path d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364L.102 2.223zm13.37 9.019.528.026.287.445.445.287.026.529L15 13l-.242.471-.026.529-.445.287-.287.445-.529.026L13 15l-.471-.242-.529-.026-.287-.445-.445-.287-.026-.529L11 13l.242-.471.026-.529.445-.287.287-.445.529-.026L13 11l.471.242z"/>
                    </symbol>
                    <!-- Bootstrap: pause-btn -->
                    <symbol id="icon-bs-pause-btn" viewBox="0 0 16 16">
                        <path d="M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"/>
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                    </symbol>
                    <!-- Bootstrap: File earmark ruled -->
                    <symbol id="icon-bs-file-earmarked-ruled" viewBox="0 0 16 16">
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h7v1a1 1 0 0 1-1 1H6zm7-3H6v-2h7v2z"/>
                    </symbol>
                    <!-- Bootstrap: Person plus -->
                    <symbol id="icon-bs-person-plus" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                        <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                    </symbol>
                    <!-- Bootstrap: Book -->
                    <symbol id="icon-bs-book" viewBox="0 0 16 16">
                        <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                    </symbol>
                    <!-- Bootstrap: Trash -->
                    <symbol id="icon-bs-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </symbol>
                    ${addSymbols()}
                </defs>
            </svg>
        `,
        style: /*css*/ `

        `,
        parent,
        position
    });

    function addSymbols() {
        let html = '';

        if (Array.isArray(svgSymbols)) {
            svgSymbols.forEach(svgSymbol => {
                html += svgSymbol
            });
        }

        return html;
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function TasksList(param) {
    const {
        label,
        labelWeight,
        labelSize,
        options,
        onCheck,
        direction,
        wrap,
        parent,
        width,
        position,
        margin,
        padding,
        fieldMargin,
        onAddNewItem,
        onDelete
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<div class='form-field-label'>${label}</div>` : ''}
                ${createChoiceGroups()}
            </div>   
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            #id .form-field-label {
                font-size: ${labelSize || '1.1em'};
                font-weight: ${labelWeight || 'bold'};
                padding: 5px 0px;
            }

            #id .form-field-multi-select-container {
                display: flex;
                flex-direction: ${direction || 'column'};
                flex-wrap: ${wrap || 'wrap'};
                user-select: none;
                padding: ${padding || '0px 0px 20px 0px'};
                margin: ${margin || '0px'};
            }

            #id .form-field-multi-select-row {
                /* width: ${width || '100%'}; */
                width: ${width || 'unset'};
                display: flex;
                flex-direction: row;
            }

            #id .form-field-multi-select-row:first-child {
                margin-top: 5px;
            }

            #id .form-field-multi-select-row:not(:last-child) {
                margin-bottom: 15px;
            }

            #id .form-field-multi-select-row.flex-start {
                align-items: flex-start;
            }

            #id .form-field-multi-select-row.flex-start .form-field-multi-select-value,
            #id .form-field-multi-select-row.flex-start .select-all-title {
                margin-top: 2px;
            }

            ${direction === 'row' ?
                /*css*/`
                    #id .form-field-multi-select-row {
                        margin-left: 20px;
                        margin-bottom: 10px;
                    }
                ` :
                ''
            }

            #id .form-field-multi-select-value,
            #id .select-all-title {
                white-space: nowrap;
                margin-left: 5px;
                padding: 0px;
                font-size: 1em;
                border: none;
                outline: none;
            }

            #id .select-all-title {
                color: ${App.get('primaryColor')};
                font-weight: 500;
                padding: 5px 0px;
            }

            /** Checkboxes */
            #id label {
                margin-bottom: 0px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #id input[type='checkbox'] {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            #id input[type='checkbox'] ~ .toggle {
                width: 20px;
                height: 20px;
                position: relative;
                display: inline-block;
                vertical-align: middle;
                background: white;
                border: solid 2px lightgray;
                border-radius: 4px;
                cursor: pointer;
            }

            #id input[type='checkbox']:hover ~ .toggle {
                border-color: mediumseagreen;
            }

            #id input[type='checkbox']:checked ~ .toggle {
                border: solid 2px mediumseagreen;
                background: mediumseagreen url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
            }

            /** Add an item */
            #id .add-an-item {
                background: transparent;
                border-bottom: solid 2px gray;
                width: 100%;
                min-width: 100px;
            }

            #id .add-an-item:focus,
            #id .add-an-item:active {
                border-bottom: solid 2px ${App.get('primaryColor')};
            }

            /** Placeholder */
            /** {@link https://stackoverflow.com/a/61659129} */
            #id [contenteditable=true]:empty:before{
                content: attr(placeholder);
                pointer-events: none;
                /* display: block; */ /* For Firefox */
            }

            /** Delete task */
            #id .delete-task {
                margin-left: 10px;
                color: firebrick;
                cursor: pointer;
                display: none;
                font-size: 1.5em;
                line-height: .75;
            }

            #id .form-field-multi-select-row:hover > .delete-task {
                display: inline;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id  input.select-all',
                event: 'change',
                listener: selectAll
            },
            {
                selector: '#id input:not(.select-all)',
                event: 'change',
                listener: toggleSelectALL
            },
            {
                selector: '#id .form-field-multi-select-value.add-an-item',
                event: 'keypress',
                listener(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();

                        /** Runtime */
                        if (onAddNewItem) {
                            onAddNewItem(event);
                        }

                        return false;
                    }
                }
            },
            {
                selector: '#id .form-field-multi-select-value.add-an-item',
                event: 'focusout',
                listener: onAddNewItem
            },
            {
                selector: '#id .form-field-multi-select-value.add-an-item',
                event: 'paste',
                /** {@link https://stackoverflow.com/a/12028136} */
                listener(e) {
                    // cancel paste
                    e.preventDefault();

                    // get text representation of clipboard
                    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

                    // insert text manually
                    document.execCommand("insertHTML", false, text);
                }
            },
            {
                selector: '#id .delete-task',
                event: 'click',
                listener(event) {
                    event.target.closest('.form-field-multi-select-row ').remove();

                    onDelete(event.target.dataset.itemid);
                }
            }
        ]
    });

    function createChoiceGroups() {
        let html = ''

        options.forEach(group => {
            const {
                title,
                items,
                align
            } = group;

            html += /*html*/ `
                <div class='form-field-multi-select-container' data-group='${title}'>
            `;

            if (title !== '') {
                html += /*html*/ `
                    <div class='form-field-multi-select-row ${align}'>
                        <label>
                            <input type='checkbox' class='select-all' data-group='${title}'>
                            <span class='toggle'></span>
                        </label>
                        <span class='select-all-title'>${title}</span>
                    </div>
                `;
            }

            items.forEach(item => {
                html += rowTemplate(item, title, align);
            });

            html += /*html*/ `
                    <div class='form-field-multi-select-row'>
                        <label>
                            <input type='checkbox' disabled>
                            <span class='toggle'></span>
                        </label>
                        <!-- <input type='text' class='form-field-multi-select-value add-an-item' placeholder='Add an item'> -->
                        <div class='form-field-multi-select-value add-an-item' placeholder='Add an item' contenteditable='true'></div>
                    </div>
                </div>
            `;
        });

        return html;
    }

    function rowTemplate(item, group, align) {
        const {
            id,
            value,
            checked,
            CompletedBy,
            Completed
        } = item;

        // console.log(id, CompletedBy);

        return /*html*/ `
            <div class='form-field-multi-select-row ${align ? align : ''}'>
                <label>
                    <input type='checkbox' data-group='${group}' data-itemid='${id}'${checked ? ' checked' : ''}>
                    <span class='toggle'></span>
                </label>
                <span class='form-field-multi-select-value'>${value}</span>
                <span class='delete-task' data-itemid='${id}'>&times;</span>
                <!-- If Completed, show name -->
                <!-- <span class="assigned-name" data-account="stephen.matheis"></span> -->
            </div>
        `;
    }

    /** Select all Radio buttons in group */
    function selectAll(event) {
        const group = this.dataset.group;
        const state = this.checked;
        const radioButtons = component.findAll(`input[data-group='${group}']`);

        radioButtons.forEach(button => {
            button.checked = state;
        });
    }

    /** Auto toggle Group Title Radio button */
    function toggleSelectALL(event) {
        const group = this.dataset.group;
        const all = component.findAll(`input[data-group='${group}']:not(.select-all)`).length;
        const checked = component.findAll(`input[data-group='${group}']:not(.select-all):checked`).length;
        const state = all === checked ? true : false;

        const selectAll = component.find(`input.select-all[data-group='${group}']`);

        if (selectAll) {
            selectAll.checked = state;
        }

        if (onCheck) {
            onCheck(event);
        }
    }

    component.setValue = (itemId, value) => {
        const checkbox = component.find(`input[data-itemid='${itemId}']`);

        if (checkbox) {
            checkbox.checked = value;
        }
    }

    component.addOption = (param) => {
        const {
            option,
            group
        } = param;

        const container = component.find(`.form-field-multi-select-container[data-group='${group}']`);

        container.insertAdjacentHTML('beforeend', rowTemplate(option, group, true));

        const node = component.find(`input[data-group='${group}'][data-itemid='${itemToAdd.id}']`);

        if (node) {
            node.addEventListener('change', toggleSelectALL);
        }
    }

    component.addItemAbove = (param) => {
        const {
            group,
            itemToAdd,
            item
        } = param;

        const row = item.closest('.form-field-multi-select-row');

        row.insertAdjacentHTML('beforebegin', rowTemplate(itemToAdd, group, true));

        const newCheckbox = component.find(`input[data-group='${group}'][data-itemid='${itemToAdd.id}']`);

        if (newCheckbox) {
            newCheckbox.addEventListener('change', toggleSelectALL);
        }

        const newDelete = component.find(`.delete-task[data-itemid='${itemToAdd.id}']`);

        if (newDelete) {
            newDelete.addEventListener('click', event => {
                event.target.closest('.form-field-multi-select-row ').remove();

                onDelete(event.target.dataset.itemid);
            });
        }

        item.innerText = '';
    }

    component.value = (type) => {
        const rows = component.findAll('.form-field-multi-select-row input:checked');

        return [...rows].map(item => {
            if (type === 'id') {
                return parseInt(item.dataset.itemid);
            } else {
                const value = item.closest('.form-field-multi-select-row').querySelector('.form-field-multi-select-value')

                return value.innerText;
            }
        });
    }

    return component
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Timer(param) {
    const {
        parent,
        start,
        stop,
        reset,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='card'>
                    <div class='card-body'>
                        <h5 class='card-title'>Run action</h5>
                        <div class='stopwatch' id='stopwatch'>00:00:00</div>
                        <button class='btn btn-success start'>Start</button>
                        <button class='btn btn-danger stop'>Stop</button>
                        <button class='btn btn-secondary reset'>Reset</button>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            .stopwatch {
                margin: 20px 0px;
                font-size: 1.5em;
                font-weight: bold;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .start`,
                event: 'click',
                listener(event) {
                    component.start();
                }
            },
            {
                selector: `#id .stop`,
                event: 'click',
                listener(event) {
                    component.stop();
                }
            },
            {
                selector: `#id .reset`,
                event: 'click',
                listener(event) {
                    component.reset();
                }
            }
        ]
    });

    let time;
    let ms = 0;
    let sec = 0;
    let min = 0;

    function timer() {
        ms++;

        if (ms >= 100) {
            sec++
            ms = 0
        }

        if (sec === 60) {
            min++
            sec = 0
        }

        if (min === 60) {
            ms, sec, min = 0;
        }

        let newMs = ms < 10 ? `0${ms}` : ms;
        let newSec = sec < 10 ? `0${sec}` : sec;
        let newMin = min < 10 ? `0${min}` : min;

        component.find('.stopwatch').innerHTML = `${newMin}:${newSec}:${newMs}`;
    };

    component.start = () => {
        time = setInterval(timer, 10);

        if (start) {
            start();
        }
    }

    component.stop = () => {
        clearInterval(time)

        if (stop) {
            stop();
        }
    }

    component.reset = () => {
        ms = 0;
        sec = 0;
        min = 0;

        component.find('.stopwatch').innerHTML = '00:00:00';

        if (reset) {
            reset();
        }
    }

    return component;
}

/**
 * 
 * @param {object} param 
 * 
 * @example Title({
 *     title: 'Test',
 *     parent: someOtherComponent
 * });
 * 
 * @returns {Object} Component.
 */
export function Title(param) {
    const {
        title,
        subTitle,
        breadcrumb,
        dropdownGroups,
        maxTextWidth,
        route,
        margin,
        parent,
        position,
        date,
        type,
        action
    } = param;

    /**
     * @todo show ticking time
     */
    const component = Component({
        html: /*html*/ `
            <div class='title ${type || ''}'>
                <div class='title-subtitle'>
                    <h1 class='app-title'>${title}</h1>
                    ${subTitle !== undefined ? `<h2>${subTitle}</h2>` : ''}
                    ${breadcrumb !== undefined ?
                        /*html*/ `
                            <h2 ${dropdownGroups && dropdownGroups.length ? `style='margin-right: 0px;'` : ''}>
                                ${buildBreadcrumb(breadcrumb)}
                                ${dropdownGroups && dropdownGroups.length ? `<span class='_breadcrumb-spacer'>/</span>` : ''}
                                ${dropdownGroups && dropdownGroups.length ?
                                    /*html*/ `
                                        ${buildDropdown(dropdownGroups)}
                                    ` :
                    ''
                }
                            </h2>
                        ` :
                ''
            }
                </div>
                ${date !== undefined ? `<div class='title-date'>${date}</div>` : ''}
            </div>
        `,
        style: /*css*/ `
            #id {
                
                margin: ${margin || '0px'};
            }

            #id .app-title {
                cursor: pointer;
            }

            #id .title-subtitle {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: baseline;
            }

            #id.title h1 {
                font-family: 'M PLUS Rounded 1c', sans-serif; /* FIXME: experimental */
                font-size: 1.6em;
                font-weight: 900;
                color: ${App.get('titleColor')};
                margin-top: 0px;
                margin-bottom: 10px;
            }

            #id.title h2 {
                font-size: 1.1em;
                font-weight: 500;
                color: ${App.get('primaryColor')};
                margin: 0px;
            }

            #id.title .title-date {
                font-size: 13px;
                font-weight: 500;
                color: ${App.get('primaryColor')};
                margin: 0px;
            }

            #id.title .title-date * {
                color: ${App.get('primaryColor')};
            }

            #id.across {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: baseline;
                flex-wrap: wrap;
                white-space: nowrap;
            }

            #id.across h2 {
                margin: 0px 40px;
            }

            /* a, spacer */
            #id a,
            #id ._breadcrumb-spacer,
            #id ._breadcrumb {
                color: #1c6cbb
            }

            /** Breadcrumb */
            #id ._breadcrumb {
                color: darkslategray;
            }

            #id .route {
                cursor: pointer;
                color: #1c6cbb;
            }

            #id .current-page {
                color: darkslategray;
            }

            /** Dropdown */
            #id .dropdown-menu {
                margin-top: 5px;
                max-height: 75vh;
                overflow-y: auto;
            }

            #id .dropdown-item {
                cursor: pointer;
                font-size: 14px;
            }

            #id .nav {
                display: inline-flex;
            }

            #id .nav-link {
                padding: 0px;
                overflow: hidden;
                text-overflow: ellipsis;
                /** max-width: ${maxTextWidth || '455px'}; **/
                line-height: normal;
            }

            #id .nav-pills .show > .nav-link {
                color: #1c6cbb;
                background-color: initial;
            }

            #id .no-menu [role=button] {
                cursor: initial;
            }

            #id .no-menu .dropdown-toggle,
            #id .no-menu .nav-pills .show > .nav-link {
                color: ${App.get('primaryColor')};
            }

            #id .no-menu .dropdown-toggle::after {
                display: none;
            }

            #id .no-menu .dropdown-menu {
                display: none;
            }

            @media (max-width: 1024px) {
                #id.across h2 {
                    margin: 0px 45px;
                }

                #id .nav-link {
                    max-width: 200px;
                }
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .app-title',
                event: 'click',
                listener(event) {
                    action ? action(event) : Route('Home');
                }
            },
            {
                selector: '#id .route',
                event: 'click',
                listener: goToRoute
            }
        ]
    });

    function buildBreadcrumb(breadcrumb) {
        if (!Array.isArray(breadcrumb)) {
            return '';
        }

        return breadcrumb.map(part => {
            const {
                label,
                path,
                currentPage
            } = part;

            return /*html*/ `
                <span class='_breadcrumb ${currentPage ? 'current-page' : 'route'}' data-path='${path}'>${label}</span>
            `;
        }).join(/*html*/ `
            <span class='_breadcrumb-spacer'>/</span>
        `);
    }

    function buildDropdown(dropdownGroups) {
        return dropdownGroups
            .map(dropdown => dropdownTemplate(dropdown))
            .join(/*html*/ `
            <span class='_breadcrumb-spacer'>/</span>
        `);
    }

    function dropdownTemplate(dropdown) {
        const {
            name,
            dataName,
            items
        } = dropdown;

        let html = /*html*/ `
            <span data-name='${dataName || name}' class='${items.length === 0 ? 'no-menu' : ''}'>
                <ul class='nav nav-pills'>
                    <li class='nav-item dropdown'>
                        <a class='nav-link dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'>${name}</a>
                        <div class='dropdown-menu'>
        `;

        items.forEach(part => {
            const {
                label,
                path
            } = part;

            html += /*html*/ `
                <span class='dropdown-item route' data-path='${path}'>${label}</span>
            `;
        });

        html += /*html*/ `
                        </div>
                    </li>
                </ul>
            </span>
        `;

        return html;
    }

    function goToRoute(event) {
        if (route) {
            console.log(event.target.dataset.path);

            route(event.target.dataset.path);
        }
    }

    /** Only works if dropdown already exists */
    component.updateDropdown = (param) => {
        const {
            name,
            replaceWith
        } = param;

        const node = component.find(`span[data-name='${name}']`);

        if (node) {
            node.insertAdjacentHTML('afterend', dropdownTemplate(replaceWith));

            component.findAll(`span[data-name='${replaceWith.dataName || replaceWith.name}'] .route`).forEach(route => {
                route.addEventListener('click', goToRoute);
            });

            node.remove();
        }
    }

    component.setDisplayText = (text) => {
        const title = component.find('h1');

        title.innerHTML = text;
    }

    component.setSubtitle = (text) => {
        const title = component.find('h2');

        title.innerHTML = text;
    }

    component.setDate = (text) => {
        const title = component.find('.title-date');

        title.innerHTML = text;
    }

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Toast(param) {
    const {
        text,
        type,
        delay,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='notification ${type || 'information'}'>
                <div>${text}</div>
            </div>
        `,
        style: /*css*/ `
            #id.notification {
                position: fixed;
                z-index: 10000;
                top: 20px;
                right: 5px;
                font-size: 1em;
                padding: 10px 20px;
                max-width: 350px;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
                border-radius: 4px;
                animation: slidein 500ms ease-in-out forwards, slidein 500ms ease-in-out ${delay || '5s'} reverse forwards;
            }

            #id.bs-toast {
                background-color: rgba(255,255,255);
                background-clip: padding-box;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
            }

            #id.bs-toast-light {
                background-color: rgba(255,255,255,.85);
                background-clip: padding-box;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
            }

            #id.success {
                color: white;
                background: mediumseagreen;
            }

            #id.information {
                background: mediumseagreen;
            }

            #id.error {
                background: crimson;
            }

            #id.notification:not(.bs-toast) * {
                color: white;
            }

            #id .dismiss {
                font-size: 1.2em;
                position: absolute;
                top: 3px;
                right: 3px;
            }

            @keyframes slidein {
                from {
                    /* opacity: 0; */
                    transform: translate(400px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(-10px);
                }
            }
        `,
        position,
        parent,
        events: [

        ],
        onAdd() {
            setTimeout(() => {
                component.remove();
            }, delay || 6000);

            const allToasts = Store.get('maincontainer').findAll('.notification');

            if (allToasts.length > 1) {
                component.get().style.top = `${allToasts[allToasts.length - 1].getBoundingClientRect().height + 40}px`;
            }

            console.log(allToasts);
        }
    });

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Toolbar(param) {
    const {
        justify,
        margin,
        parent,
        position
    } = param;

    return Component({
        html: /*html*/ `
            <div class='toolbar'>
            
            </div>
        `,
        style: /*css*/ `
            #id.toolbar {
                display: inline-flex;
                flex-direction: row;
                justify-content: ${justify || 'flex-end'};
                border-radius: 4px;
                /* padding: 10px; */
                margin: ${margin || '15px 0px'};
                background: white;
                border:  ${App.get('defaultBorder')};
            }
        `,
        parent: parent,
        position: position || 'beforeend',
        events: [

        ]
    });
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function UploadButton(param) {
    const {
        action,
        parent,
        position,
        margin,
        type,
        value
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <button type="button" class="btn ${type}">${value}</button>
                <!-- Hidden file input -->
                <input type='file' multiple style='display: none;' id='drop-zone-files'>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || ''};
                display: inline-block;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .btn',
                event: 'click',
                listener(event) {
                    const fileInput = component.find(`input[type='file']`);

                    if (fileInput) {
                        fileInput.click();
                    }
                }
            },
            {
                selector: `#id input[type='file']`,
                event: 'change',
                async listener(event) {
                    const files = event.target.files;

                    if (files.length > 0) {
                        action(files);
                    }
                }
            }
        ]
    });

    return component;
}