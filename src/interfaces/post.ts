import ApprovalStatus from '../misc/approvalstatus';
import Organization from './organization';
import Tag from './tag';
import User from './user';

export default interface Post {
    author: User;
    organization: Organization;
    tags: Array<Tag>;
    status?: ApprovalStatus;
}