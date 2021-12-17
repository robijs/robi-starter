import { Title } from './Title.js'
import { Alert } from './Alert.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function Unauthorized(param) {
    const { parent } = param;

    const viewTitle = Title({
        title: `403`,
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
// @END-File
