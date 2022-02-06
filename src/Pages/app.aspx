<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
<head>
    <meta charset="utf-8">
    <meta name="color-scheme" content="light dark">
    <title></title>
    <style>
        :root {
            --body-dark: #151515;
            --body-light: white;
        }

        @media (prefers-color-scheme: light) {
            html {
                background-color: var(--body-light);
            }
        }

        @media (prefers-color-scheme: dark) {
            html {
                background-color: var(--body-dark);
            }
        }
    </style>
    <meta name="description" content="Robi">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="../Images/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700;800;900&display=swap" rel="preload" as="style">
    <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../Libraries/lib.css">
</head>
<body>
    <div id="app"></div>
    <script>
        var ua = window.navigator.userAgent;
        var isIE = /MSIE|Trident/.test(ua);

        if (isIE) {
            location.href = "ie.aspx";
        }
    </script>
    <script src="../Libraries/lib.js"></script>
    <script type="module" src="../app.js"></script>
</body>
</html>
