import { writeFile } from 'fs/promises'
import { readfiles } from './readfiles.js'

export async function buildFile({ license, paths, dir, file }) {
    let output = license.join('\n');
    let exportNames = [];

    // Imports
    for (const path of paths) {
        const files = await readfiles(path);
        exportNames = exportNames.concat(files);
        
        output += files.map(file => {
            return `import { ${file.replace('.js', '')} } from '${path.replace('./src/Robi/', './')}/${file}'`
        }).join('\n');

        output += '\n';
    }


    output += [
        '',
        'export {',
        exportNames.map(name => `    ${name.replace('.js', '')}`).join(',\n'),
        `}`,
        ''
    ].join('\n');

    await writeFile(`${dir || './src/Robi'}/${file}`, output);

    console.log(`Built ${file} in ${dir || './src/Robi'}`);
}
