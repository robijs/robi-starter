import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function ReleaseNotes(param) {
    const {
        version, notes, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='release-notes'>
                <div class='release-notes-version'>Version <strong>${version}</strong></div>
                ${buildNotes(notes)}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin-top: 10px;
            }

            #id .release-notes-version {
                font-size: 1.4em;
                color: var(--primary);
                margin-bottom: 10px;
            }

            #id .release-notes-version strong {
                color: var(--primary);
            }
        `,
        parent: parent,
        position,
        events: []
    });

    function buildNotes(notes) {
        let html = /*html*/ `
            <ul>
        `;

        notes.forEach(note => {
            const {
                Summary, Description
            } = note;

            html += /*html*/ `
                <li>
                    <strong>${Summary}</strong>
                    &mdash;
                    ${Description}
                </li>
            `;
        });

        html += /*html*/ `
            </ul>
        `;

        return html;
    }

    return component;
}
// @END-File
