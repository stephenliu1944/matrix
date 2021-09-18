import { isFunction, isArray } from '../utils/common';

export function initHooks(hooks = {}, defaultHooks = {}) {
    return applyHooksDefaults(hooks, defaultHooks);
}

export function applyHooksDefaults(hooks = {}, defaultHooks = {}) {
    Object.keys(defaultHooks).forEach((key) => {
        var hook = hooks[key];
        if (isArray(hook)) {
            defaultHooks[key].concat(hook);
        } else if (isFunction(hook)) {
            defaultHooks[key].push(hook);
        }
    });
    
    return defaultHooks;
}

// 按顺序依次执行 Hooks
export async function handleHooks() {
    var [hooks = [], context, ...args] = arguments;
    var hookList = isFunction(hooks) ? [hooks] : hooks;
    var result;

    for (const hook of hookList) {
        result = await hook.call(context, ...args);
    }

    return result;
}

// 按顺序依次执行 Hooks
export function bindHook(hooks, context, args) {
    Object.keys(hooks).forEach((key) => {
        hooks[key] = bindHooks(hooks[key], context, args);
    });
}

export function bindHooks() {
    var [hooks, app, ...args] = arguments;
    var hookList = isFunction(hooks) ? [hooks] : hooks;
    
    return hookList.map((hook) => hook.bind(null, context, ...args));
}