import { Authorize } from '../Actions/Authorize.js'
import { Get } from '../Actions/Get.js'
import { Title } from './Title.js'
import { FoldingCube } from './FoldingCube.js'
import { Card } from './Card.js'
import { Timer } from './Timer.js'
import { DevConsole } from './DevConsole.js'
import { App } from '../Core/App.js'
import { Table } from './Table.js' 
import { ErrorForm } from './ErrorForm.js'
import { LogForm } from './LogForm.js'
import { CreateItem, UpdateItem, Wait } from '../Robi.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function Developer(param) {
    const { parent } = param;

    /** Authorize */
    const isAuthorized = Authorize('Developer');

    if (!isAuthorized) {
        return;
    }

    /** View Title */
    const viewTitle = Title({
        title: 'Developer',
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const devConsole = DevConsole({
        parent
    });

    devConsole.add();

    const logLoadingIndicator = FoldingCube({
        label: 'Loading logs',
        margin: '40px 0px',
        parent
    });

    logLoadingIndicator.add();

    const log = await Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        top: '25',
        // skip: '0',
        // paged: true
    });

    // console.log(log);
    const logCard = Card({
        background: App.get('backgroundColor'),
        width: '100%',
        radius: '20px',
        padding: '20px 30px',
        margin: '0px 0px 40px 0px',
        parent
    });

    logCard.add();

    const logTable = await Table({
        heading: 'Logs',
        headingMargin: '0px 0px 20px 0px',
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id'
            },
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Title',
                displayName: 'Type'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ],
        buttons: [],
        buttonColor: '#dee2e6',
        showId: true,
        addButton: false,
        checkboxes: false,
        formTitleField: 'Id',
        order: [[0, 'desc']],
        items: log,
        editForm: LogForm,
        editFormTitle: 'Log',
        parent: logCard
    });

    logLoadingIndicator.remove();

    const errorsLoadingIndicator = FoldingCube({
        label: 'Loading errors',
        margin: '40px 0px',
        parent
    });

    errorsLoadingIndicator.add();

    const errors = await Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,SessionId,Status,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        top: '25'
    });

    const errorsCard = Card({
        background: App.get('backgroundColor'),
        width: '100%',
        radius: '20px',
        padding: '20px 30px',
        parent
    });

    errorsCard.add();

    const errorsTable = await Table({
        heading: 'Errors',
        headingMargin: '0px 0px 20px 0px',
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id'
            },
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ],
        buttonColor: '#dee2e6',
        showId: true,
        addButton: false,
        checkboxes: false,
        formFooter: false,
        formTitleField: 'Id',
        order: [[0, 'desc']],
        items: errors,
        editForm: ErrorForm,
        editFormTitle: 'Error',
        parent: errorsCard
    });

    errorsLoadingIndicator.remove();

    /** Toggle update */
    let run = false;

    /** Update clock and buttons */
    const timer = Timer({
        parent,
        classes: ['mt-4'],
        start() {
            run = true;
            console.log(`Run: ${run}`);

            create(25);
            // update();
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

    const items = []; // Get({ list: 'ListName' })

    async function create(limit) {
        const DashboardLinks = JSON.stringify([
            {
                url: "https://google.com",
                display: "Dashboard 1"
            },
            {
                url: "https://wikipedia.com",
                display: "Dashboard 2"
            }
        ]);
        const frequencies = [
            'Hoc',
            'Annually',
            'Daily',
            'Monthly',
            'Quarterly',
            'Annually',
            'Unknown',
            'Weekly'
        ];
        const options = [
            // AO is me, Under Development by me
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "Under Development",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is me, Under Development by another user
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "Under Development",
                AuthorId: 2,
                Author: {
                    Title: 'Jane Doe'
                },
                EditorId: 2,
                Editor: {
                    Title: 'Jane Doe'
                },
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is another user, Under Development by me
            {
                AOEmail: "jane.m.doe.civ@mail.mil",
                AOName: "Jane Doe",
                MeasureName: "Test",
                Status: "Under Development",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is another user, Under Development by another user
            {
                AOEmail: "jane.m.doe.civ@mail.mil",
                AOName: "Jane Doe",
                MeasureName: "Test",
                Status: "Under Development",
                AuthorId: 2,
                Author: {
                    Title: 'Jane Doe'
                },
                EditorId: 2,
                Editor: {
                    Title: 'Jane Doe'
                },
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // On Hold by me, and Published by me
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "On Hold",
                OnHoldComments: "Test",
                OnHoldEnd: "2021-12-15T22:00:00Z",
                OnHoldName: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                OnHoldStart: "2021-12-14T22:00:00Z",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // On Hold by me, and Published by another user
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "On Hold",
                OnHoldComments: "Test",
                OnHoldEnd: "2021-12-15T22:00:00Z",
                OnHoldName: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                OnHoldStart: "2021-12-14T22:00:00Z",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"Jane Doe\",\"Email\":\"jane.m.doe.civ@mail.mil\",\"LoginName\":\"0000000001@mil\",\"Role\":\"User\",\"SiteId\":2,\"Settings\":\"{}\",\"AuthorId\":2,\"Author\":{\"Title\":\"Jane Doe\"},\"Editor\":{\"Title\":\"Jane Doe\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":2}",
                AuthorId: 2,
                Author: {
                    Title: 'Jane Doe'
                },
                EditorId: 2,
                Editor: {
                    Title: 'Jane Doe'
                },
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // On Hold by another user, but Published by me
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "On Hold",
                OnHoldComments: "Test",
                OnHoldEnd: "2021-12-15T22:00:00Z",
                OnHoldName: "{\"Title\":\"Jane Doe\",\"Email\":\"jane.m.doe.civ@mail.mil\",\"LoginName\":\"0000000001@mil\",\"Role\":\"User\",\"SiteId\":2,\"Settings\":\"{}\",\"AuthorId\":2,\"Author\":{\"Title\":\"Jane Doe\"},\"Editor\":{\"Title\":\"Jane Doe\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":2}",
                OnHoldStart: "2021-12-14T22:00:00Z",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is me, and Published by me
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "Published",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is another user, but Published by me
            {
                AOEmail: "jane.m.doe.civ@mail.mil",
                AOName: "Jane Doe",
                MeasureName: "Test",
                Status: "Published",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"First Last\",\"Email\":\"first.mi.last.ctr@mail.mil\",\"LoginName\":\"0987654321@mil\",\"Role\":\"Developer\",\"SiteId\":1,\"Settings\":\"{}\",\"AuthorId\":1,\"Author\":{\"Title\":\"First Last\"},\"Editor\":{\"Title\":\"First Last\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":1}",
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is me, but Published by another user
            {
                AOEmail: "first.mi.last.ctr@mail.mil",
                AOName: "First Last",
                MeasureName: "Test",
                Status: "Published",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"Jane Doe\",\"Email\":\"jane.m.doe.civ@mail.mil\",\"LoginName\":\"0000000001@mil\",\"Role\":\"User\",\"SiteId\":2,\"Settings\":\"{}\",\"AuthorId\":2,\"Author\":{\"Title\":\"Jane Doe\"},\"Editor\":{\"Title\":\"Jane Doe\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":2}",
                AuthorId: 2,
                Author: {
                    Title: 'Jane Doe'
                },
                EditorId: 2,
                Editor: {
                    Title: 'Jane Doe'
                },
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            },
            // AO is another user, and Published by another user
            {
                AOEmail: "jane.m.doe.civ@mail.mil",
                AOName: "Jane Doe",
                MeasureName: "Test",
                Status: "Published",
                Published: "2021-12-14T21:57:27.738Z",
                Publisher: "{\"Title\":\"Jane Doe\",\"Email\":\"jane.m.doe.civ@mail.mil\",\"LoginName\":\"0000000001@mil\",\"Role\":\"User\",\"SiteId\":2,\"Settings\":\"{}\",\"AuthorId\":2,\"Author\":{\"Title\":\"Jane Doe\"},\"Editor\":{\"Title\":\"Jane Doe\"},\"Created\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Modified\":\"Tue, 14 Dec 2021 21:43:57 GMT\",\"Id\":2}",
                AuthorId: 2,
                Author: {
                    Title: 'Jane Doe'
                },
                EditorId: 2,
                Editor: {
                    Title: 'Jane Doe'
                },
                DashboardLinks,
                Frequency: frequencies[Math.floor(Math.random() * frequencies.length)]
            }
        ];

        /** Set items */
        for (let i = 0; i < limit; i++) {

            if (run) {
                const choice = Math.floor(Math.random() * options.length);
                const data = options[choice];

                // Create Item
                const newItem = await CreateItem({
                    list: 'Measures',
                    data,
                    wait: false
                });

                // Set MeasureId
                await UpdateItem({
                    list: 'Measures',
                    itemId: newItem.Id,
                    data: {
                        MeasureId: newItem.Id
                    },
                    wait: false
                });

                console.log(`Id: ${newItem.Id}.`, `Option: ${choice}`);

                if (i === limit - 1) {
                    timer.stop();
                }
            } else {
                console.log('stoped');

                break;
            }
        }
    }

    async function update() {
        /** Set items */
        for (let i = 0; i < items.length; i++) {
            if (run) {

                // update item
                if (i === items.length - 1) {
                    timer.stop();
                }
            } else {
                console.log('stoped');

                break;
            }
        }
    }

    // /** Test Attach Files Button */
    // const attachFilesButton = UploadButton({
    //     async action(files) {
    //         console.log(files);
    //         const uploadedFiles = await AttachFiles({
    //             list: 'View_Home',
    //             id: 1,
    //             files
    //         });
    //         console.log(uploadedFiles);
    //     },
    //     parent,
    //     type: 'btn-outline-success',
    //     value: 'Attach file',
    //     margin: '20px 0px 20px 0px'
    // });
    // attachFilesButton.add();
    // /** Test Send Email */
    // const sendEmailButton = BootstrapButton({
    //     async action(event) {
    //         await SendEmail({
    //             From: 'stephen.a.matheis.ctr@mail.mil',
    //             To: 'stephen.a.matheis.ctr@mail.mil',
    //             CC: [
    //                 'stephen.a.matheis.ctr@mail.mil'
    //             ],
    //             Subject: `Test Subject`,
    //             Body: /*html*/ `
    //                 <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
    //                     <p>
    //                         Test body. <strong>Bold</strong>. <em>Emphasized</em>.
    //                     </p>
    //                     <p>
    //                         <a href='https://google.com'>Google</a>
    //                     </p>
    //                 </div>
    //             `
    //         });
    //     },
    //     parent,
    //     classes: ['mt-5'],
    //     type: 'outline-success',
    //     value: 'Send Email',
    //     margin: '0px 0px 0px 20px'
    // });
    // sendEmailButton.add();
    /** Open modal */
    if (param.pathParts.length === 3) {
        const {
            pathParts
        } = param;

        const table = pathParts[1];
        const itemId = parseInt(pathParts[2]);

        let row;

        if (table === 'Errors') {
            row = errorsTable.findRowById(itemId);
        } else if (table === 'Logs') {
            row = logTable.findRowById(itemId);
        }

        if (row) {
            row.show().draw(false).node()?.click();
        }
    }
}
// @END-File
