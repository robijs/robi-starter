import { Alert } from './Alert.js'
import { Container } from './Container.js'
import { QuestionCard } from './QuestionCard.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function QuestionCards({ parent, path, questions }) {
    if (typeof parent === 'object' && parent.empty) {
        parent.empty();
    }

    /** Info Alert Container */
    const alertContainer = Container({
        parent,
        display: 'flex',
        width: '100%',
    });

    alertContainer.add();

    /** Light Alert */
    const lightAlert = Alert({
        type: 'blank',
        text: `${questions.length} question${questions.length === 1 ? '' : 's'}`,
        margin: '20px 0px 10px 0px',
        parent: alertContainer
    });

    lightAlert.add();

    /** Questions */
    questions
        .sort((a, b) => {
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
        })
        .forEach(question => {
            const questionCard = QuestionCard({
                question,
                path: `Questions/${path}`,
                margin: '15px 0px',
                parent
            });

            questionCard.add();
        });

    return {
        addCard(question) {
            /** Add card to DOM */
            const questionCard = QuestionCard({
                question,
                label: 'new',
                path: `Questions/${path}`,
                margin: '15px 0px',
                parent: alertContainer,
                position: 'afterend'
            });

            questionCard.add();

            /** Update count */
            const refreshedQuestions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            lightAlert.get().innerHTML = `${refreshedQuestions.length} question${refreshedQuestions.length === 1 ? '' : 's'}`;
        }
    };
}
// @END-File
