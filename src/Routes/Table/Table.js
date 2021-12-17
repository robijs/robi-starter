import { Title } from '../../Robi/RobiUI.js'

/**
 * 
 * @param {*} param 
 */
export default async function Table(param) {
    const { parent } = param;

    // View title
    const viewTitle = Title({
        title: /* @START-Title */'Table'/* @END-Title */,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();
}