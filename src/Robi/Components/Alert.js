import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Alert(param) {
    const {
        text, classes, close, margin, width, parent, position, top
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

            /* #id *:not(button) {
                color: inherit;
            } */

            #id.alert-blank {
                padding: 0px;    
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
                    transform: translateY(-50px);
                    /* transform: scale(0) translateY(-50px); */
                    /* transform-origin: top left; */
                    opacity: 0;
                }

                100% {
                    transform: translateY(0px);
                    /* transform: scale(1) translateY(0px); */
                    /* transform-origin: top left; */
                    z-index: 1000;
                    opacity: 1;
                }
            }

            .alert-in {
                position: absolute;
                top: ${top || 0}px;
                animation: 200ms ease-in-out forwards alert-in;
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
