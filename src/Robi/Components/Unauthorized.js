import { Alert } from './Alert.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function Unauthorized({ parent }) {
    const alertBanner = Alert({
        type: 'robi-primary',
        text: `Sorry! You don't have access to that page.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}
// @END-File
