import { MultiLineTextField} from './MultiLineTextField.js'
import { SingleLineTextField } from './SingleLineTextField.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function EditQuestion(param) {
    const {
        question, parent, modal
    } = param;

    const {
        Title, Body
    } = question;

    /** Title */
    const titleField = SingleLineTextField({
        label: 'Question',
        value: Title,
        parent,
        onKeydown(event) {
            if (event.target.innerText) {
                modal.getButton('Update').disabled = false;
            } else {
                modal.getButton('Update').disabled = true;
            }

            submit(event);
        }
    });

    titleField.add();

    /** Body */
    const bodyField = MultiLineTextField({
        label: 'Description',
        value: Body,
        parent,
        onKeydown(event) {
            submit(event);
        }
    });

    bodyField.add();

    /** Control + Enter to submit */
    function submit(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            const submit = modal.getButton('Update');

            if (!submit.disabled) {
                submit.click();
            }
        }
    }

    /** Focus on name field */
    titleField.focus();

    return {
        getFieldValues() {
            const data = {
                Title: titleField.value(),
                Body: bodyField.value(),
            };

            if (!data.Title) {
                /** @todo field.addError() */
                return false;
            }

            return data;
        }
    };
}
// @END-File
