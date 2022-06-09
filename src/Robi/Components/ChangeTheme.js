import { App } from '../Core/App.js'
import { Button } from './Button.js'
import { LoadingSpinner } from './LoadingSpinner.js'
import { Modal } from './Modal.js'
import { Themes } from '../Models/Themes.js'
import { ThemeField } from './ThemeField.js'
import { Wait } from '../Actions/Wait.js'
import { Container } from './Container.js'
import { RemoveLocal, SetLocal } from '../Robi.js'
import { Alert } from './Alert.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export function ChangeTheme(param) {
    const { parent } = param;

    const card = Container({
        display: 'block',
        width: '100%',
        maxWidth: '995px',
        margin: '0px 0px 30px 0px',
        parent
    });

    card.add();

    // Theme
    const themeField = ThemeField({
        selected: App.get('theme'),
        margin: '0px 0px 30px 0px',
        label: false,
        parent: card
    });

    themeField.add();

    // Local Storage Button
    const updateThemeBtn = Button({
        type: 'robi',
        value: 'Change theme',
        classes: ['w-100'],
        parent: card,
        async action() {
            SetLocal(`theme`, themeField.value());

            location.reload();
        }
    });

    updateThemeBtn.add();

    // Local Storage Button
    const resetBtn = Button({
        type: '',
        value: 'Reset to default',
        classes: ['mt-2', 'w-100'],
        parent: card,
        async action() {
            RemoveLocal(`theme`);

            location.reload();
        }
    });

    resetBtn.add();

    if (App.isDev()) {
        card.append(/*html*/ `
            <h5 class='mt-4 mb-4'>
                For Developers
            </h5>
        `);

        // Alert
        const btnCtr = Alert({
            classes: ['mt-4', 'p-4'],
            type: 'robi-secondary',
            parent: card
        });

        btnCtr.add();

        // Set theme (modify app.js) Button
        const modifyAppBtn = Button({
            type: 'robi-reverse',
            value: 'Set theme',
            classes: ['w-100'],
            parent: btnCtr,
            async action() {
                const { primary } = Themes.find(theme => theme.name === themeField.value());

                const modal = Modal({
                    title: false,
                    disableBackdropClose: true,
                    scrollable: true,
                    shadow: true,
                    async addContent(modalBody) {
                        modal.find('.modal-content').style.width = 'unset';

                        const loading = LoadingSpinner({
                            message: `<span style='color: ${primary};'>Changing theme<span>`,
                            color: primary,
                            classes: ['p-4'],
                            parent: modalBody
                        });
            
                        loading.add();
                    },
                    centered: true,
                    showFooter: false,
                    position: 'afterend'
                });

                modal.add();

                // Blur entire app
                document.querySelector('#app').style.transition = 'filter 150ms';
                document.querySelector('#app').style.filter = 'blur(5px)';

                let digest;
                let request;

                if (App.isProd()) {
                    digest = await GetRequestDigest();
                    request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('app.js')/$value`, {
                        method: 'GET',
                        headers: {
                            'binaryStringRequestBody': 'true',
                            'Accept': 'application/json;odata=verbose;charset=utf-8',
                            'X-RequestDigest': digest
                        }
                    });
                } else {
                    request = await fetch(`http://127.0.0.1:8080/src/app.js`);
                    await Wait(1000);
                }

                let content = await request.text();
                
                // Update theme
                content = content.replace(/\/\* @START-theme \*\/([\s\S]*?)\/\* @END-theme \*\//, `/* @START-theme */'${themeField.value()}'/* @END-theme */`);

                let setFile;

                // SharePoint
                if (App.isProd()) {
                    // TODO: Make a copy of app.js first
                    // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                    setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
                        method: 'POST',
                        body: content, 
                        headers: {
                            'binaryStringRequestBody': 'true',
                            'Accept': 'application/json;odata=verbose;charset=utf-8',
                            'X-RequestDigest': digest
                        }
                    });

                    await Wait(5000);
                } 
                
                // Local Development
                else if (App.isDev()) {
                    setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                        method: 'POST',
                        body: content
                    });
                    await Wait(1000);
                }

                modal.close(() => {
                    location.reload();
                });
            }
        });

        modifyAppBtn.add();
    }
}
// @END-File
