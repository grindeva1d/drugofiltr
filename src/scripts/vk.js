class vk {
    constructor() {
        this.apiId = 6487703;

        VK.init({
            apiId: this.apiId
        });
    }

    auth() {
        return new Promise((resolve, reject) => {
            VK.Auth.login((response) => {
                if (response.session) {
                    this.session = response.session;
                    resolve(response);
                } else {
                    let message = 'Не удалось авторизоваться.';
                    if (response.status) {
                        message += ` Статус: ${response.status}`;
                    }
                    reject(new Error(message));
                }
            }, 2);
        });
    }

    callAPI(method, settings = {}) {
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
    }
}

export default vk;