import { App } from '../Core/App.js'
import { Get } from './Get.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Post } from './Post.js'

// @START-File
/**
 * Update SharePoint list item.
 * @param {Object}  param          - Interface to UpdateItem() module.
 * @param {string}  param.list     - SharePoint List Name.
 * @param {number}  param.itemId   - Item Id of item in param.list.
 * @param {boolean} [param.notify] - If false, don't display notification.
 */
export async function DeleteItem(param) {
    const {
        list,
        itemId,
        filter,
    } = param;

    if (App.isProd()) {
        /** Get item by id */
        const getItems = await Get({
            list,
            filter: itemId ? `Id eq ${itemId}` : filter
        });

        // const item = getItems[0];

        /** Get new request digest */
        const requestDigest = await GetRequestDigest();

        await Promise.all(getItems.map(item => {
            const postOptions = {
                url: item.__metadata.uri,
                headers: {
                    "Content-Type": "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose",
                    "X-HTTP-Method": "DELETE",
                    "X-RequestDigest": requestDigest,
                    "If-Match": item.__metadata.etag
                }
            }

            return Post(postOptions);
        }));
    } else if (App.isDev()) {
        const options = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        const response = await fetch(`http://localhost:3000/${list}/${itemId}`, options);
        const deletedItem = await response.json();

        return deletedItem;
    }
}
// @END-File
