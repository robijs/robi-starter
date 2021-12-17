// @START-File
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
    now.setHours(0, 0, 0, 0);

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
// @END-File
