import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function DashboardBanner(param) {
    const {
        margin, padding, parent, data, background, position, width, weight
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='dashboard-banner'>
                ${buildDashboard()}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
                padding: ${padding || '0px'};
                background: ${background || 'var(--secondary)'};
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                ${width ? `width: ${width};` : ''}
            }

            #id .dashboard-banner-group {
                background-color: var(--background);
                color: var(--color);
                min-height: 88px;
                flex: 1;
                padding: 8px;
                border-radius: 8px;
                font-weight: ${weight || 'normal'};
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            #id .dashboard-banner-group.selected {
                background: var(--button-background) !important;
            }

            #id .dashboard-banner-group:not(:last-child) {
                margin-right: 10px;
            }

            #id .dashboard-banner-group[data-action='true'] {
                cursor: pointer;
            }

            #id .dashboard-banner-label,
            #id .dashboard-banner-value,
            #id .dashboard-banner-description {
                transition: opacity 500ms ease;
            }

            #id .dashboard-banner-label,
            #id .dashboard-banner-description {
                white-space: nowrap;
                font-size: 13px;
            }

            #id .dashboard-banner-value {
                white-space: nowrap;
                font-size: 22px;
                font-weight: 600;
            }

            #id .opacity-0 {
                opacity: 0;
            }

            #id .opacity-1 {
                opacity: 0;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: `#id .dashboard-banner-group[data-action='true']`,
                event: 'click',
                listener(event) {
                    const item = data.find(item => item.label === this.dataset.label);

                    item?.action(item);
                }
            }
        ]
    });

    function buildDashboard() {
        let html = '';

        data.forEach(item => {
            const {
                label, value, description, action, color, background, loading, hide
            } = item;

            html += /*html*/ `
                <div class='dashboard-banner-group ${loading ? 'shimmer' : ''}' ${background ? `style='background: ${background};'` : ''} data-label='${label}' data-action='${action ? 'true' : 'false'}'>
                    <div class='dashboard-banner-label ${hide ? 'opacity-0' : ''}' ${color ? `style='background: ${color};'` : ''}>${label}</div>
                    <div class='dashboard-banner-value ${hide ? 'opacity-0' : ''}' ${color ? `style='background: ${color};'` : ''}>${value || ''}</div>
                    <div class='dashboard-banner-description ${hide ? 'opacity-0' : ''}' ${color ? `style='background: ${color};'` : ''}>${description || ''}</div>
                </div>
            `;
        });

        return html;
    }

    component.group = (label) => {
        const group = component.find(`.dashboard-banner-group[data-label='${label}']`);

        if (group) {
            return {
                group,
                data: {
                    label: group.querySelector('.dashboard-banner-label').innerHTML,
                    value: group.querySelector('.dashboard-banner-value').innerHTML,
                    description: group.querySelector('.dashboard-banner-description').innerHTML
                }
            };
        }
    };

    component.select = (label) => {
        component.find(`.dashboard-banner-group[data-label='${label}']`)?.classList.add('selected');
    };

    component.deselect = (label) => {
        component.find(`.dashboard-banner-group[data-label='${label}']`)?.classList.remove('selected');
    };

    component.deselectAll = () => {
        component.findAll(`.dashboard-banner-group`).forEach(group => group?.classList.remove('selected'));
    };

    component.update = (groups) => {
        groups.forEach(item => {
            const {
                label, value, description,
            } = item;

            component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-label`)?.classList.remove('opacity-0');

            const valueField = component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-value`);

            if (valueField && value !== undefined) {
                valueField.innerText = value;
                valueField.classList.remove('opacity-0');
            }

            const descriptionField = component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-description`);

            if (descriptionField && description !== undefined) {
                descriptionField.innerText = description;
                descriptionField.classList.remove('opacity-0');
            }
        });
    };

    return component;
}
// @END-File
