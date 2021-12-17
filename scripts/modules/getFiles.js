import { readdir, readFile } from 'fs/promises'

export async function getFiles(path) {
    let output = '';

    const files = await readdir(path);

    for (const file of files) {
        const text = await readFile(`${path}/${file}`, 'utf8');
        const content = text.match(/\/\/ @START-File([\s\S]*?)\/\/ @END-File/);

        output += content[1];
    }

    return output;
}