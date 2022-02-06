import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function RemoveLocal(key, value) {
    localStorage.removeItem(`${App.get('name')}-${key}`);
}
// @END-File
