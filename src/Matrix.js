import { createBatchApps } from './application/factory';
import Router from './router';
import Loader from './loader';

function validateOptions(options) {
    // TODO: 校验数据结构是否正确
    return options;
}

function applyOptionsDefaults(options) {
    // TODO: 1. 初始化数据
    // TODO: 2. 转换为需要的/统一的数据结构便于后续判断处理
    return options;
}

export default class Matrix {
    options;
    applications;
    router;
    loader;
    props;                  // 全局属性
    hooks;                  

    constructor(options = {}) {
        validateOptions(options);
        this.options = applyOptionsDefaults(options);
        var { applications, router, loader, props, hooks } = this.options;

        this.loader = new Loader(loader, this);
        this.router = new Router(router, this);
        this.applications = createBatchApps(applications, this);
        this.props = props;
        this.hooks = initHooks(hooks);
    }
    
    getLoader() {
        return this.loader;
    }
    
    getRouter() {
        return this.router;
    }

    getApplications() {
        return this.applications;
    }

    setProps(nextProps) {
        // TODO: 未完成
        // this.hooks.propsChange(nextProps, this.props);
        // this.props = nextProps;
    }

    start() {
        this.router.route();
    }
}