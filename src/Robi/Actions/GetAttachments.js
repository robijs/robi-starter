import { Get } from './Get.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetAttachments(param) {
    const {
        list,
        itemId
    } = param;

    const item = await Get({
        list,
        select: 'Attachments,AttachmentFiles',
        expand: 'AttachmentFiles',
        filter: `Id eq ${itemId}`
    });

    try {
        return item[0].AttachmentFiles.results;
    } catch (error) {
        console.log(error);
    }
}
// @END-File
