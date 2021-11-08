import { Authorize, Get, CreateItem, UpdateItem, DeleteItem, Route, AttachFiles, UploadFiles, SendEmail } from '../Core/Actions.js'
import { 
    Title,
    Alert,
    Container,
    RequestAssitanceInfo,
    FoldingCube,
    Card,
    Modal,
    BootstrapButton,
    Timer,
    UploadButton,
    QuestionsToolbar,
    DevConsole,
    QuestionType
} from '../Core/Components.js'
import { App } from '../Core/Settings.js'
import Store from '../Core/Store.js'

/** View Parts */
import {
    Table,
    NewUser,
    AccountInfo,
    DeveloperLinks,
    ReleaseNotes,
    SiteUsage,
    ErrorForm,
    LogForm,
    Question as VP_Question,
    QuestionCards,
    NewQuestion
} from '../Core/ViewParts.js'

/** Models */
import { Question as M_Question, Questions as M_Questions } from './Models.js'

/**
 * 
 */
export async function Home() {
    /** View Parent */
    const parent = Store.get('maincontainer');

    /** View Title */
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Subtitle (Ex: Application/Abbreviation Full Name)`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();
}

/**
 * 
 */
export async function Help() {
    const parent = Store.get('maincontainer');

    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Help`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '20px 0px 0px 0px',
        parent
    });

    viewContainer.add();

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
        parent: viewContainer
    });

    requestAssistanceInfo.add();
}

/**
 * 
 */
