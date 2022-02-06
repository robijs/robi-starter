import { Get } from '../Actions/Get.js'
import { Alert } from './Alert.js'
import { Card } from './Card.js'
import { ReleaseNotes } from './ReleaseNotes.js'
import { LoadingSpinner } from './LoadingSpinner.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function ReleaseNotesContainer(param) {
    const {
        parent, margin, padding, title
    } = param;

    const releaseNotesCard = Card({
        title: title !== '' ? 'Release Notes' : '',
        width: '100%',
        margin: margin || '0px',
        padding: padding || undefined,
        parent
    });

    releaseNotesCard.add();

    /** Loading Indicator */
    const loadingIndicator = LoadingSpinner({
        message: 'Loading release notes',
        type: 'robi',
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
            text: 'None',
            type: 'robi-primary',
            // margin: '10px 0px 0px 0px',
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
