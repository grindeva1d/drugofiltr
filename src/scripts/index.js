import Handlebars from 'handlebars';
import 'jquery';
import 'popper.js';
import 'bootstrap';
import '../styles/style.css';
import friendTemplate from '../templates/friend.hbs';

const content = document.querySelector('.content');
const allFriends = document.querySelector('#all-friends');
const allFriendsFilterInput = document.querySelector('#all-friends-filter');
const selectedFriends = document.querySelector('#selected-friends');
const selectedFriendsFilterInput = document.querySelector('#selected-friends-filter');

let friends;

VK.init({
    apiId: 6487703
});

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login((response) => {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
};

function callAPI(method, settings = {}) {
    settings.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, settings, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    });
};

function isMatching(full, chunk) {
    return !!~full.toLowerCase().indexOf(chunk.toLowerCase());
};

function renderFriends(friends, target) {
    const html = friendTemplate(friends);
    target.innerHTML = html;

    target.querySelectorAll('.add-button').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const zone = e.target.closest('.drag-zone');
            const node = e.target.closest('.friend');

            if (zone && node) {
                if (zone.id == 'all-friends') {
                    selectedFriends.insertBefore(node, selectedFriends.lastElementChild);
                    btn.textContent = '-';
                } else {
                    allFriends.insertBefore(node, allFriends.lastElementChild);
                    btn.textContent = '+';
                }
            }
        });
    });
};

(async () => {
    try {
        friends = JSON.parse(localStorage['friends'] || 'null');
        if (!friends) {
            await auth();
            friends = await callAPI('friends.get', { fields: 'city, country, photo_100' });
            localStorage['friends'] = JSON.stringify(friends);
        }
        renderFriends({ items: friends.items.slice(0, 4) }, allFriends);

    } catch (e) {
        console.error(e);
    }
})();

const onKeyUp = (callback) => {
    let timeout;
    return (e) => {
        if (timeout) {
            window.clearTimeout(timeout);
        }

        timeout = setTimeout(() => callback(e), 100);
    };
};

const filterFriends = (value, target) => {
    renderFriends({ items: friends.items.filter((item) => isMatching(item.first_name, value) || isMatching(item.last_name, value)) }, target);
};

allFriendsFilterInput.addEventListener('keyup', onKeyUp((e) => filterFriends(e.target.value, allFriends)));
selectedFriendsFilterInput.addEventListener('keyup', onKeyUp((e) => filterFriends(e.target.value, selectedFriends)));

let currentDrag;

content.addEventListener('dragstart', (e) => {
    const zone = e.target.closest('.drag-zone');

    if (zone) {
        const node = e.target.closest('.friend');
        if (node) {
            currentDrag = { startZone: zone, node: node };
            console.log(currentDrag); 
        }
    }
});

content.addEventListener('dragover', (e) => {
    const zone = e.target.closest('.drag-zone');

    if (zone) {
        e.preventDefault();   
    }
});

content.addEventListener('drop', (e) => {
    if (currentDrag) {
        e.preventDefault();

        const zone = e.target.closest('.drag-zone');

        if (currentDrag.startZone !== zone) {

            const node = e.target.closest('.friend');

            if (node) {
                zone.insertBefore(currentDrag.node, node.nextElementSibling);
            } else {
                zone.insertBefore(currentDrag.node, zone.lastElementChild);
            }

            const btn = currentDrag.node.querySelector('.add-button');

            if (btn) {
                btn.textContent = zone.id == 'all-friends' ? '+' : '-';   
            }
        }

        currentDrag = null;
    }
});