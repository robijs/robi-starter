import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Post } from './Post.js'

// @START-File
/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export async function DeleteColumn(param) {
    const {
        list,
        name
    } = param;

    // Don't create columns with reserved SharePoint names
    if (name === 'Title' || name === 'Id') {
        // Console 
        console.log(`Column '${name}'can't be deleted`);

        // Add to Install Console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Column '${name}'can't be deleted</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            progressBar.update();
        }

        return;
    }
    
    // Get new request digest
    const requestDigest = await GetRequestDigest();
    
    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields/GetByTitle('${name}')`,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
            "IF-MATCH": "*",
            "X-HTTP-Method": "DELETE",
        }
    }

    const deletedField = await Post(postOptions);

    // Console success
    console.log(`Deleted column '${name}'`);

    // Append to install-console
    const installConsole = Store.get('install-console');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Deleted column '${name}' from list '${list}'</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    const progressBar = Store.get('install-progress-bar');

    if (progressBar) {
        progressBar.update();
    }

    return deletedField;
}
// @END-File
