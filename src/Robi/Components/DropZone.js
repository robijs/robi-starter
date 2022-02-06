import { UploadFile } from '../Actions/UploadFile.js'
import { Container } from './Container.js'
import { FilesField } from './FilesField.js'
import { Heading } from './Heading.js'
import { LoadingSpinner } from './LoadingSpinner.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function DropZone(param) {
    const {
        allowDelete,
        parent,
        label,
        description,
        list,
        itemId,
        onChange,
        beforeChange,
        onUpload,
        library,
        multiple
    } = param;

    let { value } = param;
    value = value || [];

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        label: 'Loading files',
        margin: '40px 0px',
        parent
    });

    loadingIndicator.add();

    const card = Container({
        width: '100%',
        direction: 'column',
        margin: '0px 0px 10px 0px',
        parent
    });

    card.add();

    const heading = Heading({
        text: label,
        margin: '0px 0px .5rem 0px',
        weight: '500',
        size: '16px',
        color: 'var(--color)',
        parent: card
    });

    heading.add();

    const filesContainer = FilesField({
        allowDelete,
        description,
        multiple,
        beforeChange,
        onChange,
        files: itemId ? value?.map(item => {
            if (item.url) {
                return item;
            }

            return {
                url: item.OData__dlc_DocIdUrl.Url,
                name: item.File.Name,
                size: item.File.Length,
                created: item.Created,
                author: item.Author.Title
            };
        }) : value,
        itemId,
        library: library || `${list}Files`,
        async onUpload(file) {
            if (onUpload === false) {
                return;
            }

            console.log(file);

            // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Queued';
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = 'up next';
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                <div style='width: 22px; height: 22px; background: var(--border-color); border-radius: 50%;'></div>
            `;

            // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Uploading';
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = 'please wait';
            filesContainer.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                <div class='spinner-grow text-secondary' role='status' style='width: 22px; height: 22px;'></div>
            `;

            const testUpload = await UploadFile({
                library: library || `${list}Files`,
                file,
                data: {
                    ParentId: itemId
                }
            });

            console.log(testUpload);
            console.log(`Measure #${itemId} Files`, value);
            value.push(testUpload)

            onChange(value);

            filesContainer.find(`.pending-count`).innerText = '';
            filesContainer.find(`.pending-count`).classList.add('hidden');
            filesContainer.find(`.count`).innerText = `${parseInt(filesContainer.find(`.count`).innerText) + 1}`;

            // filesList.find(`.remove-container[data-filename='${file.name}']`).dataset.itemid = testUpload.Id;
            // filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Uploaded!';
            // filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = `${'ontouchstart' in window ? 'tap' : 'click'} to undo`;
            // filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
            //     <svg class='icon undo'><use href='#icon-bs-arrow-left-circle-fill'></use></svg>
            // `;

            // Attach file remove listener
            const removeContainer = filesContainer.find(`.remove-container[data-filename='${file.name}']`);

            removeContainer.insertAdjacentHTML('afterend', /*html*/ `
                <div class='remove-container delete-on-remove' data-filename='${file.name}'>
                    <div class='remove-label'>
                        <div class='status'>Added on ${new Date(testUpload?.Created).toLocaleDateString()} By ${testUpload?.Author.Title?.split(' ').slice(0, 2).join(' ')}</div>
                        <div class='tip'>${'ontouchstart' in window ? 'tap' : 'click'} to delete</div>
                    </div>
                    <div class='remove-icon'>
                        <svg class='icon remove'>
                            <use href='#icon-bs-x-circle-fill'></use>
                        </svg>
                    </div>
                </div>
            `);

            removeContainer.remove();

            filesContainer.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).addEventListener('click', filesContainer.delete);

            // dropZone.find('.upload').classList.add('hidden');
            // dropZone.find('.upload').innerHTML = 'Upload';
            // dropZone.find('.upload').style.pointerEvents = 'all';
            // dropZone.find('.undo-all').classList.remove('hidden');
            // dropZone.find('.reset').classList.remove('hidden');
        },
        parent: card
    });

    loadingIndicator.remove();

    Store.add({
        name: 'files',
        component: filesContainer
    });

    return filesContainer;
}
// @END-File
