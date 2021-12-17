<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
<head>
    <title>Please Launch App in Edge</title>
    <link rel="shortcut icon" href="../Images/favicon.ico">
    <style>
        html,
        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: rgba(0, 0, 0, 0.8);
        }

        body {
            height: 100vh;
            width: 100vw;
            margin: 0px;
            padding: 0px;
            background: whitesmoke;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .title {
            font-size: 2em;
            margin-bottom: .5em;
        }

        .sub-title {
            font-size: 1.25em;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }
    </style>

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef,i3e7b0477ad24f0693a0b6cb17b27bf1,TaxCatchAllLabel,_dlc_DocId,_dlc_DocIdUrl,_dlc_DocIdPersistId,mb7b7c6cb3b94febb95b36ae1f78ffc5,ba60022a341749df97d7a0ab674012b7"><xml>
<mso:CustomDocumentProperties>
<mso:_dlc_DocId msdt:dt="string">K75DWSHUVDYD-33088889-195</mso:_dlc_DocId>
<mso:_dlc_DocIdItemGuid msdt:dt="string">59d8e578-c994-4600-a55a-bdcc50c9b4c9</mso:_dlc_DocIdItemGuid>
<mso:_dlc_DocIdUrl msdt:dt="string">https://info.health.mil/staff/analytics/cp/ModernDev/create-app/measures-library-2/_layouts/15/DocIdRedir.aspx?ID=K75DWSHUVDYD-33088889-195, K75DWSHUVDYD-33088889-195</mso:_dlc_DocIdUrl>
</mso:CustomDocumentProperties>
</xml></SharePoint:CTFieldRefs><![endif]-->
</head>
<body>
    <div class="center">
        <div class="title">This app requires a modern browser, like <a href='https://www.microsoft.com/en-us/edge' target='_blank'><strong>Microsoft Edge</strong></a></div>
        <div class="sub-title">
            <a id='launch'>
                <span>Click here to launch this app in Edge</span>
            </a>
        </div>
    </div>
    <script>
        document.querySelector('#launch').href = 'microsoft-edge:' + location.href.replace('ie.aspx', 'app.aspx');
    </script>
</body>
</html>