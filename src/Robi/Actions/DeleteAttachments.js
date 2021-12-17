import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function DeleteAttachments(param) {
    const {
        list,
        itemId,
        fileNames
    } = param;

    /** Get new request digest */
    const requestDigest = await GetRequestDigest();

    /** Upload responses */
    /** @todo Refactor with map? */
    const responses = [];

    for (let i = 0; i < fileNames.length; i++) {
        const upload = await fetch(`${App.get('site')}/_api/web/lists/getbytitle('${list}')/items(${itemId})/AttachmentFiles/getByFileName('${fileNames[i]}')`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json; odata=verbose',
                'content-type': 'application/json; odata=verbose',
                'X-HTTP-Method': 'DELETE',
                'X-RequestDigest': requestDigest,
            },
        });

        responses.push(upload);
    }

    await Promise.all(responses);
}
// @END-File
