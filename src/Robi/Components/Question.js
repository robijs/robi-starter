import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Question(param) {
    const {
        question, margin, parent, onEdit, position
    } = param;

    const {
        Title, Body, Featured, Author, Editor, Created, Modified, replies
    } = question;

    console.log(question);

    const replyCount = replies.length;
    const lastReply = replies[0];

    const component = Component({
        html: /*html*/ `
            <div class='question'>
                <div class='card'>
                    <div class='card-body'>
                        <h5 class='card-title'>
                            <span class='title-text'>${Title}</span>
                            ${
                                Featured ?
                                /*html*/ `
                                    <span class='badge badge-info' role='alert'>Featured</span>
                                ` : ''
                            }
                        </h5>
                        <h6 class='card-subtitle mb-2 text-muted'>${Author.Title.split(' ').slice(0, 2).join(' ')} • ${formatDate(Created)}</h6>
                        <div class='card-text mb-2'>${Body || ''}</div>
                        <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title} ${formatDate(Modified)} ` : ''}</h6>
                    </div>
                    ${buildFooter(lastReply)}
                </div>
                    ${
                        // Author.Name on LaunchPad, Author.LoginName on CarePoint
                        ( Author.Name ? Author.Name.split('|').at(-1) : Author.LoginName.split('|').at(-1) ) === Store.user().LoginName ?
                        /*html*/ `
                            <div class='edit-button-container'>
                                <button type='button' class='btn btn-robi-light edit'>Edit</button>
                            </div>
                        ` : ''
                    }
                <div class='reply-count'>
                    <span class='reply-count-value'>
                        <span>${replyCount}</span>
                    </span>
                    <span class='reply-count-label'>${replyCount === 1 ? 'Reply' : 'Replies'}</span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
            }

            #id .card {
                background: var(--background);
                border: none;
                border-radius: 20px;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
            }

            #id .card-subtitle {
                font-size: .9em;
                font-weight: 400;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            #id .card-footer {
                border-radius: 0px 0px 20px 20px;
                background: inherit;
            }

            #id .edit-button-container {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 20px;
            }

            #id .edit-button-container .btn {
                font-size: 15px;
            }

            /** Replies */
            #id .reply-count {
                margin: 20px 0px;
                font-size: 16px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: end;
            }
            
            #id .reply-count-value {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 30px;
                width: 30px;
                margin: 5px;
                padding: 5px;
                font-weight: bold;
                text-align: center;
                border-radius: 50%;
                color: white;
                background: var(--primary);
            }

            #id .reply-count-value * {
                color: white;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .edit',
                event: 'click',
                listener: onEdit
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

    function buildFooter(lastReply) {
        if (lastReply) {
            return /*html*/ `
                <div class='card-footer question-last-reply'>
                   ${lastReplyTemplate(lastReply)}
                </div>
            `;
        } else {
            return '';
        }
    }

    function lastReplyTemplate(lastReply) {
        const {
            Author, Body, Created
        } = lastReply;

        return /*html*/ `
            <span class='text-muted' style='font-size: 14px;'>
                <span>Last reply by ${Author.Title.split(' ').slice(0, 2).join(' ')}</span>
                on
                <span>${formatDate(Created)}</span>
            </span>
            <p class='card-text mt-2'>${Body}</p>
        `;
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

    component.setQuestion = (param) => {
        const {
            Title, Body, Modified, Editor
        } = param;

        component.find('.title-text').innerHTML = Title;
        component.find('.card-text').innerHTML = Body || '';
        component.find('.edit-text').innerHTML = `Last edited by ${Editor.Title} ${formatDate(Modified)}`;
    };

    component.addCount = () => {
        const replyCount = component.find('.reply-count-value');

        replyCount.innerText = parseInt(replyCount.innerText) + 1;
    };

    component.updateLastReply = (reply) => {
        let footer = component.find('.card-footer');

        if (footer) {
            footer.innerHTML = lastReplyTemplate(reply);
        } else {
            component.find('.card').insertAdjacentHTML('beforeend', buildFooter(reply));
        }

    };

    component.editButton = () => {
        return component.find('.edit');
    };

    return component;
}
// @END-File
