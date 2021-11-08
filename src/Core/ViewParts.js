import {
    CreateItem,
    DeleteItem,
    Get,
    Route,
    UpdateItem
} from '../Core/Actions.js'
import {
    Alert,
    BootstrapButton,
    BootstrapDropdown,
    Button,
    Card,
    Comments as C_Comments,
    Container,
    DashboardBanner,
    DataTable,
    FoldingCube,
    Heading,
    Modal,
    MultiLineTextField,
    NameField,
    NewReply,
    NumberField,
    Question as C_Question,
    QuestionCard,
    ReleaseNotes as C_ReleaseNotes,
    Reply,
    SingleLineTextField,
    SiteUsage as C_SiteUsage,
    StatusField,
    Toast
} from './Components.js'
import Store from './Store.js'
import { App } from './Settings.js'
import { Lists, Question as M_Question, StartAndEndOfWeek } from './Models.js'
import lists from '../lists.js'

/**
 * 
 * @param {*} param 
 */
export async function AccountInfo(param) {
    const {
        parent,
    } = param;

    const accountInfoCard = Card({
        title: 'Account',
        titleColor: App.get('primaryColor'),
        width: '100%',
        margin: '20px 0px 0px 0px',
        parent
    });

    accountInfoCard.add();

    const {
        Title,
        LoginName,
        Email,
        Role,
    } = Store.user();

    /** Name */
    const nameField = SingleLineTextField({
        label: 'Name',
        value: Title,
        readOnly: true,
        fieldMargin: '0px 0px 20px 0px',
        parent: accountInfoCard
    });

    nameField.add();

    /** Account */
    const accountField = SingleLineTextField({
        label: 'Account',
        value: LoginName,
        readOnly: true,
        fieldMargin: '0px 0px 20px 0px',
        parent: accountInfoCard
    });

    accountField.add();
    
    /** Email */
    const emailField = SingleLineTextField({
        label: 'Email',
        value: Email,
        readOnly: true,
        fieldMargin: '0px 0px 20px 0px',
        parent: accountInfoCard
    });

    emailField.add();

    /** Role */
    const roleField = SingleLineTextField({
        label: 'Role',
        value: Role || 'User',
        readOnly: true,
        fieldMargin: '0px 0px 20px 0px',
        parent: accountInfoCard
    });

    roleField.add();
}

/**
 * 
 * @param {*} param 
 */
export async function Comments(param) {
    const {
        parentId,
        parent,
        position,
        width
    } = param;

    /** Comments */
    const comments = await Get({
        list: 'Comments',
        filter: `FK_ParentId eq ${parentId}`,
        sort: 'Id desc'
    });

    const commentsComponent = C_Comments({
        comments,
        width,
        parent,
        position,
        parentId
    });

    commentsComponent.add();

    /** Start polling */
    let start = new Date();
    let end = new Date();

    // setInterval(startPoll, 2000);

    async function startPoll() {
        console.log('Start:\t', start.toLocaleTimeString());
        console.log('End:\t',end.toLocaleTimeString());

        const newComments = await Get({
            list: 'Comments',
            filter: `Account ne '${App.user.Account}' and FK_ParentId eq ${parentId} and Created ge datetime'${start.toISOString()}' and Created lt datetime'${end.toISOString()}'`
        });

        console.log(newComments);

        newComments.forEach(comment => {
            commentsComponent.addComment(comment);
        });

        start = end;
        end = new Date();
    }
}

/**
 * 
 * @param {*} param 
 */
