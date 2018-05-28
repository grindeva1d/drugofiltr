export function resizeWindow() {
    console.log(1);
};

export function isMatching(full, chunk) {
    return full.toLowerCase().includes(chunk.toLowerCase());
};

export function delay(callback, ms = 100) {
    let timeout;
    return (e) => {
        if (timeout) {
            window.clearTimeout(timeout);
        }

        timeout = setTimeout(() => callback(e), ms);
    };
}