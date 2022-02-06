import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Wait } from './Wait.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function HideRoutes({ paths }) {
    // console.log(paths);

    let digest;
    let request;

    if (App.isProd()) {
        digest = await GetRequestDigest();
        request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files('app.js')/$value`, {
            method: 'GET',
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
    } else {
        request = await fetch(`http://127.0.0.1:8080/src/app.js`);
        await Wait(1000);
    }

    const value = await request.text();

    const newRoutes = paths.map(item => {
        const { path, hide } = item;
        const route = Store.routes().filter(r => !r.ignore).find(r => r.path === path);

        if (route) {
            const { title, icon } = route;

            return [
                // `        `,
                `        // @START-${path}`,
                `        {`,
                ... hide ? [`            hide: true,`] : [],
                `            path: '${path}',`,
                `            title: '${title}',`,
                `            icon: '${icon}',`,
                `            go: Route_${path}`,
                `        }`,
                `        // @END-${path}`,
                // `        `
            ].join('\n');
        }
    }).join('\n        , // @Route\n');

    // console.log(newRoutes);

    const updated = value.replace(/\/\/ @START-Routes([\s\S]*?)\/\/ @END-Routes/, `// @START-Routes\n${newRoutes}\n        // @END-Routes`);

    // console.log('OLD\n----------------------------------------\n', value);
    // console.log('\n****************************************');
    // console.log('NEW\n----------------------------------------\n', updated);
    // console.log('\n****************************************');

    let setFile;

    if (App.isProd()) {
        // TODO: Make a copy of app.js first
        // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
        setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files/Add(url='app.js',overwrite=true)`, {
            method: 'POST',
            body: updated, 
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
    } else {
        setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
            method: 'POST',
            body: updated
        });
        await Wait(1000);
    }

    // console.log('Saved:', setFile);
}
// @END-File
