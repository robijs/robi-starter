import { AccountInfo } from '../Components/AccountInfo.js'
import { Alert } from '../Components/Alert.js'
import { AppContainer } from '../Components/AppContainer.js'
import { AttachFilesButton } from '../Components/AttachFilesButton.js'
import { AttachFilesField } from '../Components/AttachFilesField.js'
import { AttachmentsContainer } from '../Components/AttachmentsContainer.js'
import { Attachments } from '../Components/Attachments.js'
import { Banner } from '../Components/Banner.js'
import { BootstrapButton } from '../Components/BootstrapButton.js'
import { BootstrapDropdown } from '../Components/BootstrapDropdown.js'
import { BootstrapTextarea } from '../Components/BootstrapTextarea.js'
import { BuildInfo } from '../Components/BuildInfo.js'
import { Button } from '../Components/Button.js'
import { Card } from '../Components/Card.js'
import { Comments } from '../Components/Comments.js'
import { CommentsContainer } from '../Components/CommentsContainer.js'
import { Container } from '../Components/Container.js'
import { DashboardBanner } from '../Components/DashboardBanner.js'
import { DataTable } from '../Components/DataTable.js'
import { DateField } from '../Components/DateField.js'
import { DevConsole } from '../Components/DevConsole.js'
import { Developer } from '../Components/Developer.js'
import { DeveloperLinks } from '../Components/DeveloperLinks.js'
import { Dialog } from '../Components/Dialog.js'
import { DropDownField } from '../Components/DropDownField.js'
import { DropDownMenu } from '../Components/DropDownMenu.js'
import { EditForm } from '../Components/EditForm.js'
import { EditQuestion } from '../Components/EditQuestion.js'
import { ErrorForm } from '../Components/ErrorForm.js'
import { Errors } from '../Components/Errors.js'
import { Files } from '../Components/Files.js'
import { FilesTable } from '../Components/FilesTable.js'
import { FixedToast } from '../Components/FixedToast.js'
import { FoldingCube } from '../Components/FoldingCube.js'
import { FormSection } from '../Components/FormSection.js'
import { Heading } from '../Components/Heading.js'
import { Help } from '../Components/Help.js'
import { Missing } from '../Components/Missing.js'
import { QuestionAndReplies } from '../Components/QuestionAndReplies.js'
import { QuestionBoard } from '../Components/QuestionBoard.js'
import { QuestionTypes } from '../Components/QuestionTypes.js'
import { Settings } from '../Components/Settings.js'
import { Unauthorized } from '../Components/Unauthorized.js'
import { Users } from '../Components/Users.js'

// @START-File
const Routes = [
    {
        path: '403',
        type: 'system',
        hide: true,
        go(param) {
            Unauthorized(param);
        }
    },
    {
        path: '404',
        type: 'system',
        hide: true,
        go(param) {
            Missing(param);
        }
    },
    {
        path: 'Developer',
        type: 'system',
        roles: [
            'Developer'
        ],
        icon: 'code-slash',
        go(param) {
            Developer(param);
        }
    },
    {
        path: 'Help',
        type: 'system',
        icon: 'info-circle',
        go(param) {
            Help(param);
        }
    },
    {
        path: 'Questions',
        type: 'system',
        icon: 'chat-right-text',
        go(param) {
            const {
                parent,
                pathParts
            } = param;

            if (pathParts.length === 1) {
                QuestionTypes(param);
            } else if (pathParts.length === 2) {
                QuestionBoard({
                    parent,
                    path: pathParts[1]
                });
            } else if (pathParts.length === 3) {
                QuestionAndReplies({
                    parent,
                    path: pathParts[1],
                    itemId: parseInt(pathParts[2])
                });
            }
        }
    },
    {
        path: 'Settings',
        type: 'system',
        icon: 'bs-gear',
        go(param) {
            Settings(param);
        }
    },
    {
        path: 'Users',
        type: 'system',
        roles: [
            'Developer',
            'Administrator'
        ],
        icon: 'people',
        go(param) {
            const {
                parent,
                pathParts
            } = param;

            if (pathParts.length === 1) {
                Users(param);
            } else if (pathParts.length === 2) {
                Users({
                    itemId: parseInt(pathParts[1]),
                    parent
                });
            }
        }
    }
];

export { Routes }
// @END-File
