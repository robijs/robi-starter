import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Post } from './Post.js'

// @START-File
/**
 * Create SharePoint site.
 * @param {Object} param Interface to UpdateItem() module.   
 * @param {String} param.name SharePoint site name.
 * @param {String} param.url SharePoint site url.
 */
export async function CreateSite(param) {
    const {
        url,
        title,
        description
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // Check if site exists
    const siteResponse = await fetch(`${App.get('site')}/${url}`, {
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
        }
    });

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Creating site '${title}', please don't leave the page...</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    if (siteResponse.status !== 404) {
        console.log(`Site '${title}' already created.`);

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Site '${title}' already created</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            // +1 for the list
            progressBar.update();

            // +? litsts, plus all their fields?
        }

        return;
    }

    const postOptions = {
        url: `${App.get('site')}/_api/web/webinfos/add`,
        data: {
            'parameters': {
                '__metadata':  {
                    'type': 'SP.WebInfoCreationInformation'
                },
                'Url': url,
                'Title': title,
                'Description': description || 'This site was created with Robi.',
                'Language': 1033,
                'WebTemplate': 'sts',
                'UseUniquePermissions': false
            }
        },
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    /** Create site */
    const newSite = await Post(postOptions);

    console.log('New site:', newSite);

    if (newSite) {
        // Console success
        console.log(`Created site '${title}'`);

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created site '${title}'</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        // Deactivate MDS
        const getNewRD = await Post({
            url: `${App.get('site')}/${url}/_api/contextinfo`,
            headers: {
                "Accept": "application/json; odata=verbose",
            }
        });
        const newRD = getNewRD.d.GetContextWebInformation.FormDigestValue;
        await fetch(`${App.get('site')}/${url}/_api/web`, {
            method: 'POST',
            body: JSON.stringify({ 
                '__metadata': { 'type': 'SP.Web' },
                'EnableMinimalDownload': false
            }),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                'X-HTTP-Method': 'MERGE',
                "X-RequestDigest": newRD
            }
        });
        console.log('MDS deactivated');

        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Minimal Download Strategy (MDS) deactivated</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
        
        if (progressBar) {
            progressBar.update();
        }

        return newSite;
    }
}
// @END-File
