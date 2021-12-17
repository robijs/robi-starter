import { Card } from './Card.js'
import { Container } from './Container.js'
import { Button } from './Button.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function DeveloperLinks(param) {
    const {
        parent,
    } = param;

    const lists = App.lists();

    addSection({
        title: 'SharePoint',
        buttons: [
            {
                value: 'Site Settings',
                url: `${App.get('site')}/_layouts/15/settings.aspx`
            },
            {
                value: `Site Contents`,
                url: `${App.get('site')}/_layouts/15/viewlsts.aspx`
            },
            {
                value: `Add an app`,
                url: `${App.get('site')}/_layouts/15/addanapp.aspx`
            }
        ]
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
        title: `Core Lists`,
        buttons: [
            {
                value: `Errors`,
                url: `${App.get('site')}/Lists/Errors`
            },
            {
                value: `Log`,
                url: `${App.get('site')}/Lists/Log`
            },
            {
                value: `Questions`,
                url: `${App.get('site')}/Lists/Questions`
            },
            {
                value: `Settings`,
                url: `${App.get('site')}/Lists/Settings`
            },
            {
                value: `Users`,
                url: `${App.get('site')}/Lists/Users`
            },
            {
                value: `Release Notes`,
                url: `${App.get('site')}/Lists/ReleaseNotes`
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

    function addSection(param) {
        const {
            title, buttons
        } = param;

        /** Pages */
        const card = Card({
            title,
            width: '100%',
            margin: '20px 0px 0px 0px',
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
                        window.open(`${url}Files`);
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
