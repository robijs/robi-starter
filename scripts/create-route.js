import { writeFile } from 'fs/promises'
import { routeTemplate } from './templates/route.js'

const [ name, title ] = process.argv.slice(2);

try {
    // TODO: split working dir on /, determine how to construct relative path to Robi.js
    const template = routeTemplate({ name, title });

    await writeFile(`${process.env.INIT_CWD}/${name}.js`, template);
} catch (err) {
    console.error(err);
}