export function useDebounce(fn, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { fn.apply(null, args); }, timeout);
    };
}
