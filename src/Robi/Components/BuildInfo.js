import { Get } from '../Actions/Get.js'
import { Card } from './Card.js'
import { LoadingSpinner } from './LoadingSpinner.js' 
import { SingleLineTextField } from './SingleLineTextField.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function BuildInfo(param) {
    const {
        parent,
    } = param;

    const accountInfoCard = Card({
        title: 'Build',
        width: '100%',
        margin: '20px 0px 0px 0px',
        parent
    });

    accountInfoCard.add();
    // Show loading
    const loadingIndicator = LoadingSpinner({
        message: 'Loading robi build',
        type: 'robi',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    // Settings
    const appSettings = await Get({
        list: 'Settings',
        filter: `Key eq 'Build' or Key eq 'Version'`
    });

    // Remove loading
    loadingIndicator.remove();

    // Version
    const nameField = SingleLineTextField({
        label: 'Version',
        value: appSettings.find(item => item.Key === 'Version')?.Value,
        readOnly: true,
        fieldMargin: '10px 0px 0px 0px',
        parent: accountInfoCard
    });

    nameField.add();

    // Build
    const accountField = SingleLineTextField({
        label: 'Build',
        value: appSettings.find(item => item.Key === 'Build')?.Value,
        readOnly: true,
        fieldMargin: '0px 0px 0px 0px',
        parent: accountInfoCard
    });

    accountField.add();
}
// @END-File
