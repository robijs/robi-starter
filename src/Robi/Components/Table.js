import { DeleteItem } from '../Actions/DeleteItem.js'
import { Get } from '../Actions/Get.js'
import { Route } from '../Actions/Route.js'
import { Container } from './Container.js'
import { DataTable } from './DataTable.js'
import { Heading } from './Heading.js'
import { LoadingSpinner } from './LoadingSpinner.js'
import { Modal } from './Modal.js'
import { EditForm } from './EditForm.js'
import { NewForm } from './NewForm.js'
import { TableToolbar } from './TableToolbar.js'
import { App } from '../Core/App.js'
import { Lists } from '../Models/Lists.js'

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
        editForm,
        editFormTitle,
        exportButtons,
        filter,
        formFooter,
        formView,
        headerFilter,
        heading,
        headingColor,
        headingMargin,
        headingSize,
        list,
        margin,
        newForm,
        newFormTitle,
        onDelete,
        openInModal,
        order,
        padding,
        parent,
        showId,
        titleDisplayName,
        toolbar,
        view,
        width
    } = param;

    let {
        buttons, fields, items
    } = param;

    const tableContainer = Container({
        display: 'block',
        classes: ['table-container'],
        width,
        margin,
        padding,
        parent
    });

    tableContainer.add();

    // Heading
    let legendHeading;

    if (heading || list) {
        legendHeading = Heading({
            text: heading || (heading === '' ? '' : list.split(/(?=[A-Z])/).join(' ')),
            size: headingSize,
            color: headingColor,
            margin: headingMargin || (toolbar ? '0px' : '0px 0px 35px 0px'),
            parent: tableContainer
        });

        legendHeading.add();
    }

    // Columns
    const headers = [];
    const columns = [];

    if (checkboxes !== false) {
        headers.push('');
        columns.push({
            data: null,
        });
    }

    // App Lists
    const lists = App.lists();

    // Item Id
    const idProperty = 'Id';
    let formFields = [];

    if (list) {
        // Show loading spinner
        const loadingSpinner = LoadingSpinner({
            type: 'robi', 
            message: `Loading ${list}`,
            parent: tableContainer
        });

        loadingSpinner.add();

        // TODO: Only select fields from view
        items = items || await Get({
            list,
            select: '*,Author/Name,Author/Title,Editor/Name,Editor/Title',
            expand: `Author/Id,Editor/Id`,
            filter
        });

        // Get fields in view
        const schema = lists.concat(Lists()).find(item => item.list === list);
            
        if (view) {
            fields = schema?.views
                .find(item => item.name === view)
                ?.fields
                .map(name => {
                    // FIXME: Set default SharePoint Fields (won't be listed in schema)
                    // TODO: Only set 'Name' as an option if schema.template === 101
                    const spFields = ['Created', 'Modified', 'Author', 'Editor', 'Name'];
                    if (spFields.includes(name)) {
                        return { name };
                    } else {
                        return schema.fields.find(field => field.name === name);
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
                            // TODO: Only set 'Name' as an option if schema.template === 101
                            const spFields = ['Created', 'Modified', 'Author', 'Editor', 'Name'];
                            if (spFields.includes(name)) {
                                return { name };
                            } else {
                                return schema.fields.find(field => field.name === name);
                            }
                        });
                }
            } else {
                formFields = fields;
            }
        } else {
            // If no view, get all fields
            // FIXME: redundant
            fields = lists.concat(Lists()).find(item => item.list === list)?.fields;
            formFields = lists.concat(Lists()).find(item => item.list === list)?.fields;
        }

        if (!fields) {
            console.log('Missing fields');
            return;
        }

        // Remove loading
        loadingSpinner.remove();

        [{ name: 'Id', display: 'Id', type: 'number' }]
            .concat(fields)
            .forEach(field => {
                const {
                    name, display, type, render
                } = field;

                headers.push(display || name);

                const columnOptions = {
                    data: name === titleDisplayName ? 'Title' : name,
                    type: name === 'Id' ? 'number' : 'string',
                    visible: name === 'Id' && !showId ? false : true
                };

                /** Classes */
                if (name === 'Id') {
                    columnOptions.className = 'do-not-export bold';
                    columnOptions.render = (data, type, row) => {
                        return data;
                    };
                }

                /** Render */
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

                else if (name === 'Author') {
                    columnOptions.render = (data, type, row) => {
                        return data.Title.split(' ').slice(0, 2).join(' ');
                    };
                }

                else if (name.includes('Created') || name.includes('Date')) {
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
        /** typeof fields === 'object' */
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

                else if (internalFieldName === 'Author') {
                    columnOptions.render = (data, type, row) => {
                        return data.Title;
                    };
                }

                else if (internalFieldName.includes('Created') || internalFieldName.includes('Date')) {
                    columnOptions.render = (data, type, row) => {
                        return new Date(data).toLocaleString();
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

    /** Table Buttons */
    if (defaultButtons !== false) {
        if (!Array.isArray(buttons)) {
            buttons = [];
        }

        if (checkboxes !== false) {
            buttons = buttons.concat([
                {
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
                }
            ]);
        }

        if (exportButtons !== false) {
            buttons = buttons.concat([
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
            ]);
        }
    }

    if (addButton !== false) {
        buttons.unshift({
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

                            selectedForm = newForm ? await newForm(formParam) : await NewForm(formParam);

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
                                        // Disable button - Prevent user from clicking this item more than once
                                        $(event.target)
                                            .attr('disabled', '')
                                            .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating');

                                        // Call newForm.onCreate() and wait for it to complete
                                        const newItem = await selectedForm?.onCreate(event);

                                        if (Array.isArray(newItem)) {
                                            newItem.forEach(item => {
                                                table.addRow({
                                                    data: item
                                                });
                                            })
                                        } else {
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

    // Toolbar
    // Test
    if (toolbar || advancedSearch) {
        const tableToolbar = TableToolbar({
            options: toolbar || [],
            parent: tableContainer,
            advancedSearch,
            list,
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

    // Selected item, row, and form
    let selectedItem;
    let selectedRow;
    let selectedForm;

    /** Table */
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
        onRowClick(param) {
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

                        selectedForm = editForm ? await editForm(formParam) : await EditForm(formParam);

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
                                    /** Disable button - Prevent user from clicking this item more than once */
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating');

                                    // Call newForm.onUpdate() and wait for it to complete
                                    const updatedItem = await selectedForm?.onUpdate(event);

                                    if (updatedItem) {
                                        table.updateRow({
                                            row: selectedRow,
                                            data: updatedItem
                                        });
                                    }

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

    return table;
}
// @END-File
