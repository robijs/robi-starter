// @START-File
/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function RouteTemplate({ name }) {
    return [
        `// This file may be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.`,
        `// Otherwise, changes made from CLI and GUI tools may break this file.`,
        ``,
        `// @START-Imports`,
        `import { } from '../../Robi/Robi.js'`,
        `import { Row } from '../../Robi/RobiUI.js'`,
        `// @END-Imports`,
        ``,
        `// @START-${name}`,
        `export default async function ${name}({ parent }) {`,
        `    // @START-Rows`,
        `    Row((parent) => {`,
        `    `,
        `    }, { parent });`,
        `    // @END-Rows`,
        `}`,
        `// @END-${name}`,
        ``
    ].join('\n');
}
// @END-File
