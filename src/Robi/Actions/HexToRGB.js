// @START-File
/**
 * 
 * @param {*} hex 
 * @returns 
 */
function HexToRGB(hex) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `${r},${g},${b}`;
}

export { HexToRGB }
// @END-File
