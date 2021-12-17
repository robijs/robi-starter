import { Component } from '../Actions/Component.js'
import { Route } from '../Actions/Route.js'
import { App } from '../Core/App.js'

// TODO: If selected group is hidden, scroll container
// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function SectionStepper(param) {
    const {
        title, sections, selected, route, padding, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='section-stepper'>
                ${title ? /*html*/ `<div class='section-title'>${title.text}</div>` : ''}
                <div class='section-title-group'>
                    <div class='section-group-container'>
                        ${createHTML()}
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Root */
            #id.section-stepper {
                display: flex;
                flex-direction: column;
                padding: ${padding || '0px'};
                border-radius: 10px;
                /* overflow: auto; */
            }

            #id .section-title-group {
                overflow: overlay;
                /* border-radius: 10px; */
            }

            /* Buttons */
            #id .btn-secondary {
                background: #dee2e6;
                color: #444;
                border-color: transparent;
            }

            /* Title */
            /* #id .section-title {
                font-size: 1em;
                font-weight: 700;
                text-align: center;
                background: #e9ecef;
                color: ${App.get('primaryColor')};
                border-radius: 10px;
                margin-bottom: 15px;
                padding: 10px;
                cursor: pointer;
            } */

            #id .section-title {
                font-size: 18px;
                font-weight: 700;
                color: ${App.get('primaryColor')};
                border-radius: 10px;
                padding: 8px 20px 10px 20px; /* -2px on top to align baseline with view title */
                cursor: pointer;
            }

            /* Sections */
            #id .section-group-container {
                font-weight: 500;
                padding: 0px;
                border-radius: 10px;
            }
            
            #id .section-group {
                cursor: pointer;
                display: flex;
                justify-content: flex-start;
                border-radius: 10px;
                width: 100%;
                padding: 10px 20px;
            }
            
            #id .section-group.selected {
                background: ${App.get('primaryColor')};
                color: white;
            }

            #id .section-group.selected * {
                color: white;
            }

            /* Number */
            #id .section-circle {
                color: ${App.get('primaryColor')};
            }

            /* Name */
            #id .section-name {
                width: 100%;
                white-space: nowrap;
                font-weight: 400;
            }

            #id .section-name-text {
                font-size: 15px;
                margin-left: 10px;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .section-group',
                event: 'click',
                listener(event) {
                    const path = this.dataset.path;
                    Route(`${route}/${path}`);
                }
            },
            {
                selector: '#id .section-title',
                event: 'click',
                listener(event) {
                    if (title && title.action) {
                        title.action(event);
                    }
                }
            }
        ]
    });

    function createHTML() {
        let html = '';

        sections.forEach((section, index) => {
            const {
                name, path
            } = section;

            html += /*html*/ `
                <div class='section-group${name === selected ? ' selected' : ''}' data-path='${path}'>
                    <div class='section-circle' data-name='${name}'>${index + 1}</div>
            `;

            html += /*html*/ `
                    <div class='section-name'>
                        <span class='section-name-text' data-name='${name}'>${name}</span>
                    </div>
                </div>
            `;
        });

        return html;
    }

    component.select = section => {
        const name = component.find(`.section-name-text[data-name='${section}']`);

        // console.log(name);
        if (name) {
            name.classList.add('selected');
        }
    };

    component.deselect = section => {
        const name = component.find(`.section-name-text[data-name='${section}']`);

        if (name) {
            name.classList.remove('selected');
        }
    };

    component.update = sections => {
        sections.forEach(section => {
            const {
                name, status
            } = section;

            const circle = component.find(`.section-circle[data-name='${name}']`);

            circle.classList.remove('complete', 'started', 'not-started');
            circle.classList.add(status);
        });
    };

    return component;
}
// @END-File
