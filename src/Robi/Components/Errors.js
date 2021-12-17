import { Get } from '../Actions/Get.js'
import { Route } from '../Actions/Route.js'
import { Alert } from './Alert.js'
import { BootstrapButton } from './BootstrapButton.js'
import { Container } from './Container.js'
import { FoldingCube } from './FoldingCube.js'
import { Heading } from './Heading.js'
import { SingleLineTextField } from './SingleLineTextField.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function Errors(param) {
    const {
        sessionId, parent
    } = param;

    /** Errors Container */
    const errorsContainer = Container({
        display: 'block',
        width: '100%',
        parent
    });

    errorsContainer.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading errors',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    /** Get Errors */
    const errors = await Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        filter: `SessionId eq '${sessionId}'`
    });

    console.log(errors);

    if (errors.length === 0) {
        const alertCard = Alert({
            text: 'No errors associated with this Session Id',
            type: 'success',
            margin: '0px 20px',
            parent: errorsContainer
        });

        alertCard.add();
    } else {
        const legendHeading = Heading({
            text: `<strong>Errors:</strong> ${errors.length}`,
            size: '1.3em',
            color: 'crimson',
            margin: '0px 20px 20px 20px',
            parent: errorsContainer
        });

        legendHeading.add();
    }

    /** Add Errors to Alert */
    errors.forEach((item, index) => {
        const alertCard = Alert({
            text: '',
            type: 'danger',
            margin: '0px 20px 20px 20px',
            parent: errorsContainer
        });

        alertCard.add();

        const goToErrorButton = BootstrapButton({
            action(event) {
                Route(`Developer/Errors/${item.Id}`);
            },
            parent: alertCard,
            margin: '20px 0px',
            type: 'btn-danger',
            value: `Go to error ${item.Id}`
        });

        goToErrorButton.add();

        const readOnlyFields = [
            {
                internalFieldName: 'Message',
                displayName: 'Message',
                type: 'mlot'
            },
            {
                internalFieldName: 'Error',
                displayName: 'Error',
                type: 'mlot'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created',
                type: 'date'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            },
            {
                internalFieldName: 'Status',
                displayName: 'Status'
            }
        ];

        readOnlyFields.forEach(field => addReadOnlyField(field));

        /** Add Read Only Field */
        function addReadOnlyField(field, parent) {
            const {
                internalFieldName, displayName, type
            } = field;

            let value = item[internalFieldName]?.toString();

            if (type === 'date') {
                value = new Date(item[internalFieldName]);
            }

            else if (type === 'mlot') {
                value = item[internalFieldName]?.split('<hr>').join('\n');
            }

            else if (internalFieldName === 'Author') {
                value = item.Author.Title;
            }

            else if (internalFieldName === 'Status') {
                switch (item.Status) {
                    case 'Not Started':
                    default:
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-danger'>Not Started</span>`;
                        break;
                    case 'In Progress':
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-info'>Not Started</span>`;
                        break;
                    case 'Completed':
                        value = /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-success'>Not Started</span>`;
                        break;
                }
            }

            const component = SingleLineTextField({
                label: displayName,
                value: value || /*html*/ `<span style='font-size: 1em; display: inline; color: white;' class='badge badge-dark'>No data</span>`,
                readOnly: true,
                fieldMargin: '0px',
                parent: alertCard
            });

            component.add();
        }
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}
// @END-File
