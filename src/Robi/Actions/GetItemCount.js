import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetItemCount(param) {
    const {
        list,
        path,
        type
    } = param;

    let {
        apiPath
    } = param;

    apiPath = apiPath || App.get('site');
    const url = type === 'lib' ? `${apiPath}/_api/web/GetFolderByServerRelativeUrl('${path}')/ItemCount` : `${apiPath}/_api/web/lists/GetByTitle('${list}')/ItemCount`;

    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        }
    };

    try {
        const response = await fetch(url, headers);

        if (!response.ok) {
            // await Error({
            //     Message: response.status.toString(),
            //     Source: import.meta.url,
            //     Line: 0,
            //     ColumnNumber: 0,
            //     Error: JSON.stringify(new Error().stack.replace('Error\n    at ', ''))
            // });
        }

        const data = await response.json();

        return data.d.ItemCount;
    } catch (error) {
        // console.log(error);
    }
}
// @END-File
