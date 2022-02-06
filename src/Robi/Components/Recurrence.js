import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Recurrence(param) {
    const {
        classes,
        description,
        parent,
        position
    } = param;
    
    // // End Options
    // // #1
    // const end_1 = {
    //     option: 'End by d',
    //     value: {
    //         d: '2/1/2024'
    //     }
    // }

    // // #2
    // const end_2 = {
    //     option: 'End after n occurrences',
    //     value: {
    //         n: '10'
    //     }
    // }

    // // #3 - Default
    // const end_3 = {
    //     option: 'No end date'
    // }

    // Daily
    // #1
    let value = param.value.pattern || {
        pattern: 'Daily',
        start: '2/1/2022',
        end: {
            option: 'No end date'
        },
        value: {
            option: 'Every n day(s)',
            n: 3
        }
    }

    // // #2
    // const value = {
    //     pattern: 'Daily',
    //     start: '2/1/2022',
    //     end: {
    //         option: 'No end date'
    //     },
    //     value: {
    //         option: 'Every weekday',
    //     }
    // }

    // // Weekly
    // const value = {
    //     pattern: 'Weekly',
    //     start: '2/1/2022',
    //     end: {
    //         option: 'No end date'
    //     },
    //     value: {
    //         weeks: 2,
    //         value: [
    //             'Monday',
    //             'Wednesday',
    //             'Friday'
    //         ]
    //     }
    // }

    // // Monthly
    // // #1
    // const value = {
    //     pattern: 'Monthly',
    //     start: '2/1/2022',
    //     end: {
    //         option: 'No end date'
    //     },
    //     value: {
    //         option: 'Day n of every m month(s)',
    //         value: {
    //             n: 3,
    //             m: 2
    //         }
    //     }
    // }

    // // #2
    // const value = {
    //     pattern: 'Monthly',
    //     start: '2/1/2022',
    //     end: {
    //         option: 'No end date'
    //     },
    //     value: {
    //         option: 'The i d of every n month(s)',
    //         value: {
    //             i: 'second',
    //             d: 'Tuesday',
    //             n: 2
    //         }
    //     }
    // }

    // // Quarterly
    // // #1
    // const value = {
    //     pattern: 'Quarterly',
    //     start: '2/1/2022',
    //     end: {
    //         option: 'No end date'
    //     },
    //     value: {
    //         type: 'Calendar Year',
    //         value: [
    //             'First',
    //             'Third'
    //         ]
    //     }
    // }

    // // #2
    // const value = {
    //     pattern: 'Quarterly',
    //     start: '2/1/2022',
    //     end: {
    //         option: 'No end date'
    //     },
    //     value: {
    //         type: 'Fiscal Year',
    //         value: [
    //             'Second',
    //             'Fourth'
    //         ]
    //     }
    // }

    // // Yearly
    // // #1
    // const value = {
    //     pattern: 'Yearly',
    //     start: '2/1/2022',
    //     end: {
    //         option: 'No end date'
    //     },
    //     value: {
    //         years: 2,
    //         option: 'On m d',
    //         value: {
    //             m: 'February',
    //             d: '1'
    //         }
    //     }
    // }

    // // #2
    // const value = {
    //     pattern: 'Yearly',
    //     start: '2/1/2022',
    //     end: {
    //         option: 'No end date'
    //     },
    //     value: {
    //         years: 1,
    //         option: 'On the i d of m',
    //         value: {
    //             i: 'third',
    //             d: 'weekend day',
    //             m: 'August'
    //         }
    //     }
    // }

    // // Irregular
    // const value = {
    //     pattern: 'Irregular',
    //     value: {
    //         value: [
    //             {
    //                 month: 'January',
    //                 day: '3'
    //             },
    //             {
    //                 month: 'May',
    //                 day: '9'
    //             },
    //             {
    //                 month: 'November',
    //                 day: '21'
    //             }
    //         ]
    //     }
    // }

    const component = Component({
        html: /*html*/ `
            <div class='recurrence-menu ${classes ? classes.join(' ') : ''}'>
                <!-- Pattern and Range container -->
                <div class='d-flex flex-column'>
                    <!-- Label-->
                    <label class='font-weight-500'>Data Refresh Recurrence Pattern</label>
                    <!-- Pattern container -->
                    <div class='d-flex' style='min-height: 235px;'>
                        <!-- Pattern buttons -->
                        <div class='pattern-buttons' style='padding: 21px 16px;'>
                            ${
                                [
                                    'Daily',
                                    'Weekly',
                                    'Monthly',
                                    'Quarterly',
                                    'Yearly',
                                    'Irregular'
                                ]
                                .map(label => buttonTemplate(label))
                                .join('\n')
                            }
                        </div>
                        <!-- Divider -->
                        <div style='height: auto; width: 1px; margin: 21px 0px; background: var(--border-color);'></div>
                        <!-- Pattern menu -->
                        <div class='pattern-menu p-3'>
                            <!-- Inserted later -->
                        </div>
                    </div>
                    <!-- Label-->
                    <label class='font-weight-500'>Range of Recurrence</label>
                    <!-- Range container -->
                    <div class='range-container d-flex align-items-start'>
                        <!-- Start date -->
                        <div class='d-flex align-items-center mr-3'>
                            <div>Start:</div>
                            <input class='form-control ml-3' type='date'>
                        </div>
                        <!-- End date -->
                        <div>
                            <!-- End by -->
                            <div class='d-flex align-items-center mb-2'>
                                <div class='custom-control custom-radio'>
                                    <input type='radio' id='end-by' name='range-end' class='custom-control-input'>
                                    <label class='custom-control-label' for='end-by'></label>
                                </div>
                                <div class='d-flex align-items-center radio-label' data-for='end-by'>
                                    <div style='width: 79px;'>End by:</div>
                                    <input type='date' class='form-control ml-3' id='end-by-date'>
                                </div>
                            </div>
                            <!-- End after -->
                            <div class='d-flex align-items-center mb-2'>
                                <div class='custom-control custom-radio'>
                                    <input type='radio' id='end-after' name='range-end' class='custom-control-input'>
                                    <label class='custom-control-label' for='end-after'></label>
                                </div>
                                <div class='d-flex align-items-center radio-label' data-for='end-after'>
                                    <div style='width: 122px;'>End after:</div>
                                    <input type='number' class='form-control ml-3 mr-3' id='end-after-value' style='width: 75px;'>
                                    <div class='w-100'>occurrences</div>
                                </div>
                            </div>
                            <!-- No end date -->
                            <div class='d-flex align-items-center'>
                                <div class='custom-control custom-radio'>
                                    <input type='radio' id='no-end-date' name='range-end' class='custom-control-input'>
                                    <label class='custom-control-label' for='no-end-date'></label>
                                </div>
                                <div class='d-flex align-items-center radio-label' data-for='no-end-date' style='height: 33.5px;'>
                                    <div class='w-100' style='line-height: 0;'>No end date</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                max-width: 650px;
            }

            #id .font-weight-500 {
                font-weight: 500;
            }

            #id .form-control {
                padding: 2px 4px;
            }

            #id .custom-control-label {
                font-size: 13px;
                line-height: 1.8;
            }

            #id .pattern-menu,
            #id .range-container {
                font-size: 13px;
            }

            #id .pattern-buttons .custom-radio:not(:last-child) {
                margin-bottom: 8px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .pattern-radio',
                event: 'change',
                listener(event) {
                    // Add menu
                    menus[this.id]();

                    // Set pattern
                    value = {
                        pattern: this.id
                    }
                }
            },
            {
                selector: '#id .range-container .radio-label',
                event: 'click',
                listener(event) {
                    // Add menu
                    component.find(`.range-container #${this.dataset.for}`).click();
                }
            }
        ],
        onAdd() {
            if (value.pattern) {
                console.log(value);
                
                // Add menu
                menus[value.pattern]();

                // Check pattern radio button
                component.find(`#${value.pattern}.pattern-radio`).checked = true;
            } else {
                // Add menu
                menus.Daily();

                // Default: Daily
                component.find('#Daily.pattern-radio').checked = true;
            }
        }
    });

    function buttonTemplate(label) {
        return /*html*/ `
            <div class='custom-control custom-radio'>
                <input type='radio' id='${label}' name='pattern-radio' class='custom-control-input pattern-radio'>
                <label class='custom-control-label' for='${label}'>${label}</label>
            </div>
        `
    }

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    function days() {
        let days = '';

        for (let i = 1; i < 32; i++) {
            days += /*html*/ `
                <option value='${i}'>${i}</option>
            `;
        }

        return days;
    }

    const menus = {
        Daily() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='days' name='daily' class='custom-control-input'>
                            <label class='custom-control-label' for='days'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='days'>
                            <div>Every</div>
                            <input type='number' class='form-control ml-3 mr-3' id='days-value' style='width: 75px;'>
                            <div>day(s)</div>
                        </div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='weekday' name='daily' class='custom-control-input'>
                            <label class='custom-control-label' for='weekday'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='radio-label' data-for='weekday'>Every weekday</div>
                    </div>
                </div>
            `;

            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function(event) {
                    component.find(`.pattern-menu #${this.dataset.for}`).click();
                });
            });
        },
        Weekly() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div>Recur every</div>
                        <input type='number' class='form-control ml-3 mr-3' id='days-value' style='width: 75px;'>
                        <div>week(s) on:</div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex flex-wrap'>
                        <!-- Days -->
                        ${
                            [
                                'Sunday',
                                'Monday',
                                'Tuesday',
                                'Wednesday',
                                'Thursday',
                                'Friday',
                                'Saturday'
                            ]
                            .map(day => dayTemplate(day))
                            .join('\n')
                        }
                    </div>
                </div>
            `;

            // TODO: select if value present
            function dayTemplate(day) {
                return /*html*/ `
                    <div class='custom-control custom-checkbox' style='width: 100px; height: 30px;'>
                        <input type='checkbox' class='custom-control-input' id='${day}'>
                        <label class='custom-control-label' for='${day}'>${day}</label>
                    </div>
                `;
            }
        },
        Monthly() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='day' name='monthly' class='custom-control-input'>
                            <label class='custom-control-label' for='day'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='day'>
                            <div>Day</div>
                            <input type='number' class='form-control ml-3 mr-3' id='day-value' style='width: 75px;'>
                            <div>of every</div>
                            <input type='number' class='form-control ml-3 mr-3' id='month-value' style='width: 75px;'>
                            <div>month(s)</div>
                        </div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='the' name='monthly' class='custom-control-input'>
                            <label class='custom-control-label' for='the'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='the'>
                            <div>The</div>
                            <select class='form-control ml-3' id='the-interval' style='width: fit-content;'>
                                <option value='first'>first</option>
                                <option value='second'>second</option>
                                <option value='third'>third</option>
                                <option value='fourth'>fourth</option>
                                <option value='last'>last</option>
                            </select>
                            <select class='form-control ml-3 mr-3' id='the-day' style='width: fit-content;'>
                                <option value='day'>day</option>
                                <option value='weekday'>weekday</option>
                                <option value='weekend day'>weekend day</option>
                                <option value='Monady'>Monady</option>
                                <option value='Tuesday'>Tuesday</option>
                                <option value='Wednesday'>Wednesday</option>
                                <option value='Thursday'>Thursday</option>
                                <option value='Friday'>Friday</option>
                                <option value='Saturday'>Saturday</option>
                                <option value='Sunday'>Sunday</option>
                            </select>
                            <div>of every</div>
                            <input type='number' class='form-control ml-3 mr-3' id='the-month' style='width: 75px;'>
                            <div>month(s)</div>
                        </div>
                    </div>
                </div>
            `;

            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function() {
                    component.find(`.pattern-menu #${this.dataset.for}`).click();
                });
            });
        },
        Quarterly() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div>Recur every</div>
                        <select class='form-control ml-3 mr-3' id='' style='width: fit-content;'>
                            <option value='Calendar Year'>Calendar Year</option>
                            <option value='Fiscal Year'>Fiscal Year</option>
                        </select>
                        <div> on the:</div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex align-items-center mb-2'>
                        ${
                            [
                                'First',
                                'Second',
                                'Third',
                                'Fourth'
                            ]
                            .map(quarter => quarterTemplate(quarter))
                            .join('\n')
                        }
                    </div>
                    <div class='d-flex align-items-center'>
                        quarter(s)
                    </div>
                </div>
            `;

            // TODO: select if value present
            function quarterTemplate(quarter) {
                return /*html*/ `
                    <div class='custom-control custom-checkbox' style='width: 100px; height: 30px;'>
                        <input type='checkbox' class='custom-control-input' id='${quarter}'>
                        <label class='custom-control-label' for='${quarter}'>${quarter}</label>
                    </div>
                `;
            }
        },
        Yearly() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div>Recur every</div>
                        <input type='number' class='form-control ml-3 mr-3' id='year-value' style='width: 75px;'>
                        <div>year(s) on:</div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='yearly-day' name='yearly' class='custom-control-input'>
                            <label class='custom-control-label' for='yearly-day'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='yearly-day'>
                            <div>On:</div>
                            <select class='form-control ml-3 mr-3' id='yearly-day-month' style='width: fit-content;'>
                                ${months.map(m => monthTemplate(m)).join('\n')}
                            </select>
                            <select class='form-control' id='yearly-date' style='width: fit-content;'>
                                <option value='day'>1</option>
                            </select>
                        </div>
                    </div>
                    <!-- Row 3 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='yearly-week' name='yearly' class='custom-control-input'>
                            <label class='custom-control-label' for='yearly-week'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='yearly-week'>
                            <div>The</div>
                            <select class='form-control ml-3' id='yearly-week-interval' style='width: fit-content;'>
                                <option value='first'>first</option>
                                <option value='second'>second</option>
                                <option value='third'>third</option>
                                <option value='fourth'>fourth</option>
                                <option value='last'>last</option>
                            </select>
                            <select class='form-control ml-3 mr-3' id='yearly-week-day' style='width: fit-content;'>
                                <option value='day'>day</option>
                                <option value='weekday'>weekday</option>
                                <option value='weekend day'>weekend day</option>
                                <option value='Monady'>Monady</option>
                                <option value='Tuesday'>Tuesday</option>
                                <option value='Wednesday'>Wednesday</option>
                                <option value='Thursday'>Thursday</option>
                                <option value='Friday'>Friday</option>
                                <option value='Saturday'>Saturday</option>
                                <option value='Sunday'>Sunday</option>
                            </select>
                            <div>of</div>
                            <select class='form-control ml-3' id='yearly-week-month' style='width: fit-content;'>
                                ${months.map(m => monthTemplate(m)).join('\n')}
                            </select>
                        </div>
                    </div>
                </div>
            `;

            function monthTemplate(month) {
                return /*html*/ `
                    <option value='${month}'>${month}</option>
                `;
            }

            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function() {
                    component.find(`.pattern-menu #${this.dataset.for}`).click();
                });
            });
        },
        Irregular() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <div>Recur every:</div>
                    </div>
                    <div class='d-flex flex-wrap'>
                        ${months.map(m => monthTemplate(m)).join('\n')}
                    </div>
                </div>
            `;
            
            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function() {
                    component.find(`.pattern-menu #${this.dataset.for}`).checked = true;
                });
            });

            // TODO: select if value present
            function monthTemplate(month) {
                return /*html*/ `
                    <div class='d-flex align-items-center mb-2 justify-content-between mr-3' style='width: 150px;'>
                        <div class='custom-control custom-checkbox' style=''>
                            <input type='checkbox' class='custom-control-input' id='${month}'>
                            <label class='custom-control-label' for='${month}'>${month}</label>
                        </div>
                        <select class='radio-label form-control ml-3' style='width: fit-content;' data-for='${month}'>
                            ${days()}
                        </select>
                    </div>
                `;
            }
        }
    }

    component.value = () => {
        return value;
    }

    return component;
}
// @END-File
