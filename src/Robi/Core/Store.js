// @START-File
const store = {
    elementIdCounter: 0,
    viewScrollTop: 0,
    data: {},
    abortControllers: [],
    workers: [],
    components: {},
    models: {},
    lists: {},
    user: {},
    routes: []
};

const Store = {
    add(param) {
        const {
            type,
        } = param;

        switch (type) {
            case 'list':
                {
                    const {
                        list,
                        items
                    } = param;
        
                    store.lists[list] = items;
                    break;
                }
            case 'model':
                {
                    const {
                        name,
                        model
                    } = param;
        
                    store.models[name] = model;
                    break;
                }
            default:
                {
                    const {
                        name
                    } = param;
        
                    store.components[name] = param;
                    break;
                }
        }
    },
    addWorker(worker) {
        store.workers.push(worker);
    },
    terminateWorkers() {
        store.workers.forEach(worker => {
            worker.terminate();
        });
    },
    addAbortController(controller) {
        store.abortControllers.push(controller);
    },
    getAbortControllers() {
        return store.abortControllers;
    },
    abortAll() {
        store.abortControllers.forEach(controller => {
            controller.abort();
        });
    },
    get(name) {
        if (store.components[name]) {
            return store.components[name].component;
        } else if (store.lists[name]) {
            return store.lists[name];
        } else if(store.models[name]) {
            return store.models[name];
        } else {
            return undefined;
        }
    },
    getNextId() {
        return `App-${store.elementIdCounter++}`; 
    },
    remove(name) {
        store.components[name].component.remove();
        
        delete store.components[name];
    },
    // register(actionData) {
    //     store.data.push(actionData);
    // },
    // deregister(actionData) {
    //     const index = store.data.indexOf(actionData);

    //     store.data.splice(index, 1);
    // },
    // recall() {
    //     return store.data;
    // },
    empty() {
        store.components = {};
        // TODO: Do we want to persist data when routing?
        // store.data = [];
    },
    user(userInfo) {
        if (typeof userInfo === 'object') {
            store.user = userInfo;
        } else {
            return store.user;
        }
    },
    viewScrollTop(param) {
        if (param == 0) {
            store.viewScrollTop = 0;
        } else if (param) {
            if (typeof param === 'number') {
                store.viewScrollTop = param;
            } else {
                console.log(`${param} is not a number`);
            }
        } else {
            return store.viewScrollTop;
        }
    },
    removeData(name) {
        delete store.data[name];
    },
    setData(name, data) {
        store.data[name] = data;
    },
    getData(name) {
        return store.data[name];
    },
    setRoutes(routes) {
        store.routes = routes;
    },
    routes() {
        return store.routes;
    }
}

Object.freeze(Store);

export { Store }
// @END-File
