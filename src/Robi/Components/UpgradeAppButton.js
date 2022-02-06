import { Component } from '../Actions/Component.js'
import { Modal } from './Modal.js'
import { App } from '../Core/App.js'

// TODO: Add async call to look up latest robi build, add red dot if out-of-date
// @START-File
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
                width: 100%;
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
                /* border: solid 2px var(--primary); */
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
                background: var(--background);
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
                        close: true,
                        async addContent(modalBody) {
                            modalBody.classList.add('install-modal');

                            // Show loading
                            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='alert alert-robi-primary mb-0'>
                                    Comming soon. Stay tuned!
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
// @END-File
