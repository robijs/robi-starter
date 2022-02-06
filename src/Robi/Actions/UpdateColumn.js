import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { Post } from './Post.js'
import { GetRequestDigest } from './GetRequestDigest.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function UpdateColumn(param) {
    const {
        list, field
    } = param;

    const {
        name, description, type, choices, fillIn, title, required, lookupList, lookupField, value
    } = field;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // TODO: Check if field exists first
    const getField = await fetch(`${App.get('site')}/_api/web/lists/getByTitle('${list}')/fields/getbytitle('${name}')`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': requestDigest
        }
    });
    const response = await getField.json();

    if (!response?.d) {
        // FIXME: update progress bar or error out?
        console.log(`Field ${name} not found in list ${list}.`);
        return;
    }

    let data = {
        "__metadata": {
            "type": response.d.__metadata.type
        }
    };

    // if (choices !== undefined) {
    //     // data. = '';
    // }
    // if (fillIn !== undefined) {
    //     // data. = '';
    // }
    // if (title !== undefined) {
    //     // data. = '';
    // }
    // if (lookupList !== undefined) {
    //     // data. = '';
    // }
    // if (lookupField !== undefined) {
    //     // data. = '';
    // }
    if (required !== undefined) {
        data.Required = required;
    }

    if (description !== undefined) {
        data.Description = description;
    }

    if (value !== undefined) {
        data.DefaultValue = value;
    }

    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields/GetByTitle('${name}')`,
        data,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
            "X-RequestDigest": requestDigest,
        }
    };

    await Post(postOptions);

    try {
        // Console success
        console.log(`Updated column '${name}'`);

        // Append to install-console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Updated column '${name}'</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            progressBar.update();
        }
    } catch (error) {
        console.log(error);
    }
}
// @END-File
