import { App } from '../Core/App.js'

// @START-File
// TODO: Export array instead of function?
/**
 * @param {*} param
 * @returns
 */
export function Lists() {
    return [
        {
            list: 'Settings',
            fields: [
                {
                    name: "Key",
                    type: 'slot'
                },
                {
                    name: "Value",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'Searches',
            fields: [
                {
                    name: "List",
                    type: 'slot'
                },
                {
                    name: "Searches",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'Actions',
            fields: [
                {
                    name: "Action",
                    type: 'slot'
                },
                {
                    name: "FileNames",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'Comments',
            fields: [
                {
                    name: "FK_ParentId",
                    type: 'number'
                },
                {
                    name: "Comment",
                    type: 'mlot'
                },
                {
                    name: "SubmitedBy",
                    type: 'slot'
                },
                {
                    name: "LoginName",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Errors',
            fields: [
                {
                    name: "SessionId",
                    type: 'slot'
                },
                {
                    name: "Message",
                    type: 'mlot'
                },
                {
                    name: "Error",
                    type: 'mlot'
                },
                {
                    name: "Source",
                    type: 'mlot'
                },
                {
                    name: "UserAgent",
                    type: 'mlot'
                },
                {
                    name: "Status",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Log',
            fields: [
                {
                    name: "SessionId",
                    type: 'slot'
                },
                {
                    name: "Message",
                    type: 'mlot'
                },
                {
                    name: "StackTrace",
                    type: 'mlot'
                },
                {
                    name: "Module",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'ReleaseNotes',
            fields: [
                {
                    name: "Summary",
                    type: 'slot'
                },
                {
                    name: "Description",
                    type: 'mlot'
                },
                {
                    name: "Status",
                    type: 'slot'
                },
                {
                    name: "MajorVersion",
                    type: 'slot'
                },
                {
                    name: "MinorVersion",
                    type: 'slot'
                },
                {
                    name: "PatchVersion",
                    type: 'slot'
                },
                {
                    name: "ReleaseType",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Roles',
            fields: [
                {
                    name: 'Title',
                    required: false,
                    value: 'View',
                    type: 'slot'
                },
                {
                    name: 'Role',
                    type: 'slot'
                }
            ],
            items: [
                {
                    Role: 'Administrator'
                },
                {
                    Role: 'Developer'
                },
                {
                    Role: 'User'
                }
            ]
        },
        {
            list: 'Questions',
            fields: [
                {
                    name: 'Body',
                    type: 'mlot'
                },
                {
                    name: 'ParentId',
                    type: 'number'
                },
                {
                    name: 'QuestionId',
                    type: 'number'
                },
                {
                    name: 'QuestionType',
                    type: 'slot'
                },
                {
                    name: 'Featured',
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Users',
            fields: [
                {
                    name: 'Title',
                    display: 'Name',
                    required: false,
                    type: 'slot'
                },
                {
                    name: 'Email',
                    type: 'slot'
                },
                {
                    name: "LoginName",
                    display: 'Login Name',
                    type: 'slot'
                },
                {
                    name: "Roles",
                    type: 'multichoice',
                    choices: [
                        'Administrator',
                        'Developer',
                        'User'
                    ].concat(App.get('roles') || [])
                },
                {
                    name: "Settings",
                    type: 'mlot'
                }
            ],
            views: [
                {
                    name: 'Users',
                    fields: [
                        'Title',
                        'Email',
                        'LoginName',
                        'Roles'
                    ]
                }
            ]
        },
        {
            list: 'Feedback',
            display: 'Feedback',
            options: {
                files: true
            },
            fields: [
                {
                    name: 'Summary',
                    display: 'Summary',
                    type: 'slot'
                },
                {
                    name: 'Description',
                    display: 'Description',
                    type: 'mlot'
                },
                {
                    name: 'Notes',
                    display: 'Notes',
                    type: 'mlot'
                },
                {
                    name: 'Status',
                    display: 'Status',
                    value: 'Submitted',
                    type: 'choice',
                    choices: [
                        'Submitted',
                        'Cancelled',
                        'Completed',
                        'In Progress',
                        'Next Revision',
                        'On Hold',
                        'Awaiting Feedback'
                    ]
                },
                {
                    name: 'RequestedDate',
                    display: 'Requested Date',
                    type: 'date'
                },
                {
                    name: 'DueDate',
                    display: 'Due Date',
                    type: 'date'
                },
                {
                    name: 'CompletedDate',
                    display: 'Completed Date',
                    type: 'date'
                },
                {
                    name: 'RequestedBy',
                    display: 'RequestedBy',
                    type: 'SLOT'
                },
                {
                    name: 'URL',
                    display: 'URL',
                    type: 'slot'
                },
                {
                    name: 'Section',
                    display: 'Area, Form, or Section',
                    type: 'slot'
                },
                {
                    name: 'SessionId',
                    display: 'Session ID',
                    type: 'slot'
                },
                {
                    name: 'UserAgent',
                    display: 'User Agent',
                    type: 'mlot'
                },
                {
                    name: 'LocalStorage',
                    display: 'Local Storage',
                    type: 'mlot'
                },
                {
                    name: 'SessionStorage',
                    display: 'Session Storage',
                    type: 'mlot'
                },
                {
                    name: 'Logs',
                    display: 'Logs',
                    type: 'mlot'
                }
            ]
        }
    ];
}
// @END-File
