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

export class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(type, callback) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(callback);
    }

    emit(type, ...arg) {
        if (this.events[type]) {
            this.events[type].forEach(callback => callback(arg));
        }
    }
}