import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Alert(param) {
    const {
        text,
        classes,
        close,
        margin,
        width,
        parent,
        position,
        top,
        delay
    } = param;

    let {
        type
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='alert alert-${type} ${classes?.join(' ')}' role='alert'>
                ${text || ''}
                ${
                    close ?
                    /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `: ''
                }
            </div>
        `,
        style: /*css*/ `
            #id {
                font-size: 14px;
                border-radius: 10px;
                border: none;
                margin: ${margin || '0px 0px 10px 0px'};
            }

            #id.alert-blank {
                padding: 0px;
            }

            #id.shadow {
                box-shadow: var(--box-shadow);
            }
            
            ${
                width ?
                /*css*/ `
                    #id {
                        width: ${width};
                    }
                ` :
                ''
            }

            
            @keyframes alert-in {
                0% {
                    transform: scale(0);
                    transform-origin: center;
                    opacity: 0;
                }

                100% {
                    transform: scale(1);
                    transform-origin: center;
                    opacity: 1;
                }
            }

            .alert-in {
                position: absolute;
                top: ${top || 0}px;
                animation: alert-in 200ms ease-in-out forwards, alert-in 200ms ease-in-out ${delay || 5000}ms reverse forwards;
            }
        `,
        parent,
        position
    });

    component.update = (param) => {
        const {
            type: newType, text: newText
        } = param;

        const alert = component.get();

        if (type) {
            alert.classList.remove(`alert-${type}`);
            alert.classList.add(`alert-${newType}`);

            type = newType;
        }

        if (text) {
            alert.innerHTML = newText;
        }
    };

    return component;
}
// @END-File
