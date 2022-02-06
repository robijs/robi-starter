import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Post } from './Post.js'
import { CreateLibrary } from './CreateLibrary.js'
import { CreateColumn } from './CreateColumn.js'
import { CreateItem } from './CreateItem.js'

// @START-File
/**
 * Create SharePoint list item.
 * @param {Object} param        Interface to UpdateItem() module.   
 * @param {String} param.list   SharePoint list name.
 * @param {Array}  param.fields SharePoint fields.
 */
export async function CreateList(param) {
    const {
        list,
        options,
        web,
        fields,
        template,
        items,
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest({web});

    // Check if list exists
    const listResponse = await fetch(`${App.get('site')}${web ? `/${web}` : ''}/_api/web/lists/GetByTitle('${list}')`, {
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
        }
    });
    
    const getList = await listResponse.json();

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    const listType = template && template === 101 ? 'library' : 'list';

    if (getList.d) {
        console.log(`${listType} ${list} already created.`);

        // Append to install-console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>${listType} '${list}' already created</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            // +1 for the list
            progressBar.update();

            // +2 for each field
            if (fields?.length) {
                for (let i = 0; i < fields.length; i++) {
                    progressBar.update();
                    progressBar.update();
                }
            }
        }
        return;
    } else {
        // console.log(getList);
    }

    const data = {
        __metadata: {
            'type': `SP.List`,
        },
        'BaseTemplate': template || 100,
        'Title': list
    }

    // Turn on major versions by default
    if (options) {
        const { versioning } = options;

        if (versioning === false) {
            data.EnableVersioning = false;
        } else {
            data.EnableVersioning = true;
        }
    }

    const postOptions = {
        url: `${App.get('site')}${web ? `/${web}` : ''}/_api/web/lists`,
        data,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    /** Create list */
    const newList = await Post(postOptions);

    if (newList) {
        // Console success
        console.log(`Created ${listType} '${list}'`);

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created ${listType} '${list}'</code>
                </div>
                ${
                    template !== 101 ?
                    /*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>----------------------------------------</code>
                        </div>
                    ` :
                    ''
                }
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        if (progressBar) {
            progressBar.update();
        }

        // If Files option enabled, create doc library
        if (options?.files) {
            console.log(`Files enabled. Create '${list}Files' doc lib.`);
            const filesLib = await CreateLibrary({
                name: `${list}Files`
            });

            await CreateColumn({
                list: `${list}Files`,
                field: {
                    name: 'ParentId',
                    type: 'number'
                },
                view: 'All Documents',
                updateProgressCount: false
            });
            
            console.log(`${list}Files:`, filesLib);
        }

        // Create fields
        for (let field in fields) {
            await CreateColumn({
                list,
                field: fields[field],
                view: template === 101 ? 'All Documents' : 'All Items'
            });
        }

        // Create items
        if (items) {
            for (let item in items) {
                const newItem = await CreateItem({
                    list: list,
                    data: items[item]
                });
    
                if (installConsole) {
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Created item in list '${list}' with Id ${newItem.Id}</code>
                        </div>
                    `);
        
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }
        
                if (progressBar) {
                    progressBar.update();
                }
            }
        }

        return newList.d;
    }
}
// @END-File
