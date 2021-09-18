import { addEventListener, proxyUpdateState } from './helper';

export default class Router {
    options;
    matrix;
    applications;
    hooks;

    constructor(options = {}, matrix) {
        this.options = options;        
        this.matrix = matrix;        
        this.hooks = options.hooks;
        addEventListener(this.route);
        proxyUpdateState();
    }
    // TODO: 优化, 触发hashchange也会同时触发popstate事件, 会执行2次
    route = (event) => {
        this.matrix.getApplications().forEach((app) => {
            try {                
                if (app.shouldActive()) {                    
                    if (app.isNotMounted()) {
                        // 1. app init
                        var promise = app.isUninitialized() ? app.init() : Promise.resolve();
                        // 2. app mount
                        promise.then(() => app.mount());
                    }
                } else if (app.isMounted()) {
                    // 3. app unmount
                    app.unmount();
                }
            } catch (error) {
                console.error(error);
                app.handleError(error);
            }
        });
    }
}