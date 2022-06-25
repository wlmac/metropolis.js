import Organization from "./organization";
import Tag from "./tag";

export default interface User {
    id: number,
    slug: string,
    name: [string, string],
    bio: string,
    timezone: string,
    graduatingYear: number,
    organizations: Array<Organization>;
    following: Array<Tag>;
}
