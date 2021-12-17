import { rm } from 'fs/promises';

await rm('./dist', { recursive: true });

console.log('Removed ./dist');