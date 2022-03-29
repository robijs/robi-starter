import { Modal } from './Modal.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { SquareField } from './SquareField.js'
import { Store } from '../Core/Store.js'
import { Container } from './Container.js'
import { Button } from './Button.js'
import { Route } from '../Actions/Route.js'
import { UpdateItem } from '../Actions/UpdateItem.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function AccountInfo({ parent }) {
    // Card
    const accountInfoCard = Container({
        width: '100%',
        display: 'block',
        parent
    });

    accountInfoCard.add();

    // Destructure user properties
    const {
        Id,
        Title,
        LoginName,
        Email,
        Roles
    } = Store.user();

    // Name
    const nameCtr = Container({
        parent: accountInfoCard,
        align: 'end',
        margin: '0px 0px 20px 0px'
    });

    nameCtr.add();

    const nameField = SingleLineTextField({
        label: 'Name',
        fieldMargin: '0px',
        value: Title,
        readOnly: true,
        parent: nameCtr
    });

    nameField.add();

    const editName = Button({
        type: 'robi-light',
        icon: 'bs-pencil-square',
        size: '18px',
        fill: 'var(--primary)',
        classes: ['ml-3'],
        parent: nameCtr,
        action() {
            // Edit name form
            const modal = Modal({
                title: false,
                disableBackdropClose: true,
                scrollable: true,
                centered: true,
                showFooter: false,
                async addContent(modalBody) {
                    // Modify modal style
                    modalBody.classList.add('install-modal');
                    modal.find('.modal-dialog').style.maxWidth = 'fit-content';
                    modal.find('.modal-dialog').style.minWidth = '675px';
        
                    // Heading
                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='mb-3'>
                            Edit name
                        </h3>
                    `);

                    // Name
                    const nameField = SingleLineTextField({
                        label: 'Name',
                        value: Store.user().Title,
                        parent: modalBody
                    });

                    nameField.add();

                    // Save button
                    const startBtn = Button({
                        async action(event) {
                            startBtn.disable();
                            startBtn.get().innerHTML = /*html*/ `
                                <span class="spinner-border" role="status" aria-hidden="true" style="width: 18px; height: 18px; border-width: 3px"></span>
                            `;

                            const newName = nameField.value();

                            if (newName !== Title) {
                                // Modify user item
                                Store.user().Title = newName;

                                // Update user item
                                await UpdateItem({
                                    list: 'Users',
                                    itemId: Id,
                                    data: {
                                        Title: newName
                                    }
                                });
                            }
                            
                            // Resolve promise on modal close
                            $(modal.get()).on('hidden.bs.modal', event => {
                                Route('Settings/Account');
                            });
    
                            modal.close();
                        },
                        classes: ['w-100 mt-3'],
                        width: '100%',
                        parent: modalBody,
                        type: 'robi',
                        value: 'Save'
                    });
        
                    startBtn.add();

                    // Cancel button
                    const cancelBtn = Button({
                        async action(event) {
                            modal.close();
                        },
                        classes: ['w-100 mt-3'],
                        width: '100%',
                        parent: modalBody,
                        type: '',
                        value: 'Cancel'
                    });
        
                    cancelBtn.add();
                },
            });
        
            modal.add();
        }
    });

    editName.add();
    editName.get().style.padding = '0px';

    // Login Name
    const accountField = SingleLineTextField({
        label: 'Login Name',
        value: LoginName,
        readOnly: true,
        fieldMargin: '0px 0px 20px 0px',
        parent: accountInfoCard
    });

    accountField.add();

    // Email
    const emailField = SingleLineTextField({
        label: 'Email',
        value: Email,
        readOnly: true,
        fieldMargin: '0px 0px 20px 0px',
        parent: accountInfoCard
    });

    emailField.add();

    // Role
    const roleCtr = Container({
        parent: accountInfoCard,
        align: 'end',
        margin: '0px 0px 20px 0px'
    });

    roleCtr.add();

    const roleField = SingleLineTextField({
        label: 'Roles',
        value: Roles.results.join(', '),
        readOnly: true,
        fieldMargin: '0px',
        parent: roleCtr
    });

    roleField.add();

    const editRole = Button({
        type: 'robi-light',
        icon: 'bs-pencil-square',
        size: '18px',
        fill: 'var(--primary)',
        classes: ['ml-3'],
        parent: roleCtr,
        action() {
            // Edit name form
            const modal = Modal({
                title: false,
                disableBackdropClose: true,
                scrollable: true,
                centered: true,
                showFooter: false,
                async addContent(modalBody) {
                    // Modify modal style
                    modalBody.classList.add('install-modal');
                    modal.find('.modal-dialog').style.maxWidth = 'fit-content';
                    modal.find('.modal-dialog').style.minWidth = '675px';
        
                    // Heading
                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='mb-3'>
                            Edit role
                        </h3>
                    `);

                    // Role
                    const roleField = SquareField({
                        // FIXME: Return array instead
                        // TODO: Allow SquareField to accept arrays and strings
                        value: Roles.results.filter(r => !['Administrator', 'Developer', 'User'].includes(r))[0],
                        items: [
                            {
                                label: 'Action Officer',
                                html: /*html*/ `
                                    <div>
                                        <div style='font-size: 45px; font-weight: 500; text-align: center;'>AO</div>
                                        <div class='mt-2' style='text-align: center; font-weight: 500;'>Action Officer</div>
                                    </div>
                                `
                            },
                            {
                                label: 'Data Scientist',
                                html: /*html*/ `
                                    <div>
                                        <div style='font-size: 45px; font-weight: 500; text-align: center;'>DS</div>
                                        <div class='mt-2' style='text-align: center; font-weight: 500;'>Data Scientist</div>
                                    </div>
                                `
                            },
                            {
                                label: 'Visitor',
                                html: /*html*/ `
                                    <div class=''>
                                        <div class='d-flex align-items-center justify-content-center' style='height: 67.5px;'>
                                            <svg class='icon' style='font-size: 55px; fill: var(--color);'>
                                                <use href='#icon-bs-person-badge'></use>
                                            </svg>
                                        </div>
                                        <div class='mt-2' style='text-align: center; font-weight: 500;'>Visitor</div>
                                    </div>
                                `
                            }
                        ],
                        parent: modalBody
                    });

                    roleField.add();
        
                    // Save button
                    const startBtn = Button({
                        async action(event) {
                            startBtn.disable();
                            startBtn.get().innerHTML = /*html*/ `
                                <span class="spinner-border" role="status" aria-hidden="true" style="width: 18px; height: 18px; border-width: 3px"></span>
                            `;

                            // Set new roles array
                            const roles = [];

                            if (Roles.results.includes('Administrator')) {
                                roles.push('Administrator');
                            }

                            if (Roles.results.includes('Developer')) {
                                roles.push('Developer');
                            }

                            if (Roles.results.includes('User')) {
                                roles.push('User');
                            }

                            roles.push(roleField.value());

                            // Modify user
                            Store.user().Roles.results = roles;

                            // Update user item
                            await UpdateItem({
                                list: 'Users',
                                itemId: Id,
                                data: {
                                    Roles: {
                                        results: roles
                                    }
                                }
                            });
                            
                            // Resolve promise on modal close
                            $(modal.get()).on('hidden.bs.modal', event => {
                                Route('Settings/Account');
                            });
    
                            modal.close();
                        },
                        classes: ['w-100 mt-4'],
                        width: '100%',
                        parent: modalBody,
                        type: 'robi',
                        value: 'Save'
                    });
        
                    startBtn.add();

                    // Cancel button
                    const cancelBtn = Button({
                        async action(event) {
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
            });
        
            modal.add();
        }
    });

    editRole.add();
    editRole.get().style.padding = '0px';
}
// @END-File
