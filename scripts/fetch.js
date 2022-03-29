import fetch from 'node-fetch';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const digest = await fetch('https://info.health.mil/staff/analytics/apps/_api/contextinfo', {
    method: 'POST',
    headers: {
        "Accept": "application/json; odata=verbose",
    }
});

console.log(digest);
// console.log(digest.d.GetContextWebInformation.FormDigestValue);