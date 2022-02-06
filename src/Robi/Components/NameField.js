import { Component } from '../Actions/Component.js'
import { Route } from '../Actions/Route.js'
import { GetSiteUsers } from '../Actions/GetSiteUsers.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function NameField(param) {
    const {
        label, description, fieldMargin, parent, position, onSelect, onClear, onSearch
    } = param;

    /*
        <!--<div class='dropdown-menu show' style='position: absolute; width: ${width}px; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, ${height + 5}px);'>
            <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                <div style='color: var(--primary);'>Searching...</div>
                <div class='spinner-grow spinner-grow-sm' style='color: var(--primary);' role='status'></div>
            </div> 
        </div> -->
    */
    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description'>${description}</div>` : ''}
                <div class=''>
                    <div class='toggle-search-list' data-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                        <input class='form-field-name form-control mr-sm-2' type='search' placeholder='Search' aria-label='Search'>
                    </div>
                    <div class='dropdown-menu'>
                        <!-- Show search spinner by -->
                        <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                            <div style='color: var(--primary);'>Searching...</div>
                            <div class='spinner-grow spinner-grow-sm' style='color: var(--primary); font-size: 13px;' role='status'></div>
                        </div> 
                        <!-- <a href='javascript:void(0)' class='dropdown-item' data-path=''>
                            <span class='searching'>
                                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> 
                                Searching for CarePoint accounts...
                            <span>
                        </a> -->
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            /* Labels */
            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: .9em;
                padding: 5px 0px;
            }

            #id .form-field-name {
                margin-top: 2px;
                margin-bottom: 4px;
                margin-right: 20px;
                min-height: 36px;
                min-width: 300px;
                padding: 5px 10px;
                background: white;
                border-radius: 4px;
            }

            #id .form-field-name::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 16px;
                width: 16px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill=''><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
            }

            #id .form-field-name:active,
            #id .form-field-name:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px var(--primary);
            }

            /** Errors */
            #id span.alert-link:hover {
                cursor: pointer;
                text-decoration: underline;
            }

            /** Dropdown */
            #id .dropdown-menu {
                padding: 0px;
                overflow-y: overlay;
            }

            #id .dropdown-item-container {
                overflow-y: overlay;
            }

            #id .dropdown-menu a {
                outline: none;
                border: none;
            }
            
            #id .dropdown-item,
            #id .dropdown-item:focus,
            #id .dropdown-item:active, {
                cursor: pointer;
                outline: none;
                border: none;
            }

            /* Scroll container */
            #id .scroll-container {
                max-height: 300px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: `#id .toggle-search-list`,
                event: 'keydown',
                listener(event) {
                    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !component.find('.dropdown-menu').classList.contains('show')) {
                        event.preventDefault();
                        event.stopPropagation();

                        return false;
                    }
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    if (!event.target.value) {
                        if (component.find('.dropdown-menu').classList.contains('show')) {
                            component.find('.toggle-search-list').click();
                        }

                        return;
                    }

                    /** Show dropdown menu  */
                    if (!component.find('.dropdown-menu').classList.contains('show')) {
                        component.find('.toggle-search-list').click();
                    }

                    /** Get menu node */
                    const menu = component.find('.dropdown-menu');

                    /** Reset list */
                    menu.innerHTML = /*html*/ `
                        <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                            <div style='color: var(--primary); font-size: 13px;'>Searching...</div>
                            <div class='spinner-grow spinner-grow-sm' style='color: var(--primary);' role='status'></div>
                        </div>
                        <!-- <a href='javascript:void(0)' class='dropdown-item' data-path=''>
                            <span class='searching'>
                                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> 
                                Searching for CarePoint accounts...
                            <span>
                        </a> -->
                    `;

                    /** Search accounts */
                    searchSiteUsers(event);
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'click',
                listener(event) {
                    event.stopPropagation();
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'keydown',
                listener(event) {
                    if (event.key === 'Escape' || event.key === 'Backspace') {
                        component.find('.toggle-search-list').click();
                        component.find(`input[type='search']`).focus();

                        event.preventDefault();

                        return false;
                    }
                }
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'click',
                listener(event) {
                    /** Set input value */
                    component.find('.form-field-name').value = event.target.innerText;

                    /** Get item */
                    const item = data.find(user => user.info.Account === event.target.dataset.account);

                    /** Call passed in onSelect function */
                    onSelect({
                        event,
                        users: item.Info
                    });
                }
            }
        ]
    });

    /** Dropdown */
    function dropdownItemTemplate(item) {
        const {
            value, info
        } = item;

        const {
            Account
        } = info;

        return /*html*/ `
            <a href='javascript:void(0)' class='dropdown-item' data-account='${Account}'>${value}</a>
        `;
    }

    component.showSearchList = (param) => {
        const {
            items
        } = param;

        /** Get menu node */
        const menu = component.find('.dropdown-menu');

        /** Check if items exist*/
        if (items.length > 0) {
            /** Show if not open  */
            if (!menu.classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }

            menu.innerHTML = /*html*/ `
                <div class='dropdown-item-container'>
                    <div class='scroll-container'>
                        ${items.map(item => dropdownItemTemplate(item)).join('\n')}
                    </div>
                </div>
            `;
        } else {
            if (menu.classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }
        }
    };

    /** Search site users */
    let queries = [];
    let data = [];

    async function searchSiteUsers(event) {
        event.preventDefault();

        /** Abort previous queries */
        queries.forEach(query => {
            query.abortController.abort();
        });

        const query = event.target.value.toLowerCase();

        if (query === '') {
            event.target.dataset.itemid = '';

            // resetMenu();
            // removeSpinner();
            console.log('reset');

            return;
        }

        removeNonefoundMessage();
        // addSpinner();
        const newSearch = GetSiteUsers({
            query
        });

        queries.push(newSearch);

        // console.log(newSearch);

        const response = await newSearch.response;

        if (response) {
            console.log(response);

            data = response.map(user => {
                const {
                    Name
                } = user;

                return {
                    value: Name,
                    info: user
                };
            });

            if (data.length > 0) {
                // removeSpinner();
                // addDropDownMenu(event, data);
                component.showSearchList({
                    items: data
                });
            } else {
                // removeSpinner();
                addNoneFoundMessage();
            }
        }
    }

    /** Add none found message */
    function addNoneFoundMessage() {
        console.log('none found');

        // const message = component.find('.none-found');

        // if (!message) {
        //     const html = /*html*/ `
        //         <span class='none-found' style='color: firebrick;'>
        //             No accounts found that match this name.
        //         </span>
        //     `;

        //     component.get().insertAdjacentHTML('beforeend', html);
        // }
    }

    /** Remove none found message */
    function removeNonefoundMessage() {
        const message = component.find('.none-found');

        if (message) {
            message.remove();
        }
    }

    component.focus = () => {
        const field = component.find('.form-field-name');

        setTimeout(() => {
            field.focus();
        }, 0);
    };

    component.addError = (param) => {
        /** Remove previous errors */
        component.removeError();

        /** Param can be a string or an object */
        let text = typeof param === 'object' ? param.text : param;

        /** Build error HTML */
        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ?
            /*html*/ ` 
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                    `
                : ''}
            </div>
        `;

        /** Add HTML to DOM */
        component.find('.form-field-name').insertAdjacentHTML('beforebegin', html);

        /** Add Event Listeners to embedded links */
        component.findAll('.alert .alert-link').forEach(link => {
            link.addEventListener('click', event => {
                if (event.target.dataset.route) {
                    Route(event.target.dataset.route);
                }
            });
        });
    };

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    };

    component.value = (param) => {
        const nameField = component.find(`.form-field-name`);

        if (param) {
            nameField.innerText = param;
        } else if (param === '') {
            nameField.innerText = '';
        } else {
            const nameAndAccount = nameField.innerText.replace(' (US)', '').split(' - ');
            const fullName = nameAndAccount[0];
            const nameParts = fullName.split(', ');
            const lastName = nameParts[0];
            const firstNameParts = nameParts[1].split(' ');
            const firstName = firstNameParts[0];
            const command = firstNameParts[firstNameParts.length - 1];
            const accountParts = nameAndAccount[1].split('\\');
            const domain = accountParts[0];
            const account = accountParts[1];

            return {
                fullName,
                lastName,
                firstName,
                domain,
                account,
                command
            };
        }
    };

    return component;
}
// @END-File
