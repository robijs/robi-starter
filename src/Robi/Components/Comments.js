import { Component } from '../Actions/Component.js'
import { CreateItem } from '../Actions/CreateItem.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Comments(param) {
    const {
        comments, parent, position, width, parentId
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='comments-container'>
                <!-- Border -->
                <div class='comments-border'>
                    <div class='comments-border-count-container'>
                        <div class='comments-border-count'>
                            <span>${comments.length}</span>
                        </div>
                    </div>
                    <div class='comments-border-name'>
                        <div>${comments.length > 1 || comments.length === 0 ? 'Comments' : 'Comment'}</div>
                    </div>
                    <div class='comments-border-line-container'>
                        <div class='comments-border-line'></div>
                    </div>
                </div>
                <!-- Comments -->
                <div class='comments'>
                    <div class='reverse'>
                        ${createCommentsHTML()}
                    </div>
                </div>
                <!-- New Comment -->
                <div class='new-comment-container'>
                    <div class='new-comment' contenteditable='true'></div>
                    <!-- Button -->
                    <div class='new-comment-button-container'>
                        <div class='new-comment-button'>
                            <svg class='icon'>
                                <use href='#icon-arrow-up2'></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            .comments-container {
                width: ${width || '100%'};
                max-height: 80vw;
                padding-bottom: 20px;
                /* border-bottom: solid 2px var(--primary); */
            }

            .comments-border {
                display: flex;
                flex-direction: row;
                margin-top: 30px;
            }

            .comments-border-count {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin: 5px 5px 5px 0px;
                background: var(--primary);
                display: grid;
                place-content: center;
            }

            .comments-border-count span {
                color: white;
                font-size: 1.5em;
                font-weight: 700;
            }

            .comments-border-name {
                display: grid;
                place-content: center;
                font-size: 1.5em;
                font-weight: 700;
            }

            .comments-border-line-container {
                flex: 2;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 10px 0px 10px 10px;
            }

            .comments-border-line {
                height: 2px;
                flex: 1;
                margin-top: 7px;
                background: var(--primary);
            }

            /* New Comment */
            #id .new-comment-container {
                display: flex;
                background: white;
                border-radius: 4px;
                margin: 10px 30px;
            }

            #id .new-comment {
                overflow-wrap: anywhere;
                flex: 2;
                font-size: .9em;
                font-weight: 500;
                padding: 10px 20px;
                border-radius: 4px 0px 0px 4px;
                border-left: solid 1px rgba(0, 0, 0, .1);
                border-top: solid 1px rgba(0, 0, 0, .1);
                border-bottom: solid 1px rgba(0, 0, 0, .1);
            }

            #id .new-comment:active,
            #id .new-comment:focus{
                outline: none;
                border-left: solid 1px var(--primary);
                border-top: solid 1px var(--primary);
                border-bottom: solid 1px var(--primary);
            }

            #id .new-comment-button-container,
            #id .new-comment-button-container {
                border-radius: 0px 4px 4px 0px;
                border-right: solid 1px rgba(0, 0, 0, .1);
                border-top: solid 1px rgba(0, 0, 0, .1);
                border-bottom: solid 1px rgba(0, 0, 0, .1);
            }

            #id .new-comment:active ~ .new-comment-button-container,
            #id .new-comment:focus ~ .new-comment-button-container {
                border-radius: 0px 4px 4px 0px;
                border-right: solid 1px var(--primary);
                border-top: solid 1px var(--primary);
                border-bottom: solid 1px var(--primary);
            }

            /* Button */
            #id .new-comment-button {
                cursor: pointer;
                display: inline-block;
                margin: 5px;
                padding: 5px 7.5px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
                color: white;
                background: var(--primary);
            }

            #id .new-comment-button .icon {
                font-size: 1.2em;
            }

            /* Comments */
            #id .comments {
                display: flex;
                flex-direction: column-reverse;
                max-height: 60vh;
                padding: 0px 30px;
                overflow: overlay;
            }

            /* Comment */
            #id .comment-container {
                display: flex;
                justify-content: flex-start;
            }

            #id .comment {
                margin: 10px 0px;
                padding: 7.5px 15px;
                border-radius: 4px;
                background: rgba(${App.get('primaryColorRGB')}, .1);
                border: solid 1px rgba(0, 0, 0, .05);
                max-width: 70%;
            }

            #id .comment-date-container {
                display: flex;
                align-items: center;
                font-size: .8em;
            }

            #id .comment-author {
                font-weight: 500;
                padding-right: 10px;
            }

            #id .comment-text {
                display: flex;
                flex-direction: column;
                padding-top: 5px;
            }

            /* Current User Comment */
            #id .comment-container.mine {
                justify-content: flex-end;
            }

            #id .comment-container.mine .comment {
                background: rgba(${App.get('primaryColorRGB')}, .8);
                border: solid 1px transparent;
            }

            #id .comment-container.mine .comment * {
                color: white;
            }

            /** New Comment */
            /*
            #id .animate-new-comment {
                animation: slide-up 1000ms ease-out 0s forwards;
            }

            @keyframes slide-up {
                0% {
                    transform: translateY(100%);
                }

                100% {
                    transform: translateY(0%);
                }
            }
            */
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .new-comment',
                event: 'keydown',
                async listener(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();

                        component.find('.new-comment-button').click();
                    }
                }
            },
            {
                selector: '#id .new-comment-button',
                event: 'click',
                async listener(event) {
                    const field = component.find('.new-comment');
                    const Comment = field.innerHTML;
                    const SubmittedBy = Store.user().Title;
                    const LoginName = Store.user().LoginName;

                    if (Comment) {
                        const newItem = await CreateItem({
                            list: 'Comments',
                            data: {
                                FK_ParentId: parseInt(parentId),
                                Comment,
                                SubmittedBy,
                                LoginName
                            }
                        });

                        component.addComment(newItem, true);

                        field.innerHTML = '';
                    } else {
                        console.log('new comment field is empty');
                    }
                }
            }
        ]
    });

    function createCommentsHTML() {
        let html = '';

        comments.forEach(item => {
            html += commentTemplate(item);
        });

        return html;
    }

    function dateTemplate(date) {
        const d = new Date(date);

        return /*html*/ `
            <div class='comment-date'>${d.toLocaleDateString()} ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
        `;
    }

    function commentTemplate(comment, isNew) {
        return /*html*/ `
            <div class='comment-container${comment.LoginName === Store.user().LoginName ? ' mine' : ''}${isNew ? ' animate-new-comment' : ''}' data-itemid='${comment.Id}'>
                <div class='comment'>
                    <div class='comment-date-container'>
                        ${comment.LoginName !== Store.user().LoginName ? /*html*/ `<div class='comment-author'>${comment.SubmittedBy}</div>` : ''}
                        ${dateTemplate(comment.Created)}
                    </div>
                    <div class='comment-text'><div>${comment.Comment}</div></div>
                </div>
            </div>
        `;
    }

    component.addComment = (comment, scroll) => {
        const comments = component.findAll('.comment-container');
        const itemIds = [...comments].map(node => parseInt(node.dataset.itemid));

        if (itemIds.length > 0) {
            // console.log('new\t', itemIds, comment.Id);
            itemIds.push(comment.Id);
            itemIds.sort((a, b) => a - b);

            // console.log('sort\t', itemIds);
            const index = itemIds.indexOf(comment.Id);

            // console.log('index\t', index);
            comments[index - 1].insertAdjacentHTML('afterend', commentTemplate(comment, true));
        } else {
            component.find('.reverse').insertAdjacentHTML('beforeend', commentTemplate(comment, true));
        }


        if (scroll) {
            component.find('.comments').scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // container.insertAdjacentHTML('beforeend', commentTemplate(comment, true));
        const counter = component.find('.comments-border-count span');
        const newCount = parseInt(counter.innerText) + 1;

        counter.innerText = newCount;

        const text = component.find('.comments-border-name');

        text.innerText = newCount > 1 ? 'Comments' : 'Comment';
    };

    return component;
}
// @END-File
