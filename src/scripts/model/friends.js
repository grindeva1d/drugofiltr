import Friend from './friend';
import { isMatching } from '../helpers';

class FriendsList {
    constructor() {
        this.count = 0;
        this.all = [];
        this.selected = [];
    }

    setFriends({ count, items }) {
        this.count = count;
        this.all = items.slice(0, 5).map(item => new Friend(item));
    }

    selectFriend(id) {
        const friend = this.all.find(friend => friend.id == id);
        const index = this.all.findIndex(friend => friend.id == id);

        if (index > -1) {
            friend.selected = true;
            this.all.splice(index, 1);   
            this.selected.push(friend);

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

            return friend;
        }

        return null;
    }

    filter(value, type) {
        return this[type].filter((item) => isMatching(item.fullName, value));
    }
}

export default FriendsList;