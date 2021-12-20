export function componentTemplate({ name }) {
    return [
        `import { Title } from '../../Robi/Robi.js'`,
        ``,
        `// @START-File`,
        `export function ${name}(param) {`,
        `    const {`,
        `        parent,`,
        `    } = param;`,
        ``,
        `// View title`,
        `const viewTitle = Title({`,
        `    title: /* @START-Title */'Test'/* @END-Title */,`,
        `    parent,`,
        `});`,
        ``,
        `viewTitle.add();`,
        `// @END-File`,
        ``
    ].join('\n');
}
