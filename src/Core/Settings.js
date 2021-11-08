import { 
    Help,
    Missing,
    Unauthorized,
    Users,
    Settings,
    Developer,
    Questions,
    QuestionsBoard,
    Question 
} from './Views.js'

let settings = {};

const App = {
    set(param) {
        let { mode, site, library } = param;

        // If mode isn't explicity set, assume dev if url contains local host 
        if (!mode) {
            if (location.href.includes('localhost') || location.href.includes('127.0.0.1')) {
                param.mode = 'dev';
            } else {
                param.mode = 'prod';
            }
        }

        if (!library) {
            param.library = 'App';
        }

        if (param.mode === 'prod' && !site) {
            console.log('Site:', location.href.split(library || '/App/')[0]);
            console.log('App library:', param.library);

            param.site = location.href.split(library || '/App/')[0];
        }

        settings = param;
    },
    get(prop) {
        return settings[prop];
    }
}

Object.freeze(App);

/** Routes */
const Routes = [
    {
        path: 'Questions',
        icon: 'chat-right-text',
        go(param) { 
            const {
                pathParts
            } = param;

            if (pathParts.length === 1) {
                Questions();
            } else if (pathParts.length === 2) {
                QuestionsBoard({
                    path: pathParts[1]
                });
            } else if (pathParts.length === 3) {
                Question({
                    path: pathParts[1],
                    itemId: parseInt(pathParts[2])
                });
            }
        } 
    },
    {
        path: 'Users',
        roles: [
            'Developer',
            'Administrator'
        ],
        icon: 'people',
        go(param) {
            const {
                pathParts
            } = param;

            if (pathParts.length === 1) {
                Users();
            } else if (pathParts.length === 2) {
                Users({
                    itemId: parseInt(pathParts[1])
                });
            }
        }  
    },
    {
        path: 'Developer',
        roles: [
            'Developer'
        ],
        icon: 'code-slash',
        go(param) {
            Developer(param);
        }
    },
    {
        path: 'Help',
        icon: 'info-circle',
        go() {
            Help();
        }
    },
    {
        path: 'Settings',
        icon: 'bs-gear',
        go() {
            Settings();
        }
    },
    {
        path: '403',
        hide: true,
        go() {
            Unauthorized();
        }
    },
    {
        path: '404',
        hide: true,
        go() {
            Missing();
        }
    },
    /** TEST */
    {
        path: 'Worker',
        hide: true,
        go() {
            View_Worker();
        }
    }
];

export { App, Routes };
