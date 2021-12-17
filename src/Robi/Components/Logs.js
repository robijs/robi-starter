import { Get } from '../Actions/Get.js'
import { Route } from '../Actions/Route.js'
import { Alert } from './Alert.js'
import { BootstrapButton } from './BootstrapButton.js'
import { Container } from './Container.js'
import { FoldingCube } from './FoldingCube.js'
import { SingleLineTextField } from './SingleLineTextField.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function Logs(param) {
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
        label: 'Loading logs',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    /** Get Errors */
    const logs = await Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        filter: `SessionId eq '${sessionId}'`
    });

    console.log(logs);

    /** Summary Card */
    const alertCard = Alert({
        text: logs.length > 0 ?
            /*html*/ `
                <h5>Logs: ${logs.length}</h5>
                <hr>
            ` :
            'No logs associated with this Session Id',
        type: logs.length > 0 ? 'info' : 'warning',
        margin: '0px 20px',
        parent: errorsContainer
    });

    alertCard.add();

    /** Add Errors to Alert */
    logs.forEach((item, index) => {
        const goToErrorButton = BootstrapButton({
            action(event) {
                Route(`Developer/Logs/${item.Id}`);
            },
            parent: alertCard,
            margin: '0px 0px 20px 0px',
            type: 'btn-info',
            value: `Go to log: ${item.Id}`
        });

        goToErrorButton.add();

        const readOnlyFields = [
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Title',
                displayName: 'Type'
            },
            {
                internalFieldName: 'FiscalYear',
                displayName: 'FiscalYear'
            },
            {
                internalFieldName: 'Module',
                displayName: 'Module',
            },
            {
                internalFieldName: 'Message',
                displayName: 'Message',
            },
            {
                internalFieldName: 'StackTrace',
                displayName: 'Stack Trace',
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
                value = item[internalFieldName].split('<hr>').join('\n');
            }

            else if (internalFieldName === 'Message') {
                const data = JSON.parse(item.Message);

                value = /*html*/ `
                    <table>
                `;

                for (const property in data) {
                    value += /*html*/ `
                        <tr>
                            <th style='padding-right: 15px;'>${property}</th>
                            <td>${data[property]}</td>
                        </tr>
                    `;
                }

                value += /*html*/ `
                    </table>
                `;
            }

            else if (internalFieldName === 'Author') {
                value = item.Author.Title;
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

        if (index < logs.length - 1) {
            alertCard.get().insertAdjacentHTML('beforeend', '<hr>');
        }
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}
// @END-File
