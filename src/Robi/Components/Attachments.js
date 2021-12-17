import { Component } from '../Actions/Component.js'
import { DeleteAttachments } from '../Actions/DeleteAttachments.js'
import { App } from '../Core/App.js';

// @START-File
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
// @END-File
