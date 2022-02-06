import { Style } from '../Actions/Style.js'
import { Alert } from './Alert.js'
import { ChoiceField } from './ChoiceField.js'
import { Container } from './Container.js'
import { LinksField } from './LinksField.js'
import { MultiChoiceField } from './MultiChoiceField.js'
import { MultiLineTextField } from './MultiLineTextField.js'
import { NumberField } from './NumberField.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { TaggleField } from './TaggleField.js'
import { DropZone } from './DropZone.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function FormSection(param) {
    const { section, listInfo, item, parent: parentConatiner, heading } = param;
    const { name, path, info, rows } = section;
    const { list, fields } = listInfo;

    const parent = Container({
        display: 'block',
        width: '100%',
        padding: '0px 0px 30px 0px',
        parent: parentConatiner
    });

    parent.add();

    if (heading) {
        const headingContainer = Container({
            padding: '0px 10px',
            parent,
        });

        headingContainer.add();

        const sectionTitle = Alert({
            type: 'robi-secondary',
            width: '100%',
            margin: '0px 0px 20px 0px',
            text: /*html*/ `
                <h6 class='mb-0'>${heading}</h6>
            `,
            parent: headingContainer
        });

        sectionTitle.add();
    }

    if (section.info) {
        const infoAlert = Alert({
            type: 'robi-secondary',
            text: info,
            margin: '0px 10px 20px 10px',
            parent
        });

        infoAlert.add();
    }

    // TODO: Pass form name in, this is supposed to be generic
    const formData = item ? Store.getData(`edit measure ${item.Id}`) : Store.getData('new measure');

    // console.log('Form Data:', formData);

    let components = [];

    rows.forEach(row => {
        const { name: rowName, fields: rowFields, description: rowDescription, type } = row;

        // console.log(rowName, rowDescription);
        const rowContainer = type ?
            Alert({
                margin: '10px 20px',
                type,
                parent
            }) :
            Container({
                display: 'block',
                width: '100%',
                padding: '10px 20px',
                parent
            });

        rowContainer.add();

        if (rowName) {
            rowContainer.append(/*html*/ `
                <div class='mb-1'>
                    <h6 style='color: var(--color); font-weight: 700'>${rowName}</h6>
                </div>
            `);
        }

        if (rowDescription) {
            rowContainer.append(/*html*/ `
                <div class="mb-4" style='font-size: 14px;'>${rowDescription}</div>
            `);
        }

        const fieldRow = Container({
            display: 'flex',
            align: 'stretch',
            width: '100%',
            parent: rowContainer
        });

        fieldRow.add();

        Style({
            name: `form-row-${fieldRow.get().id}`,
            style: /*css*/ `
                #${fieldRow.get().id} .form-field {
                    flex: 1;
                }

                #${fieldRow.get().id} .form-field:not(:last-child) {
                    margin-right: 20px;
                }
            `
        });

        rowFields?.forEach(field => {
            const { name, label, style, component: customComponent, description: customDescription } = field;
            // const label = label || display || name;
            const parent = fieldRow;
            let fieldMargin = '0px';
            let component = {};

            // Render passed in component
            if (customComponent) {
                component = customComponent({
                    item,
                    parent,
                    formData,
                    getComponent() {
                        return component;
                    } 
                });
            }
            
            // If field name is Files, render drop zone
            else if (name === 'Files') {
                component = DropZone({
                    label: label || display || name,
                    description: customDescription,
                    // value: formData[name],
                    value: formData.Files,
                    list,
                    itemId: item?.Id,
                    parent,
                    fieldMargin,
                    onChange(files) {
                        console.log('files value', files);
                        formData.Files = files;
                    }
                });
            }
            
            // Render field by type
            else {
                const { display, description: defaultDescription, type, choices, fillIn, action } = fields?.find(item => item.name === name);
                // const description = customDescription || defaultDescription;
                
                let description;

                if (customDescription === false) {
                    description = '';
                } else if (customDescription) {
                    description = customDescription;
                } else if (defaultDescription === false) {
                    description = '';
                } else if (defaultDescription) {
                    description = defaultDescription;
                }

                switch (type) {
                    case 'slot':
                        let placeholder = '';
                        let addon = '';

                        if (name.toLowerCase().includes('email')) {
                            // placeholder = 'first.mi.last.civ@mail.mil';
                            addon = '@';
                        } else if (name.toLowerCase().includes('name')) {
                            // placeholder = 'First Last'
                        } else if (name.toLowerCase().includes('office')) {
                            // placeholder = 'Example: J-5 AED'
                        }

                        component = SingleLineTextField({
                            label: label || display || name,
                            description,
                            value: formData[name],
                            placeholder,
                            action,
                            addon,
                            parent,
                            fieldMargin,
                            // TODO: Complete compare against published measures
                            async onKeyup(event) {
                                // Set form data
                                formData[name] = component.value();

                                // // Drop down Menu
                                // const query = event.target.value;
                                // const menu = component.find('.dropdown-menu');

                                // // console.log(query);

                                // if (query) {
                                //     if (!menu) {
                                //         // console.log('add menu');

                                //         const height = component.get().offsetHeight;
                                //         const width = component.get().offsetWidth;

                                //         component.find('.form-control').insertAdjacentHTML('afterend', /*html*/ `
                                //             <div class='dropdown-menu show' style='font-size: 13px; position: absolute; width: ${width}px; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, ${height + 5}px);'>
                                //                 <div class='d-flex justify-content-between align-items-center mt-2 mb-2 ml-3 mr-3'>
                                //                     <div style='color: var(--primary);'>Searching for measures with similar names...</div>
                                //                     <div class='spinner-grow spinner-grow-sm' style='color: var(--primary);' role='status'></div>
                                //                 </div> 
                                //             </div>
                                //         `);

                                //         // Get list items
                                //         const listItems = await Get({
                                //             list: 'Measures'
                                //         });

                                //     } else {
                                //         // console.log('menu already added');
                                //     }
                                // } else {
                                //     if (menu) {
                                //         // console.log('remove menu');
                                //         menu.remove();
                                //     } else {
                                //         // console.log('menu already removed');
                                //     }
                                // }
                            }
                        });
                        break;
                    case 'mlot':
                        // TODO: Dark mode
                        // TODO: Pass type or custom component instead of assuming intent by field name
                        if (name.toLowerCase() === 'tags') {
                            component = TaggleField({
                                label: label || display || name,
                                description,
                                tags: formData[name],
                                parent,
                                fieldMargin,
                                onTagAdd(event, tag) {
                                    // console.log('tags: ', component.value());
                                    // Set form data
                                    formData[name] = component.value();
                                },
                                onTagRemove(event, tag) {
                                    // console.log('tags: ', component.value());
                                    // Set form data
                                    formData[name] = component.value();
                                }
                            });
                        // TODO: Pass type or custom component instead of assuming intent by field name
                        } else if (name.toLowerCase() === 'dashboardlinks' || name.toLowerCase() === 'links') {
                            component = LinksField({
                                label: label || display || name,
                                links: formData[name],
                                description,
                                parent,
                                fieldMargin,
                                onChange(event) {
                                    // Set form data
                                    formData[name] = JSON.stringify(component.value());
                                }
                            });
                        } else {
                            component = MultiLineTextField({
                                label: label || display || name,
                                value: formData[name],
                                description,
                                parent,
                                fieldMargin,
                                onKeyup(event) {
                                    // Set form data
                                    formData[name] = component.value();
                                }
                            });
                        }

                        break;
                    case 'number':
                        component = NumberField({
                            label: label || display || name,
                            description,
                            value: formData[name],
                            fieldMargin,
                            parent,
                            onKeyup(event) {
                                // Set form data
                                console.log(formData, formData[name], component.value());
                                formData[name] = component.value();
                            }
                        });
                        break;
                    case 'choice':
                        component = ChoiceField({
                            label: label || display || name,
                            description,
                            value: formData[name],
                            fillIn,
                            options: choices.map(choice => {
                                return {
                                    label: choice
                                };
                            }),
                            parent,
                            fieldMargin,
                            onChange() {
                                formData[name] = component.value();
                            }
                        });
                        break;
                    case 'multichoice':
                        component = MultiChoiceField({
                            label: label || display || name,
                            description,
                            choices,
                            fillIn,
                            value: formData[name]?.results,
                            parent,
                            fieldMargin,
                            onChange(event) {
                                formData[name] = {
                                    results: component.value()
                                };
                            }
                        });
                        break;
                    default:
                        console.log('missing component for field type: ', type);
                        return;
                }
            }

            // Add component to DOM
            component.add();

            // Apply passed in styles
            if (style) {
                for (const property in style) {
                    // console.log(`${property}: ${style[property]}`);
                    component.get().style[property] = style[property];
                }
            }

            // Push component to list of components
            components.push({
                component,
                field
            });
        });
    });

    return components;
}
// @END-File
