import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { GetListGuid } from './GetListGuid.js'
import { UpdateColumn } from './UpdateColumn.js'
import { AddColumnToView } from './AddColumnToView.js'
import { Post } from './Post.js'

// @START-File
/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export async function CreateColumn(param) {
    const {
        list,
        field,
        view,
        updateProgressCount
    } = param;

    const {
        name,
        type,
        choices,
        fillIn,
        title,
        lookupList,
        lookupField,
        value
    } = field;

    // Get new request digest
    const requestDigest = await GetRequestDigest();
    const getField = await fetch(`${App.get('site')}/_api/web/lists/getByTitle('${list}')/fields`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': requestDigest
        }
    });
    const response = await getField.json();

    // Existing list columns 
    const fields = response?.d?.results.map(item => item.Title);

    // Don't create columns with reserved SharePoint names or already exist
    if (fields.includes(name)) {
        await exists();
        return;
    }

    // Robi reserves some column names as well
    const robiFields = ['Files'];

    if (robiFields.includes(name)) {
        await reserved();
        return;
    }

    async function exists() {
        // Console 
        console.log(`Column '${name}' already exists or is a reserved SharePoint name.`);

        // Add to Install Console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code style='color: orange'>Column '${name}' already exists or is a reserved SharePoint name.</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        // Update column instead
        await UpdateColumn(param);

        const progressBar = Store.get('install-progress-bar');

        if (progressBar && updateProgressCount !== false) {
            // +1 since not adding to column to view
            progressBar.update();
        }

        // TODO: Update progress bar or error out if update fails
        return;
    }

    async function reserved() {
        // Console 
        console.log(`Column '${name}' is reserved for Robi. A list column with this name can't be created.`);

        // Add to Install Console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code style='color: orange'>Column '${name}' is reserved for Robi. A list column with this name can't be created.</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        // Update column instead
        await UpdateColumn(param);

        const progressBar = Store.get('install-progress-bar');

        if (progressBar && updateProgressCount !== false) {
            // +1 since not adding to column to view
            progressBar.update();
        }

        // TODO: Update progress bar or error out if update fails
        return;
    }

    let data = {};
    let url;

    if (type === 'choice') {
        data = {
            __metadata: {
                "type": "SP.FieldChoice"
            },
            FieldTypeKind: 6,
            Title: name,
            DefaultValue: value,
            Choices: {
                // __metadata: { 
                //     "type": "Collection(Edm.String)" 
                // }, 
                results: choices
            }
        };
    } else if (type === 'multichoice') {
        data = {
            __metadata: {
                "type": "SP.FieldChoice"
            },
            FieldTypeKind: 15,
            Title: name,
            FillInChoice: fillIn,
            DefaultValue: value,
            Choices: {
                results: choices
            }
        };
    } else if (type === 'lookup') {
        const listGuid = await GetListGuid({
            listName: lookupList
        });

        url = `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields/addfield`;

        data = {
            parameters: {
                __metadata: { 
                    'type': 'SP.FieldCreationInformation' 
                },
                FieldTypeKind: 7,
                Title: name, 
                LookupListId: listGuid,
                LookupFieldName: lookupField
            }
        }
    } else {
        data = {
            __metadata: {
                'type': `SP.Field`,
            },
            Title: name,
            FieldTypeKind: fieldType(type),
            DefaultValue: value
        }
    }

    const postOptions = {
        url: url || `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields`,
        data,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    /**
     * @desc FieldTypeKind for SharePoint
     *  
     * @type {FieldTypeKind} - 2 (Single Line of Text)
     * @type {FieldTypeKind} - 3 (Mulitiple Lines of Text)
     * @type {FieldTypeKind} - 4 (Date)
     * @type {FieldTypeKind} - 6 (Choice)
     * @type {FieldTypeKind} - 7 (Lookup)
     * @type {FieldTypeKind} - 9 (Number)
     * @type {FieldTypeKind} - 20 (Person or Group)
     * 
     */
    function fieldType(type) {
        switch (type.toLowerCase()) {
            case 'slot':
                return 2;
            case 'mlot':
                return 3;
            case 'date':
                return 4;
            case 'choice':
                return 6;
            case 'lookup':
                return 7;
            case 'number':
                return 9;
            case 'multichoice':
                return 15;
            case 'pp':
                return 20;
            default:
                break;
        }
    }

    const newField = await Post(postOptions);

    // Console success
    console.log(`Created column '${name}'`);

    // Append to install-console
    const installConsole = Store.get('install-console');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Created column '${name}'</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    const progressBar = Store.get('install-progress-bar');

    if (progressBar && updateProgressCount !== false) {
        progressBar.update();
    }

    /** Add column to All Items view */
    await AddColumnToView({
        list,
        name,
        view,
        updateProgressCount
    });

    return newField.d;
}
// @END-File
