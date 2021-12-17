import { Post } from './Post.js'

// @START-File
/**
 *
 * @returns
 */
export async function GetRootRequestDigest() {
    const getRequestDigest = await Post({
        url: `/_api/contextinfo`,
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });

    return getRequestDigest.d.GetContextWebInformation.FormDigestValue;
}
// @END-File
