import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export function HTML({items, each}) {
    return items.map(each).join('\n');
}
// @END-File
