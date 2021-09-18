import { isBoolean, isString, isArray, isFunction, isRegExp } from '../utils/common';

export function checkActive(path) {
    var location = window.location;

    if (isBoolean(path)) {
        return path;
    } else if (isFunction(path)) {
        return path(location);
    } else if (isRegExp(path)) {
        return path.test(location.href);
    } else if (isString(path)) {
        const regex = toDynamicPathRegex(path);
        const origin = location.protocol + '//' + location.host;
        const route = location.href.replace(origin, '');
        return regex.test(route);
    } else if (isArray(path)) {
        return path.map(checkActive).some(active => active);
    }
}
/**
 * source from single-spa
 */
function toDynamicPathRegex(path) {
    function appendToRegex(index) {
        const anyCharMaybeTrailingSlashRegex = '[^/]+/?';
        const commonStringSubPath = escapeStrRegex(path.slice(lastIndex, index));
    
        regexStr += inDynamic ? anyCharMaybeTrailingSlashRegex : commonStringSubPath;
        inDynamic = !inDynamic;
        lastIndex = index;
    }

    let lastIndex = 0,
        inDynamic = false,
        regexStr = '^';
  
    for (let charIndex = 0; charIndex < path.length; charIndex++) {
        const char = path[charIndex];
        const startOfDynamic = !inDynamic && char === ':';
        const endOfDynamic = inDynamic && char === '/';
        if (startOfDynamic || endOfDynamic) {
            appendToRegex(charIndex);
        }
    }
  
    appendToRegex(path.length);
  
    return new RegExp(regexStr, 'i');
}

function escapeStrRegex(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}