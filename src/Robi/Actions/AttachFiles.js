import { App } from '../Core/App.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Get } from './Get.js'

// @START-File
/**
 * 
 * @param {Object} param - Single function argument.
 * @param {String} param.string - Name of the SharePoint list.
 * @param {Number} param.id - SharePoint list item id.
 * @param {Files} param.files - Type FileList. From <input type='files'>. {@link https://developer.mozilla.org/en-US/docs/Web/API/FileList}
 * 
 * @returns {Object} SharePoint list item.
 */
export async function AttachFiles(param) {
    /** Destructure Interface */
    const {
        list,
        itemId,
        files
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // Upload responses
    const responses = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = file.name;
        const fileBuffer = await getFileBuffer(file);

        const upload = await fetch(`${App.get('site')}/_api/web/lists/getbytitle('${list}')/items(${itemId})/AttachmentFiles/add(FileName='${name}')`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; odata=verbose',
                'content-type': 'application/json; odata=verbose',
                'X-RequestDigest': requestDigest,
            },
            body: fileBuffer
        });

        responses.push(upload);
    }

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    await Promise.all(responses);

    const getUpdatedItem = await Get({
        list,
        filter: `Id eq ${itemId}`,
        select: `Attachments,AttachmentFiles${list === ',References' ? 'Description' : ''}`,
        expand: 'AttachmentFiles',
    });

    return getUpdatedItem[0];
}
// @END-File
