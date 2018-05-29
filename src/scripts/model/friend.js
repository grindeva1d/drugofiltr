class Friend {
    constructor(data) {
        this.selected = false;

        Object.keys(data).forEach(prop => { this[prop] = data[prop]; });
    }

    get fullName() {
        return `${this.first_name} ${this.last_name}`;
    }
}

export default Friend;