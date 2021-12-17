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
    AddRoute,
    AttachFiles,
    Authorize,
    BlurOnSave,
    CheckLists,
    Component,
    CreateItem,
    DeleteApp,
    DeleteAttachments,
    DeleteItem,
    GenerateUUID,
    Get,
    GetRequestDigest,
    GetSiteUsers,
    HideRoutes,
    HSLDarker,
    ModifyFile,
    OrderRoutes,
    ReinstallApp,
    ResetApp,
    Route,
    SendEmail,
    Style,
    UpdateApp,
    UpdateItem,
    UploadFile,
    Wait,
    App,
    Store,
    Lists,
    QuestionModel,
    QuestionsModel,
    StartAndEndOfWeek,
    Themes
} from './Robi.js'

/**
 *
 * @param {*} param
 */
export async function AccountInfo(param) {
    const {
        parent,
    } = param;

    const accountInfoCard = Card({
        title: 'Account',
        width: '100%',
        margin: '20px 0px 0px 0px',
        background: App.get('backgroundColor'),
        titleBorder: 'none',
        radius: '20px',
        parent
    });

    accountInfoCard.add();

    const {
        Title, LoginName, Email, Role,
    } = Store.user();

    /** Name */
    const nameField = SingleLineTextField({
        label: 'Name',
        value: Title,
        readOnly: true,
        fieldMargin: '10px 0px 0px 0px',
        parent: accountInfoCard
    });

    nameField.add();

    /** Account */
    const accountField = SingleLineTextField({
        label: 'Account',
        value: LoginName,
        readOnly: true,
        fieldMargin: '0px 0px 0px 0px',
        parent: accountInfoCard
    });

    accountField.add();

    /** Email */
    const emailField = SingleLineTextField({
        label: 'Email',
        value: Email,
        readOnly: true,
        fieldMargin: '0px 0px 1px 0px',
        parent: accountInfoCard
    });

    emailField.add();

    /** Role */
    const roleField = SingleLineTextField({
        label: 'Role',
        value: Role || 'User',
        readOnly: true,
        fieldMargin: '0px',
        parent: accountInfoCard
    });

    roleField.add();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Alert(param) {
    const {
        text, classes, close, margin, width, parent, position, top
    } = param;

    let {
        type
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='alert alert-${type} ${classes?.join(' ')}' role='alert'>
                ${text || ''}
                ${
                    close ?
                    /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `: ''
                }
            </div>
        `,
        style: /*css*/ `
            #id {
                font-size: 14px;
                border-radius: 10px;
                border: none;
                margin: ${margin || '0px 0px 10px 0px'};
            }

            /* #id *:not(button) {
                color: inherit;
            } */

            #id.alert-blank {
                padding: 0px;    
            }
            
            ${
                width ?
                /*css*/ `
                    #id {
                        width: ${width};
                    }
                ` :
                ''
            }

            @keyframes alert-in {
                0% {
                    transform: translateY(-50px);
                    /* transform: scale(0) translateY(-50px); */
                    /* transform-origin: top left; */
                    opacity: 0;
                }

                100% {
                    transform: translateY(0px);
                    /* transform: scale(1) translateY(0px); */
                    /* transform-origin: top left; */
                    z-index: 1000;
                    opacity: 1;
                }
            }

            .alert-in {
                position: absolute;
                top: ${top || 0}px;
                animation: 200ms ease-in-out forwards alert-in;
            }
        `,
        parent,
        position
    });

    component.update = (param) => {
        const {
            type: newType, text: newText
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
    };

    return component;
}

/**
 *
 * @returns
 */
export function AppContainer() {
    const component = Component({
        name: 'appcontainer',
        html: /*html*/ `
            <div class='appcontainer'></div>
        `,
        style: /*css*/ `
            .appcontainer {
                display: none;
                background: ${App.get('secondaryColor')};
            }
            
            *, ::after, ::before {
                box-sizing: border-box;
            }
            
            body {
                padding: 0px;
                margin: 0px;
                box-sizing: border-box;
                background: ${App.get('secondaryColor')};
                overflow: hidden;
                font-family: ${App.fontFamily || ` -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`};
                color: ${App.get('defaultColor')};
            }
            
            body::-webkit-scrollbar { 
                display: none; 
            }
            
            ::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            
            ::-webkit-scrollbar-track {
                background: inherit;
            }
            
            ::-webkit-scrollbar-thumb {
                background: lightgray;
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
            }

            /** Wait */
            .appcontainer.wait,
            .appcontainer.wait * {
                pointer-events: none;
                cursor: wait !important;
            }

            /* Links */
            a:hover {
                color: ${App.get('primaryColor')};
                text-decoration: underline;
            }
            
            a {
                color: ${App.get('primaryColor')};
                text-decoration: none;
                background-color: transparent;
            }

            /* Code */
            code {
                color: ${App.get('primaryColor')};
            }

            /* Button */
            button:focus {
                outline: none;
            }

            .btn {
                font-size: 14px;
                border-radius: 10px;
            }

            .btn:focus,
            .btn:active {
                box-shadow: none !important;
            }

            .btn-primary {
                background-color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-primary:hover {
                background-color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-primary:active,
            .btn-primary:focus {
                background-color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-robi-reverse,
            .btn-robi-reverse:hover {
                background: ${App.get('primaryColor')};
                color: white !important;
                font-weight: 500;
            }

            .btn-robi,
            .btn-robi:hover {
                color: ${App.get('primaryColor')};
                background: #e9ecef;
                font-weight: 500;
            }

            .btn-robi-success,
            .btn-robi-success:hover {
                color: seagreen;
                background: #e9ecef;
                font-weight: 500;
            }

            .btn-robi-light,
            .btn-robi-light:hover {
                color: ${App.get('primaryColor')};
                background: inherit;
                font-weight: 500;
            }

            .btn-light:hover {
                color: #212529 !important;
                background-color: #f8f9fa !important;
                border-color: #f8f9fa !important;
            }

            .btn-light:active,
            .btn-light:focus {
                color: #212529 !important;
                background-color: #f8f9fa !important;
                border-color: #f8f9fa !important;
            }

            .btn-outline-primary {
                color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-outline-primary:hover {
                background-color: initial !important;
                color: royalblue !important;
                border-color: royalblue !important;
            }

            .btn-subtle-primary {
                color: royalblue !important;
                border-color: ${App.get('backgroundColor')} !important;
                background-color: ${App.get('backgroundColor')} !important;
            }

            .btn-subtle-primary:hover {
                color: royalblue !important;
                border-color: ${App.get('backgroundColor')} !important;
                background-color: ${App.get('backgroundColor')} !important;
            }

            .btn-success {
                background-color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-success:hover {
                background-color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-success:active,
            .btn-success:focus {
                background-color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-danger {
                background-color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-danger:hover {
                background-color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-danger:active,
            .btn-danger:focus {
                background-color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-outline-danger {
                color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-outline-danger:hover {
                color: firebrick !important;
                border-color: firebrick !important;
            }

            .btn-outline-success {
                color: seagreen !important;
                border-color: seagreen !important;
            }

            .btn-outline-success:hover {
                color: seagreen !important;
                border-color: seagreen !important;
            }

            /* Forms*/
            .form-field {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }

            .form-field .form-field-description {
                height: 100%;
            }

            .form-control,
            .form-field-multi-line-text.editable,
            .btn.dropdown-toggle,
            .input-group-text {
                font-size: 13px !important;
            }

            .form-control,
            .form-field-multi-line-text.editable,
            .btn.dropdown-toggle,
            .dropdown-menu {
                border-radius: 10px !important;
            }

            .input-group .input-group-text {
                border-radius: 10px 0px 0px 10px !important;
            }

            .input-group .form-control {
                border-radius: 0px 10px 10px 0px !important;
            }

            .form-control:not(.dataTables_length .custom-select):focus,
            .custom-select:not(.dataTables_length .custom-select):focus {
                border-color: transparent !important;
                box-shadow: 0 0 0 3px ${App.get('primaryColor') + '6b'} !important;
            }

            .form-field-multi-line-text.editable:focus,
            .btn.dropdown-toggle:focus {
                border-color: transparent !important;
                box-shadow: 0 0 0 4px ${App.get('primaryColor') + '6b'} !important;
            }

            /* Alert */
            .alert {
                font-size: 14px;
                border: none;
                border-radius: 10px;
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

            .alert-robi-primary {
                background: ${App.get('primaryColor') + '20'} !important;
                color: hsl(${HSLDarker(App.get('primaryColorHSL'), 5)}) !important;
            }

            .alert-robi-primary *:not(.btn) {
                color: hsl(${HSLDarker(App.get('primaryColorHSL'), 5)}) !important;
            }

            .alert-robi-primary-high-contrast {
                background: ${App.get('primaryColor') + '19'} !important;
                color: hsl(${HSLDarker(App.get('primaryColorHSL'), 10)}) !important;
            }

            .alert-robi-primary-high-contrast *:not(.btn) {
                color: hsl(${HSLDarker(App.get('primaryColorHSL'), 10)}) !important;
            }

            .alert-robi-secondary {
                background: ${App.get('backgroundColor')} !important;
                color: ${App.get('defaultColor')} !important;
            }

            .alert-robi-secondary *:not(.btn) {
                color: ${App.get('defaultColor')} !important;
            }
            
            /** Badge */
            .badge-success {
                background: seagreen !important;
            }

            /* Text */
            .text-robi {
                color: ${App.get('primaryColor')} !important;
            }

            /** Code mirror */
            .CodeMirror * {
                color: unset;
                font-family: 'Inconsolata', monospace;
                font-size: 14px;
            }

            .robi-code-background {
                background: #292D3E;
            }

            .loading-file {
                font-family: 'Inconsolata', monospace;    
            }

            .file-title {
                width: 100%;
                background-color: #292D3E;
                display: flex;
                align-items: center;
                padding-bottom: .75rem;
            }

            .file-title * {
                font-family: 'Inconsolata', monospace; 
                font-size: 14px;
                color: white;
            }

            .file-icon-container {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 10px;
                margin-left: .75rem;
            }

            .file-icon {
                font-size: 16px;
            }

            .file-icon-css {
                fill: dodgerblue !important;
            }

            .file-icon-html {
                fill: dodgerblue !important;
            }

            .file-icon-js {
                fill: #F7DF1E !important;
            }

            /* Install Console */
            .console {
                width: 100%;
                height: 100%;
                overflow: overlay;
                background: ${App.get('backgroundColor')};
            }

            .console * {
                color: ${App.get('defaultColor')} !important;
            }

            .console::-webkit-scrollbar {
                width: 15px;
            }

            .console::-webkit-scrollbar-thumb {
                min-height: 50px;
                border-radius: 20px;
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
                background: ${App.get('backgroundColor')};
                color: white !important;
                animation: fade-in-bottom 200ms ease-in-out forwards;
            };

            .install-alert * {
                color: white !important;
            };

            @keyframes fade-alert {
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

            /* Dialog boxes */
            @keyframes dialog-fade {
                0% {
                    transform: scale(.5);
                    opacity: 0;
                }

                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .dialog-box {
                animation: dialog-fade 200ms ease-in-out forwards;
            }

            /* Taggle */
            @keyframes bounce {
                0%,
                20%,
                50%,
                80%,
                100% {
                    -webkit-transform: translateY(0);
                    transform: translateY(0);
                }
                40% {
                    -webkit-transform: translateY(-16px);
                    transform: translateY(-16px);
                }
                60% {
                    -webkit-transform: translateY(-7px);
                    transform: translateY(-7px);
                }
            }

            .bounce {
                -webkit-animation-name: bounce;
                animation-name: bounce;
            }

            /* Shrink app */
            @keyframes shrink-app {
                from {
                    transform: scale(1);
                }

                to {
                    transform: scale(.95);
                }
            }

            .shrink-app {
                animation: 400ms ease-in-out forwards shrink-app;
            }

            /* Switches */
            .custom-control-input:checked ~ .custom-control-label::before {
                color: #fff;
                border-color: ${App.get('primaryColor')};
                background-color: ${App.get('primaryColor')};
            }

            .custom-control-input:focus ~ .custom-control-label::before {
                box-shadow: 0 0 0 4px ${App.get('primaryColor') + '6b'} !important;
            }

            .custom-control-input:focus:not(:checked) ~ .custom-control-label::before {
                border-color: ${App.get('primaryColor') + '6b'};
            }
            
            .custom-control-input:active {
                background: ${App.get('primaryColor')};
            }

            /* Dropdown */
            .dropdown-menu {
                margin: .125rem;
                padding: .125rem;
            }
            
            .scroll-container {
                overflow: overlay;
            }

            .dropdown-item {
                cursor: pointer;
                font-size: 13px;
                border-radius: 8px;
            }

            .dropdown-item:active {
                color: initial;
                background-color: initial;
            }

            .dropdown-item:focus,
            .dropdown-item:hover {
                color: ${App.get('defaultColor')};
                text-decoration: none;
                background-color: ${App.get('primaryColor') + '20'};
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
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function AttachFilesButton(param) {
    const {
        value, list, id, margin, onAdd, parent, action
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

/**
 *
 * @param {*} param
 * @returns
 */
export function Attachments(param) {
    const {
        attachments, list, itemId, label, labelWeight, labelSize, parent, position, onDelete
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
            `;
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
                onDelete();
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
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export function AttachmentsContainer(param) {
    const {
        parent, label, description, list, itemId, onChange, library
    } = param;

    let { value } = param;
    value = value || [];

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        label: 'Loading files',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    const card = Container({
        width: '100%',
        direction: 'column',
        margin: '0px 0px 10px 0px',
        // padding: '20px',
        parent
    });

    card.add();

    const heading = Heading({
        text: label,
        margin: '0px 0px .5rem 0px',
        weight: '500',
        size: '16px',
        color: App.get('defaultColor'),
        parent: card
    });

    heading.add();

    const filesList = Files({
        description,
        onChange,
        allFiles: [],
        files: itemId ? value?.map(item => {
            return {
                url: item.OData__dlc_DocIdUrl.Url,
                name: item.File.Name,
                size: item.File.Length,
                created: item.Created,
                author: item.Author.Title
            };
        }) : value,
        itemId,
        async onUpload(file) {
            console.log(file);

            // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
            filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Queued';
            filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = 'up next';
            filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                <div style='width: 22px; height: 22px; background: #ced4da; border-radius: 50%;'></div>
            `;

            // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
            filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Uploading';
            filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = 'please wait';
            filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                <div class='spinner-grow text-secondary' role='status' style='width: 22px; height: 22px;'></div>
            `;

            const testUpload = await UploadFile({
                library: library || `${list}Files`,
                file,
                data: {
                    ParentId: itemId
                }
            });

            console.log(testUpload);
            console.log(`Measure #${itemId} Files`, value);
            value.push(testUpload)

            onChange(value);

            filesList.find(`.pending-count`).innerText = '';
            filesList.find(`.pending-count`).classList.add('hidden');
            filesList.find(`.count`).innerText = `${parseInt(filesList.find(`.count`).innerText) + 1}`;
            filesList.find(`.remove-container[data-filename='${file.name}']`).dataset.itemid = testUpload.Id;
            filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Uploaded!';
            filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = `${'ontouchstart' in window ? 'tap' : 'click'} to undo`;
            filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                <svg class='icon undo'><use href='#icon-bs-arrow-left-circle-fill'></use></svg>
            `;

            // dropZone.find('.upload').classList.add('hidden');
            // dropZone.find('.upload').innerHTML = 'Upload';
            // dropZone.find('.upload').style.pointerEvents = 'all';
            // dropZone.find('.undo-all').classList.remove('hidden');
            // dropZone.find('.reset').classList.remove('hidden');
        },
        width: '-webkit-fill-available',
        parent: card
    });

    loadingIndicator.remove();

    Store.add({
        name: 'files',
        component: filesList
    });

    return filesList;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Banner(param) {
    const {
        text, fixed, parent, position, type
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
 * @example btn-robi-primary
 * @example btn-secondary
 * @example btn-success
 * @example btn-danger
 * @example btn-warning
 * @example btn-info
 * @example btn-light
 * @example btn-dark
 *
 * @example btn-outline-robi-primary
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
        action, disabled, parent, position, classes, style, type, value
    } = param;

    const component = Component({
        html: /*html*/ `
            <button type="button" class="btn btn-${type} ${classes?.join(' ')}" ${disabled ? 'disabled' : ''} ${style ? `style='${style}'` : ''}>${value}</button>
        `,
        style: /*css*/ `

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
        component.get().disabled = false;
    };

    component.disable = () => {
        component.get().disabled = true;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function BootstrapDropdown(param) {
    const {
        action, label, description, parent, position, options, value, fieldMargin, padding, setWidthDelay, maxHeight, maxWidth, valueType, buttonStyle
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='dropdown'>
                    <button class='btn dropdown-toggle' ${buttonStyle ? `style='${buttonStyle}'` : ''} type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                        ${value || `<span style='opacity: 0;'>Choose</span>`}
                    </button>
                    <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                        <div class='scroll-container'>
                            ${buildDropdown(options)}
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                padding: ${padding || '0px'};
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .dropdown-toggle {
                min-height: 33.5px;
                min-width: 160px;
                font-size: 13px;
                border-radius: 0.125rem 0px;
                border: 1px solid #ced4da;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #id .dropdown-item {
                font-size: 13px;
                cursor: pointer;
            }

            #id .dropdown-menu {
                margin: .125rem;
                padding: .125rem;
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
                ${maxWidth ? `min-width: ${maxWidth};` : ''}
            }

            #id .dropdown-item {
                border-radius: 8px;
            }

            #id .dropdown-item:hover {
                background: ${App.get('primaryColor') + '20'};
            }

            #id .scroll-container {
                overflow: overlay;
                ${maxHeight ? `max-height: ${maxHeight};` : ''}
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
            }

            #id .scroll-container::-webkit-scrollbar-thumb {
                min-height: 20px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener(event) {
                    if (valueType === 'html') {
                        // component.find('.dropdown-toggle').innerHTML = this.querySelector('[data-target="true"').innerHTML;
                        component.find('.dropdown-toggle').innerHTML = this.innerHTML;
                    } else {
                        component.find('.dropdown-toggle').innerText = event.target.innerText;
                    }

                    if (action) {
                        action(event);
                    }
                }
            }
            // TODO: Add scroll through this with up and down arrow keys
        ],
        onAdd() {
            // // FIXME: Why does adding a timeout work?
            // setTimeout(() => {
            //     // FIXME: assumes maxWidth is px
            //     component.find('.dropdown-toggle').style.width = `${component.find('.dropdown-menu').offsetWidth || (parseInt(maxWidth?.replace('px')) || 160)}px`;
            //     component.find('.dropdown-menu').classList.remove('hidden');
            // }, setWidthDelay || 100);
        }
    });

    function buildDropdown(items) {
        return items
            .map(dropdown => dropdownTemplate(dropdown))
            .join('\n');
    }

    function dropdownTemplate(dropdown) {
        const {
            label, path
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
    };

    component.value = (param) => {
        const field = component.find('.dropdown-toggle');

        if (param !== undefined) {
            if (valueType === 'html') {
                field.innerHTML = param;
            } else {
                field.innerText = param;
            }
        } else {
            if (valueType === 'html') {
                return component.find('.dropdown-toggle');
            } else {
                return field.innerText;
            }
        }
    };

    component.selected = () => {
        const field = component.find('.dropdown-toggle');

        return options.find(item => item.label === field.innerText)?.path
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function BootstrapTextarea(param) {
    const {
        label, parent, position, classes, value,
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='form-group'>
                    <label>${label}</label>
                    <textarea class='form-control' rows='3' ${value ? `value=${value}` : ''}></textarea>
                </div>
            </div>
        `,
        style: /*css*/ `
           #id label {
               font-weight: 500;
           }
        `,
        parent,
        position,
        events: [],
        onAdd() {
        }
    });

    component.value = (param) => {
        const field = component.find('.form-control');

        if (param !== undefined) {
            field.value = param;
        } else {
            return field.value;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function BuildInfo(param) {
    const {
        parent,
    } = param;

    const accountInfoCard = Card({
        title: 'Build',
        width: '100%',
        margin: '20px 0px 0px 0px',
        parent
    });

    accountInfoCard.add();
    // Show loading
    const loadingIndicator = LoadingSpinner({
        message: 'Loading robi build',
        type: 'robi',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    // Settings
    const appSettings = await Get({
        list: 'Settings',
        filter: `Key eq 'Build' or Key eq 'Version'`
    });

    // Remove loading
    loadingIndicator.remove();

    // Version
    const nameField = SingleLineTextField({
        label: 'Version',
        value: appSettings.find(item => item.Key === 'Version')?.Value,
        readOnly: true,
        fieldMargin: '10px 0px 0px 0px',
        parent: accountInfoCard
    });

    nameField.add();

    // Build
    const accountField = SingleLineTextField({
        label: 'Build',
        value: appSettings.find(item => item.Key === 'Build')?.Value,
        readOnly: true,
        fieldMargin: '0px 0px 0px 0px',
        parent: accountInfoCard
    });

    accountField.add();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Button(param) {
    const {
        type, value, display, margin, parent, action, disabled, width
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
                padding: 5px 25px;
                font-size: .9em;
                font-weight: 500;
                text-align: center;
                white-space: nowrap;
                border-radius: 10px;
                width: ${width || 'fit-content'};
            }

            #id.disabled {
                pointer-events: none;
                filter: opacity(0.75);
            }

            #id.normal-button {
                color: ${App.get('primaryColor')};
                background: #e9ecef;
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

        return component;
    };

    component.disable = () => {
        component.get().classList.add('disabled');

        return component;
    };

    component.enable = () => {
        component.get().classList.remove('disabled');

        return component;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Card(param) {
    const {
        title, fontSize, description, titleColor, titleWeight, titleBorder, titleBackground, background, padding, margin, minWidth, minHeight, parent, width, position, radius, action
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
                min-height: ${minHeight || 'initial'};
                width: ${width || 'initial'};
                border-radius: ${radius || '10px'};
                /* border: ${App.get('defaultBorder')}; */
                border: none;
                cursor: ${action ? 'pointer' : 'initial'};
            }

            #id .round-card-title {
                font-size: 20px;
                margin: ${padding === '0px' ? `0px` : '-20px -20px 0px -20px'}; /** FIXME: will break with passed in padding  */
                padding: 10px 20px; /** FIXME: will break with passed in padding  */
                font-weight: ${titleWeight || '700'};
                background: ${titleBackground || 'inherit'}; /** FIXME: Experimental */ /* alternate color: #d0d0d04d */
                border-radius: 10px 10px 0px 0px;
                color: ${titleColor || App.get('defaultColor')};
                border-bottom: ${titleBorder || App.get('defaultBorder')};
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
 */
export function ChangeTheme(param) {
    const { parent } = param;

    const card = Card({
        title: 'Theme',
        width: '100%',
        margin: '20px 0px 0px 0px',
        parent
    });

    card.add();

    // Theme
    const themeField = ThemeField({
        selected: App.get('theme'),
        margin: '10px 0px 30px 0px',
        label: false,
        parent: card
    });

    themeField.add();

    // Button
    const updateThemeBtn = BootstrapButton({
        type: 'robi-reverse',
        value: 'Change theme',
        parent: card,
        async action() {
            const { primary } = Themes.find(theme => theme.name === themeField.value());

            const modal = Modal({
                title: false,
                disableBackdropClose: true,
                scrollable: true,
                shadow: true,
                async addContent(modalBody) {
                    modal.find('.modal-content').style.width = 'unset';

                    const loading = LoadingSpinner({
                        message: `<span style='color: ${primary};'>Changing theme<span>`,
                        color: primary,
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
            
            // Update theme
            content = content.replace(/\/\* @START-theme \*\/([\s\S]*?)\/\* @END-theme \*\//, `/* @START-theme */'${themeField.value()}'/* @END-theme */`);

            let setFile;

            if (App.get('mode') === 'prod') {
                // TODO: Make a copy of app.js first
                // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
                    method: 'POST',
                    body: content, 
                    headers: {
                        'binaryStringRequestBody': 'true',
                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                        'X-RequestDigest': digest
                    }
                });
            } else {
                setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                    method: 'POST',
                    body: content
                });
                await Wait(1000);
            }

            console.log('Saved:', setFile);

            if (App.get('mode') === 'prod') {
                // Wait additional 2s
                console.log('Waiting...');
                await Wait(3000);
                location.reload();
            } else { 
                location.reload();
            }

            modal.close();
        }
    });

    updateThemeBtn.add();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Comments(param) {
    const {
        comments, parent, position, width, parentId
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
                    const SubmittedBy = Store.user().Title;
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
        `;
    }

    function commentTemplate(comment, isNew) {
        return /*html*/ `
            <div class='comment-container${comment.LoginName === Store.user().LoginName ? ' mine' : ''}${isNew ? ' animate-new-comment' : ''}' data-itemid='${comment.Id}'>
                <div class='comment'>
                    <div class='comment-date-container'>
                        ${comment.LoginName !== Store.user().LoginName ? /*html*/ `<div class='comment-author'>${comment.SubmittedBy}</div>` : ''}
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

        text.innerText = newCount > 1 ? 'Comments' : 'Comment';
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function CommentsContainer(param) {
    const {
        parentId, parent, position, width
    } = param;

    /** Comments */
    const comments = await Get({
        list: 'Comments',
        filter: `FK_ParentId eq ${parentId}`,
        sort: 'Id desc'
    });

    const commentsComponent = Comments({
        comments,
        width,
        parent,
        position,
        parentId
    });

    commentsComponent.add();

    /** Start polling */
    let start = new Date();
    let end = new Date();

    // setInterval(startPoll, 2000);
    async function startPoll() {
        console.log('Start:\t', start.toLocaleTimeString());
        console.log('End:\t', end.toLocaleTimeString());

        const newComments = await Get({
            list: 'Comments',
            filter: `Account ne '${App.user.Account}' and FK_ParentId eq ${parentId} and Created ge datetime'${start.toISOString()}' and Created lt datetime'${end.toISOString()}'`
        });

        console.log(newComments);

        newComments.forEach(comment => {
            commentsComponent.addComment(comment);
        });

        start = end;
        end = new Date();
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Container(param) {
    const {
        name, html, align, background, border, borderBottom, borderLeft, borderRight, borderTop, display, flex, flexwrap, shadow, direction, height, justify, margin, padding, parent, position, radius, width, maxWidth, minWidth, overflow, overflowX, overflowY, userSelect, layoutPosition, top, bottom, left, right, zIndex
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='container' data-name='${name || ''}'>${html || ''}</div>
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
                border: ${border || 'initial'};
                border-top: ${borderTop || 'none'};
                border-right: ${borderRight || 'none'};
                border-bottom: ${borderBottom || 'none'};
                border-left: ${borderLeft || 'none'};
                box-shadow: ${shadow || 'none'};
                flex: ${flex || 'unset'};
                display: ${display || 'flex'};
                /** @todo is this the best method? */
                ${overflow ?
                `overflow: ${overflow}` :
                ''}
                ${overflowX ?
                `overflow-x: ${overflowX}` :
                ''}
                ${overflowY ?
                `overflow-y: ${overflowY}` :
                ''}
                ${zIndex ?
                `z-index: ${zIndex};` :
                ''}
                ${layoutPosition ?
                `position: ${layoutPosition};` :
                ''}
                ${top ?
                `top: ${top};` :
                ''}
                ${bottom ?
                `bottom: ${bottom};` :
                ''}
                ${left ?
                `left: ${left};` :
                ''}
                ${right ?
                `right: ${right};` :
                ''}
            }
        `,
        parent,
        position,
        events: []
    });

    component.paddingOff = () => {
        component.get().style.padding = '0px';
    };

    component.paddingOn = () => {
        component.get().style.padding = '40px'; // 15px 30px;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DashboardBanner(param) {
    const {
        margin, padding, border, parent, data, background, position, width, weight
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
                /* overflow: overlay; */ /* FIXME: overflow causes flashing on fast viewport width changes */
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
                white-space: nowrap;
                font-size: 22px;
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
                label, value, description, action, color, background
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
            };
        }
    };

    component.select = (label) => {
        component.find(`.dashboard-banner-group[data-label='${label}']`)?.classList.add('selected');
    };

    component.deselect = (label) => {
        component.find(`.dashboard-banner-group[data-label='${label}']`)?.classList.remove('selected');
    };

    component.deselectAll = () => {
        component.findAll(`.dashboard-banner-group`).forEach(group => group?.classList.remove('selected'));
    };

    component.update = (groups) => {
        groups.forEach(item => {
            const {
                label, value, description,
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
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DataTable(param) {
    const {
        buttonColor, headers, headerFilter, columns, buttons, cursor, checkboxes, striped, border, paging, search, info, ordering, order, rowId, addCSS, data, onRowClick, onSearch, onDraw, toolbar, fontSize, nowrap, onSelect, // How do you turn select on?  i see the event but no option to enable it;
        onDeselect, rowCallback, createdRow, width, parent, position
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
            ${paging === false && search === false && ordering === false ?
                /*css*/ `
                    #id_wrapper .datatable-toolbar {
                        margin: 0px !important;
                    }
                ` :
                ''}

            #id_wrapper .datatable-toolbar {
                font-size: .9em;
                padding: 0px 15px;
                margin: 0px 0px 10px 0px;
                width: 100%;
                min-height: 33.33px;
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;
                overflow: auto;
            }

            #id_wrapper .datatable-toolbar .cell {
                display: flex;
                align-items: center;
            }

            #id_wrapper .datatable-toolbar .dataTables_length label,
            #id_wrapper .datatable-toolbar .dataTables_filter label {
                margin: 0px;
            }

            /* Striped */
            #id_wrapper .table-striped tbody tr:nth-of-type(odd) {
                background-color: ${App.get('backgroundColor')};
            }

            #id_wrapper .table-striped tbody tr:nth-of-type(even) td {
                background-color: inherit;
            }

            #id_wrapper .table-striped tbody tr:nth-of-type(odd) td:first-child {
                border-radius: 10px 0px 0px 10px;
            }

            #id_wrapper .table-striped tbody tr:nth-of-type(odd) td:last-child {
                border-radius: 0px 10px 10px 0px;
            }

            #id_wrapper .table-striped tbody tr:first-child td:first-child {
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
            }

            #id_wrapper .table-striped tbody tr:first-child td:last-child {
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
            }

            /** Buttons */
            #id_wrapper .btn-group {
                margin: 0px 10px 0px 0px;
            }

            #id_wrapper .btn {
                font-size: .9em;
                padding: 5px 20px;
            }

            #id_wrapper .datatable-toolbar .btn-secondary {
                border-color: transparent;
                margin-right: 10px;
                border-radius: 8px;
            }

            #id_wrapper .datatable-toolbar .btn-secondary:focus {
                box-shadow: none;
            }

            #id_wrapper .datatable-toolbar .btn-secondary span {
                color: white;
            }

            /** Add Item Button */
            #id_wrapper .datatable-toolbar .add-item {
                background: #e9ecef;
            }

            #id_wrapper .datatable-toolbar .add-item span {
                font-weight: 500;
                white-space: nowrap;
                display: flex;
                justify-content: center;
                align-items: center;
                color: ${App.get('primaryColor')};
            }

            #id_wrapper .datatable-toolbar .add-item .icon {
                font-size: 16pt;
                margin-right: 5px;
                margin-left: -5px;
                fill: ${App.get('primaryColor')};;
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
                fill: ${App.get('primaryColor')};
            }

            /** HTML5 Buttons */
            #id_wrapper .dt-buttons {
                flex-wrap: nowrap !important;
            }

            #id_wrapper .buttons-html5.ml-50 {
                margin-left: 50px;
            }

            #id_wrapper .buttons-html5 {
                background: ${buttonColor || '#e9ecef'} !important;
                color: #444;
                font-weight: 500;
            }

            #id_wrapper .buttons-html5 span{
                color: ${App.get('defaultColor')} !important;
            }

            /** Select and Search */
            #id_wrapper .custom-select {
                background: ${buttonColor || '#e9ecef'} !important;
                border-color: transparent;
                font-weight: 500;
            }

            #id_wrapper input[type='search'] {
                background: ${buttonColor || '#e9ecef'} !important;
                border-color: transparent;
                border-radius: 8px;
            }

            #id_wrapper input[type='search']:active,
            #id_wrapper input[type='search']:focus,
            #id_wrapper select:focus,
            #id_wrapper select:focus {
                outline: none;
            }

            #id_wrapper input[type='search']:active,
            #id_wrapper input[type='search']:focus {
                box-shadow: none !important;
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
                background: transparent;
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
                font-size: ${fontSize || '13px'};
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

            #id_wrapper .table-striped:not(.table-border) thead th {
                vertical-align: bottom;
                border-bottom-width: 0px;
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

            /* #id_wrapper .sorting::before,
            #id_wrapper .sorting_asc::before,
            #id_wrapper .sorting_desc::before {
                right: .5em;
            } */

            #id_wrapper .sorting::after,
            #id_wrapper .sorting_asc::after,
            #id_wrapper .sorting_desc::after {
                right: .2em;
            }

            #id_wrapper .sorting::before {
                content: '▲';
            }

            #id_wrapper .sorting::after {
                content: '▼';
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
                color: ${App.get('primaryColor')};
                font-weight: bolder;
                font-size: 10pt;
            }

            /* Selected Row */
            #id_wrapper tbody > tr.selected {
                background-color: inherit !important;
            }

            #id_wrapper tbody > tr.selected td {
                background-color: ${App.get('primaryColor') + '10'} !important;
                color:  ${App.get('primaryColor')};
            }

            #id_wrapper tbody tr.selected a, 
            #id_wrapper tbody th.selected a,
            #id_wrapper tbody td.selected a {
                color: ${App.get('primaryColor')};
            }

            #id_wrapper tbody > tr.selected td:first-child {
                border-radius: 10px 0px 0px 10px;
            }

            #id_wrapper tbody > tr.selected td:last-child {
                border-radius: 0px 10px 10px 0px;
            }

            #id .btlr-10 {
                border-top-left-radius: 10px;
            }
            
            #id .btrr-10 {
                border-top-right-radius: 10px;
            }

            #id .bbrr-10 {
                border-bottom-right-radius: 10px;
            }

            #id .bblr-10 {
                border-bottom-left-radius: 10px;
            }

            #id .btlr-0 {
                border-top-left-radius: 0px !important;
            }
            
            #id .btrr-0 {
                border-top-right-radius: 0px !important;
            }

            #id .bbrr-0 {
                border-bottom-right-radius: 0px !important;
            }

            #id .bblr-0 {
                border-bottom-left-radius: 0px !important;
            }

            /* Overflow MLOT field */
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

            /* Toolbar row limit selector */
            #id_wrapper .dataTables_length label {
                display: flex;
                align-items: center;
            }

            #id_wrapper .dataTables_length label select {
                border-radius: 8px;
                margin: 0px 10px;
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
        `;
        return html;
    }

    function setData(param) {
        const {
            columns, data, onRowClick,
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
                this.api().columns().every(function (index) {
                    var that = this;

                    var data = this.data();

                    if (index === 6) {
                        return;
                    }

                    // Append input
                    // $(`${tableId} tfoot tr`).append('<th><input type="text" style="width:100%;" placeholder="Search column"></th>');
                    $(footer).append('<th><input type="text" style="width:100%;" placeholder="Search column"></th>');

                    $('input', this.footer()).on('keyup change clear', function () {
                        if (that.search() !== this.value) {
                            that
                                .search(this.value)
                                .draw();
                        }
                    });
                });
            };
        }

        // console.log('Table options:', options);
        // FIXME: Experimental
        options.preDrawCallback = function (settings) {
            var pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
            pagination.toggle(this.api().page.info().pages > 1);
        };

        /** Create table. */
        const table = $(tableId).DataTable(options)
            .on('click', 'tr', function (rowData) {
                /** DO NOT Change this to an arrow function! this reference required */
                if (rowData.target.classList.contains('select-checkbox')) {
                    return;
                }

                if (rowData.target.tagName.toLowerCase() === 'a') {
                    console.log(`Clicked link. Didn't fire onRowClick().`);

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
            table.on('search.dt', function (e, settings) {
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
            table.on('draw', function (e, settings) {
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
            table.on('select', function (e, dt, type, indexes) {
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
            table.on('deselect', function (e, dt, type, indexes) {
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
            $(`${tableId} tfoot th`).each(function () {
                var title = $(this).text();
                $(this).html('<input type="text" placeholder="Search ' + title + '" />');
            });
        }
    }

    component.DataTable = () => {
        return $(`#${component.get()?.id}`)?.DataTable();
    };

    component.search = (term, column) => {
        $(`#${component.get().id}`).DataTable().columns(column).search(term).draw();
    };

    component.findRowById = (id) => {
        return $(`#${component.get().id}`).DataTable().row(`#${id}`);
    };

    component.updateRow = (param) => {
        const {
            row, data
        } = param;

        $(`#${component.get().id}`).DataTable().row(row).data(data).draw();
    };

    component.selected = () => {
        return $(`#${component.get().id}`).DataTable().rows({ selected: true }).data().toArray();
    };

    component.addRow = (param) => {
        const {
            data
        } = param;

        $(`#${component.get().id}`).DataTable().row.add(data).draw();
    };

    component.removeRow = (itemId) => {
        $(`#${component.get().id}`).DataTable().row(`#${itemId}`).remove().draw();
    };

    component.getButton = (className) => {
        return component.get().closest('.dataTables_wrapper').querySelector(`button.${className}`);
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DateField(param) {
    const {
        label, description, parent, position, margin, value
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <input class='form-field-date form-control' type='date' ${value ? `value=${new Date(value).toISOString().split('T')[0]}` : ''}>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            /* Labels */
            #id label {
                font-weight: 500;
            }

            #id .form-field-date {
                width: auto;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            /* #id .form-field-date {
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
            } */
        `,
        parent: parent,
        position,
        events: []
    });

    component.value = (param) => {
        const field = component.find('.form-field-date');

        if (param) {
            field.value = new Date(param).toISOString().split('T')[0];
        } else {
            return field.value;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DevConsole(param) {
    const { parent, position } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='dev-console'>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Modify ${App.get('title')}</div>
                            <div class='dev-console-description'>Change list schemas in <code>App/src/lists.js</code> and app initialization settings in <code>App/src/app.js</code> right in the browser. Update app below to commit changes.</div>
                        </div>
                        <div class='d-flex flex-column justify-content-center'>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-robi mb-3 dev-console-button modify-lists'>Modify lists</button>
                            </div>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-robi dev-console-button modify-app'>Edit app initialization properties</button>
                            </div>
                        </div>
                    </div>
                    <div class='dev-console-row update-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Update ${App.get('title')}</div>
                            <div class='dev-console-description'>Sync ${App.get('title')} with list schemas defined in <code>App/src/lists.js</code>. You can choose which new lists and columns will be created and which existing lists and columns will be deleted.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi dev-console-button update'>Update ${App.get('title')}</button>
                        </div>
                    </div>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Reset lists</div>
                            <div class='dev-console-description'>Delete and recreate selected lists. All items from selected lists will be deleted. This can't be undone.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi dev-console-button reset'>Choose lists to reset</button>
                        </div>
                    </div>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Reinstall ${App.get('title')}</div>
                            <div class='dev-console-description'>Delete and recreate all lists. Resets all settings. All items will be deleted. This can't be undone.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi dev-console-button reinstall'>Remove data and reinstall ${App.get('title')}</button>
                        </div>
                    </div>
                    <div class='dev-console-row alert-robi-primary'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Delete ${App.get('title')}</div>
                            <div class='dev-console-description'>Delete all lists and remove all settings. All items will be deleted. This can't be undone. You will need to install the app again later.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi-reverse dev-console-button delete'>Delete all lists and data</button>
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
                border-radius: 20px;
                display: flex;
                flex-direction: column;
            }

            #id .dev-console-row {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 20px 30px;
                border-radius: 20px;
                background: ${App.get('backgroundColor')};
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
                padding: 10px;
                height: fit-content;
                border-radius: 10px;
                width: 300px;
                position: relative;
            }

            #id .btn-danger {
                background: firebrick;
            }

            #id .btn-code {
                background: #292D3E;
                border-color: #292D3E;
                color: white;
            }

            #id .btn-secondary {
                background: white;
                color: firebrick;
                border-color: firebrick;
            }

            #id .dev-console-button:focus,
            #id .dev-console-button:active {
                box-shadow: none;
            }

            /* Changed dot */
            #id .changed {
                border-radius: 20px;
                position: absolute;
                width: 100%;
                left: 0px;
                top: 45px;
            }
            }

            #id .changed-text {
                font-size: 12px;
                transition: opacity 400ms;
                opacity: 0;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .modify-lists',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    ModifyFile({
                        path: 'App/src',
                        file: 'lists.js'
                    });
                }
            },
            {
                selector: '#id .modify-app',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    ModifyFile({
                        path: 'App/src',
                        file: 'app.js'
                    });
                }
            },
            {
                selector: '#id .update',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    UpdateApp();
                }
            },
            {
                selector: '#id .reset',
                event: 'click',
                listener(event) {
                    console.log('Button:', event.target.innerText);

                    ResetApp();
                }
            },
            {
                selector: '#id .reinstall',
                event: 'click',
                listener(event) {
                    console.log('Button:', event.target.innerText);

                    ReinstallApp();
                }
            },
            {
                selector: '#id .delete',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    DeleteApp();
                }
            }
        ],
        async onAdd() {
            component.find('.update-row .dev-console-button').insertAdjacentHTML('beforeend', /*html*/ `
                <div class='changed'>
                    <div class="spinner-grow text-robi" style='width: 16px; height: 16px;'>
                        <span class="sr-only">Checking on list changes...</span>
                    </div>
                </div>
            `);

            if (App.get('mode') === 'prod') {
                const {
                    diffToDelete,
                    toCreate,
                    toDelete,
                    schemaAdd,
                    schemaDelete
                } = await CheckLists();
    
                if (
                    diffToDelete.length ||
                    toCreate.length ||
                    toDelete.length ||
                    schemaAdd.length ||
                    schemaDelete.length
                ) {
                    addAlert('robi-primary', 'Changes pending');
                } else {
                    addAlert('success', 'Up to date');
                }
            } else {
                addAlert('robi-primary', 'Dev Mode');
            }
        }
    });

    function addAlert(type, message) {
        if (component.find('.changed')) {
            component.find('.changed').innerHTML = /*html*/ `
                <div class='changed-text alert alert-${type}' style='padding: 5px 10px; border-radius: 10px;'>${message}</div>
            `;

            setTimeout(() => {
                component.find('.changed-text').style.opacity = '1';
            }, 0);
        }
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function Developer(param) {
    const { parent } = param;

    /** Authorize */
    const isAuthorized = Authorize('Developer');

    if (!isAuthorized) {
        return;
    }

    /** View Title */
    const viewTitle = Title({
        title: 'Developer',
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const devConsole = DevConsole({
        parent
    });

    devConsole.add();

    const logLoadingIndicator = FoldingCube({
        label: 'Loading logs',
        margin: '40px 0px',
        parent
    });

    logLoadingIndicator.add();

    const log = await Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        top: '25',
        // skip: '0',
        // paged: true
    });

    // console.log(log);
    const logCard = Card({
        background: App.get('backgroundColor'),
        width: '100%',
        radius: '20px',
        padding: '20px 30px',
        margin: '0px 0px 40px 0px',
        parent
    });

    logCard.add();

    const logTable = await Table({
        heading: 'Logs',
        headingMargin: '0px 0px 20px 0px',
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id'
            },
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Title',
                displayName: 'Type'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ],
        buttons: [],
        buttonColor: '#dee2e6',
        showId: true,
        addButton: false,
        checkboxes: false,
        formTitleField: 'Id',
        order: [[0, 'desc']],
        items: log,
        editForm: LogForm,
        editFormTitle: 'Log',
        parent: logCard
    });

    logLoadingIndicator.remove();

    const errorsLoadingIndicator = FoldingCube({
        label: 'Loading errors',
        margin: '40px 0px',
        parent
    });

    errorsLoadingIndicator.add();

    const errors = await Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,SessionId,Status,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        top: '25'
    });

    const errorsCard = Card({
        background: App.get('backgroundColor'),
        width: '100%',
        radius: '20px',
        padding: '20px 30px',
        parent
    });

    errorsCard.add();

    const errorsTable = await Table({
        heading: 'Errors',
        headingMargin: '0px 0px 20px 0px',
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id'
            },
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ],
        buttonColor: '#dee2e6',
        showId: true,
        addButton: false,
        checkboxes: false,
        formFooter: false,
        formTitleField: 'Id',
        order: [[0, 'desc']],
        items: errors,
        editForm: ErrorForm,
        editFormTitle: 'Error',
        parent: errorsCard
    });

    errorsLoadingIndicator.remove();

    /** Toggle update */
    let run = false;

    /** Update clock and buttons */
    const timer = Timer({
        parent,
        classes: ['mt-4'],
        start() {
            run = true;
            console.log(`Run: ${run}`);

            create(25);
            // update();
        },
        stop() {
            run = false;
            console.log(`Run: ${run}`);
        },
        reset() {
            console.log('reset');
        }
    });

    timer.add();

    const items = []; // Get({ list: 'ListName' })

    async function create(limit) {
        const DashboardLinks = JSON.stringify([
            {
                url: "https://google.com",
                display: "Dashboard 1"
            },
            {
                url: "https://wikipedia.com",
                display: "Dashboard 2"
            }
        ]);
        const frequencies = [
            'Hoc',
            'Annually',
            'Daily',
            'Monthly',
            'Quarterly',
            'Annually',
            'Unknown',
            'Weekly'
        ];
        const options = [
            // AO is me, Under Development by me
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "Under Development",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is me, Under Development by another user
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "Under Development",
                AuthorId: 2,
                Author: {
                    Title: 'Jane Doe'
                },
                EditorId: 2,
                Editor: {
                    Title: 'Jane Doe'
                },
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is another user, Under Development by me
            {
                AOEmail: "jane.m.doe.civ@mail.mil",
                AOName: "Jane Doe",
                MeasureName: "Test",
                Status: "Under Development",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is another user, Under Development by another user
            {
                AOEmail: "jane.m.doe.civ@mail.mil",
                AOName: "Jane Doe",
                MeasureName: "Test",
                Status: "Under Development",
                AuthorId: 2,
                Author: {
                    Title: 'Jane Doe'
                },
                EditorId: 2,
                Editor: {
                    Title: 'Jane Doe'
                },
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // On Hold by me, and Published by me
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "On Hold",
                OnHoldComments: "Test",
                OnHoldEnd: "2021-12-15T22:00:00Z",
                OnHoldName: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                OnHoldStart: "2021-12-14T22:00:00Z",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // On Hold by me, and Published by another user
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "On Hold",
                OnHoldComments: "Test",
                OnHoldEnd: "2021-12-15T22:00:00Z",
                OnHoldName: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                OnHoldStart: "2021-12-14T22:00:00Z",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"Jane Doe\",\"Email\":\"jane.m.doe.civ@mail.mil\",\"LoginName\":\"0000000001@mil\",\"Role\":\"User\",\"SiteId\":2,\"Settings\":\"{}\",\"AuthorId\":2,\"Author\":{\"Title\":\"Jane Doe\"},\"Editor\":{\"Title\":\"Jane Doe\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":2}",
                AuthorId: 2,
                Author: {
                    Title: 'Jane Doe'
                },
                EditorId: 2,
                Editor: {
                    Title: 'Jane Doe'
                },
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // On Hold by another user, but Published by me
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "On Hold",
                OnHoldComments: "Test",
                OnHoldEnd: "2021-12-15T22:00:00Z",
                OnHoldName: "{\"Title\":\"Jane Doe\",\"Email\":\"jane.m.doe.civ@mail.mil\",\"LoginName\":\"0000000001@mil\",\"Role\":\"User\",\"SiteId\":2,\"Settings\":\"{}\",\"AuthorId\":2,\"Author\":{\"Title\":\"Jane Doe\"},\"Editor\":{\"Title\":\"Jane Doe\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":2}",
                OnHoldStart: "2021-12-14T22:00:00Z",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is me, and Published by me
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "Published",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is another user, but Published by me
            {
                AOEmail: "jane.m.doe.civ@mail.mil",
                AOName: "Jane Doe",
                MeasureName: "Test",
                Status: "Published",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is me, but Published by another user
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "Published",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"Jane Doe\",\"Email\":\"jane.m.doe.civ@mail.mil\",\"LoginName\":\"0000000001@mil\",\"Role\":\"User\",\"SiteId\":2,\"Settings\":\"{}\",\"AuthorId\":2,\"Author\":{\"Title\":\"Jane Doe\"},\"Editor\":{\"Title\":\"Jane Doe\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":2}",
                AuthorId: 2,
                Author: {
                    Title: 'Jane Doe'
                },
                EditorId: 2,
                Editor: {
                    Title: 'Jane Doe'
                },
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is another user, and Published by another user
            {
                AOEmail: "jane.m.doe.civ@mail.mil",
                AOName: "Jane Doe",
                MeasureName: "Test",
                Status: "Published",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"Jane Doe\",\"Email\":\"jane.m.doe.civ@mail.mil\",\"LoginName\":\"0000000001@mil\",\"Role\":\"User\",\"SiteId\":2,\"Settings\":\"{}\",\"AuthorId\":2,\"Author\":{\"Title\":\"Jane Doe\"},\"Editor\":{\"Title\":\"Jane Doe\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":2}",
                AuthorId: 2,
                Author: {
                    Title: 'Jane Doe'
                },
                EditorId: 2,
                Editor: {
                    Title: 'Jane Doe'
                },
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            }
        ];

        /** Set items */
        for (let i = 0; i < limit; i++) {

            if (run) {
                const choice = Math.floor(Math.random() * options.length);
                const data = options[choice];

                // Create Item
                const newItem = await CreateItem({
                    list: 'Measures',
                    data,
                    wait: false
                });

                // Set MeasureId
                await UpdateItem({
                    list: 'Measures',
                    itemId: newItem.Id,
                    data: {
                        MeasureId: newItem.Id
                    },
                    wait: false
                });

                console.log(`Id: ${newItem.Id}.`, `Option: ${choice}`);

                if (i === limit - 1) {
                    timer.stop();
                }
            } else {
                console.log('stoped');

                break;
            }
        }
    }

    async function update() {
        /** Set items */
        for (let i = 0; i < items.length; i++) {
            if (run) {

                // update item
                if (i === items.length - 1) {
                    timer.stop();
                }
            } else {
                console.log('stoped');

                break;
            }
        }
    }

    // /** Test Attach Files Button */
    // const attachFilesButton = UploadButton({
    //     async action(files) {
    //         console.log(files);
    //         const uploadedFiles = await AttachFiles({
    //             list: 'View_Home',
    //             id: 1,
    //             files
    //         });
    //         console.log(uploadedFiles);
    //     },
    //     parent,
    //     type: 'btn-outline-success',
    //     value: 'Attach file',
    //     margin: '20px 0px 20px 0px'
    // });
    // attachFilesButton.add();
    // /** Test Send Email */
    // const sendEmailButton = BootstrapButton({
    //     async action(event) {
    //         await SendEmail({
    //             From: 'stephen.a.matheis.ctr@mail.mil',
    //             To: 'stephen.a.matheis.ctr@mail.mil',
    //             CC: [
    //                 'stephen.a.matheis.ctr@mail.mil'
    //             ],
    //             Subject: `Test Subject`,
    //             Body: /*html*/ `
    //                 <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
    //                     <p>
    //                         Test body. <strong>Bold</strong>. <em>Emphasized</em>.
    //                     </p>
    //                     <p>
    //                         <a href='https://google.com'>Google</a>
    //                     </p>
    //                 </div>
    //             `
    //         });
    //     },
    //     parent,
    //     classes: ['mt-5'],
    //     type: 'outline-success',
    //     value: 'Send Email',
    //     margin: '0px 0px 0px 20px'
    // });
    // sendEmailButton.add();
    /** Open modal */
    if (param.pathParts.length === 3) {
        const {
            pathParts
        } = param;

        const table = pathParts[1];
        const itemId = parseInt(pathParts[2]);

        let row;

        if (table === 'Errors') {
            row = errorsTable.findRowById(itemId);
        } else if (table === 'Logs') {
            row = logTable.findRowById(itemId);
        }

        if (row) {
            row.show().draw(false).node()?.click();
        }
    }
}

/**
 *
 * @param {*} param
 */
export async function DeveloperLinks(param) {
    const {
        parent,
    } = param;

    const lists = App.lists();

    addSection({
        title: 'SharePoint',
        buttons: [
            {
                value: 'Site Settings',
                url: `${App.get('site')}/_layouts/15/settings.aspx`
            },
            {
                value: `Site Contents`,
                url: `${App.get('site')}/_layouts/15/viewlsts.aspx`
            },
            {
                value: `Add an app`,
                url: `${App.get('site')}/_layouts/15/addanapp.aspx`
            }
        ]
    });

    addSection({
        title: `App Lists`,
        buttons: lists
        .filter(item => item.template !== 101)
        .map(item => {
            const { list, options } = item;

            return {
                value: list,
                url: `${App.get('site')}/Lists/${list}`,
                files: options?.files
            };
        })
    });

    addSection({
        title: `App Libraries`,
        buttons: lists
        .filter(item => item.template === 101)
        .map(item => {
            const { list } = item;

            return {
                value: list,
                url: `${App.get('site')}/${list}`
            };
        })
    });

    addSection({
        title: `Core Lists`,
        buttons: [
            {
                value: `Errors`,
                url: `${App.get('site')}/Lists/Errors`
            },
            {
                value: `Log`,
                url: `${App.get('site')}/Lists/Log`
            },
            {
                value: `Questions`,
                url: `${App.get('site')}/Lists/Questions`
            },
            {
                value: `Settings`,
                url: `${App.get('site')}/Lists/Settings`
            },
            {
                value: `Users`,
                url: `${App.get('site')}/Lists/Users`
            },
            {
                value: `Release Notes`,
                url: `${App.get('site')}/Lists/ReleaseNotes`
            }
        ]
    });

    addSection({
        title: `Core Libraries`,
        buttons: [
            {
                value: `App`,
                url: `${App.get('site')}/App`
            },
            {
                value: `Documents`,
                url: `${App.get('site')}/Shared%20Documents`
            }
        ]
    });

    function addSection(param) {
        const {
            title, buttons
        } = param;

        /** Pages */
        const card = Card({
            title,
            width: '100%',
            margin: '20px 0px 0px 0px',
            parent
        });

        card.add();

        buttons.forEach(button => {
            const {
                value, url, files
            } = button;


            if (files) {
                const buttonContainer = Container({
                    parent: card
                });

                buttonContainer.add();

                const settingsButton = Button({
                    type: 'normal',
                    value,
                    margin: '10px 0px 0px 0px',
                    parent: buttonContainer,
                    async action(event) {
                        window.open(url);
                    }
                });
    
                settingsButton.add();

                const filesButton = Button({
                    type: 'normal',
                    value: `${value}Files`,
                    margin: '10px 0px 0px 10px',
                    parent: buttonContainer,
                    async action(event) {
                        window.open(`${url}Files`);
                    }
                });
    
                filesButton.add();
            } else {
                const settingsButton = Button({
                    type: 'normal',
                    value,
                    margin: '10px 0px 0px 0px',
                    parent: card,
                    async action(event) {
                        window.open(url);
                    }
                });
    
                settingsButton.add();
            }
        });
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Dialog(param) {
    const {
        classes, message, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='dialog-container'>
                <div class='dialog-box ${classes?.join(' ')}'>
                    ${message}
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id {
                position: fixed;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }

            #id .dialog-box {
                min-width: 300px;
                min-height: 150px;
                padding: 30px;
                background: white;
                border-radius: 20px;
            }
        `,
        parent: parent,
        position,
        events: []
    });

    component.value = (param) => {
        const field = component.find('.form-field-date');

        if (param) {
            field.value = new Date(param).toISOString().split('T')[0];
        } else {
            return field.value;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DropDownField(param) {
    const {
        label, labelAfter, description, value, direction, required, parent, position, width, editable, fieldMargin, maxWidth, focusout, onError, onEmpty, onSetValue
    } = param;

    let {
        list, dropDownOptions, disabled
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field ${disabled ? 'disabled' : ''} ${direction}'>
                <div class='form-field-label'>
                    <span>${label || ''}</span>
                    <!-- ${required ? /*html*/ `<span class='required'>Required</span>` : ''} -->
                </div>
                ${description ? /*html*/ `<div class='form-field-description'>${description}</div>` : ''}
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
    };

    component.disable = () => {
        disabled = true;

        component.get().classList.add('disabled');
    };

    component.setOptions = (param) => {
        const {
            list: newList, options: newOptions
        } = param;

        list = newList;
        dropDownOptions = newOptions;
    };

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
                : ''}
            </div>
        `;

        component.find('.form-field-drop-down').insertAdjacentHTML('beforebegin', html);
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

    component.value = (param) => {
        const field = component.find('.form-field-drop-down');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    };

    component.getValueItemId = () => {
        return component.find('.form-field-drop-down').dataset.itemid;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function DropDownMenu(param) {
    const {
        dropDownField, field, data, list, onSetValue
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
                    id, value
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
    };

    component.removeEvents = () => {
        field.removeEventListener('keydown', selectListOptionWithCursorKeys);
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function EditForm(param) {
    const { event, fields, item, list, modal, parent, table } = param;

    console.log(param);

    const components = fields
        ?.filter(field => field.name !== 'Id')
        ?.map(field => {
            const { name, display, type, choices, action } = field;

            let component = {};

            switch (type) {
                case 'slot':
                    component = SingleLineTextField({
                        label: display || name,
                        value: item[name],
                        parent
                    });
                    break;
                case 'mlot':
                    component = MultiLineTextField({
                        label: display || name,
                        value: item[name],
                        parent
                    });
                    break;
                case 'number':
                    component = NumberField({
                        label: display || name,
                        value: item[name],
                        parent
                    });
                    break;
                case 'choice':
                    component = BootstrapDropdown({
                        label: display || name,
                        value: item[name] || choices[0],
                        setWidthDelay: 200,
                        options: choices.map(choice => {
                            return {
                                label: choice
                            };
                        }),
                        parent
                    });
                    break;
                case 'multichoice':
                    console.log(name);
                    component = MultiChoiceField({
                        label: display || name,
                        choices,
                        // value: item[name] || choices[0],
                        parent
                    });
                    break;
                case 'date':
                    component = DateField({
                        label: display || name,
                        value: item[name],
                        parent
                    });
                    break;
            }

            component.add();

            return {
                component,
                field
            };
        });

    return {
        async onUpdate(event) {
            const data = {};

            components
                .forEach(item => {
                    const { component, field } = item;
                    const { name, type } = field;

                    const value = component.value();

                    switch (type) {
                        case 'slot':
                        case 'mlot':
                        case 'choice':
                            if (value) {
                                data[name] = value;
                            }
                            break;
                        case 'number':
                            if (value) {
                                data[name] = parseInt(value);
                            }
                            break;
                    }
                });

            console.log(data);

            const updatedItem = await UpdateItem({
                list,
                itemId: item.Id,
                data
            });

            return updatedItem;
        },
        async onDelete(event) {
            const deletedItem = await DeleteItem({
                list,
                itemId: item.Id
            });

            return deletedItem;
        }
    };
}

/**
 *
 * @param {*} param
 * @returns
 */
export function EditQuestion(param) {
    const {
        question, parent, modal
    } = param;

    const {
        Title, Body
    } = question;

    /** Title */
    const titleField = SingleLineTextField({
        label: 'Question',
        value: Title,
        parent,
        onKeydown(event) {
            if (event.target.innerText) {
                modal.getButton('Update').disabled = false;
            } else {
                modal.getButton('Update').disabled = true;
            }

            submit(event);
        }
    });

    titleField.add();

    /** Body */
    const bodyField = MultiLineTextField({
        label: 'Description',
        value: Body,
        parent,
        onKeydown(event) {
            submit(event);
        }
    });

    bodyField.add();

    /** Control + Enter to submit */
    function submit(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            const submit = modal.getButton('Update');

            if (!submit.disabled) {
                submit.click();
            }
        }
    }

    /** Focus on name field */
    titleField.focus();

    return {
        getFieldValues() {
            const data = {
                Title: titleField.value(),
                Body: bodyField.value(),
            };

            if (!data.Title) {
                /** @todo field.addError() */
                return false;
            }

            return data;
        }
    };
}

/**
 * EditUser
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export function ErrorForm(param) {
    const {
        row, table, item, parent
    } = param;

    const readOnlyFields = [
        {
            internalFieldName: 'Id',
            displayName: 'Id'
        },
        {
            internalFieldName: 'SessionId',
            displayName: 'Session Id'
        },
        {
            internalFieldName: 'Source',
            displayName: 'Source'
        },
        {
            internalFieldName: 'Message',
            displayName: 'Message',
            type: 'mlot'
        },
        {
            internalFieldName: 'Error',
            displayName: 'Error',
            type: 'mlot'
        },
        {
            internalFieldName: 'Created',
            displayName: 'Created',
            type: 'date'
        },
        {
            internalFieldName: 'Author',
            displayName: 'Author'
        }
    ];

    const readOnlyContainer = Container({
        direction: 'column',
        width: '100%',
        padding: '0px 20px',
        parent
    });

    readOnlyContainer.add();

    readOnlyFields.forEach(field => addReadOnlyField(field, readOnlyContainer));

    /** Add Read Only Field */
    function addReadOnlyField(field, parent) {
        const {
            internalFieldName, displayName, type
        } = field;

        let value = item[internalFieldName]?.toString();

        if (type === 'date') {
            value = new Date(item[internalFieldName]);
        }

        else if (type === 'mlot') {
            value = item[internalFieldName]?.split('<hr>').join('\n');
        }

        else if (internalFieldName === 'Author') {
            value = item.Author.Title;
        }

        const component = SingleLineTextField({
            label: displayName,
            value: value || /*html*/ `<span style='font-size: 1em; display: inline' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Status */
    const statusField = StatusField({
        async action(event) {
            statusField.value(event.target.innerText);

            const updatedItem = await UpdateItem({
                list: 'Errors',
                itemId: item.Id,
                select: 'Id,Message,Error,Source,SessionId,Status,Created,Author/Title',
                expand: 'Author/Id',
                data: {
                    Status: event.target.innerText
                }
            });

            console.log(`Error Item Id: ${item.Id} updated.`, updatedItem);

            /** Update Table Row */
            table.updateRow({
                row,
                data: updatedItem
            });

            /** Show toast */
            const toast = Toast({
                text: `Id <strong>${item.Id}</strong> set to <strong>${updatedItem.Status}</strong>!`,
                type: 'bs-toast',
                parent: Store.get('maincontainer')
            });

            toast.add();
        },
        parent,
        label: 'Status',
        margin: '0px 20px 40px 20px',
        value: item.Status || 'Not Started'
    });

    statusField.add();

    /** Logs */
    Logs({
        sessionId: item.SessionId,
        parent,
    });

    /** Comments */
    CommentsContainer({
        parentId: item.Id,
        padding: '0px 20px',
        parent,
    });

    return {
        getFieldValues() {
            const data = {};

            return data;
        }
    };
}

/**
 *
 * @param {*} param
 */
export async function Errors(param) {
    const {
        sessionId, parent
    } = param;

    /** Errors Container */
    const errorsContainer = Container({
        display: 'block',
        width: '100%',
        parent
    });

    errorsContainer.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading errors',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    /** Get Errors */
    const errors = await Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        filter: `SessionId eq '${sessionId}'`
    });

    console.log(errors);

    if (errors.length === 0) {
        const alertCard = Alert({
            text: 'No errors associated with this Session Id',
            type: 'success',
            margin: '0px 20px',
            parent: errorsContainer
        });

        alertCard.add();
    } else {
        const legendHeading = Heading({
            text: `<strong>Errors:</strong> ${errors.length}`,
            size: '1.3em',
            color: 'crimson',
            margin: '0px 20px 20px 20px',
            parent: errorsContainer
        });

        legendHeading.add();
    }

    /** Add Errors to Alert */
    errors.forEach((item, index) => {
        const alertCard = Alert({
            text: '',
            type: 'danger',
            margin: '0px 20px 20px 20px',
            parent: errorsContainer
        });

        alertCard.add();

        const goToErrorButton = BootstrapButton({
            action(event) {
                Route(`Developer/Errors/${item.Id}`);
            },
            parent: alertCard,
            margin: '20px 0px',
            type: 'btn-danger',
            value: `Go to error ${item.Id}`
        });

        goToErrorButton.add();

        const readOnlyFields = [
            {
                internalFieldName: 'Message',
                displayName: 'Message',
                type: 'mlot'
            },
            {
                internalFieldName: 'Error',
                displayName: 'Error',
                type: 'mlot'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created',
                type: 'date'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            },
            {
                internalFieldName: 'Status',
                displayName: 'Status'
            }
        ];

        readOnlyFields.forEach(field => addReadOnlyField(field));

        /** Add Read Only Field */
        function addReadOnlyField(field, parent) {
            const {
                internalFieldName, displayName, type
            } = field;

            let value = item[internalFieldName]?.toString();

            if (type === 'date') {
                value = new Date(item[internalFieldName]);
            }

            else if (type === 'mlot') {
                value = item[internalFieldName]?.split('<hr>').join('\n');
            }

            else if (internalFieldName === 'Author') {
                value = item.Author.Title;
            }

            else if (internalFieldName === 'Status') {
                switch (item.Status) {
                    case 'Not Started':
                    default:
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-danger'>Not Started</span>`;
                        break;
                    case 'In Progress':
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-info'>Not Started</span>`;
                        break;
                    case 'Completed':
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-success'>Not Started</span>`;
                        break;
                }
            }

            const component = SingleLineTextField({
                label: displayName,
                value: value || /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-dark'>No data</span>`,
                readOnly: true,
                fieldMargin: '0px',
                parent: alertCard
            });

            component.add();
        }
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Files(param) {
    const {
        allFiles, description, itemId, width, onUndo, onUpload, onChange, padding, margin, parent, position
    } = param;

    let {
        files
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                ${description ? /*html*/ `<div class="form-field-description text-muted">${description}</div>` : ''}
                <div class='files-list'>
                    <input type='file' multiple style='display: none;' id='drop-zone-files'>
                    <div class='drop-zone'>
                        <!-- Hidden files input -->
                        <div class='files-list-container'>
                            ${renderFiles()}
                        </div>
                        <div class='count-undo-container'>
                            <div class='count-container'>
                                <span class='count'>${files?.length || 0}</span>
                                <span>${files?.length === 1 ? 'file' : 'files'}</span>
                                <span class='pending-count hidden'></span>
                            </div>
                            <!-- <span class='undo-all'>Delete all</span> -->
                        </div>
                    </div>
                </div>
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
                background: ${App.get('backgroundColor')};
                transition: all 300ms ease-in-out;
            }

            /* Drag */
            #id .drag-over {
                position: relative;
                background: rgba(${App.get('primaryColorRGB')}, .15);
            }

            /* #id .drag-over::after {
                position: absolute;
                top: 0px;
                left: 0px;
                height: 100%;
                width: 100%;
                content: 'Drop files here'
            } */

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
                background: ${App.get('primaryColor')};
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
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #id .file-name-container {
                display: flex;
                flex-direction: column;
                ${itemId ? 'cursor: pointer;' : ''}
            }

            #id .file-icon {
                display: flex;
            }

            #id .remove-container {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                min-width: 105px;
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
                /* padding: 9px 12px; */
                padding: 9px 0px;
                border-radius: 15px;
                /* background: white; */
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
                fill: ${App.get('defaultColor')};
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
                fill: ${App.get('defaultColor')};
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
                fill: gray;
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
            // {
            //     selector: '.undo-all',
            //     event: 'click',
            //     listener(event) {
            //         reset();
            //     }
            // },
            /**  */
            {
                selector: '.remove-container:not(.delete-on-remove)',
                event: 'click',
                listener: removeFilePreview
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
                listener(event) {
                    window.open(files.find(file => file.name = this.dataset.filename).url, '_self');
                }
            }
        ]
    });

    /** START: Drag and drop */
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
        addFiles(event.dataTransfer.files);
    }

    /*** END: Drag and Drop */
    let newFiles = [];

    function addFiles(fileList) {
        // Use DataTransferItemList interface to access the file(s)
        [...fileList].forEach(file => {
            const alreadyDropped = allFiles.find(droppedFile => droppedFile.name === file.name);

            if (!alreadyDropped) {
                newFiles.push(file);
                addPreview(file);

                // If item already created, upload right away
                // console.log(itemId);
                if (itemId) {
                    onUpload(file); // Waiting for update
                } else {
                    onChange(newFiles);
                }
            }
        });

        if (newFiles.length) {
            component.find('.pending-count').innerText = `(${newFiles.length} pending)`;
            component.find('.pending-count').classList.remove('hidden');
        }
    }

    /** Reset */
    function reset() {
        // component.find('.upload').classList.add('hidden');
        component.find('.reset').classList.add('hidden');
        component.find('.pending-count').classList.remove('hidden');

        newFiles = [];
        component.find(`input[type='file']`).value = null;

        /** Empty preview container */
        component.find('.files-list-container').innerHTML = '';
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
                <div class='remove-container ${created ? 'delete-on-remove' : ''}' data-filename='${name}'>
                    <div class='remove-label'>
                        <div class='status'>${created ? `Added on ${new Date(created).toLocaleDateString()} By ${author.split(' ').slice(0, 2).join(' ')}` : 'Pending'}</div>
                        <div class='tip'>${created ? `${'ontouchstart' in window ? 'tap' : 'click'} to delete` : `remove`}</div>
                    </div>
                    <div class='remove-icon'>
                        <svg class='icon remove'><use href='#icon-bs-${created ? 'x-circle-fill' : 'dash-circle-fill'}'></use></svg>
                    </div>
                </div>
            </div>
        `;
    }

    function removeFilePreview(event) {
        const fileName = this.dataset.filename;
        const file = newFiles.find(file => file.name === fileName);
        const index = newFiles.indexOf(file);

        console.log(fileName, file, newFiles, index);

        newFiles.splice(index, 1);

        // if (onUndo) {
        //     onUndo(this.dataset.itemid);
        // }
        console.log(newFiles);

        if (!newFiles.length) {
            component.find('.pending-count').classList.remove('hidden');
            component.find('.pending-count').innerText = '';
        } else {
            component.find('.pending-count').innerText = `(${newFiles.length} pending)`;
        }

        this.closest('.file-preview').classList.add('removed');

        setTimeout(() => {
            this.closest('.file-preview').remove();
        }, 150);
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

    component.upload = () => {
        newFiles.forEach(file => {
            onUpload(file);
        });
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function FilesTable(param) {
    const {
        remove, files, list, label, labelWeight, labelSize, parent, position, onAdd, onDelete
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
            id, name, created, author, authorAccount, modified, editor, uri
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
                onDelete();
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
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function FixedToast(param) {
    const {
        top, type, bottom, left, right, title, message, action, onClose, parent, position
    } = param;

    const component = Component({
        locked: true,
        html: /*html*/ `
            <div class='fixed-toast slide-in ${type || 'inverse-colors'}'>
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
                cursor: ${action ? 'pointer' : 'initial'};
                position: fixed;
                z-index: 1000;
                font-size: 1em;
                max-width: 385px;
                padding: 20px;
                border-radius: 20px;
                ${top ?
                `top: ${top};` :
                ''}
                ${bottom ?
                `bottom: ${bottom};` :
                ''}
                ${left ?
                `left: ${left};` :
                ''}
                ${right ?
                `right: ${right};` :
                ''}
            }

            #id.robi {
                background: ${App.get('primaryColor')};
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
            }

            #id.robi * {
                color: white;
            }

            #id.success {
                background: #d4edda;
            }

            #id.success * {
                color: #155724;
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
                selector: '#id',
                event: 'click',
                listener(event) {
                    if (action) {
                        action(event);
                    }
                }
            },
            {
                selector: '#id .close',
                event: 'click',
                listener(event) {
                    event.stopPropagation();

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
        label, margin, parent, position
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
        style: /*css*/ `
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
        events: []
    });

    return component;
}

/**
 *
 * @param {*} param
 */
export function FormSection(param) {
    const { section, listInfo, item, parent: parentConatiner, heading } = param;
    const { name, path, info, rows } = section;
    const { list, fields } = listInfo;

    const parent = Container({
        display: 'block',
        width: '100%',
        padding: '0px 0px 30px 0px',
        parent: parentConatiner
    });

    parent.add();

    if (heading) {
        const headingContainer = Container({
            padding: '0px 10px',
            parent,
        });

        headingContainer.add();

        const sectionTitle = Alert({
            type: 'robi-secondary',
            width: '100%',
            margin: '0px 0px 20px 0px',
            text: /*html*/ `
                <h6 class='mb-0'>${heading}</h6>
            `,
            parent: headingContainer
        });

        sectionTitle.add();
    }

    if (section.info) {
        const infoAlert = Alert({
            type: 'robi-secondary',
            text: info,
            margin: '0px 10px 20px 10px',
            parent
        });

        infoAlert.add();
    }

    // TODO: Pass form name in, this is supposed to be generic
    const formData = item ? Store.getData(`edit measure ${item.Id}`) : Store.getData('new measure');

    // console.log('Form Data:', formData);

    let components = [];

    rows.forEach(row => {
        const { name: rowName, fields: rowFields, description: rowDescription, type } = row;

        // console.log(rowName, rowDescription);
        const rowContainer = type ?
            Alert({
                margin: '10px 20px',
                type,
                parent
            }) :
            Container({
                display: 'block',
                width: '100%',
                padding: '10px 20px',
                parent
            });

        rowContainer.add();

        if (rowName) {
            rowContainer.append(/*html*/ `
                <div class='mb-1'>
                    <h6 style='color: ${App.get('defaultColor')}; font-weight: 700'>${rowName}</h6>
                </div>
            `);
        }

        if (rowDescription) {
            rowContainer.append(/*html*/ `
                <div class="mb-4" style='font-size: 14px;'>${rowDescription}</div>
            `);
        }

        const fieldRow = Container({
            display: 'flex',
            align: 'stretch',
            width: '100%',
            parent: rowContainer
        });

        fieldRow.add();

        Style({
            name: `form-row-${fieldRow.get().id}`,
            style: /*css*/ `
                #${fieldRow.get().id} .form-field {
                    flex: 1;
                }

                #${fieldRow.get().id} .form-field:not(:last-child) {
                    margin-right: 20px;
                }
            `
        });

        rowFields?.forEach(field => {
            const { name, label, style, component: renderComponent, description: customDescription } = field;
            const parent = fieldRow;
            let fieldMargin = '0px';
            let component = {};

            // Render passed in component
            if (renderComponent) {
                component = renderComponent({ 
                    parent,
                    formData,
                    getComponent() {
                        return component;
                    } 
                });
            }
            
            // If field name is Files, render drop zone
            else if (name === 'Files') {
                component = AttachmentsContainer({
                    label: label || display || name,
                    description: customDescription,
                    // value: formData[name],
                    value: formData.Files,
                    list,
                    itemId: item?.Id,
                    parent,
                    fieldMargin,
                    onChange(files) {
                        console.log('files value', files);
                        formData.Files = files;
                    }
                });
            }
            
            // Render field by type
            else {
                const { display, description: defaultDescription, type, choices, fillIn, action } = fields?.find(item => item.name === name);
                const description = customDescription || defaultDescription;

                switch (type) {
                    case 'slot':
                        let placeholder = '';
                        let addon = '';

                        if (name.toLowerCase().includes('email')) {
                            // placeholder = 'first.mi.last.civ@mail.mil';
                            addon = '@';
                        } else if (name.toLowerCase().includes('name')) {
                            // placeholder = 'First Last'
                        } else if (name.toLowerCase().includes('office')) {
                            // placeholder = 'Example: J-5 AED'
                        }

                        component = SingleLineTextField({
                            label: label || display || name,
                            description,
                            value: formData[name],
                            placeholder,
                            action,
                            addon,
                            parent,
                            fieldMargin,
                            // TODO: Complete compare against published measures
                            async onKeyup(event) {
                                // Set form data
                                formData[name] = component.value();

                                // // Drop down Menu
                                // const query = event.target.value;
                                // const menu = component.find('.dropdown-menu');

                                // // console.log(query);

                                // if (query) {
                                //     if (!menu) {
                                //         // console.log('add menu');

                                //         const height = component.get().offsetHeight;
                                //         const width = component.get().offsetWidth;

                                //         component.find('.form-control').insertAdjacentHTML('afterend', /*html*/ `
                                //             <div class='dropdown-menu show' style='font-size: 13px; position: absolute; width: ${width}px; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, ${height + 5}px);'>
                                //                 <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                                //                     <div style='color: ${App.get('primaryColor')};'>Searching for measures with similar names...</div>
                                //                     <div class='spinner-grow spinner-grow-sm' style='color: ${App.get('primaryColor')};' role='status'></div>
                                //                 </div> 
                                //             </div>
                                //         `);

                                //         // Get list items
                                //         const listItems = await Get({
                                //             list: 'Measures'
                                //         });

                                //     } else {
                                //         // console.log('menu already added');
                                //     }
                                // } else {
                                //     if (menu) {
                                //         // console.log('remove menu');
                                //         menu.remove();
                                //     } else {
                                //         // console.log('menu already removed');
                                //     }
                                // }
                            }
                        });
                        break;
                    case 'mlot':
                        if (name.toLowerCase() === 'tags') {
                            component = TaggleField({
                                label: label || display || name,
                                description,
                                tags: formData[name],
                                parent,
                                fieldMargin,
                                onTagAdd(event, tag) {
                                    // console.log('tags: ', component.value());
                                    // Set form data
                                    formData[name] = component.value();
                                },
                                onTagRemove(event, tag) {
                                    // console.log('tags: ', component.value());
                                    // Set form data
                                    formData[name] = component.value();
                                }
                            });
                        } else if (name.toLowerCase() === 'dashboardlinks' || name.toLowerCase() === 'links') { // TODO: I don't like this, assumes too much
                            component = LinksField({
                                label: label || display || name,
                                links: formData[name],
                                description,
                                parent,
                                fieldMargin,
                                onChange(event) {
                                    // Set form data
                                    formData[name] = JSON.stringify(component.value());
                                }
                            });
                        } else {
                            component = MultiLineTextField({
                                label: label || display || name,
                                value: formData[name],
                                description,
                                parent,
                                fieldMargin,
                                onKeyup(event) {
                                    // Set form data
                                    formData[name] = component.value();
                                }
                            });
                        }

                        break;
                    case 'number':
                        component = NumberField({
                            label: label || display || name,
                            description,
                            fieldMargin,
                            parent
                        });
                        break;
                    case 'choice':
                        component = BootstrapDropdown({
                            label: label || display || name,
                            description,
                            value: formData[name],
                            options: choices.map(choice => {
                                return {
                                    label: choice
                                };
                            }),
                            parent,
                            fieldMargin,
                            action(event) {
                                formData[name] = component.value();
                            }
                        });
                        break;
                    case 'multichoice':
                        component = MultiChoiceField({
                            label: label || display || name,
                            choices,
                            fillIn,
                            value: formData[name]?.results,
                            parent,
                            fieldMargin,
                            onChange(event) {
                                formData[name] = {
                                    results: component.value()
                                };
                            }
                        });
                        break;
                    default:
                        console.log('missing component for field type: ', type);
                        return;
                }
            }

            // Add component to DOM
            component.add();

            // Apply passed in styles
            if (style) {
                for (const property in style) {
                    // console.log(`${property}: ${style[property]}`);
                    component.get().style[property] = style[property];
                }
            }

            // Push component to list of components
            components.push({
                component,
                field
            });
        });
    });

    return components;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Heading(param) {
    const {
        text, size, color, height, weight, margin, padding, parent, width, align
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
                justify-content: space-between;
                margin: ${margin || '50px 0px 20px 0px'};
                padding: ${padding || '0px'};
                width: ${width || 'initial'};
            }    

            #id .text {
                font-size: ${size || '1.25em'};
                font-weight: ${weight || '500'};
                color: ${color || App.get('defaultColor')};
                margin: 0px;
                text-align: ${align || 'left'};
            }

            #id .text * {
                color: ${color || App.get('defaultColor')};
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: []
    });

    component.setHeading = (newTitle) => {
        component.find('.text').innerText = newTitle;
    };

    return component;
}

