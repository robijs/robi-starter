import { Store } from '../Core/Store.js'
import { Get } from '../Actions/Get.js'
import { QuestionModel } from './QuestionModel.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function QuestionsModel(param) {
    const {
        filter
    } = param;

    /** Get Questions */
    const messages = await Get({
        list: 'Questions',
        filter,
        select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
        orderby: 'Id desc',
        expand: `Author/Id,Editor/Id`
    });

    /** Questions */
    const questions = messages.filter(question => question.ParentId === 0);

    /** Replies */
    const replies = messages.filter(question => question.ParentId !== 0);

    /** Model */
    const Model_Questions = questions.map(question => {
        // question.replies = replies.filter(reply => reply.QuestionId === question.Id);
        // return question;
        return QuestionModel({
            question,
            replies: replies.filter(reply => reply.QuestionId === question.Id)
        });
    });

    Store.add({
        type: 'model',
        name: 'Model_Questions',
        model: Model_Questions
    });

    return Model_Questions;
}
// @END-File
