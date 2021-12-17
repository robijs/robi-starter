// @START-File
/**
 * 
 * @param {*} ms 
 * @returns 
 */
export function Wait(ms) {
    console.log(`Waiting ${ms}ms`);
    
    return new Promise(resolve => setTimeout(resolve, ms));
}
// @END-File
