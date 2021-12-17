import { Component } from '../Actions/Component.js'

// @START-File
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
// @END-File
