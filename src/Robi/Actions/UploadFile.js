import { App } from '../Core/App.js'
import { UpdateItem } from './UpdateItem.js'
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
export async function UploadFile(param) {
    const {
        file, data, library
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();
    const fileBuffer = await getFileBuffer(file);
    const upload = await fetch(`${App.get('site')}/_api/web/folders/GetByUrl('${library}')/Files/add(overwrite=true,url='${file.name}')`, {
        method: 'POST',
        headers: {
            "Accept": "application/json;odata=verbose",
            'content-type': 'application/json; odata=verbose',
            "X-RequestDigest": requestDigest,
            "content-length": fileBuffer.byteLength
        },
        body: fileBuffer
    });

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    const response = await upload.json();

    let item = await GetByUri({
        uri: response.d.ListItemAllFields.__deferred.uri
    });

    let itemToReturn;

    if (data) {
        const updateItemParam = {
            list: library,
            itemId: item.Id,
            select: `*,Author/Title,Editor/Title`,
            expand: `File,Author,Editor`,
            data
        };

        itemToReturn = await UpdateItem(updateItemParam);
    } else {
        itemToReturn = item;
    }

    return itemToReturn;
}
// @END-File
