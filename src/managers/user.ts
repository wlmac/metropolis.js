import User from '../interfaces/user';
import Routes from '../misc/routes';
import SessionManager, { RequestMethod } from './session';
import RefOrganization from './reforganization';
import RefTag from './reftag';

/**
 * UserRaw type as defined in {@link https://noi.nyiyui.ca/k/1063/4604#Get_User}.
 */
type UserRaw = {
  id: number;
  slug: string;
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
    slug: r.slug,
    name: [r.first_name, r.last_name],
    bio: r.bio,
    timezone: r.timezone,
    graduatingYear: parseInt(r.graduating_year, 10),
    organizations: r.organizations.map((i) => new RefOrganization(i)),
    following: r.tags_following.map((i) => new RefTag(i)),
  };
}

export default class UserManager {
  private session;
  private cache = new Map<string, { u: User, fetched: Date }>();

  constructor(session: SessionManager) {
    this.session = session;
  }

  async getUser(slug: string): Promise<User> {
    const cachedUser = this.cache.get(slug)
    if (cachedUser !== undefined) {
      const expire = new Date()
      expire.setHours(expire.getHours() + 24)
      if (cachedUser.fetched > expire) {
        return cachedUser.u
      }
    }
    const u = await this.eagerlyGetUser(slug)
    this.cache.set(slug, { u, fetched: new Date() })
    return u
  }

  private eagerlyGetUser(slug: string): Promise<User> {
    return this.session
      .request<UserRaw>(Routes.USER + encodeURI(slug), undefined, RequestMethod.GET, true, true)
      .then((resp) => {
        if (!resp.success) throw new TypeError(resp.error === null ? '' : resp.error);
        if (resp.response === null) throw new TypeError('unreacheable');
        return toUser(resp.response);
      });
  }
}
