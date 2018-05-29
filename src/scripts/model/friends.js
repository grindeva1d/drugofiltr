import Friend from './friend';
import { isMatching, EventEmitter } from '../helpers';

class FriendsList extends EventEmitter {
    constructor({ all, selected }) {
        super();

        this.count = 0;
        this.all = (all || []).map(item => new Friend(item));
        this.selected = (selected || []).map(item => new Friend(item));
    }

    selectFriend(id) {
        const friend = this.all.find(friend => friend.id == id);
        const index = this.all.findIndex(friend => friend.id == id);

        if (index > -1) {
            friend.selected = true;
            this.all.splice(index, 1);   
            this.selected.push(friend);

            this.emit('change', { all: this.all, selected: this.selected });

            return friend;
        }

        return null;
    }

    unselectFriend(id) {
        const friend = this.selected.find(friend => friend.id == id);
        const index = this.selected.findIndex(friend => friend.id == id);

        if (index > -1) {
            friend.selected = false;
            this.selected.splice(index, 1);   
            this.all.push(friend);

            this.emit('change', { all: this.all, selected: this.selected });

            return friend;
        }

        return null;
    }

    filter(value, type) {
        return this[type].filter((item) => isMatching(item.fullName, value));
    }
}

export default FriendsList;