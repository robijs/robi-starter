import { Card } from './Card.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'

// @START-File
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
        width: '100%',
        margin: '20px 0px 0px 0px',
        background: App.get('backgroundColor'),
        titleBorder: 'none',
        radius: '20px',
        parent
    });

    accountInfoCard.add();

    const {
        Title, LoginName, Email, Role,
    } = Store.user();

    /** Name */
    const nameField = SingleLineTextField({
        label: 'Name',
        value: Title,
        readOnly: true,
        fieldMargin: '10px 0px 0px 0px',
        parent: accountInfoCard
    });

    nameField.add();

    /** Account */
    const accountField = SingleLineTextField({
        label: 'Account',
        value: LoginName,
        readOnly: true,
        fieldMargin: '0px 0px 0px 0px',
        parent: accountInfoCard
    });

    accountField.add();

    /** Email */
    const emailField = SingleLineTextField({
        label: 'Email',
        value: Email,
        readOnly: true,
        fieldMargin: '0px 0px 1px 0px',
        parent: accountInfoCard
    });

    emailField.add();

    /** Role */
    const roleField = SingleLineTextField({
        label: 'Role',
        value: Role || 'User',
        readOnly: true,
        fieldMargin: '0px',
        parent: accountInfoCard
    });

    roleField.add();
}
// @END-File
