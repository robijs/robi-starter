import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function GetLocal(key) {
    return localStorage.getItem(`${App.get('name') ? `${App.get('name')}-` : '' }${key}`);
}
// @END-File
