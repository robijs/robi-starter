import { App } from '../Core/App.js'
import { GetRequestDigest } from './GetRequestDigest.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function SetHomePage(param = {}) {
    const { file, web, site } = param;

    const requestDigest = await GetRequestDigest({ web });
    const headers = {
        "Accept": "application/json;odata=verbose",
        "Content-type": "application/json; odata=verbose",
        "IF-MATCH": "*",
        "X-HTTP-Method": "PATCH",
        "X-RequestDigest": requestDigest,
    };

    const properties = {
        '__metadata': {
            'type': 'SP.Folder'
        },
        'WelcomePage': file || 'App/src/pages/app.aspx'
    };

    const response = await fetch(`${site || App.get('site')}${web ? `/${web}` : ''}/_api/web/rootfolder`, {
        method: 'POST',
        headers,
        body: JSON.stringify(properties)
    });

    return response;
}
// @END-File
