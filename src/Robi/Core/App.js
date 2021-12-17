import { HexToHSL } from '../Actions/HexToHSL.js'
import { HexToRGB } from '../Actions/HexToRGB.js'
import { NameToHex } from '../Actions/NameToHex.js'
import { Themes } from '../Models/Themes.js'

// @START-File
let appSettings = {};
let appLists;

const App = {
    lists() {
        return appLists;
    },
    set(param) {
        const { lists, routes, settings } = param;
        const { library, defaultRoute, theme } = settings;

        // Set lists
        appLists = lists;

        // Set mode
        if (location.href.includes('localhost') || location.href.includes('127.0.0.1')) {
            settings.mode = 'dev';
        } else {
            settings.mode = 'prod';
        }

        // Set library
        if (!library) {
            settings.library = 'App';
        }

        // Set site
        if (settings.mode === 'prod') {
            console.log('Site:', location.href.split(library || '/App/')[0]);
            console.log('App library:', settings.library);

            settings.site = location.href.split(library || '/App/')[0];
        } else {
            settings.site = 'http://localhost';
        }

        // Set default route
        if (!defaultRoute) {
            settings.defaultRoute = routes.map(route => route.path)[0];
        }

        // Set colors
        const { primary, secondary, background, color } = Themes.find(item => item.name === theme);

        // Primary
        settings.primaryColor = NameToHex(primary);
        settings.primaryColorRGB = HexToRGB(settings.primaryColor);
        settings.primaryColorHSL = HexToHSL(settings.primaryColor);

        // Secondary
        settings.secondaryColor = secondary;

        // Background
        settings.backgroundColor = background;

        // Default color
        settings.defaultColor = color;

        // Set all
        appSettings = settings;
    },
    get(prop) {
        return appSettings[prop];
    }
}

Object.freeze(App);

export { App }
// @END-File
