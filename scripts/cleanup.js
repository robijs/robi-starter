import { readdir, rmdir } from 'fs/promises'

let dirs = await readdir('./src/Routes');

dirs = dirs.filter(dir => dir.includes('_ARCHIVED'))

for (let dir of dirs) {
    await rmdir(`./src/Routes/${dir}`, { recursive: true, force: true });
}