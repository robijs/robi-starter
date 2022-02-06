import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function SetLocal(key, value) {
    localStorage.setItem(`${App.get('name')}-${key}`, value);
}
// @END-File
