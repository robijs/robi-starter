import { App } from '../Core/App.js'
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
export async function LogError(param) {
    const {
        Message, Error, Source
    } = param;

    if (App.isProd()) {
        /** Get new request digest */
        /**
         * @author Wil Pacheco & John Westhuis
         * Added temporary alert to prevent infinite error loop when reporting error, & reload page for user.
         *
         * @author Stephen Matheis
         * @to Wilfredo Pacheo, John Westhuis
         * Catching the request digest promise was a great idea. Jealous I didn't think of it >_<!
         */
        const requestDigest = await GetRequestDigest().catch(() => {
            alert('Your session has expired, your page will now reload.');
            location.reload();
        });

        /** @todo check if Errors list exits, create if not */
        /**
         * Pass this object to fetch
         *
         * @interface
         * @property {string} url - SharePoint 2013 API
         *
         */
        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('Errors')/items`,
            data: {
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message,
                Error,
                Source,
                UserAgent: navigator.userAgent,
                __metadata: {
                    'type': `SP.Data.ErrorsListItem`
                }
            },
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        };

        const newItem = await Post(postOptions);

        console.log(`%cError: ${Message}`, 'background: crimson; color: #fff');

        return newItem.d;
    } else if (App.isDev()) {
        const newLog = await CreateItem({
            list: 'Errors',
            data: {
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message,
                Error,
                Source,
            }
        });

        console.log(`%cError: ${Message}`, 'background: crimson; color: #fff');

        return newLog;
    }
}
// @END-File
