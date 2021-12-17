// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetByUri(param) {
    const {
        uri,
        select,
        expand
    } = param;

    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    let queryFilterString = '';

    if (select) {
        queryFilterString += `${queryFilterString ? '&' : ''}$select=${select}`;
    }

    if (expand) {
        queryFilterString += `${queryFilterString ? '&' : ''}$expand=${expand}`;
    }

    const response = await fetch(`${uri}?${queryFilterString}`, headers);
    const data = await response.json();

    if (data && data.d) {
        return data.d;
    }
}
// @END-File
