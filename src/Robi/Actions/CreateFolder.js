import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Post } from './Post.js'

// @START-File
/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function CreateFolder(param) {
    const {
        site,
        web,
        path,
        name
    } = param;

    // PROD
    if (App.isProd()) {
        // Get new request digest
        const requestDigest = await GetRequestDigest();

        // Check if dir exists
        const query = await fetch(`${site || App.get('site')}${web ? `/${web}` : ''}/_api/web/GetFolderByServerRelativeUrl('${path}')/folders?$filter=Name eq '${name}'`, {
            method: 'GET',
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-type": "application/json; odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        });

        const response = await query.json();
        
        if (response.d.results[0]) {
            console.log(`Folder '${name}' already exists in '${path}'`);
        }

        const postOptions = {
            url: `${site || App.get('site')}${web ? `/${web}` : ''}/_api/web/folders`,
            // url: `${web ? `${site}/${web}` : App.get('site')}/_api/web/folders`,
            data: {
                "__metadata":{
                    "type":"SP.Folder"
                },
                "ServerRelativeUrl": `${path}/${name}`
            },
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        }

        const copyItem = await Post(postOptions);

        // Get install console and progress bar robi components
        const installConsole = Store.get('install-console');
        const progressBar = Store.get('install-progress-bar');

        if (copyItem) {
            if (installConsole) {
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code>Created folder '${path}'</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code>----------------------------------------</code>
                    </div>
                `);

                installConsole.get().scrollTop = installConsole.get().scrollHeight;
            }

            if (progressBar) {
                progressBar.update();
            }

            return copyItem;
        }

        return;
    }


    // DEV
    if (App.isDev()) {
        // TODO: Simulate creating a folder in a doc lib
    }
}
// @END-File
