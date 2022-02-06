import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Heading(param) {
    const {
        text, size, color, height, weight, margin, padding, parent, width, align
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='heading'>
                <div class='text'>${text}</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                height: ${height || 'unset'};
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: ${margin || '50px 0px 20px 0px'};
                padding: ${padding || '0px'};
                width: ${width || 'initial'};
            }    

            #id .text {
                font-size: ${size || '1.25em'};
                font-weight: ${weight || '500'};
                color: ${color || 'var(--color)'};
                margin: 0px;
                text-align: ${align || 'left'};
            }

            #id .text * {
                color: ${color || 'var(--color)'};
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: []
    });

    component.setHeading = (newTitle) => {
        component.find('.text').innerText = newTitle;
    };

    return component;
}
// @END-File
