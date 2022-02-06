import { App } from '../Core/App.js'
import { Table } from './Table.js'
import { Card } from './Card.js'
import { LoadingSpinner } from './LoadingSpinner.js'
import { ErrorForm } from './ErrorForm.js'
import { LogForm } from './LogForm.js'
import { Get } from '../Actions/Get.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function LogsContainer({ parent }) {
    const logLoadingIndicator = LoadingSpinner({
        message: 'Loading logs',
        type: 'robi',
        parent: parent
    });

    logLoadingIndicator.add();

    const log = await Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        // top: '25',
    });

    const logCard = Card({
        background: 'var(--background)',
        width: '100%',
        radius: '20px',
        padding: '20px 30px',
        margin: '0px 0px 40px 0px',
        parent: parent
    });

    logCard.add();

    await Table({
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
        buttonColor: App.get('prefersColorScheme') === 'dark' ? '#303336' : '#dee2e6',
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

    const errorsLoadingIndicator = LoadingSpinner({
        message: 'Loading errors',
        type: 'robi',
        parent: parent
    });

    errorsLoadingIndicator.add();

    const errors = await Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,SessionId,Status,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        // top: '25'
    });

    const errorsCard = Card({
        background: 'var(--background)',
        width: '100%',
        radius: '20px',
        padding: '20px 30px',
        margin: '0px 0px 40px 0px',
        parent: parent
    });

    errorsCard.add();

    await Table({
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
        buttonColor: App.get('prefersColorScheme') === 'dark' ? '#303336' : '#dee2e6',
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
}
// @END-File
