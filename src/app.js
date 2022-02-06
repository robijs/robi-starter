// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { Start } from './Robi/Robi.js'

// @START-Imports:Lists
import List_AllTypes from './Lists/AllTypes/Schema.js'
// @END-Imports:Lists

// @START-Imports:Routes
import Route_Example from './Routes/Example/Example.js'
// @END-Imports:Routes

// @START
Start({
    releaseNotes: {
        show: true,
        version: '1.0.0',
        title: 'New version now live',
        message: 'View release notes'
    },
    lists: [
        List_AllTypes
    ],
    routes: [
        // @START-Routes
        // @START-CustomForm
        {
            path: 'Example',
            title: 'Example',
            icon: 'bs-circle-fill',
            go: Route_Example
        }
        // @END-Routes
    ],
    settings: {
        // @START-SETTINGS
        // REQUIRED PROPERTIES
        // -------------------
        name: /* @START-name */'App'/* @END-name */,
        questionTypes: [
            {
                title: 'General',
                path: 'General'
            }
        ],
        theme: /* @START-theme */'Purple'/* @END-theme */,
        title: /* @START-title */'Title'/* @END-title */,
        userDefaultRole: 'User',
        userSettings: /* @START-userSettings */JSON.stringify({ searches: {}, actions: [ { Name: 'Create SLOTs', FileNames: 'CreateSLOTItems.js' }, { Name: 'Update MLOT', FileNames: 'UpdateMLOT.js' } ] })/* @END-userSettings */,
        // OPTIONAL PROPERTIES
        // -------------------
        allowFeedback: true,
        appcontainer: null,
        dev: {
            user: {
                Title: "First Last",
                Email: "firstlast@myorg.domain",
                LoginName: "firstlast",
                Roles: {
                    results: [
                        "Developer"
                    ]
                },
                SiteId: 1
            },
            testInstall: false,
        },
        library: '',
        maincontainer: null,
        sidebar: null,
        usersList: 'Users'
        // @END-SETTINGS
    }
});
// @END
