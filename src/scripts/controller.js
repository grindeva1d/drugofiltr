import vk from './vk';

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.api = new vk();

        (async () => {
            try {
                let saveData = JSON.parse(localStorage['friends'] || 'null');
                if (!saveData) {
                    await this.api.auth();
                    saveData = await this.api.callAPI('friends.get', { fields: 'city, country, photo_100' });
                    localStorage['friends'] = JSON.stringify(saveData);
                }
                this.model.setFriends(saveData);
                this.view.renderItems(this.model.all);

            } catch (e) {
                console.error(e);
            }
        })();

        this.view.on('select', this.selectFriend.bind(this));
        this.view.on('unselect', this.unselectFriend.bind(this));
        this.view.on('filter', this.filter.bind(this));
    }

    selectFriend(id, beforeItem) {
        const selectedItem = this.model.selectFriend(id);

        this.view.selectFriend(selectedItem, beforeItem);
    }

    unselectFriend(id, beforeItem) {
        const unselectedItem = this.model.unselectFriend(id);

        this.view.unselectFriend(unselectedItem, beforeItem);
    }

    filter(value, type) {
        const filtered = this.model.filter(value, type);

        this.view.renderItems(filtered, type);
    }
}

export default Controller;