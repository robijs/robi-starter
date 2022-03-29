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
export async function ActionsCards({ parent, path }) {
    // NOTE:

    // const originalRes = await fetch('../../import.txt');
    // const original = await originalRes.json();
    // const measuresRes = await fetch('../../measures.json');
    // const measures = await measuresRes.json();

    // let output = [...Array(508).keys()].map(num => {
    //     const measure = measures.find(m => parseInt(m.ID) === num + 1) || { MeasureName: 'PLACEHOLDER'};
    //     const originalItem = original.find(m => parseInt(m.ID) === num + 1) || { MeasureName: 'PLACEHOLDER'};

    //     if (measure.Status === 'Under Development') {
    //         measure.Publisher = null;
    //         measure.Published = null;
    //     }

    //     if (measure.MeasureName !== 'PLACEHOLDER') {
    //         measure.ModifiedByAccount = originalItem.ModifiedByAccount;
    //     }

    //     const keys = Object.keys(measure);
        
    //     keys.forEach(key => {
    //         if (measure[key] === '') {
    //             measure[key] = null;
    //         }
    //     });

    //     delete measure['Item Type'];
    //     delete measure['Path'];
        
    //     measure.ModifiedByAccount = originalItem.ModifiedByAccount;
        
    //     return measure;
    // });

    // console.log(output);

    // return;

    // NOTE:

    // const measuresRes = await fetch('../../intakes.json');
    // const measuresRes = await fetch('../../import.txt');
    // const measures = await measuresRes.json();

    // const toMapRes = await fetch('../../file-types.json');
    // const toMapItems = await toMapRes.json();

    // let output = measures.map(item => {
    //     const { ID } = item;
    //     const toMap = toMapItems.filter(a => parseInt(a['Measure ID']) === ID);

    //     item.FileTypes = JSON.stringify(
    //         toMap.map(i => {
    //             return {
    //                 name: i.Title,
    //                 type: i['File Type']
    //             }
    //         })
    //     );

    //     return item;
    // });

    // console.log(output);

    // // Ex: "[{\"name\":\"Test\",\"type\":\"Excel\"},{\"name\":\"Test 2\",\"type\":\"Text\"}]"
    // output = measures.map((measure, index) => {
    //     // https://stackoverflow.com/a/31102605
    //     const ordered = Object.keys(measure).sort().reduce(
    //         (obj, key) => {
    //           obj[
    //             key
    //             .replaceAll(`'`,'')
    //             .replaceAll(`-`,'')
    //             .replaceAll(`_`,'')
    //             .replaceAll(` `,'')
    //             .replaceAll(`/`,'')
    //             .replaceAll(`(`,'')
    //             .replaceAll(`)`,'')
    //             .replaceAll(`+`,'')
    //           ] = measure[key]; 
    //           return obj;
    //         }, 
    //         {}
    //     );

    //     return ordered;
    // });

    // console.log('Output', output);

    // const measuresRes = await fetch('https://info.health.mil/staff/analytics/cp/ModernDev/create-app/measures-library-dev/App/combined.txt');
    // const measures = await measuresRes.json();

    // const names = [
    //     // Override system fields
    //     {
    //         newName: 'ID',
    //         oldName: 'ID'
    //     },
    //     {
    //         newName: 'Modified',
    //         oldName: 'Modified'
    //     },
    //     {
    //         newName: 'ModifiedByEmail',
    //         oldName: 'ModifiedBy'
    //     },
    //     {
    //         newName: 'Created',
    //         oldName: 'Created'
    //     },
    //     {
    //         newName: 'CreatedByEmail',
    //         oldName: 'CreatedBy2'
    //     },
    //     // Measures Fields
    //     {
    //         newName: 'AOEmail',
    //         oldName: 'AOsEmail'
    //     },
    //     {
    //         newName: 'AOName',
    //         oldName: 'ActionOfficer'
    //     },
    //     {
    //         newName: 'AOOffice',
    //         oldName: 'AOsOfficeDivision'
    //     },
    //     {
    //         newName: 'AltAOEmail',
    //         oldName: 'AltAOsEmail'
    //     },
    //     {
    //         newName: 'AltAOName',
    //         oldName: 'AlternateAO'
    //     },
    //     {
    //         newName: 'AltAOOffice',
    //         oldName: 'AltAOsOfficeDivision'
    //     },
    //     {
    //         newName: 'AltDSEmail',
    //         oldName: 'AltDSEmail'
    //     },
    //     {
    //         newName: 'AltDSName',
    //         oldName: 'AltDataScientist'
    //     },
    //     {
    //         newName: 'AltDSOffice',
    //         oldName: 'AltDSOfficeDivision'
    //     },
    //     {
    //         newName: 'AnnualUpdateSchedule',
    //         oldName: 'AnnualUpdateSchedule'
    //     },
    //     {
    //         newName: 'ArchivedDataSources',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'Baseline',
    //         oldName: 'Baseline'
    //     },
    //     {
    //         newName: 'BaselineValue',
    //         oldName: 'BaselineValue'
    //     },
    //     {
    //         newName: 'Benchmarks',
    //         oldName: 'BenchmarksFY21'
    //     },
    //     {
    //         newName: 'CareAvailability',
    //         oldName: 'DataLevelAvailability'
    //     },
    //     {
    //         newName: 'CreatedOriginal',
    //         oldName: 'Created',
    //     },
    //     {
    //         newName: 'DSEmail',
    //         oldName: 'DSEmail'
    //     },
    //     {
    //         newName: 'DSName',
    //         oldName: 'DataScientist'
    //     },
    //     {
    //         newName: 'DSOffice',
    //         oldName: 'DSOfficeDivision'
    //     },
    //     {
    //         newName: 'DashboardLinks',
    //         oldName: 'DashboardLinks'
    //     },
    //     {
    //         newName: 'DataAggLevels',
    //         oldName: 'DataAggregationLevel'
    //     },
    //     {
    //         newName: 'DataLagUnit',
    //         oldName: 'DataLagUnit'
    //     },
    //     {
    //         newName: 'DataLagValue',
    //         oldName: 'DataLag'
    //     },
    //     {
    //         newName: 'DataLatency',
    //         oldName: 'DataLatency'
    //     },
    //     {
    //         newName: 'DataSource',
    //         oldName: 'SourceofData'
    //     },
    //     {
    //         newName: 'Denominator',
    //         oldName: 'Denominator'
    //     },
    //     {
    //         newName: 'Description',
    //         oldName: 'Description'
    //     },
    //     {
    //         newName: 'Exclusions',
    //         oldName: 'Exclusions'
    //     },
    //     {
    //         newName: 'FileTypes',
    //         oldName: ''
    //     },
    //     // TODO: Map choices
    //     // Ex: Annual/Annually -> Yearly
    //     // Ex: Hoc/Ad Hoc -> Irregular
    //     {
    //         newName: 'Frequency',
    //         oldName: 'ReportingFrequency'
    //     },
    //     {
    //         newName: 'GenesisIncluded',
    //         oldName: 'GENESISSiteIncluded'
    //     },
    //     {
    //         newName: 'Inclusions',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'IsAllDataMIP',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'IsAutomated',
    //         oldName: 'Automated'
    //     },
    //     {
    //         newName: 'Limitations',
    //         oldName: 'Limitations'
    //     },
    //     {
    //         newName: 'MIPNameLoc',
    //         oldName: 'MIPLocation'
    //     },
    //     {
    //         newName: 'MeasureAbr',
    //         oldName: 'MeasureAbbreviation'
    //     },
    //     {
    //         newName: 'MeasureCategory',
    //         oldName: 'MeasureCategory'
    //     },
    //     {
    //         newName: 'MeasureId',
    //         oldName: 'MeasureNumber'
    //     },
    //     {
    //         newName: 'MeasureName',
    //         oldName: 'MeasureName'
    //     },
    //     {
    //         newName: 'MeasureSet',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'MeasuresBranchRep',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'MeasuresBranchRepEmail',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'MeasureStatus',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'MeasureType',
    //         oldName: 'MeasureType'
    //     },
    //     {
    //         newName: 'NumberOfUploads',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'Numerator',
    //         oldName: 'Numerator'
    //     },
    //     {
    //         newName: 'OnHoldComments',
    //         oldName: 'OnHoldComments'
    //     },
    //     {
    //         newName: 'OnHoldEnd',
    //         oldName: 'OnHoldEstEnd'
    //     },
    //     {
    //         newName: 'OnHoldName',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'OnHoldStart',
    //         oldName: 'OnHoldStart'
    //     },
    //     {
    //         newName: 'PQACategory',
    //         oldName: 'QuadAim'
    //     },
    //     // FIXME: Missing main field from source?
    //     {
    //         newName: 'ProgLang',
    //         oldName: 'OtherProgName'
    //     },
    //     {
    //         newName: 'Publisher',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'Published',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'Rationale',
    //         oldName: 'Rationale'
    //     },
    //     {
    //         newName: 'RawDataLocation',
    //         oldName: 'RawDataLoc'
    //     },
    //     {
    //         newName: 'ReviewFocusArea',
    //         oldName: ''
    //     },
    //     {
    //         newName: 'RiskAdjusted',
    //         oldName: 'RiskAdjusted'
    //     },
    //     {
    //         newName: 'SQLNameLoc',
    //         oldName: 'SQLLocation'
    //     },
    //     {
    //         newName: 'ScheduledRefreshDay',
    //         oldName: 'ScheduledRefreshDay'
    //     },
    //     {
    //         newName: 'ScheduledRefreshMonth',
    //         oldName: 'ScheduledRefreshMonth'
    //     },
    //     {
    //         newName: 'Status',
    //         oldName: 'MeasureStatus'
    //     },
    //     {
    //         newName: 'Tags',
    //         oldName: 'Tags'
    //     },
    //     {
    //         newName: 'Targets',
    //         oldName: 'FY21Target'
    //     }
    // ];

    // const newSchema = output.map(measure => {
    //     const data = {};

    //     for (let fieldPair in names) {
    //         const { oldName, newName } = names[fieldPair];

    //         if (oldName) {
    //             data[newName] = measure[oldName] || null;
    //         }
    //     }

    //     return data;
    // });

    // const newItems = newSchema.map(record => {
    //     record.ID = parseInt(record.ID);
    //     record.MeasureId = parseInt(record.ID);
    //     record.DataLagValue = parseInt(record.DataLagValue);
    //     record.DataAggLevels = {
    //         results: record.DataAggLevels?.split(';#') || []
    //     }
    //     record.ProgLang = {
    //         results: record.ProgLang?.split(';#') || []
    //     }
    //     record.MeasureCategory = {
    //         results: record.MeasureCategory?.split(';#') || []
    //     }
    //     record.MeasureType = {
    //         results: record.MeasureType?.split(';#') || []
    //     }
    //     record.DataSource = {
    //         results: record.DataSource?.split(';#') || []
    //     }

    //     return record;
    // });

    // console.log('New Schema:', newSchema);
    // console.log('New Items:', newItems);

    let run = false;

    const timer = Timer({
        parent,
        classes: ['w-100'],
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
        // Override read only fields
        await UpdateColumn({
            list: 'Measures',
            field: {
                name: 'Created',
                readOnly: false
            }
        });

        await UpdateColumn({
            list: 'Measures',
            field: {
                name: 'Modified',
                readOnly: false
            }
        });

        // Items
        const items = await Get({
            list: 'Measures',
            select: `*,Author/Title,Editor/Title`,
            expand: `File,Author,Editor`
        });

        console.log(items);

        // {"Title":"First Last","Email":"first.mi.last.ctr@mail.mil","LoginName":"0987654321@mil","Roles":{"results":["Developer","Visitor"]},"SiteId":1,"Settings":"{\"searches\":{},\"watched\":[]}","AuthorId":1,"Author":{"Title":"First Last","LoginName":"0987654321@mil"},"EditorId":1,"Editor":{"Title":"First Last","LoginName":"0987654321@mil"},"Created":"Sat, 26 Feb 2022 22:28:51 GMT","Modified":"Sat, 26 Feb 2022 22:30:12 GMT","Id":1}
        for (let [i, item] of items.entries()) {
            if (run) {
                const { ID, Author, Editor } = item;
                const { Created, Modified } = measures.find(m => parseInt(m.ID) === ID);

                // console.log(item, measure);
                console.log({
                    Modified,
                    Published: Created,
                    Publisher: Author
                });

                continue;

                const updatedItem = await UpdateItem({
                    list: 'Measures',
                    itemId: ID,
                    data: {
                        // Published: 
                    }
                })

                if (i === measures.length - 1) {
                    timer.stop();
                }
            } else {
                console.log('stoped');
  
                break;
            }
        }
    }

    return;

    // TODO: Make actions directly addressable ( how to make sure unique path betwen user and shared names/ids? )

    let userSettings = JSON.parse(Store.user().Settings);
    let myActions = userSettings.actions || [];
    const sharedActions = await Get({
        list: 'Actions'
    });

    Style({
        name: 'action-cards',
        style: /*css*/ `
            .actions-title {
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 20px;
            }

            .action-card-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, 150px); /* passed in size or 22 plus (15 * 2 for padding) */
                justify-content: space-between;
                width: 100%;
            }

            .action-card {
                cursor: pointer;
                height: 150px;
                width: 150px;
                border-radius: 20px;
                background: var(--background);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                font-weight: 500;
            }

            .action-btn {
                margin-right: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 32px;
                height: 32px;
                cursor: pointer;
            }

            .action-btn .icon {
                fill: var(--primary);
            }
        `
    });

    // My Actions
    parent.append(/*html*/ `
        <div class='actions-title'>My Actions</div>
        <div class='action-card-container'>
            ${
                HTML({
                    items: myActions,
                    each(item) {
                        const { Name, FileNames } = item;
                        
                        return /*html*/ `
                            <div class='action-card' data-files='${FileNames}'>${Name}</div>
                        `
                    }
                })
            }
        </div>
    `);

    parent.findAll('.action-card').forEach(card => {
        card.addEventListener('click', event => {
            parent.empty();

            ActionsEditor({ parent, files: event.target.dataset.files });
        });
    });
}
// @END-File
