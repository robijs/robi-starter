import { AccountInfo } from './AccountInfo.js'
import { ActionsCards } from './ActionsCards.js'
import { Alerts } from './Alerts.js'
import { BuildInfo } from './BuildInfo.js'
import { ChangeTheme } from './ChangeTheme.js'
import { Container } from './Container.js'
import { DevConsole } from './DevConsole.js'
import { DeveloperLinks } from './DeveloperLinks.js'
import { LogsContainer } from './LogsContainer.js'
import { Preferences } from './Preferences.js'
import { ReleaseNotesContainer } from './ReleaseNotesContainer.js'
import { RequestAssitanceInfo } from './RequestAssitanceInfo.js'
import { Route } from '../Actions/Route.js'
import { SectionStepper } from './SectionStepper.js'
import { SiteUsageContainer } from './SiteUsageContainer.js'
import { Store } from '../Core/Store.js'
import { Table } from './Table.js'
import { Title } from './Title.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function Settings({ parent, pathParts, title }) {
    title.remove();
    
    // Routed selection, default to Account if none
    const path = pathParts[1] || 'Account';

    const devPaths = [
        'Build',
        'App',
        'Logs',
        'SiteUsage',
        'SharePoint',
        'Theme'
    ];

    // FIXME: Refactor hasRole to accept multiple args
    if (devPaths.includes(path) && (!Store.user().hasRole('Developer') && !Store.user().hasRole('Administrator'))) {
        Route('403');
    }

    // All users see Account and Release Notes
    let sections = [
        {
            name: 'Account',
            path: 'Account'
        },
        {
            name: 'Help',
            path: 'Help'
        },
        {
            name: 'Preferences',
            path: 'Preferences'
        },
        {
            name: 'Release Notes',
            path: 'ReleaseNotes'
        }
    ];

    // Developers can see additional options
    // TODO: API for checking user roles
    if ( Store.user().hasRole('Developer')) {
        sections = sections.concat([
            {
                name: 'Actions',
                path: 'Actions'
            },
            {
                name: 'App',
                path: 'App'
            },
            {
                name: 'Alerts',
                path: 'Alerts'
            },
            {
                name: 'Build',
                path: 'Build'
            },
            {
                name: 'Logs',
                path: 'Logs'
            },
            {
                name: 'SharePoint',
                path: 'SharePoint'
            },
            {
                name: 'Theme',
                path: 'Theme'
            },
            {
                name: 'Usage',
                path: 'Usage'
            },
            {
                name: 'Users',
                path: 'Users'
            }
        ]);
    }

    // Turn off view container default padding
    parent.paddingOff();
        
    // Form Container
    const formContainer = Container({
        height: '100%',
        width: '100%',
        padding: '0px',
        parent
    });

    formContainer.add();

    // Left Container
    const leftContainer = Container({
        overflow: 'overlay',
        height: '100%',
        minWidth: 'fit-content',
        direction: 'column',
        padding: '62px 20px 20px 20px',
        borderRight: `solid 1px var(--border-color)`,
        parent: formContainer
    });

    leftContainer.add();

    // Right Container
    const rightContainer = Container({
        flex: '1',
        height: '100%',
        direction: 'column',
        overflowX: 'overlay',
        padding: '62px 0px 0px 0px',
        parent: formContainer
    });

    rightContainer.add();

    // Title Container
    const titleContainer = Container({
        display: 'block',
        width: '100%',
        parent: rightContainer
    });

    titleContainer.add();

    const section = sections.find(item => item.path === path)?.name;

    // Route Title
    const routeTitle = Title({
        title: 'Settings',
        subTitle: section || 'Account',
        padding: '0px 30px 15px 30px',
        width: '100%',
        parent: titleContainer,
        type: 'across',
        action(event) {
            projectContainer.get().scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    routeTitle.add();

    // Project Container
    const projectContainer = Container({
        name: 'project',
        padding: '0px',
        width: '100%',
        height: '100%',
        direction: 'column',
        overflow: 'overlay',
        align: 'center',
        parent: rightContainer
    });

    projectContainer.add();

    // TODO: Move to Container method
    // Scroll listener
    projectContainer.get().addEventListener('scroll', event => {
        if (event.target.scrollTop > 0) {
            projectContainer.get().style.borderTop = `solid 1px var(--border-color)`;
        } else {
            projectContainer.get().style.borderTop = `none`;
        }
    });

    // Plan Container
    const planContainer = Container({
        width: '100%',
        name: 'plan',
        padding: '15px 30px',
        direction: 'column',
        parent: projectContainer
    });

    planContainer.add();

    // Section Stepper
    const sectionStepperContainer = Container({
        direction: 'column',
        parent: leftContainer
    });

    sectionStepperContainer.add();

    const sectionStepper = SectionStepper({
        numbers: false,
        route: 'Settings',
        sections: sections.sort((a, b) => a.name.localeCompare(b.name)),
        selected: section,
        parent: sectionStepperContainer
    });

    sectionStepper.add();

    // Show section based on path
    switch (section) {
        case 'Account':
            AccountInfo({
                parent: planContainer
            });
            break;
        case 'Actions':
            ActionsCards({ 
                parent: planContainer
            });
            break;
        case 'App':
            const devConsole = DevConsole({
                parent: planContainer
            });
        
            devConsole.add();
            break;
        case 'Alerts':
            Alerts({
                parent: planContainer
            });
            break;
        case 'Build':
            BuildInfo({
                parent: planContainer
            });
            break;
        case 'Help':
            const requestAssistanceInfo = RequestAssitanceInfo({
                data: [
                    {
                        label: 'For help with this app, please contact:',
                        name: 'First Last',
                        title: 'TItle, Branch',
                        email: 'first.last.civ@mail.mil',
                        phone: '(555) 555-5555'
                    }
                ],
                parent: planContainer
            });
        
            requestAssistanceInfo.add();
            break;
        case 'Logs':
            LogsContainer({
                parent: planContainer
            });
            break;
        case 'Preferences':
            Preferences({
                parent: planContainer
            });
            break;
        case 'Release Notes':
            ReleaseNotesContainer({
                title: '',
                padding: '0px',
                maring: '0px',
                parent: planContainer
            });
            break;
        case 'SharePoint':
            DeveloperLinks({
                parent: planContainer
            });
            break;
        case 'Theme':
            ChangeTheme({
                parent: planContainer
            });
            break;
        case 'Usage':
            SiteUsageContainer({
                parent: planContainer
            });
            break;
        case 'Users':
            await Table({
                list: 'Users',
                heading: '',
                view: 'Users',
                formView: 'All',
                width: '100%',
                advancedSearch: true,
                parent: planContainer
            });
            break;
        default:
            Route('404');
            break;
    }
}
// @END-File
