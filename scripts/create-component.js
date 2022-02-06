import { writeFile } from 'fs/promises'
import { componentTemplate } from './templates/component.js'

const [ name, type ] = process.argv.slice(2);

try {
    // TODO: split working dir on /, determine how to construct relative path to Robi.js
    const template = componentTemplate({ name, type });

    // TODO: add path arg
    await writeFile(`${process.env.INIT_CWD}/${name}.js`, template);
} catch (err) {
    console.error(err);
}