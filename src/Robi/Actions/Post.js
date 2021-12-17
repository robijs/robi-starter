// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function Post(param) {
    const {
        url, headers, data
    } = param;

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });

    try {
        return await response.json();
    } catch (error) {
        // console.log(error);
    }
}
// @END-File
