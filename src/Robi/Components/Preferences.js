import { Get } from '../Actions/Get.js'
import { Container } from './Container.js';
import { LoadingSpinner } from './LoadingSpinner.js' 
import { MyTheme } from './MyTheme.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function Preferences({ parent }) {
    const themePreference = MyTheme({
        parent
    });

    themePreference.add();
}
// @END-File
