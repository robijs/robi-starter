import { ActionsEditor } from './ActionsEditor.js'
import { Timer } from './Timer.js'
import { Get } from '../Actions/Get.js'
import { HTML } from '../Actions/HTML.js'
import { Store } from '../Core/Store.js'
import { Style } from '../Actions/Style.js'
import { CreateItem, UpdateColumn, UpdateItem } from '../Robi.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function UpdateDataFiles({ parent, path }) {
    const mopRes = await fetch('../../mop.txt');
    const mop = await mopRes.json();

    let run = false;

    const timer = Timer({
        parent,
        classes: ['mt-4', 'w-100'],
        start() {
            run = true;
            console.log(`Run: ${run}`);

            create();
        },
        stop() {
            run = false;
            console.log(`Run: ${run}`);
        },
        reset() {
            console.log('reset');
        }
    });
  
    timer.add();

    async function create() {
        const digest = await GetRequestDigest();
        const dataFilesRes = await fetch(
            [
                `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('DataFiles')/Files?`,
                `&$expand=ListItemAllFields,File`
            ].join(''),
            {
            method: 'GET',
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-type": "application/json; odata=verbose",
                "X-RequestDigest": digest,
            }
        });
        const data = await dataFilesRes.json();
    
        const dataFiles = data.d.results.map(file => {
            file.ListItemAllFields.Name = file.Name

            return file.ListItemAllFields
        });
    
        // console.log(dataFiles);

        let counter = 0;

        for (let [index, item] of dataFiles.entries()) {
            if (run) {
                const { Name, Id } = item;
                const mopItem = mop.find(m => m.Name === Name);
                
                if (mopItem) {
                    const { DataThroughDate, DataPulledDate, MeasureId } = mopItem;

                    const updatedItem = await UpdateItem({
                        list: 'DataFiles',
                        itemId: Id,
                        data: {
                            DataThroughDate,
                            DataPulledDate,
                            MeasureId: parseInt(MeasureId)
                        }
                    });

                    console.log(`ID: ${updatedItem.Id} > Measure Id: ${updatedItem.MeasureId}`);
                    counter++;
                } else {
                    console.log(`Name: ${Name} > missing MOP item`);
                }

                if (index === dataFiles.length - 1) {
                    console.log(counter);

                    timer.stop();
                }
            } else {
                console.log('stoped');
  
                break;
            }
        }
    }
}
// @END-File
