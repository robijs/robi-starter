import { Get } from './Get.js'
import { CreateItem } from './CreateItem.js'
import { App } from '../Core/App.js'
import { Store } from '../Robi.js';

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

    // PROD
    if (App.isProd()) {
        const url = `${App.get('site')}/_api/web/CurrentUser`;
        const currentUser = await fetch(url, fetchOptions);
        const response = await currentUser.json();
        const email = response.d.Email;
        const appUser = await Get({
            list: list || 'Users',
            filter: `Email eq '${email}'`
        });

        let userItem;

        if (appUser && appUser[0]) {
            console.log(`User: ${appUser[0].Title}`);

            // Add SiteId prop to Users list item
            appUser[0].SiteId = response.d.Id;

            // Return Users list item
            userItem = appUser[0];
        } else {
            const {
                Title,
                Email,
                LoginName
            } = response.d;

            console.log(`%cMissing user account.`, 'color: red');
            console.log(`Creating user account for ${Title}....`);

            // Create new user
            try {
                userItem = await CreateItem({
                    list: 'Users',
                    data: {
                        Title,
                        Email,
                        LoginName: LoginName.split('|')[2],
                        Roles: {
                            results: [
                                'User'
                            ]
                        },
                        Settings: App.get('userSettings')
                    }
                });

                console.log(`%cUser account for ${Title} created!`, 'color: mediumseagreen');
            } catch (error) {
                console.log(`%cFailed to create a user account for ${Title}. Check POST data.`, 'background: firebrick; color: white');
            }
        }

        // Add SiteId prop to Users list item
        userItem.SiteId = response.d.Id;

        // Add methods
        userItem.hasAnyRole = () => {
            return App.get('roles').some(role => Store.user().Roles.results.includes(role));
        }

        userItem.hasRole = (role) => {
            return Store.user().Roles.results.includes(role);
        }

        return userItem;
    } 
    
    // DEV
    else if (App.isDev()) {
        const currentUser = await fetch(`http://localhost:3000/users?LoginName=${App.get('dev').user.LoginName}`, fetchOptions);
        const response = await currentUser.json();

        const {
            Title,
            Email,
            LoginName,
            Roles,
            SiteId,
            Settings
        } = App.get('dev').user;

        let userItem;

        if (response[0]) {
            console.log(`User: ${response[0].Title}`);
            userItem = response[0];
        } else {
            console.log(`%cMissing user account.`, 'color: red');
            console.log(`Creating user account for ${Title}....`);

            // Create new user
            try {
                userItem = await CreateItem({
                    list: 'Users',
                    data: {
                        Title,
                        Email,
                        LoginName,
                        Roles,
                        SiteId,
                        Settings: Settings || App.get('userSettings')
                    }
                });

                console.log(`%cCreated user account for ${Title}!`, 'color: mediumseagreen');
            } catch (error) {
                console.log(`%cFailed to create a user account for ${Title}. Check POST data.`, 'color: firebrick');
            }
        }

        // Add method
        userItem.hasAnyRole = () => {
            return App.get('roles').some(role => Store.user().Roles.results.includes(role));
        }

        userItem.hasRole = (role) => {
            return Store.user().Roles.results.includes(role);
        }

        return userItem;
    }
}
// @END-File
