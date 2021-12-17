import { ViewContainer } from '../Components/ViewContainer.js'
import { SourceTools } from '../Components/SourceTools.js'
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
    const {
        scrollTop
    } = options;

    /** Remove styles in head */
    document.querySelectorAll(`head style[data-locked='no']`).forEach(node => node.remove());

    /** Remove modal overlay */
    const overlay = document.querySelector('.modal-backdrop');

    if (overlay) {
        overlay.remove();
    }

    /** Abort all pending fetch requests */
    Store.abortAll();

    /** Terminate all running workers */
    Store.terminateWorkers();

    /** Get references to core app components */
    const appContainer = Store.get('appcontainer');
    const svgDefs = Store.get('svgdefs');
    const sidebar = Store.get('sidebar');
    const mainContainer = Store.get('maincontainer');

    /** Set scroll top */
    Store.viewScrollTop(mainContainer.get().scrollTop);

    // Turn padding back on
    // mainContainer.paddingOn();
    /** Remove all events attached to the maincontainer */
    mainContainer.removeEvents();

    /** Empty mainconatainer DOM element */
    mainContainer.empty();

    /** Empty store */
    Store.empty();

    /** Re-add core app component references to store */
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

    // FIXME: Experimental.
    // Trying to solve the problem where components are
    // added to the current view after the user routes away from 
    // the view the component is added from.
    // 
    // This only happens when a fetch request begins when 
    // a view is first routed to but is aborted if the user
    // routes away before the request can finish.
    // Components created and added later are still 'running'
    // in the background.
    // 
    // Most views use Store.get('maincontainer') as their parent.
    // This means components will still be added because they're
    // finding the new maincontainer for that view.
    const viewContainer = ViewContainer({
        parent: mainContainer,
    });

    viewContainer.add();

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

    // Add source tools
    if (route.type !== 'system' && Store.user().Role === 'Developer') {
        const srcTools = SourceTools({
            route,
            parent: viewContainer
        });

        srcTools.add();

        // // FIXME: experimental
        // viewContainer.get().addEventListener('keypress', event => {
        //     if (event.ctrlKey && event.key === 'M') {
        //         event.preventDefault();
        //         ModifyFile({
        //             path: `App/src/Routes/${route.path}`,
        //             file: `${route.path}.js`
        //         });
        //     }
        // });
    }

    // Set browswer history state
    History({
        url: `${location.href.split('#')[0]}${(path) ? `#${path}` : ''}`,
        title: `${App.get('title')}${(path) ? ` - ${pathAndQuery[0]}` : ''}`
        // title: `${App.title}${(path) ? ` - ${path}` : ''}`
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

    /** Call .go() method */
    route.go({
        parent: viewContainer,
        pathParts,
        props: queryStringToObject(path.split('?')[1])
    });

    /**
     * Modified from {@link https://stackoverflow.com/a/61948784}
     */
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

    /** Set Scroll Top */
    /** @todo this needs to run only after all async calls have completed */
    /** @note maybe Views should always return a promise? */
    /** @note or could just use a callback passed to the view */
    if (scrollTop) {
        console.log(scrollTop);

        Store.get('maincontainer').get().scrollTo({
            top: scrollTop
        });
    }
}
// @END-File
