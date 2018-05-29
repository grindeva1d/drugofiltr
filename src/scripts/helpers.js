import vk from './vk';

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

export function load() {
    return (async () => {
        try {
            let data = JSON.parse(localStorage.getItem('friends'));
            if (!data) {
                const api = new vk();
                await api.auth();
                let { items } = await api.callAPI('friends.get', { fields: 'city, country, photo_100' });
                data = { all: items };
                save(data);
            }
            return data;
        } catch (e) {
            console.error(e);
        }
    })();
}

export function save(data) {
    localStorage.setItem('friends', JSON.stringify(data));
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