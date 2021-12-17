import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function MainContainer(param) {
    const {
        parent
    } = param;

    const component = Component({
        name: 'maincontainer',
        html: /*html*/ `
            <div class='maincontainer'></div>
        `,
        style: /*css*/ `
            .maincontainer {
                position: relative;
                flex: 1;
                height: 100vh;
                overflow: overlay;
            }

            .maincontainer.dim {
                filter: blur(25px);
                user-select: none;
                overflow: hidden,
            }
        `,
        parent,
        position: 'beforeend',
        events: []
    });

    component.dim = (toggle) => {
        const maincontainer = component.get();

        if (toggle) {
            maincontainer.classList.add('dim');
        } else {
            maincontainer.classList.remove('dim');
        }
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
