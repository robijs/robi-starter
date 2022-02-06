import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function FixedToast(param) {
    const {
        top, type, bottom, left, right, title, message, action, onClose, parent, position
    } = param;

    const component = Component({
        locked: true,
        html: /*html*/ `
            <div class='fixed-toast slide-in ${type || 'inverse-colors'}'>
                <div class='fixed-toast-title'>
                    <strong class='mr-auto'>${title}</strong>
                    <button type='button' class='ml-4 mb-1 close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </div>
                <div class='fixed-toast-message'>
                    ${message}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.fixed-toast {
                cursor: ${action ? 'pointer' : 'initial'};
                position: fixed;
                z-index: 1000;
                font-size: 1em;
                max-width: 385px;
                padding: 20px;
                border-radius: 20px;
                ${top ?
                `top: ${top};` :
                ''}
                ${bottom ?
                `bottom: ${bottom};` :
                ''}
                ${left ?
                `left: ${left};` :
                ''}
                ${right ?
                `right: ${right};` :
                ''}
            }

            #id.robi {
                background: var(--primary);
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
            }

            #id.robi * {
                color: white;
            }

            #id.success {
                background: #d4edda;
            }

            #id.success * {
                color: #155724;
            }

            #id.inverse-colors {
                background: var(--primary);
            }

            #id.inverse-colors * {
                color: white;
            }

            /** Slide In */
            .slide-in {
                animation: slidein 500ms ease-in-out forwards;
            }

            /** Slide Out */
            .slide-out {
                animation: slideout 500ms ease-in-out forwards;
            }

            /* Close */
            #id .close {
                outline: none;
            }

            /* Title */
            #id .fixed-toast-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            @keyframes slidein {
                from {
                    /* opacity: 0; */
                    transform: translate(400px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(-10px);
                }
            }

            @keyframes slideout {
                from {
                    /* opacity: 0; */
                    transform: translate(-10px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(400px);
                }
            }
        `,
        position,
        parent,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    if (action) {
                        action(event);
                    }
                }
            },
            {
                selector: '#id .close',
                event: 'click',
                listener(event) {
                    event.stopPropagation();

                    /** Run close callback */
                    if (onClose) {
                        onClose(event);
                    }

                    /** Animate and remove component */
                    component.get().addEventListener('animationend', event => {
                        console.log('end slide out');

                        component.remove();
                    });

                    component.get().classList.remove('slide-in');
                    component.get().classList.add('slide-out');
                }
            }
        ]
    });

    return component;
}
// @END-File
