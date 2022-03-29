import { Store } from '../Core/Store.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
 export function Component(param) {
    const {
        name,
        locked,
        html,
        // TODO: prop for customStyle vs globalStyle
        // NOTE: or style.shared & style.instance
        style,
        parent,
        position,
        onAdd,
        onRemove
    } = param;

    let {
        events
    } = param;

    const id = Store.getNextId();

    function addElement(localParent) {
        addStyle();

        localParent = localParent || parent;

        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(html, 'text/html');
        const newElement = parsedHTML.body.firstElementChild;

        newElement.id = id;

        try {
            let parentElement;

            // If not parent or local parent passed in,
            // look for a node with id 'app'
            if (!localParent) {
                parentElement = document.querySelector('#app');
            } 
            
            // If parent or local parent is a string,
            // assume the string is a selector and look for a node
            // that matches it
            else if (typeof localParent === 'string') {
                parentElement = document.querySelector(localParent);
            } 
            
            // If parent or local parent is an Element,
            // use it directly
            else if (localParent instanceof Element) {
                parentElement = localParent;
            } 
            
            // If parent or local parent is an object,
            // assume it's a valid component and access
            // it's DOM node wit the get() method
            else if (localParent instanceof Object) {
                parentElement = localParent.get();
            }

            // If one of the above resulted in a valid DOM node
            // with the method insertAdjacentElement(),
            // call the method with the position argument or default to
            // 'beforeend'
            if (parentElement && parentElement.insertAdjacentElement) {
                parentElement.insertAdjacentElement(position || 'beforeend', newElement);
                
                // Now that the componet has been successfully added to the DOM,
                // it's safe to try adding defined event handlers
                addEventListeners();
    
                // Return true so the calling function knows if
                // the component was successfully added to the DOM
                // NOTE: Might change this to actually look for the node
                // in the DOM just to be sure
                return true;
            }

        } catch (error) {
            console.log(`Parent element removed from DOM. Can't render '${id}'.`);
        }
    }

    function addStyle() {
        const styleNodeWithSameName = document.querySelector(`style[data-name='${name}']`);

        if (name && styleNodeWithSameName) {
            return;
        }

        const css = /*html*/ `
            <style type='text/css' data-name='${name || id}' data-type='component' data-locked='${name || locked ? 'yes' : 'no'}' >
                ${style.replace(/#id/g, `#${id}`)}
            </style>
        `;
        const head = document.querySelector('head');

        head.insertAdjacentHTML('beforeend', css);
    }

    function addEventListeners() {
        if (!events) {
            return;
        }

        events.forEach(item => {
            const { selector, event, listener } = item;
            const eventTypes = event.split(' ');

            eventTypes.forEach(event => {
                if (typeof selector === 'string') {
                    const replaceIdPlaceholder = selector.replace(/#id/g, `#${id}`);

                    document.querySelectorAll(replaceIdPlaceholder).forEach((node) => {
                        node.addEventListener(event, listener);
                    });
                } else {
                    selector.addEventListener(event, listener);
                }
            });
        });
    }

    return {
        add(localParent) {
            const didAdd = addElement(localParent);

            if (didAdd && onAdd) {
                onAdd();
            } else {
                console.log(`Component '${id}' not added. Can't run onAdd.`)
            }
        },
        addClass(name) {
            this.get().classList.add(name);
        },
        addEvent(param) {
            /** Register event */
            events.push(param);

            /** Add event listner */
            const {
                event,
                listener
            } = param;

            this.get().addEventListener(event, listener);
        },
        after(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('afterend', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('afterend', param);
            }

            return this;
        },
        append(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('beforeend', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('beforeend', param);
            }

            return this;
        },
        before(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('beforebegin', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('beforebegin', param);
            }

            return this;
        },
        closest(selector) {
            return this.get()?.closest(selector);
        },
        empty() {
            this.get().innerHTML = '';
        },
        find(selector) {
            const node = this.get()?.querySelector(selector);
            
            if (node) {
                node.on = (event, listener) => {
                    node.addEventListener(event, listener);
                }

                return node;
            }
        },
        findAll(selector) {
            return this.get()?.querySelectorAll(selector);
        },
        get() {
            return document?.querySelector(`#${id}`);
        },
        getParam() {
            return param;
        },
        hide() {
            this.get().style.display = 'none';
        },
        id() {
            return id;
        },
        off(event, listener) {
            this.get().removeEventListener(event, listener);
        },
        on(event, listener) {
            this.get().addEventListener(event, listener);
        },
        prepend(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('afterbegin', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('afterbegin', param);
            }

            return this;
        },
        refresh() {
            this.remove();
            this.add();
        },
        remove(delay = 0) {
            const node = this.get();

            if (delay) {
                setTimeout(removeStyleAndNode, delay);
            } else {
                removeStyleAndNode();
            }

            if (onRemove && !this.get()) {
                onRemove();
            }

            function removeStyleAndNode() {
                const styleNode = document.querySelector(`style[data-name='${id}']`);

                if (styleNode) {
                    styleNode.remove();
                }

                if (node) {
                    node.remove();
                }
            }
        },
        removeClass(name) {
            this.get().classList.remove(name);
        },
        removeEvents() {
            events.forEach(item => {
                const eventTypes = item.event.split(' ');

                eventTypes.forEach(event => {
                    if (typeof item.selector === 'string') {
                        const replaceIdPlaceholder = item.selector.replace(/#id/g, `#${id}`);

                        document.querySelectorAll(replaceIdPlaceholder).forEach((node) => {
                            node.removeEventListener(event, item.listener);
                        });
                    } else {
                        item.selector.removeEventListener(event, item.listener);
                    }
                });
            });
        },
        show(display) {
            this.get().style.display = display || 'revert';
        }
    };
}
// @END-File
