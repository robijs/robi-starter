import { UploadButton } from '../src/Robi/RobiUI'
import { AttachFiles } from '../src/Robi/Robi'

const attachFilesButton = UploadButton({
    async action(files) {
        console.log(files);
        const uploadedFiles = await AttachFiles({
            list: 'View_Home',
            id: 1,
            files
        });
        console.log(uploadedFiles);
    },
    parent: planContainer,
    type: 'btn-outline-success',
    value: 'Attach file',
    margin: '20px 0px 20px 0px'
});

attachFilesButton.add();
