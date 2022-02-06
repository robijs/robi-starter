// @START-File
/**
 * 
 * @param {*} param 
 */
export function Style(param) {
    const {
        name,
        locked,
        position,
        style
    } = param;

    const node = document.querySelector(`style[data-name='${name}']`);

    if (node) {
        const css = /*html*/ `
            <style type='text/css' data-name='${name || id}' data-type='style' data-locked='${locked ? 'yes' : 'no'}'>
                ${style}
            </style>
        `;

        node.insertAdjacentHTML('beforebegin', css);
        node.remove();
    } else {
        const css = /*html*/ `
            <style type='text/css' data-name='${name || id}' data-type='style' data-locked='${locked ? 'yes' : 'no'}'>
                ${style}
            </style>
        `;
        const head = document.querySelector('head');

        head.insertAdjacentHTML(position || 'beforeend', css);
    }
}
// @END-File
