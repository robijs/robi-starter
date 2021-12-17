import { Get } from '../Actions/Get.js'
import { Alert } from './Alert.js'
import { Card } from './Card.js'
import { FoldingCube } from './FoldingCube.js'
import { ReleaseNotes } from './ReleaseNotes.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function ReleaseNotesContainer(param) {
    const {
        parent, margin
    } = param;

    const releaseNotesCard = Card({
        title: 'Release Notes',
        width: '100%',
        margin: margin || '20px 0px 0px 0px',
        parent
    });

    releaseNotesCard.add();

    /** Loading Indicator */
    //TODO: replace with loading spinner
    const loadingIndicator = FoldingCube({
        label: 'Loading release notes',
        margin: '40px 0px',
        parent: releaseNotesCard
    });

    loadingIndicator.add();

    /** Get Items */
    const releaseNotes = await Get({
        list: 'ReleaseNotes',
        select: 'Id,Summary,Description,MajorVersion,MinorVersion,PatchVersion,ReleaseType',
        filter: `Status eq 'Published'`
    });

    if (releaseNotes?.length === 0) {
        const alertInfo = Alert({
            text: 'Release notes haven\'t been published for any version yet.',
            type: 'robi-secondary',
            margin: '20px 0px 0px 0px',
            parent: releaseNotesCard
        });

        alertInfo.add();
    }

    const groups = {};

    releaseNotes?.forEach(note => {
        const {
            MajorVersion, MinorVersion, PatchVersion
        } = note;

        const version = `${MajorVersion}.${MinorVersion}.${PatchVersion}`;

        if (!groups[version]) {
            groups[version] = [];
        }

        groups[version].push(note);
    });

    const versions = [];

    for (const key in groups) {
        versions.push(key);
    }

    for (let i = versions.length - 1; i >= 0; i--) {
        const releaseNotesComponent = ReleaseNotes({
            version: versions[i],
            notes: groups[versions[i]],
            parent: releaseNotesCard
        });

        releaseNotesComponent.add();
    }

    /** Remove loading indicator */
    loadingIndicator.remove();
}
// @END-File
