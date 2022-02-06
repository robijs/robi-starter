import { mkdir } from 'fs/promises'
import { copy } from 'fs-extra'
import { buildFile as buildFileProd } from './modules/build-file-prod.js'
import { buildFile as buildFileDev } from './modules/build-file-dev.js'

const [ type ] = process.argv.slice(2);

switch (type) {
    case undefined:
        full();
        break;
    case 'm':
    case 'min':
        min();
        break;
    default:
        full();
}

async function full() {
    console.log('full');
}

async function min() {
    console.log('Building minified SharePoint distribution in ./dist\n');

    let license = [
        `// Copyright ${new Date().getFullYear()} Stephen Matheis`,
        '',
        '// Permission to use, copy, modify, and/or distribute this software for any',
        '// purpose with or without fee is hereby granted, provided that the above',
        '// copyright notice and this permission notice appear in all copies.' ,
        '',
        '// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES',
        '// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF',
        '// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY',
        '// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER',
        '// RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF',
        '// CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN',
        '// CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.',
        ''
    ];

    try {
        // Create dir
        await mkdir('./dist/src/Robi', { recursive: true })

        // Robi
        await buildFileProd({
            license,
            paths: [
                './src/Robi/Actions',
                './src/Robi/Core',
                './src/Robi/Models',
                './src/Robi/Templates'
            ],
            imports: [
                './src/Robi/Components'
            ],
            importFile: 'RobiUI.js',
            dir: './dist/src/Robi',
            file:'Robi.js'
        });

        // RobiUI
        await buildFileProd({
            license,
            paths: [
                './src/Robi/Components',
            ],
            imports: [
                './src/Robi/Actions',
                './src/Robi/Core',
                './src/Robi/Models',
                './src/Robi/Templates'
            ],
            importFile: 'Robi.js',
            dir: './dist/src/Robi',
            file: 'RobiUI.js'
        });

        // Spacer
        console.log('');

        // Copy Pages
        await copy('./src/Pages', './dist/src/Pages');
        console.log('Copied ./src/Pages > ./dist/src/Pages');

        // Copy Images
        await copy('./src/Images', './dist/src/Images');
        console.log('Copied ./src/Images > ./dist/src/Images');

        // Copy Lists
        await copy('./src/Lists', './dist/src/Lists');
        console.log('Copied ./src/Lists > ./dist/src/Lists');

        // Copy Libraries
        await copy('./src/Libraries', './dist/src/Libraries');
        console.log('Copied ./src/Libraries > ./dist/src/Libraries');

        // Copy Workers
        await copy('./src/Robi/Workers', './dist/src/Robi/Workers');
        console.log('Copied ./src/Robi/Workers > ./dist/src/Robi/Workers');

        // Copy Routes
        await copy('./src/Routes', './dist/src/Routes');
        console.log('Copied ./src/Routes > ./dist/src/Routes');

        // Copy app.js
        await copy('./src/app.js', './dist/src/app.js');
        console.log('Copied ./src/app.js > ./dist/src/app.js')

        // Success
        console.log('\nDone!');

    } catch (err) {
        console.error(err);
    }
}