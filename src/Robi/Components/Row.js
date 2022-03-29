import { Component } from '../Actions/Component.js'
import { Shimmer } from '../Actions/Shimmer.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Row(render, options = {}) {
    const { parent, display, height, minHeight, flex, align, responsive } = options;
    
    const id = Store.getNextRow();

    const component = Component({
        html: /*html*/ `
            <div class='robi-row' data-row='${id}'></div>
        `,
        style: /*css*/ `
            /* TODO: Make flex work */
            #id.robi-row {
                width: 100%;
                display: ${display || 'block'};
                ${height ? `height: ${height};` : ''}
                ${minHeight ? `min-height: ${minHeight};` : ''}
                ${flex ? `flex: ${flex};` : ''}
                ${align ? `align-items: ${align};` : ''}
            }

            .robi-row:not(:last-child) {
                margin-bottom: 30px;
            }
        `,
        // FIXME: Do I like this? Does it assume too much?
        parent: parent || Store.get('viewcontainer'),
        events: [],
        async onAdd() {
            // NOTE: This is awfully imperative. Is there a better way?
            if (render.constructor.name === 'AsyncFunction') {
                const viewcontainer = Store.get('viewcontainer').get();
                
                if (viewcontainer) {
                    viewcontainer.style.display = 'flex';
                    viewcontainer.style.flexDirection = 'column';
                }

                if (component) {
                    component.get().style.flex = '1';
                    component.get().style.background = 'var(--background)';
                    // component.get().style.display = 'flex';
                    // component.get().style.justifyContent = 'center';
                    // component.get().style.alignItems = 'center';

                    const unsubscribeShimmer = Shimmer(component, { background: 'var(--background)' });

                    // NOTE: Testing
                    // const loadingMsg = LoadingSpinner({
                    //     message: 'Loading Dashboard', 
                    //     parent: component, 
                    // });

                    // loadingMsg.add();
                    
                    await render(component);

                    component.get().style.flex = 'unset';
                    component.get().style.background = 'var(--secondary)';

                    // loadingMsg.remove();
                    unsubscribeShimmer.off();
                }
            } else {
                render(component);
            }

            if (responsive) {
                const node = component.get();

                if (!node) {
                    return;
                }

                if (window.innerWidth <= 1600) {
                    node.style.flexDirection = 'column';
                } else {
                    node.style.flexDirection = 'row';
                }

                window.addEventListener('resize', event => {
                    const node = component.get();

                    if (!node) {
                        return;
                    }

                    if (window.innerWidth <= 1600) {
                        node.style.flexDirection = 'column';
                    } else {
                        node.style.flexDirection = 'row';
                    }
                });
            }
        }
    });

    component.add();
}
// @END-File