/**
 * 
 * @param {*} param 
 */
export async function Help(param) {
    const { parent } = param;

    const viewTitle = Title({
        title: `Help`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '20px 0px 0px 0px',
        parent
    });

    viewContainer.add();

    const requestAssistanceInfo = RequestAssitanceInfo({
        data: [
            {
                label: 'For help with this app, please contact:',
                name: 'First Last',
                title: 'TItle, Branch',
                email: 'first.last.civ@mail.mil',
                phone: '(555) 555-5555'
            }
        ],
        parent: viewContainer
    });

    requestAssistanceInfo.add();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function InstallConsole(param) {
    const {
        text, close, margin, width, parent, position
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
                : ''}
            </div>
        `,
        style: /*css*/ `
            #id {
                font-size: 14px;
                border-radius: 20px;
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
                ''}
        `,
        parent,
        position
    });

    component.update = (param) => {
        const {
            type: newType, text: newText
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
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ItemInfo(param) {
    const {
        item, width, maxWidth, position, parent,
    } = param;

    const {
        Created, Modified, Editor, Author
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
        events: []
    });

    component.modified = item => {
        const {
            Modified, Editor,
        } = item;

        const modifiedDate = new Date(Modified);
        const node = component.find('.item-info-modified');

        node.innerHTML = /*html*/ `<b>Last modified on</b> ${modifiedDate.toLocaleDateString()} <b>at</b> ${modifiedDate.toLocaleTimeString()} <b>by</b> ${Editor.Title}`;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function LinksField(param) {
    const {
        label, description, fieldMargin, maxWidth, links, parent, position, onChange
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class="d-flex align-items-center">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Display</div>
                        </div>
                        <input type="text" class="form-control display" placeholder="My Dashboard">
                    </div>
                    <div class="input-group ml-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Address</div>
                        </div>
                        <input type="text" class="form-control url" placeholder="https://site.domain">
                    </div>
                    <button class="btn btn-robi ml-2">Add link</button>
                </div>
                <div class='links-container mt-3'>
                    <!-- Formatted links go here -->
                    ${
                        links ?
                        JSON.parse(links).map(link => {
                            const { url, display } = link;

                            return /*html*/ `
                                <div class='link' data-display='${display}' data-url='${url}'>
                                    <a href='${url}' target='_blank'>${display}</a>
                                    <button type="button" class="close remove-link" data-dismiss="modal" aria-label="Close">
                                        <span class="icon-container">
                                            <svg class="icon x-circle-fill">
                                                <use href="#icon-bs-x-circle-fill"></use>
                                            </svg>
                                            <svg class="icon circle-fill">
                                                <use href="#icon-bs-circle-fill"></use>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            `;
                        }).join('\n') : ''
                }
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .links-container {
                position: relative;
                min-height: 56px;
                width: 100%;
                border-radius: 10px;
                border: 1px solid #ced4da;
                padding: 10px;
            }
            
            #id .input-group {
                flex: 4
            }

            #id .btn {
                flex: 1;
                padding: 5.25px 12px;
            }

            #id .link {
                display: inline-flex;
                border-radius: 10px;
                padding: 5px 5px 5px 20px;
                background: #e9ecef;
                color: #007bff;
                font-weight: 500;
                font-size: 13px;
            }

            #id .link:not(:last-child) {
                margin-right: 10px;
            }
            
            #id .link *,
            #id .link *:active,
            #id .link *:focus {
                color: #007bff;
                text-decoration: none;
            }

            /* Remove */
            #id .close:focus {
                outline: none;
            }

            #id .close {
                font-weight: 500;
                text-shadow: unset;
                opacity: 1;
                margin-left: 15px;
            }

            #id .close .icon-container {
                position: relative;
                display: flex;
            }

            #id .close .circle-fill {
                position: absolute;
                fill: white ;
                top: 2px;
                left: 2px;
                transition: all 300ms ease;
            }

            #id .close .icon-container:hover > .circle-fill {
                fill: ${App.get('primaryColor')};
            }

            #id .close .x-circle-fill {
                width: .85em;
                height: .85em;
                fill: darkgray;
                z-index: 10;
            }

            #id .close .circle-fill {
                width: .7em;
                height: .7em;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .btn',
                event: 'click',
                listener(event) {
                    addLink(event);
                }
            },
            {
                selector: '#id .url',
                event: 'keyup',
                listener(event) {
                    if (event.key == 'Enter') {
                        event.preventDefault();
                        event.stopPropagation();

                        addLink(event);
                    }
                }
            },
            {
                selector: '#id .remove-link',
                event: 'click',
                listener: removeLink
            }
        ],
        onAdd() {
        }
    });

    function addLink(event) {
        const display = component.find('.display');
        const url = component.find('.url');

        if (display.value && url.value) {
            component.find('.links-container').insertAdjacentHTML('beforeend', /*html*/ `
                <div class='link' data-display='${display.value}' data-url='${url.value}'>
                    <a href='${url.value}' target='_blank'>${display.value}</a>
                    <button type="button" class="close remove-link" data-display='${display.value}' data-dismiss="modal" aria-label="Close">
                        <span class="icon-container">
                            <svg class="icon x-circle-fill">
                                <use href="#icon-bs-x-circle-fill"></use>
                            </svg>
                            <svg class="icon circle-fill">
                                <use href="#icon-bs-circle-fill"></use>
                            </svg>
                        </span>
                    </button>
                </div>
            `);

            component.find(`.remove-link[data-display='${display.value}']`).addEventListener('click', removeLink);

            display.value = '';
            url.value = '';

            display.focus();

            if (onChange) {
                onChange(event);
            }
        } else {
            // TODO: change to dialog box
            alert('Please enter both display text and a valid address.');
        }
    }

    // FIXME: doesn't work
    function removeLink(event) {
        console.log('remove link');

        this.closest('.link').remove();

        if (onChange) {
            onChange(event);
        }
    }

    component.value = () => {
        // TODO: return formatted links to store in mlot field
        const links = component.findAll('.link');

        console.log(links);

        return [...links].map(link => {
            return {
                url: link.dataset.url,
                display: link.dataset.display
            };
        });
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function LoadingBar(param) {
    const {
        displayTitle, displayLogo, displayText, loadingBar, onReady, parent, totalCount
    } = param;

    const logoPath = App.get('mode') === 'prod' ? '../Images' : `${App.get('site')}/src/Images`;

    const component = Component({
        html: /*html*/ `
            <div class='loading-bar'>
                <div class='loading-message'>
                    <!-- <div class='loading-message-logo'></div> -->
                    <!-- <img class='loading-message-logo' src='${logoPath}/${displayLogo}' /> -->
                    <div class='loading-message-title'>${displayTitle}</div>
                    <div class='loading-bar-container ${loadingBar || ''}'>
                        <div class='loading-bar-status'></div>
                    </div>
                    <div class='loading-message-text'>${displayText || ''}</div>
                </div>
            </div>
        `,
        style: /*css*/ `
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
                background: ${App.get('backgroundColor')};
                border-radius: 10px;
            }
            
            .loading-bar-status {
                width: 0%;
                height: 15px;
                background: ${App.get('primaryColor')};
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
    };

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
    };

    component.showLoadingBar = () => {
        component.find('.loading-bar-container').classList.remove('hidden');
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function LoadingSpinner(param) {
    const {
        font, type, color, message, classes, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='loading-spinner w-100 d-flex flex-column justify-content-center align-items-center ${classes?.join(' ')}'>
                <div class="mb-2 loading-message ${type ? `text-${type}` : 'text-robi'}" style='${`${color} !important` || 'darkgray'}; font-weight: 600;'>${message || 'Loading'}</div>
                <div class="spinner-grow ${type ? `text-${type}` : 'text-robi'}" style='color: ${`${color} !important` || 'darkgray'};' role="status"></div>
            </div>
        `,
        style: /*css*/ `
            #id * {
                color: inherit;
            }

            ${font ?
            /*css */ `
                    #id * {
                        font-family: ${font}
                    }
                ` : ''
            }
        `,
        parent,
        position,
        events: []
    });

    return component;
}

/**
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export function LogForm(param) {
    const {
        item, parent
    } = param;

    const readOnlyFields = [
        {
            internalFieldName: 'Id',
            displayName: 'Id'
        },
        {
            internalFieldName: 'SessionId',
            displayName: 'SessionId'
        },
        {
            internalFieldName: 'Title',
            displayName: 'Type'
        },
        {
            internalFieldName: 'FiscalYear',
            displayName: 'FiscalYear'
        },
        {
            internalFieldName: 'Module',
            displayName: 'Module',
        },
        {
            internalFieldName: 'Message',
            displayName: 'Message'
        },
        {
            internalFieldName: 'StackTrace',
            displayName: 'Stack Trace',
            type: 'mlot'
        },
        {
            internalFieldName: 'Created',
            displayName: 'Created',
            type: 'date'
        },
        {
            internalFieldName: 'Author',
            displayName: 'Author'
        }
    ];

    const readOnlyContainer = Container({
        direction: 'column',
        width: '100%',
        padding: '0px 20px',
        parent
    });

    readOnlyContainer.add();

    readOnlyFields.forEach(field => addReadOnlyField(field, readOnlyContainer));

    /** Add Read Only Field */
    function addReadOnlyField(field, parent) {
        const {
            internalFieldName, displayName, type
        } = field;

        let value = item[internalFieldName]?.toString();

        if (type === 'date') {
            value = new Date(item[internalFieldName]);
        }

        else if (type === 'mlot') {
            value = item[internalFieldName].split('<hr>').join('\n');
        }

        else if (internalFieldName === 'Message') {
            const data = JSON.parse(item.Message);

            value = /*html*/ `
                <table>
            `;

            for (const property in data) {
                value += /*html*/ `
                    <tr>
                        <th style='padding-right: 15px;'>${property}</th>
                        <td>${data[property]}</td>
                    </tr>
                `;
            }

            value += /*html*/ `
                </table>
            `;
        }

        else if (internalFieldName === 'Author') {
            value = item.Author.Title;
        }

        const component = SingleLineTextField({
            label: displayName,
            value: value || /*html*/ `<span style='font-size: 1em; display: inline;' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Errors */
    Errors({
        sessionId: item.SessionId,
        parent
    });

    return {
        getFieldValues() {
            const data = {};

            return data;
        }
    };
}

/**
 *
 * @param {*} param
 */
export async function Logs(param) {
    const {
        sessionId, parent
    } = param;

    /** Errors Container */
    const errorsContainer = Container({
        display: 'block',
        width: '100%',
        parent
    });

    errorsContainer.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading logs',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    /** Get Errors */
    const logs = await Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        filter: `SessionId eq '${sessionId}'`
    });

    console.log(logs);

    /** Summary Card */
    const alertCard = Alert({
        text: logs.length > 0 ?
            /*html*/ `
                <h5>Logs: ${logs.length}</h5>
                <hr>
            ` :
            'No logs associated with this Session Id',
        type: logs.length > 0 ? 'info' : 'warning',
        margin: '0px 20px',
        parent: errorsContainer
    });

    alertCard.add();

    /** Add Errors to Alert */
    logs.forEach((item, index) => {
        const goToErrorButton = BootstrapButton({
            action(event) {
                Route(`Developer/Logs/${item.Id}`);
            },
            parent: alertCard,
            margin: '0px 0px 20px 0px',
            type: 'btn-info',
            value: `Go to log: ${item.Id}`
        });

        goToErrorButton.add();

        const readOnlyFields = [
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Title',
                displayName: 'Type'
            },
            {
                internalFieldName: 'FiscalYear',
                displayName: 'FiscalYear'
            },
            {
                internalFieldName: 'Module',
                displayName: 'Module',
            },
            {
                internalFieldName: 'Message',
                displayName: 'Message',
            },
            {
                internalFieldName: 'StackTrace',
                displayName: 'Stack Trace',
                type: 'mlot'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created',
                type: 'date'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ];

        readOnlyFields.forEach(field => addReadOnlyField(field));

        /** Add Read Only Field */
        function addReadOnlyField(field, parent) {
            const {
                internalFieldName, displayName, type
            } = field;

            let value = item[internalFieldName]?.toString();

            if (type === 'date') {
                value = new Date(item[internalFieldName]);
            }

            else if (type === 'mlot') {
                value = item[internalFieldName].split('<hr>').join('\n');
            }

            else if (internalFieldName === 'Message') {
                const data = JSON.parse(item.Message);

                value = /*html*/ `
                    <table>
                `;

                for (const property in data) {
                    value += /*html*/ `
                        <tr>
                            <th style='padding-right: 15px;'>${property}</th>
                            <td>${data[property]}</td>
                        </tr>
                    `;
                }

                value += /*html*/ `
                    </table>
                `;
            }

            else if (internalFieldName === 'Author') {
                value = item.Author.Title;
            }

            const component = SingleLineTextField({
                label: displayName,
                value: value || /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-dark'>No data</span>`,
                readOnly: true,
                fieldMargin: '0px',
                parent: alertCard
            });

            component.add();
        }

        if (index < logs.length - 1) {
            alertCard.get().insertAdjacentHTML('beforeend', '<hr>');
        }
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
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
        name: 'maincontainer',
        html: /*html*/ `
            <div class='maincontainer'></div>
        `,
        style: /*css*/ `
            .maincontainer {
                position: relative;
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
    };

    component.eventsOff = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'none';
        });
    };

    component.eventsOn = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'initial';
        });
    };

    return component;
}

/**
 * 
 * @param {*} param 
 */
export async function Missing(param) {
    const { parent } = param;

    const viewTitle = Title({
        title: '404',
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const alertBanner = Alert({
        type: 'info',
        text: `Sorry! That page doesn't appear to exist. Please choose an option from the sidebar on the left.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Modal({ title, classes, titleStyle, headerStyle, footerStyle, closeStyle, close, addContent, buttons, centered, fade, background, fullSize, showFooter, scrollable, contentPadding, parent, disableBackdropClose, position, shadow }) {
    const component = Component({
        html: /*html*/ `
            <!-- Modal -->
            <!-- <div class='modal${fade ? ' fade' : ''}' tabindex='-1' role='dialog' aria-hidden='true'> -->
            <div class='modal fade ${ classes?.length ? classes.join(' ') : ''}' tabindex='-1' role='dialog' aria-hidden='true' ${disableBackdropClose ? 'data-keyboard="false" data-backdrop="static"' : ''}>
                <!-- <div class='modal-dialog modal-dialog-zoom ${scrollable !== false ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'> -->
                <div class='modal-dialog modal-dialog-zoom ${scrollable ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'>
                    <div class='modal-content'>
                        ${
                            !title ?
                            /*html*/ `
                                <button type='button' class='close ${close ? '' : 'd-none'}' style='position: absolute; right: 0px; ${closeStyle || ''}' data-dismiss='modal' aria-label='Close'>
                                    <span class='icon-container' style='right: 20px; top: 20px;'>
                                        <svg class='icon x-circle-fill'>
                                            <use href='#icon-bs-x-circle-fill'></use>
                                        </svg>
                                        <svg class='icon circle-fill' style='z-index: 1;'>
                                            <use href='#icon-bs-circle-fill'></use>
                                        </svg>
                                    <span>
                                </button>
                            ` :
                            /*html*/ `
                                <div class='modal-header' ${headerStyle ? `style='${headerStyle}'` : ''}>
                                    <h5 class='modal-title' ${titleStyle ? `style='${titleStyle}'` : ''}>${title || ''}</h5>
                                    ${
                                        close !== false ?
                                        /*html*/ `
                                            <button type='button' class='close' ${closeStyle ? `style='${closeStyle}'` : ''} data-dismiss='modal' aria-label='Close'>
                                                <span class='icon-container'>
                                                    <svg class='icon x-circle-fill'>
                                                        <use href='#icon-bs-x-circle-fill'></use>
                                                    </svg>
                                                    <svg class='icon circle-fill'>
                                                        <use href='#icon-bs-circle-fill'></use>
                                                    </svg>
                                                <span>
                                            </button>
                                        ` : ''
                                    }
                                </div>
                            `
                        }
                        <div class='modal-body'>
                            <!-- Form elements go here -->
                        </div>
                        <div class='modal-footer${showFooter ? '' : ' hidden'}' ${footerStyle ? `style='${footerStyle}'` : ''}>
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

            #id.modal {
                overflow-y: overlay;
            }

            #id.modal.show {
                padding-left: 0px !important;
            }

            /** Modal Content */
            #id .modal-content {
                border-radius: 20px;
                border: none;
                background: ${background || ''};
                padding: ${contentPadding || '0px'};
            }

            /** Header */
            #id .modal-header {
                border-bottom: none;
                /* cursor: move; */
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

            #id .btn-robi-primary {
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
                font-weight: 500;
                text-shadow: unset;
                opacity: 1;
            }

            #id .close .icon-container {
                position: relative;
                display: flex;
            }

            #id .close .circle-fill {
                position: absolute;
                fill: darkgray;
                top: 2px;
                left: 2px;
                transition: all 300ms ease;
            }

            #id .close .icon-container:hover > .circle-fill {
                fill: ${App.get('primaryColor')};
            }

            #id .close .x-circle-fill {
                width: 1.2em;
                height: 1.2em;
                fill: #e9ecef;
                z-index: 10;
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
            ''}
            
            /* Passed in classes */
            /* #id.scrollbar-wide .modal-body::-webkit-scrollbar {
                width: 35px;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar-thumb {
                min-height: 50px;
            } */

            #id.scrollbar-wide .modal-body::-webkit-scrollbar {
                width: 25px;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar-thumb {
                border: 8px solid transparent;
                border-radius: 20px;
                min-height: 75px;
            }

            #id.scrollbar-wide .modal-body::-webkit-scrollbar-button {
                height: 10px;
            }

            ${
                shadow ? 
                /* css */ `
                    #id .modal-content {
                        box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                    }
                ` : ''
            }

            /* No title */
            ${
                !title ?
                /*css*/ `
                    #id .modal-body::-webkit-scrollbar {
                        width: 25px;
                    }

                    #id .modal-body::-webkit-scrollbar-thumb {
                        border: 8px solid transparent;
                        border-radius: 20px;
                    }

                    #id .modal-body::-webkit-scrollbar-button {
                        height: 10px;
                    }
                ` : ''
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

            // Draggable
            // $('.modal-header').on('mousedown', function(event) {
            //     const draggable = $(this);
            //     const extra = contentPadding ? parseInt(contentPadding.replace('px', '')) : 0;
            //     const x = event.pageX - ( draggable.offset().left - extra);
            //     const y = event.pageY - ( draggable.offset().top - extra);

            //     $('body').on('mousemove.draggable', function(event) {
            //         draggable.closest('.modal-content').offset({
            //             left: event.pageX - x,
            //             top: event.pageY - y
            //         });
            //     });

            //     $('body').one('mouseup', function() {
            //         $('body').off('mousemove.draggable');
            //     });

            //     $('body').one('mouseleave', function() {
            //         $('body').off('mousemove.draggable');
            //     });

            //     draggable.closest('.modal').one('bs.modal.hide', function() {
            //         $('body').off('mousemove.draggable');
            //     });
            // });

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
                `;
            }

            html += /*html*/ `
                <div>
            `;

            // All other buttons on right
            buttons.footer
                .filter(button => button.value.toLowerCase() !== 'delete')
                .forEach(button => {
                    const {
                        value, disabled, data, classes, inlineStyle
                    } = button;

                    html += /*html*/ `
                    <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                `;
                });

            html += /*html*/ `
                </div>
            `;
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
                    name, value
                } = attr;

                return `data-${name}='${value}'`;
            })
            .join(' ');
    }

    component.getModalBody = () => {
        return component.find('.modal-body');
    };

    component.hideFooter = () => {
        component.find('.modal-footer').classList.add('hidden');
    };

    component.showFooter = () => {
        component.find('.modal-footer').classList.remove('hidden');
    };

    component.getModal = () => {
        return $(`#${component.get().id}`);
    };

    component.close = (onClose) => {
        if (onClose) {
            $(component.get()).on('hidden.bs.modal', event => {
                onClose(event);
            });
        }

        $(`#${component.get().id}`).modal('hide');
    };

    component.getButton = value => {
        return component.find(`button[data-value='${value}']`);
    };

    component.scrollable = value => {
        if (value === true) {
            component.find('.modal-dialog').classList.add('modal-dialog-scrollable');
        } else if (value === false) {
            component.find('.modal-dialog').classList.remove('modal-dialog-scrollable');
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ModalSlideUp(param) {
    const {
        title, titleStyle, headerStyle, footerStyle, close, addContent, buttons, centered, fade, background, fullSize, showFooter, scrollable, contentPadding, parent, disableBackdropClose, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <!-- Modal -->
            <div class='modal animate' tabindex='-1' role='dialog' aria-hidden='true' ${disableBackdropClose ? 'data-keyboard="false" data-backdrop="static"' : ''}>
                <!-- <div class='modal-dialog modal-dialog-zoom ${scrollable !== false ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'> -->
                <div class='modal-dialog modal-dialog-zoom ${scrollable ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'>
                    <div class='modal-content animate-bottom'>
                        ${
                            !title ?
                            /*html*/ `` :
                            /*html*/ `
                                <div class='modal-header' ${headerStyle ? `style='${headerStyle}'` : ''}>
                                    <h5 class='modal-title' ${titleStyle ? `style='${titleStyle}'` : ''}>${title || ''}</h5>
                                    ${
                                        close !== false ?
                                        /*html*/ `
                                            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                                                <span class='icon-container'>
                                                    <svg class='icon x-circle-fill'>
                                                        <use href='#icon-bs-x-circle-fill'></use>
                                                    </svg>
                                                    <svg class='icon circle-fill'>
                                                        <use href='#icon-bs-circle-fill'></use>
                                                    </svg>
                                                <span>
                                            </button>
                                        ` : ''
                                    }
                                </div>
                            `
                        }
                        <div class='modal-body'>
                            <!-- Form elements go here -->
                        </div>
                        <div class='modal-footer${showFooter ? '' : ' hidden'}' ${footerStyle ? `style='${footerStyle}'` : ''}>
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

            #id.modal {
                overflow-y: hidden;
            }

            #id.modal.show {
                padding-left: 0px !important;
            }

            /** Modal Content */
            #id .modal-content {
                border-radius: 20px 20px 0px 0px;
                border: none;
                background: ${background || ''};
                padding: ${contentPadding || '0px'};
            }

            /** Header */
            #id .modal-header {
                border-bottom: none;
                /* cursor: move; */
            }

            /* Body */
            #id .modal-body {
                padding-bottom: 100px;
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

            #id .btn-robi-primary {
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
                font-weight: 500;
                text-shadow: unset;
                opacity: 1;
            }

            #id .close .icon-container {
                position: relative;
                display: flex;
            }

            #id .close .circle-fill {
                position: absolute;
                fill: darkgray;
                top: 2px;
                left: 2px;
                transition: all 300ms ease;
            }

            #id .close .icon-container:hover > .circle-fill {
                fill: ${App.get('primaryColor')};
            }

            #id .close .x-circle-fill {
                width: 1.2em;
                height: 1.2em;
                fill: #e9ecef;
                z-index: 10;
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
            ''}

            /* Slide up animation */
            #id .modal-dialog {
                position: relative;
                transform: translateY(30px) !important;
                width: calc(100vw - 10px);
                max-width: 100%;
            }

            .animate-bottom {
                min-height: 100vh;
                animation: animatebottom 500ms ease-in-out;
            }
              
            @keyframes animatebottom {
                from {
                    bottom: -300px;
                    opacity: 0;
                }
                
                to {
                    bottom: 0;
                    opacity: 1;
                }
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

            // Draggable
            // $('.modal-header').on('mousedown', function(event) {
            //     const draggable = $(this);
            //     const extra = contentPadding ? parseInt(contentPadding.replace('px', '')) : 0;
            //     const x = event.pageX - ( draggable.offset().left - extra);
            //     const y = event.pageY - ( draggable.offset().top - extra);

            //     $('body').on('mousemove.draggable', function(event) {
            //         draggable.closest('.modal-content').offset({
            //             left: event.pageX - x,
            //             top: event.pageY - y
            //         });
            //     });

            //     $('body').one('mouseup', function() {
            //         $('body').off('mousemove.draggable');
            //     });

            //     $('body').one('mouseleave', function() {
            //         $('body').off('mousemove.draggable');
            //     });

            //     draggable.closest('.modal').one('bs.modal.hide', function() {
            //         $('body').off('mousemove.draggable');
            //     });
            // });

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
                `;
            }

            html += /*html*/ `
                <div>
            `;

            // All other buttons on right
            buttons.footer
                .filter(button => button.value.toLowerCase() !== 'delete')
                .forEach(button => {
                    const {
                        value, disabled, data, classes, inlineStyle
                    } = button;

                    html += /*html*/ `
                    <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                `;
                });

            html += /*html*/ `
                </div>
            `;
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
                    name, value
                } = attr;

                return `data-${name}='${value}'`;
            })
            .join(' ');
    }

    component.getModalBody = () => {
        return component.find('.modal-body');
    };

    component.hideFooter = () => {
        component.find('.modal-footer').classList.add('hidden');
    };

    component.showFooter = () => {
        component.find('.modal-footer').classList.remove('hidden');
    };

    component.getModal = () => {
        return $(`#${component.get().id}`);
    };

    component.close = () => {
        return $(`#${component.get().id}`).modal('hide');
    };

    component.getButton = value => {
        return component.find(`button[data-value='${value}']`);
    };

    component.scrollable = value => {
        if (value === true) {
            component.find('.modal-dialog').classList.add('modal-dialog-scrollable');
        } else if (value === false) {
            component.find('.modal-dialog').classList.remove('modal-dialog-scrollable');
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function MultiChoiceField(param) {
    const {
        label, description, choices, value, fillIn, parent, position, width, fieldMargin, onChange
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<label>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div>
                    ${choices.map(choice => {
            const id = GenerateUUID();

            return /*html*/ `
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" id="${id}" data-label='${choice}' ${value?.includes(choice) ? 'checked' : ''}>
                                    <label class="custom-control-label" for="${id}">${choice}</label>
                                </div>
                                <!-- <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="${id}">
                                    <label class="custom-control-label" for="${id}">${choice}</label>
                                </div> -->
                            `;
        }).join('\n')}
                    ${fillIn ?
                (() => {
                    const id = GenerateUUID();
                    // FIXME: this wil probably break if fill in choice is the same as one of the choices
                    const otherValue = value?.find(item => !choices.includes(item));

                    return /*html*/ `
                                <div class="custom-control custom-checkbox d-flex align-items-center">
                                    <input type="checkbox" class="custom-control-input other-checkbox" id="${id}" data-label='Other' ${otherValue ? 'checked' : ''}>
                                    <label class="custom-control-label d-flex align-items-center other-label" for="${id}">Other</label>
                                    <input type='text' class='form-control ml-2 Other' value='${otherValue || ''}' list='autocompleteOff' autocomplete='new-password'>
                                </div>
                            `;
                })() :
                ''}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                width: inherit;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }
            
            #id .custom-control-label {
                font-size: 13px;
                font-weight: 400;
                white-space: nowrap;
            }

            #id .custom-control-input:checked ~ .custom-control-label::before {
                color: #fff;
                border-color: ${App.get('primarColor')};
                background-color: ${App.get('primarColor')};
            }

            #id .custom-control-input:focus~.custom-control-label::before {
                box-shadow: 0 0 0 0.2rem ${App.get('primarColor') + '6b'} !important;
            }
            
            #id .custom-control-input:focus:not(:checked)~.custom-control-label::before {
                border-color: ${App.get('primarColor') + '6b'}  !important;
            }
            
            /* #id .other-label.custom-control-label::before,
            #id  .other-label.custom-control-label::after {
                top: .5rem;
            } */
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .custom-control-input',
                event: 'change',
                listener: onChange
            },
            {
                selector: '#id .Other',
                event: 'click',
                listener(event) {
                    component.find('input[data-label="Other"]').checked = true;
                }
            },
            {
                selector: '#id .Other',
                event: 'focusout',
                listener(event) {
                    if (!event.target.value) {
                        component.find('input[data-label="Other"]').checked = false;
                    }
                }
            },
            {
                selector: '#id .Other',
                event: 'keyup',
                listener(event) {
                    if (event.target.value) {
                        onChange(event);
                    }
                }
            }
        ],
    });

    component.value = (param, options = {}) => {
        const checked = component.findAll('.custom-control-input:not(.other-checkbox):checked');

        const results = [...checked].map(node => node.dataset.label);

        if (fillIn) {
            // console.log(component.find('.Other').value);
            results.push(component.find('.Other').value);
        }

        return results;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function MultiLineTextField(param) {
    const {
        label, description, optional, value, readOnly, placeHolder, parent, position, minHeight, width, fieldMargin, padding, onKeydown, onKeyup, onFocusout
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<label>${label}${optional ? /*html*/ `<span class='optional'><i>Optional</i></span>` : ''}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${readOnly ? /*html*/ `<div class='form-field-multi-line-text readonly'>${value || placeHolder}</div>` : /*html*/ `<div class='form-field-multi-line-text editable' contenteditable='true'>${value || ''}</div>`}
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                width: inherit;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .form-field-multi-line-text {
                color: #495057; /* Bootstrap@4.5.2 input color */
                margin-top: 2px;
                margin-bottom: 4px;
                padding: 0.375rem 0.75rem;
            }

            #id .form-field-multi-line-text > * {
                color: #495057; /* Bootstrap@4.5.2 input color */
            }

            #id .form-field-multi-line-text.editable {
                min-height: ${minHeight || `200px`};
                width: ${width || 'unset'};
                background: white;
                border-radius: 4px;
                border: 1px solid #ced4da;
            }

            #id .form-field-multi-line-text.editable:active,
            #id .form-field-multi-line-text.editable:focus {
                outline: none;
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
            },
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'keyup',
                listener: onKeyup
            }
        ]
    });

    component.focus = () => {
        const field = component.find('.form-field-multi-line-text');

        field.focus();
    };

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
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function NameField(param) {
    const {
        label, description, fieldMargin, parent, position, onSelect, onClear, onSearch
    } = param;

    /*
        <!--<div class='dropdown-menu show' style='position: absolute; width: ${width}px; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, ${height + 5}px);'>
            <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                <div style='color: ${App.get('primaryColor')};'>Searching...</div>
                <div class='spinner-grow spinner-grow-sm' style='color: ${App.get('primaryColor')};' role='status'></div>
            </div> 
        </div> -->
    */
    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description'>${description}</div>` : ''}
                <div class=''>
                    <div class='toggle-search-list' data-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                        <input class='form-field-name form-control mr-sm-2' type='search' placeholder='Search' aria-label='Search'>
                    </div>
                    <div class='dropdown-menu'>
                        <!-- Show search spinner by -->
                        <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                            <div style='color: ${App.get('primaryColor')};'>Searching...</div>
                            <div class='spinner-grow spinner-grow-sm' style='color: ${App.get('primaryColor')}; font-size: 13px;' role='status'></div>
                        </div> 
                        <!-- <a href='javascript:void(0)' class='dropdown-item' data-path=''>
                            <span class='searching'>
                                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> 
                                Searching for CarePoint accounts...
                            <span>
                        </a> -->
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
            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: .9em;
                padding: 5px 0px;
            }

            #id .form-field-name {
                margin-top: 2px;
                margin-bottom: 4px;
                margin-right: 20px;
                min-height: 36px;
                /* max-width: 300px; */
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

            /* Scroll container */
            #id .scroll-container {
                max-height: 300px;
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
                        <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                            <div style='color: ${App.get('primaryColor')}; font-size: 13px;'>Searching...</div>
                            <div class='spinner-grow spinner-grow-sm' style='color: ${App.get('primaryColor')};' role='status'></div>
                        </div>
                        <!-- <a href='javascript:void(0)' class='dropdown-item' data-path=''>
                            <span class='searching'>
                                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> 
                                Searching for CarePoint accounts...
                            <span>
                        </a> -->
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
            value, info
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
                    <div class='scroll-container'>
                        ${items.map(item => dropdownItemTemplate(item)).join('\n')}
                    </div>
                </div>
            `;
        } else {
            if (menu.classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }
        }
    };

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

        // console.log(newSearch);

        const response = await newSearch.response;

        if (response) {
            console.log(response);

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
        console.log('none found');

        // const message = component.find('.none-found');

        // if (!message) {
        //     const html = /*html*/ `
        //         <span class='none-found' style='color: firebrick;'>
        //             No accounts found that match this name.
        //         </span>
        //     `;

        //     component.get().insertAdjacentHTML('beforeend', html);
        // }
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

        setTimeout(() => {
            field.focus();
        }, 0);
    };

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
                : ''}
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
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

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
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function NewForm(param) {
    const { event, fields, list, modal, parent, table } = param;

    const fieldsToCreate = fields?.filter(field => field.name !== 'Id');
    const components = fieldsToCreate?.map((field, index) => {
        const { name, display, type, choices, action } = field;

        let component = {};

        switch (type) {
            case 'slot':
                component = SingleLineTextField({
                    label: display || name,
                    parent
                });
                break;
            case 'mlot':
                component = MultiLineTextField({
                    label: display || name,
                    parent
                });
                break;
            case 'number':
                component = NumberField({
                    label: display || name,
                    parent
                });
                break;
            case 'choice':
                component = BootstrapDropdown({
                    label: display || name,
                    value: choices[0],
                    options: choices.map(choice => {
                        return {
                            label: choice
                        };
                    }),
                    parent
                });
                break;
            case 'date':
                component = DateField({
                    label: display || name,
                    value: '',
                    parent
                });
                break;
        }

        component.add();

        return {
            component,
            field
        };
    });

    return {
        async onCreate(event) {
            const data = {};

            components
                .forEach(item => {
                    const { component, field } = item;
                    const { name, type } = field;

                    const value = component.value();

                    switch (type) {
                        case 'slot':
                        case 'mlot':
                        case 'choice':
                            if (value) {
                                data[name] = value;
                            }
                            break;
                        case 'number':
                            if (value) {
                                data[name] = parseInt(value);
                            }
                            break;
                    }
                });

            console.log(data);

            const newItem = await CreateItem({
                list,
                data
            });

            return newItem;
        }
    };
}

