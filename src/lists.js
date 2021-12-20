export default [
    {
        list: 'Test',
        fields: [
            {
                name: 'SLOT',
                display: 'Single Line of Text',
                type: 'slot'
            },
            {
                name: 'MLOT',
                display: 'Multiple Lines of Text',
                type: 'mlot'
            },            {
                name: 'Choice',
                type: 'choice',
                fillIn: true,
                value: null,
                choices: [
                    'One',
                    'Two',
                    'Three'
                ]
            },
            {
                name: 'Number',
                type: 'number'
            }
        ]
    }
]