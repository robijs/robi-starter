// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { Table } from '../../Robi/RobiUI.js'
import { NewForm } from './NewForm.js'

// @START-LookupField
export default async function LookupField(param) {
    const {
        parent,
    } = param;

    await Table({
		list: 'SLOT',
        newForm: NewForm,
		parent
	});
}
// @END-LookupField
