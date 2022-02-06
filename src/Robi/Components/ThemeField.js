import { Component } from '../Actions/Component.js'
import { Themes } from '../Models/Themes.js'
import { App } from '../Core/App.js'

// TODO: add transition animation to theme change
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
                    ${Themes.map(theme => containerTemplate({theme, mode: App.get('prefersColorScheme')})).join('\n')}
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
            }

            #id .theme-app.selected {
                box-shadow: 0px 0px 0px 3px mediumseagreen;
            }

            #id .theme-app.current {
                box-shadow: 0px 0px 0px 3px var(--primary);
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

            /* Toggle - https://codepen.io/mrozilla/pen/OJJNjRb */
            .toggle {
                --size: 20px;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                outline: none;
                border: none;
                cursor: pointer;
                width: var(--size);
                height: var(--size);
                box-shadow: inset calc(var(--size) * 0.33) calc(var(--size) * -0.25) 0;
                border-radius: 999px;
                transition: all 200ms;
                z-index: 1;
                color: #54595f;
            }

            .toggle:checked {
                --ray-size: calc(var(--size) * -0.4);
                --offset-orthogonal: calc(var(--size) * 0.65);
                --offset-diagonal: calc(var(--size) * 0.45);
                color: #ced4da;
                transform: scale(0.75);
                box-shadow: inset 0 0 0 var(--size), calc(var(--offset-orthogonal) * -1) 0 0 var(--ray-size), var(--offset-orthogonal) 0 0 var(--ray-size), 0 calc(var(--offset-orthogonal) * -1) 0 var(--ray-size), 0 var(--offset-orthogonal) 0 var(--ray-size), calc(var(--offset-diagonal) * -1) calc(var(--offset-diagonal) * -1) 0 var(--ray-size), var(--offset-diagonal) var(--offset-diagonal) 0 var(--ray-size), calc(var(--offset-diagonal) * -1) var(--offset-diagonal) 0 var(--ray-size), var(--offset-diagonal) calc(var(--offset-diagonal) * -1) 0 var(--ray-size);
            }

            .mode-text {
                font-size: 14px;
                font-weight: 500;
                width: 33px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .theme-app',
                event: 'click',
                listener: selectTheme
            },
            {
                selector: '#id .toggle',
                event: 'change',
                listener(event) {
                    const toggleid = event.target.id;
                    const mode = event.target.checked ? 'light' : 'dark';
                    const name = toggleid.split('-')[1];
                    const theme = Themes.find(item => item.name === name);
                    const isSelected = component.find(`.theme-app[data-theme='${name}']`).classList.contains('selected');

                    component.find(`.mode-text[data-toggleid='${toggleid}']`).innerText = mode.toTitleCase();
                    component.find(`.theme-app[data-theme='${name}']`).remove();
                    component.find(`.theme-app-container[data-theme='${name}']`).insertAdjacentHTML('afterbegin', themeTemplate({ theme, mode }));
                    component.find(`.theme-app[data-theme='${name}']`).addEventListener('click', selectTheme);
                    
                    if (isSelected) {
                        component.find(`.theme-app[data-theme='${name}']`).classList.add('selected');
                    }
                }
            }
        ]
    });

    function selectTheme() {
        // Deselect all
        component.findAll('.theme-app').forEach(node => {
            node.classList.remove('selected');
        });
        
        // Select
        this.classList.add('selected');
    }

    function containerTemplate({theme, mode}) {
        const { name } = theme;

        return /*html*/ `
            <div class='theme-app-container d-flex flex-column justify-content-center align-items-center mb-4' data-theme='${name}'>
                ${themeTemplate({theme, mode})}
                <!-- Toggle Light/Dark Mode -->
                <div class='d-flex justify-content-center align-items-center'>
                    <div class="mode mt-2 mr-2">
                        <label style='display: none;' title='Hidden checkbox to toggle dark/light mode' for="toggle-${name}"></label>
                        <input id="toggle-${name}" class="toggle" type="checkbox" ${mode === 'light' ? 'checked' : ''}>
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
            <div class='theme-app ${name === selected ? 'current' : ''}' style='color: ${color}; border: solid 1px ${borderColor}' data-theme='${name}'>
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
