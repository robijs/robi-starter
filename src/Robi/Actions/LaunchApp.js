import { Data } from './Data.js'
import { GetCurrentUser } from './GetCurrentUser.js'
import { GenerateUUID } from './GenerateUUID.js'
import { SetSessionStorage } from './SetSessionStorage.js'
import { Route } from './Route.js'
import { Log } from './Log.js'
import { SvgDefs } from '../Components/SvgDefs.js'
import { Sidebar } from '../Components/Sidebar.js'
import { MainContainer } from '../Components/MainContainer.js'
import { FixedToast } from '../Components/FixedToast.js'
import { Modal } from '../Components/Modal.js'
import { ReleaseNotesContainer } from '../Components/ReleaseNotesContainer.js'
import { Routes } from '../Core/Routes.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function LaunchApp(param) {
    const {
        routes, sidebar, settings
    } = param;

    const {
        title, logo, usersList, beforeLoad, preLoadLists, svgSymbols, sessionStorageData, sidebarDropdown
    } = settings;

    /** Set sessions storage */
    SetSessionStorage({
        sessionStorageData
    });

    /** Get list items */
    const data = await Data(preLoadLists);

    if (data) {
        /** Add list items to store */
        preLoadLists.forEach((param, index) => {
            const {
                list
            } = param;

            Store.add({
                type: 'list',
                list,
                items: data[index]
            });
        });
    }

    /** Load svg definitions */
    const svgDefs = SvgDefs({
        svgSymbols
    });

    svgDefs.add();

    Store.add({
        name: 'svgdefs',
        component: svgDefs
    });

    /** Get AD user and Users list item properties */
    Store.user(await GetCurrentUser({
        list: usersList
    }));

    /** Get current route */
    const path = location.href.split('#')[1];

    /** Attach Router to browser back/forward event */
    window.addEventListener('popstate', (event) => {
        if (event.state) {
            Route(event.state.url.split('#')[1], {
                scrollTop: Store.viewScrollTop()
            });
        }
    });

    /** Store routes */
    Store.setRoutes(routes.concat(Routes));

    // Get app container
    const appContainer = Store.get('appcontainer');

    /** Sidebar Component */
    const sidebarParam = {
        logo,
        parent: appContainer,
        path,
        sidebarDropdown
    };

    const sidebarComponent = sidebar ? sidebar(sidebarParam) : Sidebar(sidebarParam);

    Store.add({
        name: 'sidebar',
        component: sidebarComponent
    });

    sidebarComponent.add();

    /** Main Container */
    const mainContainer = MainContainer({
        parent: appContainer
    });

    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });

    mainContainer.add();

    /** Run callback defined in settings Before first view loads */
    if (beforeLoad) {
        await beforeLoad();
    }

    /** Show App Container */
    appContainer.show('flex');

    /** Generate Session Id */
    const sessionId = GenerateUUID();

    /** Format Title for Sessin/Local Storage keys */
    const storageKeyPrefix = settings.title.split(' ').join('-');

    /** Set Session Id */
    sessionStorage.setItem(`${storageKeyPrefix}-sessionId`, sessionId);

    /** Log in*/
    try {
        Log({
            Title: `${Store.user().Title || 'User'} logged in`,
            Message: `${Store.user().Email || 'User'} successfully loaded ${title}`,
            StackTrace: new Error().stack,
            Module: import.meta.url
        });
    } catch (error) {
        console.error(error);
    }

    /** Run current route on page load */
    Route(path, {
        log: false
    });

    /** Check Local Storage for release notes */
    const isReleaseNotesDismissed = localStorage.getItem(`${storageKeyPrefix}-releaseNotesDismissed`);

    if (!isReleaseNotesDismissed) {
        /** Release Notes */
        const releaseNotes = FixedToast({
            type: 'robi',
            title: `New version ${'0.1.0'}`,
            message: `View release notes`,
            bottom: '20px',
            right: '10px',
            action(event) {
                const modal = Modal({
                    fade: true,
                    background: settings.secondaryColor,
                    centered: true,
                    close: true,
                    addContent(modalBody) {
                        ReleaseNotesContainer({
                            margin: '0px',
                            parent: modalBody,
                        });
                    },
                    parent: appContainer
                });

                modal.add();
            },
            onClose(event) {
                /** Set Local Storage */
                localStorage.setItem(`${storageKeyPrefix}-releaseNotesDismissed`, 'true');
            },
            parent: appContainer
        });

        releaseNotes.add();
    }
}
// @END-File
