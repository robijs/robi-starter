import { Component } from '../Actions/Component.js'

// @START-File
/**
 * https://sean.is/poppin/tags
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
                border: 1px solid var(--border-color);
                padding: 10px;
            }

            #id .taggle .close {
                text-shadow: none;
            }

            /* Modified from: https://jsfiddle.net/okcoker/aqnspdtr/8/ */
            .taggle_list {
                float: left;
                padding: 0;
                margin: 0;
                width: 100%;
                display: flex;
            }
            
            .taggle_input {
                border: none;
                outline: none;
                background: none;
                font-size: 13px;
                font-weight: 400;
                padding: 5px 10px;
            }
            
            .taggle_list li {
                display: inline-block;
                white-space: nowrap;
                font-weight: 500;
                height: 29.5px;
            }
            
            .taggle_list .taggle {
                font-size: 13px;
                margin-right: 8px;
                background: #E2E1DF;
                padding: 5px 10px;
                border-radius: 3px;
                position: relative;
                cursor: pointer;
                transition: all .3s;
                -webkit-animation-duration: 1s;
                animation-duration: 1s;
                -webkit-animation-fill-mode: both;
                animation-fill-mode: both;
                min-width: 60px;
                border-radius: 10px;
                text-align: center;
            }
            
            .taggle_list .taggle_hot {
                background: #cac8c4;
            }
            
            .taggle_list .taggle .close {
                font-size: 1.1rem;
                position: absolute;
                top: 10px;
                right: 3px;
                text-decoration: none;
                padding: 0;
                line-height: 0.5;
                color: #24292f;
                padding-bottom: 4px;
                display: none;
                border: 0;
                background: none;
                cursor: pointer;
            }
            
            .taggle_list .taggle:hover {
                padding: 5px;
                padding-right: 15px;
                background: #ccc;
                transition: all .3s;
            }
            
            .taggle_list .taggle:hover > .close {
                display: block;
            }
            
            .taggle_placeholder {
                font-size: 13px;
                position: absolute;
                color: #CCC;
                top: 15px;
                left: 8px;
                transition: opacity, .25s;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            .taggle_sizer {
                padding: 0;
                margin: 0;
                position: absolute;
                top: -500px;
                z-index: -1;
                visibility: hidden;
            }
        `,
        parent,
        position,
        events: [],
        onAdd() {
            // Initialize Taggle
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
