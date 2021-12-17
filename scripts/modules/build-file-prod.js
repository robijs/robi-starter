import { readdir, writeFile } from 'fs/promises'
import { getFiles } from './getFiles.js'

export async function buildFile({ license, paths, dir, imports, importFile, file }) {
    let output = license.join('\n');
    let body = '';
    let importNames = [];

    // Imports
    for (const path of imports) {
        importNames = importNames.concat(await readdir(path)); 
    }

    for (const path of paths) {
        body += await getFiles(path);
    }

    output += [
        '',
        'import {',
        importNames
        .filter(file => {
            const name = file.replace('.js', '')
            const asFunc = body.search(RegExp(`\\b${name}\\b\\(`, 'g'));
            const asObj = body.search(RegExp(`\\b${name}\\b\\.`, 'g'));

            // console.log(name);
            // console.log(RegExp(`\\b${name}\\b\\(`, 'g'), asFunc);
            // console.log(RegExp(`\\b${name}\\b\\.`, 'g'), asObj);

            if (asFunc !== -1 || asObj !== -1) {
                return file;
            }
        })
        .map(name => `    ${name.replace('.js', '')}`).join(',\n'),
        `} from './${importFile}'`,
        ''
    ].join('\n');

    output += body;

    await writeFile(`${dir || './src/Robi'}/${file}`, output);

    console.log(`Built ${file} in ${dir || './src/Robi'}`);
}
