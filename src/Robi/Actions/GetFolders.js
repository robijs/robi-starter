import { GetRequestDigest  } from './GetRequestDigest.js'
import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetFolders(param) {
    const { path, filter } = param;
    
    // 2. Look for directories
    const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/folders${filter ? `?$select=Name&$filter=${filter}` : ''}`;
    const requestDigest = await GetRequestDigest();
    const options = {
        method: 'GET',
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-type": "application/json; odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    };
    const query = await fetch(url, options);
    const response = await query.json();

    return response?.d?.results;
}
// @END-File
