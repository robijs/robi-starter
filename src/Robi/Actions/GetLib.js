import { GetItemCount  } from './GetItemCount.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetLib(param) {
    const {
        path,
        type,
        filter,
        select,
        expand,
        orderby
    } = param;

    const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/${type || 'Files'}`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const itemCount = await GetItemCount({
        path,
        type: 'lib'
    });

    let queryFilterString = `$filter=${filter}`;

    if (select) {
        queryFilterString += `${queryFilterString ? '&' : ''}$select=${select}`;
    }

    if (expand) {
        queryFilterString += `${queryFilterString ? '&' : ''}$expand=${expand}`;
    }

    if (orderby) {
        queryFilterString += `${queryFilterString ? '&' : ''}$orderby=${orderby}`;
    }

    try {
        const response = await fetch(`${`${url}?$top=${itemCount}`}&${queryFilterString || ''}`, headers);

        const data = await response.json();

        if (Array.isArray(data)) {
            return data
        } else {
            return data.d.results;
        }
    } catch (error) {
        console.log(error);
    }
}
// @END-File
