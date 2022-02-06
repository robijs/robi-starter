import { ViewContainer } from '../Components/ViewContainer.js'
import { ViewTools } from '../Components/ViewTools.js'
import { Title } from '../Components/Title.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { History } from './History.js'
import { Log } from './Log.js'

// @START-File
/**
 *
 * @param {*} path
 * @param {*} options
 * @returns
 */
export function Route(path = App.get('defaultRoute'), options = {}) {
    const { scrollTop, title } = options;

    // Get references to core app components
    const appContainer = Store.get('appcontainer');
    const svgDefs = Store.get('svgdefs');
    const sidebar = Store.get('sidebar');
    const mainContainer = Store.get('maincontainer');

    // Store viewcontainer scrollTop
    Store.viewScrollTop(mainContainer.find('.viewcontainer')?.scrollTop || 0);

    // Remove all events attached to the maincontainer
    mainContainer.removeEvents();

    // Remove all child elements from maincontainer
    mainContainer.empty();

    // Remove all style elements added to head that aren't locked
    document.querySelectorAll(`head style[data-locked='no']`).forEach(node => node.remove());

    // Remove modal overlay
    const overlay = document.querySelector('.modal-backdrop');

    if (overlay) {
        overlay.remove();
    }

    // Abort all pending fetch requests
    Store.abortAll();

    // Terminate all running workers
    Store.terminateWorkers();

    // Empty store
    Store.empty();

    // TODO: store core components in props (Ex: Store.maincontainer), no need to re-add
    // Re-add core app component references to store
    Store.add({
        name: 'appcontainer',
        component: appContainer
    });
    Store.add({
        name: 'svgdefs',
        component: svgDefs
    });
    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });
    Store.add({
        name: 'sidebar',
        component: sidebar
    });

    // View container
    const viewContainer = ViewContainer({
        parent: mainContainer,
    });

    viewContainer.add();

    Store.add({
        name: 'viewcontainer',
        component: viewContainer
    });

    // Check route path
    const pathAndQuery = path.split('?');
    const pathParts = pathAndQuery[0].split('/');

    // Only select first path, remove any ? that might be passed in
    const route = Store.routes().find(item => item.path === pathParts[0]);

    if (!route) {
        // TODO: Reset history state?
        Route('404');

        return;
    }

    // Add tools
    if (route.type !== 'system' && Store.user().Roles.results.includes('Developer')) {
        const viewTools = ViewTools({
            route,
            parent: viewContainer
        });

        viewTools.add();

        Store.add({
            name: 'viewtools',
            component: viewTools
        });
    }

    // Route title
    let viewTitle;

    if (title !== false) {
        viewTitle = Title({
            title: route.title,
            parent: viewContainer,
            margin: '0px 0px 30px 0px'
        });

        viewTitle.add();
    }

    // Set browswer history state and window title
    History({
        url: `${location.href.split('#')[0]}${(path) ? `#${path}` : ''}`,
        title: `${App.get('title')}${(path) ? ` > ${route.title || pathParts.join(' > ')}` : ''}`
    });

    sidebar.selectNav(route.path);

    // Log route
    if (options.log !== false) {
        try {
            Log({
                Title: 'Route',
                Message: `${Store.user().Email || 'User'} routed to ${route.path}`,
                StackTrace: new Error().stack,
                // SessionId: '', // randomly generated UUID
                Module: import.meta.url
            });
        } catch (error) {
            console.error(error);
        }
    }

    // Render selected route's go method
    route.go({
        title: viewTitle,
        route,
        parent: viewContainer,
        pathParts,
        props: queryStringToObject(path.split('?')[1]),
        scrollTop
    });

    /** Modified from {@link https://stackoverflow.com/a/61948784} */
    function queryStringToObject(queryString) {
        if (!queryString) {
            return {};
        };

        const pairs = queryString.split('&');
        // → ["foo=bar", "baz=buzz"]
        const array = pairs.map(el => {
            const parts = el.split('=');
            return parts;
        });
        // → [["foo", "bar"], ["baz", "buzz"]]
        return Object.fromEntries(array);
        // → { "foo": "bar", "baz": "buzz" }
    }

    // Set viewContainer Scroll Top
    // - maybe Views should always return a promise?
    // - or could just use a callback passed to the view
    if (scrollTop) {
        console.log(scrollTop);

        viewContainer.get().scrollTo({
            top: scrollTop
        });
    }
}
// @END-File
