import { Get } from './Get.js'
import { CreateItem } from './CreateItem.js'
import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetCurrentUser(param) {
    const {
        list
    } = param;

    const fetchOptions = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        }
    };

    if (App.get('mode') === 'prod') {
        const url = `${App.get('site')}/../_api/web/CurrentUser`;
        const currentUser = await fetch(url, fetchOptions);
        const response = await currentUser.json();
        const email = response.d.Email;
        const appUser = await Get({
            list: list || 'Users',
            // TODO: Replace with call to Model().Lists() map => internal field names + Id field
            // select: fields.map(field => field.name),
            filter: `Email eq '${email}'`
        });

        if (appUser && appUser[0]) {
            console.log(`%cUser: ${appUser[0].Title}.`, 'background: seagreen; color: white');

            // Add SiteId prop to Users list item
            appUser[0].SiteId = response.d.Id;

            // Return Users list item
            return appUser[0];
        } else {
            console.log(response.d);

            const {
                Title,
                Email,
                LoginName
            } = response.d;

            console.log(`%cMissing user account.`, 'color: red');
            console.log(`Creating user account for ${Title}....`);

            /** Create user */
            const newUser = await CreateItem({
                list: 'Users',
                data: {
                    Title,
                    Email,
                    LoginName: LoginName.split('|')[2],
                    Role: App.get('userDefaultRole') /** Default, can be changed later */,
                    Settings: App.get('userSettings')
                }
            });

            if (newUser) {
                console.log(`%cUser account for ${Title} created!`, 'color: mediumseagreen');
            } else {
                console.log(`%cFailed to create a user account for ${Title}. Check POST data.`, 'background: firebrick; color: white');
            }

            return newUser;
        }
    } else if (App.get('mode') === 'dev') {
        const currentUser = await fetch(`http://localhost:3000/users?LoginName=${App.get('dev').user.LoginName}`, fetchOptions);
        const response = await currentUser.json();

        const {
            Title,
            Email,
            LoginName,
            Role,
            SiteId,
            Settings
        } = App.get('dev').user;

        if (response[0]) {
            console.log(`%cFound user account for '${response[0].Title}'.`, 'color: mediumseagreen');
            return response[0];
        } else {
            console.log(`%cMissing user account.`, 'color: red');
            console.log(`Creating user account for ${Title}....`);

            /** Create user */
            const newUser = await CreateItem({
                list: 'Users',
                data: {
                    Title,
                    Email,
                    LoginName,
                    Role,
                    SiteId,
                    Settings: Settings || App.get('userSettings')
                }
            });

            if (newUser) {
                console.log(`%cCreated user account for ${Title}!`, 'color: mediumseagreen');
                return newUser;
            } else {
                console.log(`%cFailed to create a user account for ${Title}. Check POST data.`, 'color: firebrick');
            }
        }
    }
}
// @END-File
