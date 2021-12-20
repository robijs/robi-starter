import { Table, Title } from '../../Robi/RobiUI.js'

export default async function Measures({ parent }) {
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

    // @START-Table:Test
    await Table({
        list: 'Test',
        parent,
        advancedSearch: true,
        toolbar: [
               {
                label: 'All',
                filter(data) {
                    return data;
                }
            },
            {
                label: 'One',
                filter(data) {
                    return data.filter(item => item.Choice === 'One');
                }
            },
            {
                label: 'Two',
                filter(data) {
                    return data.filter(item => item.Choice === 'Two');
                }
            },
            {
                label: 'Three',
                filter(data) {
                    return data.filter(item => item.Choice === 'Three');
                }
            }
        ]
    });
    // @END-Table:Test
}