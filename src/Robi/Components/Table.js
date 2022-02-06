import { DeleteItem } from '../Actions/DeleteItem.js'
import { Get } from '../Actions/Get.js'
import { Route } from '../Actions/Route.js'
import { Container } from './Container.js'
import { DataTable } from './DataTable.js'
import { Modal } from './Modal.js'
import { EditForm } from './EditForm.js'
import { NewForm } from './NewForm.js'
import { TableToolbar } from './TableToolbar.js'
import { App } from '../Core/App.js'
import { Lists } from '../Models/Lists.js'
import { Wait } from '../Robi.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function Table(param) {
    const {
        addButton,
        addButtonValue,
        advancedSearch,
        border,
        buttonColor,
        checkboxes,
        createdRow,
        defaultButtons,
        deleteButton,
        editButton,
        editForm,
        editFormTitle,
        exportButtons,
        filter,
        formFooter,
        formView,
        headerFilter,
        heading,
        list,
        margin,
        newForm,
        newFormTitle,
        onRowClick,
        onDelete,
        openInModal,
        order,
        padding,
        parent,
        path,
        showId,
        titleDisplayName,
        toolbar,
        top,
        view,
        width
    } = param;

    let {
        buttons, fields, items
    } = param;

    // App Lists
    const lists = App.lists();

    const tableContainer = Container({
        display: 'block',
        classes: ['table-container', 'w-100'],
        shimmer: true,
        minHeight: '200px',
        radius: '20px',
        width,
        margin,
        padding,
        parent
    });

    tableContainer.add();

    // Columns
    const headers = [];
    const columns = [];

    if (checkboxes !== false) {
        headers.push('');
        columns.push({
            data: null,
        });
    }

    // Item Id
    const idProperty = 'Id';
    let formFields = [];
    let schema;

    if (list) {
        if (App.isDev()) {
            await Wait(1000);
        }

        // TODO: Only select fields from view
        items = items || await Get({
            path,
            top,
            list,
            select: '*,Author/Name,Author/Title,Editor/Name,Editor/Title',
            expand: `Author/Id,Editor/Id`,
            filter
        });

        // Get fields in view
        schema = lists.concat(Lists()).find(item => item.list === list);
            
        if (view) {
            fields = fields || schema?.views
                .find(item => item.name === view)
                ?.fields
                .map(name => {
                    // FIXME: Set default SharePoint Fields (won't be listed in schema)
                    // TODO: Only set 'Name' as an option if schema?.template === 101
                    const spFields = ['Created', 'Modified', 'Author', 'Editor', 'Name'];
                    if (spFields.includes(name)) {
                        return { name };
                    } else {
                        return schema?.fields.find(field => field.name === name);
                    }
                });

            if (formView) {
                if (formView === 'All') {
                    formFields = lists.concat(Lists()).find(item => item.list === list)?.fields;
                } else {
                    formFields = schema?.views
                        .find(item => item.name === view)
                        ?.fields
                        .map(name => {
                            // FIXME: Set default SharePoint Fields (won't be listed in schema)
                            // TODO: Only set 'Name' as an option if schema?.template === 101
                            const spFields = ['Created', 'Modified', 'Author', 'Editor', 'Name'];
                            if (spFields.includes(name)) {
                                return { name };
                            } else {
                                return schema?.fields.find(field => field.name === name);
                            }
                        });
                }
            } else {
                formFields = fields;
            }
        } else {
            // If no view, get all fields
            // FIXME: redundant
            fields = fields || lists.concat(Lists()).find(item => item.list === list)?.fields;
            formFields = fields;
        }

        if (!fields) {
            console.log('Missing fields');
            return;
        }

        [{ name: 'Id', display: 'Id', type: 'number' }]
            .concat(fields)
            .forEach(field => {
                const {
                    name, display, type, render
                } = field;

                headers.push(display || name);

                const columnOptions = {
                    data: name === titleDisplayName ? 'Title' : name,
                    type: name === 'Id' || type === 'number' ? 'num' : 'string',
                    visible: name === 'Id' && !showId ? false : true
                };

                // Classes
                if (name === 'Id') {
                    columnOptions.className = 'do-not-export bold';
                    columnOptions.render = (data, type, row) => {
                        return data;
                    };
                }

                // Render
                if (render) {
                    columnOptions.render = render;
                }

                else if (name.includes('Percent')) {
                    columnOptions.render = (data, type, row) => {
                        return `${Math.round(parseFloat(data || 0) * 100)}%`;
                    };
                }

                else if (type === 'mlot') {
                    columnOptions.render = (data, type, row) => {
                        return /*html*/ `
                        <div class='dt-mlot'>${data || ''}</data>
                    `;
                    };
                }

                // NOTE: What will break on this?
                else if (type === 'multichoice') {
                    columnOptions.render = (data, type, row) => {
                        return data ? data.results.join(', ') : '';
                    };
                }

                else if (type === 'date') {
                    columnOptions.render = (data, type, row) => {
                        // return data ? new Date(data).toLocaleString() : '';
                        return data ? new Date(data.split('T')[0].replace(/-/g, '\/')).toLocaleDateString() : '';
                    };
                }

                else if (name === 'Author') {
                    columnOptions.render = (data, type, row) => {
                        return data.Title.split(' ').slice(0, 2).join(' ');
                    };
                }

                else if (name.includes('Created')) {
                    columnOptions.render = (data, type, row) => {
                        // return data ? new Date(data).toLocaleString() : '';
                        return data ? new Date(data).toLocaleDateString() : '';
                    };
                }

                else if (name !== 'Id') {
                    columnOptions.render = (data, type, row) => {
                        return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
                    };
                }

                columns.push(columnOptions);
            });
    } else {
        (Array.isArray(fields) ? fields : fields.split(','))
        .forEach(field => {
            const {
                render
            } = field;

            const internalFieldName = typeof field === 'object' ? field.internalFieldName : field;
            const displayName = typeof field === 'object' ? field.displayName : field;
            const type = typeof field === 'object' ? field.type || 'slot' : 'slot';

            headers.push(displayName);

            const columnOptions = {
                data: internalFieldName === titleDisplayName ? 'Title' : internalFieldName,
                type: internalFieldName === 'Id' ? 'number' : 'string',
                visible: internalFieldName === 'Id' && !showId ? false : true
            };

            /** Classes */
            if (internalFieldName === 'Id') {
                columnOptions.className = 'do-not-export bold';
                columnOptions.render = (data, type, row) => {
                    return data;
                };
            }

            /** Render */
            if (render) {
                columnOptions.render = render;
            }

            else if (internalFieldName.includes('Percent')) {
                columnOptions.render = (data, type, row) => {
                    return `${Math.round(parseFloat(data || 0) * 100)}%`;
                };
            }

            else if (type === 'mlot') {
                columnOptions.render = (data, type, row) => {
                    return /*html*/ `
                    <div class='dt-mlot'>${data || ''}</data>
                `;
                };
            }

            else if (type === 'date') {
                columnOptions.render = (data, type, row) => {
                    // return data ? new Date(data).toLocaleString() : '';
                    return data ? new Date(data.split('T')[0].replace(/-/g, '\/')).toLocaleDateString() : '';
                };
            }

            else if (internalFieldName === 'Author') {
                columnOptions.render = (data, type, row) => {
                    return data.Title;
                };
            }

            else if (internalFieldName.includes('Created')) {
                columnOptions.render = (data, type, row) => {
                    // return data ? new Date(data).toLocaleString() : '';
                    return data ? new Date(data).toLocaleDateString() : '';
                };
            }

            else if (internalFieldName !== 'Id') {
                columnOptions.render = (data, type, row) => {
                    return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
                };
            }

            columns.push(columnOptions);
        });
    }

    // Buttons
    if (!Array.isArray(buttons)) {
        buttons = [];
    }

    if (addButton !== false) {
        buttons.push({
            text: /*html*/ `
                <svg class='icon'>
                    <use href='#icon-bs-plus'></use>
                </svg>
                <span>${addButtonValue || 'Add item'}</span>
            `,
            className: 'add-item',
            name: 'add',
            action: function (e, dt, node, config) {
                if (openInModal) {
                    Route(`${list}/New`);
                } else {
                    const newModal = Modal({
                        contentPadding: '30px',
                        title: newFormTitle || `New Item`,
                        async addContent(modalBody) {
                            const formParam = {
                                event: e,
                                fields: formFields,
                                list,
                                modal: newModal,
                                parent: modalBody,
                                table
                            };

                            if (schema?.newForm) {
                                // NOTE: Must pass in all fields, not just what the selected view provides
                                formParam.fields = schema?.fields;
                                selectedForm = await schema?.newForm(formParam);
                            } else if (newForm) {
                                selectedForm = await newForm(formParam);
                            } else {
                                selectedForm = await NewForm(formParam);
                            }

                            // Set button value
                            if (selectedForm?.label) {
                                newModal.getButton('Create').innerText = selectedForm.label;
                            }

                            if (selectedForm) {
                                newModal.showFooter();
                            }
                        },
                        buttons: {
                            footer: [
                                {
                                    value: 'Cancel',
                                    classes: '',
                                    data: [
                                        {
                                            name: 'dismiss',
                                            value: 'modal'
                                        }
                                    ]
                                },
                                // TODO: send modal prop to form
                                {
                                    value: 'Create',
                                    classes: 'btn-robi',
                                    async onClick(event) {
                                        // Call newForm.onCreate() and wait for it to complete
                                        const newItem = await selectedForm?.onCreate(event);

                                        // TODO: Don't create item if newItem == false;

                                        if (!newItem) {
                                            console.log('Data not valid, alert user');
                                            return;
                                        }

                                        // Disable button - Prevent user from clicking this item more than once
                                        $(event.target)
                                            .attr('disabled', '')
                                            .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating');

                                        if (Array.isArray(newItem)) {
                                            items.concat(newItem);

                                            newItem.forEach(item => {
                                                table.addRow({
                                                    data: item
                                                });
                                            });
                                        } else {
                                            items.push(newItem);

                                            table.addRow({
                                                data: newItem
                                            });
                                        }

                                        // Enable button
                                        $(event.target)
                                            .removeAttr('disabled')
                                            .text('Created');

                                        // Close modal (DOM node will be removed on hidden.bs.modal event)
                                        newModal.close();
                                    }
                                }
                            ]
                        },
                        parent: tableContainer
                    });

                    newModal.add();
                }
            }
        });
    }

    if (defaultButtons !== false) {
        if (checkboxes !== false && deleteButton !== false) {
            buttons.push({
                text: /*html*/ `
                    <svg class='icon'>
                        <use href='#icon-bs-trash'></use>
                    </svg>
                `,
                className: 'delete-item',
                name: 'delete',
                enabled: false,
                action: async function (e, dt, node, config) {
                    const selected = table.selected();
                    const button = tableContainer.find('.delete-item');
                    button.disabled = true;
                    button.innerHTML = /*html*/ `<span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span>`;

                    // Delete items
                    for (let row in selected) {
                        console.log(selected[row]);

                        // Delete item
                        await DeleteItem({
                            list,
                            itemId: selected[row].Id
                        });

                        // Delete Row
                        table.removeRow(selected[row].Id);
                    }

                    if (onDelete) {
                        await onDelete(table);
                    }

                    button.innerHTML = /*html*/ `
                        <span>
                            <svg class="icon">
                                <use href="#icon-bs-trash"></use>
                            </svg>
                        </span>
                    `;
                }
            });
        }

        if (exportButtons !== false) {
            buttons.push({
                extend: 'collection',
                autoClose: true,
                background: false,
                fade: 0,
                text: /*html*/ `
                    <svg class="icon">
                        <use href="#icon-bs-arrow-down-circle-fill"></use>
                    </svg>
                `,
                buttons: [
                    {
                        extend: 'excelHtml5',
                        // className: 'ml-50',
                        exportOptions: {
                            header: false,
                            footer: false,
                            columns: ':not(.do-not-export):not(.select-checkbox)'
                        }
                    },
                    {
                        extend: 'csvHtml5',
                        exportOptions: {
                            header: false,
                            footer: false,
                            columns: ':not(.do-not-export):not(.select-checkbox)'
                        }
                    },
                    {
                        extend: 'pdfHtml5',
                        orientation: 'landscape',
                        exportOptions: {
                            columns: ':not(.do-not-export):not(.select-checkbox)'
                        }
                    }
                    // {
                    //     extend: 'copyHtml5',
                    //     exportOptions: {
                    //         columns: [3,4,5,6,7,8,9,10,11]
                    //     }
                    // },
                ]
            });
        }

        let show = true;

        if (editButton !== false) {
            buttons.push({
                text: 'Edit',
                className: 'btn-robi-light',
                name: 'edit-mode',
                action: async function (e, dt, node, config) {
                    if (show) {
                        e.target.innerText = 'Done';
                        table.hide();
                        show = false;

                        console.clear();

                        // Show editable table
                        const pageData = table.DataTable().rows( {page:'current'} ).data();

                        table.after(/*html*/ `
                            <table class='w-100 editable-table'>
                                <thead>
                                    <tr>
                                        ${
                                            headers
                                            .filter(h => h)
                                            .map(header => {
                                                console.log(header);

                                                return /*html*/ `
                                                    <th>${header}</th>
                                                `;
                                            }).join('\n')
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    ${
                                        pageData.map(row => {
                                            console.log(row);

                                            return /*html*/ `
                                                <tr>
                                                    ${
                                                        columns
                                                        .filter(c => c.data)
                                                        .map(column => {
                                                            const { data } = column;

                                                            // TODO: Add input tag based on field type
                                                            return /*html*/ `
                                                                <td>${row[data]}</td>
                                                            `;
                                                        }).join('\n')
                                                    }
                                                </tr>
                                            `;
                                        }).join('\n')
                                    }
                                </tbody>
                            </table>
                        `)
                    } else {
                        e.target.innerText = 'Edit';
                        table.show();
                        show = true;
                        tableContainer.find('.editable-table')?.remove();
                    }
                }
            });
        }
    }

    // Toolbar
    if (toolbar || advancedSearch) {
        const tableToolbar = TableToolbar({
            heading: heading || ( heading === '' ? '' : list ? (lists.find(item => item.list === list)?.display || list.split(/(?=[A-Z])/).join(' '))  : '' ),
            options: toolbar || [],
            parent: tableContainer,
            advancedSearch,
            list,
            newForm: schema?.newForm,
            editForm: schema?.editForm,
            action(label) {
                const { filter } = toolbar.find(option => option.label === label);

                // Clear
                table.DataTable().clear().draw();
                
                // Filter
                table.DataTable().rows.add(filter(items)).draw();
                
                // Adjust
                table.DataTable().columns.adjust().draw();
            },
            async search({ button, filters }) {
                // TODO: add loading message
                // Disable button
                button.disabled = true;
                button.innerHTML = /*html*/ `
                    <span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span>
                `;

                // TODO: wrap preceding fields in ( ) if operator is OR
                const oDataQuery = filters.map(filter => {
                    const { column, condition, value, operator, type } = filter;

                    let query;
                    
                    switch(condition) {
                        case 'contains':
                            query = `(substringof('${value}', ${column}) eq true`
                            break;
                        case 'equals':
                            // TODO: add support for date, lookup, and multichoice fields
                            query = `${column} eq ${type === 'number' ? value : `'${value}'`}`;
                            break;
                        case 'not equal to':
                            // TODO: add support for date, lookup, and multichoice fields
                            query = `${column} ne ${type === 'number' ? value : `'${value}'`}`
                    }

                    return `${query}${operator ? ` ${operator.toLowerCase()} ` : ''}`;
                }).join('');

                console.log(oDataQuery);

                const getItems = await Get({
                    list,
                    filter: oDataQuery
                });

                console.log(getItems);

                // Clear
                table.DataTable().clear().draw();

                // Filter
                table.DataTable().rows.add(getItems).draw();
                
                // Adjust
                table.DataTable().columns.adjust().draw();

                // Enable button
                button.disabled = false;
                button.innerHTML = 'Search';
            }
        });
    
        tableToolbar.add();
    }

    // Currently selected item, row, and form
    let selectedItem;
    let selectedRow;
    let selectedForm;

    // DataTable component
    const table = DataTable({
        headers,
        headerFilter,
        buttonColor,
        checkboxes: checkboxes !== false ? true : false,
        striped: true,
        border: border || false,
        width: '100%',
        columns,
        data: items,
        rowId: idProperty,
        order: order || [[1, 'asc']], /** Sort by 1st column (hidden Id field at [0]) {@link https://datatables.net/reference/api/order()} */
        buttons,
        createdRow,
        onRowClick: onRowClick || function (param) {
            const {
                row, item
            } = param;

            selectedRow = row;
            selectedItem = item;

            // Open edit form full screen
            if (openInModal) {
                Route(`${list}/${selectedItem.Id}`);
            } else {
                // Open edit form in modal
                const rowModal = Modal({
                    title: editFormTitle || `Edit Item`,
                    contentPadding: '30px',
                    async addContent(modalBody) {
                        const formParam = { item, table, row, fields: formFields, list, modal: rowModal, parent: modalBody };

                        if (schema?.editForm) {
                            selectedForm = await schema?.editForm(formParam);
                        } else if (editForm) {
                            selectedForm = await editForm(formParam);
                        } else {
                            selectedForm = await EditForm(formParam);
                        }

                        if (formFooter !== false) {
                            rowModal.showFooter();
                        }
                    },
                    buttons: {
                        footer: [
                            {
                                value: 'Cancel',
                                classes: '',
                                data: [
                                    {
                                        name: 'dismiss',
                                        value: 'modal'
                                    }
                                ]
                            },
                            {
                                value: 'Update',
                                // disabled: true,
                                classes: 'btn-robi',
                                async onClick(event) {
                                    // Call newForm.onUpdate() and wait for it to complete
                                    const updatedItem = await selectedForm?.onUpdate(event);

                                    if (!updatedItem) {
                                        console.log('Data not valid, alert user');

                                        return;
                                    }

                                    /** Disable button - Prevent user from clicking this item more than once */
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating');

                                    table.updateRow({
                                        row: selectedRow,
                                        data: updatedItem
                                    });

                                    /** Enable button */
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Updated');

                                    /** Hide modal */
                                    rowModal.getModal().modal('hide');
                                }
                            },
                            {
                                value: 'Delete',
                                // disabled: true,
                                classes: 'btn-robi-light',
                                async onClick(event) {
                                    /** Disable button - Prevent user from clicking this item more than once */
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleteing');

                                    // Call newForm.onDelete() and wait for it to complete
                                    await selectedForm?.onDelete(event);

                                    table.removeRow(selectedItem.Id);

                                    /** Enable button */
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Deleted');

                                    /** Hide modal */
                                    rowModal.getModal().modal('hide');
                                }
                            }
                        ]
                    },
                    parent: tableContainer
                });

                rowModal.add();
            }
        },
        onSelect(param) {
            const selected = table.selected();

            // console.log('select', selected);

            if (selected.length > 0) {
                table.DataTable().buttons('delete:name').enable();
            }

            setSelectedRadius();
        },
        onDeselect(param) {
            const selected = table.selected();

            // console.log('deselect', selected);

            if (selected.length === 0) {
                table.DataTable().buttons('delete:name').disable();
            }

            setSelectedRadius();
            removeSelectedRadius();
        },
        onDraw(param) {
            const {
                jqevent, table
            } = param;

            // const data = table.rows({ search: 'applied' }).data().toArray();
            // console.log(param);

            setSelectedRadius();
            removeSelectedRadius();
        },
        parent: tableContainer
    });

    table.add();

    // Shimmer off
    tableContainer.shimmerOff();

    // FIXME: This only works if selected rows are grouped together
    // TODO: Handle one or more groups of selected rows (ex: rows [1, 2, 3] and [4,5] and [8,9])
    function setSelectedRadius() {
        // Find all rows
        const rows = table.findAll('tbody tr.selected');

        // Reset
        rows.forEach(row => {
            row.querySelector('td:first-child').classList.remove('btlr-0', 'bblr-0');
            row.querySelector('td:last-child').classList.remove('btrr-0', 'bbrr-0');
        });

        // Remove radius from first and last row
        if (rows.length >= 2) {
            rows[0].querySelector('td:first-child').classList.add('bblr-0');
            rows[0].querySelector('td:last-child').classList.add('bbrr-0');

            rows[rows.length - 1].querySelector('td:first-child').classList.add('btlr-0');
            rows[rows.length - 1].querySelector('td:last-child').classList.add('btrr-0');
        }

        // Remove radius from middle rows (every row except first and last)
        if (rows.length >= 3) {
            const middle = [...rows].filter((row, index) => index !== 0 && index !== rows.length - 1);
            middle.forEach(row => {
                row.querySelector('td:first-child').classList.add('btlr-0', 'bblr-0');
                row.querySelector('td:last-child').classList.add('btrr-0', 'bbrr-0');
            });
        }
    }

    function removeSelectedRadius() {
        // Find all rows
        const rows = table.findAll('tbody tr:not(.selected)');

        // Reset
        rows.forEach(row => {
            row.querySelector('td:first-child').classList.remove('btlr-0', 'bblr-0');
            row.querySelector('td:last-child').classList.remove('btrr-0', 'bbrr-0');
        });
    }

    
    // TODO: Generalize
    // TODO: If form is modal, launch modal
    // TODO: If form is view, Route to view
    // Open modal
    // if (itemId) {
    //     const row = table.findRowById(itemId);

    //     if (row) {
    //         if (row.show) {
    //             row.show().draw(false).node().click();
    //         } else {
    //             row.draw(false).node().click();
    //         }
    //     }
    // }

    return table;
}
// @END-File
