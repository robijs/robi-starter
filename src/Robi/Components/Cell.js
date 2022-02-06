import { Component } from '../Actions/Component.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Cell(render, options = {}) {
    const { 
        parent,
        height,
        minHeight,
        display,
        flex,
        background,
        radius,
        padding,
        narrowPadding,
        narrowWidth,
        responsive
    } = options;
    
    const id = Store.getNextCell();

    const component = Component({
        html: /*html*/ `
            <div class='robi-cell' data-row='${id}'></div>
        `,
        style: /*css*/ `
            #id.robi-cell {
                display: ${display || 'block'};
                ${height ? `height: ${height};` : ''}
                ${minHeight ? `min-height: ${minHeight};` : ''}
                ${flex ? `flex: ${flex};` : ''}
                ${background ? `background: ${background};` : ''}
                ${radius ? `border-radius: ${radius};` : ''}
                ${padding ? `padding: ${padding};` : ''}
            }

            .robi-cell:not(:last-child) {
                margin-right: 30px;
            }
        `,
        parent: parent || Store.get('viewcontainer'),
        events: [],
        onAdd() {
            render(component);

            if (responsive) {
                const node = component.get();

                if (!node) {
                    return;
                }

                if (window.innerWidth <= 1600) {
                    node.style.padding = narrowPadding || '0px';
                    node.style.margin = '0px';
                } else {
                    node.style.padding = padding || '0px';
                    node.style.margin = '0px';
                }

                window.addEventListener('resize', event => {
                    const node = component.get();

                    if (!node) {
                        return;
                    }

                    if (window.innerWidth <= 1600) {
                        node.style.padding = narrowPadding || '0px';
                        node.style.margin = '0px';
                    } else {
                        node.style.padding = padding || '0px';
                        node.style.margin = '0px';
                    }
                });
            }
        }
    });

    component.add();
}
// @END-File
