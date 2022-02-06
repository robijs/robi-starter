import { Card } from './Card.js'
import { Container } from './Container.js'
import { Button } from './Button.js'
import { App } from '../Core/App.js'
import { Lists } from '../Models/Lists.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function DeveloperLinks(param) {
    const {
        parent,
    } = param;

    const lists = App.lists().sort((a, b) => a.list.localeCompare(b.list));

    addSection({
        title: '',
        buttons: [
            {
                value: `Add list`,
                url: `${App.get('site')}/_layouts/15/addanapp.aspx`
            },
            {
                value: `Contents`,
                url: `${App.get('site')}/_layouts/15/viewlsts.aspx`
            },
            {
                value: 'Permissions',
                url: `${App.get('site')}/_layouts/15/user.aspx`
            },
            {
                value: 'Settings',
                url: `${App.get('site')}/_layouts/15/settings.aspx`
            }
        ]
    });

    addSection({
        title: `Core Libraries`,
        buttons: [
            {
                value: `App`,
                url: `${App.get('site')}/App`
            },
            {
                value: `Documents`,
                url: `${App.get('site')}/Shared%20Documents`
            }
        ]
    });

    addSection({
        title: `Core Lists`,
        buttons: Lists()
        .sort((a, b) => a.list.localeCompare(b.list))
        .filter(item => item.template !== 101)
        .map(item => {
            const { list, options } = item;

            return {
                value: list,
                url: `${App.get('site')}/Lists/${list}`,
                files: options?.files
            };
        })
    });

    addSection({
        title: `App Libraries`,
        buttons: lists
        .filter(item => item.template === 101)
        .map(item => {
            const { list } = item;

            return {
                value: list,
                url: `${App.get('site')}/${list}`
            };
        })
    });

    addSection({
        title: `App Lists`,
        buttons: lists
        .filter(item => item.template !== 101)
        .map(item => {
            const { list, options } = item;

            return {
                value: list,
                url: `${App.get('site')}/Lists/${list}`,
                files: options?.files
            };
        })
    });

    function addSection(param) {
        const {
            title, buttons
        } = param;

        if (!buttons.length) {
            return;
        }

        /** Pages */
        const card = Card({
            title,
            width: '100%',
            margin: '0px 0px 20px 0px',
            parent
        });

        card.add();

        buttons.forEach(button => {
            const {
                value, url, files
            } = button;


            if (files) {
                const buttonContainer = Container({
                    parent: card
                });

                buttonContainer.add();

                const settingsButton = Button({
                    type: 'normal',
                    value,
                    margin: '10px 0px 0px 0px',
                    parent: buttonContainer,
                    async action(event) {
                        window.open(url);
                    }
                });
    
                settingsButton.add();

                const filesButton = Button({
                    type: 'normal',
                    value: `${value}Files`,
                    margin: '10px 0px 0px 10px',
                    parent: buttonContainer,
                    async action(event) {
                        window.open(`${App.get('site')}/${value}Files`);
                    }
                });
    
                filesButton.add();
            } else {
                const settingsButton = Button({
                    type: 'normal',
                    value,
                    margin: '10px 0px 0px 0px',
                    parent: card,
                    async action(event) {
                        window.open(url);
                    }
                });
    
                settingsButton.add();
            }
        });
    }
}
// @END-File
