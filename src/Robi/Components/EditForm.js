import { DeleteItem } from '../Actions/DeleteItem.js'
import { UpdateItem } from '../Actions/UpdateItem.js'
import { BootstrapDropdown } from './BootstrapDropdown.js'
import { MultiChoiceField } from './MultiChoiceField.js'
import { MultiLineTextField } from './MultiLineTextField.js'
import { NumberField } from './NumberField.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { DateField } from './DateField.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export async function EditForm(param) {
    const { event, fields, item, list, modal, parent, table } = param;

    console.log(param);

    const components = fields
        ?.filter(field => field.name !== 'Id')
        ?.map(field => {
            const { name, display, type, choices, action } = field;

            let component = {};

            switch (type) {
                case 'slot':
                    component = SingleLineTextField({
                        label: display || name,
                        value: item[name],
                        parent
                    });
                    break;
                case 'mlot':
                    component = MultiLineTextField({
                        label: display || name,
                        value: item[name],
                        parent
                    });
                    break;
                case 'number':
                    component = NumberField({
                        label: display || name,
                        value: item[name],
                        parent
                    });
                    break;
                case 'choice':
                    component = BootstrapDropdown({
                        label: display || name,
                        value: item[name] || choices[0],
                        setWidthDelay: 200,
                        options: choices.map(choice => {
                            return {
                                label: choice
                            };
                        }),
                        parent
                    });
                    break;
                case 'multichoice':
                    console.log(name);
                    component = MultiChoiceField({
                        label: display || name,
                        choices,
                        // value: item[name] || choices[0],
                        parent
                    });
                    break;
                case 'date':
                    component = DateField({
                        label: display || name,
                        value: item[name],
                        parent
                    });
                    break;
            }

            component.add();

            return {
                component,
                field
            };
        });

    return {
        async onUpdate(event) {
            const data = {};

            components
                .forEach(item => {
                    const { component, field } = item;
                    const { name, type } = field;

                    const value = component.value();

                    switch (type) {
                        case 'slot':
                        case 'mlot':
                        case 'choice':
                            if (value) {
                                data[name] = value;
                            }
                            break;
                        case 'number':
                            if (value) {
                                data[name] = parseInt(value);
                            }
                            break;
                    }
                });

            console.log(data);

            const updatedItem = await UpdateItem({
                list,
                itemId: item.Id,
                data
            });

            return updatedItem;
        },
        async onDelete(event) {
            const deletedItem = await DeleteItem({
                list,
                itemId: item.Id
            });

            return deletedItem;
        }
    };
}
// @END-File
