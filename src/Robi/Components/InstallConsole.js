import { Component } from '../Actions/Component.js'

// TODO: increment install-console line number
// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function InstallConsole(param) {
    const {
        text, close, margin, width, parent, position
    } = param;

    let {
        type
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='alert alert-${type}' role='alert'${margin ? ` style='margin: ${margin};'` : ''}>
                ${text}
                ${close ?
            /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    `
                : ''}
            </div>
        `,
        style: /*css*/ `
            #id {
                font-size: 14px;
                border-radius: 20px;
                border: none;
            }
            
            #id *:not(button) {
                color: inherit;
            }

            #id.alert-blank {
                padding: 0px;    
            }
            
            ${width ?
            /*css*/ `
                    #id {
                        width: ${width};
                    }
                ` :
                ''}
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
