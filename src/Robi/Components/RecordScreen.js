// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { Store, Style } from '../../Robi/Robi.js'

// @START-File
// Modified from: https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element
export function RecordScreen({ onShare, onStop }) {
    Style({
        name: 'recording',
        locked: true,
        style: /*css*/ `
            video {
                border-radius: 10px;
                background: var(--body-dark);
            }

            .preview-container.ui-draggable {
                cursor: grab;
            }

            .preview-container.ui-draggable-dragging {
                cursor: grabbing;
            }
        `
    });
    
    // parent.append(/*html*/ `
    //     <div class='d-flex'>
    //         <div class='' style='max-width: 175px;'>
    //             <div style='font-weight: 500;'>Recording</div>
    //             <video id='recording' width='175px' height='120px' style='' controls></video>
    //         </div>
    //         <div class='bottom d-none'>
    //             <a id='downloadButton' class='button'>Download</a>
    //             <pre id='log'></pre>
    //         </div>
    //     </div>
    // `);

    let stopButton;
    let preview;
    let recording;
    let downloadButton;
    let recordingTimeMS;

    navigator.mediaDevices
        .getDisplayMedia({
            video: true,
            audio: true
        })
        .then((stream) => {
            if (onShare) {
                onShare(stream);
            }

            // Add UI
            Store.get('appcontainer').append(/*html*/ `
                <div class='preview-container p-3 d-flex flex-column justify-content-center align-items-center' style='position: absolute; bottom: 20px; right: 20px; width: max-content; height: max-content; 20px; box-shadow: var(--box-shadow); background: var(--body-dark); border-radius: 16px; z-index: 10000;'>
                    <video id='preview' width='200px' height='150px' autoplay muted></video>
                    <button id='stopButton' type='buton' class='btn btn-robi w-100 mt-2'>
                        <span class='d-flex align-items-center justify-content-center'>
                            <svg class="icon" fill='var(--primary)' style='font-size: 18px;'>
                                <use href="#icon-bs-stop-fill"></use>
                            </svg>
                            <span class='ml-2' style='line-height: 0;'>Stop recording</span>
                        </span>
                    </button>
                </div>
                <div class='recording-border w-100 h-100 m-0 p-0' style='box-shadow: inset 0px 0px 0px 4px var(--primary); z-index: 10000; position: absolute; top: 0px; left: 0px; pointer-events: none;'></div>
            `);

            $(".preview-container").draggable();

            preview = Store.get('appcontainer').find('#preview');
            // recording = Store.get('appcontainer').find('#recording');
            stopButton = Store.get('appcontainer').find('#stopButton');
            // downloadButton = Store.get('appcontainer').find('#downloadButton');
            recordingTimeMS = 10000;

            // Set stream
            preview.srcObject = stream;
            // downloadButton.href = stream;
            preview.captureStream = preview.captureStream || preview.mozCaptureStream;

            return new Promise((resolve) => (preview.onplaying = resolve));
        })
        .then(() => startRecording(preview.captureStream()))
        .then((recordedChunks) => {
            let recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });

            // recording.src = URL.createObjectURL(recordedBlob);
            // downloadButton.href = recording.src;
            // downloadButton.download = 'RecordedVideo.webm';

            Store.get('appcontainer').find('.recording-border')?.remove();
            Store.get('appcontainer').find('.preview-container')?.remove();

            // Set file
            // TODO: Check if file already exists?
            // FIXME: Will override everytime.
            const recording = {
                blob: recordedBlob,
                src: URL.createObjectURL(recordedBlob)
            };

            Store.setData('new feedback recording', recording);

            if (onStop) {
                onStop(recording);
            }

            console.log(
                'Successfully recorded ' +
                recordedBlob.size +
                ' bytes of ' +
                recordedBlob.type +
                ' media.'
            );
        })
        .catch((error) => console.log(error));

    function wait(stream) {
        return new Promise((resolve) => {
            // Listen for 'stop sharing'
            stream.getVideoTracks()[0].onended = stopRecording;

            // Stop recording button
            stopButton.addEventListener('click', stopRecording);

            function stopRecording() {
                Store.get('appcontainer').find('.preview-container').classList.add('wink-out');

                console.log('building video...');

                stop(preview.srcObject);

                resolve();
            };
        });
    }

    async function startRecording(stream) {
        // Enable stop
        stopButton.disabled = false;

        // Start
        let recorder = new MediaRecorder(stream);
        let data = [];

        recorder.ondataavailable = (event) => data.push(event.data);
        recorder.start();

        let stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve;
            recorder.onerror = (event) => reject(event.name);
        });

        let recorded = wait(stream).then(() => recorder.state == 'recording' && recorder.stop());

        await Promise.all([stopped, recorded]);
        return data;
    }

    function stop(stream) {
        stream.getTracks().forEach((track) => track.stop());
    }
}
// @END-File