/**
 *
 * @param {*} param
 * @returns
 */
export function NewQuestion(param) {
    const {
        parent, modal
    } = param;

    /** First Name */
    const titleField = SingleLineTextField({
        label: 'Question',
        description: '',
        width: '100%',
        parent,
        onKeydown(event) {
            if (event.target.value) {
                console.log(modal.getButton('Submit'));
                modal.getButton('Submit').disabled = false;
            } else {
                modal.getButton('Submit').disabled = true;
            }

            submit(event);
        }
    });

    titleField.add();

    /** Middle Name */
    const bodyField = MultiLineTextField({
        label: 'Description',
        description: '',
        width: '100%',
        optional: true,
        parent,
        onKeydown(event) {
            submit(event);
        }
    });

    bodyField.add();

    /** Control + Enter to submit */
    function submit(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            const submit = modal.getButton('Submit');

            if (!submit.disabled) {
                submit.click();
            }
        }
    }

    /** Focus on name field */
    titleField.focus();

    return {
        getFieldValues() {
            const data = {
                Title: titleField.value(),
                Body: bodyField.value(),
            };

            if (!data.Title) {
                /** @todo field.addError() */
                return false;
            }

            return data;
        }
    };
}

/**
 *
 * @param {*} param
 * @returns
 */
export function NewReply(param) {
    const {
        width, action, parent, position, margin
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
                margin: ${margin || '20px 0px 0px 0px'};
            }

            /* New Comment */
            #id .new-comment-container {
                display: flex;
                background: #F8F8FC;
                border-radius: 20px;
            }

            #id .new-comment {
                overflow-wrap: anywhere;
                flex: 2;
                /* font-size: 13px; */
                /* font-weight: 500; */
                padding: 10px 20px;
                border-radius: 20px 0px 0px 20px;
                border-left: solid 3px #F8F8FC;
                border-top: solid 3px #F8F8FC;
                border-bottom: solid 3px #F8F8FC;
            }

            #id .new-comment:active,
            #id .new-comment:focus{
                outline: none;
                border-left: solid 3px ${App.get('primaryColor') + '6b'};
                border-top: solid 3px ${App.get('primaryColor') + '6b'};
                border-bottom: solid 3px ${App.get('primaryColor') + '6b'};
            }

            #id .new-comment-button-container {
                display: flex;
                align-items: end;
                border-radius: 0px 20px 20px 0px;
                border-right: solid 3px #F8F8FC;
                border-top: solid 3px #F8F8FC;
                border-bottom: solid 3px #F8F8FC;
            }

            #id .new-comment:active ~ .new-comment-button-container,
            #id .new-comment:focus ~ .new-comment-button-container {
                border-radius: 0px 20px 20px 0px;
                border-right: solid 3px ${App.get('primaryColor') + '6b'};
                border-top: solid 3px ${App.get('primaryColor') + '6b'};
                border-bottom: solid 3px ${App.get('primaryColor') + '6b'};
            }

            /* Button */
            #id .new-comment-button {
                cursor: pointer;
                display: flex;
                margin: 6px;
                padding: 8px;
                font-weight: bold;
                text-align: center;
                border-radius: 50%;
                color: white;
                background: #e9ecef;
            }

            #id .new-comment-button .icon {
                fill: ${App.get('primaryColor')};
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
                selector: '#id .new-comment',
                event: 'paste',
                async listener(event) {
                    // cancel paste
                    event.preventDefault();

                    // get text representation of clipboard
                    const text = (event.originalEvent || event).clipboardData.getData('text/plain');

                    // insert text manually
                    event.target.innerText = text;
            }
            },
            {
                selector: '#id .new-comment-button',
                event: 'click',
                async listener(event) {
                    const field = component.find('.new-comment');
                    const value = field.innerHTML;

                    if (value) {
                        action({
                            value,
                            button: this,
                            field,
                        });
                    } else {
                        console.log('new comment field is empty');
                    }
                }
            }
        ]
    });

    component.focus = () => {
        component.find('.new-comment').focus();
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function NewUser(param) {
    const {
        table, modal, parent, list, event
    } = param;

    /** Name */
    // const nameField = NameField({
    //     label: 'Search CarePoint Accounts',
    //     description: 'If an account is found, Account and Email Fields will be set automatically.',
    //     fieldMargin: '0px 40px 20px 40px',
    //     parent,
    //     onInput(event) {
    //         const value = event.target.innerText;
    //         if (!value) {
    //             accountField.value('');
    //             emailField.value('');
    //         }
    //     },
    //     async onSetValue(data) {
    //         const {
    //             info
    //         } = data.newValue;
    //         if (info) {
    //             const {
    //                 Account,
    //                 WorkEmail
    //             } = info;
    //             /** Check if account exists */
    //             if (Account !== '')  {
    //                 const userItem = await Get({
    //                     list: 'Users',
    //                     select: 'Id,LoginName',
    //                     filter: `LoginName eq '${Account.split('|')[2]}'`
    //                 });
    //                 if (userItem[0]) {
    //                     readOnlyCard.update({
    //                         type: 'secondary'
    //                     });
    //                     accountField.value('None');
    //                     emailField.value('None');
    //                     nameField.value('');
    //                     const link = `Users/${userItem[0].Id}`;
    //                     nameField.addError({
    //                         text: /*html*/ `
    //                             An account for this user already exists. <span class='alert-link' data-route='${link}'>Click here to view it.</span> Or search for another name.
    //                         `
    //                     });
    //                     return;
    //                 } else {
    //                     nameField.removeError();
    //                 }
    //             }
    //             readOnlyCard.update({
    //                 type: 'success'
    //             });
    //             if (Account) {
    //                 accountField.value(Account.split('|')[2]);
    //             }
    //             if (WorkEmail) {
    //                 emailField.value(WorkEmail);
    //             }
    //         }
    //     }
    // });
    // nameField.add();
    
    /** Name Field */
    const nameField = NameField({
        label: 'Name',
        // description: 'If an account is found, Account and Email Fields will be set automatically.',
        parent,
        onSearch(query) {
            console.log(query);
        },
        onSelect(data) {
            const {
                event, user
            } = param;

            console.log(data);
        },
        onClear(event) {
            console.log('clear name fields');
        }
    });

    nameField.add();

    /** Read Only Card */
    const readOnlyCard = Alert({
        text: '',
        type: 'robi-secondary',
        parent
    });

    readOnlyCard.add();

    /** Account */
    const accountField = SingleLineTextField({
        label: 'Account',
        value: 'None',
        readOnly: true,
        parent: readOnlyCard
    });

    accountField.add();

    /** Email */
    const emailField = SingleLineTextField({
        label: 'Email',
        value: 'None',
        readOnly: true,
        parent: readOnlyCard
    });

    emailField.add();

    const roles = await Get({
        list: 'Roles'
    });

    /** Role */
    const roleField = BootstrapDropdown({
        label: 'Role',
        value: 'User',
        options: roles.map(item => {
            const { Title } = item;

            return { label: Title };
        }),
        width: '200px',
        parent
    });

    roleField.add();

    // Focus name field
    setTimeout(() => {
        nameField.focus();
    }, 200);

    return {
        async onCreate(event) {
            // Create user
            console.log(event);
        }
    };
}

/**
 *
 * @param {*} param
 * @returns
 */
export function NumberField(param) {
    const {
        label, description, value, parent, position, fieldMargin, onChange, onKeydown, onKeyup, onFocusout
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <label>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <input type="number" class="form-control" value="${value !== undefined ? parseFloat(value) : ''}">
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            /* #id input:active,
            #id input:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 1px ${App.get('primaryColor')};
            } */
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
    };

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
                : ''}
            </div>
        `;

        component.find('.form-field-single-line-text').insertAdjacentHTML('beforebegin', html);
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

    component.value = (param) => {
        const field = component.find('input');

        if (param !== undefined) {
            field.value = parseFloat(param);
        } else {
            return field.value;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function PercentField(param) {
    const {
        label, description, value, readOnly, parent, position, width, margin, padding, background, borderRadius, flex, maxWidth, fieldMargin, optional, onKeydown, onFocusout
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
    };

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
                : ''}
            </div>
        `;

        component.find('.form-field-single-line-text').insertAdjacentHTML('beforebegin', html);
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

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
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function PhoneField(param) {
    const {
        label, parent, position, onSetValue
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
                margin-bottom: 10px;
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
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ProgressBar(param) {
    const {
        primary, parent, totalCount
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='loading-bar-container'>
                <div class='loading-bar-status'></div>
            </div>
        `,
        style: /*css*/ `
            #id.loading-bar-container {
                width: 100%;
                margin: 1rem 0rem;
                background: ${App.get('backgroundColor')};
                border-radius: 10px;
            }
            
            #id .loading-bar-status {
                width: 0%;
                height: 15px;
                background: ${primary || App.get('primaryColor')};
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
    };

    component.showLoadingBar = () => {
        component.find('.loading-bar-container').classList.remove('hidden');
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Question(param) {
    const {
        question, margin, parent, onEdit, position
    } = param;

    const {
        Title, Body, Featured, Author, Editor, Created, Modified, replies
    } = question;

    console.log(question);

    const replyCount = replies.length;
    const lastReply = replies[0];

    const component = Component({
        html: /*html*/ `
            <div class='question'>
                <div class='card'>
                    <div class='card-body'>
                        <h5 class='card-title'>
                            <span class='title-text'>${Title}</span>
                            ${
                                Featured ?
                                /*html*/ `
                                    <span class='badge badge-info' role='alert'>Featured</span>
                                ` : ''
                            }
                        </h5>
                        <h6 class='card-subtitle mb-2 text-muted'>${Author.Title.split(' ').slice(0, 2).join(' ')} • ${formatDate(Created)}</h6>
                        <div class='card-text mb-2'>${Body || ''}</div>
                        <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title} ${formatDate(Modified)} ` : ''}</h6>
                    </div>
                    ${buildFooter(lastReply)}
                </div>
                    ${
                        Author.Name.split('|').at(-1) === Store.user().LoginName ?
                        /*html*/ `
                            <div class='edit-button-container'>
                                <button type='button' class='btn btn-robi edit'>Edit question</button>
                            </div>
                        ` : ''
                    }
                <div class='reply-count'>
                    <span class='reply-count-value'>
                        <span>${replyCount}</span>
                    </span>
                    <span class='reply-count-label'>${replyCount === 1 ? 'Reply' : 'Replies'}</span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
            }

            #id .card {
                background: ${App.get('backgroundColor')};
                border: none;
                border-radius: 20px;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
            }

            #id .card-subtitle {
                font-size: .9em;
                font-weight: 400;
            }

            /* #id .card-footer .card-text {
                font-size: 13px;
            } */

            #id .question-card-body {
                padding: 1.75rem;
            }

            #id .card-footer {
                border-radius: 0px 0px 20px 20px;
                background: inherit;
            }

            #id .edit-button-container {
                display: flex;
                justify-content: flex-end;
                margin: 20px 0px;
            }

            /** Replies */
            #id .reply-count {
                margin: 20px 0px;
                font-size: 16px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: end;
            }
            
            #id .reply-count-value {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 30px;
                width: 30px;
                cursor: pointer;
                margin: 5px;
                padding: 5px;
                font-weight: bold;
                text-align: center;
                border-radius: 50%;
                color: white;
                background: ${App.get('primaryColor')};
            }

            #id .reply-count-value * {
                color: white;
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
            Author, Body, Created
        } = lastReply;

        return /*html*/ `
            <span class='text-muted' style='font-size: 14px;'>
                <span>Last reply by ${Author.Title.split(' ').slice(0, 2).join(' ')}</span>
                on
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
            Title, Body, Modified, Editor
        } = param;

        component.find('.title-text').innerHTML = Title;
        component.find('.card-text').innerHTML = Body || '';
        component.find('.edit-text').innerHTML = `Last edited by ${Editor.Title} ${formatDate(Modified)}`;
    };

    component.addCount = () => {
        const replyCount = component.find('.reply-count-value');

        replyCount.innerText = parseInt(replyCount.innerText) + 1;
    };

    component.updateLastReply = (reply) => {
        let footer = component.find('.card-footer');

        if (footer) {
            footer.innerHTML = lastReplyTemplate(reply);
        } else {
            component.find('.card').insertAdjacentHTML('beforeend', buildFooter(reply));
        }

    };

    component.editButton = () => {
        return component.find('.edit');
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function QuestionAndReplies(param) {
    const { parent, path, itemId } = param;

    /** View Title */
    let viewTitle;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

        setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        viewTitle = Title({
            title: 'Question',
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-robi' role='status'></div>
                    `,
                    path: '',
                    currentPage: true
                }
            ],
            parent,
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('name').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);

        console.log('questionTypes added to local storage.');

        // setTitle(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`))
    }

    function setTitle(items) {
        /** If View Tile exists, remove from DOM */
        if (viewTitle) {
            viewTitle.remove();
        }

        /** Parse types */
        const types = JSON.parse(items);

        /** Find question type from passed in path */
        const currentType = types.find(item => item.path === path);

        /** Set new title with drop down options */
        viewTitle = Title({
            title: 'Question',
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions',
                }
            ],
            dropdownGroups: [
                {
                    name: currentType.title,
                    items: types.map(facility => {
                        const {
                            title, path
                        } = facility;

                        return {
                            label: title,
                            path: `Questions/${path}`
                        };
                    })
                },
                {
                    name: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-robi' role='status'></div>
                    `,
                    dataName: 'loading-questions',
                    items: []
                }
            ],
            route(path) {
                Route(path);
            },
            parent,
            position: 'afterbegin',
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();
    }

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px',
        maxWidth: '800px',
        parent
    });

    viewContainer.add();

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        message: 'Loading question',
        type: 'robi',
        parent: viewContainer
    });

    loadingIndicator.add();

    let questions = Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await QuestionsModel({
            // filter: `QuestionType eq '${path}'`
        });

        questions = fetchedQuestions.filter(question => question.QuestionType === path);

        console.log('Model_Questions stored.');
    }

    const question = questions.find(question => question.Id === itemId);

    viewTitle.updateDropdown({
        name: 'loading-questions',
        replaceWith: {
            name: question.Title,
            dataName: question.Id,
            items: questions
                //.filter(question => question.Id !== itemId) /** filter out current question */
                .map(question => {
                    const {
                        Id, Title
                    } = question;

                    return {
                        label: Title,
                        path: `Questions/${path}/${Id}`
                    };
                })
        }
    });

    /** Question */
    QuestionContainer({
        question,
        parent: viewContainer
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

/**
 *
 * @param {*} param
 */
export async function QuestionBoard(param) {
    const { parent, path } = param;

    /** View Title */
    let viewTitle;
    let currentType;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

        setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        viewTitle = Title({
            title: 'Questions',
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-robi' role='status'></div>
                    `,
                    path: '',
                    currentPage: true
                }
            ],
            parent,
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('name').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);

        console.log('questionTypes added to local storage.');

        setTitle(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`));
    }

    function setTitle(items) {
        /** If View Tile exists, remove from DOM */
        if (viewTitle) {
            viewTitle.remove();
        }

        /** Parse types */
        const types = JSON.parse(items);

        /** Find question type from passed in path */
        currentType = types.find(item => item.path === path);

        /** Set new title with drop down options */
        viewTitle = Title({
            title: 'Questions',
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions',
                }
            ],
            dropdownGroups: [
                {
                    name: currentType.title,
                    items: types
                        //.filter(item => item.path !== path) /** filter out current selection */
                        .map(facility => {
                            const {
                                title, path
                            } = facility;

                            return {
                                label: title,
                                path: `Questions/${path}`
                            };
                        })
                }
            ],
            route(path) {
                Route(path);
            },
            parent,
            position: 'afterbegin',
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();
    }

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px',
        parent
    });

    viewContainer.add();

    /** New Question Form */
    let newQuestionForm;

    /** Toolbar */
    const qppQuestionsToolbar = QuestionsToolbar({
        selected: 'All',
        onFilter(filter) {
            console.log(filter);

            /** param */
            const param = {
                path,
                parent: questionsContainer
            };

            const questions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            switch (filter) {
                case 'All':
                    param.questions = questions;
                    break;
                case 'Mine':
                    param.questions = questions.filter(question => {
                        // console.log(question.Author.Title, Store.user().Title);
                        return question.Author.Title === Store.user().Title;
                    });
                    break;
                case 'Unanswered':
                    param.questions = questions.filter(question => {
                        // console.log(question.replies);
                        return question.replies.length === 0;
                    });
                    break;
                case 'Answered':
                    param.questions = questions.filter(question => {
                        // console.log(question.replies);
                        return question.replies.length !== 0;
                    });
                    break;
                case 'Featured':
                    param.questions = questions.filter(question => {
                        // console.log(question.Featured);
                        return question.Featured;
                    });
                    break;
                default:
                    break;
            }

            /** Add new list of cards */
            questionCards = QuestionCards(param);
        },
        onSearch(query) {
            console.log('query: ', query);

            const questions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            const filteredQuestions = questions.filter(question => {
                const {
                    Title, Body, Author, Created
                } = question;

                const date = `${new Date(Created).toLocaleDateString()} ${new Date(Created).toLocaleTimeString('default', {
                    hour: 'numeric',
                    minute: 'numeric'
                })}`.toLowerCase();

                if (Title.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Title: ${Title}.`);

                    return question;
                } else if (Body && Body.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Body: ${Body}.`);

                    return question;
                } else if (Author.Title.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Author name: ${Author.Title}.`);

                    return question;
                } else if (date.includes(query)) {
                    console.log(`SEARCH - Found in Created date: ${date}.`);

                    return question;
                }
            });

            /** Add new list of cards */
            questionCards = QuestionCards({
                path,
                questions: filteredQuestions,
                parent: questionsContainer
            });
        },
        onClear(event) {
            console.log(event);

            /** Add new list of cards */
            questionCards = QuestionCards({
                path,
                questions,
                parent: questionsContainer
            });
        },
        onAsk() {
            const modal = Modal({
                title: 'Ask a question',
                contentPadding: '30px',
                showFooter: true,
                background: App.get('secondaryColor'),
                addContent(modalBody) {
                    newQuestionForm = NewQuestion({
                        parent: modalBody,
                        modal
                    });
                },
                buttons: {
                    footer: [
                        {
                            value: 'Cancel',
                            classes: 'btn-secondary',
                            data: [
                                {
                                    name: 'dismiss',
                                    value: 'modal'
                                }
                            ]
                        },
                        {
                            value: 'Submit',
                            classes: 'btn-success',
                            disabled: true,
                            async onClick(event) {
                                /** Disable button */
                                event.target.disabled = true;
                                event.target.innerHTML = /*html*/ `
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting
                                `;

                                const fieldValues = newQuestionForm.getFieldValues();

                                fieldValues.ParentId = 0;
                                fieldValues.QuestionType = path;

                                /** Create Question */
                                const newItem = await CreateItem({
                                    list: 'Questions',
                                    data: fieldValues
                                });

                                /** Set QuestionId */
                                const updatedItem = await UpdateItem({
                                    list: 'Questions',
                                    select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                                    expand: `Author/Id,Editor/Id`,
                                    itemId: newItem.Id,
                                    data: {
                                        QuestionId: newItem.Id
                                    }
                                });

                                console.log(Store.get('Model_Questions'));

                                const question = QuestionModel({
                                    question: updatedItem
                                });

                                Store.get('Model_Questions').push(question);

                                console.log(Store.get('Model_Questions'));

                                /** Add new quesiton card to DOM */
                                questionCards.addCard(question);

                                /** Completed */
                                event.target.disabled = false;
                                event.target.innerHTML = 'Submitted!';

                                /** close and remove modal */
                                modal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });

            modal.add();
        },
        parent: viewContainer
    });

    qppQuestionsToolbar.add();

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        message: 'Loading questions',
        type: 'robi',
        parent: viewContainer
    });

    loadingIndicator.add();

    /** Questions Container */
    const questionsContainer = Container({
        display: 'flex',
        direction: 'column',
        width: '100%',
        margin: '30px 0px',
        parent: viewContainer
    });

    questionsContainer.add();

    let questions = Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await QuestionsModel({
            // filter: `QuestionType eq '${path}'`
        });

        questions = fetchedQuestions.filter(question => question.QuestionType === path);

        console.log('Model_Questions stored.');
    }

    /** Add all question cards to DOM */
    let questionCards = QuestionCards({
        path,
        questions,
        parent: questionsContainer
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function QuestionCard(param) {
    const {
        question, label, path, margin, parent, position
    } = param;

    const {
        Id, Title, Body, Featured, Author, Editor, Created, Modified, replies
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
                        ${
                            Featured ?
                            /*html*/ `
                                <span class='badge badge-info' role='alert'>Featured</span>
                            ` : ''
                        }
                        ${
                            label === 'new' ?
                            /*html*/ `
                                <span class='badge badge-success' role='alert'>New</span>
                            ` : ''
                        }
                        ${
                            replyCount ?
                            /*html*/ `
                                <span class='reply-count'>
                                    <span class='reply-count-label'>Replies</span>
                                    <span class='badge badge-secondary'>${replyCount}</span>
                                </span>
                            ` : ''
                        }
                    </h5>
                    <!-- <h6 class='card-subtitle mb-2 text-muted'>Asked by ${Author.Title} ${formatDate(Created)}</h6> -->
                    <h6 class='card-subtitle mb-2 text-muted'>${Author.Title.split(' ').splice(0, 2).join(' ')} ${formatDate(Created)}</h6>
                    <div class='card-text mb-2'>${Body || ''}</div>
                    <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title.split(' ').splice(0, 2).join(' ')} ${formatDate(Modified)} ` : ''}</h6>
                </div>
                ${buildFooter(lastReply)}
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
                cursor: pointer;
                background: ${App.get('backgroundColor')};
                border: none;
                border-radius: 20px;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            #id .card-title .badge {
                font-size: 12px;
                font-weight: 500;
                padding: 5px 10px;
                border-radius: 8px;
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

            #id .card-footer {
                border-radius: 0px 0px 20px 20px;
                background: inherit;
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
                Author, Body, Created
            } = lastReply;

            return /*html*/ `
                <div class='card-footer question-last-reply'>
                    <span>
                        <span>Last reply by ${Author.Title.split(' ').splice(0, 2).join(' ')}</span>
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
export function QuestionCards(param) {
    const {
        parent, path, questions
    } = param;

    if (typeof parent === 'object' && parent.empty) {
        parent.empty();
    }

    /** Info Alert Container */
    const alertContainer = Container({
        parent,
        display: 'flex',
        width: '100%',
    });

    alertContainer.add();

    /** Light Alert */
    const lightAlert = Alert({
        type: 'blank',
        text: `${questions.length} question${questions.length === 1 ? '' : 's'}`,
        margin: '20px 0px 10px 0px',
        parent: alertContainer
    });

    lightAlert.add();

    /** Questions */
    questions
        .sort((a, b) => {
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
        })
        .forEach(question => {
            const questionCard = QuestionCard({
                question,
                path: `Questions/${path}`,
                margin: '15px 0px',
                parent
            });

            questionCard.add();
        });

    return {
        addCard(question) {
            /** Add card to DOM */
            const questionCard = QuestionCard({
                question,
                label: 'new',
                path: `Questions/${path}`,
                margin: '15px 0px',
                parent: alertContainer,
                position: 'afterend'
            });

            questionCard.add();

            /** Update count */
            const refreshedQuestions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            lightAlert.get().innerHTML = `${refreshedQuestions.length} question${refreshedQuestions.length === 1 ? '' : 's'}`;
        }
    };
}

/**
 *
 * @param {*} param
 */
export function QuestionContainer(param) {
    const {
        question, parent
    } = param;

    /** New Question Form */
    let editQuestionForm;

    /** Question */
    const questionComponent = Question({
        question,
        parent,
        onEdit(event) {
            const modal = Modal({
                title: 'Edit Question',
                contentPadding: '30px',
                showFooter: true,
                addContent(modalBody) {
                    editQuestionForm = EditQuestion({
                        question,
                        modal,
                        parent: modalBody
                    });
                },
                buttons: {
                    footer: [
                        {
                            value: 'Cancel',
                            classes: 'btn-secondary',
                            data: [
                                {
                                    name: 'dismiss',
                                    value: 'modal'
                                }
                            ]
                        },
                        {
                            value: 'Update',
                            classes: 'btn-robi',
                            async onClick(event) {
                                /** Disable button */
                                event.target.disabled = true;
                                event.target.innerHTML = /*html*/ `
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating
                                `;

                                /** Update question */
                                const updatedItem = await UpdateItem({
                                    list: 'Questions',
                                    select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                                    expand: `Author/Id,Editor/Id`,
                                    itemId: question.Id,
                                    data: editQuestionForm.getFieldValues()
                                });

                                const updatedQuestion = QuestionModel({
                                    question: updatedItem,
                                    replies: question.replies
                                });

                                const questions = Store.get('Model_Questions');
                                const index = questions.indexOf(question);

                                console.log(index);

                                questions.splice(index, 1, updatedQuestion);

                                /** Add new quesiton card to DOM */
                                questionComponent.setQuestion(updatedQuestion);

                                /** Completed */
                                event.target.disabled = false;
                                event.target.innerHTML = 'Updated!';

                                /** close and remove modal */
                                modal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });

            modal.add();
        }
    });

    questionComponent.add();

    /** Replies */
    const {
        replies
    } = question;

    replies
        .sort((a, b) => {
            a = a.Id;
            b = b.Id;

            /** Ascending */
            if (a < b) {
                return -1;
            }

            if (a > b) {
                return 1;
            }

            // names must be equal
            return 0;
        })
        .forEach(reply => {
            const replyComponent = Reply({
                reply,
                margin: '0px 0px 10px 0px',
                parent,
                onEdit(value) {
                    replyOnEdit({
                        reply,
                        replyComponent,
                        value
                    });
                }
            });

            replyComponent.add();
        });

    async function replyOnEdit(param) {
        const {
            reply, replyComponent, value
        } = param;

        if (value !== reply.Body) {
            /** Update question */
            const updatedItem = await UpdateItem({
                list: 'Questions',
                select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                expand: `Author/Id,Editor/Id`,
                itemId: reply.Id,
                data: {
                    Body: value
                }
            });

            const index = replies.indexOf(reply);

            console.log('reply index: ', index);

            replies.splice(index, 1, updatedItem);

            /** Updated modified text */
            replyComponent.setModified(updatedItem);
        }
    }

    /** New Reply */
    const newReply = NewReply({
        width: '100%',
        parent,
        async action({ value, button, field }) {
            // Disable button - Prevent user from clicking this item more than once
            button.disabled = true;
            button.querySelector('.icon').classList.add('d-none');
            button.insertAdjacentHTML('beforeend', /*html*/ `
                <span style="width: 16px; height: 16px;" class="spinner-border spinner-border-sm text-robi" role="status" aria-hidden="true"></span>
            `);

            /** Create item */
            const newItem = await CreateItem({
                list: 'Questions',
                select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                expand: `Author/Id,Editor/Id`,
                data: {
                    Title: 'Reply',
                    Body: value,
                    ParentId: question.Id,
                    QuestionId: question.Id,
                    QuestionType: question.QuestionType
                }
            });

            /** Update Last Reply footer */
            questionComponent.updateLastReply(newItem);

            /** Increment replies */
            questionComponent.addCount();

            /** Add to replies */
            replies.push(newItem);

            /** Add to DOM */
            const replyComponent = Reply({
                reply: newItem,
                label: 'new',
                margin: '0px 0px 10px 0px',
                parent: newReply,
                position: 'beforebegin',
                onEdit(value) {
                    replyOnEdit({
                        reply: newItem,
                        replyComponent,
                        value
                    });
                }
            });

            replyComponent.add();

            // Reset field
            field.innerHTML = '';

            // Enable button
            button.querySelector('.spinner-border').remove();
            button.querySelector('.icon').classList.remove('d-none');
            button.disabled = false;
        }
    });

    newReply.add();

    /** Register event */
    document.addEventListener('keydown', event => {
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
            questionComponent.editButton().click();
        }

        if (event.ctrlKey && event.altKey && event.key === 'r') {
            newReply.focus();
        }
    });
}

/**
 *
 * @param {*} param
 * @returns
 */
export function QuestionsToolbar(param) {
    const {
        selected, parent, onFilter, onSearch, onClear, onAsk, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='btn-toolbar mb-3' role='toolbar'>
                <button type='button' class='btn ask-a-question'>Ask a question</button>
                <div class='ml-2 mr-2'>
                    <input class='form-control mr-sm-2 search-questions' type='search' placeholder='Search' aria-label='Search'>
                </div>    
                <div class='btn-group mr-2' role='group'>
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

            #id .ask-a-question {
                background: #e9ecef;
                color: ${App.get('primaryColor')};
                font-weight: 500;
            }
            
            #id .search-questions {
                background: #e9ecef !important;
                border-color: transparent;
                border-radius: 8px;
                min-width: 250px;
                min-height: 35px;
            }

            #id .btn-robi-primary {
                color: white;
                background: ${App.get('primaryColor')};
            }

            #id .btn-outline-robi-primary {
                color: ${App.get('primaryColor')};
                background-color: initial;
                border-color: ${App.get('primaryColor')};
            }

            /* #id .btn-outline-robi-primary:active {
                color: royalblue;
                background-color: initial;
                border-color: royalblue;
            } */
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .filter',
                event: 'click',
                listener(event) {
                    const isSelected = event.target.classList.contains('btn-outline-robi-primary');

                    /** Deselect all options */
                    component.findAll('.filter').forEach(button => {
                        button.classList.remove('btn-robi-primary');
                        button.classList.add('btn-outline-robi-primary');
                    });

                    if (isSelected) {
                        event.target.classList.remove('btn-outline-robi-primary');
                        event.target.classList.add('btn-robi-primary');
                    } else {
                        event.target.classList.remove('btn-robi-primary');
                        event.target.classList.add('btn-outline-robi-primary');
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
                <button type='button' class='btn ${selected === option ? 'btn-robi-primary' : 'btn-outline-robi-primary'} filter'>${option}</button>
            `;
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
        title, path, questions, parent, position
    } = param;

    const lastEntry = questions[questions.length - 1];

    // Compare Modified dates
    const dates = questions.map(item => new Date(item.Modified));
    const lastModifiedDate = new Date(Math.max(...dates));

    const { Editor, Modified } = lastEntry || { Editor: '', Modified: '' };
    
    const questionCount = questions.filter(item => item.ParentId === 0).length;
    const replyCount = questions.filter(item => item.ParentId !== 0).length;

    const component = Component({
        html: /*html*/ `
            <div class='question-type mb-3'>
                <div class='question-type-title mb-1'>${title}</div>
                <div class='question-count mb-1'>${questionCount} ${questionCount === 1 ? 'question' : 'questions'} (${replyCount} ${replyCount === 1 ? 'reply' : 'replies'})</div>
                <div class='question-date'>${Modified ? `Last updated by ${Editor.Title.split(' ').slice(0, 2).join(' ')} on ${formatDate(lastModifiedDate)}` : ''}</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                border-radius: 20px;
                padding: 20px;
                background: ${App.get('backgroundColor')};
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
 */
export async function QuestionTypes(param) {
    const { parent } = param;

    // View Title
    const viewTitle = Title({
        title: `Questions`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    // View Container
    const container = Container({
        display: 'block',
        width: '100%',
        margin: '30px 0px 0px 0px',
        parent
    });

    container.add();

    // Loading
    const loading = LoadingSpinner({
        type: 'robi',
        message: 'Loading questions',
        parent
    });

    loading.add();

    // Check local storage for questionTypes
    let questionTypes = JSON.parse(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`));

    if (!questionTypes) {
        console.log('questionTypes not in local storage. Adding...');

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('name').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);
        questionTypes = JSON.parse(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`));

        console.log('questionTypes added to local storage.');
    }

    const questions = await Get({
        list: 'Questions',
        select: '*,Author/Name,Author/Title,Editor/Name,Editor/Title',
        expand: `Author/Id,Editor/Id`,
    });

    loading.remove();

    console.log(questions);

    questionTypes.forEach(type => {
        const {
            title, path
        } = type;

        const questionType = QuestionType({
            title,
            path,
            questions: questions.filter(item => item.QuestionType === title),
            parent: container
        });

        questionType.add();
    });
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ReleaseNotes(param) {
    const {
        version, notes, parent, position
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
                color: ${App.get('primaryColor')};
                margin-bottom: 10px;
            }

            #id .release-notes-version strong {
                color: ${App.get('primaryColor')};
            }
        `,
        parent: parent,
        position,
        events: []
    });

    function buildNotes(notes) {
        let html = /*html*/ `
            <ul>
        `;

        notes.forEach(note => {
            const {
                Summary, Description
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

    return component;
}

/**
 *
 * @param {*} param
 */
export async function ReleaseNotesContainer(param) {
    const {
        parent, margin
    } = param;

    const releaseNotesCard = Card({
        title: 'Release Notes',
        width: '100%',
        margin: margin || '20px 0px 0px 0px',
        parent
    });

    releaseNotesCard.add();

    /** Loading Indicator */
    //TODO: replace with loading spinner
    const loadingIndicator = FoldingCube({
        label: 'Loading release notes',
        margin: '40px 0px',
        parent: releaseNotesCard
    });

    loadingIndicator.add();

    /** Get Items */
    const releaseNotes = await Get({
        list: 'ReleaseNotes',
        select: 'Id,Summary,Description,MajorVersion,MinorVersion,PatchVersion,ReleaseType',
        filter: `Status eq 'Published'`
    });

    if (releaseNotes?.length === 0) {
        const alertInfo = Alert({
            text: 'Release notes haven\'t been published for any version yet.',
            type: 'robi-secondary',
            margin: '20px 0px 0px 0px',
            parent: releaseNotesCard
        });

        alertInfo.add();
    }

    const groups = {};

    releaseNotes?.forEach(note => {
        const {
            MajorVersion, MinorVersion, PatchVersion
        } = note;

        const version = `${MajorVersion}.${MinorVersion}.${PatchVersion}`;

        if (!groups[version]) {
            groups[version] = [];
        }

        groups[version].push(note);
    });

    const versions = [];

    for (const key in groups) {
        versions.push(key);
    }

    for (let i = versions.length - 1; i >= 0; i--) {
        const releaseNotesComponent = ReleaseNotes({
            version: versions[i],
            notes: groups[versions[i]],
            parent: releaseNotesCard
        });

        releaseNotesComponent.add();
    }

    /** Remove loading indicator */
    loadingIndicator.remove();
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Reply(param) {
    const {
        reply, label, margin, onEdit, parent, position
    } = param;

    const {
        Body, Author, Editor, Created, Modified
    } = reply;

    const component = Component({
        html: /*html*/ `
            <div class='card'>
                ${
                    Author.Name === Store.user().LoginName ?
                    /*html*/ `
                        <div class='button-group'>
                            <button type='button' class='btn btn-secondary cancel'>Cancel</button>
                            <button type='button' class='btn btn-robi-primaryColor edit'>Edit reply</button>
                        </div>
                    ` : ''
                }
                <div class='card-body'>
                    <h6 class='card-subtitle mb-2 text-muted'>
                        <span>${Author.Title.split(' ').slice(0, 2).join(' ')} • ${formatDate(Created)}</span>
                        ${
                            label === 'new' ?
                            /*html*/ `
                                <span class='badge badge-success' role='alert'>New</span>
                            ` : ''
                        }
                    </h6>
                    <div class='card-text mb-2'>${Body || ''}</div>
                    <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title.slice(0, 2).join(' ')} ${formatDate(Modified)} ` : ''}</h6>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
                position: relative;
                background: ${App.get('backgroundColor')};
                border: none;
                border-radius: 20px;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
            }

            #id .card-subtitle {
                font-size: 14px;
                font-weight: 400;
                text-align: right;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            /* #id .card-text {
                font-size: 13px;
            } */

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

            #id .btn-robi-primaryColor {
                background: ${App.get('primaryColor')};
                color: white;
            }

            #id .btn-robi-primaryColor:focus,
            #id .btn-robi-primaryColor:active {
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
                    editButton.classList.add('btn-robi-primaryColor');
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
                        event.target.classList.remove('btn-robi-primaryColor');
                        event.target.classList.add('btn-success');

                        cardText.setAttribute('contenteditable', true);
                        cardText.classList.add('editable');
                        cardText.focus();

                        cancelButton.style.display = 'block';
                        buttonGroup.style.display = 'flex';
                    } else {
                        onEdit(cardText.innerHTML);

                        event.target.innerText = 'Edit reply';
                        event.target.classList.add('btn-robi-primaryColor');
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
            Modified, Editor
        } = param;

        component.find('.edit-text').innerHTML = `Last edited by ${Editor.Title} ${formatDate(Modified)}`;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function RequestAssitanceInfo(param) {
    const {
        data, parent, position
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
        events: []
    });

    function buildInfo() {
        return data.map(item => {
            const {
                label, name, title, email, phone,
            } = item;

            return /*html*/ `
                <div class="alert alert-robi-secondary" role="alert">
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

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function SearchField(param) {
    const {
        margin, parent, onFilter, onSearch, onClear, onSelect, position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div>
                <!-- <input class='form-control mr-sm-2' type='search' data-toggle='dropdown' placeholder='Search markets and facilites' aria-label='Search'> -->
                <div class='toggle-search-list' data-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                    <input class='form-control mr-sm-2' type='search' placeholder='Search markets & facilities' aria-label='Search'>
                </div>
                <div class='dropdown-menu'>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
            }

            #id .form-inline {
                flex-flow: initial;
            }

            #id input[type='search'] {
                width: 100%;
                border-radius: .25rem;
                font-size: 13px;
                border: none;
                background: #e9ecef;
            }

            #id input[type='search']::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 20px;
                width: 20px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill=''><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
            }

            /** Override Bootstrap input element active/focus style */
            #id input:active,
            #id input:focus {
                outline: none;
                border: none;
                box-shadow: none;
            }

            /** Dropdown */
            #id .dropdown-header {
                color: ${App.get('primaryColor')}
            }

            #id .dropdown-menu {
                margin-top: 5px;
                max-height: 50vh;
                overflow-y: overlay;
                /* box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 2%) 0px 0px 0px 1px; */
                box-shadow: rgb(0 0 0 / 16%) 0px 10px 36px 0px, rgb(0 0 0 / 2%) 0px 0px 0px 1px;
                border: none;
            }

            #id .dropdown-menu::-webkit-scrollbar-track {
                background: white;
            }
            
            #id .dropdown-item {
                cursor: pointer;
                font-size: 13px;
            }

            #id .dropdown-item:focus,
            #id .dropdown-item:hover {
                color: #16181b;
                text-decoration: none;
                background-color: rgba(${App.get('primaryColorRGB')}, .1);
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .toggle-search-list`,
                event: 'keydown',
                listener(event) {
                    console.log(event.key);

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

                    onSearch(event.target.value.toLowerCase());
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

                    if (event.key === 'Enter') {
                        onSelect(event);
                    }
                }
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'click',
                listener(event) {
                    onSelect(event);
                }
            }
        ]
    });

    function dropdownItemTemplate(item) {
        const {
            label, path
        } = item;

        return /*html*/ `
            <a href='javascript:void(0)' class='dropdown-item' data-path='${path}'>${label}</a>
        `;
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function SectionStepper(param) {
    const {
        title, sections, selected, route, padding, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='section-stepper'>
                ${title ? /*html*/ `<div class='section-title'>${title.text}</div>` : ''}
                <div class='section-title-group'>
                    <div class='section-group-container'>
                        ${createHTML()}
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Root */
            #id.section-stepper {
                display: flex;
                flex-direction: column;
                padding: ${padding || '0px'};
                border-radius: 10px;
                /* overflow: auto; */
            }

            #id .section-title-group {
                overflow: overlay;
                /* border-radius: 10px; */
            }

            /* Buttons */
            #id .btn-secondary {
                background: #dee2e6;
                color: #444;
                border-color: transparent;
            }

            /* Title */
            /* #id .section-title {
                font-size: 1em;
                font-weight: 700;
                text-align: center;
                background: #e9ecef;
                color: ${App.get('primaryColor')};
                border-radius: 10px;
                margin-bottom: 15px;
                padding: 10px;
                cursor: pointer;
            } */

            #id .section-title {
                font-size: 18px;
                font-weight: 700;
                color: ${App.get('primaryColor')};
                border-radius: 10px;
                padding: 8px 20px 10px 20px; /* -2px on top to align baseline with view title */
                cursor: pointer;
            }

            /* Sections */
            #id .section-group-container {
                font-weight: 500;
                padding: 0px;
                border-radius: 10px;
            }
            
            #id .section-group {
                cursor: pointer;
                display: flex;
                justify-content: flex-start;
                border-radius: 10px;
                width: 100%;
                padding: 10px 20px;
            }
            
            #id .section-group.selected {
                background: ${App.get('primaryColor')};
                color: white;
            }

            #id .section-group.selected * {
                color: white;
            }

            /* Number */
            #id .section-circle {
                color: ${App.get('primaryColor')};
            }

            /* Name */
            #id .section-name {
                width: 100%;
                white-space: nowrap;
                font-weight: 400;
            }

            #id .section-name-text {
                font-size: 15px;
                margin-left: 10px;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .section-group',
                event: 'click',
                listener(event) {
                    const path = this.dataset.path;
                    Route(`${route}/${path}`);
                }
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

        sections.forEach((section, index) => {
            const {
                name, path
            } = section;

            html += /*html*/ `
                <div class='section-group${name === selected ? ' selected' : ''}' data-path='${path}'>
                    <div class='section-circle' data-name='${name}'>${index + 1}</div>
            `;

            html += /*html*/ `
                    <div class='section-name'>
                        <span class='section-name-text' data-name='${name}'>${name}</span>
                    </div>
                </div>
            `;
        });

        return html;
    }

    component.select = section => {
        const name = component.find(`.section-name-text[data-name='${section}']`);

        // console.log(name);
        if (name) {
            name.classList.add('selected');
        }
    };

    component.deselect = section => {
        const name = component.find(`.section-name-text[data-name='${section}']`);

        if (name) {
            name.classList.remove('selected');
        }
    };

    component.update = sections => {
        sections.forEach(section => {
            const {
                name, status
            } = section;

            const circle = component.find(`.section-circle[data-name='${name}']`);

            circle.classList.remove('complete', 'started', 'not-started');
            circle.classList.add(status);
        });
    };

    return component;
}

/**
 * 
 * @param {*} param 
 */
export async function Settings(param) {
    const { parent } = param;

    const viewTitle = Title({
        title: `Settings`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    AccountInfo({
        parent
    });

    /** Authorize */
    if (Store.user().Role === 'Developer') {
        DeveloperLinks({
            parent
        });
    }

    ReleaseNotesContainer({
        parent
    });

    /** Authorize */
    if (Store.user().Role === 'Developer') {
        SiteUsageContainer({
            parent
        });

        ChangeTheme({
            parent
        });

        BuildInfo({
            parent
        });

        const upgrade = UpgradeAppButton({
            parent
        });

        upgrade.add();
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Sidebar({ parent, path }) {
    const component = Component({
        name: 'sidebar',
        html: /*html*/ `
            <div class='sidebar' data-mode='open'>
                <div class='w-100 d-flex justify-content-between align-items-center collapse-container'>
                    <span class='icon-container collapse'>
                        <svg class='icon'>
                            <use href='#icon-bs-layout-sidebar-nested'></use>
                        </svg>
                    </span>
                    <!-- Developer options --> 
                    ${
                        Store.user().Role === 'Developer' ?
                        (() => {
                            const id = GenerateUUID();

                            return /*html*/ `
                                <div class='dev-buttons-container'>
                                    <div class="dropdown">
                                        <button class="btn w-100 open-dev-menu" type="button" id="${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Edit
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="${id}">
                                            <div class="grown-in-top-left">
                                                <!-- <button class="dropdown-item add-route" type="button">Add route</button> -->
                                                <button class="dropdown-item modify-routes" type="button">Modify routes</button>
                                                <button class="dropdown-item reorder-routes" type="button">Reorder routes</button>
                                                <button class="dropdown-item hide-routes" type="button">Hide routes</button>
                                                <div class="dropdown-divider"></div>
                                                <button class="dropdown-item delete-routes" type="button">Delete routes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        })() : ''
                    }
                </div>
                <div class='title-container position-relative'>
                    <h3 class='title'>${App.get('title')}</h3>
                </div>
                <div class='nav-container'>
                    ${buildNav()}
                </div>
                <div style='padding: 0px 15px; overflow: hidden;'>
                ${
                    Store.user().Role === 'Developer' ?
                    /*html*/ `
                        <span class='nav add-route'>
                            <span class='icon-container' style='padding: 0px;'>
                                <span class='square d-flex' style='padding: 0px; margin: 7px'>
                                    <svg class='icon' style='font-size: 28;'><use href='#icon-bs-plus'></use></svg>
                                </span>
                            </span>
                            <span class='text' data-width='200px' style='white-space: nowrap; color: ${App.get('primaryColor')}'>New Route</span>
                        </span>
                    `: ''
                }
                </div>
                <!-- Settings -->
                <div class='settings-container'>
                    <span class='nav ${(path === 'Settings') ? 'nav-selected' : ''} settings' data-path='Settings'>
                        <span class='icon-container-wide'>
                            <svg class='icon'><use href='#icon-bs-gear'></use></svg>
                        </span>
                        <!-- <span class='text'>Settings</span> -->
                    </span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.sidebar {
                position: relative;
                user-select: none;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                background: ${App.gradientColor ? `linear-gradient(${App.get('gradientColor')})` : App.get('backgroundColor')};
                border-right: solid 1px #d6d8db80;
                height: 100vh;
                transition: width 300ms, min-width 300ms
            }

            #id.sidebar.closed {
                min-width: 0vw;
            }

            /* Title */
            #id h3 {
                padding: 0px 20px 10px 20px;
                margin: 0px;
                font-weight: 700;
                width: 100%;
                white-space: nowrap;
            }

            /* Nav Container */
            .nav-container {
                position: relative;
                overflow: overlay;
                width: 100%;
                padding: 0px 15px;
                overflow-x: hidden;
            }

            /* Settings */
            .settings-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                width: calc(100% - 30px);
                margin: 20px 15px;
            }

            .sidebar .nav {
                display: flex;
                align-items: center;
                width: 100%;
                height: 42.5px;
                cursor: pointer;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                border-radius: 10px;
                transition: width 300ms ease;
            }

            /* .sidebar .nav:not(.nav-selected):hover {
                background-color: ${App.get('primaryColor') + '20'};
            } */

            .sidebar .icon-container {
                display: flex;
                padding: 10px 10px;
            }

            .sidebar .icon-container-wide {
                display: flex;
                padding: 10px 10px;
            }

            .sidebar .nav .icon {
                fill: ${App.get('primaryColor')};
                font-size: 22px;
            }

            .sidebar .text {
                flex: 1;
                font-size: 15px;
                font-weight: 500;
                padding: 10px 0px;
                min-width: 200px;
                white-space: nowrap;
                transition: width 300ms, min-width 300ms, opacity 400ms;
            }

            .sidebar .text.collapsed {
                min-width: 0px;
                overflow: hidden;
                flex: 0;
            }

            /* Selected */
            .sidebar .nav-selected {
                background: ${App.get('primaryColor')};
            }

            .sidebar .nav.nav-selected  .icon {
                fill: white;
                stroke: white;
            }

            .sidebar .nav.nav-selected .text {
                color: white;
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

            /* Edit menu */
            #id .collapse-container {
                padding: 10px 15px;
            }

            #id .collapse-container .btn {
                color: ${App.get('primaryColor')};
                font-weight: 500;
            }

            #id .collapse-container .icon {
                fill: ${App.get('primaryColor')};
                font-size: 22px;
            }
            
            #id .collapse-container .icon-container {
                cursor: pointer;
            }

            #id .dropdown-menu {
                /* box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px; */
                background: transparent;
                border-radius: 10px;
                border: none;
                padding: none;
            }

            #id .dev-buttons-container {
                position: relative;
                width: 50.41px;
                transition: width 150ms ease, opacity 150ms ease;
            }

            #id .dev-buttons-container.closed {
                display: none !important;
            }

            #id .dev-buttons-container .open-dev-menu {
                font-weight: 500;
                font-size: 15px;
            }

            #id .dev-buttons-container .dropdown-toggle:focus {
                box-shadow: none !important;
            }

            #id .dev-buttons-container .dropdown-item {
                outline: none;
                font-size: 14px;
            }

            #id .dev-buttons-container .delete-routes {
                color: firebrick;
            }

            #id .square {
                background: #e9ecef;
                border-radius: 6px;
            }

            #id .add-route {
                transition: width 150ms ease, opacity 150ms ease;
            }

            @keyframes fade-out-left {
                from {
                    transform: translateX(0px);
                    opacity: 1;
                    width: 0px;
                }
                to {
                    transform: translateX(-${App.get('title').length + 20}px);
                    opacity: 0;
                    width: 0px;
                }
            }

            @keyframes fade-out {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes fade-in-right {
                from {
                    transform: translateX(-${App.get('title').length + 20}px);
                    opacity: 0;
                    width: 0px;
                }
                to {
                    transform: translateX(0px);
                    opacity: 1;
                    width: 0px;
                }
            }

            @keyframes grown-in-top-left {
                from {
                    transform: scale(0);
                    transform-origin: top left;
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    transform-origin: top left;
                    opacity: 1;
                }
            }

            @keyframes grab-show {
                from {
                    width: 0px;
                    opacity: 0;
                }
                to {
                    width: 22px;
                    opacity: 1;
                }
            }

            @keyframes grab-show-switch {
                from {
                    width: 0px;
                    opacity: 0;
                }
                to {
                    width: 44px;
                    opacity: 1;
                }
            }

            .fade-out {
                animation: 300ms ease-in-out fade-out;
            }
            
            .fade-in {
                animation: 150ms ease-in-out fade-in;
            }

            .fade-out-left {
                animation: 150ms ease-in-out fade-out-left;
            }

            .fade-in-right {
                animation: 300ms ease-in-out fade-in-right;
            }

            .grown-in-top-left {
                animation: 150ms ease-in-out forwards grown-in-top-left;
                background: white;
                border-radius: 10px;
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                padding: .5rem;
            }

            .grab:not(.switch) {
                width: 22px;
                opacity: 1;
                padding: 10px 0px;
                display: flex;
            }

            .grab.switch {
                width: 44px;
                transform: translateX(44px);
                height: 42.5px;
                opacity: 1;
                padding: 10px 0px;
            }

            .grab-show:not(.switch) {
                animation: 300ms ease-in-out grab-show;
            }

            .grab-show.switch {
                animation: 300ms ease-in-out grab-show-switch;
            }

            .grab-show-reverse:not(.switch) {
                animation: 300ms ease-in-out forwards grab-show;
                animation-direction: reverse;
            }

            .grab-show-reverse.switch {
                animation: 300ms ease-in-out forwards grab-show-switch;
                animation-direction: reverse;
            }

            #id .nav.ui-sortable-handle {
                width: auto;
                background: ${App.get('backgroundColor')};
            }

            #id .nav.ui-sortable-helper {
                width: auto;
                background: ${App.get('backgroundColor')};
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
            }

            #id .edit-buttons {
                position: absolute;
                top: 0px;
                right: 0px;
                height: 100%;
                display: flex;
                align-items: center;
                opacity: 0;
                transition: opacity 150ms ease;
            }

            #id .save-edit,
            #id .cancel-edit {
                cursor: pointer;
                font-size: 15px;
            }

            #id .save-edit {
                margin-right: 10px;
                font-weight: 500;
                opacity: 0;
                pointer-events: none;
                transition: opacity 150ms ease;
            }

            #id .save-edit * {
                color: ${App.get('primaryColor')};
            }
        `,
        parent: parent,
        position: 'afterbegin',
        permanent: true,
        events: [
            {
                selector: '.nav:not(.control):not(.add-route)',
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
                selector: '#id .collapse',
                event: 'click',
                listener: toggleSidebarMode
            },
            {
                selector: '#id .add-route',
                event: 'click',
                listener(event) {
                    AddRoute();
                }
            },
            {
                selector: '#id .modify-routes',
                event: 'click',
                listener: modifyRoutes
            },
            {
                selector: '#id .reorder-routes',
                event: 'click',
                listener: reorderRoutes
            },
            {
                selector: '#id .hide-routes',
                event: 'click',
                listener: hideRoutes
            },
            {
                selector: '#id .delete-routes',
                event: 'click',
                listener: removeRoutes
            }
        ],
        onAdd() {
            setTimeout(() => {
                // Set nav width
                component.findAll('.text').forEach(node => {
                    node.style.width = `${node.offsetWidth}px`;
                    node.dataset.width = `${node.offsetWidth}px`;
                });
            }, 0); // FIXME: Will this always work, even on CarePoint/LaunchPad?

            // Window resize event
            window.addEventListener('resize', event => {
                const mode = component.get().dataset.mode;

                if (window.innerWidth <= 1305) {
                    closeSidebar(mode);
                } else {
                    openSidebar(mode);
                }
            });
        }
    });

    // TODO: blur maincontainer (add transition) and remove pointer events
    function reorderRoutes(event) {
        console.log('reorder routes');

        // Disable all routes
        component.findAll('.nav-container .nav').forEach(node => {
            node.classList.remove('nav-selected');
            node.dataset.shouldroute = 'no';
            node.style.cursor = 'initial';
        });

        // Find sortable nav
        const nav = component.findAll('.nav-container .nav:not([data-type="system"])');
        const startOrder = [...nav].map(node => node.dataset.path);

        console.log(startOrder);

        // disable edit
        component.find('.open-dev-menu').disabled = true;
        component.find('.open-dev-menu').style.opacity = '0';

        // Show cancel
        component.find('.dev-buttons-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex edit-buttons'>
                <div class='save-edit'>
                    <span>Save</span>
                </div>
                <div class='cancel-edit'>
                    <span>Cancel</span>
                </div>
            </div>
        `);

        // Transition
        component.find('.edit-buttons').style.opacity = '1';

        // Add cancel behavior
        component.find('.cancel-edit').addEventListener('click', event => {
            // Enable route
            component.findAll('.nav-container .nav').forEach(node => {
                node.dataset.shouldroute = 'yes';
                node.style.cursor = 'pointer';
            });

            // Animate cancel fade out
            component.find('.cancel-edit').addEventListener('animationend', event => {
                console.log('cancel end');

                // Select node
                const selected = location.href.split('#')[1].split('/')[0];
                component.find(`.nav[data-path='${selected}']`).style.transition = 'background-color 200ms ease';
                component.find(`.nav[data-path='${selected}']`)?.classList.add('nav-selected');
                setTimeout(() => {
                    component.find(`.nav[data-path='${selected}']`).style.transition = 'auto';
                }, 200);

                // Remove cancel edit button
                component.find('.edit-buttons')?.remove();

                // Turn edit back on
                component.find('.open-dev-menu').disabled = false;
                component.find('.open-dev-menu').style.opacity = '1';
            });
            component.find('.cancel-edit').classList.add('fade-out');
        
            // Remove sortable
            $(`#${component.get().id} .nav-container`).sortable('destroy');

            // Remove grab handles
            component.findAll('.nav-container .nav .grab').forEach(node => {
                node.addEventListener('animationend', () => node.remove());
                node.classList.add('grab-show-reverse');
            });
        });

        // Add save behavior
        component.find('.save-edit').addEventListener('click', async event => {
            const blur = BlurOnSave({
                message: 'Updating route order'
            });

            await OrderRoutes({
                routes: [...component.findAll('.nav-container .nav:not([data-type="system"])')].map(node => node.dataset.path)
            });

            await blur.off((event) => {
                console.log(event);
                location.reload();
            });
        });

        // Show grab handle
        nav.forEach(node => {
            node.insertAdjacentHTML('afterbegin', /*html*/ `
                <div class='grab'>
                    <svg class='icon'><use href='#icon-bs-list'></use></svg>
                </div>
            `);

            // Remove animation
            node.querySelector('.grab').addEventListener('animationend', event => {
                node.querySelector('.grab').classList.remove('grab-show');
            });
            node.querySelector('.grab').classList.add('grab-show');
        });

        // Make sortable
        $(`#${component.get().id} .nav-container`).sortable({
            items: '.nav:not([data-type="system"])'
        });
        
        $(`#${component.get().id} .nav-container`).disableSelection();

        $(`#${component.get().id} .nav-container`).on('sortstop', (event, ui) => {
            const newOrder = [...component.findAll('.nav-container .nav:not([data-type="system"])')].map(node => node.dataset.path);
            // console.log(startOrder,  newOrder, arraysMatch(startOrder, newOrder));

            if (arraysMatch(startOrder, newOrder)) {
                component.find('.save-edit').style.opacity = '0';
                component.find('.save-edit').style.pointerEvents = 'none';
            } else {
                component.find('.save-edit').style.opacity = '1';
                component.find('.save-edit').style.pointerEvents = 'auto';
            }
        });

        function arraysMatch(arr1, arr2) {
            // Check if the arrays are the same length
            if (arr1.length !== arr2.length) return false;
        
            // Check if all items exist and are in the same order
            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) return false;
            }
        
            // Otherwise, return true
            return true;
        };
    }

    // TODO: show hidden routes in order
    // TODO: blur maincontainer (add transition) and remove pointer events
    function hideRoutes(event) {
        console.log('hide routes');

        // Disable all routes
        component.findAll('.nav-container .nav').forEach(node => {
                node.classList.remove('nav-selected');
                node.dataset.shouldroute = 'no';
                node.style.cursor = 'initial';
        });

        // disable edit
        component.find('.open-dev-menu').disabled = true;
        component.find('.open-dev-menu').style.opacity = '0';

        // Show cancel
        component.find('.dev-buttons-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex edit-buttons'>
                <div class='save-edit'>
                    <span>Save</span>
                </div>
                <div class='cancel-edit'>
                    <span>Cancel</span>
                </div>
            </div>
        `);

        // Make visible
        component.find('.edit-buttons').style.opacity = '1';

        // Add cancel behavior
        component.find('.cancel-edit').addEventListener('click', event => {
            // Enable route
            component.findAll('.nav-container .nav').forEach(node => {
                node.dataset.shouldroute = 'yes';
                node.style.cursor = 'pointer';
            });

            // Animate cancel fade out
            component.find('.cancel-edit').addEventListener('animationend', event => {
                console.log('end cancel');

                // Select node
                const selected = location.href.split('#')[1].split('/')[0];
                component.find(`.nav[data-path='${selected}']`).style.transition = 'background-color 200ms ease';
                component.find(`.nav[data-path='${selected}']`)?.classList.add('nav-selected');
                setTimeout(() => {
                    component.find(`.nav[data-path='${selected}']`).style.transition = 'auto';
                }, 200);

                // Remove cancel edit button
                component.find('.edit-buttons')?.remove();

                // Remove hide
                // console.log(component.find('.hide-label'));
                component.find('.hide-label')?.remove();

                // Turn edit back on
                component.find('.open-dev-menu').disabled = false;
                component.find('.open-dev-menu').style.opacity = '1';
            });
            component.find('.cancel-edit').classList.add('fade-out');
        
            // Remove grab handles
            component.findAll('.nav-container .nav .grab').forEach(node => {
                node.addEventListener('animationend', () => node.remove());
                node.classList.add('grab-show-reverse');
            });
        });

        // Add save behavior
        component.find('.save-edit').addEventListener('click', async event => {
            const blur = BlurOnSave({
                message: 'Hiding routes'
            });

            //TODO: remove nav from DOM
            const routes = toHide();
            
            component.findAll('.nav-container .nav:not([data-type="system"])').forEach(node => {
                if (routes.includes(node.dataset.path)) {
                    node.remove();
                }
            })

            await HideRoutes({
                routes
            });

            // Wait an additional 2 seconds
            console.log('Waiting...')
            await Wait(2000);

            await blur.off((event) => {
                console.log(event);
                location.reload();
            });
        });

        // Add hide label
        // TODO: add absolutely positioned hide label
        component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
            <div class='d-flex justify-content-end position-absolute hide-label' style='bottom: -5px; right: 25px; font-size: 14px; font-weight: 500;'>
                <div>Hide</div>
            </div>
        `);

        // Show hide switch
        const nav = component.findAll('.nav-container .nav:not([data-type="system"])');
        nav.forEach(node => {
            const id = GenerateUUID();

            node.insertAdjacentHTML('beforeend', /*html*/ `
                <div class="custom-control custom-switch grab switch">
                    <input type="checkbox" class="custom-control-input" id='${id}'>
                    <!-- <label class="custom-control-label" for="${id}">Hide</label> -->
                    <label class="custom-control-label" for="${id}"></label>
                </div>
            `);

            // Switch change
            node.querySelector('.custom-control-input').addEventListener('change', event => {
                const checked = toHide();
                console.log(checked);

                if (checked.length) {
                    component.find('.save-edit').style.opacity = '1';
                    component.find('.save-edit').style.pointerEvents = 'auto';
                } else {
                    component.find('.save-edit').style.opacity = '0';
                    component.find('.save-edit').style.pointerEvents = 'none';
                }
            });

            // Remove animation
            node.querySelector('.grab').addEventListener('animationend', event => {
                node.querySelector('.grab').classList.remove('grab-show');
            });
            node.querySelector('.grab').classList.add('grab-show');
        });

        function toHide() {
            return [...component.findAll('.nav .custom-control-input:checked')].map(node => node.closest('.nav').dataset.path);
        }
    }

    // TODO: blur maincontainer (add transition) and remove pointer events
    function modifyRoutes(event) {
        console.log('modify routes');
    }

    // TODO: blur maincontainer (add transition) and remove pointer events
    function removeRoutes(event) {
        // Show modal
        console.log('remove route');

        const modal = Modal({
            title: false,
            disableBackdropClose: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-2'>Remove route</h3>
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

                const installBtn = BootstrapButton({
                    action() {
                        console.log('Create route');
                    },
                    classes: ['w-100 mt-5'],
                    width: '100%',
                    parent: modalBody,
                    type: 'danger',
                    value: 'Remove routes'
                });

                installBtn.add();

                const cancelBtn = BootstrapButton({
                    action(event) {
                        console.log('Cancel remove route');

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

    function toggleSidebarMode(event) {
        const mode = component.get().dataset.mode;

        if (mode === 'open') {
            closeSidebar(mode, this);
        } else if (mode === 'closed') {
            openSidebar(mode, this);
        }
    }
    
    function closeSidebar(mode) {
        if (mode !== 'closed') {
            // Collapse nav text nodes
            component.findAll('.text').forEach(item => {
                item.classList.add('collapsed');
                item.style.width = '0px';
                item.style.opacity = '0';
            });

            // Fade out long title to the left
            component.find('.title').addEventListener('animationend', event => {
                // console.log(event.target);
                event.target.remove();
                // Set short title
                component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='fade-in title' style='text-align: center;'>${App.get('title')[0]}</h3>                
                `);
            });
            component.find('.title').classList.add('fade-out-left');

            // Fade out Edit
            component.find('.dev-buttons-container').style.opacity = '0';
            component.find('.dev-buttons-container').style.pointerEvents = 'none';
            component.find('.dev-buttons-container').style.width = '0px';

            // Fade out New route
            component.find('.add-route').style.opacity = '0';
            component.find('.add-route').style.pointerEvents = 'none';

            // Set mode
            component.get().dataset.mode = 'closed';
        }
    }

    function openSidebar(mode) {
        if (mode !== 'open') {
            // Reset nav text node width
            component.findAll('.text').forEach(item => {
                item.classList.remove('collapsed');
                item.style.width = item.dataset.width;
                item.style.opacity = '1';
            });

            // Fade in long title from the left
            component.find('.title').remove();
            component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='title fade-in-right'>${App.get('title')}</h3>
            `);
            component.find('.title').addEventListener('animationend', event => {
                // console.log(event.target);
                event.target.classList.remove('fade-in-right');
            });

            // Fade in Edit
            component.find('.dev-buttons-container').style.opacity = '1';
            component.find('.dev-buttons-container').style.pointerEvents = 'auto';
            // TODO: Get actual width on load
            // FIXME: remove hard coded width
            component.find('.dev-buttons-container').style.width = '50.41px';

            // Fade in New route
            component.find('.add-route').style.opacity = '1';
            component.find('.add-route').style.pointerEvents = 'auto';

            // Set mode
            component.get().dataset.mode = 'open';
        }
    }

    function buildNav() {
        return Store.routes()
            .filter(route => route.path !== 'Settings' && !route.hide)
            .map(route => {
                const {
                    path, icon, roles, type
                } = route;

                if (roles) {
                    if (roles.includes(Store.user().Role)) {
                        return navTemplate(path, icon, type);
                    } else {
                        return '';
                    }
                } else {
                    return navTemplate(path, icon, type);
                }

            }).join('\n');
    }

    function navTemplate(routeName, icon, type) {
        const firstPath = path ? path.split('/')[0] : undefined;

        return /*html*/ `
            <span class='nav ${(firstPath === routeName || firstPath === undefined && routeName === App.get('defaultRoute')) ? 'nav-selected' : ''}' data-path='${routeName}' data-type='${type || ''}'>
                <span class='icon-container'>
                    <svg class='icon'><use href='#icon-${icon}'></use></svg>
                </span>
                <span class='text'>${routeName.split(/(?=[A-Z])/).join(' ')}</span>
            </span>
        `;
    }

    function routeToView() {
        if (this.classList.contains('ui-sortable-handle') || this.dataset.shouldroute === 'no') {
            console.log(`don't route when sorting`);

            return;
        }

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
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function SingleLineTextField(param) {
    const {
        addon, label, description, value, readOnly, parent, position, width, margin, padding, placeholder, background, borderRadius, flex, maxWidth, fieldMargin, optional, onKeydown, onKeyup, onKeypress, fontSize, onFocusout,
    } = param;

    let events = [];

    if (onKeydown) {
        events.push({
            selector: '#id .form-control',
            event: 'keydown',
            listener: onKeydown
        });
    }

    if (onKeyup) {
        events.push({
            selector: '#id .form-control',
            event: 'keyup',
            listener: onKeyup
        });
    }

    if (onKeypress) {
        events.push({
            selector: '#id .form-control',
            event: 'keypress',
            listener: onKeypress
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
                <!-- ${label ? /*html*/ `<label>${label}${optional ? /*html*/ `<span class='optional'><i>Optional</i></span>` : ''}</label>` : ''} -->
                <!-- ${readOnly ? /*html*/ `<div class='form-field-single-line-text readonly'>${value || ''}</div>` : /*html*/ `<div class='form-field-single-line-text editable' contenteditable='true'>${value || ''}</div>`} -->
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${
                    addon ?
                    /*html*/ `
                        <div class='input-group'>
                            <div class='input-group-prepend'>
                                <div class='input-group-text'>${addon}</div>
                            </div>
                            ${
                                readOnly ?
                                /*html*/ `
                                    <div type='text' class='form-field-single-line-text readonly'>${value || ''}</div>
                                ` :
                                /*html*/ `
                                    <!-- Edge won't respect autocomplete='off', but autocomplete='new-password' seems to work -->
                                    <input type='text' class='form-control' value='${value || ''}' list='autocompleteOff' autocomplete='new-password' placeholder='${placeholder || ''}'>
                                `
                            }
                        </div>    
                    ` :
                    /*html*/ `
                        ${
                            readOnly ?
                            /*html*/ `
                                <div type='text' class='form-field-single-line-text readonly'>${value || ''}</div>
                            ` :
                            /*html*/ `
                                <!-- Edge won't respect autocomplete='off', but autocomplete='new-password' seems to work -->
                                <input type='text' class='form-control' value='${value || ''}' list='autocompleteOff' autocomplete='new-password' placeholder='${placeholder || ''}'>
                            `   
                        }
                    `
                }
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                ${flex ? `flex: ${flex};` : ''}
                ${padding ? `padding: ${padding};` : ''}
                ${borderRadius ? `border-radius: ${borderRadius};` : ''}
                ${background ? `background: ${background};` : ''}
            }

            ${readOnly ?
                /*css*/ `
                    #id label {
                        margin-bottom: 0px;
                        font-weight: 500;
                    }
                ` :
                /*css*/ `
                    #id label {
                        font-weight: 500;
                    }
                `}

            /* #id label,
            #id .form-label {
                font-size: .95em;
                font-weight: bold;
                padding: 3px 0px;
            } */

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .form-field-single-line-text {
                width: ${width || 'unset'};
                min-height: 36px;
                font-size: ${fontSize || '13px'};
                font-weight: 500;
                margin: ${margin || '2px 0px 4px 0px'};
                padding: 5px 10px;
                border-radius: 4px;
                background: white;
                border: ${App.get('defaultBorder')};
                transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            #id .form-field-single-line-text.readonly {
                font-size: 14px;
                font-weight: 400;
                color: #495057; /* Bootstrap@4.5.2 input color */
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
        const field = component.find('.form-control');

        field?.focus();
    };

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
                : ''}
            </div>
        `;

        component.find('.form-field-single-line-text').insertAdjacentHTML('beforebegin', html);
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

    component.value = (param) => {
        const field = component.find('.form-control');

        if (param !== undefined) {
            field.value = param;
        } else {
            return field.value;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function SiteUsage(param) {
    const {
        border, margin, padding, data, parent, position, onClick
    } = param;

    const {
        visits,
    } = data;

    const screenWidth = window.screen.width;
    const chartWidth = screenWidth > 1500 ? 740 : 500;

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
                /* flex: 1; */
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
                margin-right: 15px;
                margin-bottom: 15px;
            }

            #id .dashboard-long-card-chart-title {
                margin-top: 15px;
                color: ${App.get('defaultColor')};
                font-size: 1.1em;
                font-weight: 500;
                text-align: center;
            }

            /** Label - mimic bootstrap input */
            #id .info-group {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }

            #id .info-group button {
                flex: 1;
                white-space: nowrap;
            }

            #id .info-count {
                border-radius: 8px;
                padding: 5px;
                border: none;
                width: 70px;
                text-align: center;
                font-weight: 700;
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
                <div class="info-count">${visits[property].length}</div>
                <button type='button' class='btn btn-robi'>${label}</button>
            </div>
        `;
    }

    component.setTitle = (text) => {
        const title = component.find('.dashboard-long-card-chart-title');

        title.innerText = text;
    };

    component.clearChart = () => {
        const chartContainer = component.find('.dashboard-long-card-chart-container');

        console.log('clear chart:', chartWidth);

        chartContainer.innerHTML = /*html*/ `<canvas class="myChart" width="${chartWidth}" height="275"></canvas>`;
    };

    component.getChart = () => {
        return component.find('.myChart').getContext('2d');
    };

    return component;
}

/**
 *
 * @param {*} param
 */
export async function SiteUsageContainer(param) {
    const {
        parent
    } = param;

    /** Dashboard */
    const dashboardCard = Card({
        title: 'Site Usage',
        width: '100%',
        minHeight: '600px',
        margin: '20px 0px 0px 0px',
        parent
    });

    dashboardCard.add();

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        message: 'Loading site usage data',
        type: 'robi',
        classes: ['flex-grow-1'],
        parent: dashboardCard
    });

    loadingIndicator.add();

    const workerPath = App.get('mode') === 'prod' ? '../' : `http://127.0.0.1:8080/src/`;

    /** Worker */
    const worker = new Worker(`${workerPath}Robi/Workers/SiteUsage.js`, {
        type: 'module'
    });

    worker.postMessage({
        envMode: App.get('mode'),
        site: App.get('site'),
        bannerColor: App.get('backgroundColor')
    });

    Store.addWorker(worker);

    worker.onmessage = event => {
        const {
            data
        } = event;

        // console.log(data);
        /** Stats 1 */
        const stats_1 = DashboardBanner({
            data: data.stats_1,
            padding: '0px',
            border: 'none',
            margin: '10px 0px 0px 0px',
            parent: dashboardCard
        });

        stats_1.add();

        /** Bar Chart */
        const longCard = SiteUsage({
            data: data.model,
            parent: dashboardCard,
            border: 'none',
            margin: '10px 0px',
            padding: '0px',
            onClick(label) {
                console.log('label:', label);
                console.log('current selected chart:', selectedChart);

                if (label !== selectedChart) {
                    selectedChart = label;
                    selectedData = data.model.chart[label];

                    console.log('new selected chart:', selectedChart);
                    console.log('new selected data:', selectedData);

                    longCard.clearChart();

                    const chart = addChart({
                        card: longCard,
                        type: selectedChart,
                        data: selectedData
                    });
                } else {
                    console.log('*** already selected ***');
                }
            }
        });

        longCard.add();

        /** Start with type: 'week' on load */
        let selectedChart = 'today';
        let selectedData = data.model.chart[selectedChart];

        addChart({
            card: longCard,
            type: selectedChart,
            data: selectedData
        });

        /** Stats 2 */
        const stats_2 = DashboardBanner({
            data: data.stats_2,
            padding: '0px',
            border: 'none',
            margin: '0px',
            parent: dashboardCard
        });

        stats_2.add();

        /** Remove Loading Indicator */
        loadingIndicator.remove();
    };

    /** Add Chart */
    function addChart(param) {
        const {
            card, type, data
        } = param;

        const chart = card.getChart();
        const max0 = Math.max(...data[0].data.map(set => set.length)); /** Largest number from Breaches */
        const max1 = 0;
        // const max1 = Math.max(...data[1].data.map(set => set.length)); /** Largest number from Complaints */
        const max = (Math.ceil((max0 + max1) / 10) || 1) * 10; /** Round sum of max numbers to the nearest multiple of 10 */



        // const max = (Math.round((max0 + max1) / 10) || 1 ) * 10; /** Round sum of max numbers to the nearest multiple of 10*/
        // const max = (Math.ceil((Math.max(...data.map(item => Math.max(...item.data)))) / 10) || 1 ) * 10;
        let stepSize;
        let labels;
        let text;

        if (max < 50) {
            stepSize = 1;
        } else {
            stepSize = 10;
        }

        switch (type) {
            case 'today':
                labels = [
                    '00:00',
                    '01:00',
                    '02:00',
                    '03:00',
                    '04:00',
                    '05:00',
                    '06:00',
                    '07:00',
                    '08:00',
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                    '15:00',
                    '16:00',
                    '17:00',
                    '18:00',
                    '19:00',
                    '20:00',
                    '21:00',
                    '22:00',
                    '23:00'
                ];
                text = new Date().toLocaleDateString('default', {
                    dateStyle: 'full'
                });
                break;
            case 'week':
                const options = {
                    month: 'long',
                    day: 'numeric'
                };
                const startAndEndOfWeek = StartAndEndOfWeek();
                const sunday = startAndEndOfWeek.sunday.toLocaleString('default', options);
                const saturday = startAndEndOfWeek.saturday.toLocaleString('default', options);

                // labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                text = `${sunday} - ${saturday}, ${startAndEndOfWeek.sunday.getFullYear()}`;
                break;
            case 'month':
                labels = data[0].data.map((item, index) => index + 1);
                text = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
                break;
            case 'year':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                text = new Date().getFullYear();
                break;
            default:
                console.log('missing type');
                break;
        }

        card.setTitle(text);

        return new Chart(chart, {
            type: 'bar',
            data: {
                labels,
                datasets: data.map((set, index) => {
                    /** [0] set is purple, [1] set is blue */
                    return {
                        data: set.data.map(item => item.length),
                        label: set.label,
                        backgroundColor: index === 0 ? `rgb(${App.get('primaryColorRGB')}, 0.2)` : 'rgb(67, 203, 255, 0.2)',
                        borderColor: index === 0 ? `rgb(${App.get('primaryColorRGB')}, 1)` : 'rgb(67, 203, 255, 1)',
                        // backgroundColor: index === 0 ? 'rgb(147, 112, 219, 0.2)' : 'rgb(67, 203, 255, 0.2)',
                        // borderColor: index === 0 ? 'rgb(147, 112, 219, 1)' : 'rgb(67, 203, 255, 1)',
                        borderWidth: 1
                    };
                })
            },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            /** Set to max value in dataset */
                            // max,
                            min: 0,
                            stepSize
                        }
                    }],
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Sortable({ parent, position }) {
    const component = Component({
        html: /*html*/ `
            <div>
                <!-- <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 1</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 2</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 3</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 4</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 5</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 6</div>
                <div class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item 7</div> -->
                
                <div class="nav ui-state-disabled">
                    Item 1
                </div>
                <div class="nav">
                    Item 2
                </div>
                <div class="nav">
                    Item 3
                </div>
                <div class="nav">
                    Item 4
                </div>
                <div class="nav">
                    Item 5
                </div>
                <div class="nav">
                    Item 6
                </div>
                <div class="nav">
                    Item 7
                </div>
            </div>
        `,
        style: /*css*/ `
            #id .nav {
                display: flex;
                background: ${App.get('primaryColor')};
                border-radius: 10px;
                margin: 10px 0px;
                padding: 10px;
                color: white;
            }

            #id .ui-sortable-handle {
                cursor: grab;
            }

            #id .ui-sortable-helper {
                cursor: grabbing;
            }
        `,
        position,
        parent,
        events: [],
        onAdd() {
            $(`#${component.get().id}`).sortable({
                items: 'div:not(.ui-state-disabled)'
            });

            $(`#${component.get().id}`).disableSelection();
        }
    });

    return component;
}

/**
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Robi component.
 */
export function SourceTools(param) {
    const {
        route,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class=''>
                <button type='button' class='btn'>
                    <!-- <svg class="icon" style="font-size: 18px; fill: ${App.get('primaryColor')};">
                        <use href="#icon-code-slash"></use>
                    </svg>-->
                    <code style='color: ${App.get('primaryColor')}; font-size: 13px; font-weight: 600;'>&lt;Edit/&gt;</code>
                </button>
            </div>
        `,
        style: /*css*/ `
            #id {
                display: flex;
                align-items: center;
                justify-content: center;
                position: fixed;
                top: 0px;
                right: 0px;
                height: 62px;
                padding: 0px 15px;
                border-radius: 10px;
            }

            #id .btn {
                transition: background-color 250ms ease;
            }

            #id .btn:hover {
                background-color: #e9ecef;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .btn',
                event: 'click',
                listener(event) {
                    ModifyFile({
                        path: `App/src/Routes/${route.path}`,
                        file: `${route.path}.js`
                    });
                }
            }
        ],
        onAdd() {

        }
    });

    return component;
}

/**
 * {@link https://getbootstrap.com/docs/4.5/components/dropdowns/}

 * @param {Object} param
 * @returns
 */
export function StatusField(param) {
    const {
        action, label, parent, position, value, margin, padding
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
    };

    component.value = (param) => {
        const field = component.find('.dropdown-toggle');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function SvgDefs(param) {
    const {
        svgSymbols, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <svg aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <symbol id="icon-home" viewBox="0 0 32 32">
                        <path d="M32 19l-6-6v-9h-4v5l-6-6-16 16v1h4v10h10v-6h4v6h10v-10h4z"></path>
                    </symbol>
                    <symbol id="icon-pencil" viewBox="0 0 32 32">
                        <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                    </symbol>
                    <symbol id="icon-alarm" viewBox="0 0 32 32">
                        <path d="M16 4c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14-6.268-14-14-14zM16 29.25c-6.213 0-11.25-5.037-11.25-11.25s5.037-11.25 11.25-11.25c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25zM29.212 8.974c0.501-0.877 0.788-1.892 0.788-2.974 0-3.314-2.686-6-6-6-1.932 0-3.65 0.913-4.747 2.331 4.121 0.851 7.663 3.287 9.96 6.643v0zM12.748 2.331c-1.097-1.418-2.816-2.331-4.748-2.331-3.314 0-6 2.686-6 6 0 1.082 0.287 2.098 0.788 2.974 2.297-3.356 5.838-5.792 9.96-6.643z"></path>
                        <path d="M16 18v-8h-2v10h8v-2z"></path>
                    </symbol>
                    <symbol id="icon-drawer" viewBox="0 0 32 32">
                        <path d="M31.781 20.375l-8-10c-0.19-0.237-0.477-0.375-0.781-0.375h-14c-0.304 0-0.591 0.138-0.781 0.375l-8 10c-0.142 0.177-0.219 0.398-0.219 0.625v9c0 1.105 0.895 2 2 2h28c1.105 0 2-0.895 2-2v-9c0-0.227-0.077-0.447-0.219-0.625zM30 22h-7l-4 4h-6l-4-4h-7v-0.649l7.481-9.351h13.039l7.481 9.351v0.649z"></path>
                        <path d="M23 16h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                        <path d="M25 20h-18c-0.552 0-1-0.448-1-1s0.448-1 1-1h18c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                    </symbol>
                    <symbol id="icon-user" viewBox="0 0 32 32">
                        <path d="M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>
                    </symbol>
                    <symbol id="icon-users" viewBox="0 0 36 32">
                        <path d="M24 24.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>
                        <path d="M10.225 24.854c1.728-1.13 3.877-1.989 6.243-2.513-0.47-0.556-0.897-1.176-1.265-1.844-0.95-1.726-1.453-3.627-1.453-5.497 0-2.689 0-5.228 0.956-7.305 0.928-2.016 2.598-3.265 4.976-3.734-0.529-2.39-1.936-3.961-5.682-3.961-6 0-6 4.029-6 9 0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h8.719c0.454-0.403 0.956-0.787 1.506-1.146z"></path>
                    </symbol>
                    <symbol id="icon-user-plus" viewBox="0 0 32 32">
                        <path d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"></path>
                        <path d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-4v4h-2v-4h-4v-2h4v-4h2v4h4v2z"></path>
                    </symbol>
                    <symbol id="icon-user-minus" viewBox="0 0 32 32">
                        <path d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"></path>
                        <path d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-10v-2h10v2z"></path>
                    </symbol>
                    <symbol id="icon-cog" viewBox="0 0 32 32">
                        <path d="M29.181 19.070c-1.679-2.908-0.669-6.634 2.255-8.328l-3.145-5.447c-0.898 0.527-1.943 0.829-3.058 0.829-3.361 0-6.085-2.742-6.085-6.125h-6.289c0.008 1.044-0.252 2.103-0.811 3.070-1.679 2.908-5.411 3.897-8.339 2.211l-3.144 5.447c0.905 0.515 1.689 1.268 2.246 2.234 1.676 2.903 0.672 6.623-2.241 8.319l3.145 5.447c0.895-0.522 1.935-0.82 3.044-0.82 3.35 0 6.067 2.725 6.084 6.092h6.289c-0.003-1.034 0.259-2.080 0.811-3.038 1.676-2.903 5.399-3.894 8.325-2.219l3.145-5.447c-0.899-0.515-1.678-1.266-2.232-2.226zM16 22.479c-3.578 0-6.479-2.901-6.479-6.479s2.901-6.479 6.479-6.479c3.578 0 6.479 2.901 6.479 6.479s-2.901 6.479-6.479 6.479z"></path>
                    </symbol>
                    <symbol id="icon-stats-dots" viewBox="0 0 32 32">
                        <path d="M4 28h28v4h-32v-32h4zM9 26c-1.657 0-3-1.343-3-3s1.343-3 3-3c0.088 0 0.176 0.005 0.262 0.012l3.225-5.375c-0.307-0.471-0.487-1.033-0.487-1.638 0-1.657 1.343-3 3-3s3 1.343 3 3c0 0.604-0.179 1.167-0.487 1.638l3.225 5.375c0.086-0.007 0.174-0.012 0.262-0.012 0.067 0 0.133 0.003 0.198 0.007l5.324-9.316c-0.329-0.482-0.522-1.064-0.522-1.691 0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3-0.067 0-0.133-0.003-0.198-0.007l-5.324 9.316c0.329 0.481 0.522 1.064 0.522 1.691 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-0.604 0.179-1.167 0.487-1.638l-3.225-5.375c-0.086 0.007-0.174 0.012-0.262 0.012s-0.176-0.005-0.262-0.012l-3.225 5.375c0.307 0.471 0.487 1.033 0.487 1.637 0 1.657-1.343 3-3 3z"></path>
                    </symbol>
                    <symbol id="icon-stats-bars" viewBox="0 0 32 32">
                        <path d="M0 26h32v4h-32zM4 18h4v6h-4zM10 10h4v14h-4zM16 16h4v8h-4zM22 4h4v20h-4z"></path>
                    </symbol>
                    <symbol id="icon-clipboard-add-solid" viewBox="0 0 32 32">
                        <path d="M21 27h-3v-1h3v-3h1v3h3v1h-3v3h-1v-3zM24 20.498v-13.495c0-1.107-0.891-2.004-1.997-2.004h-1.003c0 0.002 0 0.003 0 0.005v0.99c0 1.111-0.897 2.005-2.003 2.005h-8.994c-1.109 0-2.003-0.898-2.003-2.005v-0.99c0-0.002 0-0.003 0-0.005h-1.003c-1.103 0-1.997 0.89-1.997 2.004v20.993c0 1.107 0.891 2.004 1.997 2.004h9.024c-0.647-1.010-1.022-2.211-1.022-3.5 0-3.59 2.91-6.5 6.5-6.5 0.886 0 1.73 0.177 2.5 0.498v0zM12 4v-1.002c0-1.1 0.898-1.998 2.005-1.998h0.99c1.111 0 2.005 0.895 2.005 1.998v1.002h2.004c0.551 0 0.996 0.447 0.996 0.999v1.002c0 0.556-0.446 0.999-0.996 0.999h-9.009c-0.551 0-0.996-0.447-0.996-0.999v-1.002c0-0.556 0.446-0.999 0.996-0.999h2.004zM14.5 4c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5v0zM21.5 32c3.038 0 5.5-2.462 5.5-5.5s-2.462-5.5-5.5-5.5c-3.038 0-5.5 2.462-5.5 5.5s2.462 5.5 5.5 5.5v0z"></path>
                    </symbol>
                    <symbol id="icon-clipboard-add-outline" viewBox="0 0 32 32">
                        <path d="M21 26v-3h1v3h3v1h-3v3h-1v-3h-3v-1h3zM17.257 30h-10.26c-1.107 0-1.997-0.897-1.997-2.004v-20.993c0-1.114 0.894-2.004 1.997-2.004h1.003c0.003-1.109 0.898-2 2.003-2h0.997c0.001-1.662 1.348-3 3.009-3h0.982c1.659 0 3.008 1.343 3.009 3h0.997c1.108 0 2 0.895 2.003 2v0h1.003c1.107 0 1.997 0.897 1.997 2.004v14.596c1.781 0.91 3 2.763 3 4.9 0 3.038-2.462 5.5-5.5 5.5-1.708 0-3.234-0.779-4.243-2v0 0zM23 21.207v-14.204c0-0.554-0.455-1.003-1-1.003h-1c-0.003 1.109-0.898 2-2.003 2h-8.994c-1.108 0-2-0.895-2.003-2h-1c-0.552 0-1 0.439-1 1.003v20.994c0 0.554 0.455 1.003 1 1.003h9.6c-0.383-0.75-0.6-1.6-0.6-2.5 0-3.038 2.462-5.5 5.5-5.5 0.52 0 1.023 0.072 1.5 0.207v0 0zM12 4h-2.004c-0.55 0-0.996 0.443-0.996 0.999v1.002c0 0.552 0.445 0.999 0.996 0.999h9.009c0.55 0 0.996-0.443 0.996-0.999v-1.002c0-0.552-0.445-0.999-0.996-0.999h-2.004v-1.002c0-1.103-0.894-1.998-2.005-1.998h-0.99c-1.107 0-2.005 0.898-2.005 1.998v1.002zM14.5 4c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5v0zM21.5 31c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5v0z"></path>
                    </symbol>
                    <symbol id="icon-aid-kit" viewBox="0 0 32 32">
                        <path d="M28 8h-6v-4c0-1.1-0.9-2-2-2h-8c-1.1 0-2 0.9-2 2v4h-6c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-16c0-2.2-1.8-4-4-4zM12 4h8v4h-8v-4zM24 22h-6v6h-4v-6h-6v-4h6v-6h4v6h6v4z"></path>
                    </symbol>
                    <symbol id="icon-cross" viewBox="0 0 32 32">
                        <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
                    </symbol>
                    <symbol id="icon-plus" viewBox="0 0 32 32">
                        <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
                    </symbol>
                    <symbol id="icon-checkmark" viewBox="0 0 32 32">
                        <path d="M27 4l-15 15-7-7-5 5 12 12 20-20z"></path>
                    </symbol>
                    <symbol id="icon-assignment_turned_in" viewBox="0 0 24 24">
                        <path d="M9.984 17.016l8.016-8.016-1.406-1.406-6.609 6.563-2.578-2.578-1.406 1.406zM12 3q-0.422 0-0.703 0.281t-0.281 0.703 0.281 0.727 0.703 0.305 0.703-0.305 0.281-0.727-0.281-0.703-0.703-0.281zM18.984 3q0.797 0 1.406 0.609t0.609 1.406v13.969q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.797 0-1.406-0.609t-0.609-1.406v-13.969q0-0.797 0.609-1.406t1.406-0.609h4.172q0.328-0.891 1.078-1.453t1.734-0.563 1.734 0.563 1.078 1.453h4.172z"></path>
                    </symbol>
                    <symbol id="icon-bin2" viewBox="0 0 32 32">
                        <path d="M6 32h20l2-22h-24zM20 4v-4h-8v4h-10v6l2-2h24l2 2v-6h-10zM18 4h-4v-2h4v2z"></path>
                    </symbol>
                    <symbol id="icon-search" viewBox="0 0 32 32">
                        <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path>
                    </symbol>
                    <symbol id="icon-blocked" viewBox="0 0 32 32">
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
                        <path d="M31 16l-15-15v9h-16v12h16v9z"></path>
                    </symbol>
                    <symbol id="icon-arrow-left" viewBox="0 0 32 32">
                        <path d="M1 16l15 15v-9h16v-12h-16v-9z"></path>
                    </symbol>
                    <!-- Drop Zone -->
                    <symbol id="icon-drawer2" viewBox="0 0 32 32">
                        <path d="M31.781 20.375l-8-10c-0.19-0.237-0.477-0.375-0.781-0.375h-14c-0.304 0-0.591 0.138-0.781 0.375l-8 10c-0.142 0.177-0.219 0.398-0.219 0.625v9c0 1.105 0.895 2 2 2h28c1.105 0 2-0.895 2-2v-9c0-0.227-0.077-0.447-0.219-0.625zM30 22h-7l-4 4h-6l-4-4h-7v-0.649l7.481-9.351h13.039l7.481 9.351v0.649z"></path>
                    </symbol>
                    <symbol id="icon-file-text2" viewBox="0 0 32 32">
                        <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
                        <path d="M23 26h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                        <path d="M23 22h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                        <path d="M23 18h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
                    </symbol>
                    <!-- Empty Page -->
                    <symbol id="icon-file-empty" viewBox="0 0 32 32">
                        <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
                    </symbol>
                    <!-- Word -->
                    <symbol id="icon-microsoftword" viewBox="0 0 32 32">
                        <path fill="#2b579a" style="fill: var(--color1, #2b579a)" d="M31.999 4.977v22.063c0 0.188-0.067 0.34-0.199 0.461-0.135 0.125-0.295 0.184-0.48 0.184h-11.412v-3.060h9.309v-1.393h-9.317v-1.705h9.309v-1.392h-9.303v-1.72h9.307v-1.376h-9.307v-1.724h9.307v-1.392h-9.307v-1.705h9.307v-1.391h-9.307v-1.74h9.307v-1.325h-9.307v-3.457h11.416c0.199 0 0.36 0.064 0.477 0.199 0.14 0.132 0.2 0.293 0.199 0.475zM18.2 0.855v30.296l-18.2-3.149v-23.912l18.2-3.24zM15.453 9.799l-2.279 0.14-1.461 9.047h-0.033c-0.072-0.428-0.34-1.927-0.82-4.489l-0.852-4.351-2.139 0.107-0.856 4.244c-0.5 2.472-0.779 3.911-0.852 4.315h-0.020l-1.3-8.333-1.96 0.104 2.1 10.511 2.179 0.14 0.82-4.091c0.48-2.4 0.76-3.795 0.82-4.176h0.060c0.081 0.407 0.341 1.832 0.82 4.28l0.82 4.211 2.36 0.14 2.64-11.8z"></path>
                    </symbol>
                    <!-- Excel -->
                    <symbol id="icon-microsoftexcel" viewBox="0 0 32 32">
                        <path fill="#217346" style="fill: var(--color4, #217346)" d="M31.404 4.136h-10.72v1.984h3.16v3.139h-3.16v1h3.16v3.143h-3.16v1.028h3.16v2.972h-3.16v1.191h3.16v2.979h-3.16v1.191h3.16v2.996h-3.16v2.185h10.72c0.169-0.051 0.311-0.251 0.424-0.597 0.113-0.349 0.172-0.633 0.172-0.848v-21.999c0-0.171-0.059-0.273-0.172-0.309-0.113-0.035-0.255-0.053-0.424-0.053zM30.013 25.755h-5.143v-2.993h5.143v2.996zM30.013 21.571h-5.143v-2.98h5.143zM30.013 17.4h-5.143v-2.959h5.143v2.961zM30.013 13.4h-5.143v-3.139h5.143v3.14zM30.013 9.241h-5.143v-3.12h5.143v3.14zM0 3.641v24.801l18.88 3.265v-31.416l-18.88 3.36zM11.191 22.403c-0.072-0.195-0.411-1.021-1.011-2.484-0.599-1.461-0.96-2.312-1.065-2.555h-0.033l-2.025 4.82-2.707-0.183 3.211-6-2.94-6 2.76-0.145 1.824 4.695h0.036l2.060-4.908 2.852-0.18-3.396 6.493 3.5 6.624-3.065-0.18z"></path>
                    </symbol>
                    <!-- PowerPoint -->
                    <symbol id="icon-microsoftpowerpoint" viewBox="0 0 32 32">
                        <path fill="#d24726" style="fill: var(--color2, #d24726)" d="M31.312 5.333h-11.389v4.248c0.687-0.52 1.509-0.784 2.473-0.784v4.131h4.099c-0.020 1.159-0.42 2.136-1.201 2.924-0.779 0.789-1.757 1.195-2.917 1.221-0.9-0.027-1.72-0.297-2.439-0.82v2.839h8.959v1.393h-8.961v1.724h8.953v1.376h-8.959v3.12h11.391c0.461 0 0.68-0.243 0.68-0.716v-19.976c0-0.456-0.219-0.68-0.68-0.68zM23.040 12.248v-4.165c1.16 0.027 2.133 0.429 2.917 1.213 0.781 0.784 1.188 1.768 1.208 2.952zM11.008 12.317c-0.071-0.268-0.187-0.476-0.351-0.629-0.16-0.149-0.376-0.259-0.644-0.328-0.3-0.081-0.609-0.12-0.92-0.12l-0.96 0.019v3.999h0.035c0.348 0.021 0.713 0.021 1.1 0 0.38-0.020 0.74-0.12 1.079-0.3 0.417-0.3 0.667-0.7 0.748-1.219 0.080-0.521 0.052-1.021-0.085-1.481zM0 4.079v23.928l18.251 3.153v-30.32zM13.617 14.861c-0.5 1.159-1.247 1.9-2.245 2.22-0.999 0.319-2.077 0.443-3.239 0.372v4.563l-2.401-0.279v-12.536l3.812-0.199c0.707-0.044 1.405 0.033 2.088 0.24 0.687 0.203 1.229 0.612 1.631 1.229 0.4 0.615 0.625 1.328 0.68 2.14 0.049 0.812-0.057 1.563-0.325 2.249z"></path>
                    </symbol>
                    <!-- Adobe PDF -->
                    <symbol id="icon-adobeacrobatreader" viewBox="0 0 32 32">
                        <path fill="#ee3f24" style="fill: var(--color1, #ee3f24)" d="M31.464 20.491c-0.947-1.013-2.885-1.596-5.632-1.596-1.467 0-3.167 0.147-5.013 0.493-1.043-1.027-2.083-2.227-3.076-3.627-0.707-0.987-1.324-2.027-1.893-3.053 1.084-3.387 1.608-6.147 1.608-8.133 0-2.229-0.804-4.555-3.12-4.555-0.711 0-1.421 0.433-1.8 1.067-1.044 1.877-0.573 5.991 1.223 10.053-0.671 2.027-1.38 3.964-2.267 6.14-0.771 1.835-1.659 3.725-2.564 5.461-5.205 2.112-8.573 4.579-8.889 6.512-0.139 0.729 0.099 1.4 0.609 1.933 0.177 0.147 0.848 0.727 1.973 0.727 3.453 0 7.093-5.707 8.943-9.147 1.42-0.48 2.84-0.916 4.257-1.353 1.557-0.431 3.12-0.777 4.54-1.020 3.647 3.339 6.861 3.867 8.477 3.867 1.989 0 2.699-0.823 2.937-1.496 0.373-0.867 0.093-1.827-0.336-2.32zM29.617 21.896c-0.139 0.725-0.851 1.208-1.848 1.208-0.28 0-0.52-0.049-0.804-0.096-1.813-0.433-3.511-1.355-5.204-2.808 1.667-0.285 3.080-0.333 3.973-0.333 0.987 0 1.84 0.043 2.413 0.192 0.653 0.141 1.693 0.58 1.46 1.84zM19.587 19.62c-1.227 0.253-2.552 0.552-3.925 0.924-1.088 0.297-2.221 0.632-3.36 1.027 0.617-1.203 1.139-2.365 1.611-3.471 0.571-1.36 1.040-2.76 1.513-4.061 0.467 0.813 0.987 1.64 1.507 2.373 0.853 1.16 1.747 2.267 2.64 3.227zM13.387 1.64c0.193-0.387 0.573-0.581 0.904-0.581 0.993 0 1.183 1.157 1.183 2.080 0 1.557-0.472 3.923-1.28 6.623-1.416-3.76-1.513-6.907-0.807-8.121zM8.184 24.169c-2.413 4.057-4.731 6.577-6.151 6.577-0.28 0-0.516-0.1-0.707-0.244-0.285-0.288-0.427-0.629-0.331-1.013 0.284-1.453 2.981-3.484 7.188-5.32z"></path>
                    </symbol>
                    <!-- Chart Buttons -->
                    <symbol id="icon-open-circle" viewBox="0 0 32 32">
                        <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 28c-6.627 0-12-5.373-12-12s5.373-12 12-12c6.627 0 12 5.373 12 12s-5.373 12-12 12z"></path>
                    </symbol>
                    <symbol id="icon-stats-dots" viewBox="0 0 32 32">
                        <path d="M4 28h28v4h-32v-32h4zM9 26c-1.657 0-3-1.343-3-3s1.343-3 3-3c0.088 0 0.176 0.005 0.262 0.012l3.225-5.375c-0.307-0.471-0.487-1.033-0.487-1.638 0-1.657 1.343-3 3-3s3 1.343 3 3c0 0.604-0.179 1.167-0.487 1.638l3.225 5.375c0.086-0.007 0.174-0.012 0.262-0.012 0.067 0 0.133 0.003 0.198 0.007l5.324-9.316c-0.329-0.482-0.522-1.064-0.522-1.691 0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3-0.067 0-0.133-0.003-0.198-0.007l-5.324 9.316c0.329 0.481 0.522 1.064 0.522 1.691 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-0.604 0.179-1.167 0.487-1.638l-3.225-5.375c-0.086 0.007-0.174 0.012-0.262 0.012s-0.176-0.005-0.262-0.012l-3.225 5.375c0.307 0.471 0.487 1.033 0.487 1.637 0 1.657-1.343 3-3 3z"></path>
                    </symbol>
                    <symbol id="icon-stats-bars" viewBox="0 0 32 32">
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
                    <!-- Bootstrap Code -->
                    <symbol id="icon-bs-code" viewBox="0 0 16 16">
                        <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
                    </symbol>
                    <!-- Bootstrap Hash -->
                    <symbol id="icon-bs-hash" viewBox="0 0 16 16">
                        <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
                    </symbol>
                    <!-- Bootstrap Javascript -->
                    <symbol id='icon-javascript' viewBox="0 0 448 512">
                        <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM243.8 381.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"/>
                    </symbol>
                    <!-- Bootstrap: File earmark -->
                    <symbol id="icon-bs-file-earmark" viewBox="0 0 16 16">
                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                    </symbol>
                    <!-- Bootstrap: File earmark word -->
                    <symbol id="icon-bs-file-earmark-word" viewBox="0 0 16 16">
                        <path d="M5.485 6.879a.5.5 0 1 0-.97.242l1.5 6a.5.5 0 0 0 .967.01L8 9.402l1.018 3.73a.5.5 0 0 0 .967-.01l1.5-6a.5.5 0 0 0-.97-.242l-1.036 4.144-.997-3.655a.5.5 0 0 0-.964 0l-.997 3.655L5.485 6.88z"/>
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                    </symbol>
                    <!-- Bootstrap: File earmark excel -->
                    <symbol id="icon-bs-file-earmark-excel" viewBox="0 0 16 16">
                        <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"/>
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                    </symbol>
                    <!-- Bootstrap: File earmark ppt -->
                    <symbol id="icon-bs-file-earmark-ppt" viewBox="0 0 16 16">
                        <path d="M7 5.5a1 1 0 0 0-1 1V13a.5.5 0 0 0 1 0v-2h1.188a2.75 2.75 0 0 0 0-5.5H7zM8.188 10H7V6.5h1.188a1.75 1.75 0 1 1 0 3.5z"/>
                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                    </symbol>
                    <!-- Bootstrap: File earmark pdf -->
                    <symbol id="icon-bs-file-earmark-pdf" viewBox="0 0 16 16">
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                        <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
                    </symbol>
                    <!-- Bootstrap: X circle fill -->
                    <symbol id="icon-bs-x-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </symbol>
                    <!-- Bootstrap: Arrow left circle fill -->
                    <symbol id="icon-bs-arrow-left-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                    </symbol>
                    <!-- Bootstrap: Dash circle fill -->
                    <symbol id="icon-bs-dash-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
                    </symbol>
                    <!-- Bootstrap: X -->
                    <symbol id="icon-bs-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </symbol>
                    <!-- Bootstrap: X Lg -->
                    <symbol id="icon-bs-x-lg" viewBox="0 0 16 16">
                        <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
                    </symbol>
                    <!-- Bootstrap: Bookmark plus -->
                    <symbol id="icon-bs-bookmark-plus" viewBox="0 0 16 16">
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z"/>
                    </symbol>
                    <!-- Bootstrap: Bookmark x -->
                    <symbol id="icon-bs-bookmark-x" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M6.146 5.146a.5.5 0 0 1 .708 0L8 6.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 7l1.147 1.146a.5.5 0 0 1-.708.708L8 7.707 6.854 8.854a.5.5 0 1 1-.708-.708L7.293 7 6.146 5.854a.5.5 0 0 1 0-.708z"/>
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                    </symbol>
                    <!-- Bootstrap: Layout sidebar nested -->
                    <symbol id="icon-bs-layout-sidebar-nested" viewBox="0 0 16 16">
                        <path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/>
                        <path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
                    </symbol>
                    <!-- Bootstrap: Journals -->
                    <symbol id="icon-bs-journals" viewBox="0 0 16 16">
                        <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
                        <path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"/>
                    </symbol>
                    <!-- Bootstrap: Circle fill -->
                    <symbol id="icon-bs-circle-fill" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="8"/>
                    </symbol>
                    <!-- Bootstrap: List -->
                    <symbol id="icon-bs-list" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                    </symbol>
                    <!-- Bootstrap: Card checklist -->
                    <symbol id="icon-bs-card-checklist" viewBox="0 0 16 16">
                        <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                        <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
                    </symbol>
                    <!-- Bootstrap: Arrow left circle fill -->
                    <symbol id="icon-bs-arrow-left-cirlce-fill" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                    </symbol>
                    <!-- Bootstrap: Tools -->
                    <symbol id="icon-bs-tools" viewBox="0 0 16 16">
                        <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.356 3.356a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 0 0-1.414l-3.356-3.356a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0zm9.646 10.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708zM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11z"/>
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
                html += svgSymbol;
            });
        }

        return html;
    }

    component.getIcons = () => {
        return [...component.findAll('symbol')].map(node => node.id);
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function Table(param) {
    const {
        addButton,
        addButtonValue,
        advancedSearch,
        border,
        buttonColor,
        checkboxes,
        createdRow,
        defaultButtons,
        editForm,
        editFormTitle,
        exportButtons,
        filter,
        formFooter,
        formView,
        headerFilter,
        heading,
        headingColor,
        headingMargin,
        headingSize,
        list,
        margin,
        newForm,
        newFormTitle,
        onDelete,
        openInModal,
        order,
        padding,
        parent,
        showId,
        titleDisplayName,
        toolbar,
        view,
        width
    } = param;

    let {
        buttons, fields, items
    } = param;

    const tableContainer = Container({
        display: 'block',
        width,
        margin,
        padding,
        parent
    });

    tableContainer.add();

    // Heading
    let legendHeading;

    if (heading || list) {
        legendHeading = Heading({
            text: heading || (heading === '' ? '' : list.split(/(?=[A-Z])/).join(' ')),
            size: headingSize,
            color: headingColor,
            margin: headingMargin || (toolbar ? '0px' : '0px 0px 35px 0px'),
            parent: tableContainer
        });

        legendHeading.add();
    }

    // Columns
    const headers = [];
    const columns = [];

    if (checkboxes !== false) {
        headers.push('');
        columns.push({
            data: null,
        });
    }

    // App Lists
    const lists = App.lists();

    // Item Id
    const idProperty = 'Id';
    let formFields = [];

    if (list) {
        // Show loading spinner
        const loadingSpinner = LoadingSpinner({
            type: 'robi', 
            message: `Loading ${list}`,
            parent: tableContainer
        });

        loadingSpinner.add();

        // TODO: Only select fields from view
        items = items || await Get({
            list,
            select: '*,Author/Name,Author/Title,Editor/Name,Editor/Title',
            expand: `Author/Id,Editor/Id`,
            filter
        });

        // Get fields in view
        const schema = lists.concat(Lists()).find(item => item.list === list);
            
        if (view) {
            fields = schema?.views
                .find(item => item.name === view)
                ?.fields
                .map(name => {
                    // FIXME: Set default SharePoint Fields (won't be listed in schema)
                    // TODO: Only set 'Name' as an option if schema.template === 101
                    const spFields = ['Created', 'Modified', 'Author', 'Editor', 'Name'];
                    if (spFields.includes(name)) {
                        return { name };
                    } else {
                        return schema.fields.find(field => field.name === name);
                    }
                });

            if (formView) {
                if (formView === 'All') {
                    formFields = lists.concat(Lists()).find(item => item.list === list)?.fields;
                } else {
                    formFields = schema?.views
                        .find(item => item.name === view)
                        ?.fields
                        .map(name => {
                            // FIXME: Set default SharePoint Fields (won't be listed in schema)
                            // TODO: Only set 'Name' as an option if schema.template === 101
                            const spFields = ['Created', 'Modified', 'Author', 'Editor', 'Name'];
                            if (spFields.includes(name)) {
                                return { name };
                            } else {
                                return schema.fields.find(field => field.name === name);
                            }
                        });
                }
            } else {
                formFields = fields;
            }
        } else {
            // If no view, get all fields
            // FIXME: redundant
            fields = lists.concat(Lists()).find(item => item.list === list)?.fields;
            formFields = lists.concat(Lists()).find(item => item.list === list)?.fields;
        }

        if (!fields) {
            console.log('Missing fields');
            return;
        }

        // Remove loading
        loadingSpinner.remove();

        [{ name: 'Id', display: 'Id', type: 'number' }]
            .concat(fields)
            .forEach(field => {
                const {
                    name, display, type, render
                } = field;

                headers.push(display || name);

                const columnOptions = {
                    data: name === titleDisplayName ? 'Title' : name,
                    type: name === 'Id' ? 'number' : 'string',
                    visible: name === 'Id' && !showId ? false : true
                };

                /** Classes */
                if (name === 'Id') {
                    columnOptions.className = 'do-not-export bold';
                    columnOptions.render = (data, type, row) => {
                        return data;
                    };
                }

                /** Render */
                if (render) {
                    columnOptions.render = render;
                }

                else if (name.includes('Percent')) {
                    columnOptions.render = (data, type, row) => {
                        return `${Math.round(parseFloat(data || 0) * 100)}%`;
                    };
                }

                else if (type === 'mlot') {
                    columnOptions.render = (data, type, row) => {
                        return /*html*/ `
                        <div class='dt-mlot'>${data || ''}</data>
                    `;
                    };
                }

                else if (name === 'Author') {
                    columnOptions.render = (data, type, row) => {
                        return data.Title.split(' ').slice(0, 2).join(' ');
                    };
                }

                else if (name.includes('Created') || name.includes('Date')) {
                    columnOptions.render = (data, type, row) => {
                        // return data ? new Date(data).toLocaleString() : '';
                        return data ? new Date(data).toLocaleDateString() : '';
                    };
                }

                else if (name !== 'Id') {
                    columnOptions.render = (data, type, row) => {
                        return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
                    };
                }

                columns.push(columnOptions);
            });
    } else {
        /** typeof fields === 'object' */
        (Array.isArray(fields) ? fields : fields.split(','))
            .forEach(field => {
                const {
                    render
                } = field;

                const internalFieldName = typeof field === 'object' ? field.internalFieldName : field;
                const displayName = typeof field === 'object' ? field.displayName : field;
                const type = typeof field === 'object' ? field.type || 'slot' : 'slot';

                headers.push(displayName);

                const columnOptions = {
                    data: internalFieldName === titleDisplayName ? 'Title' : internalFieldName,
                    type: internalFieldName === 'Id' ? 'number' : 'string',
                    visible: internalFieldName === 'Id' && !showId ? false : true
                };

                /** Classes */
                if (internalFieldName === 'Id') {
                    columnOptions.className = 'do-not-export bold';
                    columnOptions.render = (data, type, row) => {
                        return data;
                    };
                }

                /** Render */
                if (render) {
                    columnOptions.render = render;
                }

                else if (internalFieldName.includes('Percent')) {
                    columnOptions.render = (data, type, row) => {
                        return `${Math.round(parseFloat(data || 0) * 100)}%`;
                    };
                }

                else if (type === 'mlot') {
                    columnOptions.render = (data, type, row) => {
                        return /*html*/ `
                        <div class='dt-mlot'>${data || ''}</data>
                    `;
                    };
                }

                else if (internalFieldName === 'Author') {
                    columnOptions.render = (data, type, row) => {
                        return data.Title;
                    };
                }

                else if (internalFieldName.includes('Created') || internalFieldName.includes('Date')) {
                    columnOptions.render = (data, type, row) => {
                        return new Date(data).toLocaleString();
                    };
                }

                else if (internalFieldName !== 'Id') {
                    columnOptions.render = (data, type, row) => {
                        return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
                    };
                }

                columns.push(columnOptions);
            });
    }

    /** Table Buttons */
    if (defaultButtons !== false) {
        if (!Array.isArray(buttons)) {
            buttons = [];
        }

        if (checkboxes !== false) {
            buttons = buttons.concat([
                {
                    text: /*html*/ `
                        <svg class='icon'>
                            <use href='#icon-bs-trash'></use>
                        </svg>
                    `,
                    className: 'delete-item',
                    name: 'delete',
                    enabled: false,
                    action: async function (e, dt, node, config) {
                        const selected = table.selected();
                        const button = tableContainer.find('.delete-item');
                        button.disabled = true;
                        button.innerHTML = /*html*/ `<span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span>`;

                        // Delete items
                        for (let row in selected) {
                            console.log(selected[row]);

                            // Delete item
                            await DeleteItem({
                                list,
                                itemId: selected[row].Id
                            });

                            // Delete Row
                            table.removeRow(selected[row].Id);
                        }

                        if (onDelete) {
                            await onDelete(table);
                        }

                        button.innerHTML = /*html*/ `
                            <span>
                                <svg class="icon">
                                    <use href="#icon-bs-trash"></use>
                                </svg>
                            </span>
                        `;
                    }
                }
            ]);
        }

        if (exportButtons !== false) {
            buttons = buttons.concat([
                {
                    extend: 'excelHtml5',
                    // className: 'ml-50',
                    exportOptions: {
                        header: false,
                        footer: false,
                        columns: ':not(.do-not-export):not(.select-checkbox)'
                    }
                },
                {
                    extend: 'csvHtml5',
                    exportOptions: {
                        header: false,
                        footer: false,
                        columns: ':not(.do-not-export):not(.select-checkbox)'
                    }
                },
                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    exportOptions: {
                        columns: ':not(.do-not-export):not(.select-checkbox)'
                    }
                }
                // {
                //     extend: 'copyHtml5',
                //     exportOptions: {
                //         columns: [3,4,5,6,7,8,9,10,11]
                //     }
                // },
            ]);
        }
    }

    if (addButton !== false) {
        buttons.unshift({
            text: /*html*/ `
                <svg class='icon'>
                    <use href='#icon-bs-plus'></use>
                </svg>
                <span>${addButtonValue || 'Add item'}</span>
            `,
            className: 'add-item',
            name: 'add',
            action: function (e, dt, node, config) {
                if (openInModal) {
                    Route(`${list}/New`);
                } else {
                    const newModal = Modal({
                        contentPadding: '30px',
                        title: newFormTitle || `New Item`,
                        async addContent(modalBody) {
                            const formParam = {
                                event: e,
                                fields: formFields,
                                list,
                                modal: newModal,
                                parent: modalBody,
                                table
                            };

                            selectedForm = newForm ? await newForm(formParam) : await NewForm(formParam);

                            // Set button value
                            if (selectedForm?.label) {
                                newModal.getButton('Create').innerText = selectedForm.label;
                            }

                            if (selectedForm) {
                                newModal.showFooter();
                            }
                        },
                        buttons: {
                            footer: [
                                {
                                    value: 'Cancel',
                                    classes: '',
                                    data: [
                                        {
                                            name: 'dismiss',
                                            value: 'modal'
                                        }
                                    ]
                                },
                                // TODO: send modal prop to form
                                {
                                    value: 'Create',
                                    classes: 'btn-robi',
                                    async onClick(event) {
                                        // Disable button - Prevent user from clicking this item more than once
                                        $(event.target)
                                            .attr('disabled', '')
                                            .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating');

                                        // Call newForm.onCreate() and wait for it to complete
                                        const newItem = await selectedForm?.onCreate(event);

                                        if (Array.isArray(newItem)) {
                                            newItem.forEach(item => {
                                                table.addRow({
                                                    data: item
                                                });
                                            })
                                        } else {
                                            table.addRow({
                                                data: newItem
                                            });
                                        }

                                        // Enable button
                                        $(event.target)
                                            .removeAttr('disabled')
                                            .text('Created');

                                        // Close modal (DOM node will be removed on hidden.bs.modal event)
                                        newModal.close();
                                    }
                                }
                            ]
                        },
                        parent: tableContainer
                    });

                    newModal.add();
                }
            }
        });
    }

    // Toolbar
    // Test
    if (toolbar || advancedSearch) {
        const tableToolbar = TableToolbar({
            options: toolbar || [],
            parent: tableContainer,
            advancedSearch,
            list,
            action(label) {
                const { filter } = toolbar.find(option => option.label === label);

                // Clear
                table.DataTable().clear().draw();
                
                // Filter
                table.DataTable().rows.add(filter(items)).draw();
                
                // Adjust
                table.DataTable().columns.adjust().draw();
            },
            async search({ button, filters }) {
                // TODO: add loading message
                // Disable button
                button.disabled = true;
                button.innerHTML = /*html*/ `
                    <span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span>
                `;

                // TODO: wrap preceding fields in ( ) if operator is OR
                const oDataQuery = filters.map(filter => {
                    const { column, condition, value, operator, type } = filter;

                    let query;
                    
                    switch(condition) {
                        case 'contains':
                            query = `(substringof('${value}', ${column}) eq true`
                            break;
                        case 'equals':
                            // TODO: add support for date, lookup, and multichoice fields
                            query = `${column} eq ${type === 'number' ? value : `'${value}'`}`;
                            break;
                        case 'not equal to':
                            // TODO: add support for date, lookup, and multichoice fields
                            query = `${column} ne ${type === 'number' ? value : `'${value}'`}`
                    }

                    return `${query}${operator ? ` ${operator.toLowerCase()} ` : ''}`;
                }).join('');

                console.log(oDataQuery);

                const getItems = await Get({
                    list,
                    filter: oDataQuery
                });

                console.log(getItems);

                // Clear
                table.DataTable().clear().draw();

                // Filter
                table.DataTable().rows.add(getItems).draw();
                
                // Adjust
                table.DataTable().columns.adjust().draw();

                // Enable button
                button.disabled = false;
                button.innerHTML = 'Search';
            }
        });
    
        tableToolbar.add();
    }

    // Selected item, row, and form
    let selectedItem;
    let selectedRow;
    let selectedForm;

    /** Table */
    const table = DataTable({
        headers,
        headerFilter,
        buttonColor,
        checkboxes: checkboxes !== false ? true : false,
        striped: true,
        border: border || false,
        width: '100%',
        columns,
        data: items,
        rowId: idProperty,
        order: order || [[1, 'asc']], /** Sort by 1st column (hidden Id field at [0]) {@link https://datatables.net/reference/api/order()} */
        buttons,
        createdRow,
        onRowClick(param) {
            const {
                row, item
            } = param;

            selectedRow = row;
            selectedItem = item;

            // Open edit form full screen
            if (openInModal) {
                Route(`${list}/${selectedItem.Id}`);
            } else {
                // Open edit form in modal
                const rowModal = Modal({
                    title: editFormTitle || `Edit Item`,
                    contentPadding: '30px',
                    async addContent(modalBody) {
                        const formParam = { item, table, row, fields: formFields, list, modal: rowModal, parent: modalBody };

                        selectedForm = editForm ? await editForm(formParam) : await EditForm(formParam);

                        if (formFooter !== false) {
                            rowModal.showFooter();
                        }
                    },
                    buttons: {
                        footer: [
                            {
                                value: 'Cancel',
                                classes: '',
                                data: [
                                    {
                                        name: 'dismiss',
                                        value: 'modal'
                                    }
                                ]
                            },
                            {
                                value: 'Update',
                                // disabled: true,
                                classes: 'btn-robi',
                                async onClick(event) {
                                    /** Disable button - Prevent user from clicking this item more than once */
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating');

                                    // Call newForm.onUpdate() and wait for it to complete
                                    const updatedItem = await selectedForm?.onUpdate(event);

                                    if (updatedItem) {
                                        table.updateRow({
                                            row: selectedRow,
                                            data: updatedItem
                                        });
                                    }

                                    /** Enable button */
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Updated');

                                    /** Hide modal */
                                    rowModal.getModal().modal('hide');
                                }
                            },
                            {
                                value: 'Delete',
                                // disabled: true,
                                classes: 'btn-robi-light',
                                async onClick(event) {
                                    /** Disable button - Prevent user from clicking this item more than once */
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleteing');

                                    // Call newForm.onDelete() and wait for it to complete
                                    await selectedForm?.onDelete(event);

                                    table.removeRow(selectedItem.Id);

                                    /** Enable button */
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Deleted');

                                    /** Hide modal */
                                    rowModal.getModal().modal('hide');
                                }
                            }
                        ]
                    },
                    parent: tableContainer
                });

                rowModal.add();
            }


        },
        onSelect(param) {
            const selected = table.selected();

            // console.log('select', selected);

            if (selected.length > 0) {
                table.DataTable().buttons('delete:name').enable();
            }

            setSelectedRadius();
        },
        onDeselect(param) {
            const selected = table.selected();

            // console.log('deselect', selected);

            if (selected.length === 0) {
                table.DataTable().buttons('delete:name').disable();
            }

            setSelectedRadius();
            removeSelectedRadius();
        },
        onDraw(param) {
            const {
                jqevent, table
            } = param;

            // const data = table.rows({ search: 'applied' }).data().toArray();
            // console.log(param);

            setSelectedRadius();
            removeSelectedRadius();
        },
        parent: tableContainer
    });

    table.add();

    // FIXME: This only works if selected rows are grouped together
    // TODO: Handle one or more groups of selected rows (ex: rows [1, 2, 3] and [4,5] and [8,9])
    function setSelectedRadius() {
        // Find all rows
        const rows = table.findAll('tbody tr.selected');

        // Reset
        rows.forEach(row => {
            row.querySelector('td:first-child').classList.remove('btlr-0', 'bblr-0');
            row.querySelector('td:last-child').classList.remove('btrr-0', 'bbrr-0');
        });

        // Remove radius from first and last row
        if (rows.length >= 2) {
            rows[0].querySelector('td:first-child').classList.add('bblr-0');
            rows[0].querySelector('td:last-child').classList.add('bbrr-0');

            rows[rows.length - 1].querySelector('td:first-child').classList.add('btlr-0');
            rows[rows.length - 1].querySelector('td:last-child').classList.add('btrr-0');
        }

        // Remove radius from middle rows (every row except first and last)
        if (rows.length >= 3) {
            const middle = [...rows].filter((row, index) => index !== 0 && index !== rows.length - 1);
            middle.forEach(row => {
                row.querySelector('td:first-child').classList.add('btlr-0', 'bblr-0');
                row.querySelector('td:last-child').classList.add('btrr-0', 'bbrr-0');
            });
        }
    }

    function removeSelectedRadius() {
        // Find all rows
        const rows = table.findAll('tbody tr:not(.selected)');

        // Reset
        rows.forEach(row => {
            row.querySelector('td:first-child').classList.remove('btlr-0', 'bblr-0');
            row.querySelector('td:last-child').classList.remove('btrr-0', 'bbrr-0');
        });
    }

    return table;
}

// TODO: Compute advanced search container and row heights in onAdd()
/**
 *
 * @param {*} param
 * @returns
 */
export function TableToolbar(param) {
    const {
        advancedSearch,
        action,
        list,
        options,
        parent,
        position,
        search
    } = param;

    const listInfo = App.lists().find(item => item.list === list);
    let userSettings = JSON.parse(Store.user().Settings);
    let savedSearches = userSettings.savedSearches[list] || [];

    console.log(savedSearches);
    
    let open = false;
    let loaded;

    const component = Component({
        html: /*html*/ `
            <div class='btn-toolbar' role='toolbar'>
                ${
                    advancedSearch ? 
                    /*html*/ `
                        <button type='button' class='btn btn-robi-light mr-2 advanced-search'>Advanced search</button>
                    `                    
                    : ''   
                }
                <div class='btn-group' role='group'>
                    ${buildFilters()}
                </div>
                ${
                    advancedSearch ?
                    (() => {
                        const id = GenerateUUID();

                        return /*html*/ `
                            <div class='search-container search-container-grow height-0 opacity-0 pt-0 pb-0'>
                                ${searchRow(GenerateUUID())}
                                <!-- Buttons -->
                                <div class='d-flex justify-content-end run-search-container pt-2'>
                                    <div class='d-flex justify-content-start load-search-container' style='flex: 2;'>
                                        <button type='button' class='btn btn-robi-light' id="${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Load</button>
                                        <div class="dropdown-menu" aria-labelledby="${id}">
                                            <div class="grown-in-top-left saved-search-menu">
                                                ${
                                                    savedSearches.length ? savedSearches.map(search => {
                                                        const { name } = search;

                                                        return /*html*/ `<button class="dropdown-item load-search" type="button">${name}</button>`;
                                                    }).join('\n') : 
                                                    /*html*/ `
                                                        <div style='font-size: 13px; padding: .25rem 1.5rem;'>No saved searches</div>
                                                    `
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class='d-flex justify-content-end'>
                                        <button type='button' class='btn btn-robi-light save-search'>Save</button>
                                        <button type='button' class='btn btn-robi-reverse run-search'>Search</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    })() : ''   
                }
            </div>
        `,
        style: /*css*/ `
            #id {
                align-items: center;
                justify-content: end;
                margin-bottom: 10px;
            }

            #id .btn-group {
                margin-bottom: 10px;
            }

            #id .btn {
                font-size: 13px;
            }

            #id .btn:focus,
            #id .btn:active {
                box-shadow: none ;
            }

            #id .ask-a-question {
                background: #e9ecef;
                color: ${App.get('primaryColor')};
                font-weight: 500;
            }
            
            #id .search-questions {
                background: #e9ecef !important;
                border-color: transparent;
                border-radius: 8px;
                min-width: 250px;
                min-height: 35px;
            }

            #id .btn-robi-primary {
                color: white;
                background: ${App.get('primaryColor')};
            }

            #id .btn-outline-robi-primary {
                color: ${App.get('primaryColor')};
                background-color: initial;
                border-color: ${App.get('primaryColor')};
            }

            /* Search */
            #id .advanced-search {
                transition: 300ms opacity ease;
                margin-bottom: 10px;
            }

            #id .search-container {
                border-radius: 20px;
                width: 100%;
                padding: 20px;
                background: ${App.get('backgroundColor')};
                transition: opacity 300ms ease, padding 300ms ease, height 300ms ease;
                height: 123px;
                overflow: hidden;
            }

            #id .input-group * {
                font-size: 13px;
            }

            #id .opacity-0 {
                opacity: 0 !important;
            }

            #id .height-0 {
                height: 0px !important;
            }

            /* Load menu */
            #id .dropdown-menu {
                background: transparent;
                border-radius: 10px;
                border: none;
                padding: none;
            }

            @keyframes grown-in-top-left {
                from {
                    transform: scale(0);
                    transform-origin: top left;
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    transform-origin: top left;
                    opacity: 1;
                }
            }

            .grown-in-top-left {
                animation: 150ms ease-in-out forwards grown-in-top-left;
                background: white;
                border-radius: 10px;
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                padding: .5rem;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .filter',
                event: 'click',
                listener(event) {
                    // Deselect all options
                    const currentSelected = component.find('.filter.btn-robi-primary');
                    currentSelected.classList.remove('btn-robi-primary');
                    currentSelected.classList.add('btn-outline-robi-primary');

                    // Select clicked button
                    this.classList.remove('btn-outline-robi-primary');
                    this.classList.add('btn-robi-primary');

                    action(this.innerText);
                }
            },
            {
                selector: '#id .advanced-search',
                event: 'click',
                listener(event) {
                    if (open) {
                        open = false;
                        event.target.innerText = 'Advanced search';
                        setTimeout(() => {
                            component.find('.search-container').classList.add('height-0', 'opacity-0', 'pt-0', 'pb-0');
                        }, 0);
                    } else {
                        open = true;
                        event.target.innerText = 'Close search'
                        setTimeout(() => {
                            component.find('.search-container').classList.remove('height-0', 'opacity-0', 'pt-0', 'pb-0');
                        }, 0);
                    }
                }
            },
            {
                selector: '#id .add-row',
                event: 'click',
                listener: addRow
            },
            {
                selector: '#id .load-search',
                event: 'click',
                listener: loadSearch
            },
            {
                selector: '#id .save-search',
                event: 'click',
                listener: saveSearch
            },
            {
                selector: '#id .run-search',
                event: 'click',
                listener(event) {
                    runSearch(this);
                }
            },
            {
                selector: `#id input[data-field='value']`,
                event: 'keypress',
                listener(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();

                        runSearch(component.find('.run-search'));
                    }
                }
            }
        ]
    });

    function saveSearch(event) {
        const modal = Modal({
            title: false,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');
                // modal.find('.modal-dialog').style.maxWidth = 'fit-content';

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-3'>Save search</h3>
                `);

                // Search name
                const searchName = SingleLineTextField({
                    label: 'Name',
                    value: loaded,
                    parent: modalBody,
                    async onKeypress(event) {
                        if (event.key === 'Enter') {
                            event.preventDefault();

                            if (searchName.value()) {
                                await save();
                            } else {
                                console.log('search name empty');
                            }
                        }
                    },
                    onKeyup(event) {
                        // canEnable();

                        // const name = searchName.value();
                        // showMessage(name);
                    },
                    onFocusout(event) {
                        // const name = searchName.value();
                        // showMessage(name);
                    }
                });

                searchName.add();

                const saveSearchBtn = BootstrapButton({
                    action: save,
                    classes: ['w-100 mt-3'],
                    width: '100%',
                    parent: modalBody,
                    type: 'robi',
                    value: 'Save'
                });

                saveSearchBtn.add();

                const cancelBtn = BootstrapButton({
                    action(event) {
                        console.log('Cancel save search');

                        modal.close();
                    },
                    classes: ['w-100 mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: '',
                    value: 'Cancel'
                });

                cancelBtn.add();

                async function save() {
                    //TODO: Show message if name empty
                    if (!searchName.value()) {
                        console.log('missing search name');
                        return;
                    }

                    console.log('Update Store.user().Settings.savedSearches');

                    // Disable button
                    saveSearchBtn.get().disabled = true;
                    saveSearchBtn.get().innerHTML = /*html*/ `
                        <span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span> Saving search
                    `;

                    // Get rows
                    const rows = [...component.findAll('.search-container .search-row')].map(row => {
                        // Column
                        const column = row.querySelector('[data-field="column"]').value;

                        // Condition
                        const condition = row.querySelector('[data-field="condition"]').value;

                        // Value
                        const value = row.querySelector('[data-field="value"]').value;

                        // Operator
                        const operator = row.querySelector('[data-field="operator"]')?.value || null;

                        return {
                            column,
                            condition,
                            value,
                            operator
                        }
                    });

                    if (savedSearches.map(search => search.name).includes(searchName.value())) {
                        console.log('update existing search')
                        // Update existing search
                        savedSearches.find(item => item.name === searchName.value()).filters = filters;

                        console.log(savedSearches);
                    } else {
                        console.log('add new search')
                        // Add search
                        savedSearches.push({
                            name: searchName.value(),
                            filters: rows
                        });

                        console.log(savedSearches);
                    }

                    // Replace user Settings[list].savedSearches
                    userSettings.savedSearches[list] = savedSearches;
                    const Settings = JSON.stringify(userSettings);
                    Store.user().Settings = Settings;

                    await UpdateItem({
                        itemId: Store.user().Id,
                        list: 'Users',
                        data: {
                            Settings
                        }
                    });

                    // Update saved search menu
                    component.find('.saved-search-menu').innerHTML = savedSearches.map(search => {
                        const { name } = search;

                        return /*html*/ `<button class="dropdown-item load-search" type="button">${name}</button>`;
                    }).join('\n');

                    // Add event listeners
                    component.findAll('.saved-search-menu .load-search').forEach(btn => btn.addEventListener('click', loadSearch));

                    modal.close();
                }

                let pathExists;

                // Show message if path already exists
                function showMessage(value) {
                    if (savedSearches.map(search => search.name).includes(value)) {
                        // Show message
                        if (!pathExists) {
                            pathExists = Alert({
                                type: 'danger',
                                text: `Saved search with name <strong>${value}</strong> already exists`,
                                classes: ['alert-in', 'w-100'],
                                top: searchName.get().offsetHeight + 5,
                                parent: searchName
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
                    if ( searchName.value() !== '' && !savedSearches.map(search => search.name).includes(searchName.value()) ) {
                        saveSearchBtn.enable();
                    } else {
                        saveSearchBtn.disable();
                    }
                }

                // FIXME: Experimental. Not sure if this will work everytime.
                setTimeout(() => {
                    searchName.focus();
                }, 500);
            },
            centered: true,
            showFooter: false,
        });

        modal.add();
    }

    function deleteSearch(event) {
        const modal = Modal({
            title: false,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h4 class='mb-3'>Delete <strong>${loaded}</strong>?</h4>
                `);

                const deleteSearchBtn = BootstrapButton({
                    async action() {
                        console.log('Update Store.user().Settings.savedSearches');
    
                        // Disable button
                        deleteSearchBtn.get().disabled = true;
                        deleteSearchBtn.get().innerHTML = /*html*/ `
                            <span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span> Deleting search
                        `;
    
                        // Find loaaded search by name and remove from savedSearches
                        const searchToDelete = savedSearches.find(search => search.name === loaded);
                        savedSearches.splice(savedSearches.indexOf(searchToDelete), 1);

                        // Replace user Settings[list].savedSearches
                        userSettings.savedSearches[list] = savedSearches;
                        const Settings = JSON.stringify(userSettings);
                        Store.user().Settings = Settings
    
                        await UpdateItem({
                            itemId: Store.user().Id,
                            list: 'Users',
                            data: {
                                Settings
                            }
                        });
    
                        // Update saved search menu
                        component.find('.saved-search-menu').innerHTML = savedSearches.map(search => {
                            const { name } = search;
    
                            return /*html*/ `<button class="dropdown-item load-search" type="button">${name}</button>`;
                        }).join('\n');
    
                        // Add event listeners
                        component.findAll('.saved-search-menu .load-search').forEach(btn => btn.addEventListener('click', loadSearch));

                        // Reset menu
                        newSearch();
    
                        modal.close();
                    },
                    classes: ['w-100 mt-3'],
                    width: '100%',
                    parent: modalBody,
                    type: 'robi',
                    value: 'Delete'
                });

                deleteSearchBtn.add();

                const cancelBtn = BootstrapButton({
                    action(event) {
                        console.log('Cancel delete search');

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

    function newSearch() {
        // Reset loaded
        loaded = null;

        // Remove rows
        component.findAll('.search-container .search-row').forEach(row => row.remove());

        // Remove loaded search buttons
        component.find('.edit-search-container')?.remove();

        // Row id
        const newId = GenerateUUID();
        
        // Add row
        component.find('.search-container').style.height = `123px`;
        component.find('.run-search-container').insertAdjacentHTML('beforebegin', searchRow(newId));
        component.find(`.search-row[data-rowid='${newId}'] .add-row`).addEventListener('click', addRow);
    }

    function addRow(event) {
        // Id
        const id = event.target.closest('.search-row').dataset.rowid;

        // Button clicked
        const button = component.find(`.search-row[data-rowid='${id}'] .add-row`);

        // Add ADD/OR select
        button.insertAdjacentHTML('beforebegin', /*html*/ `
            <select class="custom-select ml-2 w-auto" style='border-radius: 10px; font-size: 13px;' data-field='operator'>
                <option value='AND'>AND</option>
                <option value='OR'>OR</option>
            </select>
        `);

        // Next row id
        const newId = GenerateUUID();

        // Add removeRow button
        button.insertAdjacentHTML('beforebegin', /*html*/ `
            <button type="button" class="btn btn-robi p-1 ml-2 remove-row">
                <svg class="icon" style="font-size: 22px; fill: ${App.get('primaryColor')}"><use href="#icon-bs-dash-circle-fill"></use></svg>
            </button>
        `);
        component.find(`.search-row[data-rowid='${id}'] .remove-row`).addEventListener('click', () => removeRow(id, newId));

        // Remove addRow button
        button.remove();

        // Add row
        component.find('.search-container').style.height = `${component.find('.search-container').getBoundingClientRect().height + 41.5}px`;
        component.find('.run-search-container').insertAdjacentHTML('beforebegin', searchRow(newId));
        component.find(`.search-row[data-rowid='${newId}'] .add-row`).addEventListener('click', addRow);
    }
    
    function removeRow(btnRowId, removeRowId) {
        // Adjust height
        component.find('.search-container').style.height = `${component.find('.search-container').getBoundingClientRect().height - 41.5}px`;
        
        // Remove next row
        component.find(`.search-row[data-rowid='${removeRowId}']`).remove();

        // Remove operator
        component.find(`.search-row[data-rowid='${btnRowId}'] [data-field='operator']`).remove();

        // Add addRow button
        const button = component.find(`.search-row[data-rowid='${btnRowId}'] .remove-row`);
        button.insertAdjacentHTML('beforebegin', /*html*/ `
            <button type="button" class="btn btn-robi p-1 ml-2 add-row">
                <svg class="icon" style="font-size: 22px; fill: ${App.get('primaryColor')}"><use href="#icon-bs-plus"></use></svg>
            </button>
        `);
        component.find(`.search-row[data-rowid='${btnRowId}'] .add-row`).addEventListener('click', addRow);

        // Remove removeRow button
        button.remove();
    }

    function searchRow(id) {
        return /*html*/ `
            <!-- Row -->
            <div class='d-flex mb-2 search-row' data-rowid='${id}'>
                <!-- Column -->
                <div class="input-group mr-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Column</div>
                    </div>
                    <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='column'>
                        ${
                            listInfo.fields
                            .sort((a, b) => a.display - b.display)
                            .map(field => {
                                const { display, name } = field;
                                return /*html*/ `<option value='${name}'>${display || name}</option>`;
                            }).join('\n')
                        }
                    </select>
                </div>
                <!-- Condition -->
                <div class="input-group mr-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Condition</div>
                    </div>
                    <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='condition'>
                        <option value='contains'>contains</option>
                        <option value='equals'>equals</option>
                        <option value='not equal to'>not equal to</option>
                    </select>
                </div>
                <!-- Value -->
                <input type="text" class="form-control w-auto" style='flex: 2;' placeholder="value" data-field='value'>
                <!-- Add row -->
                <button type='button' class='btn btn-robi p-1 ml-2 add-row'>
                    <svg class="icon" style="font-size: 22px; fill: ${App.get('primaryColor')};"><use href="#icon-bs-plus"></use></svg>
                </button>
            </div>
        `;
    }

    function loadSearch(event) {
        const searchName = event.target.innerText;
        const filters = savedSearches.find(search => search.name == searchName)?.filters;

        // Set loaded
        loaded = searchName;

        // Set height
        // base height + (row height * number of rows ) 
        const height = 81.5 + (41.5 * filters.length);
        component.find('.search-container').style.height = `${height}px`;

        // Empty search
        component.findAll('.search-row').forEach(row => row.remove());

        // Add buttons
        const editSearchContainer = component.find('.edit-search-container');

        if (!editSearchContainer) {
            component.find('.load-search-container').insertAdjacentHTML('beforeend', /*html*/ `
                <!-- Buttons -->
                <div class='d-flex justify-content-end edit-search-container'>
                    <button type='button' class='btn btn-robi mr-2 delete-search'>
                        Delete
                    </button>
                    <div class='d-flex justify-content-end'>
                        <button type='button' class='btn btn-robi new-search'>New</button>
                    </div>
                </div>
            `);

            // Add event listerners
            component.find('.edit-search-container .delete-search').addEventListener('click', deleteSearch)
            component.find('.edit-search-container .new-search').addEventListener('click', newSearch)
        }

        // Add rows
        filters.forEach(row => {
            const { column, condition, value, operator } = row;
            const id = GenerateUUID();

            const html = /*html*/ `
                <!-- Row -->
                <div class='d-flex mb-2 search-row' data-rowid='${id}'>
                    <!-- Column -->
                    <div class="input-group mr-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Column</div>
                        </div>
                        <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='column'>
                            ${
                                listInfo.fields
                                .sort((a, b) => a.display - b.display)
                                .map(field => {
                                    const { display, name } = field;
                                    return /*html*/ `<option value='${name}'${name === column ? ' selected' : ''}>${display || name}</option>`;
                                }).join('\n')
                            }
                        </select>
                    </div>
                    <!-- Condition -->
                    <div class="input-group mr-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Condition</div>
                        </div>
                        <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='condition'>
                            <option value='contains'${'contains' === condition ? ' selected' : ''}>contains</option>
                            <option value='equals'${'equals' === condition ? ' selected' : ''}>equals</option>
                            <option value='not equal to'${'not equal to' === condition ? ' selected' : ''}>not equal to</option>
                        </select>
                    </div>
                    <!-- Value -->
                    <input type="text" class="form-control w-auto" style='flex: 2;' placeholder="value" value='${value}' data-field='value'>
                    <!-- Operator -->
                    ${
                        operator ?
                        /*html*/ `
                            <select class="custom-select ml-2 w-auto" style='border-radius: 10px; font-size: 13px;' data-field='operator'>
                                <option value='AND'${'AND' === operator ? ' selected' : ''}>AND</option>
                                <option value='OR'${'OR' === operator ? ' selected' : ''}>OR</option>
                            </select>
                        ` : ''
                    }
                    <!-- Add row -->
                    <button type='button' class='btn btn-robi p-1 ml-2 ${operator ? 'remove-row' : 'add-row'}'>
                        <svg class="icon" style="font-size: 22px; fill: ${App.get('primaryColor')};"><use href="#icon-${operator ? 'bs-dash-circle-fill' : 'bs-plus'}"></use></svg>
                    </button>
                </div>
            `
            component.find('.run-search-container').insertAdjacentHTML('beforebegin', html);

            // Add event listeners
            if (operator) {
                component.find(`.search-row[data-rowid='${id}'] .remove-row`).addEventListener('click', () => removeRow(id));
            } else {
                component.find(`.search-row[data-rowid='${id}'] .add-row`).addEventListener('click', addRow);
            }

            component.find(`.search-row[data-rowid='${id}'] input[data-field='value']`).addEventListener('keypress', event => {
                if (event.key === 'Enter') {
                    event.preventDefault();

                    runSearch(event);
                }
            });
        });
    }

    function runSearch(button) {
        const filters = [...component.findAll('.search-container .search-row')].map(row => {
            // Column
            const column = row.querySelector('[data-field="column"]').value;

            // Condition
            const condition = row.querySelector('[data-field="condition"]').value;

            // Value
            const value = row.querySelector('[data-field="value"]').value;

            // Operator
            const operator = row.querySelector('[data-field="operator"]')?.value || null;

            // Type
            const type = listInfo.fields.find(field => field.name === column)?.type

            return {
                column,
                condition,
                value,
                operator,
                type
            }
        });

        search({
            button,
            filters
        });
    }

    function buildFilters() {
        return options.map((option, index) => {
            const { label } = option;
            return /*html*/ `
                <button type='button' class='btn ${index === 0 ? 'btn-robi-primary' : 'btn-outline-robi-primary'} filter'>${label}</button>
            `;
        }).join('\n');
    }

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function TaggleField(param) {
    const {
        label, description, fieldMargin, maxWidth, tags, onTagAdd, onTagRemove, parent, position,
    } = param;

    let taggle;

    const component = Component({
        html: /*html*/ `
            <div>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='taggle-container'></div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .taggle-container {
                position: relative;
                width: 100%;
                border-radius: 10px;
                border: 1px solid #ced4da;
                padding: 10px;
            }

            #id .taggle .close {
                text-shadow: none;
            }
        `,
        parent,
        position,
        events: [],
        onAdd() {
            // Initialize taggle
            taggle = new Taggle(component.find('.taggle-container'), {
                placeholder: 'Type then press enter to add tag',
                tags: tags ? tags.split(',') : [],
                duplicateTagClass: 'bounce',
                onTagAdd,
                onTagRemove
            });
        }
    });

    component.value = () => {
        return taggle.getTagValues().join(', ');
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function TasksList(param) {
    const {
        label, labelWeight, labelSize, options, onCheck, direction, wrap, parent, width, position, margin, padding, fieldMargin, onAddNewItem, onDelete
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
            /*css*/ `
                    #id .form-field-multi-select-row {
                        margin-left: 20px;
                        margin-bottom: 10px;
                    }
                ` :
                ''}

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
        let html = '';

        options.forEach(group => {
            const {
                title, items, align
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
            id, value, checked, CompletedBy, Completed
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
    };

    component.addOption = (param) => {
        const {
            option, group
        } = param;

        const container = component.find(`.form-field-multi-select-container[data-group='${group}']`);

        container.insertAdjacentHTML('beforeend', rowTemplate(option, group, true));

        const node = component.find(`input[data-group='${group}'][data-itemid='${itemToAdd.id}']`);

        if (node) {
            node.addEventListener('change', toggleSelectALL);
        }
    };

    component.addItemAbove = (param) => {
        const {
            group, itemToAdd, item
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
    };

    component.value = (type) => {
        const rows = component.findAll('.form-field-multi-select-row input:checked');

        return [...rows].map(item => {
            if (type === 'id') {
                return parseInt(item.dataset.itemid);
            } else {
                const value = item.closest('.form-field-multi-select-row').querySelector('.form-field-multi-select-value');

                return value.innerText;
            }
        });
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ThemeField(param) {
    const {
        label, margin, parent, position, selected
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                ${label !== false ? /*html*/ `<label>Theme</label>` : ''}
                <div class='themes'>
                    ${
                        Themes.map(theme => {
                            const { name, primary, secondary, background, color } = theme;

                            return /*html*/ `
                                <div class='theme-app ${name === selected ? 'selected' : ''}' style='color: ${color};' data-theme='${name}'>
                                    <div class='theme-sidebar' style='background: ${background};'>
                                        <div class='theme-sidebar-title'>Title</div>
                                        <div class='theme-nav selected' style='background: ${primary}; color: white;'>Selected</div>
                                        <div class='theme-nav'>Route</div>
                                    </div>
                                    <div class='theme-maincontainer' style='background: ${secondary};'>
                                        <div class='theme-title'>${name}</div>
                                    </div>
                                </div>
                            `
                        }).join('\n')
                    }
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            #id .themes {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }

            #id label {
                font-weight: 500;
            }

            #id .theme-app {
                cursor: pointer;
                display: flex;
                height: 150px;
                width: 200px;
                border-radius: 10px;
                border: solid 1px #d6d8db80;
            }

            #id .theme-app:not(:last-child) {
                /* margin-right: 15px; */
                margin-bottom: 15px;
            }
   
            #id .theme-app.selected {
                /* background: ${App.get('primaryColor') + '20'}; */
                box-shadow: 0px 0px 0px 4px ${App.get('primaryColor')};
            }

            #id .theme-sidebar {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                border-right: solid 1px #d6d8db80;
                border-radius: 10px 0px 0px 10px;
                flex: 1;
            }

            #id .theme-sidebar-title {
                margin: 8px 4px 0px 4px;
                padding: 0px 8px;
                font-weight: 700;
                font-size: 13px;
            }

            #id .theme-nav {
                margin: 0px 4px;
                padding: 2px 8px;
                border-radius: 6px;
                font-weight: 500;
                font-size: 11px;
            }

            #id .theme-nav.selected {
                margin: 4px;
            }

            #id .theme-maincontainer {
                flex: 2;
                border-radius: 0px 10px 10px 0px;
            }

            #id .theme-title {
                margin: 8px;
                font-weight: 700;
                font-size: 13px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .theme-app',
                event: 'click',
                listener(event) {
                    // Deselect all
                    component.findAll('.theme-app').forEach(node => {
                        node.classList.remove('selected');
                    });
                    
                    // Select
                    this.classList.add('selected');
                }
            }
        ]
    });

    // TODO: Set value
    component.value = () => {
        return component.find('.theme-app.selected')?.dataset.theme;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Timer(param) {
    const {
        parent, start, classes, stop, reset, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='timer ${classes?.join(' ')}'>
                <h5 class='mb-0'>Run action</h5>
                <div class='stopwatch' id='stopwatch'>00:00:00</div>
                <button class='btn btn-robi-success start'>Start</button>
                <button class='btn btn-robi-reverse stop'>Stop</button>
                <button class='btn btn-robi reset'>Reset</button>
            </div>
        `,
        style: /*css*/ `
            #id {
                padding: 20px;
                border-radius: 20px;
                background: ${App.get('backgroundColor')}
            }
            
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
            sec++;
            ms = 0;
        }

        if (sec === 60) {
            min++;
            sec = 0;
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
    };

    component.stop = () => {
        clearInterval(time);

        if (stop) {
            stop();
        }
    };

    component.reset = () => {
        ms = 0;
        sec = 0;
        min = 0;

        component.find('.stopwatch').innerHTML = '00:00:00';

        if (reset) {
            reset();
        }
    };

    return component;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Title(param) {
    const {
        back, title, width, subTitle, subTitleColor, breadcrumb, dropdownGroups, maxTextWidth, route, padding, margin, parent, position, date, type, action
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='title ${type || ''}'>
                <div class='title-subtitle'>
                    ${
                        back ? 
                        /*html*/ `
                            <div class='d-flex justify-content-center align-items-center' style='width: 62px; height: 35.59px; position: absolute; left: -62px; cursor: pointer;'>
                                <div class='d-flex justify-content-center align-items-center back-btn' style='' title='Back'>
                                    <svg class='icon' style='fill: ${App.get('primaryColor')}; font-size: 26px;'>
                                        <use href='#icon-bs-arrow-left-cirlce-fill'></use>
                                    </svg>
                                </div>
                            </div>
                        ` : ''
                    }
                    <h1 class='app-title'>${title}</h1>
                    <!-- ${subTitle !== undefined ? `<h2>${subTitle}</h2>` : ''} -->
                    <h2>${subTitle || ''}</h2>
                    ${breadcrumb !== undefined ?
                    /*html*/ `
                        <h2 ${dropdownGroups && dropdownGroups.length ? `style='margin-right: 0px;'` : ''}>
                            ${buildBreadcrumb(breadcrumb)}
                            ${dropdownGroups && dropdownGroups.length ? `<span class='_breadcrumb-spacer'>/</span>` : ''}
                            ${dropdownGroups && dropdownGroups.length ?
                            /*html*/ `
                                ${buildDropdown(dropdownGroups)}
                            ` :
                            ''}
                        </h2>
                    ` :
                    ''}
                </div>
                <!-- ${date !== undefined ? `<div class='title-date'>${date}</div>` : ''} -->
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
                padding: ${padding || '0px'};
                ${width ? `width: ${width};` : ''}
            }

            #id .title-subtitle {
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: baseline;
            }

            #id.title h1 {
                font-size: 1.75rem;
                font-weight: 700;
                margin-top: 0px;
                margin-bottom: 10px;
                cursor: ${action ? 'pointer' : 'auto'};
            }

            #id.title h2 {
                font-size: 1.1rem;
                font-weight: 500;
                margin: 0px;
                color: ${subTitleColor || App.get('defaultColor')};
            }

            #id.title .title-date {
                font-size: 13px;
                font-weight: 500;
                /* color: ${App.get('primaryColor')}; */
                color: #70767c;
                margin: 0px;
            }

            #id.title .title-date * {
                /* color: ${App.get('primaryColor')}; */
                color: #70767c;
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
                margin: 0px 20px;
            }

            /* a, spacer */
            #id a:not(.alert-link),
            #id ._breadcrumb-spacer,
            #id ._breadcrumb {
                color: ${App.get('primaryColor')}
            }

            /** Breadcrumb */
            #id ._breadcrumb {
                color: darkslategray;
            }

            #id .route {
                cursor: pointer;
                color: ${App.get('primaryColor')};
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
                color: ${App.get('primaryColor')};
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
                selector: '#id .route',
                event: 'click',
                listener: goToRoute
            },
            {
                selector: '#id .app-title',
                event: 'click',
                listener(event) {
                    if (action) {
                        action(event);
                    }
                }
            },
            {
                selector: '#id .back-btn',
                event: 'click',
                listener(event) {
                    history.back();
                }
            }
        ]
    });

    function buildBreadcrumb(breadcrumb) {
        if (!Array.isArray(breadcrumb)) {
            return '';
        }

        return breadcrumb.map(part => {
            const {
                label, path, currentPage
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
            name, dataName, items
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
                label, path
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
            name, replaceWith
        } = param;

        const node = component.find(`span[data-name='${name}']`);

        if (node) {
            node.insertAdjacentHTML('afterend', dropdownTemplate(replaceWith));

            component.findAll(`span[data-name='${replaceWith.dataName || replaceWith.name}'] .route`).forEach(route => {
                route.addEventListener('click', goToRoute);
            });

            node.remove();
        }
    };

    component.setDisplayText = (text) => {
        const title = component.find('h1');

        title.innerHTML = text;
    };

    component.setSubtitle = (text) => {
        const title = component.find('h2');

        title.innerHTML = text;
    };

    component.setDate = (text) => {
        const title = component.find('.title-date');

        title.innerHTML = text;
    };

    return component;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Toast(param) {
    const {
        text, type, delay, parent, position
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
        events: [],
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
 */
export async function Unauthorized(param) {
    const { parent } = param;

    const viewTitle = Title({
        title: `403`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const alertBanner = Alert({
        type: 'warning',
        text: `Sorry! You don't have access to this page. Please select a different option from the menu on the left.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}

/**
 *
 * @param {*} param
 */
export function UpgradeAppButton(param) {
    const {
        parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='dev-console'>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Upgrade Robi</div>
                            <div class='dev-console-description'>Install the latest Robi build.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi dev-console-button upgrade'>Upgrade ${App.get('name')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                padding: 0px;
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
                background: ${App.get('backgroundColor')};
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
                padding: 10px;
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
                selector: '#id .upgrade',
                event: 'click',
                async listener(event) {
                    console.log('Upgrade app');

                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        async addContent(modalBody) {
                            modalBody.classList.add('install-modal');

                            // Show loading
                            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='loading-spinner w-100 d-flex flex-column justify-content-center align-items-center'>
                                    <div class="mb-2" style='font-weight: 600; color: darkgray'>Upgrade Robi</div>
                                    <div class="spinner-grow" style='color: darkgray' role="status"></div>
                                </div>
                            `);
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
export function UploadButton(param) {
    const {
        action, parent, position, margin, type, value
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

/**
 *
 * @param {*} param
 * @returns
 */
export async function Users(param) {
    const { parent, itemId } = param;

    /** Authorize */
    const isAuthorized = Authorize('Users');

    if (!isAuthorized) {
        return;
    }

    const viewTitle = Title({
        title: 'Users',
        date: `${new Date().toLocaleString('default', {
            dateStyle: 'full'
        })}`,
        type: 'across',
        parent
    });

    viewTitle.add();

    const usersTable = await Table({
        list: 'Users',
        heading: '',
        view: 'Users',
        formView: 'All',
        newForm: NewUser,
        parent
    });

    /** Open modal */
    if (itemId) {
        const row = usersTable.findRowById(itemId);

        if (row) {
            if (row.show) {
                row.show().draw(false).node().click();
            } else {
                row.draw(false).node().click();
            }
        }
    }
}

/**
 *
 * @param {*} param
 * @returns
 */
export function ViewContainer(param) {
    const {
        parent
    } = param;

    // Collapse container height
    const padding = '62px';

    const component = Component({
        html: /*html*/ `
            <div class='viewcontainer'></div>
        `,
        style: /*css*/ `
            .viewcontainer {
                position: relative;
                padding: ${padding};
                height: 100vh;
                overflow: overlay;
            }

            .viewcontainer.dim {
                filter: blur(25px);
                user-select: none;
                overflow: hidden,
            }
        `,
        parent,
        events: []
    });

    component.dim = (toggle) => {
        const viewContainer = component.get();

        if (toggle) {
            viewContainer.classList.add('dim');
        } else {
            viewContainer.classList.remove('dim');
        }
    };

    component.paddingOff = () => {
        component.get().style.padding = '0px';
    };

    component.paddingOn = () => {
        component.get().style.padding = padding;
    };

    component.eventsOff = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'none';
        });
    };

    component.eventsOn = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'initial';
        });
    };
    return component;
}
