import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Title(param) {
    const {
        back,
        title,
        width,
        subTitle,
        subTitleColor,
        breadcrumb,
        dropdownGroups,
        maxTextWidth,
        route,
        padding,
        margin,
        parent,
        position,
        action
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='title across'>
                <div class='title-subtitle'>
                    ${
                        back ? 
                        /*html*/ `
                            <div class='d-flex justify-content-center align-items-center' style='width: 62px; height: 35.59px; position: absolute; left: -62px; cursor: pointer;'>
                                <div class='d-flex justify-content-center align-items-center back-btn' style='' title='Back'>
                                    <svg class='icon' style='fill: var(--primary); font-size: 26px;'>
                                        <use href='#icon-bs-arrow-left-cirlce-fill'></use>
                                    </svg>
                                </div>
                            </div>
                        ` : ''
                    }
                    <h1 class='app-title'>${title}</h1>
                    <!-- ${subTitle !== undefined ? `<h2>${subTitle}</h2>` : ''} -->
                    <h2>${subTitle || ''}</h2>
                    ${breadcrumb !== undefined ?
                    /*html*/ `
                        <h2 ${dropdownGroups && dropdownGroups.length ? `style='margin-right: 0px;'` : ''}>
                            ${buildBreadcrumb(breadcrumb)}
                            ${dropdownGroups && dropdownGroups.length ? `<span class='_breadcrumb-spacer'>/</span>` : ''}
                            ${dropdownGroups && dropdownGroups.length ?
                            /*html*/ `
                                ${buildDropdown(dropdownGroups)}
                            ` :
                            ''}
                        </h2>
                    ` :
                    ''}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
                padding: ${padding || '0px'};
                ${width ? `width: ${width};` : ''}
            }

            #id .title-subtitle {
                width: 100%;
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: baseline;
            }

            #id.title h1 {
                font-size: 1.75rem;
                font-weight: 700;
                margin-top: 0px;
                margin-bottom: 10px;
                cursor: ${action ? 'pointer' : 'auto'};
            }

            #id.title h2 {
                width: 100%;
                font-size: 1.1rem;
                font-weight: 500;
                margin: 0px;
                color: ${subTitleColor || 'var(--color)'};
            }

            #id.title .title-date {
                font-size: 13px;
                font-weight: 500;
                /* color: var(--primary); */
                color: #70767c;
                margin: 0px;
            }

            #id.title .title-date * {
                /* color: var(--primary); */
                color: #70767c;
            }

            #id.across {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: baseline;
                flex-wrap: wrap;
                white-space: nowrap;
            }

            #id.across h2 {
                margin-left: 20px;
            }

            /* a, spacer */
            #id a:not(.alert-link),
            #id ._breadcrumb-spacer,
            #id ._breadcrumb {
                color: var(--primary)
            }

            /** Breadcrumb */
            #id ._breadcrumb {
                color: darkslategray;
            }

            #id .route {
                cursor: pointer;
                color: var(--primary);
            }

            #id .current-page {
                color: darkslategray;
            }

            /** Dropdown */
            #id .dropdown-menu {
                margin-top: 5px;
                max-height: 75vh;
                overflow-y: auto;
            }

            #id .dropdown-item {
                cursor: pointer;
                font-size: 14px;
            }

            #id .nav {
                display: inline-flex;
            }

            #id .nav-link {
                padding: 0px;
                overflow: hidden;
                text-overflow: ellipsis;
                /** max-width: ${maxTextWidth || '455px'}; **/
                line-height: normal;
            }

            #id .nav-pills .show > .nav-link {
                color: var(--primary);
                background-color: initial;
            }

            #id .no-menu [role=button] {
                cursor: initial;
            }

            #id .no-menu .dropdown-toggle,
            #id .no-menu .nav-pills .show > .nav-link {
                color: var(--primary);
            }

            #id .no-menu .dropdown-toggle::after {
                display: none;
            }

            #id .no-menu .dropdown-menu {
                display: none;
            }

            @media (max-width: 1024px) {
                #id.across h2 {
                    margin: 0px 45px;
                }

                #id .nav-link {
                    max-width: 200px;
                }
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .route',
                event: 'click',
                listener: goToRoute
            },
            {
                selector: '#id .app-title',
                event: 'click',
                listener(event) {
                    if (action) {
                        action(event);
                    }
                }
            },
            {
                selector: '#id .back-btn',
                event: 'click',
                listener(event) {
                    history.back();
                }
            }
        ]
    });

    function buildBreadcrumb(breadcrumb) {
        if (!Array.isArray(breadcrumb)) {
            return '';
        }

        return breadcrumb.map(part => {
            const {
                label, path, currentPage
            } = part;

            return /*html*/ `
                <span class='_breadcrumb ${currentPage ? 'current-page' : 'route'}' data-path='${path}'>${label}</span>
            `;
        }).join(/*html*/ `
            <span class='_breadcrumb-spacer'>/</span>
        `);
    }

    function buildDropdown(dropdownGroups) {
        return dropdownGroups
            .map(dropdown => dropdownTemplate(dropdown))
            .join(/*html*/ `
            <span class='_breadcrumb-spacer'>/</span>
        `);
    }

    function dropdownTemplate(dropdown) {
        const {
            name, dataName, items
        } = dropdown;

        let html = /*html*/ `
            <span data-name='${dataName || name}' class='${items.length === 0 ? 'no-menu' : ''}'>
                <ul class='nav nav-pills'>
                    <li class='nav-item dropdown'>
                        <a class='nav-link dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'>${name}</a>
                        <div class='dropdown-menu'>
        `;

        items.forEach(part => {
            const {
                label, path
            } = part;

            html += /*html*/ `
                <span class='dropdown-item route' data-path='${path}'>${label}</span>
            `;
        });

        html += /*html*/ `
                        </div>
                    </li>
                </ul>
            </span>
        `;

        return html;
    }

    function goToRoute(event) {
        if (route) {
            console.log(event.target.dataset.path);

            route(event.target.dataset.path);
        }
    }

    /** Only works if dropdown already exists */
    component.updateDropdown = (param) => {
        const {
            name, replaceWith
        } = param;

        const node = component.find(`span[data-name='${name}']`);

        if (node) {
            node.insertAdjacentHTML('afterend', dropdownTemplate(replaceWith));

            component.findAll(`span[data-name='${replaceWith.dataName || replaceWith.name}'] .route`).forEach(route => {
                route.addEventListener('click', goToRoute);
            });

            node.remove();
        }
    };

    component.setTitle = (text) => {
        const title = component.find('h1');

        title.innerHTML = text;
    };

    component.setSubtitle = (text) => {
        const title = component.find('h2');

        title.innerHTML = text;
    };

    component.setDate = (text) => {
        const title = component.find('.title-date');

        title.innerHTML = text;
    };

    return component;
}
// @END-File
