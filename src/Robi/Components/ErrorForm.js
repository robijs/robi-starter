import { UpdateItem } from '../Actions/UpdateItem.js'
import { Container } from './Container.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { StatusField } from './StatusField.js'
import { Toast } from './Toast.js'
import { Store } from '../Core/Store.js'
import { CommentsContainer } from './CommentsContainer.js'
import { Logs } from "./Logs.js"

// @START-File
/**
 * EditUser
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export function ErrorForm(param) {
    const {
        row, table, item, parent
    } = param;

    const readOnlyFields = [
        {
            internalFieldName: 'Id',
            displayName: 'Id'
        },
        {
            internalFieldName: 'SessionId',
            displayName: 'Session Id'
        },
        {
            internalFieldName: 'Source',
            displayName: 'Source'
        },
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
            value = item[internalFieldName]?.split('<hr>').join('\n');
        }

        else if (internalFieldName === 'Author') {
            value = item.Author.Title;
        }

        const component = SingleLineTextField({
            label: displayName,
            value: value || /*html*/ `<span style='font-size: 1em; display: inline' class='badge badge-dark'>No data</span>`,
            readOnly: true,
            fieldMargin: '0px',
            parent
        });

        component.add();
    }

    /** Status */
    const statusField = StatusField({
        async action(event) {
            statusField.value(event.target.innerText);

            const updatedItem = await UpdateItem({
                list: 'Errors',
                itemId: item.Id,
                select: 'Id,Message,Error,Source,SessionId,Status,Created,Author/Title',
                expand: 'Author/Id',
                data: {
                    Status: event.target.innerText
                }
            });

            console.log(`Error Item Id: ${item.Id} updated.`, updatedItem);

            /** Update Table Row */
            table.updateRow({
                row,
                data: updatedItem
            });

            /** Show toast */
            const toast = Toast({
                text: `Id <strong>${item.Id}</strong> set to <strong>${updatedItem.Status}</strong>!`,
                type: 'bs-toast',
                parent: Store.get('maincontainer')
            });

            toast.add();
        },
        parent,
        label: 'Status',
        margin: '0px 20px 40px 20px',
        value: item.Status || 'Not Started'
    });

    statusField.add();

    /** Logs */
    Logs({
        sessionId: item.SessionId,
        parent,
    });

    /** Comments */
    CommentsContainer({
        parentId: item.Id,
        padding: '0px 20px',
        parent,
    });

    return {
        getFieldValues() {
            const data = {};

            return data;
        }
    };
}
// @END-File
