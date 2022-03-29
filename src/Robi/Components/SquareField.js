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
export function SquareField(param) {
    const {
        classes,
        label,
        description,
        parent,
        position,
        value,
        items
    } = param;

    // TODO: Allow multiple selections
    const component = Component({
        html: /*html*/ `
            <div class='square-field ${classes ? classes.join(' ') : ''}'>
                ${label ? /*html*/ `<label class='form-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${
                    HTML({
                        items,
                        each(icon) {
                            const { label, html } = icon;

                            return /*html*/ `
                                <div class='square-container d-flex justify-content-center ${label === value ? 'selected' : ''}' data-value='${label}'>
                                    ${html}
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
                gap: 10px;
                grid-template-columns: repeat(auto-fill, calc((100% - ${items.length * 10}px) / ${items.length}));
                justify-content: space-between;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .square-container {
                display: flex;
                justify-content: center;
                align-items: center;
                aspect-ratio: 1.5 / 1;
                cursor: pointer;
                padding: 20px;
                background-color: var(--background);
                border-radius: 15px;
                transition: background-color 150ms ease, transform 150ms ease;
            }

            #id .square-container.selected {
                box-shadow: 0px 0px 0px 2px var(--primary);
                background-color: var(--primary-20); 
            }

            #id .square-container:hover {
                background-color: var(--primary-20);
                transform: scale(1);
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .square-container',
                event: 'click',
                listener(event) {
                    // Deselect all 
                    component.findAll('.square-container').forEach(node => node.classList.remove('selected'));

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
            component.find('.square-container.selected')?.classList.remove('selected');
        } else if (value !== undefined) {
            const icon = component.find(`.square-container[data-value='${value}']`);

            if (icon) {
                // Deselect all 
                component.findAll('.square-container').forEach(node => node.classList.remove('selected'));

                // Select value
                icon.classList.add('selected');
            }
        } else {
            return component.find('.square-container.selected')?.dataset.value;
        }
    }

    return component;
}
// @END-File
