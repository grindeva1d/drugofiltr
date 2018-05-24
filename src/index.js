import Handlebars from 'handlebars';
import './styles/style.css';

const friendTemplate = `<div class="friends">
                            {{#each items}}
                            <div class="friend" draggable="true">
                                <img src="{{photo_100}}" />
                                <div>{{first_name}} {{last_name}}</div>
                                <button>+</button>
                            </div>
                            {{/each}}
                        </div>`;

const friendRender = Handlebars.compile(friendTemplate);

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
    const html = friendRender(friends);
    target.innerHTML = html;
};

(async () => {
    try {
        friends = JSON.parse(localStorage['friends'] || 'null');
        if (!friends) {
            await auth();
            friends = await callAPI('friends.get', { fields: 'city, country, photo_100' });
            localStorage['friends'] = JSON.stringify(friends);
        }
        renderFriends(friends, allFriends);

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
    const zone = getCurrentZone(e.target);

    if (zone) {
        currentDrag = { startZone: zone, node: e.target };  
    }
});

content.addEventListener('dragover', (e) => {
    const zone = getCurrentZone(e.target);

    if (zone) {
        e.preventDefault();   
    }
});

content.addEventListener('drop', (e) => {
    if (currentDrag) {
        const zone = getCurrentZone(e.target);   

        e.preventDefault();

        if (currentDrag.startZone !== zone) {
            if (e.target.classList.contains('friend')) {
                console.log("1");
                zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
                console.log("2");
            } else {
                zone.insertBefore(currentDrag.node, zone.lastElementChild);
            }
        }

        currentDrag = null;
    }
});

function getCurrentZone(target) {
    let zone = target;
    do {
        if (zone.classList.contains('drag-zone'))
            return zone;
        zone = zone.parentElement;
    } while (zone.parentElement);
    return null;
};