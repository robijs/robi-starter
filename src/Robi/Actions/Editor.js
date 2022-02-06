import { LoadingSpinner } from '../Components/LoadingSpinner.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { App } from '../Core/App.js'
import { Wait } from './Wait.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function Editor({ path, file, parent }) {
    parent.append(/*html*/ `
        <div class='rs-box code-box alert w-100 mb-0 p-0' style='background: #1e1e1e; color: #d4d4d4;'>
            <!-- CodeMirror injected here -->
        </div>
    `);

    const loading = LoadingSpinner({
        message: `Loading <span style='font-weight: 300;'>${path}/${file}</span>`,
        type: 'white',
        classes: ['h-100', 'loading-file'],
        parent:  parent.find('.code-box')
    });

    loading.add();

    document.querySelector('.code-box').insertAdjacentHTML('beforeend', /*html*/ `
        <textarea class='code-mirror-container robi-code-background h-100'></textarea>
    `);

    let shouldReload = false;

    const editor = CodeMirror.fromTextArea(parent.find('.code-mirror-container'), {
        mode: 'javascript',
        indentUnit: 4,
        lineNumbers: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        foldGutter: true,
        matchBrackets: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        keyword: {
            "import": "special",
            "export": "special",
            "default": "special",
            "await": "special",
        }
    });
    editor.setSize(0, 0);
    editor.setOption('extraKeys', {
        // "Ctrl-Space": "autocomplete",
        'Tab': 'indentMore',
        'Shift-Tab': 'indentLess',
        'Ctrl-/'(cm) {
            editor.toggleComment({
                // this prop makes sure comments retain indented code
                // https://github.com/codemirror/CodeMirror/issues/3765#issuecomment-171819763
                indent: true
            });
        },
        async 'Ctrl-S'(cm) {
            // TODO: only save file if changed
            console.log('save file');

            // Save file
            await saveFile();

            // Add changed message
            const changedMessaage = parent.find('.changed-message');

            if (!changedMessaage) {
                parent.find('.file-title-text').insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='changed-message' style='margin-left: 10px; color: seagreen'>CHANGED (will reload on close)</div>
                `);
            }

            // Set reload flag
            shouldReload = true;

        }
    });

    // Autocomplete
    const ExcludedIntelliSenseTriggerKeys = {
        "8": "backspace",
        "9": "tab",
        "13": "enter",
        "16": "shift",
        "17": "ctrl",
        "18": "alt",
        "19": "pause",
        "20": "capslock",
        "27": "escape",
        "32": "space",
        "33": "pageup",
        "34": "pagedown",
        "35": "end",
        "36": "home",
        "37": "left",
        "38": "up",
        "39": "right",
        "40": "down",
        "45": "insert",
        "46": "delete",
        "91": "left window key",
        "92": "right window key",
        "93": "select",
        "107": "add",
        "109": "subtract",
        "110": "decimal point",
        "111": "divide",
        "112": "f1",
        "113": "f2",
        "114": "f3",
        "115": "f4",
        "116": "f5",
        "117": "f6",
        "118": "f7",
        "119": "f8",
        "120": "f9",
        "121": "f10",
        "122": "f11",
        "123": "f12",
        "144": "numlock",
        "145": "scrolllock",
        "186": "semicolon",
        "187": "equalsign",
        "188": "comma",
        "189": "dash",
        "190": "period",
        "191": "slash",
        "192": "graveaccent",
        "220": "backslash",
        "222": "quote"
    }
      
    // editor.on("keyup", function (cm, event) {
    //     if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
    //         !ExcludedIntelliSenseTriggerKeys[(event.keyCode || event.which).toString()]) {        /*Enter - do not open autocomplete list just after item has been selected in it*/ 
    //       CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
    //     }
    // });

    // END 

    let fileValueRequest;
    let requestDigest;

    if (App.isProd()) {
        const sourceSiteUrl = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files('${file}')/$value`;

        requestDigest = await GetRequestDigest();

        fileValueRequest = await fetch(sourceSiteUrl, {
            method: 'GET',
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': requestDigest
            }
        });

    } else {
        const devPath = path.replace('App/', '');
        fileValueRequest = await fetch(`http://127.0.0.1:8080/${devPath}/${file}`);
        await Wait(1000);
    }

    // Overriden on save
    // FIXME: Doesn't work with app.js.
    let value = await fileValueRequest.text();

    // Always wait an extra 100ms for CodeMirror to settle.
    // For some reason, gutter width's won't apply 
    // correctly if the editor is modified too quickly.
    setTimeout(() => {
        // Remove loading message
        loading.remove();

        // Set codemirror
        setEditor();
    }, 100);

    // FIXME: Remember initial codemirorr doc value
    // compare this with current doc value
    let docValue;

    function setEditor() {
        editor.setSize('100%', '100%');
        editor.setOption('viewportMargin', Infinity);
        editor.setOption('theme', 'vscode-dark');
        editor.getDoc().setValue(value);
        editor.focus();

        docValue = editor.doc.getValue();

        // Watch for changes
        editor.on('change', event => {
            if (docValue === editor.doc.getValue()) {
                console.log('unchanged');

                const dot = parent.find('.changed-dot');

                if (dot) {
                    dot.remove();
                }
            } else {
                console.log('changed');

                const dot = parent.find('.changed-dot');

                if (!dot) {
                    // parent.find('.file-title').insertAdjacentHTML('beforeend', /*html*/ `
                    //     <div class='changed-dot' style='margin-left: 15px; width: 8px; height: 8px; background: white; border-radius: 50%;'></div>
                    // `);
                }
            }
        });

        // // Scrollbar
        // editor.on()
    }
}
// @END-File
