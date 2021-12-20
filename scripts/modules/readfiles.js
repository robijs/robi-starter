import { readdir } from 'fs/promises'

export async function readfiles(path) {
    const files = await readdir(path);
    const ignore = ['.DS_Store'];
    
    return files.filter(file => !ignore.includes(file));
}