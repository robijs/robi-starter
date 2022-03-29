# Robi

## Local Development
```console
npm install
npm run dev
```

## Deploy to SharePoint
1. Create a build of your app.
```console
npm run build-sp min
```
2. Create a new SharePoint site (if one doesn't already exist). We recommend deploying only one app per site.
3. Create a new document library named App.
4. Copy single /src directory from /dist to App, including the /src directory.
5. Launch App/src/Pages/app.aspx
6. Click Install.

## Troubleshooting
If you see error messages in the terminal session that's running the local development server, try these steps. 

### Trigger: Edit > Modify Routes

#### Error
```console
EPERM: operation not permitted, watch at FSEvent.FSWatcher._handle.onchange
``` 
```console
EPERM: operation not permitted, rename './src/Routes/OldRouteName' -> './src/Routes/NewRouteName'
```

#### Fix
Stop the server with <kbd>ctrl</kbd> + <kbd>c</kbd> and close your text editor and terminal. You'll probably need to fix broken paths since the server was in the middle of renaming files and directories. Then restart the development server.

If that doesn't work, check if there's another program using the named directory. Sometimes antivirus and file sync apps (OneDrive, iCloud Drive, Dropbox, etc.) will lock directories to changes. Pause them and try again.

```console
npm run dev
```

### Trigger: A previous server session didn't close properly or another process is using port 3000

#### Error
```console
Some error occurred Error: listen EADDRINUSE: address already in use 127.0.0.1:3000
    at Server.setupListenHandle [as _listen2] (node:net:1334:16)
    at listenInCluster (node:net:1382:12)
    at GetAddrInfoReqWrap.doListen [as callback] (node:net:1520:7)
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (node:dns:73:8) {
  code: 'EADDRINUSE',
  errno: -4091,
```

#### Fix
Stop the server with <kbd>ctrl</kbd> + <kbd>c</kbd> and restart.

```console
npm run dev
```

If that doesn't work, open Task Manager and end all Node.js processes.

### Trigger: CodeMirror scroll/resize is slow

#### Fix
Close dev tools! Oddly enough, it works.
