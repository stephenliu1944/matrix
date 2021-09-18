export function addEventListener(handler) {
    window.addEventListener('hashchange', handler);
    window.addEventListener('popstate', handler); 
    window.addEventListener('statechange', handler);    // statechange是自定义事件
}

export function proxyUpdateState() {
    window.history.pushState = patchedUpdateState(window.history.pushState);
    window.history.replaceState = patchedUpdateState(window.history.replaceState);
}

// 在原有方法上加了一点逻辑, 当URL发生改变后触发自定义 statechange 事件.
export function patchedUpdateState(updateState) {
    return function() {
        const urlBefore = window.location.href;
        const result = updateState.apply(this, arguments);
        const urlAfter = window.location.href;

        if (urlBefore !== urlAfter) {
            dispatchStateChangeEvent(window.history.state);
        }

        return result;
    };
}

export function dispatchStateChangeEvent(state) {
    const STATE_CHANGE = 'statechange';
    var event;
    try {
        event = new CustomEvent(STATE_CHANGE, { 
            bubbles: false,
            cancelable: false,
            detail: state 
        });
    } catch (err) {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(STATE_CHANGE, false, false, state);
    }
    window.dispatchEvent(event);
}
