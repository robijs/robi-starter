// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made from the front end may not render properly.

import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 * 
 * @param {Object} param - Interface to this Robi action
 * @returns {Promise} - Resolves into raw MD or formatted HTML from marked.parse()
 */
export async function GetArticle(param) {
    const {
        route,
        name,
        raw,
        list,
        path
    } = param;

    if (name) {
        const resp = await fetch(`Routes/${route}/Articles/${name}.md`);
        const md = await resp.text();

        return raw ? md : /*html*/ `
            <article>
                ${marked.parse(md)}   
            </article>
        `;
    }
}
// @END-File
