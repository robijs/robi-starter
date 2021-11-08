// Import Component from Actions. Used to create a Robi component.
import { Component } from '../Core/Actions.js'

/**
 * This is an example component. 
 * Use it as a launchpad to create custom components.
 * Recommend copying this file when createing new a new component.
 * 
 * @example
 * const exampleComponent = ExampleComponent({
 *     title: 'This was passed in',
 *     parent
 * });
 *
 * exampleComponent.add();
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Returns a Robi component created with the Component action.
 */
 export default function ExampleComponent(param) {
    // Destructure param
    const {
        title,
        parent,
        position
    } = param;

    // Create Robi component with Component function from Actions
    const component = Component({
        // Every component must be mdade of at least on valid HTML tag.
        // Just write regular 'ol HTML. Add your own classes or a library's
        // like Bootstrap or Tailwind.
        html: /*html*/ `
            <!-- Every component must be wrapped in a parent tag. -->
            <div class='example-component'>
                <!-- Combine classes from style property and libraries --> 
                <div class='example-component-title pb-2'>Example Title: ${title || ''}</div>
                <div class='alert alert-info mt-3 mb-0'>This is a bootstrap alert inside a Robi component</div>
            </div>
        `,
        // Define component styles
        style: /*css*/ `
            /* 
                Use the placeholder selected #id to refer to the
                component wraper tag.

                Example selector for child element: #id .child-class .child-child-class
            */  
            #id {
                background: ghostwhite;
                border-radius: 20px;
                padding: 40px;
                margin: 20px;
            }

            #id .example-component-title {
                font-weight: 700;
                border-bottom: solid 1px gray;
            }
        `,
        parent,
        position,
        // Attach event listeners to wrapper tag and children
        // Listeners will be attached to all tags that match selector
        events: [
            {
                selector: '#id',
                event: 'click',
                listener: componentAction
            }
        ],
        onAdd() {
            // Callback when component is added to DOM.
            // Use this to make changes to the component
            // that can only be done to HTMLElements.
            console.log(`Example component added to DOM with Id: ${component.get().id}`);
        }
    });

    // Private method
    function componentAction(event) {
        component.append(/*html*/ `
            <div class='alert alert-success mt-3 mb-0'>New alert added with click handler</div>
        `);
    }

    // Public method (attached to Robi component to be returned at end of function)
    component.privateMethod = (param) => {
        console.log('Argument passed to example component:', param);
    }

    // Return component so methods are available in calling context
    return component;
}