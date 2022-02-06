import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
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
                background: var(--background);
                border-radius: 10px;
            }
            
            #id .loading-bar-status {
                width: 0%;
                height: 15px;
                background: ${primary || 'var(--primary)'};
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
// @END-File
