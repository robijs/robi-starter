import { Get } from '../Actions/Get.js'
import { Alert } from './Alert.js'
import { ChoiceField } from './ChoiceField.js'
import { NameField } from './NameField.js'
import { SingleLineTextField } from './SingleLineTextField.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function NewUser(param) {
    const {
        table, modal, parent, list, event
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
        label: 'Name',
        // description: 'If an account is found, Account and Email Fields will be set automatically.',
        parent,
        onSearch(query) {
            console.log(query);
        },
        onSelect(data) {
            const {
                event, user
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
        type: 'robi-secondary',
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
    const roleField = ChoiceField({
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

    return {
        async onCreate(event) {
            // Create user
            console.log(event);
        }
    };
}
// @END-File
