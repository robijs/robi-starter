import { AppContainer } from '../Components/AppContainer.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { AddLinks } from './AddLinks.js'
import { GetCurrentUser } from './GetCurrentUser.js'
import { InitializeApp } from './InitializeApp.js'
import { LogError } from './LogError.js'
import { SetTheme } from './SetTheme.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function Start(param) {
    const {
        settings
    } = param;

    const {
        beforeInit,
        links,
        name,
        theme,
        usersList
    } = settings;

    // Set app settings
    App.settings(param);

    // Set theme
    SetTheme({ name, theme });

    // toTitleCase string method polyfil
    String.prototype.toTitleCase = function () {
        return this
            .toLowerCase()
            .split(' ')
            .map(word => word.replace(word[0], word[0]?.toUpperCase()))
            .join(' ');
    };

    // Split Camel Case
    String.prototype.splitCamelCase = function () {
        return this.split(/(?=[A-Z])/).join(' ');
    }

    /** Format error objects for JSON.stringify() to work properly */
    function replaceErrors(key, value) {
        if (value instanceof Error) {
            var error = {};

            Object.getOwnPropertyNames(value).forEach(function (key) {
                error[key] = value[key];
            });

            return error;
        }

        return value;
    }

    /** Log errors to SharePoint list */
    window.onerror = async (message, source, lineno, colno, error) => {
        LogError({
            Message: message,
            Source: source,
            Error: JSON.stringify(error, replaceErrors)
        });
    };

    /** Log errors from Promises to SharePoint list */
    window.addEventListener("unhandledrejection", event => {
        LogError({
            Message: event.reason.message,
            Source: import.meta.url,
            Error: event.reason.stack
        });
    });

    // Start app on page load
    window.onload = async () => {
        // Add links to head
        AddLinks({
            links
        });

        // Add appcontainer
        const appContainer = AppContainer();

        Store.add({
            name: 'appcontainer',
            component: appContainer
        });

        appContainer.add();

        // Get/Set User
        Store.user(await GetCurrentUser({
            list: usersList
        }));

        // Before load
        if (beforeInit) {
            beforeInit();
        }

        // Pass start param to InstallApp
        InitializeApp(param);
    };
}
// @END-File
