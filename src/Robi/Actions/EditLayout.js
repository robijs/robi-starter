import { Modal } from '../Components/Modal.js'
import { LoadingSpinner } from '../Components/LoadingSpinner.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { App } from '../Core/App.js'
import { Wait } from './Wait.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function EditLayout({ order, path, file }) {
    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        shadow: true,
        async addContent(modalBody) {
            modal.find('.modal-content').style.width = 'unset';

            const loading = LoadingSpinner({
                message: `<span style='color: var(--primary);'>Saving layout<span>`,
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

    await updateApp();

    async function updateApp() {
        let fileValueRequest;
        let digest;

        if (App.isProd()) {
            const sourceSiteUrl = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files('${file}')/$value`;

            digest = await GetRequestDigest();

            fileValueRequest = await fetch(sourceSiteUrl, {
                method: 'GET',
                headers: {
                    'binaryStringRequestBody': 'true',
                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                    'X-RequestDigest': digest
                }
            });

        } else {
            const devPath = path.replace('App/', '');
            fileValueRequest = await fetch(`http://127.0.0.1:8080/${devPath}/${file}`);
            await Wait(1000);
        }

        let content = await fileValueRequest.text();
        let updatedContent = content;

        const sourceRows = content.match(/\/\/ @START-Rows([\s\S]*?)\/\/ @END-Rows/);
        const currentOrder = sourceRows[1].split('// @Row');
        const newOrder = order.map(index => currentOrder[index]).join('// @Row');

        console.log(sourceRows[1]);
        console.log(order);
        console.log(newOrder);

        updatedContent = updatedContent.replace(/\/\/ @START-Rows([\s\S]*?)\/\/ @END-Rows/, `// @START-Rows${newOrder}// @END-Rows`);

        console.log('OLD\n----------------------------------------\n', content);
        console.log('\n****************************************');
        console.log('NEW\n----------------------------------------\n', updatedContent);
        console.log('\n****************************************');

        let setFile;

        if (App.isProd()) {
            // TODO: Toby's version control idea
            // TODO: Make a copy of app.js first
            // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
            setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/Add(url='${file}',overwrite=true)`, {
                method: 'POST',
                body: updatedContent, 
                headers: {
                    'binaryStringRequestBody': 'true',
                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                    'X-RequestDigest': digest
                }
            });
        } else {
            const devPath = path.replace('App/', '');
            setFile = await fetch(`http://127.0.0.1:2035/?path=${devPath}&file=${file}`, {
                method: 'POST',
                body: updatedContent
            });
            await Wait(1000);
        }
    }

    if (App.isProd()) {
        await Wait(5000);
    }

    location.reload();

    modal.close();
}
// @END-File
