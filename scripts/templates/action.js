export function actionTemplate({ name, type}) {
    return [
        `// This file may be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made from the front end may not render properly.`,
        ``,
        `import { App } from '../Core/App.js'`,
        `import { Store } from '../Core/Store.js'`,
        ``,
        `// @START-File`,
        `/**`,
        ` * `,
        ` * @param {Object} param - Interface to this Robi action`,
        ` * @returns {undefined}`,
        ` */`,
        `export${type  === 'async' ? ' async ' : ' '}function ${name}(param) {`,
        `    const {`,
        `        `,
        `    } = param;`,
        ``,
        ``,
        `}`,
        `// @END-File`,
        ``
    ].join('\n');
}
