import { createServer } from 'http';
import { createWriteStream, mkdirSync, renameSync } from 'fs';

createServer((req, res) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS, PUT",
        "Access-Control-Max-Age": 2592000, // 30 days
    };

    if (req.method === "POST") {
        let body;

        req.on("data", data => {
            body = data;

            // TODO: Handle other methods
            const url = decodeURI(req.url);
            const query = url.split('?')[1];
            const props = query.split('&');

            // console.log(props);

            const { path, file } = Object.fromEntries(props.map(prop => {
                const [ key, value ] = prop.split('=');

                // console.log(prop, key, value);

                return [ key, value ];
            }));

            // METHOD: newform
            if (path === 'newform') {
                // Make dirs if they don't exist
                mkdirSync(`./src/Lists/${file}`, { recursive: true });

                const writableStream = createWriteStream(`./src/Lists/${file}/NewForm.js`);
                writableStream.write(data);

                console.log(`\nCreated '${file}' new form\n`);

                return;
            }
 
            // METHOD: editform
            if (path === 'editform') {
                // Make dirs if they don't exist
                mkdirSync(`./src/Lists/${file}`, { recursive: true });

                const writableStream = createWriteStream(`./src/Lists/${file}/EditForm.js`);
                writableStream.write(data);

                console.log(`\nCreated '${file}' new form\n`);

                return;
            }

            // FIXME: Sometimes file is saved without any data
            // Make dirs if they don't exist
            mkdirSync(`./${path}`, { recursive: true });

            const writableStream = createWriteStream(`./${path}/${file}`);
            writableStream.write(data);

            console.log(`\nSuccessfully wrote to -> ${path}/${file}\n`);
        });

        req.on("end", () => {
            res.writeHead(200, headers);
            res.end(body);
        });

        return;
    }

    if (req.method === "PUT") {
        let body;

        req.on("data", data => {
            body = data;

            // TODO: Handle malformed requests
            const url = decodeURI(req.url);
            const query = url.split('?')[1];
            const [ oldName, newName ] = query.split('&');

            // Rename file
            renameSync(`./src/Routes/${oldName}/${oldName}.js`, `./src/Routes/${oldName}/${newName}.js`);

            // Rename dir
            renameSync(`./src/Routes/${oldName}`, `./src/Routes/${newName}`);

            req.on("end", () => {
                res.writeHead(200, headers);
            });

            const writableStream = createWriteStream(`./src/Routes/${newName}/${newName}.js`);
            writableStream.write(data);

            console.log(`Successfully updated route: ${oldName} -> ${newName} \n`);
        });

        req.on("end", () => {
            res.writeHead(200, headers);
            res.end(body);
        });

        return;
    }

    if (req.method === "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
        return;
    }

    if (req.method === "DELETE") {
        // TODO: Handle malformed requests
        const url = decodeURI(req.url);
        const query = url.split('?')[1];
        const props = query.split('&');
        const { path, file } = Object.fromEntries(props.map(prop => {
            const [ key, value ] = prop.split('=');
            return [ key, value ];
        }));

        // Make dirs if they don't exist
        renameSync(`./${path}`, `./${path}_ARCHIVED`);

        console.log(`\nSuccessfully archvied route at -> ${path}_ARCHIVED\n`);

        req.on("end", () => {
            res.writeHead(200, headers);
        });

        return;
    }

    if (req.method === "GET") {
        res.writeHead(200, headers);
        res.end(/*html*/ `
            <h1>Methods allowed:</h1>
            <ul>
                <li>POST: http://127.0.0.1:2035/?path=[path/to/file]&file=[filename.ext]</li>
                <li>DELETE:</li>
                <ul>
                    <li>Directory: http://127.0.0.1:2035/?path=[path/to/dir]</li>
                    <li>File: http://127.0.0.1:2035/?path=[path/to/file]&file=[filename.ext]</li>
                </ul>
            </ul>
        `);
        return;
    }

}).listen(2035);