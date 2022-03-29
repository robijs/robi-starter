// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { Editor } from '../../Robi/Robi.js'
import { Row, Title } from '../../Robi/RobiUI.js'

// @START-ModifyFile
export default async function ModifyFile({ parent, route }) {
    // @START-Rows
    Row((parent) => {
        Editor({
            path: `App/src/Routes/${route.path}`,
            file: `${route.path}.js`,
            parent
        });
    })
    // @END-Rows
}
// @END-ModifyFile
