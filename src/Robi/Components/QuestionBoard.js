import { Get } from '../Actions/Get.js'
import { CreateItem } from '../Actions/CreateItem.js'
import { UpdateItem } from '../Actions/UpdateItem.js'
import { Route  } from '../Actions/Route.js'
import { Title } from './Title.js'
import { Container } from './Container.js'
import { FoldingCube } from './FoldingCube.js'
import { Modal } from './Modal.js'
import { QuestionsToolbar } from './QuestionsToolbar.js'
import { QuestionCards } from './QuestionCards.js'
import { NewQuestion } from './NewQuestion.js'
import { QuestionModel } from '../Models/QuestionModel.js'
import { QuestionsModel } from '../Models/QuestionsModel.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { LoadingSpinner } from './LoadingSpinner.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function QuestionBoard({ parent, path, title }) {
    title.remove();

    /** View Title */
    let routeTitle;
    let currentType;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

        setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        routeTitle = Title({
            title: 'Questions',
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div style='height: 20px; width: 20px;' class='spinner-grow text-robi' role='status'></div>
                    `,
                    path: '',
                    currentPage: true
                }
            ],
            parent
        });

        routeTitle.add();

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('name').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);

        console.log('questionTypes added to local storage.');

        setTitle(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`));
    }

    function setTitle(items) {
        /** If View Tile exists, remove from DOM */
        if (routeTitle) {
            routeTitle.remove();
        }

        /** Parse types */
        const types = JSON.parse(items);

        /** Find question type from passed in path */
        currentType = types.find(item => item.path === path);

        /** Set new title with drop down options */
        routeTitle = Title({
            title: 'Questions',
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions',
                }
            ],
            dropdownGroups: [
                {
                    name: currentType.title,
                    items: types
                        //.filter(item => item.path !== path) /** filter out current selection */
                        .map(facility => {
                            const {
                                title, path
                            } = facility;

                            return {
                                label: title,
                                path: `Questions/${path}`
                            };
                        })
                }
            ],
            route(path) {
                Route(path);
            },
            parent,
            position: 'afterbegin'
        });

        routeTitle.add();
    }

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px',
        parent
    });

    viewContainer.add();

    /** New Question Form */
    let newQuestionForm;

    /** Toolbar */
    const qppQuestionsToolbar = QuestionsToolbar({
        selected: 'All',
        onFilter(filter) {
            console.log(filter);

            /** param */
            const param = {
                path,
                parent: questionsContainer
            };

            const questions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            switch (filter) {
                case 'All':
                    param.questions = questions;
                    break;
                case 'Mine':
                    param.questions = questions.filter(question => {
                        // console.log(question.Author.Title, Store.user().Title);
                        return question.Author.Title === Store.user().Title;
                    });
                    break;
                case 'Unanswered':
                    param.questions = questions.filter(question => {
                        // console.log(question.replies);
                        return question.replies.length === 0;
                    });
                    break;
                case 'Answered':
                    param.questions = questions.filter(question => {
                        // console.log(question.replies);
                        return question.replies.length !== 0;
                    });
                    break;
                case 'Featured':
                    param.questions = questions.filter(question => {
                        // console.log(question.Featured);
                        return question.Featured;
                    });
                    break;
                default:
                    break;
            }

            /** Add new list of cards */
            questionCards = QuestionCards(param);
        },
        onSearch(query) {
            console.log('query: ', query);

            const questions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            const filteredQuestions = questions.filter(question => {
                const {
                    Title, Body, Author, Created
                } = question;

                const date = `${new Date(Created).toLocaleDateString()} ${new Date(Created).toLocaleTimeString('default', {
                    hour: 'numeric',
                    minute: 'numeric'
                })}`.toLowerCase();

                if (Title.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Title: ${Title}.`);

                    return question;
                } else if (Body && Body.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Body: ${Body}.`);

                    return question;
                } else if (Author.Title.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Author name: ${Author.Title}.`);

                    return question;
                } else if (date.includes(query)) {
                    console.log(`SEARCH - Found in Created date: ${date}.`);

                    return question;
                }
            });

            /** Add new list of cards */
            questionCards = QuestionCards({
                path,
                questions: filteredQuestions,
                parent: questionsContainer
            });
        },
        onClear(event) {
            console.log(event);

            /** Add new list of cards */
            questionCards = QuestionCards({
                path,
                questions,
                parent: questionsContainer
            });
        },
        onAsk() {
            const modal = Modal({
                title: 'Ask a question',
                contentPadding: '30px',
                showFooter: true,
                background: 'var(--secondary)',
                addContent(modalBody) {
                    newQuestionForm = NewQuestion({
                        parent: modalBody,
                        modal
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
                            value: 'Submit',
                            classes: 'btn-robi',
                            disabled: true,
                            async onClick(event) {
                                /** Disable button */
                                event.target.disabled = true;
                                event.target.innerHTML = /*html*/ `
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting
                                `;

                                const fieldValues = newQuestionForm.getFieldValues();

                                fieldValues.ParentId = 0;
                                fieldValues.QuestionType = path;

                                /** Create Question */
                                const newItem = await CreateItem({
                                    list: 'Questions',
                                    data: fieldValues
                                });

                                /** Set QuestionId */
                                const updatedItem = await UpdateItem({
                                    list: 'Questions',
                                    select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                                    expand: `Author/Id,Editor/Id`,
                                    itemId: newItem.Id,
                                    data: {
                                        QuestionId: newItem.Id
                                    }
                                });

                                console.log(Store.get('Model_Questions'));

                                const question = QuestionModel({
                                    question: updatedItem
                                });

                                Store.get('Model_Questions').push(question);

                                console.log(Store.get('Model_Questions'));

                                /** Add new quesiton card to DOM */
                                questionCards.addCard(question);

                                /** Completed */
                                event.target.disabled = false;
                                event.target.innerHTML = 'Submitted!';

                                /** close and remove modal */
                                modal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });

            modal.add();
        },
        parent: viewContainer
    });

    qppQuestionsToolbar.add();

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        message: 'Loading questions',
        type: 'robi',
        parent: viewContainer
    });

    loadingIndicator.add();

    /** Questions Container */
    const questionsContainer = Container({
        display: 'flex',
        direction: 'column',
        width: '100%',
        margin: '30px 0px',
        parent: viewContainer
    });

    questionsContainer.add();

    let questions = Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await QuestionsModel({
            // filter: `QuestionType eq '${path}'`
        });

        questions = fetchedQuestions.filter(question => question.QuestionType === path);

        console.log('Model_Questions stored.');
    }

    /** Add all question cards to DOM */
    let questionCards = QuestionCards({
        path,
        questions,
        parent: questionsContainer
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}
// @END-File
