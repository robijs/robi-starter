import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function GetSiteUsers(param) {
    const {
        query
    } = param;

    const abortController = new AbortController();
    const init = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        },
        signal: abortController.signal
    };

    let url;

    if (App.isProd()) {
        url = [
            `${App.get('site')}`,
            `/_api/Web/SiteUsers`,
            // `?$select=Id,Title,Account,WorkEmail`,
            `?$filter=LoginName eq 'i:0e.t|esocsts|${query}'`
            // `&$filter=substringof('${query}', Account) or substringof('${query}', WorkEmail))&$orderby=Name`
        ].join('');
    } else if (App.isDev()) {
        url = `http://localhost:3000/users`;
    }

    return {
        abortController,
        response: fetch(url, init).then(async (response) => {
            const data = await response.json();

            // return data.d.results;
            return data?.d;
        })
        .catch(error => {
            // console.log(error);
        })
    };
}
// @END-File
