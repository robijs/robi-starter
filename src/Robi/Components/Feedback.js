// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { Modal, SingleLineTextField, MultiLineTextField, BootstrapButton } from '../../Robi/RobiUI.js'
import { Store, Style, App, CreateItem, UploadFile } from '../../Robi/Robi.js'
import { RecordScreen } from './RecordScreen.js'

// @START-File
// Modified from: https://codepen.io/Nahrin/pen/OKYYpX
export async function Feedback() {
    Style({
        name: 'feedback',
        locked: true,
        style: /*css*/ `
            .feedback-button-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                z-index: 100;
            }

            .show-feedback-form {
                display: flex;
                align-items: center;
                border: none;
                background: var(--primary);
                box-shadow: var(--box-shadow);
                border-radius: 62px;
                height: 52px;
                width: 52px;
                transition: all 350ms;
            }

            .show-feedback-form:hover {
                border-radius: 62px;
                justify-content: start;
                width: 200px;
            }

            .show-feedback-form-label {
                opacity: 0;
                width: 0px;
                color: var(--secondary);
                white-space: nowrap;
                font-size: 18px;
                font-weight: 500;
                transition: all 350ms;
            }

            .show-feedback-form:hover .show-feedback-form-label {
                opacity: 1;
                width: 149px;
            }
        `
    });

    Store.get('appcontainer').append(/*html*/ `
        <div class='feedback-button-container'>
            <button type='buton' class='show-feedback-form'>
                <svg class="icon" style='font-size: 40px; fill: var(--secondary);'>
                    <use href="#icon-bs-emoji-laughing"></use>
                </svg>
                <span class='show-feedback-form-label'>Share feedback?</span>
            </button>
        </div>
    `);

    Store.get('appcontainer').find('.show-feedback-form').on('click', showForm);

    function showForm() {
        // Set store
        let newFeedbackData = Store.getData(`new feedback data`);

        if (newFeedbackData) {
            console.log(`Found exisiting new feedback data.`, newFeedbackData);
        } else {
            newFeedbackData = {
                Summary: null,
                Description: null,
                URL: null,
                LocalStorage: null,
                SessionStorage: null,
                Status: 'Submitted',
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                UserAgent: ua
            };

            Store.setData(`new feedback data`, newFeedbackData);
            console.log('Created new feedback data', newFeedbackData);
        }

        let newFeedbackRecording = Store.getData(`new feedback recording`);

        console.log('Recording', newFeedbackRecording);

        const modal = Modal({
            title: false,
            // scrollable: true,
            close: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-3'>Share Feedback</h3>
                `);
    
                // Short description
                const summary = SingleLineTextField({
                    label: 'Short summary',
                    description: 'Just a few words to help us categorize the issue',
                    parent: modalBody,
                    value: newFeedbackData.Summary,
                    onKeyup() {
                        if (summary.value()) {
                            newFeedbackData.Summary = summary.value();
                            submitBtn.enable();
                        } else {
                            newFeedbackData.Summary = null;
                            submitBtn.disable();
                        }
                    },
                    onFocusout() {
                        if (summary.value()) {
                            submitBtn.enable();
                        } else {
                            submitBtn.disable();
                        }
                    }
                });
    
                summary.add();

                // Description
                const description = MultiLineTextField({
                    label: 'Description',
                    description: /*html*/ `
                        <p class='mb-1'>Please describe the issue in greater detail.</p>
                        <p class='mb-1'>If a feature isn't working properly, or you expected diferent behavior, please help us identity the cause by answering the following questions.</p>
                        <ul>
                            <li>What action was taken? (Example: Clicked a button, opened a form, created an item, etc.)</li>    
                            <li>What happened immediately afterward?</li>
                            <li>What did you expect to happen instead?</li>
                            <li>Does this issue occur every time, or only under certain conditions? (If no, what conditions?)</li>
                        </ul>
                        <p class='m-0'>Of course, if everything's working smoothly and you just wanted to let us know, we appreciate hearing that too!</p>
                    `,
                    value: newFeedbackData.Description,
                    parent: modalBody,
                    onKeyup() {
                        if (summary.value()) {
                            newFeedbackData.Description = summary.value();
                            submitBtn.enable();
                        } else {
                            newFeedbackData.Description = null;
                            submitBtn.disable();
                        }
                    },
                    onFocusout() {
                        if (summary.value()) {
                            submitBtn.enable();
                        } else {
                            submitBtn.disable();
                        }
                    }
                });
    
                description.add();

                // TODO: Remove recording button
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div style='font-weight: 500; margin-bottom: .5rem;'>Attach a screen recording</div>
                    <div class='text-muted' style='font-size: 14px; font-size: 14px; margin-bottom:'>
                        <p class='mb-1'>Please read all instructions before starting.</p>
                        <ol>
                            <li>
                                Select the <strong>Start recording</strong> button below. In <strong>Choose what to share</strong>, select the image with this browser window.
                            </li>
                            <li>
                                Select the blue <strong>Share</strong>. 
                                A ${App.get('theme').toLowerCase()} border will surround the application, and a preview is displayed in the lower right corner. 
                                You can move the preview if it's in the way.
                            </li>
                            <li>Recreate the issue as thoroughly as possible.</li>
                            <li>
                                When finished, select <strong>Stop recording</strong>. This form will reappear with the video attached here. You can watch the recording, redo, or remove it before submitting.
                                
                            </li>
                        </ol>
                    </div>
                    <button id='startButton' type='buton' class='btn btn-robi mt-4' style='height: 35px;'>
                        <span class='d-flex align-items-center justify-content-center'>
                            <svg class="icon" fill='var(--primary)' style='font-size: 18px;'>
                                <use href="#icon-bs-record-circle"></use>
                            </svg>
                            <span class='ml-2 startButton-label' style='line-height: 0;'>${newFeedbackRecording ? 'Redo recording' : 'Start recording'}</span>
                        </span>
                    </button>
                    <!-- Recording -->
                    ${
                        newFeedbackRecording ? /*html*/ `
                            <div class='d-flex mt-4 new-feedback-recording'>
                                <div class='' style='max-width: 680px;'>
                                    <div style='font-weight: 500; margin-bottom: .5rem;'>Recording</div>
                                    <video src='${newFeedbackRecording.src}' id='recording' width='680px' height='400px' controls></video>
                                </div>
                                <div class='bottom d-none'>
                                    <a id='downloadButton' class='button'>Download</a>
                                    <pre id='log'></pre>
                                </div>
                            </div>
                            <button id='removeButton' type='buton' class='btn btn-robi mt-4' style='height: 35px;'>Remove recording</button>
                        ` : ''
                    }
                `);

                const startButton =  modal.find('#startButton');

                startButton.on('click', () => {
                    RecordScreen({
                        onShare() {
                            // Hide feedback button
                            Store.get('appcontainer').find('.feedback-button-container').classList.add('d-none');

                            // Close form
                            modal.close();
                        },
                        onStop() {
                            // Show feedback button
                            Store.get('appcontainer').find('.feedback-button-container').classList.remove('d-none');

                            // Open form
                            showForm();
                        }
                    });
                });

                if (newFeedbackRecording) {
                    const removeButton =  modal.find('#removeButton');

                    removeButton.on('click', () => {
                        newFeedbackRecording = undefined;
                        Store.setData('new feedback recording', undefined);
                        modal.find('.new-feedback-recording').remove();
                        startButton.querySelector('.startButton-label').innerText = 'Start recording';
                        removeButton.remove();
                    });
                }

                const submitBtn = BootstrapButton({
                    async action() {
                        submitBtn.disable();
                        submitBtn.get().innerHTML = /*html*/ `
                            <span style="width: 16px; height: 16px;" class="spinner-border spinner-border-sm text-robi" role="status" aria-hidden="true"></span> Submitting
                        `;

                        newFeedbackData.SessionStorage = JSON.stringify(Object.fromEntries(Object.keys(sessionStorage).map(key => [key, sessionStorage.getItem(key)])));
                        newFeedbackData.LocalStorage = JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])));
                        // newFeedbackData.Logs = JSON.stringify(console.dump()); // NOTE: often too large for SP MLOT fields
                        newFeedbackData.RequestedDate = new Date().toLocaleDateString();
                        newFeedbackData.RequestedBy = Store.user().Title;
                        newFeedbackData.URL = location.href;

                        // Create list item
                        const newItem = await CreateItem({
                            list: 'Feedback',
                            data: newFeedbackData
                        });

                        console.log(newItem);
                        
                        // Upload video
                        if (newFeedbackRecording) {
                            const file = new File([newFeedbackRecording.blob], `Recording.webm`, { type: 'video/webm' });
                            console.log(file);

                            const newRecording = await UploadFile({
                                library: 'FeedbackFiles',
                                file,
                                data: {
                                    ParentId: newItem.Id
                                }
                            });

                            console.log(newRecording);
                        }

                        // Reset data
                        Store.setData('new feedback data', undefined);
                        Store.setData('new feedback recording', undefined);

                        submitBtn.get().innerHTML = /*html*/ `
                            <span style="width: 16px; height: 16px;" class="spinner-border spinner-border-sm text-robi" role="status" aria-hidden="true"></span> Submitted!
                        `;

                        modalBody.style.transition = 'all 400ms';
                        modalBody.style.height = `${modalBody.offsetHeight}px`;
                        modalBody.style.opacity = '1';
                        setTimeout(() => {
                            modalBody.style.opacity = '0';
                        }, 0);

                        setTimeout(() => {
                            modalBody.style.opacity = '1';
                            modalBody.style.height = '345px';
                            modalBody.innerHTML = /*html*/ `
                                <h3 class='mb-5'>Thank you!</h3>
                                <p>Your feedback helps make <strong>${App.get('title')}</strong> better for everyone.</p>
                                <p>We review all feedback, and may contact you at <strong><em>${Store.user().Email}</em></strong> if more information is needed.</p>
                            `;
                        }, 600);

                        // Close modal
                        // modal.close();
                    },
                    disabled: newFeedbackData.Summary ? false : true,
                    classes: ['w-100 mt-5'],
                    width: '100%',
                    parent: modalBody,
                    type: 'robi',
                    value: 'Submit'
                });
    
                submitBtn.add();
    
                const cancelBtn = BootstrapButton({
                    action(event) {
                        console.log('Cancel add route');
    
                        modal.close();
                    },
                    classes: ['w-100 mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: '',
                    value: 'Cancel'
                });
    
                cancelBtn.add();
            },
            // centered: true,
            showFooter: false,
        });

        modal.add();
    }
}
// @END-File
