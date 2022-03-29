// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { Store } from '../../Robi/Robi.js'
import { Button, IconField } from '../../Robi/RobiUI.js'

// @START-SelectIcon
export default async function SelectIcon({ parent }) {
    const btn = Button({
        type: 'robi',
        value: 'Value',
        classes: ['mb-4', 'w-100'],
        parent,
        action() {
            alert(iconField.value());
        }
    });

    btn.add();

    const iconField = IconField({
        parent,
        icons: Store.get('svgdefs').getIcons()
    });

    iconField.add();

    const resetBtn = Button({
        type: 'robi-light',
        value: 'Reset',
        classes: ['mt-4', 'w-100'],
        parent,
        action() {
            iconField.value('');
        }
    });

    resetBtn.add();
}
// @END-SelectIcon
