import { CreateItem } from '../Actions/CreateItem.js'
import { UpdateItem } from '../Actions/UpdateItem.js'
import { Modal } from './Modal.js'
import { NewReply } from './NewReply.js'
import { Question } from './Question.js'
import { Reply } from './Reply.js'
import { Store } from '../Core/Store.js'
import { QuestionModel } from '../Models/QuestionModel.js'
import { EditQuestion } from './EditQuestion.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function QuestionContainer(param) {
    const {
        question, parent
    } = param;

    /** New Question Form */
    let editQuestionForm;

    /** Question */
    const questionComponent = Question({
        question,
        parent,
        onEdit(event) {
            const modal = Modal({
                title: 'Edit Question',
                contentPadding: '30px',
                showFooter: true,
                addContent(modalBody) {
                    editQuestionForm = EditQuestion({
                        question,
                        modal,
                        parent: modalBody
                    });
                },
                buttons: {
                    footer: [
                        {
                            value: 'Cancel',
                            classes: '',
                            data: [
                                {
                                    name: 'dismiss',
                                    value: 'modal'
                                }
                            ]
                        },
                        {
                            value: 'Update',
                            classes: 'btn-robi',
                            async onClick(event) {
                                /** Disable button */
                                event.target.disabled = true;
                                event.target.innerHTML = /*html*/ `
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating
                                `;

                                /** Update question */
                                const updatedItem = await UpdateItem({
                                    list: 'Questions',
                                    select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                                    expand: `Author/Id,Editor/Id`,
                                    itemId: question.Id,
                                    data: editQuestionForm.getFieldValues()
                                });

                                const updatedQuestion = QuestionModel({
                                    question: updatedItem,
                                    replies: question.replies
                                });

                                const questions = Store.get('Model_Questions');
                                const index = questions.indexOf(question);

                                console.log(index);

                                questions.splice(index, 1, updatedQuestion);

                                /** Add new quesiton card to DOM */
                                questionComponent.setQuestion(updatedQuestion);

                                /** Completed */
                                event.target.disabled = false;
                                event.target.innerHTML = 'Updated!';

                                /** close and remove modal */
                                modal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });

            modal.add();
        }
    });

    questionComponent.add();

    /** Replies */
    const {
        replies
    } = question;

    replies
        .sort((a, b) => {
            a = a.Id;
            b = b.Id;

            /** Ascending */
            if (a < b) {
                return -1;
            }

            if (a > b) {
                return 1;
            }

            // names must be equal
            return 0;
        })
        .forEach(reply => {
            const replyComponent = Reply({
                reply,
                margin: '0px 0px 10px 0px',
                parent,
                onEdit(value) {
                    replyOnEdit({
                        reply,
                        replyComponent,
                        value
                    });
                }
            });

            replyComponent.add();
        });

    async function replyOnEdit(param) {
        const {
            reply, replyComponent, value
        } = param;

        if (value !== reply.Body) {
            /** Update question */
            const updatedItem = await UpdateItem({
                list: 'Questions',
                select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                expand: `Author/Id,Editor/Id`,
                itemId: reply.Id,
                data: {
                    Body: value
                }
            });

            const index = replies.indexOf(reply);

            console.log('reply index: ', index);

            replies.splice(index, 1, updatedItem);

            /** Updated modified text */
            replyComponent.setModified(updatedItem);
        }
    }

    /** New Reply */
    const newReply = NewReply({
        width: '100%',
        parent,
        async action({ value, button, field }) {
            // Disable button - Prevent user from clicking this item more than once
            button.disabled = true;
            button.querySelector('.icon').classList.add('d-none');
            button.insertAdjacentHTML('beforeend', /*html*/ `
                <span style="width: 16px; height: 16px;" class="spinner-border spinner-border-sm text-robi" role="status" aria-hidden="true"></span>
            `);

            /** Create item */
            const newItem = await CreateItem({
                list: 'Questions',
                select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                expand: `Author/Id,Editor/Id`,
                data: {
                    Title: 'Reply',
                    Body: value,
                    ParentId: question.Id,
                    QuestionId: question.Id,
                    QuestionType: question.QuestionType
                }
            });

            /** Update Last Reply footer */
            questionComponent.updateLastReply(newItem);

            /** Increment replies */
            questionComponent.addCount();

            /** Add to replies */
            replies.push(newItem);

            /** Add to DOM */
            const replyComponent = Reply({
                reply: newItem,
                label: 'new',
                margin: '0px 0px 10px 0px',
                parent: newReply,
                position: 'beforebegin',
                onEdit(value) {
                    replyOnEdit({
                        reply: newItem,
                        replyComponent,
                        value
                    });
                }
            });

            replyComponent.add();

            // Reset field
            field.innerHTML = '';

            // Enable button
            button.querySelector('.spinner-border').remove();
            button.querySelector('.icon').classList.remove('d-none');
            button.disabled = false;
        }
    });

    newReply.add();

    /** Register event */
    document.addEventListener('keydown', event => {
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
            questionComponent.editButton().click();
        }

        if (event.ctrlKey && event.altKey && event.key === 'r') {
            newReply.focus();
        }
    });
}
// @END-File
