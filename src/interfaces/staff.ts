import User from "./user";

export default interface Staff extends User {
    staffBio?: string,
    roles: Array<string>
}