import { Table } from './Table.js'
import { Title } from './Title.js'
import { Timer } from './Timer.js'
import { Container } from './Container.js'
import { SectionStepper } from './SectionStepper.js'
import { DevConsole } from './DevConsole.js'
import { AccountInfo } from './AccountInfo.js'
import { BuildInfo } from './BuildInfo.js'
import { DeveloperLinks } from './DeveloperLinks.js'
import { ReleaseNotesContainer } from './ReleaseNotesContainer.js'
import { SiteUsageContainer } from './SiteUsageContainer.js'
import { RequestAssitanceInfo } from './RequestAssitanceInfo.js'
import { Store } from '../Core/Store.js'
import { ChangeTheme } from './ChangeTheme.js'
import { CreateItem } from '../Actions/CreateItem.js'
import { Route } from '../Actions/Route.js'
import { ActionsCards } from './ActionsCards.js'
import { LogsContainer } from './LogsContainer.js'
import { Preferences } from './Preferences.js'

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

    // console.log(Store.user().Roles, Store.user().Roles.results.includes('Developer'));

    if (devPaths.includes(path) && !Store.user().Roles.results.includes('Developer')) {
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
    if ( Store.user().Roles.results.includes('Developer')) {
        sections = sections.concat([
            {
                name: 'Actions',
                path: 'Actions'
            },
            {
                name: 'Build',
                path: 'Build'
            },
            {
                name: 'App',
                path: 'App'
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
                toolbar: [],
                parent: planContainer
            });
            break;
        default:
            Route('404');
            break;
    }

    // Actions
    function actions() {
        // Toggle update
        let run = false;

        // Update clock and buttons
        const timer = Timer({
            parent: planContainer,
            classes: ['w-100'],
            start() {
                run = true;
                console.log(`Run: ${run}`);

                // create(25);
                // update();
            },
            stop() {
                run = false;
                console.log(`Run: ${run}`);
            },
            reset() {
                console.log('reset');
            }
        });

        timer.add();

        const items = []; // Get({ list: 'ListName' })

        async function create(limit) {
            /** Set items */
            for (let i = 0; i < limit; i++) {

                if (run) {
                    // Create Item
                    const newItem = await CreateItem({
                        list: '',
                        data,
                        wait: false
                    });

                    console.log(`Id: ${newItem.Id}.`);

                    if (i === limit - 1) {
                        timer.stop();
                    }
                } else {
                    console.log('stoped');

                    break;
                }
            }
        }

        async function update() {
            /** Set items */
            for (let i = 0; i < items.length; i++) {
                if (run) {

                    // update item
                    if (i === items.length - 1) {
                        timer.stop();
                    }
                } else {
                    console.log('stoped');

                    break;
                }
            }
        }

        // /** Test Attach Files Button */
        // const attachFilesButton = UploadButton({
        //     async action(files) {
        //         console.log(files);
        //         const uploadedFiles = await AttachFiles({
        //             list: 'View_Home',
        //             id: 1,
        //             files
        //         });
        //         console.log(uploadedFiles);
        //     },
        //     parent: planContainer,
        //     type: 'btn-outline-success',
        //     value: 'Attach file',
        //     margin: '20px 0px 20px 0px'
        // });
        // attachFilesButton.add();

        // /** Test Send Email */
        // const sendEmailButton = BootstrapButton({
        //     async action(event) {
        //         await SendEmail({
        //             From: 'stephen.a.matheis.ctr@mail.mil',
        //             To: 'stephen.a.matheis.ctr@mail.mil',
        //             CC: [
        //                 'stephen.a.matheis.ctr@mail.mil'
        //             ],
        //             Subject: `Test Subject`,
        //             Body: /*html*/ `
        //                 <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
        //                     <p>
        //                         Test body. <strong>Bold</strong>. <em>Emphasized</em>.
        //                     </p>
        //                     <p>
        //                         <a href='https://google.com'>Google</a>
        //                     </p>
        //                 </div>
        //             `
        //         });
        //     },
        //     parent: planContainer,
        //     classes: ['mt-5'],
        //     type: 'outline-success',
        //     value: 'Send Email',
        //     margin: '0px 0px 0px 20px'
        // });
        // sendEmailButton.add();
    }
}
// @END-File
