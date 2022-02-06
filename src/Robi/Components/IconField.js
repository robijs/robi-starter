// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made from the front end may not render properly.

import { Component } from '../Actions/Component.js'
import { HTML } from '../Actions/HTML.js'

// @START-File
/**
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Robi component.
 */
export function IconField(param) {
    const {
        classes,
        label,
        description,
        parent,
        position,
        size, // must be in px
        value,
        icons
    } = param;

    const component = Component({
        html: /*html*/ `
            <!-- <div class='icon-field d-flex flex-wrap ${classes ? classes.join(' ') : ''}'> -->
            <div class='icon-field ${classes ? classes.join(' ') : ''}'>
                ${label ? /*html*/ `<label class='form-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${
                    HTML({
                        items: icons,
                        each(icon) {
                            const { id, fill} = icon;

                            return /*html*/ `
                                <div class='icon-container d-flex justify-content-center ${`icon-${value}` === id ? 'selected' : ''}' data-icon='${id.replace('icon-', '')}' title='${id.replace('icon-', '')}'>
                                    <svg class='icon' style='font-size: ${size || '32'}px; fill: ${fill || 'var(--primary)'};'>
                                        <use href='#${id}'></use>
                                    </svg>
                                </div>
                            `
                        }
                    })
                }
            </div>
        `,
        style: /*css*/ `
            #id {
                display: grid;
                grid-template-columns: repeat(auto-fill, 72px); /* passed in size or 22 plus (15 * 2 for padding) */
                justify-content: space-between;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .icon-container {
                transform: scale(.7);
                cursor: pointer;
                padding: 20px;
                /* margin: 0px 20px 20px 0px; */
                background-color: var(--background);
                border-radius: 15px;
                transition: background-color 150ms ease, transform 150ms ease;
            }

            #id .icon-container.selected {
                box-shadow: 0px 0px 0px 2px var(--primary);
                background-color: var(--primary-20); 
            }

            #id .icon-container:hover {
                background-color: var(--primary-20);
                transform: scale(1);
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .icon-container',
                event: 'click',
                listener(event) {
                    // Deselect all 
                    component.findAll('.icon-container').forEach(node => node.classList.remove('selected'));

                    // Select clicked
                    this.classList.add('selected');
                }
            }
        ],
        onAdd() {

        }
    });

    component.value = (value) => {
        if (value === '') {
            component.find('.icon-container.selected')?.classList.remove('selected');
        } else if (value !== undefined) {
            const icon = component.find(`.icon-container[data-icon='${value}']`);

            if (icon) {
                // Deselect all 
                component.findAll('.icon-container').forEach(node => node.classList.remove('selected'));

                // Select value
                icon.classList.add('selected');
            }
        } else {
            return component.find('.icon-container.selected')?.dataset.icon;
        }
    }

    return component;
}
// @END-File
