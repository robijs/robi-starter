import { Button } from '../Components/Button.js'
import { Container } from '../Components/Container.js'
import { Modal } from '../Components/Modal.js'
import { Style } from '../Robi.js';

// @START-File
/**
 *
 * @param {*} param
 */
export async function BannerMenu() {
    const confirmModal = Modal({
        scrollable: true,
        centered: true,
        disableBackdropClose: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            confirmModal.find('.modal-dialog').style.maxWidth = '700px';

            Style({
                name: 'edit-banner',
                style: /*css*/`
                    .field .alert:focus {
                        outline: none;
                    }

                    .field .label {
                        width: 100px;
                        font-weight: 500;
                        font-size: 15px;
                    }

                    .field-row {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                    }
                    
                    .field-row .field-cell {
                        flex: 1;
                        font-size: 13px;
                        border-radius: 10px;
                        padding: 6px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 150ms ease-in-out;
                    }

                    .field-row .field-cell:not(:last-child) {
                        margin-right: 10px;
                    }

                    .field-row .default {
                        background: var(--primary-20);
                        color: var(--primary-hsl-5);
                    }

                    .field-row .default.heavy {
                        background: var(--primary);
                        color: var(--secondary);
                    }

                    .field-row .greeting {
                        background: #c3e9c7;
                        color: #1d7130;
                    }

                    .field-row .greeting.heavy {
                        background: seagreen;
                        color: var(--secondary);
                    }

                    .field-row .position {
                        background: lightgray;
                    }
                `
            });

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <!-- Title -->
                <h3 class='mb-3'>Banner</h3>
                <!-- Switch -->
                <div class='d-flex align-items-center'>
                    <div style='font-size: 14px; font-weight: 500;'>Display a banner on all routes?</div>
                    <div class="custom-control custom-switch grab switch">
                        <input type="checkbox" class="custom-control-input" id='os-switch' data-mode='os'>
                        <label class="custom-control-label" for="os-switch"></label>
                    </div>
                </div>
                <!-- Field -->
                <div class='field'>
                    <!-- Instructions -->
                    <div class='form-field-description text-muted mb-3' style='font-size: 14px;'>
                        Enter your message in the banner below.
                    </div>
                    <!-- Message -->
                    <div style='margin-bottom: 40px;'>
                        <!-- <div class='label mb-3'>Message</div> -->
                        <div class='d-flex justify-content-between' style='font-size: 13px; margin-bottom: 10px;'>
                            <div>Bold</div>
                            <div>Italic</div>
                            <div>Underline</div>
                            <div>Horizontal Rule</div>
                            <div>Heading</div>
                            <div>Paragraph</div>
                            <div>List</div>
                        </div>
                        <div class='alert alert-robi-primary mb-0 w-100' contenteditable='true'>
                            Test
                        </div>
                    </div>
                    <!-- Color -->
                    <div class='d-flex mb-3'>
                        <div class='label'>Color</div>
                        <div class='w-100'>
                            <!-- Light -->
                            <div class='field-row mb-2'>
                                <div class='field-cell default'>
                                    Default
                                </div>
                                <div class='field-cell greeting'>
                                    Greeting
                                </div>
                                <div class='field-cell notice'>
                                    Notice
                                </div>
                                <div class='field-cell warning'>
                                    Warning
                                </div>
                                <div class='field-cell error'>
                                    Error
                                </div>
                            </div>
                            <!-- Heavy -->
                            <div class='field-row'>
                                <div class='field-cell default heavy'>
                                    Default
                                </div>
                                <div class='field-cell greeting heavy'>
                                    Greeting
                                </div>
                                <div class='field-cell notice heavy'>
                                    Notice
                                </div>
                                <div class='field-cell warning heavy'>
                                    Warning
                                </div>
                                <div class='field-cell error heavy'>
                                    Error
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Position -->
                    <div class='d-flex'>
                        <div class='label'>Position</div>
                        <div class='field-row'>
                            <div class='field-cell position'>
                                Top
                            </div>
                            <div class='field-cell position'>
                                Right
                            </div>
                            <div class='field-cell position'>
                                Bottom
                            </div>
                            <div class='field-cell position'>
                                Left
                            </div>
                        </div>
                    </div>
                </div>
            `);

            const btnContainer = Container({
                margin: '50px 0px 0px 0px',
                width: '100%',
                parent: modalBody
            });

            btnContainer.add();

            const leftContainer = Container({
                flex: 2,
                align: 'start',
                parent: btnContainer
            });

            leftContainer.add();

            const previewBtn = Button({
                async action() {
                    $(confirmModal.get()).on('hidden.bs.modal', event => {
                        
                    });

                    confirmModal.close();
                },
                classes: ['p-0'],
                parent: leftContainer,
                type: 'robi-light',
                value: 'Preview'
            });

            previewBtn.add();

            const rightContainer = Container({
                parent: btnContainer
            });

            rightContainer.add();

            const cancelBtn = Button({
                action(event) {
                    $(confirmModal.get()).on('hidden.bs.modal', event => {
                        
                    });

                    confirmModal.close();
                },
                classes: [],
                parent: rightContainer,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();

            const okBtn = Button({
                async action() {
                    $(confirmModal.get()).on('hidden.bs.modal', event => {
                        
                    });

                    confirmModal.close();
                },
                // disabled: true,
                classes: [],
                parent: rightContainer,
                type: 'robi',
                value: 'OK'
            });

            okBtn.add();
        }
    });

    confirmModal.add();
}
// @END-File
