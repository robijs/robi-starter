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
// @END-File