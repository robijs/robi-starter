import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Card(param) {
    const {
        title, fontSize, description, titleColor, titleWeight, titleBorder, titleBackground, background, padding, margin, minWidth, minHeight, parent, width, position, radius, action
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='round-card'>
                ${title ? /*html*/ `<div class='round-card-title'>${title}</div>` : ''}
                ${description ? /*html*/ `<div class='mt-2 round-card-description'>${description}</div>` : ''}
            </div>
        `,
        style: /*css*/ `
            #id.round-card {
                display: inline-flex;
                flex-direction: column;
                background: ${background || 'white'};
                padding: ${padding || '20px'};
                margin: ${margin || '0px'};
                min-width: ${minWidth || 'initial'};
                min-height: ${minHeight || 'initial'};
                width: ${width || 'initial'};
                border-radius: ${radius || '10px'};
                /* border: ${App.get('defaultBorder')}; */
                border: none;
                cursor: ${action ? 'pointer' : 'initial'};
            }

            #id .round-card-title {
                font-size: 20px;
                margin: ${padding === '0px' ? `0px` : '-20px -20px 0px -20px'}; /** FIXME: will break with passed in padding  */
                padding: 10px 20px; /** FIXME: will break with passed in padding  */
                font-weight: ${titleWeight || '700'};
                background: ${titleBackground || 'inherit'}; /** FIXME: Experimental */ /* alternate color: #d0d0d04d */
                border-radius: 10px 10px 0px 0px;
                color: ${titleColor || App.get('defaultColor')};
                border-bottom: ${titleBorder || App.get('defaultBorder')};
            }

            #id .round-card-description {
                
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener: (event) => {
                    if (action) {
                        action(event);
                    }
                }
            }
        ]
    });

    return component;
}
// @END-File
