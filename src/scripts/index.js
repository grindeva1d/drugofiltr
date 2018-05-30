import FriendsList from './model/friends';
import View from './view';
import Controller from './controller';
import { load, save } from './helpers';
import '../styles/style.css';

(async () => {
    const data = await load();

    const friendsList = new FriendsList(data);
    const view = new View();
    const controller = new Controller(friendsList, view);
})();