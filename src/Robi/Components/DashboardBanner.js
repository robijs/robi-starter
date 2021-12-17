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
        margin, padding, border, parent, data, background, position, width, weight
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='dashboard-banner'>
                ${buildDashboard()}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '10px'};
                padding: ${padding || '8px'};
                background: ${background || 'white'};
                border-radius: 8px;
                border: ${border || App.get('defaultBorder')};
                display: flex;
                justify-content: space-between;
                /* overflow: overlay; */ /* FIXME: overflow causes flashing on fast viewport width changes */
                ${width ? `width: ${width};` : ''}
            }

            #id .dashboard-banner-group {
                flex: 1;
                padding: 8px;
                border-radius: 8px;
                font-weight: ${weight || 'normal'};
                display: flex;
                flex-direction: column;
                align-items: center;
                /* justify-content: center; */
            }

            #id .dashboard-banner-group.selected {
                background: #e9ecef !important;
            }

            #id .dashboard-banner-group:not(:last-child) {
                margin-right: 10px;
                /* margin-right: 20px; */
            }

            #id .dashboard-banner-group[data-action='true'] {
                cursor: pointer;
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
                label, value, description, action, color, background
            } = item;

            html += /*html*/ `
                <div class='dashboard-banner-group' style='background: ${background || 'transparent'}' data-label='${label}' data-action='${action ? 'true' : 'false'}'>
                    <div class='dashboard-banner-label' style='color: ${color || App.get('defaultColor')}'>${label}</div>
                    <div class='dashboard-banner-value' style='color: ${color || App.get('defaultColor')}'>${value}</div>
                    <div class='dashboard-banner-description' style='color: ${color || App.get('defaultColor')}'>${description || ''}</div>
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

            const valueField = component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-value`);

            if (valueField && value !== undefined) {
                valueField.innerText = value;
            }

            const descriptionField = component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-description`);

            if (descriptionField && description !== undefined) {
                descriptionField.innerText = description;
            }
        });
    };

    return component;
}
// @END-File
