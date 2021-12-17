import { App, Component, ModifyFile } from '../Robi.js'

// @START-File
/**
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Robi component.
 */
export function SourceTools(param) {
    const {
        route,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class=''>
                <button type='button' class='btn'>
                    <!-- <svg class="icon" style="font-size: 18px; fill: ${App.get('primaryColor')};">
                        <use href="#icon-code-slash"></use>
                    </svg>-->
                    <code style='color: ${App.get('primaryColor')}; font-size: 13px; font-weight: 600;'>&lt;Edit/&gt;</code>
                </button>
            </div>
        `,
        style: /*css*/ `
            #id {
                display: flex;
                align-items: center;
                justify-content: center;
                position: fixed;
                top: 0px;
                right: 0px;
                height: 62px;
                padding: 0px 15px;
                border-radius: 10px;
            }

            #id .btn {
                transition: background-color 250ms ease;
            }

            #id .btn:hover {
                background-color: #e9ecef;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .btn',
                event: 'click',
                listener(event) {
                    ModifyFile({
                        path: `App/src/Routes/${route.path}`,
                        file: `${route.path}.js`
                    });
                }
            }
        ],
        onAdd() {

        }
    });

    return component;
}
// @END-File
