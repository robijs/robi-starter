import { App } from '../Core/App.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { LogError } from './LogError.js'

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
    }

    let content = await request.text();
    let updated = '';

    // Remove Imports
    const imports = content.match(/\/\/ @START-Imports:Routes([\s\S]*?)\/\/ @END-Imports:Routes/);
    const importObjects = imports[1].split('\n');
    const remainingImports = importObjects.filter(route => {
        if (!route) {
            return;
        }

        const name = route.split(' ')[1]?.split('Route_')[1];

        if (!routes.includes(name)) {
            return route;
        }

    }).join('\n');

    updated = content.replace(/\/\/ @START-Imports:Routes([\s\S]*?)\/\/ @END-Imports:Routes/, `// @START-Imports:Routes\n${remainingImports || '\n'}\n// @END-Imports:Routes`);

    const allRoutes = content.match(/\/\/ @START-Routes([\s\S]*?)\/\/ @END-Routes/);
    const routeObjects = allRoutes[1].split(', // @Route');

    // Remove routes
    const remainingRoutes = routeObjects.filter(route => {
        const [ query, path ] = route.match(/path: '([\s\S]*?)',/);

        // console.log(routes, path);

        if (!routes.includes(path)) {
            return route;
        }

    }).join(', // @Route');

    updated = updated.replace(/\/\/ @START-Routes([\s\S]*?)\/\/ @END-Routes/, `// @START-Routes${remainingRoutes || '\n        '}// @END-Routes`);

    // console.log('OLD\n----------------------------------------\n', content);
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

        // TODO: Add _ARCHIVED to Route dir name in App/src/Routes
    }
    
    // @START-Dev
    if (App.isDev()) {
        try {
            setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                method: 'POST',
                body: updated
            });
    
            console.log('Archive route');
            
            for (let route of routes) {
                // NOTE:
                // Don't await, kick off all calls at the same time.
                // Otherwise, the script my get killed if the page is refershed
                // by live-server's live reload.
                fetch(`http://127.0.0.1:2035/?path=src/Routes/${route}`, {
                    method: 'DELETE'
                });
            }
        } catch(err) {
            LogError({
                Message: 'Problem archiving route',
                Source: import.meta.url,
                Error: err
            });
            
            console.log(err);
        }
    }
    // @START-Dev
}
// @END-File
