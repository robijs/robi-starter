import { Component } from '../Actions/Component.js'
import { AttachFiles } from '../Actions/AttachFiles.js'
import { App } from '../Core/App.js';

// @START-File
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
                color: var(--secondary);
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
// @END-File
