import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function NewReply(param) {
    const {
        width, action, parent, position, margin
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='comments-container'>
                <div class='new-reply-label'>New reply</div>
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
                margin: ${margin || '20px 0px 0px 0px'};
            }

            /* New Comment */
            #id .new-comment-container {
                display: flex;
                background: #F8F8FC;
                border-radius: 20px;
            }

            #id .new-comment {
                overflow-wrap: anywhere;
                flex: 2;
                /* font-size: 13px; */
                /* font-weight: 500; */
                padding: 10px 20px;
                border-radius: 20px 0px 0px 20px;
                border-left: solid 3px #F8F8FC;
                border-top: solid 3px #F8F8FC;
                border-bottom: solid 3px #F8F8FC;
            }

            #id .new-comment:active,
            #id .new-comment:focus{
                outline: none;
                border-left: solid 3px var(--primary-6b);
                border-top: solid 3px var(--primary-6b);
                border-bottom: solid 3px var(--primary-6b);
            }

            #id .new-comment-button-container {
                display: flex;
                align-items: end;
                border-radius: 0px 20px 20px 0px;
                border-right: solid 3px #F8F8FC;
                border-top: solid 3px #F8F8FC;
                border-bottom: solid 3px #F8F8FC;
            }

            #id .new-comment:active ~ .new-comment-button-container,
            #id .new-comment:focus ~ .new-comment-button-container {
                border-radius: 0px 20px 20px 0px;
                border-right: solid 3px var(--primary-6b);
                border-top: solid 3px var(--primary-6b);
                border-bottom: solid 3px var(--primary-6b);
            }

            /* Button */
            #id .new-comment-button {
                cursor: pointer;
                display: flex;
                margin: 6px;
                padding: 8px;
                font-weight: bold;
                text-align: center;
                border-radius: 50%;
                color: white;
                background: var(--button-background);
            }

            #id .new-comment-button .icon {
                fill: var(--primary);
            }

            /* Label */
            #id .new-reply-label {
                font-weight: 500;
                margin-bottom: 5px;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .new-comment',
                event: 'keydown',
                async listener(event) {
                    if (event.ctrlKey && event.key === 'Enter') {
                        event.preventDefault();

                        component.find('.new-comment-button').click();
                    }
                }
            },
            {
                selector: '#id .new-comment',
                event: 'paste',
                async listener(event) {
                    // cancel paste
                    event.preventDefault();

                    // get text representation of clipboard
                    const text = (event.originalEvent || event).clipboardData.getData('text/plain');

                    // insert text manually
                    event.target.innerText = text;
            }
            },
            {
                selector: '#id .new-comment-button',
                event: 'click',
                async listener(event) {
                    const field = component.find('.new-comment');
                    const value = field.innerHTML;

                    if (value) {
                        action({
                            value,
                            button: this,
                            field,
                        });
                    } else {
                        console.log('new comment field is empty');
                    }
                }
            }
        ]
    });

    component.focus = () => {
        component.find('.new-comment').focus();
    };

    return component;
}
// @END-File
