import { ActionsEditor } from './ActionsEditor.js'
import { Timer } from './Timer.js'
import { Get } from '../Actions/Get.js'
import { HTML } from '../Actions/HTML.js'
import { Store } from '../Core/Store.js'
import { Style } from '../Actions/Style.js'
import { CreateItem, UpdateColumn } from '../Robi.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function UpdateMeasures({ parent }) {
    // const measuresRes = await fetch('../../intakes.json');
    const measuresRes = await fetch('../../import.txt');
    const measures = await measuresRes.json();

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

        for (let i = 475; i <= 508; i++) {
            if (run) {
                // Check if exists
                const exists = Get({
                    list: 'Measures',
                    filter: `Id eq ${i}`
                });

                if (exists[0]) {
                    console.log(`${i}: Measure already copied.`);

                    continue;
                }

                // Find measure
                const item = measures.find(measure => measure.ID === i);

                // Copy measure
                if (item) {
                    const { ID } = item;

                    console.log(`${ID}: COPY.`);

                    // Delete props
                    delete item.CreatedByAccount;
                    delete item.CreatedByEmail;
                    delete item.ModifiedByAccount;
                    delete item.ModifiedByEmail;

                    const newItem = await CreateItem({
                        list: 'Measures',
                        data: item
                    });

                    console.log(`${ID}: Created.`, newItem);
                } 
                
                // Placeholder Item
                else {
                    await CreateItem({
                        list: 'Measures',
                        data: {
                            ID: i,
                            MeasureName: 'DELETE'
                        }
                    });

                    console.log(`${i}: Not a measure. Created placeholder item.`);
                }

                if (i === measures.length - 1) {
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
