import { UploadFile } from '../Actions/UploadFile.js'
import { Container } from './Container.js'
import { Files } from './Files.js'
import { Heading } from './Heading.js'
import { LoadingSpinner } from './LoadingSpinner.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function AttachmentsContainer(param) {
    const {
        parent, label, description, list, itemId, onChange, library
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
        // padding: '20px',
        parent
    });

    card.add();

    const heading = Heading({
        text: label,
        margin: '0px 0px .5rem 0px',
        weight: '500',
        size: '16px',
        color: App.get('defaultColor'),
        parent: card
    });

    heading.add();

    const filesList = Files({
        description,
        onChange,
        allFiles: [],
        files: itemId ? value?.map(item => {
            return {
                url: item.OData__dlc_DocIdUrl.Url,
                name: item.File.Name,
                size: item.File.Length,
                created: item.Created,
                author: item.Author.Title
            };
        }) : value,
        itemId,
        async onUpload(file) {
            console.log(file);

            // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
            filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Queued';
            filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = 'up next';
            filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                <div style='width: 22px; height: 22px; background: #ced4da; border-radius: 50%;'></div>
            `;

            // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
            filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Uploading';
            filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = 'please wait';
            filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
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

            filesList.find(`.pending-count`).innerText = '';
            filesList.find(`.pending-count`).classList.add('hidden');
            filesList.find(`.count`).innerText = `${parseInt(filesList.find(`.count`).innerText) + 1}`;
            filesList.find(`.remove-container[data-filename='${file.name}']`).dataset.itemid = testUpload.Id;
            filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Uploaded!';
            filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = `${'ontouchstart' in window ? 'tap' : 'click'} to undo`;
            filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                <svg class='icon undo'><use href='#icon-bs-arrow-left-circle-fill'></use></svg>
            `;

            // dropZone.find('.upload').classList.add('hidden');
            // dropZone.find('.upload').innerHTML = 'Upload';
            // dropZone.find('.upload').style.pointerEvents = 'all';
            // dropZone.find('.undo-all').classList.remove('hidden');
            // dropZone.find('.reset').classList.remove('hidden');
        },
        width: '-webkit-fill-available',
        parent: card
    });

    loadingIndicator.remove();

    Store.add({
        name: 'files',
        component: filesList
    });

    return filesList;
}
// @END-File
