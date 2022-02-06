import { App } from '../Core/App.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { LogError } from './LogError.js'
import { Wait } from './Wait.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function DeleteRoutes({ routes }) {
    console.log(routes);

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
    let content = await request.text();
    let updated = '';

    // Remove Imports
    const imports = content.match(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/);
    const importObjects = imports[1].split('\n');
    const remainingImports= importObjects.filter(route => {
        const name = route.split(' ')[1];

        if (!routes.includes(name)) {
            return route;
        }

    }).join('\n');

    updated = content.replace(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/, `// @START-IMPORTS\n${remainingImports || '\n'}\n// @END-IMPORTS`);

    const allRoutes = content.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
    const routeObjects = allRoutes[1].split(', // @ROUTE');

    // Remove routes
    const remainingRoutes = routeObjects.filter(route => {
        const [ query, path ] = route.match(/path: '([\s\S]*?)',/);

        console.log(routes, path);

        if (!routes.includes(path)) {
            return route;
        }

    }).join(', // @ROUTE');

    updated = updated.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${remainingRoutes || '\n        '}// @END-ROUTES`);

    console.log('OLD\n----------------------------------------\n', content);
    console.log('\n****************************************');
    console.log('NEW\n----------------------------------------\n', updated);
    console.log('\n****************************************');

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

        // TODO: Add _ARCHIVED to Route dir name in App/src/Routes
    } else {
        try {
            setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                method: 'POST',
                body: updated
            });
    
            console.log('Archive route');
            
            for (let route of routes) {
                await fetch(`http://127.0.0.1:2035/?path=src/Routes/${route}`, {
                    method: 'DELETE'
                });
            }
    
            await Wait(1000);
        } catch(err) {
            LogError({
                Message: 'Problem archiving route',
                Source: import.meta.url,
                Error: err
            });
            
            console.log(err);
        }
    }

    console.log('Saved:', setFile);
}
// @END-File
