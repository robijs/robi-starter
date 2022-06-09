// @START-File
/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function ComponentTemplate({ name }) {
    return [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made with GUI tools will not render properly.`,
        ``,
        `import { Component } from '../../Robi/Robi.js'`,
        ``,
        `// @START-${name}`,
        `/**`,
        ` * `,
        ` * @param {Object} param - Object passed in as only argument to a Robi component`,
        ` * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. `,
        ` * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.`,
        ` * @returns {Object} - Robi component.`,
        ` */`,
        `export default function ${name}(param) {`,
        `    const {`,
        `        parent,`,
        `        position`,
        `    } = param;`,
        ``,
        `    const component = Component({`,
        `        html: /*html*/ \``,
        `            <div class=''>`,
        ``,
        `            </div>`,
        `        \`,`,
        `        style: /*css*/ \``,
        `            #id {`,
        ``,
        `            }`,
        `        \`,`,
        `        parent,`,
        `        position,`,
        `        events: [`,
        `            {`,
        `                selector: '#id',`,
        `                event: 'click',`,
        `                listener(event) {`,
        `                    console.log(\`\${component.get().id} clicked\`);`,
        `                }`,
        `            }`,
        `        ],`,
        `        onAdd() {`,
        ``,
        `        }`,
        `    });`,
        ``,
        `    return component;`,
        `}`,
        `// @END-${name}`,
        ``
    ].join('\n');
}
// @END-File
