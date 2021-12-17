import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export function GetADUsers(param) {
    const {
        query
    } = param;

    const abortController = new AbortController();
    // const url = window.location.href.split('/SiteAssets')[0] + '/_vti_bin/client.svc/ProcessQuery';
    const url = `${App.get('site')}/_vti_bin/client.svc/ProcessQuery`

    function getPostRequestHeaders(requestDigest) {
        if (!requestDigest) {
            throw new Error('Request Digest is required to send your request.');
        }

        return {
            'Accept': 'application/json; odata=verbose',
            'Content-Type': 'application/json; odata=verbose',
            'X-RequestDigest': requestDigest,
        };
    }

    function createSearchPayload(queryString, options) {
        options = {
            AllowEmailAddresses: false,
            AllowMultipleEntities: true,
            AllUrlZones: false,
            ForceClaims: false,
            MaximumEntitySuggestions: 30,
            PrincipalSource: 15,
            PrincipalType: 5,
            Required: true,
            SharePointGroupID: 0,
            UrlZone: 0,
            UrlZoneSpecified: false,
            WebApplicationID: '{00000000-0000-0000-0000-000000000000}',
        }

        return '<Request xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009" SchemaVersion="15.0.0.0" LibraryVersion="15.0.0.0" ApplicationName="Javascript Library">' +
            '<Actions>' +
            '<StaticMethod TypeId="{de2db963-8bab-4fb4-8a58-611aebc5254b}" Name="ClientPeoplePickerSearchUser" Id="0">' +
            '<Parameters>' +
            '<Parameter TypeId="{ac9358c6-e9b1-4514-bf6e-106acbfb19ce}">' +
            '<Property Name="AllowEmailAddresses" Type="Boolean">' + options.AllowEmailAddresses + '</Property>' +
            '<Property Name="AllowMultipleEntities" Type="Boolean">' + options.AllowMultipleEntities + '</Property>' +
            '<Property Name="AllUrlZones" Type="Boolean">' + options.AllUrlZones + '</Property>' +
            '<Property Name="EnabledClaimProviders" Type="Null" />' +
            '<Property Name="ForceClaims" Type="Boolean">' + options.ForceClaims + '</Property>' +
            '<Property Name="MaximumEntitySuggestions" Type="Number">' + options.MaximumEntitySuggestions + '</Property>' +
            '<Property Name="PrincipalSource" Type="Number">' + options.PrincipalSource + '</Property>' +
            '<Property Name="PrincipalType" Type="Number">' + options.PrincipalType + '</Property>' +
            '<Property Name="QueryString" Type="String">' + queryString + '</Property>' +
            '<Property Name="Required" Type="Boolean">' + options.Required + '</Property>' +
            '<Property Name="SharePointGroupID" Type="Number">' + options.SharePointGroupID + '</Property>' +
            '<Property Name="UrlZone" Type="Number">' + options.UrlZone + '</Property>' +
            '<Property Name="UrlZoneSpecified" Type="Boolean">' + options.UrlZoneSpecified + '</Property>' +
            '<Property Name="Web" Type="Null" />' +
            '<Property Name="WebApplicationID" Type="String">' + options.WebApplicationID + '</Property>' +
            '</Parameter>' +
            '</Parameters>' +
            '</StaticMethod>' +
            '</Actions>' +
            '<ObjectPaths />' +
            '</Request>';
    }

    function createPostRequest(data, requestDigest) {
        data = typeof (data) === 'string' ? data : JSON.stringify(data)

        return {
            method: 'POST',
            body: data,
            headers: getPostRequestHeaders(requestDigest),
        };
    }

    return {
        abortController,
        response: GetRequestDigest()
            .then(reqDigest => {
                // Create Active Directory Search Payload
                const reqData = createSearchPayload(query)
                const reqOptions = Object.assign(createPostRequest(reqData, reqDigest), {
                    signal: abortController.signal
                });

                return fetch(url, reqOptions)
                    .then(async response => {
                        console.log(response);

                        const data = await response.json();

                        return data;

                        let result = JSON.parse(data[2]);

                        result.forEach(acct => {
                            acct.Title = acct.DisplayText
                            acct.LoginName = acct.Key
                        });

                        return result;
                    })
            })
            // response: GetRequestDigest().then(requestDigest => {
            //     const init = {
            //         method: 'POST',
            //         body: JSON.stringify(createSearchPayload(query)),
            //         headers : { 
            //             'Content-Type': 'application/json; charset=UTF-8',
            //             'Accept': 'application/json; odata=verbose',
            //             'X-RequestDigest': requestDigest,
            //         },
            //         signal: abortController.signal 
            //     };

            //     return fetch(url, init).then(async response => {
            //         const data = await response.json();

            //         console.log(data);

            //         let result = JSON.parse(data[2]);

            //         result.forEach(acct => {
            //             acct.Title = acct.DisplayText;
            //             acct.LoginName = acct.Key;
            //         });

            //         return result;
            //     })
            // })
            .catch(error => {
                // console.log(error);
            })
    };
}
// @END-File
