import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function DataTable(param) {
    const {
        buttonColor,
        headers,
        headerFilter,
        columns,
        buttons,
        cursor,
        checkboxes,
        striped,
        border,
        paging,
        search,
        info,
        ordering,
        order,
        rowId,
        addCSS,
        data,
        onRowClick,
        onSearch,
        onDraw,
        fontSize,
        nowrap,
        onSelect,
        onDeselect,
        rowCallback,
        createdRow,
        width,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <table class=
                'table table-sm 
                hover
                w-100 
                ${striped !== false ? 'table-striped' : 'table-not-striped'} 
                ${border !== false ? 'table-bordered' : 'table-not-bordered'} 
                animated 
                fadeIn
                ${nowrap !== false ? 'nowrap' : ''}'
            >
                <thead>
                    ${buildHeader()}
                </thead>    
            </table>
        `,
        style: /*css*/ `
            /** Horizontal scroll */
            #id_wrapper .row-2 {
                width: inherit;
            }

            #id_wrapper .row-2 .col-md-12 {
                overflow-x: overlay;
                padding-right: 0px;
                padding-left: 0px;
                padding-bottom: 10px;
                margin-right: 15px;
                margin-left: 15px;
            }

            /** Table */
            #id_wrapper {
                width: ${width || 'initial'};
                /* overflow-x: overlay; */
            }

            #id_wrapper .table {
                color: var(--color);
            }

            #id_wrapper tr {
                cursor: ${cursor || 'pointer'};
            }
            
            #id_wrapper tr td.dataTables_empty {
                cursor: default;
            }

            #id_wrapper table.dataTable.table-sm > thead > tr > th:not(.sorting_disabled) {
                padding-right: 25px;
            }

            /* 
            Toolbar 
            paging: false,
            search: false,
            ordering: false,
            */
            ${paging === false && search === false && ordering === false ?
                /*css*/ `
                    #id_wrapper .datatable-toolbar {
                        margin: 0px !important;
                    }
                ` :
                ''}

            #id_wrapper .datatable-toolbar {
                padding: 0px 15px;
                margin: 0px 0px 10px 0px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;
                /* min-height: 33.33px; */
                /* overflow: auto; */
            }

            #id_wrapper .datatable-toolbar .cell {
                display: flex;
                align-items: center;
            }

            #id_wrapper .datatable-toolbar .dataTables_length label,
            #id_wrapper .datatable-toolbar .dataTables_filter label {
                margin: 0px;
            }

            /* Striped */
            #id_wrapper .table-striped tbody tr:nth-of-type(odd) {
                background-color: var(--background);
            }

            #id_wrapper .table-striped tbody tr:nth-of-type(even) td {
                background-color: inherit;
            }

            #id_wrapper .table-striped tbody tr:nth-of-type(odd) td:first-child {
                border-radius: 10px 0px 0px 10px;
            }

            #id_wrapper .table-striped tbody tr:nth-of-type(odd) td:last-child {
                border-radius: 0px 10px 10px 0px;
            }

            #id_wrapper .table-striped tbody tr:first-child td:first-child {
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
            }

            #id_wrapper .table-striped tbody tr:first-child td:last-child {
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
            }

            /** Buttons */
            #id_wrapper .btn {
                font-size: 13px;
                border-radius: 10px;
                margin-right: 10px;
            }

            #id_wrapper .datatable-toolbar .btn-secondary {
                border-color: transparent;
                margin-right: 10px;
                border-radius: 8px;
            }

            #id_wrapper .datatable-toolbar .btn-secondary:focus {
                box-shadow: none;
            }

            /** Add Item Button */
            #id_wrapper .datatable-toolbar .add-item {
                background: var(--button-background);
                margin-right: 20px;
            }

            #id_wrapper .datatable-toolbar .add-item span {
                font-weight: 500;
                white-space: nowrap;
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--primary);
            }

            #id_wrapper .datatable-toolbar .add-item .icon {
                font-size: 16pt;
                margin-right: 5px;
                margin-left: -5px;
                fill: var(--primary);;
            }

            /** Disabled Button */
            #id_wrapper .datatable-toolbar .disabled .icon {
                stroke: gray !important;
                fill: gray !important;
            }

            /** Delete Item Button */
            #id_wrapper .datatable-toolbar .delete-item {
                font-size: 20px;
                background: ${buttonColor || 'var(--button-background)'} !important;
            }

            #id_wrapper .datatable-toolbar .delete-item span {
                display: flex;
                justify-content: center;
                align-items: center;
                color: firebrick;
            }

            #id_wrapper .datatable-toolbar .delete-item .icon {
                fill: var(--primary);
            }

            /** HTML5 Buttons */
            #id_wrapper .dt-buttons {
                flex-wrap: nowrap !important;
            }

            #id_wrapper .buttons-html5.ml-50 {
                margin-left: 50px;
            }

            #id_wrapper .buttons-html5 {
                color: #444;
                font-weight: 500;
                padding: 0px;
                flex: 1;
                display: flex;
            }

            #id_wrapper .buttons-html5:hover {
                background: none !important;
            }

            #id_wrapper .buttons-html5 span{
                color: var(--color) !important;
                display: inline-block;
                margin: 0px 10px;
                padding: 4px 24px;
                flex: 1;
                text-align: center;
                border-radius: 8px;
            }

            #id_wrapper .buttons-html5 span:hover {
                background-color: var(--primary-20);
            }

            #id_wrapper .buttons-html5:first-child span {
                margin-top: 10px;
            }

            #id_wrapper .buttons-html5:last-child span {
                margin-bottom: 10px;
            }

            /* Buttons Collection */
            #id_wrapper .dt-button-collection {
                width: calc(100% - 12px);
            }

            #id_wrapper .dt-button-collection .dropdown-menu {
                top: 4px;
                padding: 0px;
                display: flex;
                flex-direction: column;
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                border: none;
            }

            #id_wrapper .buttons-collection {
                background: ${buttonColor || 'var(--button-background)'} !important;
                border: none;
            }

            #id_wrapper .buttons-collection span {
                display: flex;
                color: #444;
                font-weight: 500;
            }

            #id_wrapper .buttons-collection span .icon {
                font-size: 20px;
                fill: var(--primary);
            }

            /** Select and Search */
            #id_wrapper .custom-select,
            #id_wrapper input[type='search'] {
                background: ${buttonColor || 'var(--button-background)'} !important;
            }

            #id_wrapper .dataTables_filter label {
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                background: ${buttonColor || 'var(--button-background)'} !important;
                padding-left: 10px;
            }

            #id_wrapper .dataTables_filter label:focus-within {
                border-color: transparent !important;
                box-shadow: 0 0 0 3px var(--primary-6b) !important;
            }

            #id_wrapper input[type='search'] {
                border-color: transparent !important;
                box-shadow: none !important;
            }

            /** Footer */
            #id_wrapper .datatable-footer {
                padding: 0px 15px;
                width: 100%;
                font-size: 12px;
                font-weight: 500;
                display: flex;
                justify-content: space-between;
            }

            #id_wrapper .datatable-footer .cell.left {
                display: flex;
                align-items: center;
            }

            /** Info */
            #id_wrapper .dataTables_info {
                padding: 0px;
            }

            /** Pagination */
            #id_wrapper .page-item .page-link {
                background: transparent;
                color: unset;
                border: none; /* FIXME: Experimental */
                padding: 3px 7px;
                border-radius: 6px;
            }

            #id_wrapper .page-item .page-link:focus {
                box-shadow: none;
            }

            #id_wrapper .page-item.active .page-link {
                color: white;
                background: var(--primary);;
                border: solid 1px var(--primary);
            }

            #id_wrapper .page-link:hover {
                background: rgb(${App.get('primaryColorRGB')}, .15);
            }

            /** Form control */
            #id_wrapper .form-control:focus {
                box-shadow: none;
                outline: none;
            }

            /** Table */
            #id_wrapper .dataTable {
                border-collapse: collapse !important;
                font-size: ${fontSize || '13px'};
            }

            /** Not Bordered*/
            #id_wrapper .table-not-bordered {
                border: none;
            }
            
            #id_wrapper .table-not-bordered thead td,
            #id_wrapper .table-not-bordered thead th {
                border-top: none;
            }
            
            /** Headers */
            #id_wrapper .table-border thead th {
                border-bottom: solid 1px rgb(${App.get('primaryColorRGB')}, .3);
                background: rgb(${App.get('primaryColorRGB')}, .2);
                color: var(--primary);
            }

            #id_wrapper :not(.table-border) thead th {
                vertical-align: bottom;
                border-bottom-width: 1px;
            }

            #id_wrapper .table-striped:not(.table-border) thead th {
                vertical-align: bottom;
                border-bottom-width: 0px;
            }

            /** Cells */
            #id_wrapper td,
            #id_wrapper th {
                border-top: none;
            }
            
            #id_wrapper td:focus {
                outline: none;
            }

            #id_wrapper td.bold {
                font-weight: 500;
            }

            /** Sorting */
            #id_wrapper .sorting_asc::before,
            #id_wrapper .sorting_asc::after,
            #id_wrapper .sorting_desc::before,
            #id_wrapper .sorting_desc::after {
                color: var(--primary);
            }

            #id_wrapper .sorting::after,
            #id_wrapper .sorting_asc::after,
            #id_wrapper .sorting_desc::after {
                right: .2em;
            }

            #id_wrapper .sorting::before {
                content: '▲';
            }

            #id_wrapper .sorting::after {
                content: '▼';
            }

            /** Select Checkbox */
            #id_wrapper tbody td.select-checkbox {
                vertical-align: middle;
            }

            #id_wrapper tbody td.select-checkbox:before, 
            #id_wrapper tbody th.select-checkbox:before {
                content: ' ';
                margin: 0 auto;
                border: solid 2px ${App.get('prefersColorScheme') === 'dark' ? '#444' : 'lightgray' };
                border-radius: 4px;
                position: initial;
                display: block;
                width: 16px;
                height: 16px;
                box-sizing: border-box;
            }

            #id_wrapper tbody td.select-checkbox:after, 
            #id_wrapper tbody th.select-checkbox:after {
                margin-top: -18px;
                top: auto;
                text-shadow: none;
                color: var(--primary);
                font-weight: bolder;
                font-size: 10pt;
            }

            /* Selected Row */
            #id_wrapper tbody > tr.selected {
                background-color: inherit !important;
            }

            #id_wrapper tbody > tr.selected td {
                background-color: var(--selected-row) !important;
                color:  var(--primary);
            }

            #id_wrapper tbody tr.selected a, 
            #id_wrapper tbody th.selected a,
            #id_wrapper tbody td.selected a {
                color: var(--primary);
            }

            #id_wrapper tbody > tr.selected td:first-child {
                border-radius: 10px 0px 0px 10px;
            }

            #id_wrapper tbody > tr.selected td:last-child {
                border-radius: 0px 10px 10px 0px;
            }

            #id .btlr-10 {
                border-top-left-radius: 10px;
            }
            
            #id .btrr-10 {
                border-top-right-radius: 10px;
            }

            #id .bbrr-10 {
                border-bottom-right-radius: 10px;
            }

            #id .bblr-10 {
                border-bottom-left-radius: 10px;
            }

            #id .btlr-0 {
                border-top-left-radius: 0px !important;
            }
            
            #id .btrr-0 {
                border-top-right-radius: 0px !important;
            }

            #id .bbrr-0 {
                border-bottom-right-radius: 0px !important;
            }

            #id .bblr-0 {
                border-bottom-left-radius: 0px !important;
            }

            /* Overflow MLOT field */
            #id_wrapper tbody td .dt-mlot {
                max-width: 200px;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            /* Bootstrap 5 overrides */
            #id_wrapper .table>:not(caption) > * > * {
                border-bottom-width: 0px;
            } 

            #id_wrapper .table > :not(:first-child) {
                border-top: none;
            }

            #id_wrapper .table thead {
                border-bottom-color: lightgray;
            }

            /* Toolbar row limit selector */
            #id_wrapper .dataTables_length label {
                display: flex;
                align-items: center;
            }

            #id_wrapper .dataTables_length label select {
                border-radius: 8px;
                margin: 0px 10px;
            }

            /** Dropdown menu */
            #id_wrapper .dropdown-menu {
                background: var(--inputBackground);
                box-shadow: var(--box-shadow);
            }

            ${addCSS || ''}
        `,
        parent,
        position,
        events: [

        ],
        onAdd() {
            setData({
                columns,
                data,
                onRowClick,
            });
        }
    });

    function buildHeader() {
        let html = /*html*/ `
            <tr>
        `;

        headers.forEach(item => {
            html += /*html*/ `
                <th>${item}</th>
            `;
        });

        html += /*html*/ `
            </tr>
        `;
        return html;
    }

    function setData(param) {
        const {
            columns, data, onRowClick,
        } = param;

        if (!component.get()) {
            return;
        }

        const tableId = `#${component.get().id}`;

        const options = {
            dom: `
                <'row'
                    <'datatable-toolbar'
                        <'cell left'
                            B
                        >
                        <'cell right'
                            ${search !== false ? 'f' : ''}
                        >
                    >
                >
                <'row row-2'
                    <'col-md-12'
                        t
                    >
                >
                <'row'
                    <'datatable-footer'
                        <'cell left'
                            ${info !== false ? 'i' : ''}
                        >
                        <'cell right'
                            p
                        >
                    >
                >
            `,
            language: {
                search: /*html*/ `
                    <span class='filter-search-icon d-inline-flex justify-content-center align-items-center'>
                        <svg class='icon' style='font-size: 16px; fill: #adb5bd;'>
                            <use href='#icon-bs-search'></use>
                        </svg>
                    </span>
                `
            },
            rowId,
            processing: true,
            // responsive: true,
            deferRender: true, // https://datatables.net/reference/option/deferRender
            order: order || [[1, 'asc']],
            columns,
            buttons: {
                dom: {
                  button: {
                    className: 'btn btn-robi'
                  }
                },
                buttons: buttons || []
            }
            // buttons: buttons || []
        };

        if (paging === false) {
            options.paging = false;
        } else {
            options.pageLength = 20;
        }

        if (ordering === false) {
            options.ordering = false;
        }

        if (checkboxes) {
            options.columnDefs = [
                {
                    targets: 0,
                    defaultContent: '',
                    orderable: false,
                    className: 'select-checkbox'
                }
            ];

            options.select = {
                style: 'multi+shift',
                selector: 'td:first-child'
            };
        } else {
            // options.select = 'single';
        }

        if (rowCallback) {
            options.rowCallback = rowCallback;
        }

        if (createdRow) {
            options.createdRow = createdRow;
        }

        if (headerFilter) {
            options.initComplete = function () {
                console.log('footer filter');

                var footer = $(this).append('<tfoot><tr></tr></tfoot>');

                // Apply the search
                this.api().columns().every(function (index) {
                    var that = this;

                    var data = this.data();

                    if (index === 6) {
                        return;
                    }

                    // Append input
                    // $(`${tableId} tfoot tr`).append('<th><input type="text" style="width:100%;" placeholder="Search column"></th>');
                    $(footer).append('<th><input type="text" style="width:100%;" placeholder="Search column"></th>');

                    $('input', this.footer()).on('keyup change clear', function () {
                        if (that.search() !== this.value) {
                            that
                                .search(this.value)
                                .draw();
                        }
                    });
                });
            };
        }

        // console.log('Table options:', options);
        // FIXME: Experimental
        options.preDrawCallback = function (settings) {
            var pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
            pagination.toggle(this.api().page.info().pages > 1);
        };

        /** Create table. */
        const table = $(tableId).DataTable(options)
            .on('click', 'tr', function (rowData) {
                /** DO NOT Change this to an arrow function! this reference required */
                if (rowData.target.classList.contains('select-checkbox')) {
                    return;
                }

                if (rowData.target.tagName.toLowerCase() === 'a') {
                    console.log(`Clicked link. Didn't fire onRowClick().`);

                    return;
                }

                rowData = $(tableId).DataTable().row(this).data();

                if (rowData && onRowClick) {
                    onRowClick({
                        row: this,
                        item: rowData
                    });
                }
            });

        /** Search event callback */
        if (onSearch) {
            table.on('search.dt', function (e, settings) {
                // console.log('Column search', table.columns().search().toArray());
                // console.log('Global search', table.search());
                onSearch({
                    jqevent: e,
                    table: table
                });
            });
        }

        /** Draw event callback */
        if (onDraw) {
            table.on('draw', function (e, settings) {
                // console.log('Column search', table.columns().search().toArray());
                // console.log('Global search', table.search());
                onDraw({
                    jQEvent: e,
                    table: table
                });
            });
        }

        /** Select callback */
        if (onSelect) {
            table.on('select', function (e, dt, type, indexes) {
                onSelect({
                    e,
                    dt,
                    type,
                    indexes
                });
            });
        }

        /** Deselect callback */
        if (onDeselect) {
            table.on('deselect', function (e, dt, type, indexes) {
                onDeselect({
                    e,
                    dt,
                    type,
                    indexes
                });
            });
        }

        /** Load and draw data. */
        table.rows.add(data).draw();

        /** Adjust columns */
        table.columns.adjust().draw();

        /** Header filter */
        if (headerFilter) {
            $(`${tableId} tfoot th`).each(function () {
                var title = $(this).text();
                $(this).html('<input type="text" placeholder="Search ' + title + '" />');
            });
        }
    }

    component.DataTable = () => {
        return $(`#${component.get()?.id}`)?.DataTable();
    };

    component.search = (term, column) => {
        $(`#${component.get().id}`).DataTable().columns(column).search(term).draw();
    };

    component.findRowById = (id) => {
        return $(`#${component.get().id}`).DataTable().row(`#${id}`);
    };

    component.updateRow = (param) => {
        const {
            row, data
        } = param;

        $(`#${component.get().id}`).DataTable().row(row).data(data).draw();
    };

    component.selected = () => {
        return $(`#${component.get().id}`).DataTable().rows({ selected: true }).data().toArray();
    };

    component.addRow = (param) => {
        const {
            data
        } = param;

        $(`#${component.get().id}`).DataTable().row.add(data).draw();
    };

    component.removeRow = (itemId) => {
        $(`#${component.get().id}`).DataTable().row(`#${itemId}`).remove().draw();
    };

    component.getButton = (className) => {
        return component.get().closest('.dataTables_wrapper').querySelector(`button.${className}`);
    };

    component.wrapper = () => {
        return component.get().closest('.dataTables_wrapper');
    }

    return component;
}
// @END-File
