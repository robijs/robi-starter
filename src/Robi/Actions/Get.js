import { App } from '../Core/App.js'
import { GetItemCount } from './GetItemCount.js'
import { Store } from '../Core/Store.js';
import { Wait } from './Wait.js';

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function Get(param) {
    const {
        list,
        filter,
        select,
        expand,
        orderby,
        top,
        skip,
        paged,
        startId,
        api,
        path,
        action,
        mode
    } = param;

    /** Add abort signal */
    const abortController = new AbortController();

    Store.addAbortController(abortController);

    const url = `${path || App.get('site')}/_api/web/lists/GetByTitle`;

    const options = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        },
        signal: abortController.signal
    };

    if (App.isProd() || mode === 'prod') {
        const itemCount = await GetItemCount({
            apiPath: path,
            list
        });

        if (!itemCount) {
            // Always return at least an empty array if query fails for any reason
            return [];
        }

        const queryFilterString = [
            insertIf(filter, 'filter'),
            insertIf(select, 'select'),
            insertIf(expand, 'expand'),
            insertIf(orderby, 'orderby'),
            insertIf(skip, 'skip'),
            paged ? `$skiptoken=Paged=TRUE${startId ? `&P_ID=${startId}` : ''}` : undefined,
            // paged ? `$skiptoken=Paged=TRUE&P_ID=${startId ? startId : itemCount}`: undefined,
        ]
            .filter(x => x)
            .join('&');

        function insertIf(value, parameter) {
            return value ? `$${parameter}=${value}` : undefined;
        }

        try {
            const response = await fetch(api || `${`${url}('${list}')/items?$top=${top || itemCount || ''}`}&${queryFilterString || ''}`, options);
            const data = await response.json();

            if (action) {
                action(data);
            }

            if (paged || skip) {
                return data.d;
            } else if (Array.isArray(data)) {
                return data
            } else {
                return data.d.results;
            }
        } catch (error) {
            console.log('Fetch request aborted.');
        }
    } else if (App.isDev() || mode === 'dev') {
        const queries = filter ? filter.split(' or ') : [ '' ];

        const fetchAll = await Promise.all(queries.map( async query => {
            const queryFilterString = [
                formatFilter(query),
                formatOrder(orderby)
            ]
            .filter(x => x)
            .join('&');

    
            return await fetch(`http://localhost:3000/${list}${queryFilterString ? `?${queryFilterString}` : ''}`, options);
        }));
        
        function formatFilter(value) {
            if (value) {
                return value
                    // .replaceAll(' or ', ' and ')
                    .split(' and ')
                    .map(group => {
                        if (group.includes('(substringof(')) {
                            const [value, column] = group.replace(`(substringof('`, '').replace(`',`, '').replace(') eq true', '').split(' ');

                            return `${column}_like=${value}`;
                        } else {
                            const [field, operator, value] = group.match(/(?:[^\s"']+|['"][^'"]*["'])+/g); /** {@link https://stackoverflow.com/a/16261693} see jobrad's comment Mar 24 '17 at 17:16 */

                            return `${field}${operator === 'eq' ? '=' : operator === 'ne' ? '_ne=' : ''}${value.replace(/["']/g, "")}`;
                        }
                    })
                    .join('&');
            }
        }

        /** GET /posts?_sort=views&_order=asc */
        function formatOrder(value) {
            if (value) {
                const [field, order] = value.split(' ');

                return `_sort=${field}&_order=${order}`;
            }
        }

        // await Wait(500);
        const all = (await Promise.all(fetchAll.map(async response => await response.json()))).flat();
        // https://stackoverflow.com/a/58429784
        const unique = [...new Map(all.map(item => [ item.Id, item ])).values()];

        return unique;
    }
}
// @END-File
