import ApprovalStatus from '../misc/approvalstatus';
import User from './user';

export default interface Post {
    author: User;
    //organization: Organization;
    //tags: 
    status?: ApprovalStatus
}