import { Modal } from '../Components/Modal.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function SaveDialog({ no, save, cancel }) {
    const saveDialogModal = Modal({
        title: false,
        scrollable: true,
        centered: true,
        showFooter: false,
        async addContent(modalBody) {
            saveDialogModal.find('.modal-dialog').style.maxWidth = 'fit-content';
            saveDialogModal.find('.modal-dialog').style.minWidth = 'max-content';
            modalBody.style.padding = '30px';

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <div class='mb-2' style=''>
                    Do you want to save pending changes?
                </div>
                <div class='mb-4' style='font-size: 13px;'>
                    Your changes will be lost if you don't save them.
                </div>
                <div class='button-container' style='display: flex; justify-content: space-between;'>
                    <div style='display: flex; justify-content: flex-start;'>
                        <button class='btn btn-robi-light btn-sm dont-save'>Don't Save</button>
                        <button class='btn btn-sm ml-2 cancel'>Cancel</button>
                    </div>
                    <div style='display: flex; justify-content: flex-end;'>
                        <button class='btn btn-robi save'>Save</button>
                    <div>
                </div>
            `);

            // Save
            saveDialogModal.find('.save').on('click', event => {
                $(saveDialogModal.get()).on('hidden.bs.modal', event => {
                    if (save) {
                        save();
                    }
                });

                saveDialogModal.close();
            });

            // Don't Save
            saveDialogModal.find('.dont-save').on('click', event => {
                $(saveDialogModal.get()).on('hidden.bs.modal', event => {
                    if (no) {
                        no();
                    }
                });

                saveDialogModal.close();
            });

            // Cancel
            saveDialogModal.find('.cancel').on('click', event => {
                $(saveDialogModal.get()).on('hidden.bs.modal', event => {
                    if (cancel) {
                        cancel();
                    }
                });

                saveDialogModal.close();
            });
        }
    });

    saveDialogModal.add();
}
// @END-File
