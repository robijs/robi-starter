// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { Start } from './Robi/Robi.js'

// @START-Imports:Lists
import List_AllTypes from './Lists/AllTypes/Schema.js'
import List_SLOT from './Lists/SLOT/Schema.js'
import List_MLOT from './Lists/MLOT/Schema.js'
import List_Date from './Lists/Date/Schema.js'
import List_Choice from './Lists/Choice/Schema.js'
import List_Number from './Lists/Number/Schema.js'
import List_MultiChoice from './Lists/MultiChoice/Schema.js'
// @END-Imports:Lists

// @START-Imports:Routes
import Route_SortTables from './Routes/SortTables/SortTables.js'
import Route_Test from './Routes/Test/Test.js'
import Route_LookupField from './Routes/LookupField/LookupField.js'
import Route_SelectIcon from './Routes/SelectIcon/SelectIcon.js'
import Route_ChartDemo from './Routes/ChartDemo/ChartDemo.js'
import Route_ModifyFile from './Routes/ModifyFile/ModifyFile.js'
import Route_Button from './Routes/Button/Button.js'
import Route_CustomForm from './Routes/CustomForm/CustomForm.js'
import Route_NewRoute from './Routes/NewRoute/NewRoute.js'
// @END-Imports:Routes

// @START
Start({
    releaseNotes: {
        show: true,
        version: '3.0.0',
        title: 'New version now live',
        message: 'View release notes'
    },
    lists: [
        List_AllTypes,
        List_SLOT,
        List_MLOT,
        List_Choice,
        List_Date,
        List_Number,
        List_MultiChoice
    ],
    // Routes are directly addressable. Ex: https://site#path.
    routes: [
        // @START-Routes
        // @START-CustomForm
        {
            path: 'CustomForm',
            title: 'Custom Form',
            icon: 'bs-checks-grid',
            go: Route_CustomForm
        }
        // @END-CustomForm
        , // @Route
        // @START-SortTables
        {
            path: 'SortTables',
            title: 'Sort Tables',
            icon: 'bs-table',
            go: Route_SortTables
        }
        // @END-SortTables
        , // @Route
        // @START-Test
        {
            path: 'Test',
            title: 'Test',
            icon: 'bs-tools',
            go: Route_Test
        }
        // @END-Test
        , // @Route
        // @START-LookupField
        {
            path: 'LookupField',
            title: 'Lookup Field',
            icon: 'bs-file-earmarked-ruled',
            go: Route_LookupField
        }
        // @END-LookupField
        , // @Route
        // @START-SelectIcon
        {
            path: 'SelectIcon',
            title: 'Select Icon',
            icon: 'bs-app',
            go: Route_SelectIcon
        }
        // @END-SelectIcon
        , // @Route
        // @START-ChartDemo
        {
            path: 'ChartDemo',
            title: 'Chart Demo',
            icon: 'stats-bars',
            go: Route_ChartDemo
        }
        // @END-ChartDemo
        , // @Route
        // @START-ModifyFile
        {
            path: 'ModifyFile',
            title: 'Modify File',
            icon: 'bs-code-slash',
            go: Route_ModifyFile
        }
        // @END-ModifyFile
        , // @Route
        // @START-Button
        {
            path: 'Button',
            title: 'Button',
            icon: 'bs-stop-fill',
            go: Route_Button
        }
        // @END-Button
        , // @Route
        // @START-NewRoute
        {
            path: 'NewRoute',
            title: 'New Route',
            icon: 'bs-bookmark-plus',
            go: Route_NewRoute
        }
        // @END-NewRoute
        // @END-Routes
    ],
    settings: {
        // @START-SETTINGS
        // REQUIRED PROPERTIES
        // -------------------
        // name: app name (AUTOPOPULATED if created by Robi)
        // questionTypes: define at least one questionType with title and path props
        // theme: ('Blue' | 'Brown' | 'Gray' | 'Green' | 'Gold' | 'Magenta' | 'Orange' | 'Pink' | 'Purple' | 'Red' | 'Slate' | 'Teal')
        // title: site title
        // userDefaultRole: default role for newly created use accounts
        // userSettings: new user account 'Settings' field default JSON value
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
        // appcontainer: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        // dev.user: local dev user props
        // dev.user.LoginName: placeholder account props for local dev
        // dev.testInstall: (true | false) - if true, will bring up install console and simulate app installation process 
        // library: document library where src directory lives, defaults is 'App'
        // maincontainer: replace default maincontainer with your component (type function, typically imported from /Components/myComponent.js)
        // sidebar: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        // usersLists: override default name for 'Users' lists
        allowFeedback: true,
        appcontainer: null,
        dev: {
            user: {
                Title: "First Last",
                Email: "first.mi.last.ctr@mail.mil",
                LoginName: "0987654321@mil",
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
