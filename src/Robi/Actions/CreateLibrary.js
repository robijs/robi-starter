import { CreateList } from './CreateList.js'

// @START-File
/**
 * Create SharePoint list item.
 * @param {Object} param        Interface to UpdateItem() module.   
 * @param {String} param.list   SharePoint list name.
 * @param {Array}  param.fields SharePoint fields.
 */
export async function CreateLibrary(param) {
    const {
        name,
        web,
        fields
    } = param;

    const newLibrary = await CreateList({
        list: name,
        web,
        fields,
        template: 101
    });

    if (newLibrary) {        
        return newLibrary;
    }
}
// @END-File
