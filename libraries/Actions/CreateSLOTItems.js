// Create SLOT Items
import { CreateItem } from '../../src/Robi/Robi.js';

for (let i = 0; i < 25; i++) {
    const item = await CreateItem({
        list: 'SLOT',
        data: {
            SLOT: `Test # ${i}`
        }
    });

    console.log(item);
}