import { Component } from '../Actions/Component.js'
import { DeleteApp } from '../Actions/DeleteApp.js'
import { UpdateApp } from '../Actions/UpdateApp.js'
import { ResetApp } from '../Actions/ResetApp.js'
import { ReinstallApp } from '../Actions/ReinstallApp.js'
import { ModifyFile } from '../Actions/ModifyFile.js'
import { CheckLists } from '../Actions/CheckLists.js'
import { App } from '../Core/App.js'

// @START-File
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
                    <div style='margin-bottom: 20px; background: var(--background); border-radius: 20px;'>
                        <div class='dev-console-row'>
                            <div class='dev-console-text'>
                                <div class='dev-console-label'>Edit settings</div>
                                <div class='dev-console-description'>Edit app initialization settings right in the browser</div>
                            </div>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-robi dev-console-button modify-app'>Settings</button>
                            </div>
                        </div>
                        <div class='dev-console-row update-row'>
                            <div class='dev-console-text'>
                                <div class='dev-console-label'>Sync lists</div>
                                <div class='dev-console-description'>Sync app with list schemas</div>
                            </div>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-robi dev-console-button update'>Sync lists</button>
                            </div>
                        </div>
                        <div class='dev-console-row'>
                            <div class='dev-console-text'>
                                <div class='dev-console-label'>Refresh lists</div>
                                <div class='dev-console-description'>Delete and recreate select lists. All items from selected lists will be deleted.</div>
                            </div>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-robi dev-console-button reset'>Choose lists</button>
                            </div>
                        </div>
                        <div class='dev-console-row'>
                            <div class='dev-console-text'>
                                <div class='dev-console-label'>Reset</div>
                                <div class='dev-console-description'>Reset all lists and settings. All items will be deleted.</div>
                            </div>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-robi dev-console-button reinstall'>Reset all lists and settings</button>
                            </div>
                        </div>
                    </div>
                    <div class='dev-console-row alert-robi-secondary'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Backup</div>
                            <div class='dev-console-description'>Download a backup of all lists, settings, and source code. You can use backups to reinstall the app or port it to another site.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi dev-console-button delete'>Backup lists, data, and code</button>
                        </div>
                    </div>
                    <div class='dev-console-row alert-robi-primary'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Delete everything</div>
                            <div class='dev-console-description'>Delete all lists and settings. All items will be deleted. You can install the app again later.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi-reverse dev-console-button delete'>Delete all lists and data</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
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
                border-radius: 20px;
                padding: 20px 30px;
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

            /* Changed */
            #id .changed {
                /* border-radius: 20px;
                position: absolute;
                width: 100%;
                left: 0px;
                top: 45px;*/
                border-radius: 20px;
                position: absolute;
                width: 300px;
                right: 30px;
                top: 80%;
                text-align: center;
            }

            #id .changed-text {
                font-size: 13px;
                font-weight: 500;
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
            component.find('.update-row .dev-console-button').parentNode.insertAdjacentHTML('beforeend', /*html*/ `
                <div class='changed'>
                    <div class="spinner-grow text-robi" style='width: 16px; height: 16px;'>
                        <span class="sr-only">Checking on list changes...</span>
                    </div>
                </div>
            `);

            if (App.isProd()) {
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
// @END-File
