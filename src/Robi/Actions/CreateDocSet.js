import { App } from '../Core/App.js'
import { UpdateItem } from './UpdateItem.js';

// @START-File
/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function CreateDocSet({ library, name, guid, data }) {
    if (App.isProd()) {
        // Create Doc Set
        var url = `${App.get('site')}/${library}`;
        const post = await fetch(`${App.get('site')}/_vti_bin/listdata.svc/${library}`, {
            method: 'POST',
            body: JSON.stringify({
                Title: name,
                Path: url
            }),
            headers: {
                "Accept": "application/json;odata=verbose",
                "Slug": url + "/" + name + "|" + guid
            }
        });

        const response = await post.json();
        const itemId = response.d.Id;

        const updateDocSet = await UpdateItem({
            list: library,
            itemId,
            data
        });

        return updateDocSet;
    } else if (App.isDev()) {
       // TODO: How to simulate Doc Set in json-server?
    }
}
// @END-File
