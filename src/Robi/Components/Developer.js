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
import { CreateItem, Store, UpdateItem, Wait } from '../Robi.js'

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
        parent
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
        margin: '0px 0px 40px 0px',
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

    // Toggle update
    let run = false;

    // Update clock and buttons
    const timer = Timer({
        parent,
        classes: [''],
        start() {
            run = true;
            console.log(`Run: ${run}`);

            // create(25);
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
        /** Set items */
        for (let i = 0; i < limit; i++) {

            if (run) {
                // Create Item
                const newItem = await CreateItem({
                    list: '',
                    data,
                    wait: false
                });

                console.log(`Id: ${newItem.Id}.`);

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

    // Open modal
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

    // Wait for all async events to finsih then scroll
    parent.get().scrollTo({
        top: param.scrollTop,
        behavior: 'smooth'
    });
}
// @END-File
