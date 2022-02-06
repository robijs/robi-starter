import { Get } from '../../Robi.js'
import { UpdateItem } from '../../src/Robi/Robi.js';

const items = Get({ list: 'MLOT' });

for (let item of items) {
    const newItem = await UpdateItem({
        list: 'MLOT',
        itemId: item.Id,
        data: {
            MLOT: `Updated on ${new Date().toDateString()}`
        },
        wait: false
    });

    console.log(`Id: ${newItem.Id}.`);
}