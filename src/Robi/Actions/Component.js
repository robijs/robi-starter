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
        style,
        parent,
        position,
        onAdd
    } = param;

    let {
        events
    } = param;

    const id = Store.getNextId();

    /** @private */
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

    function insertElement(localParent) {
        localParent = localParent || parent;

        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(html, 'text/html');
        const newElement = parsedHTML.body.firstElementChild;

        newElement.id = id;

        try {
            let parentElement;

            if (!localParent) {
                parentElement = document.querySelector('#app');
            } else if (localParent instanceof Element) {
                parentElement = localParent;
            } else if (localParent instanceof Object) {
                parentElement = localParent.get();
            }

            parentElement.insertAdjacentElement(position || 'beforeend', newElement);
        } catch (error) {
            console.log('Parent element removed from DOM. No need to render component.');
        }
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
        /** @todo remove this method */
        removeEvent(param) {
            const {
                selector,
                event,
                listener
            } = param;

            /** Find event */
            const eventItem = events.find(item => item.selector === selector && item.event === event && item.listener === listener);

            /** Deregister event */
            const index = events.indexOf(eventItem);

            console.log(index);

            /** Remove event element from events array */
            events.splice(index, 1);

            /** Remove event listner */
            selector.addEventListener(event, listener);
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
        getParam() {
            return param;
        },
        get() {
            return document?.querySelector(`#${id}`);
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
        closest(selector) {
            return this.get()?.closest(selector);
        },
        hide() {
            this.get().style.display = 'none';
        },
        show(display) {
            this.get().style.display = display || 'revert';
        },
        refresh() {
            this.remove();

            /** @todo This does not reset local variables (e.g. files array in Component_AttachFilesField) */
            this.add();
        },
        remove(delay = 0) {
            const node = this.get();

            if (delay) {
                setTimeout(removeStyleAndNode, delay);
            } else {
                removeStyleAndNode();
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
        empty() {
            this.get().innerHTML = '';
        },
        append(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('beforeend', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('beforeend', param);
            }

            return this;
        },
        prepend(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('afterbegin', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('afterbegin', param);
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
        after(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('afterend', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('afterend', param);
            }

            return this;
        },
        on(event, listener) {
            this.get().addEventListener(event, listener);
        },
        off(event, listener) {
            this.get().removeEventListener(event, listener);
        },
        add(localParent) {
            addStyle();
            insertElement(localParent);
            addEventListeners();

            if (onAdd) {
                onAdd();
            }
        }
    };
}
// @END-File
