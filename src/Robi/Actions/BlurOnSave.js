import { Modal } from '../Components/Modal.js'
import { LoadingSpinner } from '../Components/LoadingSpinner.js'
import { App } from '../Core/App.js'
import { Wait } from './Wait.js';

// @START-File
/**
 * 
 * @param {*} param0 
 */
export function BlurOnSave({ message }) {
    // Update app.js first or live-server will reload when
    // Route/Path/Path.js is created
    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        shadow: true,
        async addContent(modalBody) {
            modal.find('.modal-content').style.width = 'unset';

            const loading = LoadingSpinner({
                message: `<span style='color: var(--primary);'>${message}<span>`,
                type: 'robi',
                classes: ['p-4'],
                parent: modalBody
            });

            loading.add();
        },
        centered: true,
        showFooter: false,
        position: 'afterend'
    });

    modal.add();

    // Blur entire app
    document.querySelector('#app').style.transition = 'filter 150ms';
    document.querySelector('#app').style.filter = 'blur(5px)';

    return {
        async off(onClose) {
            await Wait(1500);

            document.querySelector('#app').style.transition = 'unset';
            document.querySelector('#app').style.filter = 'unset';

            modal.close(onClose);
        }
    }
}
// @END-File
