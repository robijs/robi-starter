import { Component } from '../Actions/Component.js'
import { DeleteItem } from '../Actions/DeleteItem.js'
import { App } from '../Core/App.js';

// @START-File
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
                stroke: var(--color);
                fill: var(--color)
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
                color: var(--secondary);
                background: var(--primary);
                border: solid 2px var(--primary);
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
// @END-File
