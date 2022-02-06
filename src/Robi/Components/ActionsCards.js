import { ActionsEditor } from './ActionsEditor.js'
import { Get } from '../Actions/Get.js'
import { HTML } from '../Actions/HTML.js'
import { Store } from '../Core/Store.js'
import { Style } from '../Actions/Style.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function ActionsCards({ parent, path }) {
    let userSettings = JSON.parse(Store.user().Settings);
    let myActions = userSettings.actions || [];
    const sharedActions = await Get({
        list: 'Actions'
    });

    Style({
        name: 'action-cards',
        style: /*css*/ `
            .actions-title {
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 20px;
            }

            .action-card-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, 150px); /* passed in size or 22 plus (15 * 2 for padding) */
                justify-content: space-between;
                width: 100%;
            }

            .action-card {
                cursor: pointer;
                height: 150px;
                width: 150px;
                border-radius: 20px;
                background: var(--background);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                font-weight: 500;
            }

            .action-btn {
                margin-right: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 32px;
                height: 32px;
                cursor: pointer;
            }

            .action-btn .icon {
                fill: var(--primary);
            }
        `
    });

    // My Actions
    parent.append(/*html*/ `
        <div class='actions-title'>My Actions</div>
        <div class='action-card-container'>
            ${
                HTML({
                    items: myActions,
                    each(item) {
                        const { Name, FileNames } = item;
                        
                        return /*html*/ `
                            <div class='action-card' data-files='${FileNames}'>${Name}</div>
                        `
                    }
                })
            }
        </div>
    `);

    parent.findAll('.action-card').forEach(card => {
        card.addEventListener('click', event => {
            parent.empty();

            ActionsEditor({ parent, files: event.target.dataset.files });
        });
    });
}
// @END-File
