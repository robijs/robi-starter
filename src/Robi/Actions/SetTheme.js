import { App } from '../Core/App.js'
import { HexToHSL } from './HexToHSL.js'
import { HexToRGB } from './HexToRGB.js'
import { HSLDarker } from './HSLDarker.js'
import { NameToHex } from './NameToHex.js'
import { GetLocal } from './GetLocal.js'
import { Themes } from '../Models/Themes.js'
import { Style } from './Style.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function SetTheme() {
    const theme = App.get('theme');
    const userPreference = GetLocal('prefersColorScheme');

    // 1. Set user preference
    if (userPreference) {
        App.set('prefersColorScheme', userPreference);
    } 
    
    // 2. If user hasn't set a preference, set to OS preference
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        App.set('prefersColorScheme', 'light');
    } 
    
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        App.set('prefersColorScheme', 'dark');
    } 
    
    // 3. Default to light
    else {
        App.set('prefersColorScheme', 'light');
    }
    
    const colors = Themes.find(item => item.name === theme);
    const { primary, secondary, background, color, selectedRowOpacity, buttonBackgroundColor, borderColor } = colors[App.get('prefersColorScheme')];
    const hex = NameToHex(primary);
    const rgb = HexToRGB(hex);
    const hsl = HexToHSL(hex);
    const hsl5 = HSLDarker(hsl, 5);
    const hsl10 = HSLDarker(hsl, 10);
    const background_HSL = HexToHSL(background);
    const background_HSL_3 = HSLDarker(background_HSL, 3);
    const background_HSL_5 = HSLDarker(background_HSL, 5);
    const background_HSL_10 = HSLDarker(background_HSL, 10);

    // All Colors
    App.set('colors', colors);

    // Primary
    App.set('primaryColor', hex);
    App.set('primaryColorRGB', rgb);
    App.set('primaryColorHSL', hsl);

    // Secondary
    App.set('secondaryColor', secondary);

    // Backgrounds
    App.set('backgroundColor', background);
    App.set('buttonBackgroundColor', buttonBackgroundColor);

    // Border
    App.set('borderColor', borderColor);

    // Default color
    App.set('defaultColor', color);

    // Selected row opacity
    App.set('selectedRowOpacity', selectedRowOpacity);

    // Add new root style
    Style({
        name: 'root',
        locked: true,
        style: /*css*/ `
            /* Theme Colors */
            :root {
                --background: ${background};
                --background-HSL: hsl(${background_HSL});
                --background-HSL-3: hsl(${background_HSL_3});
                --background-HSL-5: hsl(${background_HSL_5});
                --background-HSL-10: hsl(${background_HSL_10});
                --border-color: ${borderColor};
                --box-shadow: rgb(0 0 0 / ${App.get('prefersColorScheme') === 'dark' ? 40 : 10}%) 0px 0px 16px -2px;
                --button-background: ${buttonBackgroundColor};
                --color: ${color};
                --inputBackground: ${App.get('prefersColorScheme') === 'dark' ? background : secondary};
                --primary: ${primary};
                --primary-hex: ${hex};
                --primary-hsl: hsl(${hsl});
                --primary-hsl-5: hsl(${hsl5});
                --primary-hsl-10: hsl(${hsl10});
                ----primary-rgb: ${rgb};
                --primary-6b: ${primary + '6b'};
                --primary-19: ${primary + '19'}; 
                --primary-20: ${primary + '20'};
                --primary-30: ${primary + '30'};
                --scrollbar: ${App.get('prefersColorScheme') === 'dark' ? 'dimgray' : 'lightgray'};
                --secondary: ${secondary};
                --selected-row: ${primary + (selectedRowOpacity || '10')};
                --sort-shadow: rgb(0 0 0 / ${App.get('prefersColorScheme') === 'dark' ? 40 : 10}%) 0px 0px 32px 0px;
            }
        `
    });
}
// @END-File
