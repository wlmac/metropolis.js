import { default as axios } from 'axios';
import SessionManager from '../managers/session';

export default class Client {
    private session: SessionManager = new SessionManager();
    constructor() { }

    auth(token: string) {
        return this.session.auth(token);
    }

    login(username: string, password: string) {
        return this.session.login(username, password);
    }

}