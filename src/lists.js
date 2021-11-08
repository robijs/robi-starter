export default [
    {
        list: 'Test',
        fields: [
            {
                name: 'SLOT',
                display: 'Single line of text',
                type: 'slot'
            },
            {
                name: 'MLOT',
                display: 'Multiple lines of text',
                type: 'mlot'
            },
            {
                name: 'Number',
                display: 'Number',
                type: 'number'
            },
            {
                name: 'Choice',
                display: 'Choice',
                type: 'choice',
                choices: [
                    'One',
                    'Two',
                    'Three'
                ]
            }
        ]
    },
    {
        list: 'NewList',
        fields: [
            {
                name: 'FullName',
                display: 'Full Name',
                type: 'slot'
            },
            {
                name: 'FirstName',
                display: 'First Name',
                type: 'slot'
            },
            {
                name: 'Phone',
                display: 'Phone',
                type: 'slot'
            },
            {
                name: 'Email',
                display: 'Email',
                type: 'slot'
            },
            {
                name: 'Role',
                display: 'Role',
                type: 'choice',
                choices: [
                    'Dev',
                    'Admin',
                    'QA'
                ]
            }
        ]
    }
]