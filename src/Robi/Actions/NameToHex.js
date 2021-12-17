import { Colors } from './Colors.js'

// @START-File
/**
 * 
 * @param {*} color 
 * @returns 
 */
function NameToHex(color) {
    return Colors[color.toLowerCase()] || color;
}

export { NameToHex }
// @END-File
