import { MultiLineTextField } from './MultiLineTextField.js'
import { SingleLineTextField } from './SingleLineTextField.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function NewQuestion(param) {
    const {
        parent, modal
    } = param;

    /** First Name */
    const titleField = SingleLineTextField({
        label: 'Question',
        description: '',
        width: '100%',
        parent,
        onKeydown(event) {
            if (event.target.value) {
                console.log(modal.getButton('Submit'));
                modal.getButton('Submit').disabled = false;
            } else {
                modal.getButton('Submit').disabled = true;
            }

            submit(event);
        }
    });

    titleField.add();

    /** Middle Name */
    const bodyField = MultiLineTextField({
        label: 'Description',
        description: '',
        width: '100%',
        optional: true,
        parent,
        onKeydown(event) {
            submit(event);
        }
    });

    bodyField.add();

    /** Control + Enter to submit */
    function submit(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            const submit = modal.getButton('Submit');

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
