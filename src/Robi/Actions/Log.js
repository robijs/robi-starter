import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { CreateItem } from './CreateItem.js'
import { Post } from './Post.js'

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
export async function Log(param) {
    const {
        Title, Message, StackTrace, Module
    } = param;

    if (App.isProd()) {
        /** Get new request digest */
        const requestDigest = await GetRequestDigest();

        /** @todo Check if Log exists, create if not */
        /**
         * SharePoint Ceate List REST API
         * @interface
         * @property {string} url - SharePoint 2013 API
         *
         */
        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('Log')/items`,
            data: {
                Title,
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message: JSON.stringify({
                    body: Message,
                    location: location.href,
                    // FIXME: what should this property be instead, since users can have multiple roles?
                    role: Store.user().Roles.results.join(', ')
                }),
                StackTrace: JSON.stringify(StackTrace.replace('Error\n    at ', '')),
                Module,
                __metadata: {
                    'type': `SP.Data.LogListItem`
                }
            },
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        };

        const newItem = await Post(postOptions);

        console.log(`Log: ${Title}`);

        return newItem.d;
    } else if (App.isDev()) {
        const newLog = await CreateItem({
            list: 'Log',
            data: {
                Title,
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message: JSON.stringify({
                    body: Message,
                    location: location.href,
                    role: Store.user().Roles.results.join(', ')
                }),
                StackTrace: JSON.stringify(StackTrace.replace('Error\n    at ', '')),
                UserAgent: navigator.userAgent,
                Module
            }
        });

        console.log(`Log: ${Title}`);

        return newLog;
    }
}
// @END-File
