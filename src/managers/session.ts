import { default as axios } from 'axios';
import Routes from '../misc/routes';

export default class SessionManager {
    private refreshToken: string = "";
    private accessToken: string = "";
    auth(token: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.refreshToken = token;
            this.refresh().then(() => {
                resolve();
            }).catch(() => { reject() });
        });
    }

    login(username: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(Routes.AUTH.LOGIN, {
                username: username,
                password: password
            }).then(res => {
                if (res.data.refresh && res.data.access) {
                    this.refreshToken = res.data.refresh;
                    this.accessToken = res.data.access;
                    resolve();
                }
                else if (res.data.detail) {
                    reject("Username or password incorrect");
                }
                else {
                    reject("Missing data from server response");
                }
            }).catch(err => {
                reject("Error in request");
            })
        })
    }

    private refresh(): Promise<void> {
        let tmpRefreshToken = this.refreshToken;
        this.refreshToken = "";
        this.accessToken = "";
        return new Promise<void>((resolve, reject) => {
            axios.post(Routes.AUTH.REFRESH, {
                refresh: tmpRefreshToken
            }).then(res => {
                if (res.data.refresh && res.data.access) {
                    this.refreshToken = res.data.refresh;
                    this.accessToken = res.data.access;
                    resolve();
                }
                else if (res.data.detail) {
                    reject("Invalid request");
                }
                else {
                    reject("Invalid response");
                }
            }).catch(err => {
                reject("Error in request");
            })
        })
    }
}