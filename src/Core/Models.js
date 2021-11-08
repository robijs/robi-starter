import Store from './Store.js'
import { Get } from './Actions.js'

/**
 * @param {*} param 
 * @returns 
 */
export function Lists() {
    return [
        {
            list: 'Settings',
            fields: [
                {
                    name: "Key",
                    type: 'slot'
                },
                {
                    name: "Value",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'Comments',
            fields: [
                {
                    name: "FK_ParentId",
                    type: 'number'
                },
                {
                    name: "Comment",
                    type: 'mlot'
                },
                {
                    name: "SubmitedBy",
                    type: 'slot'
                },
                {
                    name: "LoginName",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Errors',
            fields: [
                {
                    name: "SessionId",
                    type: 'slot'
                },
                {
                    name: "Message",
                    type: 'mlot'
                },
                {
                    name: "Error",
                    type: 'mlot'
                },
                {
                    name: "Source",
                    type: 'mlot'
                },
                {
                    name: "UserAgent",
                    type: 'mlot'
                },
                {
                    name: "Status",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Log',
            fields: [
                {
                    name: "SessionId",
                    type: 'slot'
                },
                {
                    name: "Message",
                    type: 'mlot'
                },
                {
                    name: "StackTrace",
                    type: 'mlot'
                },
                {
                    name: "Module",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'ReleaseNotes',
            fields: [
                {
                    name: "Summary",
                    type: 'slot'
                },
                {
                    name: "Description",
                    type: 'mlot'
                },
                {
                    name: "Status",
                    type: 'slot'
                },
                {
                    name: "MajorVersion",
                    type: 'slot'
                },
                {
                    name: "MinorVersion",
                    type: 'slot'
                },
                {
                    name: "PatchVersion",
                    type: 'slot'
                },
                {
                    name: "ReleaseType",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Roles',
            fields: [
                {
                    name: "Role",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Questions',
            fields: [
                {
                    name: 'Body',
                    type: 'mlot'
                },
                {
                    name: 'ParentId',
                    type: 'number'
                },
                {
                    name: 'QuestionId',
                    type: 'number'
                },
                {
                    name: 'QuestionType',
                    type: 'slot'
                },
                {
                    name: 'Featured',
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Users',
            fields: [
                {
                    name: 'Title',
                    display: 'Name',
                    type: 'slot'
                },
                {
                    name: 'Email',
                    type: 'slot'
                },
                {
                    name: "LoginName",
                    display: 'Login Name',
                    type: 'slot'
                },
                {
                    name: "Role",
                    type: 'choice',
                    choices: [
                        'Administrator',
                        'Developer',
                        'User'
                    ]
                },
                {
                    name: "Settings",
                    type: 'mlot'
                }
            ]
        }
    ]
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function SiteUsage(param) {
    const {
        visits,
    } = param;

    /** Today */
    const itemsCreatedToday = visits.filter(createdToday);

    function createdToday(item) {
        const created = new Date(item.Created);
        created.setHours(0,0,0,0);
        
        const today = new Date();
        today.setHours(0,0,0,0);

        if (created.toDateString() == today.toDateString()) {
            return item;
        }
    }

    /** Week */
    const itemsCreatedThisWeek = visits.filter(createdThisWeek);

    function createdThisWeek(item) {
        const created = new Date(item.Created);
        created.setHours(0,0,0,0);
        
        // if (created >= monday) {
        if (created >= StartAndEndOfWeek().sunday) {
            return item;
        }
    }

    /** Month */
    const firstOfMonth = startOfMonth();

    function startOfMonth(date) {
        const now = date ? new Date(date) : new Date();
    
        now.setHours(0,0,0,0);
        now.setDate(1);

        return now;
    }

    const itemsCreatedThisMonth = visits.filter(createdThisMonth);

    function createdThisMonth(item) {
        const created = new Date(item.Created);
        created.setHours(0,0,0,0);
        
        if (created >= firstOfMonth) {
            return item;
        }
    }

    /** Year */
    const firstOfYear = startOfYear();

    function startOfYear(date) {
        const now = date ? new Date(date) : new Date();
    
        now.setHours(0,0,0,0);
        now.setDate(1);
        now.setMonth(0);

        return now;
    }

    const itemsCreatedThisYear = visits.filter(item => {
        const created = new Date(item.Created);
        created.setHours(0,0,0,0);

        if (created >= firstOfYear) {
            return item;
        }
    });

    /** Chart - Today */
    const today = [
        {
            label: 'Visits',
            data: []
        }
    ];

    for (let i = 0; i < 24 ; i++) {
        today[0].data.push(itemsCreatedToday.filter(byHour, i));
    }

    function byHour(item) {
        const created = new Date(item.Created);
        
        const hourBegin = new Date();
        hourBegin.setHours(this,0,0,0);

        const hourEnd = new Date();
        hourEnd.setHours(this + 1,0,0,0);

        // console.log(this);
        // console.log(created);
        // console.log(hourBegin);
        // console.log(hourEnd);
        // console.log('---');

        if (created >= hourBegin && created < hourEnd) {
            return item;
        } 
    }

    /** Chart - Week */
    const week = [
        {
            label: 'Visits',
            data: [
                itemsCreatedThisWeek.filter(byDayOfWeek, 0), /** Sunday */
                itemsCreatedThisWeek.filter(byDayOfWeek, 1),
                itemsCreatedThisWeek.filter(byDayOfWeek, 2),
                itemsCreatedThisWeek.filter(byDayOfWeek, 3),
                itemsCreatedThisWeek.filter(byDayOfWeek, 4),
                itemsCreatedThisWeek.filter(byDayOfWeek, 5),
                itemsCreatedThisWeek.filter(byDayOfWeek, 6) /** Saturday */
            ]
        }
    ];

    function byDayOfWeek(item) {
        const created = new Date(item.Created);
        created.setHours(0,0,0,0);
        
        const day = StartAndEndOfWeek().sunday;
        day.setDate(day.getDate() + this);
        day.setHours(0,0,0,0);

        if (created.toDateString() === day.toDateString()) {
            return item;
        } 
    }
    
    /** Chart - Month */
    const days = daysInMonth(new Date().getMonth() + 1); /** passed in month starts at 1 for Jan, not 0 */

    function daysInMonth(month) {
        const date = new Date();
        
        date.setMonth(month);
        date.setDate(0);
 
        return date.getDate();
    }

    const month = [
        {
            label: 'Visits',
            data: []
        }
    ];
    
    for (let i = 1; i <= days; i++) {
        month[0].data.push(itemsCreatedThisMonth.filter(byDate, i));
    }

    function byDate(item) {
        const created = new Date(item.Created);
        created.setHours(0,0,0,0);
        
        const day = new Date();
        day.setDate(this);
        day.setHours(0,0,0,0);

        if (created.toDateString() === day.toDateString()) {
            return item;
        } 
    }

    /** Chart - Year */
    const year = [
        {
            label: 'Visits',
            data: []
        }
    ];

    for (let i = 0; i <= 11; i++) {
        const date = new Date();
        const yyyy = date.getFullYear();
        
        const firstOfMonth = new Date(yyyy, i, 1);
        const lastOfMonth = new Date(yyyy, i + 1, 0);
        
        // console.log('Index:', i);
        // console.log('First:', firstOfMonth);
        // console.log('Last:', lastOfMonth);
        // console.log('------------------');
        
        year[0].data.push(visits.filter(createdThisMonth));

        function createdThisMonth(item) {
            const created = new Date(item.Created);
            created.setHours(0,0,0,0);
            
            if (created >= firstOfMonth && created <= lastOfMonth) {
                return item;
            }
        }
    }

    return {
        visits: {
            today: itemsCreatedToday,
            week: itemsCreatedThisWeek,
            month: itemsCreatedThisMonth,
            year: itemsCreatedThisYear,
        },
        chart: {
            today,
            week,
            month,
            year
        }
    }
}

/** 
 * @link https://stackoverflow.com/a/12793705
 *
 * Modified By
 * @author Stephen Matheis
 * @email stephen.a.matheis.ctr@mail.mil
 * @date 2020.11.16
 * 
 * - Replaced 'var' with 'const'
 * - Changed return value to @Object from @Array
 */

 export function StartAndEndOfWeek(date) {
    // set local variable
    const now = date ? new Date(date) : new Date();

    // set time to some convenient value
    now.setHours(0,0,0,0);

    // // Get Monday
    // const monday = new Date(now);
    // // monday.setDate(monday.getDate() - monday.getDay() + 1);
    // monday.setDate(monday.getDate() - (6 - monday.getDay()));

    // // Get Sunday
    // const sunday = new Date(now);
    // // sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    // sunday.setDate(sunday.getDate() + monday.getDay());

    // Get Sunday
    const sunday = new Date(now);
    // monday.setDate(monday.getDate() - monday.getDay() + 1);
    sunday.setDate(sunday.getDate() - sunday.getDay());

    // Get Sunday
    const saturday = new Date(now);
    // sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    saturday.setDate(saturday.getDate() + (6 + saturday.getDay()));

    // Return object of date objects
    return {
        sunday,
        saturday
    };
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Question(param) {
    const {
        question,
        replies
    } = param;

    question.replies = replies || [];

    question.addReply = (reply) => {
        question.replies.push(reply);
    }
    
    return question;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function Questions(param) {
    const {
        filter
    } = param;

    /** Get Questions */
    const messages = await Get({
        list: 'Questions',
        filter,
        select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
        orderby: 'Id desc',
        expand: `Author/Id,Editor/Id`
    });

    /** Questions */
    const questions = messages.filter(question => question.ParentId === 0);

    /** Replies */
    const replies = messages.filter(question => question.ParentId !== 0);

    /** Model */
    const Model_Questions = questions.map(question => {
        // question.replies = replies.filter(reply => reply.QuestionId === question.Id);

        // return question;

        return Question({
            question,
            replies: replies.filter(reply => reply.QuestionId === question.Id)
        });
    });

    Store.add({
        type: 'model',
        name: 'Model_Questions',
        model: Model_Questions
    });
    
    return Model_Questions;
}
