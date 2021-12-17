import { Container } from './Container.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { Errors } from './Errors.js'

// @START-File
/**
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export function LogForm(param) {
    const {
        item, parent
    } = param;

    const readOnlyFields = [
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
            internalFieldName: 'FiscalYear',
            displayName: 'FiscalYear'
        },
        {
            internalFieldName: 'Module',
            displayName: 'Module',
        },
        {
            internalFieldName: 'Message',
            displayName: 'Message'
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

    const readOnlyContainer = Container({
        direction: 'column',
        width: '100%',
        padding: '0px 20px',
        parent
    });

    readOnlyContainer.add();

    readOnlyFields.forEach(field => addReadOnlyField(field, readOnlyContainer));

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
            value: value || /*html*/ `<span style='font-size: 1em; display: inline;' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Errors */
    Errors({
        sessionId: item.SessionId,
        parent
    });

    return {
        getFieldValues() {
            const data = {};

            return data;
        }
    };
}
// @END-File
