import { Modal } from '../Components/Modal.js'
import { FormTools } from '../Components/FormTools.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function ModifyForm({ list, fields, form, type }) {
    const modal = Modal({
        contentPadding: '30px',
        title: `Modify ${type} Item Form`,
        async addContent(modalBody) {
            const formComponent = await form({
                item: {},
                fields,
                list,
                modal: modal,
                parent: modalBody
            });

            if (formComponent.label) {
                modal.getButton('Create').innerText = form.label;
            }

            if (formComponent) {
                modal.showFooter();
            }
        },
        buttons: {
            footer: [
                {
                    value: 'Cancel',
                    classes: '',
                    data: [
                        {
                            name: 'dismiss',
                            value: 'modal'
                        }
                    ]
                },
                // TODO: send modal prop to form
                {
                    value: 'Create',
                    classes: 'btn-robi',
                    async onClick(event) {
                        console.log('for demonstration purposes only');
                    }
                }
            ]
        }
    });

    modal.add();

    const tools = FormTools({
        type,
        list,
        container: modal,
        parent: modal.getHeader(),
        container: modal,
    });

    tools.add();

    
}
// @END-File
