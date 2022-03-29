import { Modal } from '../Components/Modal.js'
import { Button } from '../Components/Button.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function Confirm({ message, no, yes }) {
    // Show modal
    console.log('add route');

    const confirmModal = Modal({
        title: false,
        scrollable: true,
        centered: true,
        showFooter: false,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            confirmModal.find('.modal-dialog').style.maxWidth = 'fit-content';
            confirmModal.find('.modal-dialog').style.minWidth = 'max-content';

            modalBody.insertAdjacentHTML('beforeend', message);

            const addRouteBtn = Button({
                async action() {
                    $(confirmModal.get()).on('hidden.bs.modal', event => {
                        if (yes) {
                            yes();
                        }
                    });

                    confirmModal.close();
                },
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Yes'
            });

            addRouteBtn.add();

            const cancelBtn = Button({
                action(event) {
                    $(confirmModal.get()).on('hidden.bs.modal', event => {
                        if (no) {
                            no();
                        }
                    });

                    confirmModal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
                value: 'No'
            });

            cancelBtn.add();
        }
    });

    confirmModal.add();
}
// @END-File
