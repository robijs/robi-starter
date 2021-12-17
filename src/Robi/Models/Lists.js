// @START-File
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
                    name: "Role",
                    type: 'choice',
                    choices: [
                        'Administrator',
                        'Developer',
                        'User'
                    ]
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
                        'Role'
                    ]
                }
            ]
        }
    ];
}
// @END-File
