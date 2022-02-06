import { Toast } from '../Components/Toast.js'
import { Get } from './Get.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Post } from './Post.js'
import { Wait } from './Wait.js'
import { Lists } from '../Models/Lists.js'
import { App } from '../Core/App.js'

// @START-File
/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function CreateItem(param) {
    const {
        type,
        list,
        select,
        expand,
        data,
        notify,
        message,
        wait
    } = param;

    if (App.isProd()) {
        const requestDigest = await GetRequestDigest();

        data.__metadata = {
            'type': `SP.Data.${type || list}ListItem`
        }

        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/items`,
            data,
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        }

        let newItem = await Post(postOptions);

        if (!newItem) {
            return;
        }

        const refetechedNewItem = await Get({
            list,
            select,
            expand,
            filter: `Id eq ${newItem.d.Id}`
        });

        if (notify) {
            const notification = Toast({
                text: message || `Item created`
            });

            notification.add();
            notification.remove(6000);
        }

        return refetechedNewItem[0];
    } else if (App.isDev()) {
        const body = data;

        // DataTables and other components requied null fields.
        // SharePoint returns them by default, but lists created with json-server don't
        // have schemas.
        // Append fields from lists.js with value null.
        const lists = App.lists();
        const { fields } = Lists().concat(lists).find(item => item.list === list);

        for (let field in fields) {
            const { name } = fields[field];

            if (name in body === false) {
                body[name] = null;
            }
        }

        body.AuthorId = body.AuthorId || App.get('dev').user.SiteId;
        body.Author = body.Author || { Title: App.get('dev').user.Title, LoginName: App.get('dev').user.LoginName };
        body.EditorId = body.EditorId || App.get('dev').user.SiteId;
        body.Editor = body.Editor || { Title: App.get('dev').user.Title, LoginName: App.get('dev').user.LoginName };

        const date = new Date().toUTCString();
        body.Created = date;
        body.Modified = date;

        const options = {
            method: `POST`,
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        const response = await fetch(`http://localhost:3000/${list}`, options);
        const newItem = await response.json();
        
        if (list !== 'Log' && list !== 'Errors') {
            if (wait !== false) {
                await Wait(500);
            }
        }

        return newItem;
    }
}
// @END-File
