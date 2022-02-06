import { Component } from '../Actions/Component.js'
import { Route } from '../Actions/Route.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function QuestionType(param) {
    const {
        title, path, questions, parent, position
    } = param;

    const lastEntry = questions[questions.length - 1];

    // Compare Modified dates
    const dates = questions.map(item => new Date(item.Modified));
    const lastModifiedDate = new Date(Math.max(...dates));

    const { Editor, Modified } = lastEntry || { Editor: '', Modified: '' };
    
    const questionCount = questions.filter(item => item.ParentId === 0).length;
    const replyCount = questions.filter(item => item.ParentId !== 0).length;

    const component = Component({
        html: /*html*/ `
            <div class='question-type mb-3'>
                <div class='question-type-title mb-1'>${title}</div>
                <div class='question-count mb-1'>${questionCount} ${questionCount === 1 ? 'question' : 'questions'} (${replyCount} ${replyCount === 1 ? 'reply' : 'replies'})</div>
                <div class='question-date'>${Modified ? `Last updated by ${Editor.Title.split(' ').slice(0, 2).join(' ')} on ${formatDate(lastModifiedDate)}` : ''}</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                border-radius: 20px;
                padding: 20px;
                background: var(--background);
                cursor: pointer;
            }

            #id .question-type-title {
                font-weight: 600;
            }

            #id .question-count {
                font-size: 14px;
            }

            #id .question-date {
                font-size: 14px;
                color: gray;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    Route(`Questions/${path}`);
                }
            }
        ]
    });

    function formatDate(date) {
        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
            hour: 'numeric',
            minute: 'numeric'
        })}
        `;
    }

    return component;
}
// @END-File
