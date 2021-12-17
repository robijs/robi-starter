import { Store } from '../Core/Store.js'
import { GetRequestDigest } from './GetRequestDigest.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function CopyFile(param) {
    const {
        source,
        target,
        path,
        file,
        appName,
        appTitle,
        theme
    } = param;

    const sourceSiteUrl = source + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files('" + file + "')/$value";
    const targetSiteUrl = target + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + file + "',overwrite=true)";
    const srcRequestDigest = await GetRequestDigest({ site: source });
    const getFileValue = await fetch(sourceSiteUrl, {
        method: 'GET',
        headers: {
            'binaryStringRequestBody': 'true',
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': srcRequestDigest
        }
    });

    let contents = file === 'app.js' ? await getFileValue.text() : await getFileValue.arrayBuffer();

    // TODO: Add check for App/src path so other paths that you might want to copy an app.js file from aren't affected
    if (file === 'app.js') {
        console.log('CopyFile.js', {
            source,
            target,
            path,
            file,
            appName,
            appTitle,
            theme
        });

        // Name
        contents = contents.replace(/\/\* @START-name \*\/([\s\S]*?)\/\* @END-name \*\//, `/* @START-name */'${appName}'/* @END-name */`);

        // Title
        contents = contents.replace(/\/\* @START-title \*\/([\s\S]*?)\/\* @END-title \*\//, `/* @START-title */'${appTitle}'/* @END-title */`);

        // Theme
        contents = contents.replace(/\/\* @START-theme \*\/([\s\S]*?)\/\* @END-theme \*\//, `/* @START-theme */'${theme}'/* @END-theme */`);
    }

    console.log(contents);

    const newFile = await fetch(targetSiteUrl, {
        method: 'POST',
        body: contents, 
        headers: {
            'binaryStringRequestBody': 'true',
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': srcRequestDigest
        }
    });

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    if (newFile) {
        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created file '${file}'</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        if (progressBar) {
            progressBar.update();
        }
    }

    return newFile;
}
// @END-File
