import { readFile } from 'fs/promises'
import { readfiles } from './readfiles.js'

export async function getfiles(path) {
    let output = '';

    const files = await readfiles(path);

    for (const file of files) {
        const text = await readFile(`${path}/${file}`, 'utf8');
        const content = text.match(/\/\/ @START-File([\s\S]*?)\/\/ @END-File/);

        output += content[1];
    }

    return output;
}