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
        maxWidth,
        display,
        flex,
        background,
        radius,
        padding,
        type,
        narrowPadding,
        narrowWidth,
        responsive
    } = options;
    
    const id = Store.getNextCell();

    const component = Component({
        html: /*html*/ `
            <div class='robi-cell ${type}' data-row='${id}'></div>
        `,
        style: /*css*/ `
            #id.robi-cell {
                display: ${display || 'block'};
                ${height ? `height: ${height};` : ''}
                ${minHeight ? `min-height: ${minHeight};` : ''}
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
                ${flex ? `flex: ${flex};` : ''}
                ${background ? `background: ${background};` : ''}
                ${radius ? `border-radius: ${radius};` : ''}
                ${padding ? `padding: ${padding};` : ''}
            }

            /* NOTE: Testing */
            #id.robi-cell.bordered {
                padding: 30px;
                border: solid 1px var(--border-color);
                box-shadow: 4px 4px 0px 0px var(--border-color);
                border-radius: 30px;
            }
        `,
        parent: parent || Store.get('viewcontainer'),
        events: [],
        onAdd() {
            render(component);

            if (responsive) {
                resize();

                window.addEventListener('resize', resize);

                function resize() {
                    const node = component.get();

                    if (!node) {
                        return;
                    }

                    if (window.innerWidth <= 1600) {
                        node.style.maxWidth = '100%';
                        node.style.marginBottom = '30px';
                        node.style.marginRight = '0px';
                    } else {
                        node.style.maxWidth = maxWidth || 'fit-content';
                        node.style.marginBottom = '0px';
                        node.style.marginRight = '30px';
                    }
                }
            }

            // if (responsive) {
            //     const node = component.get();

            //     if (!node) {
            //         return;
            //     }

            //     if (window.innerWidth <= 1600) {
            //         node.style.padding = narrowPadding || '0px';
            //         node.style.maxWidth = 'unset';
            //         node.style.margin = '0px';
            //     } else {
            //         node.style.padding = padding || '0px';
            //         node.style.margin = '0px';
            //         node.style.maxWidth = maxWidth || 'unset';
            //     }

            //     window.addEventListener('resize', event => {
            //         const node = component.get();

            //         if (!node) {
            //             return;
            //         }

            //         if (window.innerWidth <= 1600) {
            //             node.style.padding = narrowPadding || '0px';
            //             node.style.maxWidth = 'unset';
            //             node.style.margin = '0px';
            //         } else {
            //             node.style.padding = padding || '0px';
            //             node.style.maxWidth = 'unset';
            //             node.style.maxWidth = maxWidth || 'unset';
            //         }
            //     });
            // }
        }
    });

    component.add();
}
// @END-File
