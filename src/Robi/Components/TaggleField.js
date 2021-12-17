import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function TaggleField(param) {
    const {
        label, description, fieldMargin, maxWidth, tags, onTagAdd, onTagRemove, parent, position,
    } = param;

    let taggle;

    const component = Component({
        html: /*html*/ `
            <div>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='taggle-container'></div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .taggle-container {
                position: relative;
                width: 100%;
                border-radius: 10px;
                border: 1px solid #ced4da;
                padding: 10px;
            }

            #id .taggle .close {
                text-shadow: none;
            }
        `,
        parent,
        position,
        events: [],
        onAdd() {
            // Initialize taggle
            taggle = new Taggle(component.find('.taggle-container'), {
                placeholder: 'Type then press enter to add tag',
                tags: tags ? tags.split(',') : [],
                duplicateTagClass: 'bounce',
                onTagAdd,
                onTagRemove
            });
        }
    });

    component.value = () => {
        return taggle.getTagValues().join(', ');
    };

    return component;
}
// @END-File
