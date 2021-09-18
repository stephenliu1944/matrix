import { isString, isArray, isObject } from '../utils/common';
/**
 * Loader封装了SystemJS的部分实现
 */
export default class Loader {
    options;
    proxy;
    hooks;
    matrix;
    importCache = {};         
    resolveCache = {};     
        
    constructor(options = {}, matrix) {
        this.options = options;
        this.proxy = options.proxy || window.System;
        this.hooks = options.hooks;
        this.matrix = matrix;
    }

    import(name) {
        var cache = this.importCache;

        if (!cache[name]) {
            cache[name] = this.proxy.import(name);
        }
        
        return cache[name];
    }

    resolve(name) {
        var cache = this.resolveCache;

        if (!cache[name]) {
            cache[name] = this.proxy.resolve(name);
        }
        
        return cache[name];
    }

    async importDependencies(dependencies) {
        if (isString(dependencies)) {
            return this.import(dependencies);
        } else if (isObject(dependencies)) {
            let { scripts = [], styles = [] } = dependencies;
            let entry;  

            // style 异步加载
            styles.map(style => this.import(style));
            // script 有依赖顺序, 所以同步加载, 且最后一个作为 app 的入口文件.
            for (const script of scripts) {
                entry = await this.import(script);
            }
            
            return entry;
        } else if (isArray(dependencies)) {
            return this.importDependencies({ scripts: dependencies });
        }
        throw 'dependencies 不支持的参数类型';
    }
}