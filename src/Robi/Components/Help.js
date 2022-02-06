import { Title } from './Title.js'
import { Container } from './Container.js'
import { RequestAssitanceInfo } from './RequestAssitanceInfo.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function Help(param) {
    const { parent } = param;

    const routeTitle = Title({
        title: `Help`,
        parent
    });

    routeTitle.add();

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px 0px 0px',
        parent
    });

    viewContainer.add();

    const requestAssistanceInfo = RequestAssitanceInfo({
        data: [
            {
                label: 'For help with this app, please contact:',
                name: 'First Last',
                title: 'TItle, Branch',
                email: 'first.last.civ@mail.mil',
                phone: '(555) 555-5555'
            }
        ],
        parent: viewContainer
    });

    requestAssistanceInfo.add();
}
// @END-File
