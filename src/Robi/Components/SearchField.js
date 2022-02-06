import { App } from '../Core/App.js';

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export function SearchField(param) {
    const {
        margin, parent, onFilter, onSearch, onClear, onSelect, position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div>
                <!-- <input class='form-control mr-sm-2' type='search' data-toggle='dropdown' placeholder='Search markets and facilites' aria-label='Search'> -->
                <div class='toggle-search-list' data-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                    <input class='form-control mr-sm-2' type='search' placeholder='Search markets & facilities' aria-label='Search'>
                </div>
                <div class='dropdown-menu'>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
            }

            #id .form-inline {
                flex-flow: initial;
            }

            #id input[type='search'] {
                width: 100%;
                border-radius: .25rem;
                font-size: 13px;
                border: none;
                background: var(--button-background);
            }

            #id input[type='search']::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 20px;
                width: 20px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill=''><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
            }

            /** Override Bootstrap input element active/focus style */
            #id input:active,
            #id input:focus {
                outline: none;
                border: none;
                box-shadow: none;
            }

            /** Dropdown */
            #id .dropdown-header {
                color: var(--primary)
            }

            #id .dropdown-menu {
                margin-top: 5px;
                max-height: 50vh;
                overflow-y: overlay;
                /* box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 2%) 0px 0px 0px 1px; */
                box-shadow: rgb(0 0 0 / 16%) 0px 10px 36px 0px, rgb(0 0 0 / 2%) 0px 0px 0px 1px;
                border: none;
            }

            #id .dropdown-menu::-webkit-scrollbar-track {
                background: white;
            }
            
            #id .dropdown-item {
                cursor: pointer;
                font-size: 13px;
            }

            #id .dropdown-item:focus,
            #id .dropdown-item:hover {
                color: #16181b;
                text-decoration: none;
                background-color: rgba(${App.get('primaryColorRGB')}, .1);
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .toggle-search-list`,
                event: 'keydown',
                listener(event) {
                    console.log(event.key);

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

                    onSearch(event.target.value.toLowerCase());
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

                    if (event.key === 'Enter') {
                        onSelect(event);
                    }
                }
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'click',
                listener(event) {
                    onSelect(event);
                }
            }
        ]
    });

    function dropdownItemTemplate(item) {
        const {
            label, path
        } = item;

        return /*html*/ `
            <a href='javascript:void(0)' class='dropdown-item' data-path='${path}'>${label}</a>
        `;
    }

    return component;
}
// @END-File
