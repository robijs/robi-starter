import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetList(param) {
    const {
        listName
    } = param;

    const url = `${App.get('site')}/_api/web/lists/GetByTitle('${listName}')`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const response = await fetch(url, headers);

    if (response) {
        const data = await response.json();

        if (data && data.d) {
            return data.d;
        }
    }
}
// @END-File
