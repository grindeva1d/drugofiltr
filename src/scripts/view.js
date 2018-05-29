import friendTemplate from '../templates/friend.hbs';
import { EventEmitter } from 'events';

class View extends EventEmitter {
    constructor() {
        super();

        this.all = document.getElementById('all');
        this.selected = document.getElementById('selected');

        this.all.addEventListener('click', this.handleSelect.bind(this));
        this.selected.addEventListener('click', this.handleUnselect.bind(this));
        this.all.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.selected.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.all.addEventListener('dragover', this.handleDragOver.bind(this));
        this.selected.addEventListener('dragover', this.handleDragOver.bind(this));
        this.all.addEventListener('drop', this.handleDropOnAll.bind(this));
        this.selected.addEventListener('drop', this.handleDropOnSelected.bind(this));

        document.querySelectorAll('.search-input > input[data-list]').forEach(input => input.addEventListener('keyup', this.handleFilter.bind(this)));
    }

    renderItems(items, type = 'all') {
        const html = friendTemplate({ items });
        this[type].innerHTML = html;
    }

    selectFriend(friend, beforeItem) {
        if (friend) {
            const friendItem = this.all.querySelector(`[data-id="${friend.id}"]`);
            const addButton = friendItem.querySelector('button.add-button');

            addButton.textContent = '-';
            this.selected.insertBefore(friendItem, beforeItem);
        }
    }

    unselectFriend(friend, beforeItem) {
        if (friend) {
            const friendItem = this.selected.querySelector(`[data-id="${friend.id}"]`);
            const addButton = friendItem.querySelector('button.add-button');

            addButton.textContent = '+';
            this.all.insertBefore(friendItem, beforeItem);
        }
    }

    handleSelect({ target }) {
        if (target.classList.contains('add-button')) {
            const item = target.parentNode;
            const id = item.dataset.id;

            this.emit('select', id);
        }
    }

    handleUnselect({ target }) {
        if (target.classList.contains('add-button')) {
            const item = target.parentNode;
            const id = item.dataset.id;

            this.emit('unselect', id);
        }
    }

    handleDragStart({ target }) {
        const zone = target.closest('.drag-zone');
        const node = target.closest('.friend');

        if (zone && node) {
            this.currentDrag = { startZone: zone, node: node };
        }
    }

    handleDragOver(event) {
        const zone = event.target.closest('.drag-zone');

        if (zone) {
            event.preventDefault();
        }
    }

    handleDropOnAll(event) {
        if (this.currentDrag) {
            event.preventDefault();

            if (this.currentDrag.startZone !== this.all) {
                const node = event.target.closest('.friend');
                const beforeItem = node ? node.nextElementSibling : this.all.lastElementChild;
                const id = this.currentDrag.node.dataset.id;

                this.emit('unselect', id, beforeItem);
            }

            this.currentDrag = null;
        }
    }

    handleDropOnSelected(event) {
        if (this.currentDrag) {
            event.preventDefault();

            if (this.currentDrag.startZone !== this.selected) {
                const node = event.target.closest('.friend');
                const beforeItem = node ? node.nextElementSibling : this.selected.lastElementChild;
                const id = this.currentDrag.node.dataset.id;

                this.emit('select', id, beforeItem);
            }

            this.currentDrag = null;
        }
    }

    handleFilter({ target }) {
        const value = target.value;
        
        this.emit('filter', value, target.dataset.list);
    }
}

export default View;