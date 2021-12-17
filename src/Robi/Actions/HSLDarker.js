// @START-File
/**
 * 
 * @param {*} hsl
 * @param {*} reduceBy
 * @returns
 */
function HSLDarker(hsl, reduceBy = 0) {
    let [h, s, l] = hsl.split(',');
    
    const num = parseInt(l.replace('%,', ''));
    
    l = `${num - reduceBy}%`;
    
    return [h, s, l].join(',');
}

export { HSLDarker }
// @END-File
