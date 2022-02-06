// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.
// Otherwise, changes made from CLI and GUI tools won't work properly.

import { CreateItem } from '../../Robi/Robi.js'
import { ChoiceField, MultiChoiceField, MultiLineTextField, NumberField, Row, SingleLineTextField } from '../../Robi/RobiUI.js'

// @START-AllTypes
export default async function NewForm({ fields, list, modal, parent }) {
    console.log(list, 'custom new form');

    // @START-Title
    modal.setTitle('New Item');
    // @END-Title

    // @Start-Props
    const [
        SLOT_props,
        MLOT_props,
        Number_props,
        Choice_props,
        MultiChoice_props,
    ] = fields;
    // @END-Props

    // @START-Fields
    let SLOT_field;
    let MLOT_field;
    let Number_field;
    let Choice_field;
    let MultiChoice_field;
    // @END-Fields

    // @START-Rows
    Row(async (parent) => {
        const { name, display, validate, value } = MLOT_props;

        MLOT_field = MultiLineTextField({
            label: display || name,
            value,
            fieldMargin: '0px',
            parent,
            onFocusout
        });

        function onFocusout() {
            return !validate ? undefined : (() => {
                const value = MLOT_field.value();

                console.log('validate');

                if (validate(value)) {
                    MLOT_field.isValid(true);
                } else {
                    MLOT_field.isValid(false);
                }
            })();
        }

        MLOT_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display, validate, value } = Number_props;

        Number_field = NumberField({
            label: display || name,
            value,
            fieldMargin: '0px',
            parent,
            onFocusout
        });

        function onFocusout() {
            return !validate ? undefined : (() => {
                const value = Number_field.value();

                console.log('validate');

                if (validate(value)) {
                    Number_field.isValid(true);
                } else {
                    Number_field.isValid(false);
                }
            })();
        }

        Number_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display, validate, value } = SLOT_props;

        SLOT_field = SingleLineTextField({
            label: 'Hard code label',
            value,
            fieldMargin: '0px',
            parent,
            onFocusout
        });

        function onFocusout() {
            return !validate ? undefined : (() => {
                const value = SLOT_field.value();

                console.log('validate');

                if (validate(value)) {
                    SLOT_field.isValid(true);
                } else {
                    SLOT_field.isValid(false);
                }
            })();
        }

        SLOT_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display, value, choices, validate } = Choice_props;

        Choice_field = ChoiceField({
            label: display || name,
            fieldMargin: '0px',
            value,
            options: choices.map(choice => {
                return {
                    label: choice
                };
            }),
            parent,
            action
        });

        function action() {
            return !validate ? undefined : (() => {
                const value = Choice_field.value();

                console.log('validate');

                if (validate(value)) {
                    Choice_field.isValid(true);
                } else {
                    Choice_field.isValid(false);
                }
            })();
        }

        Choice_field.add();
    }, { parent });
    // @Row
    Row(async (parent) => {
        const { name, display, choices, fillIn, validate, value } = MultiChoice_props;

        MultiChoice_field = MultiChoiceField({
            label: display || name,
            value,
            fieldMargin: '0px',
            choices,
            fillIn,
            parent,
            validate: onValidate
        });

        function onValidate() {
            return !validate ? undefined : (() => {
                const value = MultiChoice_field.value();

                console.log('validate');

                if (validate(value)) {
                    MultiChoice_field.isValid(true);
                } else {
                    MultiChoice_field.isValid(false);
                }
            })();
        }

        MultiChoice_field.add();
    }, { parent });
    // @END-Rows

    // @START-Return
    return {
        async onCreate(event) {
            let isValid = true;

            const data = {};

            if (SLOT_props.validate) {
                const isValidated = SLOT_props.validate(SLOT_field.value());
            
                if (isValidated) {
                    data.SLOT = SLOT_field.value();
                    SLOT_field.isValid(true);
                } else {
                    isValid = false;
                    SLOT_field.isValid(false);
                }
            } else if (value) {
                data.SLOT = SLOT_field.value();
            }

            if (MLOT_props.validate) {
                const isValidated = MLOT_props.validate(MLOT_field.value());
            
                if (isValidated) {
                    data.MLOT = MLOT_field.value();
                    MLOT_field.isValid(true);
                } else {
                    isValid = false;
                    MLOT_field.isValid(false);
                }
            } else if (value) {
                data.MLOT = MLOT_field.value();
            }

            if (Number_props.validate) {
                const isValidated = Number_props.validate(Number_field.value());
            
                if (isValidated) {
                    data.Number = Number_field.value();
                    Number_field.isValid(true);
                } else {
                    isValid = false;
                    Number_field.isValid(false);
                }
            } else if (value) {
                data.Number = parseInt(Number_field.value());
            }

            if (Choice_props.validate) {
                const isValidated = Choice_props.validate(Choice_field.value());
            
                if (isValidated) {
                    data.Choice = Choice_field.value();
                    Choice_field.isValid(true);
                } else {
                    isValid = false;
                    Choice_field.isValid(false);
                }
            } else if (value) {
                data.Choice = Choice_field.value();
            }

            if (MultiChoice_props.validate) {
                const isValidated = MultiChoice_props.validate(MultiChoice_field.value());
            
                if (isValidated) {
                    data.MultiChoice = {
                        results: MultiChoice_field.value()
                    }
                    MultiChoice_field.isValid(true);
                } else {
                    isValid = false;
                    MultiChoice_field.isValid(false);
                }
            } else if (value) {
                data.MultiChoice = {
                    results: MultiChoice_field.value()
                }
            }

            console.log(isValid, data);

            if (!isValid) {
                return false;
            }

            const newItem = await CreateItem({
                list,
                data
            });

            return newItem;
        },
        label: 'Create'
    };
    // @END-Return
}
// @END-AllTypes
