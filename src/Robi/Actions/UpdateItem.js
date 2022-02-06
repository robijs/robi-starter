import { App } from '../Core/App.js'
import { Post } from './Post.js'
import { Get } from './Get.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Wait } from './Wait.js';

// @START-File
/**
 * Update SharePoint list item.
 * @param {Object}  param          - Interface to UpdateItem() module.
 * @param {string}  param.list     - SharePoint List Name.
 * @param {number}  param.itemId   - Item Id of item in param.list.
 * @param {boolean} [param.notify] - If false, don't display notification.
 */
export async function UpdateItem(param) {
    const {
        list, itemId, select, expand, data, wait
    } = param;

    // console.log(`List: ${list}, Item: ${itemId}, Data:`, data);

    // Exit if no data passed in
    if (Object.getOwnPropertyNames(data).length === 0) {
        return;
    }

    if (App.isProd()) {
        // Get item by id
        const getItem = await Get({
            list,
            filter: `Id eq ${itemId}`
        });

        const item = getItem[0];

        // Get new request digest
        const requestDigest = await GetRequestDigest();

        // Add SharePoint List Item Type metadata property to passed in data object
        data.__metadata = {
            'type': item.__metadata.type
        };

        // Define Post interface
        const postOptions = {
            url: item.__metadata.uri,
            data: data,
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-HTTP-Method": "MERGE",
                "X-RequestDigest": requestDigest,
                "If-Match": item.__metadata.etag
            }
        };

        // Post update
        await Post(postOptions);

        // Get updated item
        const getUpdatedItem = await Get({
            list,
            select,
            expand,
            filter: `Id eq ${itemId}`
        });

        const updatedItem = getUpdatedItem[0];

        return updatedItem;
    } else {
        const body = data;

        body.EditorId = body.EditorId || App.get('dev').user.SiteId;
        body.Editor = body.Editor || { Title: App.get('dev').user.Title, LoginName: App.get('dev').user.LoginName };

        const date = new Date().toUTCString();
        body.Modified = date;

        const options = {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        };

        const response = await fetch(`http://localhost:3000/${list}/${itemId}`, options);
        if (wait !== false) {
            await Wait(500);
        }

        if (response) {
            // Get updated item
            const getUpdatedItem = await Get({
                list,
                select,
                expand,
                filter: `Id eq ${itemId}`
            });

            const updatedItem = getUpdatedItem[0];

            return updatedItem;
        }
    }
}
// @END-File
