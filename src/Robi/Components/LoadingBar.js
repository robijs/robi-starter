import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function LoadingBar(param) {
    const {
        displayTitle, displayLogo, displayText, loadingBar, onReady, parent, totalCount
    } = param;

    const logoPath = App.isProd() ? '../Images' : `${App.get('site')}/src/Images`;

    const component = Component({
        html: /*html*/ `
            <div class='loading-bar'>
                <div class='loading-message'>
                    <!-- <div class='loading-message-logo'></div> -->
                    <!-- <img class='loading-message-logo' src='${logoPath}/${displayLogo}' /> -->
                    <div class='loading-message-title'>${displayTitle}</div>
                    <div class='loading-bar-container ${loadingBar || ''}'>
                        <div class='loading-bar-status'></div>
                    </div>
                    <div class='loading-message-text'>${displayText || ''}</div>
                </div>
            </div>
        `,
        style: /*css*/ `
            .loading-bar {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 50%;
                height: 100%;
                margin: auto;
                position: absolute;
                top: 0px; 
                left: 0; 
                bottom: 0;
                right: 0;
                animation: fadein 350ms ease-in-out forwards;
                transform: translateY(36px);
            }

            .loading-message {
                /* width: 90%; */
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .loading-message-title{
                font-family: 'M PLUS Rounded 1c', sans-serif; /* FIXME: experimental */
                font-size: 3em; /* original value 3em */
                font-weight: 700;
                text-align: center;
            }

            /** TURNED OFF */
            .loading-message-text {
                display: none;
                min-height: 36px;
                font-size: 1.5em;
                font-weight: 400;
                text-align: center;
            }

            .loading-bar-container {
                width: 90%; /** original value 15% */
                margin-top: 15px;
                background: var(--background);
                border-radius: 10px;
            }
            
            .loading-bar-status {
                width: 0%;
                height: 15px;
                background: var(--primary);
                border-radius: 10px;
                transition: width 100ms ease-in-out;
            }

            .hidden {
                opacity: 0;
            }

            /* Logo */
            #id .loading-message-logo {
                max-width: 193px;
            }

            @keyframes fadein {
                from {
                    opacity: 0;
                    transform: scale(0);
                }

                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .fadeout {
                animation: fadeout 350ms ease-in-out forwards;
            }

            @keyframes fadeout {
                from {
                    opacity: 1;
                    transform: scale(1);
                    
                }

                to {
                    opacity: 0;
                    transform: scale(0);
                }
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '.loading-bar',
                event: 'listItemsReturned',
                listener() {
                    component.update(++counter);
                }
            },
            {
                selector: '.loading-bar',
                event: 'animationend',
                listener: ready
            }
        ]
    });

    function ready(event) {
        if (onReady) {
            onReady(event);
        }

        component.get().removeEventListener('animationend', ready);
    }

    let counter = 1;

    component.update = (param = {}) => {
        const {
            newDisplayText
        } = param;

        const progressBar = component.get();
        const statusBar = progressBar.querySelector('.loading-bar-status');
        const text = progressBar.querySelector('.loading-message-text');
        const percentComplete = (counter / totalCount) * 100;

        if (newDisplayText) {
            text.innerText = newDisplayText;
        }

        if (statusBar) {
            statusBar.style.width = `${percentComplete}%`;
            counter++;
        }
    };

    component.end = () => {
        return new Promise((resolve, reject) => {
            const loadingBar = component.get();

            if (loadingBar) {
                loadingBar.classList.add('fadeout');

                loadingBar.addEventListener('animationend', (event) => {
                    loadingBar.remove();
                    resolve(true);
                });
            }
        });
    };

    component.showLoadingBar = () => {
        component.find('.loading-bar-container').classList.remove('hidden');
    };

    return component;
}
// @END-File
