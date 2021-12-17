import { App } from '../Core/App.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { GetByUri } from './GetByUri.js'

// @START-File
/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function UploadFiles(param) {
    const {
        files, path
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // Upload responses
    const uploads = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = file.name;
        const fileBuffer = await getFileBuffer(file);

        // const upload = await fetch(`${App.get('site')}/_api/web/folders/GetByUrl('/${site}/${list}')/Files/add(url='${name}',overwrite=true)`, {
        // const upload = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/add(url='${name}',overwrite=true)`, {
        // const upload = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/add`, {
        const upload = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/add(url='${name}')`, {
            method: 'POST',
            headers: {
                "Accept": "application/json;odata=verbose",
                'content-type': 'application/json; odata=verbose',
                "X-RequestDigest": requestDigest,
            },
            body: fileBuffer
        });

        uploads.push(upload);
    }

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    const responses = await Promise.all(uploads);
    const updatedItems = await Promise.all(responses.map(async (response) => {
        const data = await response.json();

        return GetByUri({
            uri: data.d.ListItemAllFields.__deferred.uri
        });
    }));

    return updatedItems;
}
// @END-File
