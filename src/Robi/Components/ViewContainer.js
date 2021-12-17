import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function ViewContainer(param) {
    const {
        parent
    } = param;

    // Collapse container height
    const padding = '62px';

    const component = Component({
        html: /*html*/ `
            <div class='viewcontainer'></div>
        `,
        style: /*css*/ `
            .viewcontainer {
                position: relative;
                padding: ${padding};
                height: 100vh;
                overflow: overlay;
            }

            .viewcontainer.dim {
                filter: blur(25px);
                user-select: none;
                overflow: hidden,
            }
        `,
        parent,
        events: []
    });

    component.dim = (toggle) => {
        const viewContainer = component.get();

        if (toggle) {
            viewContainer.classList.add('dim');
        } else {
            viewContainer.classList.remove('dim');
        }
    };

    component.paddingOff = () => {
        component.get().style.padding = '0px';
    };

    component.paddingOn = () => {
        component.get().style.padding = padding;
    };

    component.eventsOff = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'none';
        });
    };

    component.eventsOn = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'initial';
        });
    };
    return component;
}
// @END-File
