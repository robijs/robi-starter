import { App } from '../Core/App.js'
import { Component } from '../Actions/Component.js'
import { SetLocal } from '../Actions/SetLocal.js'
import { RemoveLocal } from '../Actions/RemoveLocal.js'
import { Themes } from '../Models/Themes.js'
import { SetTheme } from '../Actions/SetTheme.js'
import { GetLocal } from '../Robi.js'

// TODO: add transition animation to theme change
// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function MyTheme(param) {
    const {
        parent, position, margin
    } = param;

    const theme = Themes.find(item => item.name === App.get('theme'));

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='themes'>
                    ${containerTemplate({ theme, mode: 'light' })}
                    ${containerTemplate({ theme, mode: 'dark' })}
                </div>
                <div class='d-flex align-items-center'>
                    <div>Operating System Preference</div>
                    <div class="custom-control custom-switch grab switch">
                        <input type="checkbox" class="custom-control-input" id='os-switch' data-mode='os'>
                        <label class="custom-control-label" for="os-switch"></label>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            #id .themes {
                display: flex;
                justify-content: space-between;
            }

            #id label {
                font-weight: 500;
            }

            #id .theme-app-container:not(:last-child) {
                margin-right: 30px;
            }

            #id .theme-app {
                cursor: pointer;
                display: flex;
                height: 150px;
                width: 200px;
                border-radius: 10px;
            }

            #id .theme-sidebar {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
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
                white-space: nowrap;
            }

            #id .theme-nav.selected {
                margin: 4px 4px 0px 4px;
            }

            #id .theme-maincontainer {
                display: flex;
                flex-direction: column;
                flex: 2;
                border-radius: 0px 10px 10px 0px;
                padding: 8px;
            }

            #id .theme-title {
                font-weight: 700;
                font-size: 13px;
                margin-bottom: 8px;
            }

            #id .theme-maincontainer .btn {
                font-size: 10.25px;
                padding: 6px 9px;
            }

            #id .theme-maincontainer .background {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
                border-radius: 10px;
                margin-top: 8px;
                font-size: 14px;
                font-weight: 500;                
            }

            /* Switch */
            #id .custom-control-input:checked
            #id .custom-control-input:checked ~ label {
                pointer-events: none;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .custom-control-input',
                event: 'change',
                listener(event) {
                    // Selected mode
                    const mode = event.target.dataset.mode;

                    // Deselect both switches
                    component.findAll('.custom-control-input').forEach(node => node.checked = false);

                    // Always select current switch
                    event.target.checked = true;

                    if (mode == 'os') {
                        // Remove key from local storage
                        RemoveLocal("prefersColorScheme");
                    } else {
                        // Save user preference to local storage
                        SetLocal('prefersColorScheme', mode);
                    }

                    // Reset theme
                    SetTheme();
                }
            }
        ],
        onAdd() {
            if (!GetLocal('prefersColorScheme')) {
                // Deselect mode
                component.find('.custom-control-input:checked').checked = false;

                // Select OS switch
                component.find('.custom-control-input[data-mode="os"]').checked = true;
            }
        }
    });

    function containerTemplate({theme, mode}) {
        const { name } = theme;

        return /*html*/ `
            <div class='theme-app-container d-flex flex-column justify-content-center align-items-center mb-4' data-theme='${name}'>
                ${themeTemplate({theme, mode})}
                <!-- Toggle Light/Dark Mode -->
                <div class='d-flex justify-content-center align-items-center'>
                    <div class="mode mr-2">
                        <div class="custom-control custom-switch grab switch">
                            <input type="checkbox" class="custom-control-input" id='${mode}-switch' data-mode='${mode}' ${App.get('prefersColorScheme') === mode ? 'checked' : ''}>
                            <label class="custom-control-label" for="${mode}-switch"></label>
                        </div>
                    </div>
                    <div class='mode-text' data-toggleid="toggle-${name}">${mode === 'light' ? 'Light' : 'Dark'}</div>
                </div>
            </div>
        `
    }

    function themeTemplate({theme, mode}) {
        const { name } = theme;
        const { primary, secondary, background, color, borderColor, buttonBackgroundColor } = theme[mode];

        return /*html*/ `
            <div class='theme-app' style='color: ${color}; border: solid 1px ${borderColor}' data-theme='${name}'>
                <div class='theme-sidebar' style='background: ${background}; border-right: solid 1px ${borderColor};'>
                    <div class='theme-sidebar-title'>Title</div>
                    <div class='theme-nav selected' style='background: ${primary}; color: white;'>Route 1</div>
                    <div class='theme-nav'>Route 2</div>
                    <div class='theme-nav'>Route 3</div>
                </div>
                <div class='theme-maincontainer' style='background: ${secondary};'>
                    <div class='theme-title'>${name}</div>
                    <div>
                        <div class="btn" style='background: ${buttonBackgroundColor}; color: ${primary}'>Button</div>
                        <div class="btn" style='background: ${primary}; color: ${secondary}'>Button</div>
                    </div>
                    <div class='background' style='background: ${background}'>
                        Aa
                    </div>
                </div>
            </div>
        `;
    }

    // TODO: Set value
    component.value = () => {
        return component.find('.theme-app.selected')?.dataset.theme;
    };

    return component;
}
// @END-File
