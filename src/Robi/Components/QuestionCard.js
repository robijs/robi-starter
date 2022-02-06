import { Component } from '../Actions/Component.js'
import { Route } from '../Actions/Route.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function QuestionCard(param) {
    const {
        question, label, path, margin, parent, position
    } = param;

    const {
        Id, Title, Body, Featured, Author, Editor, Created, Modified, replies
    } = question;

    const replyCount = replies.length;
    const lastReply = replies.sort((a, b) => {
        a = a.Id;
        b = b.Id;

        /** Descending */
        if (a > b) {
            return -1;
        }

        if (a < b) {
            return 1;
        }

        // names must be equal
        return 0;
    })[0];

    const component = Component({
        html: /*html*/ `
            <div class='card'>
                <div class='card-body'>
                    <h5 class='card-title'>
                        <span>${Title}</span>
                        ${
                            Featured ?
                            /*html*/ `
                                <span class='badge badge-info' role='alert'>Featured</span>
                            ` : ''
                        }
                        ${
                            label === 'new' ?
                            /*html*/ `
                                <span class='badge badge-success' role='alert'>New</span>
                            ` : ''
                        }
                        ${
                            replyCount ?
                            /*html*/ `
                                <span class='reply-count'>
                                    <span class='reply-count-label'>Replies</span>
                                    <span class='badge badge-secondary'>${replyCount}</span>
                                </span>
                            ` : ''
                        }
                    </h5>
                    <!-- <h6 class='card-subtitle mb-2 text-muted'>Asked by ${Author.Title} ${formatDate(Created)}</h6> -->
                    <h6 class='card-subtitle mb-2 text-muted'>${Author.Title.split(' ').splice(0, 2).join(' ')} ${formatDate(Created)}</h6>
                    <div class='card-text mb-2'>${Body || ''}</div>
                    <h6 class='card-subtitle mt-2 text-muted edit-text'>${edited(Created, Modified) ? `Last edited by ${Editor.Title.split(' ').splice(0, 2).join(' ')} ${formatDate(Modified)} ` : ''}</h6>
                </div>
                ${buildFooter(lastReply)}
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
                margin: ${margin || '0px'};
                cursor: pointer;
                background: var(--background);
                border: none;
                border-radius: 20px;
            }

            #id .card-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            #id .card-title .badge {
                font-size: 12px;
                font-weight: 500;
                padding: 5px 10px;
                border-radius: 8px;
            }

            #id .reply-count {
                margin-left: 1.25rem;
            }

            #id .reply-count-label {
                font-size: .8em;
                font-weight: 400;
            }

            #id .card-subtitle {
                font-size: .9em;
                font-weight: 400;
            }

            #id .question-card-body {
                padding: 1.75rem;
            }

            #id .question-last-reply {
                font-size: .8em;
                font-weight: 400;
            }

            #id .card-footer {
                border-radius: 0px 0px 20px 20px;
                background: inherit;
            }

            /** Alert */
            #id .badge-info {
                font-size: .8em;
                padding: 4px 8px;
                margin: 0px;
                font-weight: 400;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    Route(`${path}/${Id}`);
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


    function buildFooter(lastReply) {
        if (lastReply) {
            const {
                Author, Body, Created
            } = lastReply;

            return /*html*/ `
                <div class='card-footer question-last-reply'>
                    <span>
                        <span>Last reply by ${Author.Title.split(' ').splice(0, 2).join(' ')}</span>
                        <span>${formatDate(Created)}</span>
                    </span>
                    <p class='card-text mt-2'>${Body}</p>
                </div>
            `;
        } else {
            return '';
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

    return component;
}
// @END-File
