import { App } from '../Core/App.js'
import { GetRequestDigest } from './GetRequestDigest.js'

// @START-File
/**
 * @example
 *  await SendEmail({
 *      From: 'i:0e.t|dod_adfs_provider|1098035555@mil',
 *      To:['i:0e.t|dod_adfs_provider|1098035555@mil'],
 *      CC: [
 *          'i:0e.t|dod_adfs_provider|1098035555@mil'
 *      ],
 *      Subject: `QPP - Test`,
 *      Body: `
 *          <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
 *              <p>Test</p>
 *          </div>
 *      `
 *  });
 *
 */
export async function SendEmail(param) {
    const {
        From, To, CC, Subject, Body
    } = param;

    if (!To.length) {
        console.log('No recipients');

        return;
    }

    if (App.isDev()) {
        return;
    }

    const requestDigest = await GetRequestDigest();
    const headers = {
        "Accept": "application/json;odata=verbose",
        "Content-type": "application/json; odata=verbose",
        "X-RequestDigest": requestDigest,
    };

    /** {@link https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-csom/jj171404(v=office.15)} */
    const properties = {
        'properties': {
            __metadata: {
                type: 'SP.Utilities.EmailProperties'
            },
            From: From,
            To: {
                results: To
            },
            CC: {
                results: CC || []
            },
            Body,
            Subject: Subject
        }
    };

    console.log(JSON.stringify(properties));

    const response = await fetch(`${App.get('site')}/_api/SP.Utilities.Utility.SendEmail`, {
        method: 'POST',
        headers,
        body: JSON.stringify(properties)
    });

    return response;
}
// @END-File
