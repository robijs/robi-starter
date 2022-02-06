import { Help } from '../Components/Help.js'
import { Missing } from '../Components/Missing.js'
import { QuestionAndReplies } from '../Components/QuestionAndReplies.js'
import { QuestionBoard } from '../Components/QuestionBoard.js'
import { QuestionTypes } from '../Components/QuestionTypes.js'
import { Settings } from '../Components/Settings.js'
import { Unauthorized } from '../Components/Unauthorized.js'

// @START-File
/**
 * 
 */
// TODO: Export function instead of array?
const Routes = [
    {
        path: '403',
        title: '403',
        type: 'system',
        hide: true,
        ignore: true,
        go(param) {
            Unauthorized(param);
        }
    },
    {
        path: '404',
        title: '404',
        type: 'system',
        hide: true,
        ignore: true,
        go(param) {
            Missing(param);
        }
    },
    {
        path: 'Questions',
        title: 'Questions',
        type: 'system',
        icon: 'bs-chat-right-text',
        go(param) {
            const {
                parent,
                pathParts,
                title,
            } = param;

            if (pathParts.length === 1) {
                QuestionTypes(param);
            } else if (pathParts.length === 2) {
                QuestionBoard({
                    parent,
                    path: pathParts[1],
                    title
                });
            } else if (pathParts.length === 3) {
                QuestionAndReplies({
                    parent,
                    path: pathParts[1],
                    itemId: parseInt(pathParts[2]),
                    title
                });
            }
        }
    },
    {
        path: 'Settings',
        title: 'Settings',
        type: 'system',
        icon: 'bs-gear',
        ignore: true,
        go(param) {
            Settings(param);
        }
    }
];

export { Routes }
// @END-File
