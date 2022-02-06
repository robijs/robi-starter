import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Banner(param) {
    const {
        text, fixed, parent, position, type
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='banner ${fixed ? 'fixed' : 'normal'} ${type || ''}'>${text}</div>
        `,
        style: /*css*/ `
            #id.banner {
                cursor: default;
                font-size: 1.5em;
                border-radius: 4px;
            }

            #id.fixed {
                background: lightyellow;
                border-left: solid 4px gold;
                position: fixed;
                top: 5px;
                right: 15px;
                padding: 5px;
            }

            #id.normal {
                display: inline-block;
                background: white;
                border-left: solid 10px var(--primary);
                margin: 20px 0px;
                padding: 10px;
            }

            #id.info {
                background: linen;
                border-left: solid 10px orange;
            }

            #id.good {
                background: lightgreen;
                border-left: solid 10px mediumseagreen;
            }
        `,
        parent,
        position
    });

    return component;
}
// @END-File
