import Organization from "./organization";

export default interface User {
    id: number,
    slug: string,
    name: [string, string],
    bio: string,
    timezone: string,
    graduatingYear: number,
    organizations: Array<Organization>;
    following: Array<Organization>;
}