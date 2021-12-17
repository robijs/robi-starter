import { Component } from '../Actions/Component.js'

// @START-File
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
// @END-File
