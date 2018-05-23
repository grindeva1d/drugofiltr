import Handlebars from 'handlebars';
import './styles/style.css';

const friendTemplate = `<div class="friends">
                            {{#each items}}
                            <div class="friend">
                                <img src="{{photo_100}}"/>
                                <div>{{first_name}} {{last_name}}</div>
                            </div>
                            {{/each}}
                        </div>`;

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

(async () => {
    try {
        await auth();

        const friends = await callAPI('friends.get', { fields: 'city, country, photo_100' });
        const template = friendTemplate;
        console.log(template);
        const render = Handlebars.compile(template);
        const html = render(friends);
        const results = document.querySelector('#all-friends');

        console.log(friends);
        results.innerHTML = html;
    } catch (e) {
        console.error(e);
    }
})();