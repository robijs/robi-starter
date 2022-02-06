import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function QuestionsToolbar(param) {
    const {
        selected, parent, onFilter, onSearch, onClear, onAsk, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='btn-toolbar mb-3' role='toolbar'>
                <button type='button' class='btn ask-a-question'>Ask a question</button>
                <div class='ml-2 mr-2'>
                    <input class='form-control mr-sm-2 search-questions' type='search' placeholder='Search' aria-label='Search'>
                </div>    
                <div class='btn-group mr-2' role='group'>
                    ${buildFilters()}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: 20px 0px 0px 0px;
                align-items: center;
            }

            #id .btn:focus,
            #id .btn:active {
                box-shadow: none ;
            }

            #id .ask-a-question {
                background: var(--button-background);
                color: var(--primary);
                font-weight: 500;
            }
            
            #id .search-questions {
                background: var(--button-background) !important;
                border-color: transparent;
                border-radius: 8px;
                min-width: 250px;
                min-height: 35px;
            }

            #id .btn-robi-primary {
                color: white;
                background: var(--primary);
            }

            #id .btn-outline-robi-primary {
                color: var(--primary);
                background-color: initial;
                border-color: var(--primary);
            }

            /* #id .btn-outline-robi-primary:active {
                color: royalblue;
                background-color: initial;
                border-color: royalblue;
            } */
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .filter',
                event: 'click',
                listener(event) {
                    const isSelected = event.target.classList.contains('btn-outline-robi-primary');

                    /** Deselect all options */
                    component.findAll('.filter').forEach(button => {
                        button.classList.remove('btn-robi-primary');
                        button.classList.add('btn-outline-robi-primary');
                    });

                    if (isSelected) {
                        event.target.classList.remove('btn-outline-robi-primary');
                        event.target.classList.add('btn-robi-primary');
                    } else {
                        event.target.classList.remove('btn-robi-primary');
                        event.target.classList.add('btn-outline-robi-primary');
                    }

                    onFilter(event.target.innerText);
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    onSearch(event.target.value.toLowerCase());
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            },
            {
                selector: `#id .ask-a-question`,
                event: 'click',
                listener: onAsk
            }
        ]
    });

    function buildFilters() {
        const filterOptions = [
            'All',
            'Mine',
            'Unanswered',
            'Answered',
            'Featured'
        ];

        return filterOptions.map(option => {
            return /*html*/ `
                <button type='button' class='btn ${selected === option ? 'btn-robi-primary' : 'btn-outline-robi-primary'} filter'>${option}</button>
            `;
        }).join('\n');
    }

    return component;
}
// @END-File
