import NewForm from './NewForm.js'
import EditForm from './EditForm.js'

export default {
    list: 'AllTypes',
    display: 'All Types',
    options: {
        files: true
    },
    fields: [
        {
            name: 'SLOT',
            display: 'Single Line of Text',
            type: 'slot',
            validate(value) {
                if (value === 'Test') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: 'Lookup',
            display: 'Lookup',
            type: 'lookup',
            lookupList: 'MLOT',
            lookupField: 'MLOT'
            // validate(value) {
            //     if (value === 'Test') {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // }
        },
        {
            name: 'MLOT',
            display: 'Multiple Lines of Text',
            type: 'mlot',
            validate(value) {
                if (value === 'Test') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: 'Number',
            type: 'number',
            validate(value) {
                if (value === 1) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: 'Choice',
            type: 'choice',
            value: null,
            choices: [
                'One',
                'Two',
                'Three'
            ],
            validate(value) {
                if (value === 'Two') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: 'MultiChoice',
            display: 'Multi Choice',
            type: 'multichoice',
            fillIn: true,
            choices: [
                'One',
                'Two',
                'Three'
            ],
            validate(value) {
                if (value.length) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ],
    newForm: NewForm,
    editForm: EditForm
}