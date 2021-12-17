export function exportTemplate({ name }) {
    return [
        `export function ${name}(param) {`,
        `    `,
        `}`
    ].join('\n');
}
