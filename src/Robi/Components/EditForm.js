import { DeleteItem } from '../Actions/DeleteItem.js'
import { UpdateItem } from '../Actions/UpdateItem.js'
import { ChoiceField } from './ChoiceField.js'
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
export async function EditForm({ fields, item, list, parent }) {
    if (!Array.isArray(fields)) {
        return false;
    }

    const components = fields.filter(field => field.name !== 'Id').map(field => {
        const { name, display, type, validate, choices, fillIn } = field;

        let component = {};

        switch (type) {
            case 'slot':
                component = SingleLineTextField({
                    label: display || name,
                    value: item[name],
                    parent,
                    onFocusout
                });
                break;
            case 'mlot':
                component = MultiLineTextField({
                    label: display || name,
                    value: item[name],
                    parent,
                    onFocusout
                });
                break;
            case 'number':
                component = NumberField({
                    label: display || name,
                    value: item[name],
                    parent,
                    onFocusout
                });
                break;
            case 'choice':
                component = ChoiceField({
                    label: display || name,
                    value: item[name],
                    setWidthDelay: 200,
                    options: choices.map(choice => {
                        return {
                            label: choice
                        };
                    }),
                    parent,
                    action: onFocusout 
                });
                break;
            case 'multichoice':
                component = MultiChoiceField({
                    label: display || name,
                    fillIn,
                    choices,
                    value: item[name].results,
                    parent,
                    validate: onFocusout
                });
                break;
            case 'date':
                component = DateField({
                    label: display || name,
                    value: item[name],
                    parent,
                    onFocusout
                });
                break;
        }

        function onFocusout() {
            return !validate ? undefined : (() => {
                const value = component.value();

                console.log('validate');
    
                if (validate(value)) {
                    component.isValid(true);
                } else {
                    component.isValid(false);
                }
            })();
        }

        component.add();

        return {
            component,
            field
        };
    });

    return {
        async onUpdate() {
            let isValid = true;

            const data = {};

            components.forEach(item => {
                const { component, field } = item;
                const { name, type, validate } = field;

                const value = component.value();

                console.log(name, value);

                switch (type) {
                    case 'slot':
                    case 'mlot':
                    case 'choice':
                    case 'date':
                        if (validate) {
                            const isValidated = validate(value);

                            if (isValidated) {
                                data[name] = value;
                                component.isValid(true);
                            } else {
                                isValid = false;
                                component.isValid(false);
                            }
                        } else if (value) {
                            data[name] = value;
                        }
                        break;
                    case 'multichoice':
                        if (validate) {
                            const isValidated = validate(value);

                            if (isValidated) {
                                data[name] = {
                                    results: value
                                };
                                component.isValid(true);
                            } else {
                                isValid = false;
                                component.isValid(false);
                            }
                        } else if (value.length) {
                            data[name] = {
                                results: value
                            };
                        }
                        break;
                    case 'number':
                        if (validate) {
                            const isValidated = validate(value);

                            if (isValidated) {
                                data[name] = value;
                                component.isValid(true);
                            } else {
                                isValid = false;
                                component.isValid(false);
                            }
                        } else if (value) {
                            data[name] = parseInt(value);
                        }
                        break;
                }
            });

            console.log(isValid, data);

            if (!isValid) {
                return false;
            }

            const updatedItem = await UpdateItem({
                list,
                itemId: item.Id,
                data
            });

            return updatedItem;
        },
        async onDelete() {
            const deletedItem = await DeleteItem({
                list,
                itemId: item.Id
            });

            return deletedItem;
        }
    };
}
// @END-File
