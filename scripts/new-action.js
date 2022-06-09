import { writeFile } from 'fs/promises'
import { actionTemplate } from './templates/action.js'

const [ name, type ] = process.argv.slice(2);

try {
    const template = actionTemplate({ name, type });

    // TODO: add path arg for instance of Robi app (custom) vs Robi action?
    await writeFile(`src/Robi/Actions/${name}.js`, template);
} catch (err) {
    console.error(err);
}