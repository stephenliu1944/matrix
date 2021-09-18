export function initStyles(app) {
    var styles = app?.dependencies?.styles || [];
    styles.forEach(name => initStyle(name, app.getLoader()));
}

export function enableStyles(app) {
    var styles = app?.dependencies?.styles || [];
    styles.forEach(name => enableStyle(name, app.getLoader()));
}

export function disableStyles(app) {
    var styles = app?.dependencies?.styles || [];
    styles.forEach(name => disableStyle(name));
}

export function initStyle(name, loader) {
    var link = document.querySelector(`link[href="${loader.resolve(name)}"]`);
    link.setAttribute('data-module', name);     // 缓存模块名称
    link.enable = true;
}

export function enableStyle(name, loader) {
    var link = document.querySelector(`link[data-module="${name}"]`);
    if (!link.enable) {
        link.href = loader.resolve(name);
        link.enable = true;
    }
}

export function disableStyle(name) {
    var link = document.querySelector(`link[data-module="${name}"]`);
    if (link.enable) {
        link.href = '';
        link.enable = false;
    }
}