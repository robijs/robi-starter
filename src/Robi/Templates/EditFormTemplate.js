// @START-File
/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function EditFormTemplate({ list, fields }) {
    if (!list && !fields) {
        return;
    }

    console.log(fields);

    const fieldsToCreate = fields.filter(field => field.name !== 'Id');

    let template = [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.`,
        `// Otherwise, changes made from CLI and GUI tools won't work properly.`,
        ``,
        `import { UpdateItem, DeleteItem } from '../../Robi/Robi.js'`,
        `import { ${modules()} } from '../../Robi/RobiUI.js'`,
        ``,
        `// @START-${list}`,
        `export default async function EditForm({ item, fields, list, modal, parent }) {`,
        `    console.log(list, 'custom edit form');`,
        ``,
        `    // @START-Title`,
        `    modal.setTitle('Edit Item');`,
        `    // @END-Title`,
        ``,
        `    // @Start-Props`,
        `    const [`
    ];

    function modules() {
        return [... new Set([ 'Row' ].concat(fieldsToCreate.map(field => {
            const {type } = field;

            switch (type) {
                case 'slot':
                    return 'SingleLineTextField';
                case 'mlot':
                    return 'MultiLineTextField';
                case 'number':
                    return 'NumberField';
                case 'choice':
                    return 'ChoiceField';
                case 'multichoice':
                    return 'MultiChoiceField';
                case 'date':
                    return 'DateField';
            }
        })).sort())].join(', ');
    }

    template = template.concat(fieldsToCreate.map(field => `        ${field.name}_props,`));

    template = template.concat([
        `    ] = fields;`,
        `    // @END-Props`,
        ``,
        `    // @START-Fields`
    ]);

    template = template.concat(fieldsToCreate.map(field => `    let ${field.name}_field;`));

    template = template.concat([
        `    // @END-Fields`,
        ``,
        `    // @START-Rows`
    ]);

    fieldsToCreate.forEach((field, index) => {
        const { name, type } = field;

        let row = [
            `    Row(async (parent) => {`
        ];
        let component = [];

        switch (type) {
            case 'slot':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = SingleLineTextField({`,
                    `            label: display || name,`,
                    `            value: item[name],`,
                    `            fieldMargin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onFocusout() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'mlot':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = MultiLineTextField({`,
                    `            label: display || name,`,
                    `            value: item[name],`,
                    `            fieldMargin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onFocusout() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'number':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = NumberField({`,
                    `            label: display || name,`,
                    `            value: item[name],`,
                    `            fieldMargin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onFocusout() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'choice':
                component = [
                    `        const { name, display, value, choices, validate } = ${name}_props;`,
                    ``,
                    `        ${name}_field = ChoiceField({`,
                    `            label: display || name,`,
                    `            fieldMargin: '0px',`,
                    `            value: item[name],`,
                    `            options: choices.map(choice => {`,
                    `                return {`,
                    `                    label: choice`,
                    `                };`,
                    `            }),`,
                    `            parent,`,
                    `            action`,
                    `        });`,
                    ``,
                    `        function action() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'multichoice':
                component = [
                    `        const { name, display, choices, fillIn, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = MultiChoiceField({`,
                    `            label: display || name,`,
                    `            value: item[name]?.results,`,
                    `            fieldMargin: '0px',`,
                    `            choices,`,
                    `            fillIn,`,
                    `            parent,`,
                    `            validate: onValidate`,
                    `        });`,
                    ``,
                    `        function onValidate() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ]
                break;
            case 'date':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = DateField({`,
                    `            label: display || name,`,
                    `            value: item[name],`,
                    `            margin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onValidate() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
        }

        row = row.concat(component);
        row = row.concat([
            `    }, { parent });`,
        ]);

        if (index !== fieldsToCreate.length - 1) {
            row.push(`    // @Row`);
        }

        template = template.concat(row);
    });

    template = template.concat([
        `    // @END-Rows`,
        ``,
        `    // @START-Return`,
        `    return {`,
        `        async onUpdate(event) {`,
        `            let isValid = true;`,
        ``,
        `            const data = {};`,
        ``
    ]);

    fieldsToCreate?.forEach(field => {
        template = template.concat([
            setFieldValue(field),
            ``
        ]);
    });

    function setFieldValue(field) {
        const { type, name } = field;

        switch (type) {
            case 'slot':
            case 'mlot':
            case 'choice':
            case 'date':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = ${name}_props.validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = ${name}_field.value();`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = ${name}_field.value();`,
                    `            }`,
                ].join('\n');
            case 'multichoice':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = ${name}_props.validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = {`,
                    `                        results: ${name}_field.value()`,
                    `                    }`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = {`,
                    `                    results: ${name}_field.value()`,
                    `                }`,
                    `            }`,
                ].join('\n');
            case 'number':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = ${name}_props.validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = ${name}_field.value();`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = parseInt(${name}_field.value());`,
                    `            }`,
                ].join('\n');
        }
    }

    template = template.concat([
        `            console.log(isValid, data);`,
        ``,
        `            if (!isValid) {`,
        `                return false;`,
        `            }`,
        ``,
        `            const updatedItem = await UpdateItem({`,
        `                list,`,
        `                itemId: item.Id,`,
        `                data`,
        `            });`,
        ``,
        `            return updatedItem;`,
        `        },`,
        `        async onDelete(event) {`,
        `            const deletedItem = await DeleteItem({`,
        `                list,`,
        `                itemId: item.Id`,
        `            });`,
        ``,
        `            return deletedItem;`,
        `        },`,
        `        label: 'Update'`,
        `    };`,
        `    // @END-Return`,
        `}`,
        `// @END-${list}`,
        ``
    ]).join('\n');

    return template;

    // if (!list && !fields) {
    //     return;
    // }

    // console.log(fields);

    // const fieldsToCreate = fields.filter(field => field.name !== 'Id');

    // let template = [
    //     `// This file can be edited programmatically.`,
    //     `// If you know the API, feel free to make changes by hand.`,
    //     `// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.`,
    //     `// Otherwise, changes made from CLI and GUI tools won't work properly.`,
    //     ``,
    //     `import { UpdateItem, DeleteItem } from '../../Robi/Robi.js'`,
    //     `import { ${modules()} } from '../../Robi/RobiUI.js'`,
    //     ``,
    //     `// @START-${list}`,
    //     `export default async function EditForm({ event, fields, item, list, modal, parent, table }) {`,
    //     `    console.log(list, 'custom edit form');`,
    //     ``,
    //     `    // @START-Title`,
    //     `    modal.setTitle('Edit Item');`,
    //     `    // @END-Title`,
    //     ``,
    //     `    // @Start-Props`,
    //     `    const [`
    // ];

    // function modules() {
    //     return [ 'Row' ].concat(fieldsToCreate.map(field => {
    //         const {type } = field;

    //         switch (type) {
    //             case 'slot':
    //                 return 'SingleLineTextField';
    //             case 'mlot':
    //                 return 'MultiLineTextField';
    //             case 'number':
    //                 return 'NumberField';
    //             case 'choice':
    //                 return 'ChoiceField';
    //             case 'multichoice':
    //                 return 'MultiChoiceField';
    //             case 'date':
    //                 return 'DateField';
    //         }
    //     })).sort().join(', ');
    // }

    // template = template.concat(fieldsToCreate.map(field => `        ${field.name}_props,`));

    // template = template.concat([
    //     `    ] = fields;`,
    //     `    // @END-Props`,
    //     ``,
    //     `    // @START-Fields`
    // ]);

    // template = template.concat(fieldsToCreate.map(field => `    let ${field.name}_field;`));

    // template = template.concat([
    //     `    // @END-Fields`,
    //     ``,
    //     `    // @START-Rows`
    // ]);

    // fieldsToCreate?.forEach((field, index) => {
    //     const { name, display, type, choices, action, value } = field;

    //     let row = [
    //         `    Row(async (parent) => {`
    //     ];
    //     let component = [];

    //     switch (type) {
    //         case 'slot':
    //             component = [
    //                 `        const { name, display } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = SingleLineTextField({`,
    //                 `            label: display || name,`,
    //                 `            fieldMargin: '0px',`,
    //                 `            value: item[name],`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ];
    //             break;
    //         case 'mlot':
    //             component = [
    //                 `        const { name, display } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = MultiLineTextField({`,
    //                 `            label: display || name,`,
    //                 `            fieldMargin: '0px',`,
    //                 `            value: item[name],`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ];
    //             break;
    //         case 'number':
    //             component = [
    //                 `        const { name, display } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = NumberField({`,
    //                 `            label: display || name,`,
    //                 `            fieldMargin: '0px',`,
    //                 `            value: item[name],`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ];
    //             break;
    //         case 'choice':
    //             component = [
    //                 `        const { name, display, value, choices } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = ChoiceField({`,
    //                 `            label: display || name,`,
    //                 `            fieldMargin: '0px',`,
    //                 `            value: item[name],`,
    //                 `            options: choices.map(choice => {`,
    //                 `                return {`,
    //                 `                    label: choice`,
    //                 `                };`,
    //                 `            }),`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ];
    //             break;
    //         case 'multichoice':
    //             component = [
    //                 `        const { name, display, choices, fillIn } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = MultiChoiceField({`,
    //                 `            label: display || name,`,
    //                 `            fieldMargin: '0px',`,
    //                 `            choices,`,
    //                 `            fillIn,`,
    //                 `            value: item[name],`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ]
    //             break;
    //         case 'date':
    //             component = [
    //                 `        const { name, display } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = DateField({`,
    //                 `            label: display || name,`,
    //                 `            margin: '0px',`,
    //                 `            value: item[name]`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ];
    //             break;
    //     }

    //     row = row.concat(component);
    //     row = row.concat([
    //         `    }, { parent });`,
    //     ]);

    //     if (index !== fieldsToCreate.length - 1) {
    //         row.push(`    // @Row`);
    //     }

    //     template = template.concat(row);
    // });

    // template = template.concat([
    //     `    // @END-Rows`,
    //     ``,
    //     `    // @START-Return`,
    //     `    return {`,
    //     `        async onUpdate(event) {`,
    //     `            const data = {};`,
    //     ``
    // ]);

    // fieldsToCreate?.forEach(field => {
    //     const { name } = field;
    //     template = template.concat([
    //         `            if (${name}_field.value()) {`,
    //         `                data.${name} = ${name}_field.value();`,
    //         `            }`,
    //         ``,
    //     ])
    // });

    // template = template.concat([
    //     `            console.log(data);`,
    //     ``,
    //     `            const updatedItem = await UpdateItem({`,
    //     `                list,`,
    //     `                itemId: item.Id,`,
    //     `                data`,
    //     `            });`,
    //     ``,
    //     `            return updatedItem;`,
    //     `        },`,
    //     `        async onDelete(event) {`,
    //     `            const deletedItem = await DeleteItem({`,
    //     `                list,`,
    //     `                itemId: item.Id`,
    //     `            });`,
    //     ``,
    //     `            return deletedItem;`,
    //     `        },`,
    //     `        label: 'Update'`,
    //     `    };`,
    //     `    // @END-Return`,
    //     `}`,
    //     `// @END-${list}`,
    //     ``
    // ]).join('\n');

    // return template;
}
// @END-File
