import { checkActive } from './helper';
import { initHooks, handleHooks } from '../hook';
import { initStyles, enableStyles, disableStyles } from '../dom';
import { LOAD_ERROR, UNINITIALIZED, INITIALIZED, INITIALIZE_ERROR, MOUNTED, MOUNT_ERROR, UNMOUNTED, UNMOUNT_ERROR } from './status';

export default class Application {
    matrix;
    options;
    name;
    path;
    props;
    status;
    hooks;
    dependencies;
    microApp;

    constructor(options, matrix) {        
        this.options = options;
        this.name = options.name;
        this.path = options.path;
        this.props = options.props;
        this.dependencies = options.dependencies;
        this.status = UNINITIALIZED;
        this.matrix = matrix;
        this.hooks = initHooks(options.hooks, {
            beforeLoad: [],
            afterLoad: [],
            beforeInit: [initStyles],      
            afterInit: [],
            beforeMount: [enableStyles],     
            afterMount: [],
            beforeUnmount: [disableStyles],  
            afterUnmount: [], 
            onError: []
        });
    }
    
    getLoader() {
        return this.matrix.getLoader();
    }

    shouldActive() {
        return checkActive(this.path);
    }
    
    isUninitialized() {
        return this.status === UNINITIALIZED;
    }
    
    isMounted() {
        return this.status === MOUNTED;
    }

    isNotMounted() {
        return this.status !== MOUNTED;
    }

    handleError(error) {
        let { onError } = this.hooks;
        handleHooks(onError, null, error, this);
    }

    async loadDependencies() {
        var microApp;
        var { beforeLoad, afterLoad } = this.hooks;
        try {
            await handleHooks(beforeLoad, null, this);
            microApp = await this.getLoader().importDependencies(this.dependencies);
            await handleHooks(afterLoad, null, this);
        } catch (error) {
            console.error(error);
            this.status = LOAD_ERROR;
            throw `${this.name} application load error`;
        }
    
        return microApp;
    }
    
    async init() {
        var { beforeInit, afterInit } = this.hooks;
        this.microApp = await this.loadDependencies();

        try {
            await handleHooks(beforeInit, null, this);            
            await this.microApp.init && this.microApp.init(this);
            await handleHooks(afterInit, null, this);
            this.status = INITIALIZED;
        } catch (error) {
            console.error(error);
            this.status = INITIALIZE_ERROR;    
            throw `${this.name} application init error`;
        }
    }
    
    async mount() {
        var { beforeMount, afterMount } = this.hooks;

        try {
            await handleHooks(beforeMount, null, this);
            await this.microApp.mount && this.microApp.mount(this);
            await handleHooks(afterMount, null, this);
            this.status = MOUNTED;
        } catch (error) {
            console.error(error);
            this.status = MOUNT_ERROR;    
            throw `${this.name} application mount error`;
        }
    }
    
    async unmount() {
        var { beforeUnmount, afterUnmount } = this.hooks;

        try {
            await handleHooks(beforeUnmount, null, this);
            await this.microApp.unmount && this.microApp.unmount(this);
            await handleHooks(afterUnmount, null, this);
            this.status = UNMOUNTED;
        } catch (error) {
            this.status = UNMOUNT_ERROR;    
            throw `${this.name} application unmount error`;
        }        
    }
    
    destroy() {
        // TODO: 清除缓存
    }
}
