// @START-File
/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function RouteTemplate({ name }) {
    return [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.`,
        `// Otherwise, changes made from CLI and GUI tools won't work properly.`,
        ``,
        `import { } from '../../Robi/Robi.js'`,
        `import { Row } from '../../Robi/RobiUI.js'`,
        ``,
        `// @START-${name}`,
        `export default async function ${name}({ parent }) {`,
        `    // @START-Rows`,
        `    Row((parent) => {`,
        `    `,
        `    });`,
        `    // @END-Rows`,
        `}`,
        `// @END-${name}`,
        ``
    ].join('\n');
}
// @END-File
