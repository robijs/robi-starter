import { Authorize } from '../Actions/Authorize.js'
import { Title } from './Title.js'
import { Table } from './Table.js'
import { NewUser } from './NewUser.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function Users(param) {
    const { parent, itemId } = param;

    /** Authorize */
    const isAuthorized = Authorize('Users');

    if (!isAuthorized) {
        return;
    }

    const viewTitle = Title({
        title: 'Users',
        date: `${new Date().toLocaleString('default', {
            dateStyle: 'full'
        })}`,
        type: 'across',
        parent
    });

    viewTitle.add();

    const usersTable = await Table({
        list: 'Users',
        heading: '',
        view: 'Users',
        formView: 'All',
        newForm: NewUser,
        parent
    });

    /** Open modal */
    if (itemId) {
        const row = usersTable.findRowById(itemId);

        if (row) {
            if (row.show) {
                row.show().draw(false).node().click();
            } else {
                row.draw(false).node().click();
            }
        }
    }
}
// @END-File
