import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Reply(param) {
    const {
        reply, label, margin, onEdit, parent, position
    } = param;

    const {
        Body, Author, Editor, Created, Modified
    } = reply;

    // FIXME: Edit button doesn't show up if author of reply
    const component = Component({
        html: /*html*/ `
            <div class='card'>
                ${
                    Author.Name === Store.user().LoginName ?
                    /*html*/ `
                        <div class='button-group'>
                            <button type='button' class='btn btn-secondary cancel'>Cancel</button>
                            <button type='button' class='btn btn-robi-primaryColor edit'>Edit reply</button>
                        </div>
                    ` : ''
                }
                <div class='card-body'>
                    <h6 class='card-subtitle text-muted'>
                        <span>${Author.Title.split(' ').slice(0, 2).join(' ')} • ${formatDate(Created)}</span>
                        ${
                            label === 'new' ?
                            /*html*/ `
                                <span class='badge badge-success' role='alert'>New</span>
                            ` : ''
                        }
                    </h6>
                    <div class='card-text mb-2'>${Body || ''}</div>
                    <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title.slice(0, 2).join(' ')} ${formatDate(Modified)} ` : ''}</h6>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
                position: relative;
                background: var(--background);
                border: none;
                border-radius: 20px;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
            }

            #id .card-subtitle {
                font-size: 14px;
                font-weight: 400;
                text-align: right;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            /* #id .card-text {
                font-size: 13px;
            } */

            /* Reply */
            #id .button-group {
                position: absolute;
                display: none;
                top: 5px;
                right: 5px;
            }

            #id .button-group .btn {
                margin-left: 5px;
            }
            
            #id .edit,
            #id .cancel {
                font-size: .8em;
                padding: .275rem .75rem;
            }

            #id .cancel {
                display: none;
            }

            #id:hover .button-group {
                display: flex !important;
            }

            #id .btn-robi-primaryColor {
                background: var(--primary);
                color: white;
            }

            #id .btn-robi-primaryColor:focus,
            #id .btn-robi-primaryColor:active {
                box-shadow: none;
            }

            #id .editable {
                padding: 10px;
                margin-top: 20px;
                border: solid 2px mediumseagreen;
                border-radius: 4px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .cancel',
                event: 'click',
                listener(event) {
                    event.target.style.display = 'none';

                    const editButton = component.find('.edit');
                    editButton.innerText = 'Edit reply';
                    editButton.classList.add('btn-robi-primaryColor');
                    editButton.classList.remove('btn-success');

                    const buttonGroup = component.find('.button-group');
                    buttonGroup.style.display = 'none';

                    const cardText = component.find('.card-text');
                    cardText.setAttribute('contenteditable', false);
                    cardText.classList.remove('editable');
                }
            },
            {
                selector: '#id .edit',
                event: 'click',
                listener(event) {
                    const cardText = component.find('.card-text');
                    const buttonGroup = component.find('.button-group');
                    const cancelButton = component.find('.cancel');

                    if (event.target.innerText === 'Edit reply') {
                        event.target.innerText = 'Update';
                        event.target.classList.remove('btn-robi-primaryColor');
                        event.target.classList.add('btn-success');

                        cardText.setAttribute('contenteditable', true);
                        cardText.classList.add('editable');
                        cardText.focus();

                        cancelButton.style.display = 'block';
                        buttonGroup.style.display = 'flex';
                    } else {
                        onEdit(cardText.innerHTML);

                        event.target.innerText = 'Edit reply';
                        event.target.classList.add('btn-robi-primaryColor');
                        event.target.classList.remove('btn-success');

                        cardText.setAttribute('contenteditable', false);
                        cardText.classList.remove('editable');

                        cancelButton.style.display = 'none';
                        buttonGroup.style.display = 'none';
                    }
                }
            }
        ]
    });

    function formatDate(date) {
        const thisDate = new Date(date);

        if (isToday(thisDate)) {
            // console.log('is today');
        }

        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
            hour: 'numeric',
            minute: 'numeric'
        })}
        `;
    }

    function isToday(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function isGreaterThanOneHour(date) {
        const thisDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        if (thisDate === today) {
            return true;
        } else {
            return false;
        }
    }

    function edited(created, modified) {
        // console.log(`CREATED:\t${formatDate(created)}`)
        // console.log(`MODIFIED:\t${formatDate(modified)}`);
        if (formatDate(created) !== formatDate(modified)) {
            return true;
        } else {
            return false;
        }
    }

    component.setModified = (param) => {
        const {
            Modified, Editor
        } = param;

        component.find('.edit-text').innerHTML = `Last edited by ${Editor.Title} ${formatDate(Modified)}`;
    };

    return component;
}
// @END-File