export async function DeveloperLinks(param) {
    const {
        parent,
    } = param;

    addSection({
        title: 'SharePoint',
        buttons: [
            {
                value: 'Site Settings',
                url: `${App.get('site')}/_layouts/15/settings.aspx`
            },
            {
                value: `Site Contents`,
                url: `${App.get('site')}/_layouts/15/viewlsts.aspx`
            },
            {
                value: `Add an app`,
                url: `${App.get('site')}/_layouts/15/addanapp.aspx`
            }
        ]
    });

    addSection({
        title: `App Lists`,
        buttons: lists.map(item => {
            const { list } = item;

            return {
                value: list,
                url: `${App.get('site')}/Lists/${list}`
            }
        })
    });

    addSection({
        title: `Core Lists`,
        buttons: [
            {
                value: `Errors`,
                url: `${App.get('site')}/Lists/Errors`
            },
            {
                value: `Log`,
                url: `${App.get('site')}/Lists/Log`
            },
            {
                value: `Questions`,
                url: `${App.get('site')}/Lists/Questions`
            },
            {
                value: `Settings`,
                url: `${App.get('site')}/Lists/Settings`
            },
            {
                value: `Users`,
                url: `${App.get('site')}/Lists/Users`
            },
            {
                value: `Release Notes`,
                url: `${App.get('site')}/Lists/ReleaseNotes`
            }
        ]
    });

    addSection({
        title: `Libraries`,
        buttons: [
            {
                value: `App`,
                url: `${App.get('site')}/App`
            },
            {
                value: `Documents`,
                url: `${App.get('site')}/Shared%20Documents`
            }
        ]
    });

    // addSection({
    //     title: `Schemas`,
    //     buttons: [

    //     ]
    // });

    // addSection({
    //     title: `Business Rules`,
    //     buttons: [

    //     ]
    // });

    function addSection(param) {
        const {
            title,
            buttons
        } = param;

        /** Pages */
        const card = Card({
            title,
            titleColor: App.get('primaryColor'),
            width: '100%',
            margin: '20px 0px 0px 0px',
            parent
        });

        card.add();
        
        buttons.forEach(button => {
            const {
                value,
                url
            } = button;

            const settingsButton = Button({
                type: 'normal',
                value,
                margin: '10px 0px 0px 0px',
                parent: card,
                async action(event) {
                    window.open(url);
                }
            });
        
            settingsButton.add();
        });
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function EditForm(param) {
    const { event, fields, item, list, modal, parent, table } = param;
    
    console.log(param);

    const components = fields
    ?.filter(field => field.name !== 'Id')
    ?.map(field => {
        const { name, display, type, choices, action } = field;

        let component = {};

        switch (type) {
            case 'slot':
                component = SingleLineTextField({
                    label: display || name,
                    value: item[name],
                    parent
                });
                break;
            case 'mlot':
                component = MultiLineTextField({
                    label: display || name,
                    value: item[name],
                    parent
                });
                break;
            case 'number':
                component = NumberField({
                    label: display || name,
                    value: item[name],
                    parent
                });
                break;
            case 'choice':
                component = BootstrapDropdown({
                    label: display || name,
                    value: item[name] || choices[0],
                    options: choices.map(choice => {
                        return {
                            label: choice
                        }
                    }),
                    parent
                });
                break;
        }

        component.add();

        return {
            component,
            field
        };
    });

    return {
        async onUpdate(event) {
            const data = {};
            
            components
            .forEach(item => {
                const { component, field } = item;
                const { name, type} = field;

                switch (type) {
                    case 'slot':
                    case 'mlot':
                    case 'choice':
                        data[name] = component.value();
                        break;
                    case 'number':
                        data[name] = parseInt(component.value() || 0);
                        break;
                }
            });

            console.log(data);

            const updatedItem = await UpdateItem({
                list,
                itemId: item.Id,
                data
            });

            return updatedItem;
        },
        async onDelete(event) {
            const deletedItem = await DeleteItem({
                list,
                itemId: item.Id
            });

            return deletedItem;
        }
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function EditQuestion(param) {
    const {
        question,
        parent,
        modal
    } = param;
    
    const {
        Title,
        Body
    } = question;

    /** Title */
    const titleField = SingleLineTextField({
        label: 'Question',
        description: '',
        value: Title,
        width: '100%',
        fieldMargin: '0px 40px 20px 40px',
        parent,
        onKeydown(event) {
            if (event.target.innerText) {
                modal.getButton('Update').disabled = false;
            } else {
                modal.getButton('Update').disabled = true;
            }
            
            submit(event);
        }
    });
    
    titleField.add();

    /** Body */
    const bodyField = MultiLineTextField({
        label: 'Description',
        description: '',
        value: Body,
        width: '100%',
        fieldMargin: '20px 40px',
        optional: true,
        parent,
        onKeydown(event) {
            submit(event);
        }
    });
    
    bodyField.add();

    /** Control + Enter to submit */
    function submit(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            const submit = modal.getButton('Update');
            
            if (!submit.disabled) {
                submit.click();
            }
        }
    }

    /** Focus on name field */
    titleField.focus();

    return {
        getFieldValues() {
            const data = {
                Title: titleField.value(),
                Body: bodyField.value(),
            }

            if (!data.Title) {
                /** @todo field.addError() */

                return false;
            }

            return data;
        }
    };
}

/**
 * EditUser
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export function ErrorForm(param) {
    const {
        row,
        table,
        item,
        parent
    } = param;

    const readOnlyFields = [
        {
            internalFieldName: 'Id',
            displayName: 'Id'
        },
        {
            internalFieldName: 'SessionId',
            displayName: 'Session Id'
        },
        {
            internalFieldName: 'Source',
            displayName: 'Source'
        },
        {
            internalFieldName: 'Message',
            displayName: 'Message',
            type: 'mlot'
        },
        {
            internalFieldName: 'Error',
            displayName: 'Error',
            type: 'mlot'
        },
        {
            internalFieldName: 'Line',
            displayName: 'Line Number'
        },
        {
            internalFieldName: 'ColumnNumber',
            displayName: 'Column Number'
        },
        {
            internalFieldName: 'Created',
            displayName: 'Created',
            type: 'date'
        },
        {
            internalFieldName: 'Author',
            displayName: 'Author'
        }
    ];

    const readOnlyContainer = Container({
        direction: 'column',
        width: '100%',
        padding: '0px 20px',
        parent
    });

    readOnlyContainer.add();

    readOnlyFields.forEach(field => addReadOnlyField(field, readOnlyContainer));

    /** Add Read Only Field */
    function addReadOnlyField(field, parent) {
        const {
            internalFieldName,
            displayName,
            type
        } = field;
        
        let value = item[internalFieldName]?.toString();

        if (type === 'date') {
            value = new Date(item[internalFieldName]);
        }

        else if (type === 'mlot') {
            value = item[internalFieldName]?.split('<hr>').join('\n');
        }

        else if (internalFieldName === 'Author') {
            value = item.Author.Title
        }

        const component = SingleLineTextField({
            label: displayName,
            value: value || /*html*/ `<span style='font-size: 1em; display: inline' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Status */
    const statusField = StatusField({
        async action(event) {
           statusField.value(event.target.innerText);

           const updatedItem = await UpdateItem({
                list: 'Errors',
                itemId: item.Id,
                select: 'Id,Message,Error,Source,Line,ColumnNumber,SessionId,Status,Created,Author/Title',
                expand: 'Author/Id',
                data: {
                    Status: event.target.innerText
                }
           });

           console.log(`Error Item Id: ${item.Id} updated.`, updatedItem);

           /** Update Table Row */
           table.updateRow({
                row,
                data: updatedItem
            });

            /** Show toast */
            const toast = Toast({
                text: `Id <strong>${item.Id}</strong> set to <strong>${updatedItem.Status}</strong>!`,
                type: 'bs-toast',
                parent: Store.get('maincontainer')
            });

            toast.add();
        },
        parent,
        label: 'Status',
        margin: '0px 20px 40px 20px',
        value: item.Status || 'Not Started'
    });

    statusField.add();
    
    /** Logs */
    Logs({
        sessionId: item.SessionId,
        parent,
    });

    /** Comments */
    Comments({
        parentId: item.Id,
        padding: '0px 20px',
        parent,
    });

    return {
        getFieldValues() {
            const data = {
              
            };

            return data;
        }
    };
}

export async function Errors(param) {
    const {
        sessionId,
        parent
    } = param;

    /** Errors Container */
    const errorsContainer = Container({
        display: 'block',
        width: '100%',
        parent
    });

    errorsContainer.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading errors',
        margin: '40px 0px',
        parent
    });
    
    loadingIndicator.add();

    /** Get Errors */
    const errors = await Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,Line,ColumnNumber,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        filter: `SessionId eq '${sessionId}'`
    });

    console.log(errors);

    if (errors.length === 0) {
        const alertCard = Alert({
            text: 'No errors associated with this Session Id',
            type: 'success',
            margin: '0px 20px',
            parent: errorsContainer
        });

        alertCard.add();
    } else {
        const legendHeading = Heading({
            text: `<strong>Errors:</strong> ${errors.length}`,
            size: '1.3em',
            color: 'crimson',
            margin: '0px 20px 20px 20px',
            parent: errorsContainer
        });
    
        legendHeading.add();
    }

    /** Add Errors to Alert */
    errors.forEach((item, index) => {
        const alertCard = Alert({
            text: '',
            type:'danger',
            margin: '0px 20px 20px 20px',
            parent: errorsContainer
        });

        alertCard.add();

        const goToErrorButton = BootstrapButton({
            action(event) {
                Route(`Developer/Errors/${item.Id}`);
            },
            parent: alertCard,
            margin: '20px 0px',
            type: 'btn-danger',
            value: `Go to error ${item.Id}`
        });

        goToErrorButton.add();

        const readOnlyFields = [
            {
                internalFieldName: 'Message',
                displayName: 'Message',
                type: 'mlot'
            },
            {
                internalFieldName: 'Error',
                displayName: 'Error',
                type: 'mlot'
            },
            {
                internalFieldName: 'Line',
                displayName: 'Line Number'
            },
            {
                internalFieldName: 'ColumnNumber',
                displayName: 'Column Number'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created',
                type: 'date'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            },
            {
                internalFieldName: 'Status',
                displayName: 'Status'
            }
        ];
    
        readOnlyFields.forEach(field => addReadOnlyField(field));
    
        /** Add Read Only Field */
        function addReadOnlyField(field, parent) {
            const {
                internalFieldName,
                displayName,
                type
            } = field;
            
            let value = item[internalFieldName]?.toString();
    
            if (type === 'date') {
                value = new Date(item[internalFieldName]);
            }

            else if (type === 'mlot') {
                value = item[internalFieldName]?.split('<hr>').join('\n');
            }
    
            else if (internalFieldName === 'Author') {
                value = item.Author.Title
            }

            else if (internalFieldName === 'Status') {
                switch (item.Status) {
                    case 'Not Started':
                    default:
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-danger'>Not Started</span>`;
                        break;
                    case 'In Progress':
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-info'>Not Started</span>`
                        break;
                    case 'Completed':
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-success'>Not Started</span>`
                        break;
                }
            }
    
            const component = SingleLineTextField({
                label: displayName,
                value: value || /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-dark'>No data</span>`,
                readOnly: true,
                fieldMargin: '0px',
                parent: alertCard
            });
    
            component.add();
        }
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

/**
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export function LogForm(param) {
    const {
        item,
        parent
    } = param;

    const readOnlyFields = [
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
            internalFieldName: 'FiscalYear',
            displayName: 'FiscalYear'
        },
        {
            internalFieldName: 'Module',
            displayName: 'Module',
        },
        {
            internalFieldName: 'Message',
            displayName: 'Message'
        },
        {
            internalFieldName: 'StackTrace',
            displayName: 'Stack Trace',
            type: 'mlot'
        },
        {
            internalFieldName: 'Created',
            displayName: 'Created',
            type: 'date'
        },
        {
            internalFieldName: 'Author',
            displayName: 'Author'
        }
    ];

    const readOnlyContainer = Container({
        direction: 'column',
        width: '100%',
        padding: '0px 20px',
        parent
    });

    readOnlyContainer.add();

    readOnlyFields.forEach(field => addReadOnlyField(field, readOnlyContainer));

    /** Add Read Only Field */
    function addReadOnlyField(field, parent) {
        const {
            internalFieldName,
            displayName,
            type
        } = field;
        
        let value = item[internalFieldName]?.toString();

        if (type === 'date') {
            value = new Date(item[internalFieldName]);
        }

        else if (type === 'mlot') {
            value = item[internalFieldName].split('<hr>').join('\n');
        }

        else if (internalFieldName === 'Message') {
            const data = JSON.parse(item.Message);
            
            value = /*html*/ `
                <table>
            `;

            for (const property in data) {
                value += /*html*/ `
                    <tr>
                        <th style='padding-right: 15px;'>${property}</th>
                        <td>${data[property]}</td>
                    </tr>
                `;
            }

            value += /*html*/ `
                </table>
            `;
        }

        else if (internalFieldName === 'Author') {
            value = item.Author.Title
        }

        const component = SingleLineTextField({
            label: displayName,
            value: value || /*html*/ `<span style='font-size: 1em; display: inline;' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Errors */
    Errors({
        sessionId: item.SessionId,
        parent
    });

    return {
        getFieldValues() {
            const data = {
              
            };

            return data;
        }
    };
}

/**
 * 
 * @param {*} param 
 */
export async function Logs(param) {
    const {
        sessionId,
        parent
    } = param;

    /** Errors Container */
    const errorsContainer = Container({
        display: 'block',
        width: '100%',
        parent
    });

    errorsContainer.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading logs',
        margin: '40px 0px',
        parent
    });
    
    loadingIndicator.add();

    /** Get Errors */
    const logs = await Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        filter: `SessionId eq '${sessionId}'`
    });

    console.log(logs);

    /** Summary Card */
    const alertCard = Alert({
        text: logs.length > 0 ? 
            /*html*/ `
                <h5>Logs: ${logs.length}</h5>
                <hr>
            ` : 
            'No logs associated with this Session Id',
        type: logs.length > 0 ? 'info' : 'warning',
        margin: '0px 20px',
        parent: errorsContainer
    });

    alertCard.add();

    /** Add Errors to Alert */
    logs.forEach((item, index) => {
        const goToErrorButton = BootstrapButton({
            action(event) {
                Route(`Developer/Logs/${item.Id}`);
            },
            parent: alertCard,
            margin: '0px 0px 20px 0px',
            type: 'btn-info',
            value: `Go to log: ${item.Id}`
        });

        goToErrorButton.add();

        const readOnlyFields = [
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Title',
                displayName: 'Type'
            },
            {
                internalFieldName: 'FiscalYear',
                displayName: 'FiscalYear'
            },
            {
                internalFieldName: 'Module',
                displayName: 'Module',
            },
            {
                internalFieldName: 'Message',
                displayName: 'Message',
            },
            {
                internalFieldName: 'StackTrace',
                displayName: 'Stack Trace',
                type: 'mlot'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created',
                type: 'date'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ];
    
        readOnlyFields.forEach(field => addReadOnlyField(field));
    
        /** Add Read Only Field */
        function addReadOnlyField(field, parent) {
            const {
                internalFieldName,
                displayName,
                type
            } = field;
            
            let value = item[internalFieldName]?.toString();
    
            if (type === 'date') {
                value = new Date(item[internalFieldName]);
            }

            else if (type === 'mlot') {
                value = item[internalFieldName].split('<hr>').join('\n');
            }

            else if (internalFieldName === 'Message') {
                const data = JSON.parse(item.Message);
                
                value = /*html*/ `
                    <table>
                `;

                for (const property in data) {
                    value += /*html*/ `
                        <tr>
                            <th style='padding-right: 15px;'>${property}</th>
                            <td>${data[property]}</td>
                        </tr>
                    `;
                }

                value += /*html*/ `
                    </table>
                `;
            }
    
            else if (internalFieldName === 'Author') {
                value = item.Author.Title
            }

            const component = SingleLineTextField({
                label: displayName,
                value: value || /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-dark'>No data</span>`,
                readOnly: true,
                fieldMargin: '0px',
                parent: alertCard
            });
    
            component.add();
        }

        if (index < logs.length - 1) {
            alertCard.get().insertAdjacentHTML('beforeend', '<hr>');
        }
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function NewForm(param) {
    const { event, fields, list, modal, parent, table } = param;
    
    const fieldsToCreate = fields?.filter(field => field.name !== 'Id');
    const components = fieldsToCreate?.map((field, index) => {
        const { name, display, type, choices, action } = field;

        let component = {};

        switch (type) {
            case 'slot':
                component = SingleLineTextField({
                    label: display || name,
                    parent
                });
                break;
            case 'mlot':
                component = MultiLineTextField({
                    label: display || name,
                    parent
                });
                break;
            case 'number':
                component = NumberField({
                    label: display || name,
                    parent
                });
                break;
            case 'choice':
                component = BootstrapDropdown({
                    label: display || name,
                    value: choices[0],
                    options: choices.map(choice => {
                        return {
                            label: choice
                        }
                    }),
                    parent
                });
                break;
        }

        component.add();

        return {
            component,
            field
        };
    });

    return {
        async onCreate(event) {
            const data = {};
            
            components
            .forEach(item => {
                const { component, field } = item;
                const { name, type} = field;

                switch (type) {
                    case 'slot':
                    case 'mlot':
                    case 'choice':
                        data[name] = component.value();
                        break;
                    case 'number':
                        data[name] = parseInt(component.value() || 0);
                        break;
                }
            });

            console.log(data);

            const newItem = await CreateItem({
                list,
                data
            });

            return newItem;
        }
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
 export async function NewUser(param) {
    const {
        table,
        modal,
        parent,
        list,
        event
    } = param;

    /** Name */
    // const nameField = NameField({
    //     label: 'Search CarePoint Accounts',
    //     description: 'If an account is found, Account and Email Fields will be set automatically.',
    //     fieldMargin: '0px 40px 20px 40px',
    //     parent,
    //     onInput(event) {
    //         const value = event.target.innerText;

    //         if (!value) {
    //             accountField.value('');
    //             emailField.value('');
    //         }
    //     },
    //     async onSetValue(data) {
    //         const {
    //             info
    //         } = data.newValue;

    //         if (info) {
    //             const {
    //                 Account,
    //                 WorkEmail
    //             } = info;

    //             /** Check if account exists */
    //             if (Account !== '')  {
    //                 const userItem = await Get({
    //                     list: 'Users',
    //                     select: 'Id,LoginName',
    //                     filter: `LoginName eq '${Account.split('|')[2]}'`
    //                 });

    //                 if (userItem[0]) {
    //                     readOnlyCard.update({
    //                         type: 'secondary'
    //                     });

    //                     accountField.value('None');
    //                     emailField.value('None');
    //                     nameField.value('');

    //                     const link = `Users/${userItem[0].Id}`;

    //                     nameField.addError({
    //                         text: /*html*/ `
    //                             An account for this user already exists. <span class='alert-link' data-route='${link}'>Click here to view it.</span> Or search for another name.
    //                         `
    //                     });

    //                     return;
    //                 } else {
    //                     nameField.removeError();
    //                 }
    //             }

    //             readOnlyCard.update({
    //                 type: 'success'
    //             });

    //             if (Account) {
    //                 accountField.value(Account.split('|')[2]);
    //             }

    //             if (WorkEmail) {
    //                 emailField.value(WorkEmail);
    //             }
    //         }
    //     }
    // });

    // nameField.add();

    /** Name Field */
    const nameField = NameField({
        label: 'Search CarePoint Accounts',
        description: 'If an account is found, Account and Email Fields will be set automatically.',
        parent,
        onSearch(query) {
            console.log(query);
        },
        onSelect(data) {
            const {
                event,
                user
            } = param;

            console.log(data);
        },
        onClear(event) {
            console.log('clear name fields');
        }
    });

    nameField.add();

    /** Read Only Card */
    const readOnlyCard = Alert({
        text: '',
        type: 'secondary',
        parent
    });

    readOnlyCard.add();

    /** Account */
    const accountField = SingleLineTextField({
        label: 'Account',
        value: 'None',
        readOnly: true,
        parent: readOnlyCard
    });

    accountField.add();

    /** Email */
    const emailField = SingleLineTextField({
        label: 'Email',
        value: 'None',
        readOnly: true,
        parent: readOnlyCard
    });

    emailField.add();

    const roles = await Get({
        list: 'Roles'
    });

    /** Role */
    const roleField = BootstrapDropdown({
        label: 'Role',
        value: 'User',
        options: roles.map(item => {
            const { Title } = item;

            return { label: Title };
        }),
        width: '200px',
        parent
    });

    roleField.add();

    // Focus in name field
    nameField.focus();

    return {
        async onCreate(event) {
            // Create user
            console.log(event);
        }
    };
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function NewQuestion(param) {
    const {
        parent,
        modal
    } = param;

    /** First Name */
    const titleField = SingleLineTextField({
        label: 'Question',
        description: '',
        width: '100%',
        fieldMargin: '0px 40px 20px 40px',
        parent,
        onKeydown(event) {
            if (event.target.innerText) {
                modal.getButton('Submit').disabled = false;
            } else {
                modal.getButton('Submit').disabled = true;
            }
            
            submit(event);
        }
    });
    
    titleField.add();

    /** Middle Name */
    const bodyField = MultiLineTextField({
        label: 'Description',
        description: '',
        width: '100%',
        fieldMargin: '20px 40px',
        optional: true,
        parent,
        onKeydown(event) {
            submit(event);
        }
    });
    
    bodyField.add();

    /** Control + Enter to submit */
    function submit(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            const submit = modal.getButton('Submit');
            
            if (!submit.disabled) {
                submit.click();
            }
        }
    }

    /** Focus on name field */
    titleField.focus();

    return {
        getFieldValues() {
            const data = {
                Title: titleField.value(),
                Body: bodyField.value(),
            }

            if (!data.Title) {
                /** @todo field.addError() */

                return false;
            }

            return data;
        }
    };
}

/**
 * 
 * @param {*} param 
 */
export function Question(param) {
    const {
        question,
        parent
    } = param;

    /** New Question Form */
    let editQuestionForm;

    /** Question */
    const questionComponent = C_Question({
        question,
        parent,
        onEdit(event) {
            const modal = Modal({
                title: 'Ask a question',
                showFooter: true,
                addContent(modalBody) {
                    editQuestionForm = EditQuestion({
                        question,
                        modal,
                        parent: modalBody
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
                            value: 'Update',
                            classes: 'btn-success',
                            async onClick(event) {
                                /** Disable button */
                                event.target.disabled = true;
                                event.target.innerHTML = /*html*/ `
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating
                                `;

                                /** Update question */
                                const updatedItem = await UpdateItem({
                                    list: 'Questions',
                                    select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                                    expand: `Author/Id,Editor/Id`,
                                    itemId: question.Id,
                                    data: editQuestionForm.getFieldValues()
                                });

                                const updatedQuestion = M_Question({
                                    question: updatedItem,
                                    replies: question.replies
                                });

                                const questions = Store.get('Model_Questions');
                                const index = questions.indexOf(question);

                                console.log(index);

                                questions.splice(index, 1, updatedQuestion);

                                /** Add new quesiton card to DOM */
                                questionComponent.setQuestion(updatedQuestion);

                                /** Completed */
                                event.target.disabled = false;
                                event.target.innerHTML = 'Updated!';

                                /** close and remove modal */
                                modal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });
    
            modal.add();
        }
    });

    questionComponent.add();

    /** Replies */
    const {
        replies
    } = question;

    replies
    .sort((a, b) => {
        a = a.Id;
        b = b.Id;
        
        /** Ascending */
        if (a < b) {
            return -1;
        }
        
        if (a > b) {
            return 1;
        }
    
        // names must be equal
        return 0;
    })
    .forEach(reply => {
        const replyComponent = Reply({
            reply,
            margin: '0px 0px 10px 0px',
            parent,
            onEdit(value) {
                replyOnEdit({
                    reply,
                    replyComponent,
                    value
                });
            }
        });
    
        replyComponent.add();
    });

    async function replyOnEdit(param) {
        const {
            reply,
            replyComponent,
            value
        } = param;

        if (value !== reply.Body) {
            /** Update question */
            const updatedItem = await UpdateItem({
                list: 'Questions',
                select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                expand: `Author/Id,Editor/Id`,
                itemId: reply.Id,
                data: {
                    Body: value
                }
            });

            const index = replies.indexOf(reply);

            console.log('reply index: ', index);

            replies.splice(index, 1, updatedItem);

            /** Updated modified text */
            replyComponent.setModified(updatedItem);
        }
    }

    /** New Reply */
    const newReply = NewReply({
        width: '100%',
        parent,
        async action(value) {
            // console.log(value);

            /** Create item */
            const newItem = await CreateItem({
                list: 'Questions',
                select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                expand: `Author/Id,Editor/Id`,
                data: {
                    Title: 'Reply',
                    Body: value,
                    ParentId: question.Id,
                    QuestionId: question.Id,
                    QuestionType: question.QuestionType
                }
            });

            /** Update Last Reply footer */
            questionComponent.updateLastReply(newItem);

            /** Increment replies */
            questionComponent.addCount();

            /** Add to replies */
            replies.push(newItem);

            // console.log(newItem);

            /** Add to DOM */
            const replyComponent = Reply({
                reply: newItem,
                label: 'new',
                margin: '0px 0px 10px 0px',
                parent: newReply,
                position: 'beforebegin',
                onEdit(value) {
                    replyOnEdit({
                        reply: newItem,
                        replyComponent,
                        value
                    });
                }
            });
        
            replyComponent.add();
        }
    });

    newReply.add();

    /** Register event */
    document.addEventListener('keydown', event => {
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
            questionComponent.editButton().click();
        }

        if (event.ctrlKey && event.altKey && event.key === 'r') {
            newReply.focus();
        }
    });
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function QuestionCards(param) {
    const {
        parent,
        path,
        questions
    } = param;

    if (typeof parent === 'object' && parent.empty) {
        parent.empty();
    }

    /** Info Alert Container */
    const alertContainer = Container({
        parent,
        display: 'flex',
        width: '100%',
        justify: 'flex-end',
    });

    alertContainer.add();

    /** Light Alert */
    const lightAlert = Alert({
        type: 'blank',
        text: `${questions.length} question${questions.length === 1 ? '' : 's'}`,
        margin: '20px 0px -10px 0px',
        parent: alertContainer
    });

    lightAlert.add();

    /** Questions */
    // questions.forEach(question => {
    //     const thisQuestionsReplies = replies.filter(reply => reply.QuestionId === question.Id);

    //     const questionCard = QPPQuestionCard({
    //         question,
    //         replyCount: thisQuestionsReplies.length,
    //         lastReply: thisQuestionsReplies[0],
    //         path: `Questions/${path}`,
    //         margin: '20px 0px',
    //         parent
    //     });

    //     questionCard.add();
    // });

    questions
    .sort((a, b) => {
        a = a.Id;
        b = b.Id;
        
        /** Descending */
        if (a > b) {
            return -1;
        }
        
        if (a < b) {
            return 1;
        }
    
        // names must be equal
        return 0;
    })
    .forEach(question => {
        const questionCard = QuestionCard({
            question,
            path: `Questions/${path}`,
            margin: '15px 0px',
            parent
        });

        questionCard.add();
    });

    return {
        addCard(question) {
            /** Add card to DOM */
            const questionCard = QuestionCard({
                question,
                label: 'new',
                path: `Questions/${path}`,
                margin: '15px 0px',
                parent: alertContainer,
                position: 'afterend'
            });
    
            questionCard.add();

            /** Update count */
            const refreshedQuestions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            lightAlert.get().innerHTML = `${refreshedQuestions.length} question${refreshedQuestions.length === 1 ? '' : 's'}`;
        }
    }
}

/**
 * 
 * @param {*} param 
 */
export async function ReleaseNotes(param) {
    const {
        parent,
        margin
    } = param;

    const releaseNotesCard = Card({
        title: 'Release Notes',
        titleColor: App.get('primaryColor'),
        width: '100%',
        margin: margin || '20px 0px 0px 0px',
        parent
    });

    releaseNotesCard.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading release notes',
        margin: '40px 0px',
        parent: releaseNotesCard
    });
    
    loadingIndicator.add();

    /** Get Items */
    const releaseNotes = await Get({
        list: 'ReleaseNotes',
        select: 'Id,Summary,Description,MajorVersion,MinorVersion,PatchVersion,ReleaseType',
        filter: `Status eq 'Published'`
    });

    if (releaseNotes?.length === 0) {
        const alertInfo = Alert({
            text: 'No release notes have been published for any version',
            type: 'secondary',
            margin: '20px 0px 0px 0px',
            parent: releaseNotesCard
        });

        alertInfo.add();
    }

    const groups = {};

    releaseNotes?.forEach(note => {
        const {
            MajorVersion,
            MinorVersion,
            PatchVersion
        } = note;

        const version = `${MajorVersion}.${MinorVersion}.${PatchVersion}`;

        if (!groups[version]) {
            groups[version] = [];
        }

        groups[version].push(note);
    });

    const versions = [];
    
    for (const key in groups) {
        versions.push(key);
    }
    
    for (let i = versions.length-1; i >= 0; i--) {
        const releaseNotesComponent = C_ReleaseNotes({
            version: versions[i],
            notes: groups[versions[i]],
            parent: releaseNotesCard
        });
    
        releaseNotesComponent.add();
    }

    /** Remove loading indicator */
    loadingIndicator.remove();
}

/**
 * 
 * @param {*} param 
 */
export async function SiteUsage(param) {
    const {
        parent
    } = param;

    /** Dashboard */
    const dashboardCard = Card({
        title: 'Site Usage',
        titleColor: App.get('primaryColor'),
        width: '100%',
        margin: '20px 0px 0px 0px',
        parent
    });

    dashboardCard.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading Site Usage Information',
        margin: '40px 0px',
        parent: dashboardCard
    });
    
    loadingIndicator.add();

    const workerPath = App.get('mode') === 'prod' ? '../' : `${App.get('site')}/src/`

    /** Worker */
    const worker = new Worker(`${workerPath}Core/Workers/SiteUsage.js`, {
        type: 'module'
    });

    worker.postMessage({
        envMode: App.get('mode'),
        site: App.get('site')
    });

    Store.addWorker(worker);

    worker.onmessage = event => {
        const {
            data
        } = event;

        // console.log(data);

        /** Stats 1 */
        const stats_1 = DashboardBanner({
            data: data.stats_1,
            padding: '0px',
            border: 'none',
            margin: '10px 0px 0px 0px',
            parent: dashboardCard
        });

        stats_1.add();

        /** Bar Chart */
        const longCard = C_SiteUsage({
            data: data.model,
            parent: dashboardCard,
            border: 'none',
            margin: '10px 0px',
            padding: '0px',
            onClick(label) {
                console.log('label:', label);
                console.log('current selected chart:', selectedChart);

                if (label !== selectedChart) {
                    selectedChart = label;
                    selectedData = data.model.chart[label];

                    console.log('new selected chart:', selectedChart)
                    console.log('new selected data:', selectedData)

                    longCard.clearChart();

                    const chart = addChart({
                        card: longCard,
                        type: selectedChart,
                        data: selectedData
                    });
                } else {
                    console.log('*** already selected ***');
                }
            }
        });

        longCard.add();

        /** Start with type: 'week' on load */
        let selectedChart = 'today';
        let selectedData = data.model.chart[selectedChart];

        addChart({
            card: longCard,
            type: selectedChart,
            data: selectedData
        });
        
        /** Stats 2 */
        const stats_2 = DashboardBanner({
            data: data.stats_2,
            padding: '0px',
            border: 'none',
            margin: '0px',
            parent: dashboardCard
        });

        stats_2.add();

        /** Remove Loading Indicator */
        loadingIndicator.remove();
    };

    /** Add Chart */
    function addChart(param) {
        const {
            card, 
            type, 
            data
        } = param;

        const chart = card.getChart();
        const max0 = Math.max(...data[0].data.map(set => set.length)); /** Largest number from Breaches */
        const max1 = 0;
        // const max1 = Math.max(...data[1].data.map(set => set.length)); /** Largest number from Complaints */
        const max = (Math.ceil((max0 + max1) / 10) || 1 ) * 10; /** Round sum of max numbers to the nearest multiple of 10 */
        // const max = (Math.round((max0 + max1) / 10) || 1 ) * 10; /** Round sum of max numbers to the nearest multiple of 10*/
        // const max = (Math.ceil((Math.max(...data.map(item => Math.max(...item.data)))) / 10) || 1 ) * 10;

        let stepSize;
        let labels;
        let text;

        if (max < 50) {
            stepSize = 1;
        } else {
            stepSize = 10;
        }

        switch(type) {
            case 'today':
                labels = [
                    '00:00',
                    '01:00',
                    '02:00',
                    '03:00',
                    '04:00',
                    '05:00',
                    '06:00',
                    '07:00',
                    '08:00',
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                    '15:00',
                    '16:00',
                    '17:00',
                    '18:00',
                    '19:00',
                    '20:00',
                    '21:00',
                    '22:00',
                    '23:00'
                ];
                text = new Date().toLocaleDateString('default', {
                    dateStyle: 'full'
                });
                break;
            case 'week':
                const options = {
                    month: 'long',
                    day: 'numeric'
                };    
                const startAndEndOfWeek = StartAndEndOfWeek();
                const sunday = startAndEndOfWeek.sunday.toLocaleString('default', options);
                const saturday = startAndEndOfWeek.saturday.toLocaleString('default', options);
                
                // labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                text = `${sunday} - ${saturday}, ${startAndEndOfWeek.sunday.getFullYear()}`
                break;
            case 'month':
                labels = data[0].data.map((item, index) => index + 1);
                text = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
                break;
            case 'year':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                text = new Date().getFullYear();
                break;
            default:
                console.log('missing type');
                break;
        }

        card.setTitle(text);

        return new Chart(chart, {
            type: 'bar',
            data: {
                labels,
                datasets: data.map((set, index) => {
                    /** [0] set is purple, [1] set is blue */
                    return {
                        data: set.data.map(item => item.length),
                        label: set.label,
                        backgroundColor: index === 0 ? `rgb(${App.get('primaryColorRGB')}, 0.2)` : 'rgb(67, 203, 255, 0.2)',
                        borderColor: index === 0 ? `rgb(${App.get('primaryColorRGB')}, 1)` : 'rgb(67, 203, 255, 1)',
                        // backgroundColor: index === 0 ? 'rgb(147, 112, 219, 0.2)' : 'rgb(67, 203, 255, 0.2)',
                        // borderColor: index === 0 ? 'rgb(147, 112, 219, 1)' : 'rgb(67, 203, 255, 1)',
                        borderWidth: 1
                    }
                })
            },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            /** Set to max value in dataset */
                            // max,
                            min: 0,
                            stepSize
                        }
                    }],
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function Table(param) {
    const {
        addButton,
        addButtonValue,
        border,
        checkboxes,
        createdRow,
        defaultButtons,
        displayForm,
        editForm,
        editFormTitle,
        filter,
        formFooter,
        formTitleField,
        headerFilter,
        heading,
        headingColor,
        headingMargin,
        headingSize,
        list,
        newForm,
        onUpdate,
        order,
        parent,
        showId,
        striped,
        titleDisplayName
    } = param;

    let {
        buttons,
        fields,
        items
    } = param;

    /** Heading */
    if (heading || list) {
        const legendHeading = Heading({
            text: heading || list,
            size: headingSize,
            color: headingColor,
            margin: headingMargin || '20px 0px 15px 0px',
            parent
        });
    
        legendHeading.add();
    }

    /** Columns */
    const headers = [];
    const columns = [];

    if (checkboxes !== false) {
        headers.push('');
        columns.push({
            data: null,
        });
    }
    
    /** Item Id */
    const idProperty = 'Id';

    if (list) {
        // Show loading
        parent.append(/*html*/ `
            <div class='loading-spinner w-100 d-flex flex-column justify-content-center align-items-center'>
                <div class="mb-2" style='font-weight: 600; color: darkgray'>Loading ${list}</div>
                <div class="spinner-grow" style='color: darkgray' role="status"></div>
            </div>
        `);

        items = await Get({
            list,
            filter
        });
        
        // Find list in core or user defined lists
        fields = lists.concat(Lists()).find(item => item.list === list)?.fields;

        if (!fields) {
            console.log('Missing fields');
            return;
        }
        
        // Remove loading
        parent.find('.loading-spinner').remove();

        // Add Id field
        fields.unshift({
            name: 'Id',
            display: 'Id',
            type: 'number'
        });

        fields.forEach(field => {
            const {
                name,
                display,
                type,
                render
            } = field;
            
            headers.push(display || name);

            const columnOptions = {
                data: name === titleDisplayName ? 'Title' : name,
                type: name === 'Id' ? 'number' : 'string',
                visible: name === 'Id' && !showId ? false : true
            }

            /** Classes */
            if (name === 'Id') {
                columnOptions.className = 'do-not-export bold';
                columnOptions.render = (data, type, row) => {
                    return data;
                }
            }

            /** Render */
            if (render) {
                columnOptions.render = render
            }

            else if (name.includes('Percent')) {
                columnOptions.render = (data, type, row) => {
                    return `${Math.round(parseFloat(data || 0) * 100)}%`;
                }
            } 

            else if (type === 'mlot') {
                columnOptions.render = (data, type, row) => {
                    return /*html*/ `
                        <div class='dt-mlot'>${data || ''}</data>
                    `;
                }
            }

            else if (name === 'Author') {
                columnOptions.render = (data, type, row) => {
                    return data.Title;
                }
            }

            else if (name.includes('Created') || name.includes('Date')) {
                columnOptions.render = (data, type, row) => {
                    return new Date(data).toLocaleString();
                }
            }

            else if (name !== 'Id') {
                columnOptions.render = (data, type, row) => {
                    return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
                }
            }

            columns.push(columnOptions);
        });
    } else {
        /** typeof fields === 'object' */
        (Array.isArray(fields) ? fields : fields.split(','))
        .forEach(field => {
            const {
                render
            } = field;
            
            const internalFieldName = typeof field === 'object' ? field.internalFieldName : field;
            const displayName = typeof field === 'object' ? field.displayName : field;
            const type = typeof field === 'object' ? field.type || 'slot' : 'slot';

            headers.push(displayName);

            const columnOptions = {
                data: internalFieldName === titleDisplayName ? 'Title' : internalFieldName,
                type: internalFieldName === 'Id' ? 'number' : 'string',
                visible: internalFieldName === 'Id' && !showId ? false : true
            }

            /** Classes */
            if (internalFieldName === 'Id') {
                columnOptions.className = 'do-not-export bold';
                columnOptions.render = (data, type, row) => {
                    return data;
                }
            }

            /** Render */
            if (render) {
                columnOptions.render = render
            }

            else if (internalFieldName.includes('Percent')) {
                columnOptions.render = (data, type, row) => {
                    return `${Math.round(parseFloat(data || 0) * 100)}%`;
                }
            } 

            else if (type === 'mlot') {
                columnOptions.render = (data, type, row) => {
                    return /*html*/ `
                        <div class='dt-mlot'>${data || ''}</data>
                    `;
                }
            }

            else if (internalFieldName === 'Author') {
                columnOptions.render = (data, type, row) => {
                    return data.Title;
                }
            }

            else if (internalFieldName.includes('Created') || internalFieldName.includes('Date')) {
                columnOptions.render = (data, type, row) => {
                    return new Date(data).toLocaleString();
                }
            }

            else if (internalFieldName !== 'Id') {
                columnOptions.render = (data, type, row) => {
                    return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
                }
            }

            columns.push(columnOptions);
        });
    }

    /** Table Buttons */
    if (defaultButtons !== false) {
        if (!Array.isArray(buttons)) {
            buttons = [];
        }

        if (checkboxes !== false) {
            buttons = buttons.concat([
                {
                    text: /*html*/ `
                        <svg class='icon'>
                            <use href='#icon-bs-trash'></use>
                        </svg>
                    `,
                    className: 'delete-item mr-4',
                    name: 'delete',
                    enabled: false,
                    action: async function (e, dt, node, config) {
                        const selected = table.selected();
    
                        console.log('Delete selected:', selected);
    
                        // Delete items
                        for (let row in selected) {
                            console.log(selected[row]);
    
                            // Delete item
                            await DeleteItem({
                                list,
                                itemId: selected[row].Id
                            });
    
                            // Delete Row
                            table.removeRow(selected[row].Id);
                        }
                    }
                }
            ]);
        }

        buttons = buttons.concat([
            {
                extend: 'excelHtml5',
                // className: 'ml-50',
                exportOptions: {
                    header: false,
                    footer: false,
                    columns: ':not(.do-not-export):not(.select-checkbox)'
                }
            },
            {
                extend: 'csvHtml5',
                exportOptions: {
                    header: false,
                    footer: false,
                    columns: ':not(.do-not-export):not(.select-checkbox)'
                }
            },
            {
                extend: 'pdfHtml5',
                orientation: 'landscape',
                exportOptions: {
                    columns: ':not(.do-not-export):not(.select-checkbox)'
                }
            }
            // {
            //     extend: 'copyHtml5',
            //     exportOptions: {
            //         columns: [3,4,5,6,7,8,9,10,11]
            //     }
            // },
        ]);
    }

    if (addButton !== false) {
        buttons.unshift({
            text: /*html*/ `
                <svg class='icon'>
                    <use href='#icon-bs-plus'></use>
                </svg>
                <span>${addButtonValue || 'Add item'}</span>
            `,
            className: 'add-item mr-4',
            name: 'add',
            action: function (e, dt, node, config) {
                const newModal = Modal({
                    title: `New Item`,
                    scrollable: false,
                    async addContent(modalBody) {
                        const formParam = {
                            event: e,
                            fields,
                            list,
                            modal: newModal,
                            parent: modalBody,
                            table
                        };

                        selectedForm = newForm ? await newForm(formParam) : await NewForm(formParam);

                        newModal.showFooter();
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
                            // TODO: send modal prop to form
                            {
                                value: 'Create',
                                classes: 'btn-success',
                                async onClick(event) {
                                    // Disable button - Prevent user from clicking this item more than once
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating');

                                    // Call newForm.onCreate() and wait for it to complete
                                    const newItem = await selectedForm?.onCreate(event);

                                    if (newItem) {
                                        table.addRow({
                                            data: newItem
                                        });
                                    }

                                    // Enable button
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Created');
    
                                    // Close modal (DOM node will be removed on hidden.bs.modal event)
                                    newModal.close();
                                }
                            }
                        ]
                    },
                    parent
                });
    
                newModal.add();
            }
        });
    }

    /** Selected form */
    let selectedItem;
    let selectedRow;
    let selectedForm;

    // console.log('Table headers', headers);
    // console.log('Table columns', columns);

    /** Table */
    const table = DataTable({
        headers,
        headerFilter,
        checkboxes: checkboxes !== false ? true : false,
        striped: striped || false,
        border: border || false,
        width: '100%',
        columns,
        data: items,
        rowId: idProperty,
        /**
         * Sort by Status then Last Name 
         * {@link https://datatables.net/reference/api/order()}
         */
        order: order || [[ 1, 'asc' ]],
        buttons,
        createdRow,
        onRowClick(param) { // Note: This is where the click event is handled for datatables;
            const {
                row,
                item
            } = param;

            /** Set row */
            selectedRow = row;

            /** Set user */
            selectedItem = item;

            /** Show User */
            const rowModal = Modal({
                // if editFormTitle else heading...
                title: 'Edit item',
                scrollable: false,
                async addContent(modalBody) {
                    const formParam = { item, table, row, fields, list, modal: rowModal, parent: modalBody };

                    selectedForm = editForm ? await editForm(formParam) : await EditForm(formParam);

                    if (formFooter !== false) {
                        rowModal.showFooter();
                    }
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
                            value: 'Update',
                            // disabled: true,
                            classes: 'btn-primary',
                            async onClick(event) {
                                /** Disable button - Prevent user from clicking this item more than once */
                                $(event.target)
                                    .attr('disabled', '')
                                    .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating');

                                // Call newForm.onUpdate() and wait for it to complete
                                const updatedItem = await selectedForm?.onUpdate(event);

                                if (updatedItem) {
                                    table.updateRow({
                                        row: selectedRow,
                                        data: updatedItem
                                    });
                                }

                                /** Enable button */
                                $(event.target)
                                    .removeAttr('disabled')
                                    .text('Updated');

                                /** Hide modal */
                                rowModal.getModal().modal('hide');
                            }
                        },
                        {
                            value: 'Delete',
                            // disabled: true,
                            classes: 'btn-danger',
                            async onClick(event) {
                                /** Disable button - Prevent user from clicking this item more than once */
                                $(event.target)
                                    .attr('disabled', '')
                                    .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleteing');

                                // Call newForm.onDelete() and wait for it to complete
                                await selectedForm?.onDelete(event);

                                table.removeRow(selectedItem.Id);

                                /** Enable button */
                                $(event.target)
                                    .removeAttr('disabled')
                                    .text('Deleted');

                                /** Hide modal */
                                rowModal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });

            rowModal.add();
        },
        onSelect(param) {
            const selected = table.selected();

            console.log('select', selected);

            if (selected.length > 0) {
                table.DataTable().buttons('delete:name').enable();
            }
        },
        onDeselect(param) {
            const selected = table.selected();

            console.log('deselect', selected);

            if (selected.length === 0) {
                table.DataTable().buttons('delete:name').disable();
            }
        },
        onDraw(param) {
            const {
                jqevent,
                table
            } = param;

            // const data = table.rows({ search: 'applied' }).data().toArray();
            
            // console.log(param);
        },
        parent
    });

    table.add();

    return table;
}
