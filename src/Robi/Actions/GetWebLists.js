import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetWebLists() {
    const url = `${App.get('site')}/_api/web/lists/?$select=*,Fields&$expand=Fields`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const response = await fetch(url, headers);

    if (response) {
        const data = await response.json();

        if (data && data.d && data.d.results) {
            return data.d.results;
        }
    }
}
// @END-File
