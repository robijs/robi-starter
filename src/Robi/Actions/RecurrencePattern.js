// @START-File
export function RecurrencePattern({ recurrence, month }) {
    // Months
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

    // Recurrence pattern formulas
    // TODO: Change first occurence to last file uploaded date
    // TODO: At least return the next occurence, if there is one
    const formulas = {
        Daily({ start, end, value, month }) {
            const { option } = value;
            const { first, last } = getDays(month);
            const startDate = new Date(start);
            const limit = setLimit(end);

            let occurrences = []; 
            let nextDate = new Date(startDate); // Increment from start date

            console.log('Start Date:', startDate);
            console.log('First:', first);
            console.log('Last:', last);
            console.log('Limit:', limit);

            // Option: Every n day(s)
            if (option === 'Every n day(s)') {
                const { n } = value;

                // #1 - Check if limit is set first
                if (limit) {
                    // TODO: Reduce # of passes (maybe take limit and / days of week or month?)
                    for (let i = 0; i < limit; i++) {
                        if (nextDate >= first && nextDate <= last) {
                            occurrences.push(new Date(nextDate))
                        }

                        nextDate.setDate(nextDate.getDate() + n);
                        // console.log(nextDate);
                    }
                }

                // #2 - Then use end date
                else {
                    const { d } = end;
                    const endDate = d ? new Date(d) : last;

                    console.log('End Date:', endDate);

                    while (nextDate <= endDate) {
                        if (nextDate >= first && nextDate <= last) {
                            occurrences.push(new Date(nextDate))
                        }

                        nextDate.setDate(nextDate.getDate() + n);
                        // console.log(nextDate);
                    }
                }
            }

            // Option: Every weekday
            else if (option === 'Every weekday') {
                // #1 - Check if limit is set first
                if (limit) {
                    let counter = 0;

                    while (counter < limit) {
                        const day = nextDate.getDay();

                        if (nextDate > last) {
                            break;
                        }

                        // Sun - Sat > 0 - 6 | Mon - Fri > 1 - 5
                        if (day >= 1 && day <= 5) {
                            if (nextDate >= first && nextDate <= last) {
                                occurrences.push(new Date(nextDate));
                            }

                            counter++;
                        }
                        
                        nextDate.setDate(nextDate.getDate() + 1);
                    }
                }

                // #2 - End date set
                else {
                    const { d } = end;
                    const endDate = d ? new Date(d) : last;

                    console.log('End Date:', endDate);

                    while (nextDate <= endDate) {
                        const day = nextDate.getDay();

                        // Sun - Sat > 0 - 6 | Mon - Fri > 1 - 5
                        if (day >= 1 && day <= 5) {
                            if (nextDate >= first && nextDate <= last) {
                                occurrences.push(new Date(nextDate));
                            }
                        }

                        nextDate.setDate(nextDate.getDate() + 1);
                    }
                }
            }

            // If n > 35, there's a chance no occurrences will be generated
            // Recurse month +1 if no occurrences
            if (!occurrences.length) {
                // Go forward 1 months
                const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
                console.log('NEXT MONTH:', nextMonth);

                if (!limit) {
                    const { d } = end;
                    const endMonth = d ? new Date(d) : last;
                    endMonth.setDate(nextMonth.getDate());
                    console.log('END MONTH:', new Date(endMonth));

                    if (endMonth >= nextMonth) {
                        occurrences = formulas.Daily({ start, end, value, month: nextMonth });
                    }
                } else {
                    occurrences = formulas.Daily({ start, end, value, month: nextMonth });
                }
            }

            console.log(occurrences);

            return occurrences;
        },
        Weekly({ start, end, value, month }) {
            const { weeks, days } = value;
            const { first, last } = getDays(month);
            const startDate = new Date(start);
            const limit = setLimit(end);
            const daysOfWeek = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
            const dayIndices = days.map(d => daysOfWeek.indexOf(d));

            let occurrences = [];
            let nextDate = new Date(startDate);
            let counter = 0;
            let startIndex;

            console.log('Start Date:', startDate);
            console.log('First:', first);
            console.log('Last:', last);
            console.log('Limit:', limit);
            console.log('Weeks:', weeks);
            console.log('Days:', days);
            console.log('Indices:', dayIndices);

            // First, get next day in days from defined start date
            // Ex: if start is a tuesday, but first day is the previous monday, 
            //     get the following tuesday (+ 6 days)
            if (nextDate.getDay() === daysOfWeek.indexOf(days[0])) {
                occurrences.push(new Date(nextDate));
                counter++
            } else {
                for (let i = 1; i <= 7; i++) {
                    nextDate.setDate(nextDate.getDate() + 1);

                    if (dayIndices.includes(nextDate.getDay())) {
                        startIndex = dayIndices.indexOf(nextDate.getDay()) + 1;
                        occurrences.push(new Date(nextDate));
                        counter++

                        break;
                    }
                }

                // Get rest of starting week
                console.log('Start Index:', startIndex);

                for (let i = startIndex; i < dayIndices.length; i++ ) {
                    nextDate.setDate( nextDate.getDate() + ( dayIndices[i] - nextDate.getDay() ) );
                    occurrences.push(new Date(nextDate));
                    counter++
                }

                // Jump to next week in pattern
                // 7 - next date's day of week = next saturday
                nextDate.setDate(nextDate.getDate() + ( ( 7 * weeks ) - nextDate.getDay() ) );

                console.log('Start of next week:', nextDate);
            }

            // #1 - Check if limit is set first
            if (limit) {
                while (counter < limit) {
                    // for each day in days, increment (day of week - last day of week)
                    for (let i = 0; i < days.length; i++) {
                        if (counter < limit) {
                            nextDate.setDate( nextDate.getDate() + ( dayIndices[i] - nextDate.getDay() ) );
                            
                            if (nextDate >= first && nextDate <= last) {
                                occurrences.push(new Date(nextDate))
                            } else {
                                counter = limit;
                                break;
                            }

                            counter++
                        }
                    }

                    // Jump to next week in pattern
                    // 7 - next date's day of week = next saturday
                    nextDate.setDate(nextDate.getDate() + ( ( 7 * weeks ) - nextDate.getDay() ) );

                    console.log('Start of next week:', nextDate);
                }
            }

            // #2 - Then use end date
            else {
                const { d } = end;
                const endDate = d ? new Date(d) : last;

                console.log('End Date:', endDate);

                while (nextDate <= endDate) {
                    // for each day in days, increment (day of week - last day of week)
                    for (let i = 0; i < days.length; i++) {
                        nextDate.setDate( nextDate.getDate() + ( dayIndices[i] - nextDate.getDay() ) );

                        if (nextDate > endDate) {
                            break;
                        }
                        
                        if (nextDate >= first && nextDate <= last) {
                            occurrences.push(new Date(nextDate));
                        }
                    }

                    // Jump to next week in pattern
                    // 7 - next date's day of week = next saturday
                    nextDate.setDate(nextDate.getDate() + ( ( 7 * weeks ) - nextDate.getDay() ) );

                    // console.log('Start of next week:', nextDate);
                }
            }
            
            console.log(occurrences);

            return occurrences;
        },
        Monthly({ start, end, value, month}) {
            // Count
            // -----
            // first
            // second
            // third
            // fourth
            // last

            // Day
            // -----
            // day
            // weekday
            // weekend day
            // Monday
            // Tuesday
            // Wednesday
            // Thursday
            // Friday
            // Saturday
            // Sunday
            
            const { option } = value;
            const { first, last } = getDays(month);
            const startDate = new Date(start);
            const limit = setLimit(end);

            let occurrences = [];
            
            console.log('Start Date:', startDate);
            console.log('First:', first);
            console.log('Last:', last);
            console.log('Limit:', limit);
            console.log('Option:', option);

            // Option: Day n of every m month(s)
            if (option === 'Day n of every m month(s)') {
                const { n, m } = value;

                console.log(n, m);

                let nextDate = new Date(startDate.getFullYear(), startDate.getMonth(), n);

                // First, compare day n of start month to start date
                if (startDate < nextDate ) {
                    console.log('First Occurence:', nextDate);

                    occurrences.push(new Date(nextDate));
                } 
                
                // If start date is before n, go to next month
                else {
                    nextDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, n);
                    console.log('First Occurence:', nextDate);
                }

                // #1 - Check if limit is set first
                if (limit) {
                    for (let i = 0; i < limit; i++) {
                        nextDate.setMonth(nextDate.getMonth() + m);

                        console.log(nextDate);

                        if (nextDate >= first && nextDate <= last) {
                            occurrences.push(new Date(nextDate));
                        }
                    }
                }

                // #2 - Then use end date
                else {
                    const { d } = end;
                    const endDate = d ? new Date(d) : last;

                    // console.log('End Date:', endDate);

                    while (nextDate <= endDate) {
                        nextDate.setMonth(nextDate.getMonth() + m);

                        // console.log(nextDate);

                        if (nextDate >= first && nextDate <= last) {
                            if (nextDate <= endDate) {
                                occurrences.push(new Date(nextDate));
                            }
                        }
                    }
                }
            }

            // Option: The i d of every n month(s)
            else if (option === 'The i d of every m month(s)') {
                const { i, d, m } = value;
                const numbers = {
                    first: 1,
                    second: 2,
                    third: 3,
                    fourth: 4,
                    // FIXME: encode last
                    last: 5
                };
                const count = numbers[i];

                let nextDate;

                console.log('Value:', i, `(${count})`, d, m);

                // Rules
                switch(d) {
                    // Done
                    case 'day':
                        // nextDate = new Date(startDate.getFullYear(), startDate.getMonth(), count);
                        // occurrences.push(new Date(nextDate));

                        nextDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                                
                        // #1 - Check if limit is set first
                        if (limit) {
                            let counter = 0;

                            while(counter < limit) {
                                console.log(nextDate);

                                if (nextDate >= startDate) {
                                    if (nextDate >= first && nextDate <= last) {
                                        occurrences.push(new Date(nextDate));
                                    }

                                    counter++;
                                }

                                nextDate.setMonth(nextDate.getMonth() + m);
                            }
                        }

                        // #2 - Then use end date
                        else {
                            const { d } = end;
                            const endDate = d ? new Date(d) : last;

                            console.log('End Date:', endDate);

                            while (nextDate <= endDate) {
                                console.log(nextDate);

                                if (nextDate >= startDate) {
                                    if (nextDate >= first && nextDate <= last) {
                                        if (nextDate <= endDate) {
                                            occurrences.push(new Date(nextDate));
                                        }
                                    }
                                }

                                nextDate.setMonth(nextDate.getMonth() + m);
                            }
                        }
                        break;
                    // Done
                    case 'weekday':
                        // Start with start date
                        nextDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

                        // #1 - Check if limit is set first
                        if (limit) {
                            for (let i = 0; i < limit; i++) {
                                // Start with first of the month
                                console.log('First of month:', nextDate);
    
                                // Get weekday
                                const day = nextDate.getDay();
                                console.log('Day:', day);
    
                                const offset = getWeekdayOffset(day, count);
                                console.log('Offset:', offset);
    
                                // Add offset
                                nextDate.setDate(nextDate.getDate() + offset);

                                // If within month, push to array
                                if (nextDate >= first && nextDate <= last) {
                                    occurrences.push(new Date(nextDate));
                                }

                                // Increment month by m, set date to first
                                nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                            }
                        }

                        // #2 - Then use end date
                        else {
                            const { d } = end;
                            const endDate = d ? new Date(d) : last;

                            console.log('End Date:', endDate);

                            while (nextDate <= endDate) {
                                // Start with first of the month
                                console.log('First of month:', nextDate);
                                        
                                // Get weekday
                                const day = nextDate.getDay();
                                console.log('Day:', day);

                                const offset = getWeekdayOffset(day, count);
                                console.log('Offset:', offset);

                                // Add offset
                                nextDate.setDate(nextDate.getDate() + offset);

                                // If within month, push to array
                                if (nextDate >= first && nextDate <= last) {
                                    if (nextDate <= endDate) {
                                        occurrences.push(new Date(nextDate));
                                    }
                                }

                                // Increment month by m, set date to first
                                nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                            }
                        }

                           /**
                             *  | Weekday | Day | Count | Answer    |
                             *  |---------|-----|-------|-----------|
                             *  | Sun     | 0   | 1st   | + 1 > Mon |
                             *  | Sun     | 0   | 2nd   | + 2 > Tue |
                             *  | Sun     | 0   | 3rd   | + 3 > Wed |
                             *  | Sun     | 0   | 4th   | + 4 > Thu |
                             *  |---------|-----|-------|-----------|
                             *  | Mon     | 1   | 1st   | + 0 > Mon |
                             *  | Mon     | 1   | 2nd   | + 1 > Tue |
                             *  | Mon     | 1   | 3rd   | + 2 > Wed |
                             *  | Mon     | 1   | 4th   | + 3 > Thu |
                             *  |---------|-----|-------|---------- |
                             *  | Tue     | 2   | 1st   | + 0 > Tue |
                             *  | Tue     | 2   | 2nd   | + 1 > Wed |
                             *  | Tue     | 2   | 3rd   | + 2 > Thu |
                             *  | Tue     | 2   | 4th   | + 3 > Fri |
                             *  |---------|-----|-------|-----------|
                             *  | Wed     | 3   | 1st   | + 0 > Wed |
                             *  | Wed     | 3   | 2nd   | + 1 > Thu |
                             *  | Wed     | 3   | 3rd   | + 2 > Fri |
                             *  | Wed     | 3   | 4th   | + 5 > Mon |
                             *  |---------|-----|-------|-----------|
                             *  | Thu     | 4   | 1st   | + 0 > Thu |
                             *  | Thu     | 4   | 2nd   | + 1 > Fri |
                             *  | Thu     | 4   | 3rd   | + 4 > Mon |
                             *  | Thu     | 4   | 4th   | + 5 > Tue |
                             *  |---------|-----|-------|-----------|
                             *  | Fri     | 5   | 1st   | + 0 > Fri |
                             *  | Fri     | 5   | 2nd   | + 3 > Mon |
                             *  | Fri     | 5   | 3rd   | + 4 > Tue |
                             *  | Fri     | 5   | 4th   | + 5 > Wed |
                             *  |---------|-----|-------|-----------|
                             *  | Sat     | 6   | 1st   | + 2 > Mon |
                             *  | Sat     | 6   | 2nd   | + 3 > Tue |
                             *  | Sat     | 6   | 3rd   | + 4 > Wed |
                             *  | Sat     | 6   | 4th   | + 5 > Thu |
                             */
                        function getWeekdayOffset(day, count) {
                            switch (`${day} ${count}`) {
                                case '1 1':
                                case '2 1':
                                case '3 1':
                                case '4 1':
                                case '5 1':
                                    return 0;
                                case '0 1':
                                case '1 2':
                                case '2 2':
                                case '3 2':
                                case '4 2':
                                    return 1;
                                case '0 2':
                                case '1 3':
                                case '2 3':
                                case '3 3':
                                case '6 1':
                                    return 2;
                                case '0 3':
                                case '1 4':
                                case '2 4':
                                case '5 2':
                                case '6 2':
                                    return 3;
                                case '0 4':
                                case '4 3':
                                case '5 3':
                                case '6 3':
                                    return 4;
                                case '3 4':
                                case '4 4':
                                case '5 4':
                                case '6 4':
                                    return 5;
                            }
                        }
                        break;
                    // Done
                    case 'weekend day':
                        // Start with start date
                        nextDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

                        // #1 - Check if limit is set first
                        if (limit) {
                            for (let i = 0; i < limit; i++) {
                                // Start with first of the month
                                console.log('First of month:', nextDate);
    
                                // Get weekday
                                const day = nextDate.getDay();
                                console.log('Day:', day);
    
                                const offset = getWeekendOffset(day, count);
                                console.log('Offset:', offset);
    
                                // Add offset
                                nextDate.setDate(nextDate.getDate() + offset);

                                // If within month, push to array
                                if (nextDate >= first && nextDate <= last) {
                                    occurrences.push(new Date(nextDate));
                                }

                                // Increment month by m, set date to first
                                nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                            }
                        }

                        // #2 - Then use end date
                        else {
                            const { d } = end;
                            const endDate = d ? new Date(d) : last;

                            console.log('End Date:', endDate);

                            while (nextDate <= endDate) {
                                // Start with first of the month
                                console.log('First of month:', nextDate);
                                        
                                // Get weekday
                                const day = nextDate.getDay();
                                console.log('Day:', day);

                                const offset = getWeekendOffset(day, count);
                                console.log('Offset:', offset);

                                // Add offset
                                nextDate.setDate(nextDate.getDate() + offset);

                                // If within month, push to array
                                if (nextDate >= first && nextDate <= last) {
                                    if (nextDate <= endDate) {
                                        occurrences.push(new Date(nextDate));
                                    }
                                }

                                // Increment month by m, set date to first
                                nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                            }
                        }

                        /**
                             *  | Weekday | Day | Count | Answer     |
                             *  |---------|-----|-------|------------|
                             *  | Sun     | 0   | 1st   | + 0  > Mon |
                             *  | Sun     | 0   | 2nd   | + 6  > Tue |
                             *  | Sun     | 0   | 3rd   | + 7  > Wed |
                             *  | Sun     | 0   | 4th   | + 13 > Thu |
                             *  |---------|-----|-------|------------|
                             *  | Mon     | 1   | 1st   | + 5  > Mon |
                             *  | Mon     | 1   | 2nd   | + 6  > Tue |
                             *  | Mon     | 1   | 3rd   | + 12 > Wed |
                             *  | Mon     | 1   | 4th   | + 13 > Thu |
                             *  |---------|-----|-------|------------|
                             *  | Tue     | 2   | 1st   | + 4  > Tue |
                             *  | Tue     | 2   | 2nd   | + 5  > Wed |
                             *  | Tue     | 2   | 3rd   | + 11 > Thu |
                             *  | Tue     | 2   | 4th   | + 12 > Fri |
                             *  |---------|-----|-------|------------|
                             *  | Wed     | 3   | 1st   | + 3  > Wed |
                             *  | Wed     | 3   | 2nd   | + 4  > Thu |
                             *  | Wed     | 3   | 3rd   | + 10 > Fri |
                             *  | Wed     | 3   | 4th   | + 11 > Mon |
                             *  |---------|-----|-------|------------|
                             *  | Thu     | 4   | 1st   | + 2  > Thu |
                             *  | Thu     | 4   | 2nd   | + 3  > Fri |
                             *  | Thu     | 4   | 3rd   | + 9  > Mon |
                             *  | Thu     | 4   | 4th   | + 10 > Tue |
                             *  |---------|-----|-------|------------|
                             *  | Fri     | 5   | 1st   | + 1  > Fri |
                             *  | Fri     | 5   | 2nd   | + 2  > Mon |
                             *  | Fri     | 5   | 3rd   | + 8  > Tue |
                             *  | Fri     | 5   | 4th   | + 9  > Wed |
                             *  |---------|-----|-------|------------|
                             *  | Sat     | 6   | 1st   | + 0  > Mon |
                             *  | Sat     | 6   | 2nd   | + 1  > Tue |
                             *  | Sat     | 6   | 3rd   | + 7  > Wed |
                             *  | Sat     | 6   | 4th   | + 8  > Thu |
                             */
                        function getWeekendOffset(day, count) {
                            switch (`${day} ${count}`) {
                                case '0 1':
                                case '6 1':
                                    return 0;
                                case '5 1':
                                case '6 2':
                                    return 1;
                                case '4 1':
                                case '5 2':
                                    return 2;
                                case '3 1':
                                case '4 2':
                                    return 3;
                                case '2 1':
                                case '3 2':
                                    return 4;
                                case '1 1':
                                case '2 2':
                                    return 5;
                                case '0 2':
                                case '1 2':
                                    return 6;
                                case '0 3':
                                case '6 3':
                                    return 7;
                                case '5 3':
                                case '6 4':
                                    return 8;
                                case '4 3':
                                case '5 4':
                                    return 9;
                                case '3 3':
                                case '4 4':
                                    return 10;
                                case '2 3':
                                case '3 4':
                                    return 11;
                                case '1 3':
                                case '2 4':
                                    return 12;
                                case '0 4':
                                case '1 4':
                                    return 13;
                            }
                        }
                        break;
                    // Done
                    case 'Monday':
                        getNextDates(1);
                        break;
                    // Done
                    case 'Tuesday':
                        getNextDates(2);
                        break;
                    // Done
                    case 'Wednesday':
                        getNextDates(3);
                        break;
                    // Done
                    case 'Thursday':
                        getNextDates(4);
                        break;
                    // Done
                    case 'Friday':
                        getNextDates(5);
                        break;
                    // Done
                    case 'Saturday':
                        getNextDates(6);
                        break;
                    // Done
                    case 'Sunday':
                        getNextDates(0);
                        break;
                }

                function getNextDates(day) {
                    // Start with start date
                    nextDate = new Date(startDate);

                    // #1 - Check if limit is set first
                    if (limit) {
                        for (let i = 0; i < limit; i++) {
                            const nthDay = nthWeekdayOfMonth(day, count, nextDate);
                            nextDate = new Date(nthDay);

                            console.log(nextDate);

                            // If within month, push to array
                            if (nextDate >= first && nextDate <= last) {
                                occurrences.push(new Date(nextDate));
                            }

                            // Increment month by m, set date to first
                            nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                        }
                    }

                    // #2 - Then use end date
                    else {
                        const { d } = end;
                        const endDate = d ? new Date(d) : last;

                        console.log('End Date:', endDate);

                        while (nextDate <= endDate) {
                            const nthDay = nthWeekdayOfMonth(day, count, nextDate);
                            nextDate = new Date(nthDay);

                            console.log(nextDate);

                            // If within month, push to array
                            if (nextDate >= first && nextDate <= last) {
                                if (nextDate <= endDate) {
                                    occurrences.push(new Date(nextDate));
                                }
                            }

                            // Increment month by m, set date to first
                            nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                        }
                    }
                }

                // https://stackoverflow.com/a/32193378
                function nthWeekdayOfMonth(weekday, count, start) {
                    let date = new Date(start.getFullYear(), start.getMonth(), 1);
                    let toAdd = (weekday - start.getDay() + 7) % 7 + (count - 1) * 7;
                    
                    date.setDate(1 + toAdd);

                    return date;
                }
            }

            // Recurse month +1 if no occurrences
            if (!occurrences.length) {
                const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
                console.log('NEXT MONTH:', nextMonth);

                if (!limit) {
                    const { d } = end;
                    const endMonth = d ? new Date(d) : last;
                    endMonth.setDate(nextMonth.getDate());
                    console.log('END MONTH:', new Date(endMonth));

                    if (endMonth >= nextMonth) {
                        occurrences = formulas.Monthly({ start, end, value, month: nextMonth });
                    }
                } else {
                    occurrences = formulas.Monthly({ start, end, value, month: nextMonth });
                }
            }

            console.log(occurrences);

            return occurrences;
        },
        Quarterly({ start, end, value, month }) {
            /*
                Calendar Year
                -------------
                Q1 1st Quarter: January 1st – March 31st
                Q2 2nd Quarter: April 1st – June 30th
                Q3 3rd Quarter: July 1st – September 30th
                Q4 4th Quarter: October 1st – December 31st

                Fiscal Year
                -----------
                Q1 1st quarter: 1 October 2021 – 31 December 2021
                Q2 2nd quarter: 1 January 2022 – 31 March 2022
                Q3 3rd quarter: 1 April 2022 – 30 June 2022
                Q4 4th quarter: 1 July 2022 – 30 September 2022
            */
            const { type, quarters } = value;
            const { first, last } = getDays(month);
            const startDate = new Date(start);
            const limit = setLimit(end);

            let occurrences = [];
            let nextDate = new Date(startDate);
            
            console.log('Start Date:', startDate);
            console.log('First:', first);
            console.log('Last:', last);
            console.log('Limit:', limit);
            console.log('Type:', type);
            console.log('Quarters:', quarters);

            // Type: Calendar Year
            if (type === 'Calendar Year') {
                // Month Map
                const startMonth = {
                    First: 0,  // Jan
                    Second: 3, // Apr
                    Third: 6,  // Jul
                    Fourth: 9  // Oct
                }

                // #1 - Check if limit is set first
                if (limit) {
                    let counter = 0;

                    while (counter < limit) {
                        // Loop over each qtr defined by user (up to 4)
                        quarters.forEach(qtr => {
                            // Get first qtr date
                            const qtrDate = new Date(nextDate.getFullYear(), startMonth[qtr], 1);

                            // If start date is before qtr, add occurrence
                            if (startDate <= qtrDate) {
                                // If occurrs in selected month, add to array
                                if (qtrDate >= first && qtrDate <= last) {
                                    occurrences.push(new Date(qtrDate));
                                }

                                counter++;
                            }
                        });

                        // Go to start of next year
                        nextDate = new Date(nextDate.getFullYear() + 1, 0, 1);
                    }
                }

                // #2 - Then use end date
                else {
                    const { d } = end;
                    const endDate = d ? new Date(d) : last;

                    console.log('End Date:', endDate);

                    while (nextDate <= endDate) {
                        // Loop over each qtr defined by user (up to 4)
                        quarters.forEach(qtr => {
                            // Get first qtr date
                            const qtrDate = new Date(nextDate.getFullYear(), startMonth[qtr], 1);

                            // If start date is before qtr, add occurrence
                            if (startDate <= qtrDate) {
                                // If occurrs in selected month, add to array
                                if (qtrDate >= first && qtrDate <= last) {
                                    if (qtrDate <= endDate) {
                                        occurrences.push(new Date(qtrDate));
                                    }
                                }
                            }
                        });

                        // Go to start of next year
                        nextDate = new Date(nextDate.getFullYear() + 1, 0, 1);
                    }
                }
            }

            // Option: The i d of every n month(s)
            else if (type === 'Fiscal Year') {
                // Month Map
                const startMonth = {
                    First: 9,  // Oct
                    Second: 0, // Jan
                    Third: 3,  // Apr
                    Fourth: 6  // Jul
                }

                // #1 - Check if limit is set first
                if (limit) {
                    let counter = 0;

                    while (counter < limit) {
                        // Loop over each qtr defined by user (up to 4)
                        quarters.forEach(qtr => {
                            // Get first qtr date
                            const qtrDate = new Date(nextDate.getFullYear(), startMonth[qtr], 1);

                            // If start date is before qtr, add occurrence
                            if (startDate <= qtrDate) {
                                // If occurrs in selected month, add to array
                                if (qtrDate >= first && qtrDate <= last) {
                                    occurrences.push(new Date(qtrDate));
                                }

                                counter++;
                            }
                        });

                        // Go to start of next year
                        nextDate = new Date(nextDate.getFullYear() + 1, 0, 1);
                    }
                }

                // #2 - Then use end date
                else {
                    const { d } = end;
                    const endDate = d ? new Date(d) : last;

                    console.log('End Date:', endDate);

                    while (nextDate <= endDate) {
                        // Loop over each qtr defined by user (up to 4)
                        quarters.forEach(qtr => {
                            // Get first qtr date
                            const qtrDate = new Date(nextDate.getFullYear(), startMonth[qtr], 1);

                            // If start date is before qtr, add occurrence
                            if (startDate <= qtrDate) {
                                // If occurrs in selected month, add to array
                                if (qtrDate >= first && qtrDate <= last) {
                                    if (qtrDate <= endDate) {
                                        occurrences.push(new Date(qtrDate));
                                    }
                                }
                            }
                        });

                        // Go to start of next year
                        nextDate = new Date(nextDate.getFullYear() + 1, 0, 1);
                    }
                }
            }

            // Recurse month +1 if no occurrences
            if (!occurrences.length) {
                // Increment 2 months
                const nextMonth = new Date(month.getFullYear(), month.getMonth() + 2, 1);
                console.log('NEXT MONTH:', nextMonth);

                if (!limit) {
                    const { d } = end;
                    const endMonth = d ? new Date(d) : last;
                    endMonth.setDate(nextMonth.getDate());
                    console.log('END MONTH:', new Date(endMonth));

                    if (endMonth >= nextMonth) {
                        occurrences = formulas.Quarterly({ start, end, value, month: nextMonth });
                    }
                } else {
                    occurrences = formulas.Quarterly({ start, end, value, month: nextMonth });
                }
            }

            return occurrences;
        },
        Yearly({ start, end, value, month }) {
            const { option, years } = value;
            const { first, last } = getDays(month);
            const startDate = new Date(start);
            const limit = setLimit(end);

            let occurrences = [];
            let nextDate = new Date(startDate);
            
            console.log('Start Date:', startDate);
            console.log('First:', first);
            console.log('Last:', last);
            console.log('Limit:', limit);
            console.log('Option:', option);

            // Option: On m d
            if (option === 'On m d') {
                const { m, d } = value;
                console.log('m, d:', m, d);

                // #1 - Check if limit is set first
                if (limit) {
                    let counter = 0;

                    while (counter < limit) {
                        // Get first date
                        const month = months.indexOf(m);
                        const date = new Date(nextDate.getFullYear(), month, d);
                        console.log(date);

                        // If start date is before qtr, add occurrence
                        if (startDate <= date) {
                            // If occurrs in selected month, add to array
                            if (date >= first && date <= last) {
                                occurrences.push(new Date(date));
                            }

                            counter++;
                        }

                        // Increment years
                        nextDate = new Date(nextDate.getFullYear() + years, month, d);
                    }
                }

                // #2 - Then use end date
                else {
                    const { d: eD } = end;
                    const endDate = eD ? new Date(eD) : last;

                    console.log('End Date:', endDate);

                    while (nextDate <= endDate) {
                        // Get first date
                        const month = months.indexOf(m);
                        const date = new Date(nextDate.getFullYear(), month, d);
                        console.log(date);

                        // If start date is before qtr, add occurrence
                        if (startDate <= date) {
                            // If occurrs in selected month, add to array
                            if (date >= first && date <= last) {
                                if (date <= endDate) {
                                    occurrences.push(new Date(date));
                                }
                            }
                        }

                        // Increment years
                        nextDate = new Date(nextDate.getFullYear() + years, month, d);
                    }
                }
            }

            // Option: On the i d of m
            else if (option === 'On the i d of m') {
                const { i, d, m } = value;
                const numbers = {
                    first: 1,
                    second: 2,
                    third: 3,
                    fourth: 4,
                    // FIXME: encode last
                    last: 5
                };
                const count = numbers[i];

                let nextDate = new Date(startDate.getFullYear(), months.indexOf(m), count);

                console.log('Value:', i, `(${count})`, d, m);

                // TODO: Replace m :number > m :string
                // Rules
                switch(d) {
                    // Done
                    case 'day':
                        // #1 - Check if limit is set first
                        if (limit) {
                            let counter = 0;

                            while (counter < limit) {
                                console.log(nextDate);

                                // If start date is before nextDate, add occurrence
                                if (startDate <= nextDate) {
                                    // If occurrs in selected month, add to array
                                    if (nextDate >= first && nextDate <= last) {
                                        occurrences.push(new Date(nextDate));
                                    }

                                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                                    
                                    counter++;
                                }
                            }
                        }

                        // #2 - Then use end date
                        else {
                            const { d } = end;
                            const endDate = d ? new Date(d) : last;

                            console.log('End Date:', endDate);

                            while (nextDate <= endDate) {
                                console.log(nextDate);

                                // If start date is before nextDate, add occurrence
                                if (startDate <= nextDate) {
                                    // If occurrs in selected month, add to array
                                    if (nextDate >= first && nextDate <= last) {
                                        if (nextDate <= endDate) {
                                            occurrences.push(new Date(nextDate));
                                        } else {
                                            // NOTE: Is this right?
                                            return occurrences;
                                        }
                                    }

                                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                                }
                            }
                        }
                        break;
                    // Done
                    case 'weekday':
                        // Start with start date
                        nextDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

                        // #1 - Check if limit is set first
                        if (limit) {
                            for (let i = 0; i < limit; i++) {
                                // Start with first of the month
                                console.log('First of month:', nextDate);
    
                                // Get weekday
                                const day = nextDate.getDay();
                                console.log('Day:', day);
    
                                const offset = getWeekdayOffset(day, count);
                                console.log('Offset:', offset);
    
                                // Add offset
                                nextDate.setDate(nextDate.getDate() + offset);

                                // If within month, push to array
                                if (nextDate >= first && nextDate <= last) {
                                    occurrences.push(new Date(nextDate));
                                }

                                // Increment month by m, set date to first
                                nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                            }
                        }

                        // #2 - Then use end date
                        else {
                            const { d } = end;
                            const endDate = d ? new Date(d) : last;

                            console.log('End Date:', endDate);

                            while (nextDate <= endDate) {
                                // Start with first of the month
                                console.log('First of month:', nextDate);
                                        
                                // Get weekday
                                const day = nextDate.getDay();
                                console.log('Day:', day);

                                const offset = getWeekdayOffset(day, count);
                                console.log('Offset:', offset);

                                // Add offset
                                nextDate.setDate(nextDate.getDate() + offset);

                                // If within month, push to array
                                if (nextDate >= first && nextDate <= last) {
                                    if (nextDate <= endDate) {
                                        occurrences.push(new Date(nextDate));
                                    }
                                }

                                // Increment month by m, set date to first
                                nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                            }
                        }

                        /**
                             *  | Weekday | Day | Count | Answer    |
                             *  |---------|-----|-------|-----------|
                             *  | Sun     | 0   | 1st   | + 1 > Mon |
                             *  | Sun     | 0   | 2nd   | + 2 > Tue |
                             *  | Sun     | 0   | 3rd   | + 3 > Wed |
                             *  | Sun     | 0   | 4th   | + 4 > Thu |
                             *  |---------|-----|-------|-----------|
                             *  | Mon     | 1   | 1st   | + 0 > Mon |
                             *  | Mon     | 1   | 2nd   | + 1 > Tue |
                             *  | Mon     | 1   | 3rd   | + 2 > Wed |
                             *  | Mon     | 1   | 4th   | + 3 > Thu |
                             *  |---------|-----|-------|---------- |
                             *  | Tue     | 2   | 1st   | + 0 > Tue |
                             *  | Tue     | 2   | 2nd   | + 1 > Wed |
                             *  | Tue     | 2   | 3rd   | + 2 > Thu |
                             *  | Tue     | 2   | 4th   | + 3 > Fri |
                             *  |---------|-----|-------|-----------|
                             *  | Wed     | 3   | 1st   | + 0 > Wed |
                             *  | Wed     | 3   | 2nd   | + 1 > Thu |
                             *  | Wed     | 3   | 3rd   | + 2 > Fri |
                             *  | Wed     | 3   | 4th   | + 5 > Mon |
                             *  |---------|-----|-------|-----------|
                             *  | Thu     | 4   | 1st   | + 0 > Thu |
                             *  | Thu     | 4   | 2nd   | + 1 > Fri |
                             *  | Thu     | 4   | 3rd   | + 4 > Mon |
                             *  | Thu     | 4   | 4th   | + 5 > Tue |
                             *  |---------|-----|-------|-----------|
                             *  | Fri     | 5   | 1st   | + 0 > Fri |
                             *  | Fri     | 5   | 2nd   | + 3 > Mon |
                             *  | Fri     | 5   | 3rd   | + 4 > Tue |
                             *  | Fri     | 5   | 4th   | + 5 > Wed |
                             *  |---------|-----|-------|-----------|
                             *  | Sat     | 6   | 1st   | + 2 > Mon |
                             *  | Sat     | 6   | 2nd   | + 3 > Tue |
                             *  | Sat     | 6   | 3rd   | + 4 > Wed |
                             *  | Sat     | 6   | 4th   | + 5 > Thu |
                             */
                        function getWeekdayOffset(day, count) {
                            switch (`${day} ${count}`) {
                                case '1 1':
                                case '2 1':
                                case '3 1':
                                case '4 1':
                                case '5 1':
                                    return 0;
                                case '0 1':
                                case '1 2':
                                case '2 2':
                                case '3 2':
                                case '4 2':
                                    return 1;
                                case '0 2':
                                case '1 3':
                                case '2 3':
                                case '3 3':
                                case '6 1':
                                    return 2;
                                case '0 3':
                                case '1 4':
                                case '2 4':
                                case '5 2':
                                case '6 2':
                                    return 3;
                                case '0 4':
                                case '4 3':
                                case '5 3':
                                case '6 3':
                                    return 4;
                                case '3 4':
                                case '4 4':
                                case '5 4':
                                case '6 4':
                                    return 5;
                            }
                        }
                        break;
                    // Done
                    case 'weekend day':
                        // Start with start date
                        nextDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

                        // #1 - Check if limit is set first
                        if (limit) {
                            for (let i = 0; i < limit; i++) {
                                // Start with first of the month
                                console.log('First of month:', nextDate);
    
                                // Get weekday
                                const day = nextDate.getDay();
                                console.log('Day:', day);
    
                                const offset = getWeekendOffset(day, count);
                                console.log('Offset:', offset);
    
                                // Add offset
                                nextDate.setDate(nextDate.getDate() + offset);

                                // If within month, push to array
                                if (nextDate >= first && nextDate <= last) {
                                    occurrences.push(new Date(nextDate));
                                }

                                // Increment month by m, set date to first
                                nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                            }
                        }

                        // #2 - Then use end date
                        else {
                            const { d } = end;
                            const endDate = d ? new Date(d) : last;

                            console.log('End Date:', endDate);

                            while (nextDate <= endDate) {
                                // Start with first of the month
                                console.log('First of month:', nextDate);
                                        
                                // Get weekday
                                const day = nextDate.getDay();
                                console.log('Day:', day);

                                const offset = getWeekendOffset(day, count);
                                console.log('Offset:', offset);

                                // Add offset
                                nextDate.setDate(nextDate.getDate() + offset);

                                // If within month, push to array
                                if (nextDate >= first && nextDate <= last) {
                                    if (nextDate <= endDate) {
                                        occurrences.push(new Date(nextDate));
                                    }
                                }

                                // Increment month by m, set date to first
                                nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                            }
                        }

                        /**
                         * | Weekday | Day | Count | Answer     |
                         * |---------|-----|-------|------------|
                         * | Sun     | 0   | 1st   | + 0  > Mon |
                         * | Sun     | 0   | 2nd   | + 6  > Tue |
                         * | Sun     | 0   | 3rd   | + 7  > Wed |
                         * | Sun     | 0   | 4th   | + 13 > Thu |
                         * |---------|-----|-------|------------|
                         * | Mon     | 1   | 1st   | + 5  > Mon |
                         * | Mon     | 1   | 2nd   | + 6  > Tue |
                         * | Mon     | 1   | 3rd   | + 12 > Wed |
                         * | Mon     | 1   | 4th   | + 13 > Thu |
                         * |---------|-----|-------|------------|
                         * | Tue     | 2   | 1st   | + 4  > Tue |
                         * | Tue     | 2   | 2nd   | + 5  > Wed |
                         * | Tue     | 2   | 3rd   | + 11 > Thu |
                         * | Tue     | 2   | 4th   | + 12 > Fri |
                         * |---------|-----|-------|------------|
                         * | Wed     | 3   | 1st   | + 3  > Wed |
                         * | Wed     | 3   | 2nd   | + 4  > Thu |
                         * | Wed     | 3   | 3rd   | + 10 > Fri |
                         * | Wed     | 3   | 4th   | + 11 > Mon |
                         * |---------|-----|-------|------------|
                         * | Thu     | 4   | 1st   | + 2  > Thu |
                         * | Thu     | 4   | 2nd   | + 3  > Fri |
                         * | Thu     | 4   | 3rd   | + 9  > Mon |
                         * | Thu     | 4   | 4th   | + 10 > Tue |
                         * |---------|-----|-------|------------|
                         * | Fri     | 5   | 1st   | + 1  > Fri |
                         * | Fri     | 5   | 2nd   | + 2  > Mon |
                         * | Fri     | 5   | 3rd   | + 8  > Tue |
                         * | Fri     | 5   | 4th   | + 9  > Wed |
                         * |---------|-----|-------|------------|
                         * | Sat     | 6   | 1st   | + 0  > Mon |
                         * | Sat     | 6   | 2nd   | + 1  > Tue |
                         * | Sat     | 6   | 3rd   | + 7  > Wed |
                         * | Sat     | 6   | 4th   | + 8  > Thu |
                         */
                        function getWeekendOffset(day, count) {
                            switch (`${day} ${count}`) {
                                case '0 1':
                                case '6 1':
                                    return 0;
                                case '5 1':
                                case '6 2':
                                    return 1;
                                case '4 1':
                                case '5 2':
                                    return 2;
                                case '3 1':
                                case '4 2':
                                    return 3;
                                case '2 1':
                                case '3 2':
                                    return 4;
                                case '1 1':
                                case '2 2':
                                    return 5;
                                case '0 2':
                                case '1 2':
                                    return 6;
                                case '0 3':
                                case '6 3':
                                    return 7;
                                case '5 3':
                                case '6 4':
                                    return 8;
                                case '4 3':
                                case '5 4':
                                    return 9;
                                case '3 3':
                                case '4 4':
                                    return 10;
                                case '2 3':
                                case '3 4':
                                    return 11;
                                case '1 3':
                                case '2 4':
                                    return 12;
                                case '0 4':
                                case '1 4':
                                    return 13;
                            }
                        }
                        break;
                    // Done
                    case 'Monday':
                        getNextDates(1);
                        break;
                    // Done
                    case 'Tuesday':
                        getNextDates(2);
                        break;
                    // Done
                    case 'Wednesday':
                        getNextDates(3);
                        break;
                    // Done
                    case 'Thursday':
                        getNextDates(4);
                        break;
                    // Done
                    case 'Friday':
                        getNextDates(5);
                        break;
                    // Done
                    case 'Saturday':
                        getNextDates(6);
                        break;
                    // Done
                    case 'Sunday':
                        getNextDates(0);
                        break;
                }

                function getNextDates(day) {
                    // Start with start date
                    nextDate = new Date(startDate);

                    // #1 - Check if limit is set first
                    if (limit) {
                        for (let i = 0; i < limit; i++) {
                            const nthDay = nthWeekdayOfMonth(day, count, nextDate);
                            nextDate = new Date(nthDay);

                            console.log(nextDate);

                            // If within month, push to array
                            if (nextDate >= first && nextDate <= last) {
                                occurrences.push(new Date(nextDate));
                            }

                            // Increment month by m, set date to first
                            nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                        }
                    }

                    // #2 - Then use end date
                    else {
                        const { d } = end;
                        const endDate = d ? new Date(d) : last;

                        console.log('End Date:', endDate);

                        while (nextDate <= endDate) {
                            const nthDay = nthWeekdayOfMonth(day, count, nextDate);
                            nextDate = new Date(nthDay);

                            console.log(nextDate);

                            // If within month, push to array
                            if (nextDate >= first && nextDate <= last) {
                                if (nextDate <= endDate) {
                                    occurrences.push(new Date(nextDate));
                                }
                            }

                            // Increment month by m, set date to first
                            nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + m, 1);
                        }
                    }
                }

                // https://stackoverflow.com/a/32193378
                function nthWeekdayOfMonth(weekday, count, start) {
                    let date = new Date(start.getFullYear(), start.getMonth(), 1);
                    let toAdd = (weekday - start.getDay() + 7) % 7 + (count - 1) * 7;
                    
                    date.setDate(1 + toAdd);

                    return date;
                }
            }

            // Recurse month +1 if no occurrences
            if (!occurrences.length) {
                // Go forward 11 months
                const nextMonth = new Date(month.getFullYear(), month.getMonth() + 11, 1);
                console.log('NEXT MONTH:', nextMonth);

                if (!limit) {
                    const { d } = end;
                    const endMonth = d ? new Date(d) : last;
                    endMonth.setDate(nextMonth.getDate());
                    console.log('END MONTH:', new Date(endMonth));

                    if (endMonth >= nextMonth) {
                        occurrences = formulas.Yearly({ start, end, value, month: nextMonth });
                    }
                } else {
                    occurrences = formulas.Yearly({ start, end, value, month: nextMonth });
                }
            }

            console.log(occurrences);

            return occurrences;
        },
        Irregular({ start, end, value, month }) {
            const { first, last } = getDays(month);
            const startDate = new Date(start);
            const limit = setLimit(end);

            let occurrences = []; 
            let nextDate = new Date(startDate);

            console.log('Start Date:', startDate);
            console.log('First:', first);
            console.log('Last:', last);
            console.log('Limit:', limit);

            // #1 - Check if limit is set first
            let counter = 0;

            if (limit) {
                while (counter < limit) {
                    value.forEach(item => {
                        const { m, d } = item;

                        nextDate = new Date(nextDate.getFullYear(), months.indexOf(m), d);
                        
                        if (nextDate >= startDate) {
                            if (nextDate >= first && nextDate <= last) {
                                occurrences.push(new Date(nextDate))
                            }

                            counter++
                        }
                    });

                    // Go to next year
                    nextDate = new Date(nextDate.getFullYear() + 1, 0, 1);
                }
            }

            // #2 - Then use end date
            else {
                const { d } = end;
                const endDate = d ? new Date(d) : last;

                console.log('End Date:', endDate);

                while (nextDate <= endDate) {
                    value.forEach(item => {
                        const { m, d } = item;

                        nextDate = new Date(nextDate.getFullYear(), months.indexOf(m), d);

                        console.log('Next Date:', nextDate);
                        
                        if (nextDate >= startDate) {
                            if (nextDate >= first && nextDate <= last) {
                                occurrences.push(new Date(nextDate));
                            }
                        }
                    });

                    // Go to next year
                    nextDate = new Date(nextDate.getFullYear() + 1, 0, 1);
                }
            }

            // Recurse month +1 if no occurrences
            if (!occurrences.length) {
                console.log('*** try again ***');

                // Go forward 11 months
                const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
                console.log('NEXT MONTH:', nextMonth);

                if (!limit) {
                    const { d } = end;
                    const endMonth = d ? new Date(d) : last;
                    // endMonth.setDate(nextMonth.getDate());
                    endMonth.setDate(endMonth.getDate() + 1); // FIXME: HACK
                    console.log('END MONTH:', new Date(endMonth));

                    if (endMonth >= nextMonth) {
                        occurrences = formulas.Irregular({ start, end, value, month: nextMonth });
                    }
                } else {
                    occurrences = formulas.Irregular({ start, end, value, month: nextMonth });
                }
            }

            console.log(occurrences);

            return occurrences;
        }
    };

    function getDays(date) {
        date.setDate(1);

        const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        const firstDayIndex = date.getDay();
        const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
        const nextDays = 7 - lastDayIndex - 1;

        return { 
            first: new Date(date.getFullYear(), date.getMonth() - 1, ( prevLastDay - firstDayIndex + 1 ) ),
            last:new Date(date.getFullYear(), date.getMonth() + 1, nextDays)
        };
    }

    function setLimit(end) {
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

        const { option } = end;

        if (option === 'End after n occurrences') {
            const { n } = end;

            return parseInt(n);
        }
    }

    if (!recurrence) {
        console.log('No recurrence pattern.');

        return [];
    }

    const { pattern, start, end, value } = recurrence;

    // FIXME: This blocks the main thread
    // TODO: Place in worker
    const startTime = performance.now();
    const events = formulas[pattern]({ start, end, value, month });
    const endTime = performance.now();

    console.log(`Time to calculate events: ${(endTime - startTime).toFixed(0)}ms`);

    return events;
}
// @END-File
