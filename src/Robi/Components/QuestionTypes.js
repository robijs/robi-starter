import { Get } from '../Actions/Get.js'
import { Title } from './Title.js'
import { Container } from './Container.js'
import { QuestionType } from './QuestionType.js'
import { App } from '../Core/App.js'
import { LoadingSpinner } from './LoadingSpinner.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function QuestionTypes(param) {
    const { parent } = param;

    // View Container
    const container = Container({
        display: 'block',
        width: '100%',
        margin: '30px 0px 0px 0px',
        parent
    });

    container.add();

    // Loading
    const loading = LoadingSpinner({
        type: 'robi',
        message: 'Loading questions',
        parent
    });

    loading.add();

    // Check local storage for questionTypes
    let questionTypes = JSON.parse(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`));

    if (!questionTypes) {
        console.log('questionTypes not in local storage. Adding...');

        const questionTypesResponse = await Get({
            list: 'Settings',
            filter: `Key eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('name').split(' ').join('-')}-questionTypes`, questionTypesResponse[0].Value);
        questionTypes = JSON.parse(localStorage.getItem(`${App.get('name').split(' ').join('-')}-questionTypes`));

        console.log('questionTypes added to local storage.');
    }

    const questions = await Get({
        list: 'Questions',
        select: '*,Author/Name,Author/Title,Editor/Name,Editor/Title',
        expand: `Author/Id,Editor/Id`,
    });

    loading.remove();

    console.log(questions);

    questionTypes.forEach(type => {
        const {
            title, path
        } = type;

        const questionType = QuestionType({
            title,
            path,
            questions: questions.filter(item => item.QuestionType === title),
            parent: container
        });

        questionType.add();
    });
}
// @END-File
