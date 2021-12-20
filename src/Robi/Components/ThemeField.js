import { Component } from '../Actions/Component.js'
import { Themes } from '../Models/Themes.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function ThemeField(param) {
    const {
        label, margin, parent, position, selected
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                ${label !== false ? /*html*/ `<label>Theme</label>` : ''}
                <div class='themes'>
                    ${
                        Themes.map(theme => {
                            const { name, primary, secondary, background, color } = theme;

                            return /*html*/ `
                                <div class='theme-app ${name === selected ? 'selected' : ''}' style='color: ${color};' data-theme='${name}'>
                                    <div class='theme-sidebar' style='background: ${background};'>
                                        <div class='theme-sidebar-title'>Title</div>
                                        <div class='theme-nav selected' style='background: ${primary}; color: white;'>Selected</div>
                                        <div class='theme-nav'>Route</div>
                                    </div>
                                    <div class='theme-maincontainer' style='background: ${secondary};'>
                                        <div class='theme-title'>${name}</div>
                                    </div>
                                </div>
                            `
                        }).join('\n')
                    }
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            #id .themes {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                max-width: 995px;
            }

            #id label {
                font-weight: 500;
            }

            #id .theme-app {
                cursor: pointer;
                display: flex;
                height: 150px;
                width: 200px;
                border-radius: 10px;
                border: solid 1px #d6d8db80;
            }

            #id .theme-app:not(:last-child) {
                /* margin-right: 15px; */
                margin-bottom: 15px;
            }
   
            #id .theme-app.selected {
                /* background: ${App.get('primaryColor') + '20'}; */
                box-shadow: 0px 0px 0px 4px ${App.get('primaryColor')};
            }

            #id .theme-sidebar {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                border-right: solid 1px #d6d8db80;
                border-radius: 10px 0px 0px 10px;
                flex: 1;
            }

            #id .theme-sidebar-title {
                margin: 8px 4px 0px 4px;
                padding: 0px 8px;
                font-weight: 700;
                font-size: 13px;
            }

            #id .theme-nav {
                margin: 0px 4px;
                padding: 2px 8px;
                border-radius: 6px;
                font-weight: 500;
                font-size: 11px;
            }

            #id .theme-nav.selected {
                margin: 4px;
            }

            #id .theme-maincontainer {
                flex: 2;
                border-radius: 0px 10px 10px 0px;
            }

            #id .theme-title {
                margin: 8px;
                font-weight: 700;
                font-size: 13px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .theme-app',
                event: 'click',
                listener(event) {
                    // Deselect all
                    component.findAll('.theme-app').forEach(node => {
                        node.classList.remove('selected');
                    });
                    
                    // Select
                    this.classList.add('selected');
                }
            }
        ]
    });

    // TODO: Set value
    component.value = () => {
        return component.find('.theme-app.selected')?.dataset.theme;
    };

    return component;
}
// @END-File