export async function Unauthorized() {
    const parent = Store.get('maincontainer');

    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `403`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const alertBanner = Alert({
        type: 'warning',
        text: `Sorry! You don't have access to this page. Please select a different option from the menu on the left.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}

/**
 * 
 */
export async function Missing() {
    const parent = Store.get('maincontainer');

    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `404`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const alertBanner = Alert({
        type: 'info',
        text: `Sorry! That page doesn't appear to exist. Please choose an option from the sidebar on the left.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function Users(param = {}) {
    const {
        itemId
    } = param;

    /** Authorize */
    const isAuthorized = Authorize('Users');

    if (!isAuthorized) {
        return;
    }

    const parent = Store.get('maincontainer');

    const viewTitle = Title({
        title: App.get('title'),
        subTitle: 'Users',
        date: `${new Date().toLocaleString('default', {
            dateStyle: 'full'
        })}`,
        type: 'across',
        parent
    });

    viewTitle.add();

    const usersTable = Table({
        list: 'Users',
        newForm: NewUser,
        parent
    });

    /** Open modal */
    if (itemId) {
        const row = usersTable.findRowById(itemId);

        if (row) {
            row.show().draw(false).node().click();
        }
    }
}

/**
 * 
 */
export async function Settings() {
    const parent = Store.get('maincontainer');

    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Settings`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    AccountInfo({
        parent
    });

    /** Authorize */
    if (Store.user().Role === 'Developer') {
        DeveloperLinks({
            parent
        });
    }

    ReleaseNotes({
        parent
    });

    /** Authorize */
    if (Store.user().Role === 'Developer') {
        SiteUsage({
            parent
        });
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function Developer(param) {
    /** Authorize */
    const isAuthorized = Authorize('Developer');

    if (!isAuthorized) {
        return;
    }
    
    /** View Parent */
    const parent = Store.get('maincontainer');
    
    /** View Title */
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: 'Developer',
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const devConsole = DevConsole({
        parent
    });

    devConsole.add();

    const logLoadingIndicator = FoldingCube({
        label: 'Loading logs',
        margin: '40px 0px',
        parent
    });
        
    logLoadingIndicator.add();

    const log = await Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        top: '25',
        // skip: '0',
        // paged: true
    });

    // console.log(log);

    const logTable = await Table({
        heading: 'Logs',
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id'
            },
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Title',
                displayName: 'Type'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ],
        buttons: [
            
        ],
        showId: true,
        addButton: false,
        checkboxes: false,
        formTitleField: 'Id',
        order: [[ 0, 'desc' ]],
        items: log,
        editForm: LogForm,
        editFormTitle: 'Log',
        parent
    });

    logLoadingIndicator.remove();

    const errorsLoadingIndicator = FoldingCube({
        label: 'Loading errors',
        margin: '40px 0px',
        parent
    });
        
    errorsLoadingIndicator.add();

    const errors = await Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,SessionId,Status,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        top: '25'
    });

    const errorsTable = await Table({
        heading: 'Errors',
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id'
            },
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ],
        showId: true,
        addButton: false,
        checkboxes: false,
        formFooter: false,
        formTitleField: 'Id',
        order: [[ 0, 'desc' ]],
        items: errors,
        editForm: ErrorForm,
        editFormTitle: 'Error',
        parent
    });

    errorsLoadingIndicator.remove();

    // /** Data Loading Indicator */
    // const dataLoadingIndicator = FoldingCube({
    //     label: 'Loading data',
    //     margin: '40px 0px',
    //     parent
    // });
        
    // dataLoadingIndicator.add();

    // // const items = await Get({
    // //     list: '[LIST NAME]'
    // // });
    
    // // console.log(items);

    // /** Alert Message */
    // const loadingMessage = Alert({
    //     type: 'success',
    //     text: /*html*/ `
    //         Data loaded
    //     `,
    //     margin: '20px 0px',
    //     width: '100%',
    //     parent
    // });

    // loadingMessage.add();
    
    // /** Remove loading indicator */
    // dataLoadingIndicator.remove();

    // /** Toggle update */
    // let run = false;

    // /** Update clock and buttons */
    // const timer = Timer({
    //     parent,
    //     start() {
    //         run = true;
    //         console.log(`Run: ${run}`);

    //         update();
    //     },
    //     stop() {
    //         run = false;
    //         console.log(`Run: ${run}`);
    //     },
    //     reset() {
    //         console.log('reset');
    //     }
    // });

    // timer.add();

    // async function update() {
    //     /** Set items */
    //     for (const [index, value] of items.entries()) {
    //         if (run) {
    //             const {
    //                 Id,
    //                 Title,
    //             } = value;

    //             const newItem = await CreateItem({
    //                 list: 'FacilityPlans',
    //                 data: {
    //                     Status: 'Completed',
    //                     DMISIDId: Id,
    //                     FiscalYearId: 7
    //                 }
    //             });

    //             console.log(`Id: ${newItem.Id} Facility: ${Title} created.`);
                
    //             if (index === items.length - 1) {
    //                 timer.stop();
    //             }
    //         } else {
    //             console.log('stoped');
                
    //             break;
    //         }
    //     }
    // }

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
    //     parent,
    //     type: 'btn-outline-success',
    //     value: 'Attach file',
    //     margin: '20px 0px 20px 0px'
    // });

    // attachFilesButton.add();

    // /** Test Send Email */
    // const sendEmailButton = BootstrapButton({
    //     async action(event) {
    //         await SendEmail({
    //             From: 'i:0e.t|dod_adfs_provider|1098035555@mil',
    //             To: 'i:0e.t|dod_adfs_provider|1098035555@mil',
    //             // CC: [
    //             //     ''
    //             // ],
    //             Subject: `Test Subject`,
    //             /** @todo replace hard codeded domain */
    //             Body: /*html*/ `
    //                 <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
    //                     <p>
    //                         Test body.
    //                     </p>
    //                 </div>
    //             `
    //         });
    //     },
    //     parent,
    //     type: 'btn-outline-success',
    //     value: 'Send Email',
    //     margin: '0px 0px 0px 20px'
    // });

    // sendEmailButton.add();
    
    /** Open modal */
    if (param.pathParts.length === 3) {
        const {
            pathParts
        } = param;

        const table = pathParts[1];
        const itemId = parseInt(pathParts[2]);

        let row;

        if (table === 'Errors') {
            row = errorsTable.findRowById(itemId);
        } else if (table === 'Logs') {
            row = logTable.findRowById(itemId);
        }
        
        if (row) {
            row.show().draw(false).node()?.click();
        }
    }
}

/**
 * 
 */
export async function Questions() {
    /** View Parent */
    const parent = Store.get('maincontainer');

    /** View Title */
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Questions`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** View Container */
    const viewContainer = Container({
        display: 'inline-flex',
        direction: 'column',
        margin: '20px 0px 0px 0px',
        parent
    });

    viewContainer.add();

    /** Check local storage for questionTypes */
    let questionTypes = JSON.parse(localStorage.getItem(`${App.get('title').split(' ').join('-')}-questionTypes`));

    if (!questionTypes) {
        console.log('questionTypes not in local storage. Adding...');

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });
        
        // localStorage.setItem(`${App.get('title').split(' ').join('-')}-questionTypes`, JSON.stringify(questionTypesResponse[0].Value));
        localStorage.setItem(`${App.get('title').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);
        questionTypes = JSON.parse(localStorage.getItem(`${App.get('title').split(' ').join('-')}-questionTypes`));

        console.log('questionTypes added to local storage.');
    }

    const questions = await Get({
        list: 'Questions'
    });

    console.log(questions);

    questionTypes.forEach(type => {
        const {
            title,
            path
        } = type;

        // const card = Card({
        //     title,
        //     description: '',
        //     parent: viewContainer,
        //     margin: '0px 0px 20px 0px',
        //     width: '100%',
        //     action(event) {
        //         Route(`Questions/${path}`);
        //     }
        // });

        // card.add();

        const questionType = QuestionType({
            title,
            path,
            questions: questions.filter(item => item.QuestionType === title),
            parent
        });

        questionType.add();
    });

    // const qppQuestions = QuestionTypes({
    //     parent: viewContainer
    // });

    // qppQuestions.add();
}

/**
 * 
 * @param {*} param 
 */
export async function QuestionsBoard(param) {
    const {
        path
    } = param;

    /** View Parent */
    const parent = Store.get('maincontainer');

    /** View Title */
    let viewTitle;
    let currentType;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('title').split(' ').join('-')}-questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

       setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        viewTitle = Title({
            title: App.get('title'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-secondary' role='status'></div>
                    `,
                    path: '',
                    currentPage: true
                }
            ],
            parent,
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('title').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);

        console.log('questionTypes added to local storage.');
        
        setTitle(localStorage.getItem(`${App.get('title').split(' ').join('-')}-questionTypes`));
    }
    
    function setTitle(items) {
        /** If View Tile exists, remove from DOM */
        if (viewTitle) {
            viewTitle.remove();
        }
        
        /** Parse types */
        const types = JSON.parse(items);

        /** Find question type from passed in path */
        currentType = types.find(item => item.path === path);
        
        /** Set new title with drop down options */
        viewTitle = Title({
            title: App.get('title'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions',
                }
            ],
            dropdownGroups: [
                {
                    name: currentType.title,
                    items: types
                    //.filter(item => item.path !== path) /** filter out current selection */
                    .map(facility => {
                        const {
                            title,
                            path
                        } = facility;
            
                        return {
                            label: title,
                            path: `Questions/${path}`
                        };
                    })
                }
            ],
            route(path) {
                Route(path);
            },
            parent,
            position: 'afterbegin',
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();
    }

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px',
        parent
    });

    viewContainer.add();

    /** New Question Form */
    let newQuestionForm;

    /** Toolbar */
    const qppQuestionsToolbar = QuestionsToolbar({
        selected: 'All',
        onFilter(filter) {
            console.log(filter);

            /** param */
            const param = {
                path,
                parent: questionsContainer
            };

            const questions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            switch (filter) {
                case 'All':
                    param.questions = questions;
                    break;
                case 'Mine':
                    param.questions = questions.filter(question => {
                        // console.log(question.Author.Title, Store.user().Title);

                        return question.Author.Title === Store.user().Title;
                    });
                    break;
                case 'Unanswered':
                    param.questions = questions.filter(question => {
                        // console.log(question.replies);

                        return question.replies.length === 0;
                    });
                    break;
                case 'Answered':
                    param.questions = questions.filter(question => {
                        // console.log(question.replies);

                        return question.replies.length !== 0;
                    });
                    break;
                case 'Featured':
                    param.questions = questions.filter(question => {
                        // console.log(question.Featured);

                        return question.Featured;
                    });
                    break;
                default:
                    break;
            }

            /** Add new list of cards */
            questionCards = QuestionCards(param);
        },
        onSearch(query) {
            console.log('query: ', query);

            const questions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            const filteredQuestions = questions.filter(question => {
                const {
                    Title,
                    Body,
                    Author,
                    Created
                } = question;

                const date = `${new Date(Created).toLocaleDateString()} ${new Date(Created).toLocaleTimeString('default', {
                    hour: 'numeric',
                    minute: 'numeric'
                })}`.toLowerCase();

                if (Title.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Title: ${Title}.`);
                    
                    return question;
                } else if (Body && Body.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Body: ${Body}.`);
                    
                    return question;
                } else if (Author.Title.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Author name: ${Author.Title}.`);
                    
                    return question;
                } else if (date.includes(query)) {
                    console.log(`SEARCH - Found in Created date: ${date}.`);
                    
                    return question;
                }
            });

            /** Add new list of cards */
            questionCards = QuestionCards({
                path,
                questions: filteredQuestions,
                parent: questionsContainer
            });
        },
        onClear(event) {
            console.log(event);

            /** Add new list of cards */
            questionCards = QuestionCards({
                path,
                questions,
                parent: questionsContainer
            });
        },
        onAsk() {
            const modal = Modal({
                title: 'Ask a question',
                showFooter: true,
                background: App.get('secondaryColor'),
                addContent(modalBody) {
                    newQuestionForm = NewQuestion({
                        parent: modalBody,
                        modal
                    });
                },
                buttons: {
                    footer: [
                        {
                            value: 'Cancel',
                            classes: 'btn-secondary',
                            data: [
                                {
                                    name: 'dismiss',
                                    value: 'modal'
                                }
                            ]
                        },
                        {
                            value: 'Submit',
                            classes: 'btn-success',
                            disabled: true,
                            async onClick(event) {
                                /** Disable button */
                                event.target.disabled = true;
                                event.target.innerHTML = /*html*/ `
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting
                                `;

                                const fieldValues = newQuestionForm.getFieldValues();

                                fieldValues.ParentId = 0;
                                fieldValues.QuestionType = path;
                                
                                /** Create Question */
                                const newItem = await CreateItem({
                                    list: 'Questions',
                                    data: fieldValues
                                });

                                /** Set QuestionId */
                                const updatedItem = await UpdateItem({
                                    list: 'Questions',
                                    select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                                    expand: `Author/Id,Editor/Id`,
                                    itemId: newItem.Id,
                                    data: {
                                        QuestionId: newItem.Id
                                    }
                                });

                                console.log(Store.get('Model_Questions'));

                                const question = M_Question({
                                    question: updatedItem
                                });

                                Store.get('Model_Questions').push(question);

                                console.log(Store.get('Model_Questions'));

                                /** Add new quesiton card to DOM */
                                questionCards.addCard(question);

                                /** Completed */
                                event.target.disabled = false;
                                event.target.innerHTML = 'Submitted!';

                                /** close and remove modal */
                                modal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });
    
            modal.add();
        },
        parent: viewContainer
    });

    qppQuestionsToolbar.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading Questions',
        margin: '40px 0px',
        parent: viewContainer
    });
    
    loadingIndicator.add();

    /** Questions Container */
    const questionsContainer = Container({
        display: 'flex',
        direction: 'column',
        width: 'fit-content',
        margin: '30px 0px',
        parent: viewContainer
    });

    questionsContainer.add();

    let questions = Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await M_Questions({
            // filter: `QuestionType eq '${path}'`
        });

        questions = fetchedQuestions.filter(question => question.QuestionType === path);
        
        console.log('Model_Questions stored.');
    }

    /** Add all question cards to DOM */
    let questionCards = QuestionCards({
        path,
        questions,
        parent: questionsContainer
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

/**
 * 
 * @param {*} param 
 */
export async function Question(param) {
    const {
        path,
        itemId
    } = param;

    /** View Parent */
    const parent = Store.get('maincontainer');

    /** View Title */
    let viewTitle;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('title').split(' ').join('-')}-questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

       setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        viewTitle = Title({
            title: App.get('title'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-secondary' role='status'></div>
                    `,
                    path: '',
                    currentPage: true
                }
            ],
            parent,
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('title').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);

        console.log('questionTypes added to local storage.');
        
        // setTitle(localStorage.getItem(`${App.get('title').split(' ').join('-')}-questionTypes`))
    }
    
    function setTitle(items) {
        /** If View Tile exists, remove from DOM */
        if (viewTitle) {
            viewTitle.remove();
        }
        
        /** Parse types */
        const types = JSON.parse(items);

        /** Find question type from passed in path */
        const currentType = types.find(item => item.path === path);
        
        /** Set new title with drop down options */
        viewTitle = Title({
            title: App.get('title'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions',
                }
            ],
            dropdownGroups: [
                {
                    name: currentType.title,
                    items: types.map(facility => {
                        const {
                            title,
                            path
                        } = facility;
            
                        return {
                            label: title,
                            path: `Questions/${path}`
                        };
                    })
                },
                {
                    name:  /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-secondary' role='status'></div>
                    `,
                    dataName: 'loading-questions',
                    items: []
                }
            ],
            route(path) {
                Route(path);
            },
            parent,
            position: 'afterbegin',
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();
    }

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px',
        maxWidth: '800px',
        parent
    });

    viewContainer.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading Question',
        margin: '40px 0px',
        parent: viewContainer
    });
    
    loadingIndicator.add();

    let questions = Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await M_Questions({
            // filter: `QuestionType eq '${path}'`
        });

        questions = fetchedQuestions.filter(question => question.QuestionType === path);
        
        console.log('Model_Questions stored.');
    }

    const question = questions.find(question => question.Id === itemId);

    viewTitle.updateDropdown({
        name: 'loading-questions',
        replaceWith: {
            name: question.Title,
            dataName: question.Id,
            items: questions
            //.filter(question => question.Id !== itemId) /** filter out current question */
            .map(question => {
                const {
                    Id,
                    Title
                } = question;

                return {
                    label: Title,
                    path: `Questions/${path}/${Id}`
                }
            })
        }
    });

    /** Question */
    VP_Question({
        question,
        parent: viewContainer
    });
    
    /** Remove Loading Indicator */
    loadingIndicator.remove();
}
