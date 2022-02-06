import { Alert } from './Alert.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function Missing({ parent }) {
    const alertBanner = Alert({
        type: 'robi-primary',
        text: `Sorry! That page doesn't exist.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}
// @END-File
