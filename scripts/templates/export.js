export function exportTemplate({ name }) {
    return [
        `// This file may be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made from the front end may not render properly.`,
        ``,
        `// @START-File`
        `/**`,
        ` * `,
        ` * @param {*} param `,
        ` * @returns `,
        ` */`,
        `export function ${name}(param) {`,
        `    `,
        `}`,
        `// @END-File`,
        ``
    ].join('\n');
}
