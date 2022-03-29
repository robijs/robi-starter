// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import {  } from '../../Robi/Robi.js'
import { Button as Btn } from '../../Robi/RobiUI.js'

// @START-Button
export default async function Button({ parent }) {
    const btn = Btn({
        value: 'Compare',
        type: 'robi',
        parent,
        async action() {

        }
    });

    btn.add();
}
// @END-Button
