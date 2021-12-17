import { Component } from '../Actions/Component.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Toast(param) {
    const {
        text, type, delay, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='notification ${type || 'information'}'>
                <div>${text}</div>
            </div>
        `,
        style: /*css*/ `
            #id.notification {
                position: fixed;
                z-index: 10000;
                top: 20px;
                right: 5px;
                font-size: 1em;
                padding: 10px 20px;
                max-width: 350px;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
                border-radius: 4px;
                animation: slidein 500ms ease-in-out forwards, slidein 500ms ease-in-out ${delay || '5s'} reverse forwards;
            }

            #id.bs-toast {
                background-color: rgba(255,255,255);
                background-clip: padding-box;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
            }

            #id.bs-toast-light {
                background-color: rgba(255,255,255,.85);
                background-clip: padding-box;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
            }

            #id.success {
                color: white;
                background: mediumseagreen;
            }

            #id.information {
                background: mediumseagreen;
            }

            #id.error {
                background: crimson;
            }

            #id.notification:not(.bs-toast) * {
                color: white;
            }

            #id .dismiss {
                font-size: 1.2em;
                position: absolute;
                top: 3px;
                right: 3px;
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
        `,
        position,
        parent,
        events: [],
        onAdd() {
            setTimeout(() => {
                component.remove();
            }, delay || 6000);

            const allToasts = Store.get('maincontainer').findAll('.notification');

            if (allToasts.length > 1) {
                component.get().style.top = `${allToasts[allToasts.length - 1].getBoundingClientRect().height + 40}px`;
            }

            console.log(allToasts);
        }
    });

    return component;
}
// @END-File
