// @START-File
/**
 * Set session storage key value pairs.
 * @param {Object}   param          Interface to module.
 */
export async function SetSessionStorage(param) {
    const {
        sessionStorageData
    } = param;

    if (!sessionStorageData) {
        return;
    }

    sessionStorageData.forEach(item => {
        const {
            key, value
        } = item;

        sessionStorage.setItem(key, value);
    });
}
// @END-File
