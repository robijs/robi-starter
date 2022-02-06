import { writeFile } from 'fs/promises'
import { readfiles } from './readfiles.js'
import { getfiles } from './getfiles.js'

export async function buildFile({ license, paths, dir, imports, importFile, file }) {
    let output = license.join('\n');
    let body = '';
    let importNames = [];

    // Imports
    for (const path of imports) {
        importNames = importNames.concat(await readfiles(path));
    }

    // FIXME: Don't add files from src/Robi/Templates yet, will trip false positive below
    // EX: Title() is only  found in RouteTemplate.
    for (const path of paths) {
        body += await getfiles(path);
    }

    output += [
        '',
        'import {',
        importNames
        .filter(file => {
            const name = file.replace('.js', '')
            // Ex: AddRoute();
            const asFunc = body.search(RegExp(`\\b${name}\\b\\(`, 'g'));
            // Ex: AddRoute.method()
            const asObj = body.search(RegExp(`\\b${name}\\b\\.`, 'g'));
            // Ex: const obj = { func: AddRoute };
            const asArg = body.search(RegExp(`\\b: ${name}\\b`, 'g'));
            // Ex: const obj = {func:AddRoute};
            const asArgNoSpace = body.search(RegExp(`\\b:${name}\\b`, 'g')); 

            // console.log(name);
            // console.log(RegExp(`\\b${name}\\b\\(`, 'g'), asFunc);
            // console.log(RegExp(`\\b${name}\\b\\.`, 'g'), asObj);
            // console.log(RegExp(`\\b: ${name}\\b`, 'g'), asArg);
            // console.log(RegExp(`\\b:${name}\\b`, 'g')), asArgNoSpace);

            if (asFunc !== -1 || asObj !== -1 || asArg !== -1 || asArgNoSpace !== -1) {
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
