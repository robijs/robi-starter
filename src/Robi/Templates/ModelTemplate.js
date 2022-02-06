// @START-File
/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function ModelTemplate({ name }) {
    return [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made with GUI tools will not render properly.`,
        ``,
        `// @START-${name}`
        `/**`,
        ` * `,
        ` * @param {*} param `,
        ` * @returns `,
        ` */`,
        `export function ${name}(param) {`,
        `    `,
        `}`,
        `// @END-${name}`,
        ``
    ].join('\n');
}
// @END-File
