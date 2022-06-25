import { default as axios } from 'axios';
import SessionManager, { RequestMethod, APIResponse } from '../managers/session';
import User from '../interfaces/user';
import Ref from '../interfaces/ref';
import RefOrganization from '../managers/reforganization';
import RefTag from '../managers/reftag';

/**
 * UserRaw type as defined in {@link https://noi.nyiyui.ca/k/1063/4604#Get_User}.
 */
type UserRaw = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    bio: string;
    timezone: string;
    graduating_year: string;
    organizations: number[];
    tags_following: number[];
};

/** Converts {@link UserRaw} to {@link User}. */
function toUser(r: UserRaw): User {
    return {
        id: r.id,
        slug: r.username,
        name: [r.first_name, r.last_name],
        bio: r.bio,
        timezone: r.timezone,
        graduatingYear: parseInt(r.graduating_year, 10),
        organizations: r.organizations.map(i => new RefOrganization(i)),
        following: r.tags_following.map(i => new RefTag(i)),
    }
}

export default class Client {
    private session: SessionManager = new SessionManager();
    constructor() { }

    auth(token: string) {
        return this.session.auth(token);
    }

    login(username: string, password: string) {
        return this.session.login(username, password);
    }

    getUser(username: string): Promise<APIResponse<User>> {
        return this.session.request<UserRaw>(`v3/user/${encodeURI(username)}`, undefined, RequestMethod.GET, true, true)
            .then(resp => {
                if (!resp.success)
                    throw new TypeError(resp.error === null ? "" : resp.error);
                if (resp.response === null)
                    throw new TypeError("unreacheable")
                return new APIResponse(toUser(resp.response)) 
            });
    }
}
