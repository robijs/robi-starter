import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 * {@link https://getbootstrap.com/docs/4.5/components/buttons/}
 *
 * @example btn-robi-primary
 * @example btn-secondary
 * @example btn-success
 * @example btn-danger
 * @example btn-warning
 * @example btn-info
 * @example btn-light
 * @example btn-dark
 *
 * @example btn-outline-robi-primary
 * @example btn-outline-secondary
 * @example btn-outline-success
 * @example btn-outline-danger
 * @example btn-outline-warning
 * @example btn-outline-info
 * @example btn-outline-light
 * @example btn-outline-dark
 *
 * @param {Object} param
 * @returns
 */
export function Button(param) {
    const {
        action, disabled, parent, position, classes, style, type, value, icon, size, fill
    } = param;

    const component = Component({
        html: /*html*/ `
            <button type="button" class="btn btn-${type} ${classes?.join(' ')}" ${disabled ? 'disabled' : ''} ${style ? `style='${style}'` : ''}>
                ${value ? value : ''}
                ${
                    icon ? /*html*/ `
                        <svg class='icon' style='font-size: ${size}; fill: ${fill || 'var(--color)'};'>
                            <use href='#icon-${icon}'></use>
                        </svg>
                    ` : ''
                }
            </button>
        `,
        style: /*css*/ `
            #id.w-fc {
                width: fit-content;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id`,
                event: 'click',
                listener: action
            }
        ]
    });

    component.enable = () => {
        component.get().disabled = false;
    };

    component.disable = () => {
        component.get().disabled = true;
    };

    return component;
}
// @END-File
