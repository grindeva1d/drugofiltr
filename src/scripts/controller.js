import { load, save } from './helpers';

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.on('select', this.selectFriend.bind(this));
        this.view.on('unselect', this.unselectFriend.bind(this));
        this.view.on('filter', this.filter.bind(this));

        this.view.renderItems(this.model.all, 'all');
        this.view.renderItems(this.model.selected, 'selected');
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