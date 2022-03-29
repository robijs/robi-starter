import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function RecurrenceMenu(param) {
    const {
        classes,
        parent,
        position
    } = param;

    let value = param.value || {};

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
                            <input class='form-control ml-3' id='start-date' type='date'>
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
                    // Set pattern
                    if (value.pattern !== this.id) {
                        value.pattern = this.id;
                        value.value = {};
                    }

                    // Add menu
                    menus[this.id]();

                    console.log(value);
                }
            },
            {
                selector: '#id .range-container .radio-label',
                event: 'click',
                listener(event) {
                    component.find(`.range-container #${this.dataset.for}`).click();
                }
            },
            {
                selector: '#id #end-by',
                event: 'change',
                listener(event) {
                    if (event.target.checked) {
                        value.end = {
                            option: 'End by d'
                        }

                        component.find('#end-after-value').value = '';
                    }
                }
            },
            {
                selector: '#id #end-after',
                event: 'change',
                listener(event) {
                    if (event.target.checked) {
                        value.end = {
                            option: 'End after n occurrences'
                        }

                        component.find('#end-by-date').value = '';
                    }
                }
            },
            {
                selector: '#id #no-end-date',
                event: 'change',
                listener(event) {
                    if (event.target.checked) {
                        value.end = {
                            option: 'No end date'
                        }

                        component.find('#end-by-date').value = '';
                        component.find('#end-after-value').value = '';
                    }
                }
            },
            {
                selector: '#id #end-after-value',
                event: 'change',
                listener(event) {
                    if (event.target.value) {
                        value.end.n = parseInt(event.target.value);
                    } else {
                        delete value.end.n;
                    }
                }
            },
            {
                selector: '#id #end-by-date',
                event: 'change',
                listener(event) {
                    if (event.target.value) {
                        const endDate = new Date(event.target.value.replace(/-/g, '\/')).toLocaleDateString();
                        value.end.d = endDate;
                    } else {
                        delete value.end.d;
                    }
                }
            },
            {
                selector: '#id #start-date',
                event: 'change',
                listener(event) {
                    if (event.target.value) {
                        const startDate = new Date(event.target.value.replace(/-/g, '\/')).toLocaleDateString();
                        value.start = startDate;

                        console.log(value);
                    }
                }
            }
        ],
        onAdd() {
            // Select pattern
            if (value.pattern) {
                // console.log(value);
                
                // Add menu
                menus[value.pattern]();

                // Check pattern radio button
                component.find(`#${value.pattern}.pattern-radio`).checked = true;
            } else {
                value = {
                    pattern: 'Daily',
                    value: {}
                }

                // Add menu
                menus.Daily();

                // Default: Daily
                component.find('#Daily.pattern-radio').checked = true;
            }


            // Set start date
            if (!value.start) {
                value.start = new Date().toLocaleDateString();
            }
            
            component.find('#start-date').value = new Date(value.start).toISOString().split('T')[0];

            // Set end date
            if (value.end) {
                const { option } = value.end;

                // #1
                // option: 'No end date',
                if (option === 'No end date') {
                    component.find('#no-end-date').checked = true;
                }

                // #2
                // option: 'End by d',
                // d: '3/1/2023',
                else if (option === 'End by d') {
                    component.find('#end-by').checked = true;
                    component.find('#end-by-date').value = new Date(value.end.d).toISOString().split('T')[0];
                }
                
                // #3
                // option: 'End after n occurrences',
                // n: 900
                else if (option === 'End after n occurrences') {
                    component.find('#end-after').checked = true;
                    component.find('#end-after-value').value = parseInt(value.end.n);
                }
            } else {
                component.find('#no-end-date').checked = true;

                value.end = {
                    option: 'No end date'
                }
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

    const menus = {
        /**
         * @example
         * value = {
         *   pattern: 'Daily',
         *   value: {
         *       option: 'Every n day(s)',
         *       n: 36
         *   }
         * }
         */
        Daily() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='days' name='daily' class='custom-control-input' ${setOption('days')}>
                            <label class='custom-control-label' for='days'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='days'>
                            <div>Every</div>
                            <input type='number' class='form-control ml-3 mr-3' id='days-value' style='width: 75px;' value='${setDays()}'>
                            <div>day(s)</div>
                        </div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='weekday' name='daily' class='custom-control-input' ${setOption('weekday')}>
                            <label class='custom-control-label' for='weekday'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='radio-label' data-for='weekday'>Every weekday</div>
                    </div>
                </div>
            `;

            // Set default value

            if (isEmpty(value.value)) {
                value.value = {
                    option: 'Every n day(s)',
                    n: 1
                }

                console.log(value);
            }

            function setOption(option) {
                if (option === 'days' && value.value?.option === 'Every n day(s)') {
                    return 'checked';
                } else if (option === 'weekday' && value.value?.option === 'Every weekday') {
                    return 'checked';
                } else if (option === 'days') {
                    return 'checked'
                }
            }

            function setDays() {
                if (value.value?.option === 'Every n day(s)') {
                    return value.value.n;
                } else if (value.value?.option !== 'Every weekday') {
                    return 1
                }
            }

            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function(event) {
                    component.find(`.pattern-menu #${this.dataset.for}`).click();
                });
            });

            // Set value.option
            component.findAll(`.pattern-menu input[type='radio']`).forEach(radio => {
                radio.addEventListener('change', event => {
                    if (event.target.checked) {
                        console.log(radio);

                        const id = radio.id;

                        // Set value.option to 'Every n day(s)'
                        if (id === 'days') {
                            const option = 'Every n day(s)';

                            value.value = {
                                option
                            }
                        }

                        // Set value.option to 'Every weekday'
                        else if (id === 'weekday') {
                            const option = 'Every weekday';

                            value.value = {
                                option
                            }
                        }

                        console.log(value);
                    }
                });
            });

            // Set value.n
            component.find(`.pattern-menu input[type='number']`).addEventListener('change', event => {
                const n = event.target.value;

                if (value.value) {
                    value.value.n = n;
                } else {
                    value.value = {
                        n
                    }
                }

                console.log(value);
            });
        },
        /**
         * @example
         * value = {
         *     pattern: 'Weekly',
         *     value: {
         *         weeks: 6,
         *         days: [
         *             'Saturday',
         *         ]
         *     }
         * }
         */
        Weekly() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div>Recur every</div>
                        <input type='number' class='form-control ml-3 mr-3' id='weeks-value' style='width: 75px;' value='${setWeeks()}'>
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

            // Set default value
            if (isEmpty(value.value)) {
                value.value = {
                    weeks: 1,
                    days: []
                }

                console.log(value);
            }

            function setWeeks() {
                return value.value?.weeks || 1;
            }

            // TODO: select if value present
            function dayTemplate(day) {
                return /*html*/ `
                    <div class='custom-control custom-checkbox' style='width: 100px; height: 30px;'>
                        <input type='checkbox' class='custom-control-input weeks-day' id='${day}' ${setOption(day)}>
                        <label class='custom-control-label' for='${day}'>${day}</label>
                    </div>
                `;
            }

            function setOption(day) {
                if (value.value?.days?.includes(day)) {
                    return 'checked';
                } else {
                    return '';
                }
            }

            // Set value.weeks
            component.find('.pattern-menu #weeks-value').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.weeks = parseInt(event.target.value);
                }

                console.log(value);
            });

            // Set value.days
            component.findAll('.pattern-menu .weeks-day').forEach(checkbox => {
                checkbox.addEventListener('change', event => {
                    value.value.days = [...component.findAll(`.pattern-menu .weeks-day:checked`)].map(node => node.id);
                });
            });
        },
        /**
         * @example
         * value = {
         *     pattern: 'Monthly',
         *     value: {
         *         option: 'Day n of every m month(s)',
         *         n: 10,
         *         m: 3
         *     }
         * }
         * 
         * @example
         * value = {
         *     pattern: 'Monthly',
         *     value: {
         *         option: 'The i d of every m month(s)',
         *         i: 'fourth',
         *         d: 'weekday',
         *         m: 1
         *     }
         * }
         * 
         */
        Monthly() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='day' name='monthly' class='custom-control-input' ${setRadio('day')}>
                            <label class='custom-control-label' for='day'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='day'>
                            <div>Day</div>
                            <input type='number' class='form-control ml-3 mr-3' id='day-value' style='width: 75px;' value=${setDay()}>
                            <div>of every</div>
                            <input type='number' class='form-control ml-3 mr-3' id='month-value' style='width: 75px;' value=${setMonth()}>
                            <div>month(s)</div>
                        </div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='the' name='monthly' class='custom-control-input' ${setRadio('the')}>
                            <label class='custom-control-label' for='the'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='the'>
                            <div>The</div>
                            <select class='form-control ml-3' id='the-interval' style='width: fit-content;'>
                                <option value='first' ${setI('first')}>first</option>
                                <option value='second' ${setI('second')}>second</option>
                                <option value='third' ${setI('third')}>third</option>
                                <option value='fourth' ${setI('fourth')}>fourth</option>
                                <option value='last' ${setI('last')}>last</option>
                            </select>
                            <select class='form-control ml-3 mr-3' id='the-day' style='width: fit-content;'>
                                <option value='day' ${setD('day')}>day</option>
                                <option value='weekday' ${setD('weekday')}>weekday</option>
                                <option value='weekend day' ${setD('weekend day')}>weekend day</option>
                                <option value='Monday' ${setD('Monady')}>Monday</option>
                                <option value='Tuesday' ${setD('Tuesday')}>Tuesday</option>
                                <option value='Wednesday' ${setD('Wednesday')}>Wednesday</option>
                                <option value='Thursday' ${setD('Thursday')}>Thursday</option>
                                <option value='Friday' ${setD('Friday')}>Friday</option>
                                <option value='Saturday' ${setD('Saturday')}>Saturday</option>
                                <option value='Sunday' ${setD('Sunday')}>Sunday</option>
                            </select>
                            <div>of every</div>
                            <input type='number' class='form-control ml-3 mr-3' id='the-month' style='width: 75px;' value=${setMonth()}>
                            <div>month(s)</div>
                        </div>
                    </div>
                </div>
            `;

            // Set default value
            if (isEmpty(value.value)) {
                value.value = {
                    option: 'Day n of every m month(s)'
                }

                console.log(value);
            }

            // Set which option is checked
            function setRadio(option) {
                if (option === 'day' && value.value.option === 'Day n of every m month(s)') {
                    return 'checked';
                } else if (option === 'the' && value.value.option === 'The i d of every m month(s)') {
                    return 'checked';
                } else if (option === 'day') {
                    return 'checked';
                }
            }

            function setDay() {
                return value.value?.n || '';
            }

            function setMonth() {
                return value.value?.m || '';
            }

            function setI(option) {
                return value.value?.i === option ? 'selected' : ''
            }

            function setD(option) {
                return value.value?.d === option ? 'selected' : ''
            }

            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function() {
                    component.find(`.pattern-menu #${this.dataset.for}`).click();
                });
            });

            // Set value.option
            component.findAll(`.pattern-menu input[type='radio']`).forEach(radio => {
                radio.addEventListener('change', event => {
                    if (event.target.checked) {
                        const id = radio.id;

                        // Set value.option to ''Day n of every m month(s)'
                        if (id === 'day') {
                            value.value = {
                                option: 'Day n of every m month(s)'
                            }

                            // Empty fields
                            component.find('.pattern-menu #the-interval').value = 'first';
                            component.find('.pattern-menu #the-day').value = 'day';
                            component.find('.pattern-menu #the-month').value = new Date().getDate();
                        }

                        // Set value.option to 'The i d of every m month(s)'
                        else if (id === 'the') {
                            value.value = {
                                option: 'The i d of every m month(s)',
                                i: 'first',
                                d: 'day'
                            }

                            // Empty fields
                            component.find('.pattern-menu #day-value').value = '';
                            component.find('.pattern-menu #month-value').value = '';
                        }

                        console.log(value);
                    }
                });
            });

            // Set value.value.n
            component.find('.pattern-menu #day-value').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.n = parseInt(event.target.value);
                }

                console.log(value);
            });

            // Set value.value.m
            component.find('.pattern-menu #month-value').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.m = parseInt(event.target.value);
                }

                console.log(value);
            });

            // Set value.value.i
            component.find('.pattern-menu #the-interval').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.i = event.target.value;
                }

                console.log(value);
            });

            // Set value.value.d
            component.find('.pattern-menu #the-day').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.d = event.target.value;
                }

                console.log(value);
            });

            // Set value.value.m
            component.find('.pattern-menu #the-month').addEventListener('change', event => {
                if (event.target.value) {
                    value.value.m = parseInt(event.target.value);
                }

                console.log(value);
            });
        },
        /**
         * @example
         * let recurrence = {
         *     pattern: 'Quarterly',
         *     value: {
         *         type: 'Calendar Year',
         *         quarters: [
         *             'First',
         *             'Fourth'
         *         ]
         *     }
         * }
         */
        Quarterly() {
            /*
                Calendar Year
                -------------
                Q1 1st Quarter: January 1st – March 31st
                Q2 2nd Quarter: April 1st – June 30th
                Q3 3rd Quarter: July 1st – September 30th
                Q4 4th Quarter: October 1st – December 31st

                Fiscal Year
                -----------
                Q1 1st quarter: October 1st – December 31st
                Q2 2nd quarter: January 1st – March 31st
                Q3 3rd quarter: April 1st – June 30th
                Q4 4th quarter: July 1st – September 30th
            */
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div>Recur every</div>
                        <select class='form-control ml-3 mr-3 type' id='' style='width: fit-content;'>
                            <option value='Calendar Year'>Calendar Year</option>
                            <option value='Fiscal Year'>Fiscal Year</option>
                        </select>
                        <div> on the:</div>
                    </div>
                    <!-- Row 2 -->
                    <div class='mb-2 options'>
                        ${
                            [
                                'First',
                                'Second',
                                'Third',
                                'Fourth'
                            ]
                            .map(quarter => quarterTemplate(quarter, value.value?.type || 'Calendar Year'))
                            .join('\n')
                        }
                    </div>
                    <div class='d-flex align-items-center'>
                        quarter(s)
                    </div>
                </div>
            `;

            // Set default value
            if (isEmpty(value.value)) {
                value.value = {
                    type: 'Calendar Year',
                    quarters: []
                }

                console.log(value);
            }

            // TODO: select if value present
            function quarterTemplate(quarter, type) {
                let label = '';

                if (type === 'Calendar Year') {
                    switch(quarter) {
                        case 'First':
                            label = 'January 1st'
                            break
                        case 'Second':
                            label = 'April 1st'
                            break
                        case 'Third':
                            label = 'July 1st'
                            break
                        case 'Fourth':
                            label = 'October 1st'
                            break
                    }
                } else if (type === 'Fiscal Year') {
                    switch(quarter) {
                        case 'First':
                            label = 'October 1st'
                            break
                        case 'Second':
                            label = 'January 1st'
                            break
                        case 'Third':
                            label = 'April 1st'
                            break
                        case 'Fourth':
                            label = 'July 1st'
                            break
                    }
                }

                return /*html*/ `
                    <div class='custom-control custom-checkbox' style='height: 30px;'>
                        <input type='checkbox' class='custom-control-input quarter' id='${quarter}' ${setQtr(quarter)}>
                        <label class='custom-control-label' for='${quarter}' style=''>
                            <span style='display: inline-block; width: 70px;'>${quarter}</span> 
                            <span class='text-muted' style=''>${label}</span>
                        </label>
                    </div>
                `;
            }

            function setQtr(qtr) {
                return value.value?.quarters?.includes(qtr) ? 'checked' : '';
            }

            // Change options labels
            component.find('.pattern-menu .type').on('change', event => {
                component.find('.pattern-menu .options').innerHTML = [
                    'First',
                    'Second',
                    'Third',
                    'Fourth'
                ]
                .map(quarter => quarterTemplate(quarter, event.target.value))
                .join('\n');

                addQtr();
            });

            addQtr();

            function addQtr() {
                // Add qtr to value.value.quarters
                component.findAll('.pattern-menu .quarter').forEach(checkbox => {
                    checkbox.addEventListener('change', event => {
                        value.value.quarters = [...component.findAll(`.pattern-menu .quarter:checked`)].map(node => node.id);

                        console.log(value);
                    });
                });
            }
        },
        /**
         * @example
         * let recurrence = {
         *     pattern: 'Yearly',
         *     value: {
         *         years: 1,
         *         option: 'On m d',
         *         m: 'February',
         *         d: 15
         *     }
         * }
         * 
         * @example
         * let recurrence = {
         *     pattern: 'Yearly',
         *     value: {
         *         years: 1,
         *          option: 'On the i d of m',
         *          i: 'third',
         *          d: 'day',
         *          m: 'August'
         *     }
         * }
         */ 
        Yearly() {
            component.find('.pattern-menu').innerHTML = /*html*/ `
                <!-- Container -->
                <div>
                    <!-- Row 1 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <div>Recur every</div>
                        <input type='number' class='form-control ml-3 mr-3' id='year-value' style='width: 75px;' value='${setYears()}'>
                        <div>year(s)</div>
                    </div>
                    <!-- Row 2 -->
                    <div class='d-flex align-items-center mb-2' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='yearly-day' name='yearly' class='custom-control-input' ${setRadio('yearly-day')}>
                            <label class='custom-control-label' for='yearly-day'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='yearly-day'>
                            <div>On:</div>
                            <select class='form-control ml-3 mr-3' id='yearly-day-month' style='width: fit-content;'>
                                ${months.map(m => monthTemplate(m)).join('\n')}
                            </select>
                            <select class='form-control' id='yearly-date' style='width: fit-content;'>
                                ${[...Array(31).keys()].map(m => dayTemplate(m)).join('\n')}
                            </select>
                        </div>
                    </div>
                    <!-- Row 3 -->
                    <div class='d-flex align-items-center' style='height: 35px;'>
                        <!-- Radio -->
                        <div class='custom-control custom-radio'>
                            <input type='radio' id='yearly-week' name='yearly' class='custom-control-input' ${setRadio('yearly-week')}>
                            <label class='custom-control-label' for='yearly-week'></label>
                        </div>
                        <!-- Inputs -->
                        <div class='d-flex align-items-center radio-label' data-for='yearly-week'>
                            <div>On the:</div>
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
                                <option value='Monday'>Monday</option>
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

            if (isEmpty(value.value)) {
                // Set month and day
                const month = months[new Date().getMonth()];
                const day = new Date().getDate();

                value.value = {
                    option: 'On m d',
                    month,
                    day
                }

                component.find('.pattern-menu #yearly-day-month').value = month;
                component.find('.pattern-menu #yearly-date').value = day;

                console.log(value);
            }

            function monthTemplate(month) {
                let selected = value.value?.m === month || month === months[new Date().getMonth()] ? 'selected' : '';

                return /*html*/ `
                    <option value='${month}' ${selected}>${month}</option>
                `;
            }

            function dayTemplate(day) {
                day = day + 1;

                return /*html*/ `
                    <option value='${day}' ${value.value?.d === day ? 'selected' : ''}>${day}</option>
                `;
            }

            function setYears() {
                return value.value?.years || 1;
            }

            // Set which option is checked
            function setRadio(option) {
                if (option === 'yearly-day' && value.value.option === 'On m d') {
                    return 'checked';
                } else if (option === 'yearly-week' && value.value.option === 'On the i d of m') {
                    return 'checked';
                } else if (option === 'yearly-day') {
                    return 'checked';
                }
            }

            // Click radio
            component.findAll('.pattern-menu .radio-label').forEach(label => {
                label.addEventListener('click', function() {
                    component.find(`.pattern-menu #${this.dataset.for}`).click();
                });
            });

            // Set value.option
            component.findAll(`.pattern-menu input[type='radio']`).forEach(radio => {
                radio.addEventListener('change', event => {
                    if (event.target.checked) {
                        const id = radio.id;
                        const month = months[new Date().getMonth()];
                        const day = new Date().getDate();

                        // Set value.option to 'On m d'
                        if (id === 'yearly-day') {
                            value.value = {
                                option: 'On m d',
                                month,
                                day
                            }

                            // Empty fields
                            component.find('.pattern-menu #yearly-week-interval').value = 'first';
                            component.find('.pattern-menu #yearly-week-day').value = 'day';
                            component.find('.pattern-menu #yearly-week-month').value = month;
                        }

                        // Set value.option to 'On the i d of m'
                        else if (id === 'yearly-week') {
                            value.value = {
                                option: 'On the i d of m',
                                i: 'first',
                                d: 'day',
                                m: month
                            }

                            // Empty fields
                            component.find('.pattern-menu #yearly-day-month').value = month;
                            component.find('.pattern-menu #yearly-date').value = day;
                        }

                        console.log(value);
                    }
                });
            });

            // Set value.value.years
            component.find('.pattern-menu #year-value').addEventListener('change', event => {
                value.value.years = parseInt(event.target.value);

                console.log(value);
            });

            // Set value.value.m #1
            component.find('.pattern-menu #yearly-day-month').addEventListener('change', event => {
                value.value.m = event.target.value;

                console.log(value);
            });

            // Set value.value.m #2
            component.find('.pattern-menu #yearly-week-month').addEventListener('change', event => {
                value.value.m = event.target.value;

                console.log(value);
            });

            // Set value.value.d #1
            component.find('.pattern-menu #yearly-date').addEventListener('change', event => {
                value.value.d = parseInt(event.target.value);

                console.log(value);
            });

            // Set value.value.d #1
            component.find('.pattern-menu #yearly-week-day').addEventListener('change', event => {
                value.value.d = event.target.value;

                console.log(value);
            });

            // Set value.value.i
            component.find('.pattern-menu #yearly-week-interval').addEventListener('change', event => {
                value.value.i = event.target.value;

                console.log(value);
            });
        },
        /**
         * @example
         * let recurrence = {
         *     pattern: 'Irregular',
         *     value: [
         *         {
         *             m: 'January',
         *             d: 3
         *         },
         *         {
         *             m: 'May',
         *             d: 9
         *         },
         *         {
         *             m: 'November',
         *             d: 21
         *         }
         *     ]
         * }
         */
        Irregular() {
            if (!Array.isArray(value.value)) {
                value.value = [];

                console.log(value);
            }
            
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
                const { m, d } = value.value.find(item => item.m === month) || {};

                return /*html*/ `
                    <div class='month-container d-flex align-items-center mb-2 justify-content-between mr-3' style='width: 150px;'>
                        <div class='custom-control custom-checkbox' style=''>
                            <input type='checkbox' class='custom-control-input month' id='${month}' ${m ? 'checked' : ''}>
                            <label class='custom-control-label' for='${month}'>${month}</label>
                        </div>
                        <select class='day radio-label form-control ml-3' style='width: fit-content;' data-for='${month}'>
                            ${[...Array(31).keys()].map(day => dayTemplate(day, d)).join('\n')}
                        </select>
                    </div>
                `;
            }

            function dayTemplate(day, d) {
                day = day + 1;

                return /*html*/ `
                    <option value='${day}' ${day === d ? 'selected' : ''}>${day}</option>
                `;
            }

            // Set value.value
            component.findAll('.pattern-menu .month').forEach(checkbox => {
                checkbox.addEventListener('change', event => {
                    value.value =  [...component.findAll(`.pattern-menu .month:checked`)].map(node => {
                        const d = node.closest('.month-container').querySelector('.day ').value;

                        return {
                            m: node.id,
                            d: parseInt(d)
                        }
                    });

                    console.log(value);
                });
            });
        }
    };

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    // TODO: Add validation
    component.value = () => {
        return value;
    }

    return component;
}
// @END-File
