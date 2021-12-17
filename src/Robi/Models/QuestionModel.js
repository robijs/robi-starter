// @START-File
/**
 *
 * @param {*} param
 * @returns
 */

export function QuestionModel(param) {
    const {
        question, replies
    } = param;

    question.replies = replies || [];

    question.addReply = (reply) => {
        question.replies.push(reply);
    };

    return question;
}
// @END-File
