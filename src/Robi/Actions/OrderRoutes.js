import { App } from '../Core/App.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Wait } from './Wait.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function OrderRoutes({ routes }) {
    console.log(routes);

    let digest;
    let request;

    if (App.get('mode') === 'prod') {
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
    let value = await request.text();

    const allRoutes = value.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
    const routeObjects = allRoutes[1].split(', // @ROUTE');

    // console.log('App.js:', value);
    // console.log('Routes:', routes[0]);

    const newRoutes = routes.map(path => {
        // FIXME: change to regex, will find routes that are similar
        const route = routeObjects.find(item => item.includes(`// @START-${path}`));
        // console.log(`Path: // @START-${path} -> Route: ${route}`);

        return route;
    }).join(', // @ROUTE');

    console.log(newRoutes);

    const updated = value.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${newRoutes}// @END-ROUTES`);

    console.log('OLD\n----------------------------------------\n', value);
    console.log('\n****************************************');
    console.log('NEW\n----------------------------------------\n', updated);
    console.log('\n****************************************');

    let setFile;

    if (App.get('mode') === 'prod') {
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
        // await Wait (1500);
    } else {
        setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
            method: 'POST',
            body: updated
        });
        await Wait(1000);
    }

    console.log('Saved:', setFile);
}
// @END-File
