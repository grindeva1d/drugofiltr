import FriendsList from './model/friends';
import View from './view';
import Controller from './controller';
import '../styles/style.css';

const friendsList = new FriendsList();
const view = new View();
const controller = new Controller(friendsList, view);