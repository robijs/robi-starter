import { Container } from './Container.js'
import { Button } from './Button.js'
import { BannerMenu } from '../RobiUI.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function Alerts({ parent }) {
    const btn = Button({
        value: 'Edit',
        type: 'robi',
        parent,
        action() {
            BannerMenu();
        }
    });

    btn.add();
}
// @END-File
