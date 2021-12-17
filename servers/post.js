import { createServer } from 'http';
import { createWriteStream, mkdirSync } from 'fs';

createServer((req, res) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days
        /** add other headers as per requirement */
    };

    if (req.method === "POST") {
        let body;

        req.on("data", data => {
            body = data;

            // TODO: Handle malformed requests
            const url = decodeURI(req.url);
            const query = url.split('?')[1];
            const props = query.split('&');
            const { path, file } = Object.fromEntries(props.map(prop => {
                const [ key, value ] = prop.split('=');
                return [ key, value ];
            }));

            // Make dirs if they don't exist
            // console.log(path);
            mkdirSync(`./${path}`, { recursive: true });

            const writableStream = createWriteStream(`./${path}/${file}`);
            writableStream.write(data);

            console.log(`\nposts.js: successfully wrote to -> ${path}/${file}\n`);
        });

        req.on("end", () => {
            res.writeHead(200, headers);
            res.end(body);
        });

        return;
    }

    if (req.method === "GET") {
        req.on("end", () => {
            res.writeHead(200, headers);
            res.end(/*html*/ `
                <h1>Post to: http://127.0.0.1:2035/?path=[path/to/file]&file=[filename.ext]</h1>
            `);
        });

        return;
    }

}).listen(2035);