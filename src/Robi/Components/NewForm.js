import { CreateItem } from '../Actions/CreateItem.js'
import { ChoiceField } from './ChoiceField.js'
import { DateField } from './DateField.js'
import { MultiLineTextField } from './MultiLineTextField.js'
import { MultiChoiceField } from './MultiChoiceField.js'
import { NumberField } from './NumberField.js'
import { SingleLineTextField } from './SingleLineTextField.js' 

// @START-File
/**
 * 
 * @param {*} param
 * @returns 
 */
export async function NewForm({ fields, list, parent }) {
    if (!Array.isArray(fields)) {
        return false;
    }

    const components = fields.filter(field => field.name !== 'Id').map(field => {
        const { name, display, type, value, validate, choices, fillIn } = field;

        let component = {};

        switch (type) {
            case 'slot':
                component = SingleLineTextField({
                    label: display || name,
                    value,
                    parent,
                    onFocusout
                });
                break;
            case 'mlot':
                component = MultiLineTextField({
                    label: display || name,
                    value,
                    parent,
                    onFocusout
                });
                break;
            case 'number':
                component = NumberField({
                    label: display || name,
                    value,
                    parent,
                    onFocusout
                });
                break;
            case 'choice':
                component = ChoiceField({
                    label: display || name,
                    value,
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
                    value,
                    fillIn,
                    choices,
                    parent,
                    validate: onFocusout
                });
                break;
            case 'date':
                component = DateField({
                    label: display || name,
                    value,
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
        async onCreate() {
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

            const newItem = await CreateItem({
                list,
                data
            });

            return newItem;
        }
    };
}
// @END-File
