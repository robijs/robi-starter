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
        action,
        background,
        classes,
        description,
        margin,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        padding,
        parent,
        position,
        radius,
        title,
        titleBackground,
        titleBorder,
        titleColor,
        titleWeight,
        width
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='round-card ${classes ? classes.join(' ') : ''}'>
                ${title ? /*html*/ `<div class='round-card-title'>${title}</div>` : ''}
                ${description ? /*html*/ `<div class='mt-2 round-card-description'>${description}</div>` : ''}
            </div>
        `,
        style: /*css*/ `
            #id.round-card {
                display: inline-flex;
                flex-direction: column;
                background: ${background ||'var(--secondary)'};
                padding: ${padding || '20px'};
                margin: ${margin || '0px'};
                min-width: ${minWidth || 'initial'};
                min-height: ${minHeight || 'initial'};
                max-width: ${maxWidth || 'initial'};
                max-height: ${maxHeight || 'initial'};
                width: ${width || 'initial'};
                border-radius: ${radius || '10px'};
                border: none;
                cursor: ${action ? 'pointer' : 'initial'};
            }

            #id .round-card-title {
                font-size: 20px;
                margin: ${padding === '0px' ? `0px` : '-20px -20px 0px -20px'}; /** FIXME: will break with passed in padding  */
                padding: 10px 20px; /** FIXME: will break with passed in padding  */
                font-weight: ${titleWeight || '700'};
                background: ${titleBackground || 'inherit'}; /** FIXME: Experimental */ /* alternate color: #d0d0d04d */
                border-radius: 20px 20px 0px 0px;
                color: ${titleColor || 'var(--color)'};
                border-bottom: ${titleBorder || `solid 1px var(--border-color)`};
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
