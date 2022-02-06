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
        // const url = `${App.get('domain')}/_api/web/siteusers?$filter=substringof('${query.toLowerCase()}',LoginName) eq true and substringof('i%3A0%23.w',LoginName) eq true`;
        // const url = [
        //     `${App.get('site')}`,
        //     `/_api/web/SiteUserInfoList/items`,
        //     // `?$top=200`,
        //     `&$select=Id,Title,FirstName,LastName,Name,EMail`,
        //     `&$filter=substringof('${query}', Name) or (substringof('${query}', Title) or substringof('${query}', EMail) or substringof('${query}', FirstName) or substringof('${query}', LastName))&$orderby=Name`
        // ].join('');
        // const url = [
        //     `${App.get('site')}`,
        //     `/_api/web/SiteUserInfoList/items`,
        //     // `?$top=200`,
        //     `&$filter=(substringof('${query}', Name) or (substringof('${query}', Title) or substringof('${query}', EMail))&$orderby=Name`
        // ].join('');
        url = [
            `${App.get('site')}`,
            `/_vti_bin/listdata.svc/UserInformationList`,
            // `?$top=200`,
            `&$select=Id,Name,Account,WorkEmail`,
            // `&$filter=substringof('i:0e.t|dod_adfs_provider|', Account) and (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
            `&$filter=substringof('${query}', Account) or (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
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
