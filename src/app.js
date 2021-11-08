import { Start } from './Core/Actions.js'
import lists from './lists.js'
import Home from './Routes/Home/Home.js'

Start({
    routes: [
        {
            path: 'Home',
            hide: true,
            go() {
                Home();
            }  
        }
    ],
    settings: {
        dev: { // required: set local dev user props
            user: {
                Title: "First Last",
                Email: "name@org.domain",
                LoginName: "loginname",
                Role: "Developer"
            },
            errorLogging: 'on',
            // testLoading: true, // optional: (true || false), default: false
        },
        title: 'App', // required: enter app name
        defaultRoute: 'Home', // required: set default #route rendered if none present
        logo: 'dha-logo-no-label-180w.png', // required: set open sidebar logo
        logoSmall: 'dha-logo-no-label-80w.png', // required: set logo when sidebar is collapsed
        logoLarge: 'dha-logo-no-label-386w.png', // required: set launch logo
        primaryColor: '#24292f', // required: set theme color, used by core components
        primaryColorRGB: '45, 61, 80', // required: same as above, but in rgb format, used by core components
        secondaryColor: 'white', // required: set main container background color
        sidebarBackgroundColor: '#F8F8FC', // required: set nav background color
        sidebarTextColor: '#24292f', // required: set nav label text color
        defaultColor: '#24292f', // required: set text color
        titleColor: '#1c6cbb', // required: set core Title component text color
        defaultBorder: 'solid 1px rgba(0, 0, 0, .125)', // required: set default border style for core comoponents
        usersFields: [ // required: set user account fields, used to create users lists on install
            {
                name: 'Id',
                type: 'number'
            },
            {
                name: 'Title',
                type: 'slot'
            },
            {
                name: 'LoginName',
                type: 'slot'
            },
            {
                name: 'Email',
                type: 'slot'
            },
            {
                name: 'Role',
                type: 'slot'
            },
            {
                name: 'Settings',
                type: 'mlot'
            }
        ],
        userSettings: JSON.stringify({}), // requried: set user JSON
        userDefaultRole: 'User', // required: set default role for newly created use accounts
        questionTypes: [ // required: define at least one questionType with title and path props
            {
                title: 'General',
                path: 'General'
            }
        ],
        appcontainer: '', // optional: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        sidebar: '', // optional: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        maincontainer: '', // optional: replace default sidebar with your component (type function, typically imported from /Components/myComponent.js)
        mode: '', // optional: choose 'dev' || 'prod'
        site: '', // optional: enter site, will assume dev if location.href === localhost || 127.0.0.1
        library: '', // optional: enter src document library, defaults to 'App'
        usersList: 'Users', // optional: override default name for 'Users' lists,
        lists, // optional: define app lists to be created on install
        links: [ // optional: recommend loading shared stylesheets and preloading logos
            {
                href: '/app.css'
            },
            {
                rel: 'preload',
                as: 'image',
                href: '/Images/dha-logo-no-label-40w.png'
            },
            {
                rel: 'preload',
                as: 'image',
                href: '/Images/dha-logo-no-label-90w.png'
            },
            {
                rel: 'preload',
                as: 'image',
                href: '/Images/dha-logo-no-label-386w.png'
            }
        ]
    }
});
